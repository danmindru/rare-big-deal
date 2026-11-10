const fs = require('fs');
const path = require('path');
const { assessEligibility } = require('./lib/eligibility');
const { machineRecord, upsertRecord } = require('./lib/evidence-record');
const { inspectMediaFile } = require('./lib/media-bytes');
const { compareCatalogs, parseCatalog } = require('./lib/readme-catalog');
const { sanitizeName } = require('./sanitize-name');

const TREE_PATH = path.join(__dirname, '..', 'catalog', 'catalog-tree.json');
const README_PATH = path.join(__dirname, '..', '..', 'README.md');

function todayUtc(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function headingSnapshot(catalog) {
  return catalog.headings.map((heading) => ({
    level: heading.level,
    text: heading.text,
  }));
}

function loadTree() {
  return JSON.parse(fs.readFileSync(TREE_PATH, 'utf8'));
}

function checkTree(catalog, tree) {
  const actual = headingSnapshot(catalog);
  const expected = tree.headings || [];
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    return {
      ok: false,
      message: 'README headings do not match shipixen/catalog/catalog-tree.json.',
    };
  }
  return { ok: true };
}

function insideRoot(root, candidate) {
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(candidate);
  const relative = path.relative(resolvedRoot, resolved);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function inspectOverrideSource(source) {
  if (source.includes('${') || source.includes('`')) {
    return { ok: false, reason: 'override file has to stay plain path data' };
  }
  if (/\b(eval|Function|require|import|process|child_process)\b/.test(source)) {
    return { ok: false, reason: 'override file has to stay plain path data' };
  }
  const paths = [];
  const pattern = /['"]([^'"]+\.(?:png|jpe?g|webp|gif|ico))['"]/gi;
  let match = pattern.exec(source);
  while (match) {
    paths.push(match[1]);
    match = pattern.exec(source);
  }
  return { ok: true, paths };
}

async function inspectProductMedia(row, mediaRoot) {
  if (!mediaRoot || !fs.existsSync(mediaRoot)) {
    return [
      {
        check: 'logo',
        status: 'pending-trusted-generation',
        reason: 'README-only submission. The logo is fetched in the trusted generator, not from fork CI.',
      },
      {
        check: 'banner',
        status: 'pending-trusted-generation',
        reason:
          'README-only submission. The banner, or a screenshot of the website when the banner is missing, is created in the trusted generator.',
      },
    ];
  }
  const dir = path.join(mediaRoot, sanitizeName(row.name));
  if (!insideRoot(mediaRoot, dir) || !fs.existsSync(dir)) {
    return [
      {
        check: 'logo',
        status: 'pending-trusted-generation',
        reason: 'No logo file was included. The trusted generator still has to fetch one.',
      },
      {
        check: 'banner',
        status: 'pending-trusted-generation',
        reason: 'No banner file was included. The trusted generator still has to fetch or capture one.',
      },
    ];
  }
  const findings = [];
  for (const [check, fileName] of [
    ['logo', 'logo.png'],
    ['banner', 'og-image.png'],
  ]) {
    const filePath = path.join(dir, fileName);
    if (!fs.existsSync(filePath)) {
      findings.push({
        check,
        status: 'pending-trusted-generation',
        reason: `${fileName} was not included for ${row.name}.`,
      });
      continue;
    }
    const inspection = await inspectMediaFile(filePath, check === 'logo' ? 'logo' : 'banner');
    findings.push({
      check,
      status: inspection.ok ? 'pass' : 'fail',
      reason: inspection.reason,
    });
  }
  return findings;
}

function checksFromFindings(findings) {
  const checks = {};
  for (const finding of findings) {
    checks[finding.check] = { status: finding.status, reason: finding.reason };
  }
  return checks;
}

async function validateSubmission(options) {
  const today = options.today || todayUtc();
  const compared = compareCatalogs(options.baseMarkdown, options.headMarkdown);
  const failures = compared.findings.map((finding) => ({
    code: finding.code,
    message: finding.message,
    line: finding.line,
  }));
  const warnings = [];
  const records = [];
  const bindingBase = {
    pullRequest: options.pullRequest ?? null,
    headSha: options.headSha || null,
    checkedOn: today,
  };

  if (options.tree) {
    const tree = checkTree(compared.head, options.tree);
    if (!tree.ok) {
      failures.push({ code: 'tree', message: tree.message, line: 1 });
    }
  }

  if (options.overridesSource != null) {
    const overrides = inspectOverrideSource(options.overridesSource);
    if (!overrides.ok) {
      failures.push({ code: 'override', message: overrides.reason, line: 1 });
    } else {
      for (const overridePath of overrides.paths) {
        if (overridePath.includes('..') || path.isAbsolute(overridePath)) {
          failures.push({
            code: 'override',
            message: `Override path ${overridePath} has to stay inside the repository.`,
            line: 1,
          });
          continue;
        }
        if (options.overrideRoot) {
          const filePath = path.resolve(options.overrideRoot, overridePath);
          if (!insideRoot(options.overrideRoot, filePath) || !fs.existsSync(filePath)) {
            failures.push({
              code: 'override',
              message: `Override image ${overridePath} is missing.`,
              line: 1,
            });
            continue;
          }
          const role = /logo/i.test(path.basename(overridePath)) ? 'logo' : 'banner';
          const inspection = await inspectMediaFile(filePath, role);
          if (!inspection.ok) {
            failures.push({
              code: 'override',
              message: `Override image ${overridePath}: ${inspection.reason}`,
              line: 1,
            });
          }
        }
      }
    }
  }

  const catalogChecks = {};
  for (const failure of failures) {
    if (failure.code === 'reorder' || failure.code === 'insert') catalogChecks.order = { status: 'fail', reason: failure.message };
    if (failure.code === 'duplicate') catalogChecks.duplicate = { status: 'fail', reason: failure.message };
    if (failure.code === 'tree' || failure.code === 'header') catalogChecks.format = { status: 'fail', reason: failure.message };
  }
  if (options.recordCatalog && (failures.length > 0 || options.headSha)) {
    records.push(
      machineRecord(
        { ...bindingBase, product: '*', category: '*', subcategory: '' },
        {
          order: catalogChecks.order || { status: 'pass', reason: 'Existing rows kept their order. New rows are at the bottom.' },
          duplicate: catalogChecks.duplicate || { status: 'pass', reason: 'No category lists the same product twice.' },
          format: catalogChecks.format || { status: 'pass', reason: 'The category tree and table shape match the catalog.' },
          ...checksFromFindings([]),
        },
      ),
    );
  }

  for (const change of compared.changes) {
    for (const removed of change.removed) {
      warnings.push({
        code: 'removed',
        message: `${change.category} / ${change.subcategory}: "${removed.name}" was removed.`,
        line: removed.line,
      });
    }
    for (const row of [...change.added, ...change.edited]) {
      const eligibility = assessEligibility(row, today);
      const media = await inspectProductMedia(row, options.mediaRoot);
      const findings = [...eligibility, ...media];
      for (const finding of findings) {
        const item = {
          code: finding.check,
          message: `${row.name} (${change.category} / ${change.subcategory}): ${finding.reason}`,
          line: row.line,
        };
        if (finding.status === 'fail') failures.push(item);
        else if (finding.status !== 'pass') warnings.push(item);
      }
      if (options.recordCatalog !== false && options.headSha) {
        records.push(
          machineRecord(
            {
              ...bindingBase,
              product: row.name,
              category: row.category,
              subcategory: row.subcategory,
            },
            checksFromFindings(findings),
            { website: row.website },
          ),
        );
      }
    }
  }

  return { failures, warnings, records, today };
}

function parseArgs(argv) {
  const out = { self: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--self') out.self = true;
    else if (arg === '--base') out.base = argv[++i];
    else if (arg === '--head') out.head = argv[++i];
    else if (arg === '--pr') out.pullRequest = Number(argv[++i]);
    else if (arg === '--sha') out.headSha = argv[++i];
    else if (arg === '--today') out.today = argv[++i];
    else if (arg === '--media-root') out.mediaRoot = argv[++i];
    else if (arg === '--overrides') out.overrides = argv[++i];
    else if (arg === '--evidence') out.evidence = argv[++i];
    else if (arg === '--ledger') out.ledger = argv[++i];
    else throw new Error(`unknown argument ${arg}`);
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const basePath = args.base || README_PATH;
  const headPath = args.self ? basePath : args.head;
  if (!headPath) throw new Error('pass --head or --self');
  const baseMarkdown = fs.readFileSync(basePath, 'utf8');
  const headMarkdown = fs.readFileSync(headPath, 'utf8');
  const overridesFile =
    args.overrides && fs.existsSync(args.overrides)
      ? args.overrides
      : args.self
        ? path.join(__dirname, '..', 'data', 'config', 'product-overrides.js')
        : null;
  const overridesSource = overridesFile ? fs.readFileSync(overridesFile, 'utf8') : null;
  const result = await validateSubmission({
    baseMarkdown,
    headMarkdown,
    today: args.today,
    pullRequest: args.pullRequest,
    headSha: args.headSha || (args.self ? 'live' : null),
    mediaRoot: args.mediaRoot,
    overridesSource,
    overrideRoot: overridesFile ? path.resolve(path.dirname(overridesFile), '..', '..') : null,
    tree: args.self ? loadTree() : null,
    recordCatalog: Boolean(args.headSha) || args.self,
  });

  if (args.evidence) {
    fs.mkdirSync(path.dirname(args.evidence), { recursive: true });
    fs.writeFileSync(
      args.evidence,
      `${JSON.stringify({ schemaVersion: 1, generatedOn: result.today, records: result.records }, null, 2)}\n`,
    );
  }
  if (args.ledger) {
    const { emptyLedger } = require('./evidence-record');
    const ledger = fs.existsSync(args.ledger)
      ? JSON.parse(fs.readFileSync(args.ledger, 'utf8'))
      : emptyLedger();
    for (const record of result.records) upsertRecord(ledger, record);
    fs.writeFileSync(args.ledger, `${JSON.stringify(ledger, null, 2)}\n`);
  }

  console.log(
    `[validate-submission] ${result.failures.length} failure(s), ${result.warnings.length} item(s) for a person`,
  );
  for (const failure of result.failures) console.error(`- ${failure.message}`);
  for (const warning of result.warnings) console.log(`- review: ${warning.message}`);
  if (result.failures.length > 0) process.exit(1);
}

module.exports = {
  README_PATH,
  TREE_PATH,
  checkTree,
  headingSnapshot,
  inspectOverrideSource,
  parseCatalog,
  todayUtc,
  validateSubmission,
};

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
