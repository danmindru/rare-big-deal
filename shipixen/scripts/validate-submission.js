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
  return { ok: true, paths, products: productMediaOverrides(source, paths) };
}

function tokenizeOverrideSource(source) {
  const tokens = [];
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }
    if (ch === '/' && source[i + 1] === '/') {
      i += 2;
      while (i < source.length && source[i] !== '\n') i += 1;
      continue;
    }
    if (ch === '/' && source[i + 1] === '*') {
      i += 2;
      const end = source.indexOf('*/', i);
      i = end === -1 ? source.length : end + 2;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const quote = ch;
      i += 1;
      let value = '';
      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\' && i + 1 < source.length) {
          value += source[i + 1];
          i += 2;
          continue;
        }
        value += source[i];
        i += 1;
      }
      i += 1;
      tokens.push({ type: 'string', value });
      continue;
    }
    if (/[A-Za-z_$]/.test(ch)) {
      let value = '';
      while (i < source.length && /[A-Za-z0-9_$-]/.test(source[i])) {
        value += source[i];
        i += 1;
      }
      tokens.push({ type: 'ident', value });
      continue;
    }
    if ('{}[]:,.'.includes(ch)) {
      tokens.push({ type: 'punct', value: ch });
      i += 1;
      continue;
    }
    i += 1;
  }
  return tokens;
}

// Paths already accepted by the safe scan, keyed by product slug. ogImages[0]
// is the banner when both forms are present, matching the asset fetcher.
function productMediaOverrides(source, listedPaths) {
  const listed = new Set(listedPaths);
  const products = {};
  const tokens = tokenizeOverrideSource(source);
  let brace = 0;
  let bracket = 0;
  let overridesBrace = null;
  let product = null;
  let productBrace = null;
  let pendingKey = null;
  let ogImagesBracket = null;

  const assign = (role, value) => {
    if (!product || typeof value !== 'string' || !listed.has(value)) return;
    if (!products[product]) products[product] = {};
    if (role === 'logo') {
      products[product].logo = value;
      return;
    }
    if (products[product].bannerSource === 'ogImages' && role === 'ogImage') return;
    products[product].banner = value;
    products[product].bannerSource = role;
  };

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.type === 'punct') {
      if (token.value === '{') {
        brace += 1;
        if (pendingKey === 'overrides' && overridesBrace == null) {
          overridesBrace = brace;
        } else if (
          overridesBrace != null &&
          product == null &&
          pendingKey &&
          brace === overridesBrace + 1
        ) {
          product = sanitizeName(pendingKey);
          productBrace = brace;
          products[product] = {};
        }
        pendingKey = null;
      } else if (token.value === '}') {
        if (productBrace != null && brace === productBrace) {
          product = null;
          productBrace = null;
        }
        brace -= 1;
        if (overridesBrace != null && brace < overridesBrace) overridesBrace = null;
        pendingKey = null;
      } else if (token.value === '[') {
        bracket += 1;
        if (product && pendingKey === 'ogImages' && ogImagesBracket == null) ogImagesBracket = bracket;
        pendingKey = null;
      } else if (token.value === ']') {
        if (ogImagesBracket === bracket) ogImagesBracket = null;
        bracket -= 1;
      } else if (token.value === ',') {
        pendingKey = null;
      }
      continue;
    }

    const next = tokens[index + 1];
    if (next && next.type === 'punct' && next.value === ':') {
      pendingKey = token.value;
      continue;
    }
    if (product && pendingKey === 'logo') assign('logo', token.value);
    else if (product && pendingKey === 'ogImage') assign('ogImage', token.value);
    else if (
      product &&
      token.type === 'string' &&
      ogImagesBracket != null &&
      products[product] &&
      products[product].bannerSource !== 'ogImages'
    ) {
      assign('ogImages', token.value);
    }
    pendingKey = null;
  }

  for (const slug of Object.keys(products)) {
    delete products[slug].bannerSource;
    if (typeof products[slug].logo !== 'string') delete products[slug].logo;
    if (typeof products[slug].banner !== 'string') delete products[slug].banner;
    if (!products[slug].logo && !products[slug].banner) delete products[slug];
  }
  return products;
}

async function inspectDocumentedMedia(check, overridePath, overrideRoot) {
  if (typeof overridePath !== 'string' || overridePath.includes('..') || path.isAbsolute(overridePath)) {
    return {
      check,
      status: 'fail',
      reason: `Override path ${overridePath} has to stay inside the repository.`,
    };
  }
  if (!overrideRoot) {
    return {
      check,
      status: 'fail',
      reason: `Override image ${overridePath} is missing.`,
    };
  }
  const filePath = path.resolve(overrideRoot, overridePath);
  if (!insideRoot(overrideRoot, filePath) || !fs.existsSync(filePath)) {
    return {
      check,
      status: 'fail',
      reason: `Override image ${overridePath} is missing.`,
    };
  }
  const inspection = await inspectMediaFile(filePath, check === 'logo' ? 'logo' : 'banner');
  return {
    check,
    status: inspection.ok ? 'pass' : 'fail',
    reason: inspection.reason,
  };
}

// Included files under images/product/<slug>/ stay the historical bytes when an
// archive page still serves them. A documented logo or ogImage override is the
// live file the logo and banner checks have to accept.
async function inspectProductMedia(row, mediaRoot, overrideContext) {
  const slug = sanitizeName(row.name);
  const documented =
    (overrideContext && overrideContext.products && overrideContext.products[slug]) || {};
  const historical = await inspectIncludedProductMedia(row, mediaRoot);
  if (typeof documented.logo !== 'string' && typeof documented.banner !== 'string') return historical;
  const findings = [];
  for (const item of historical) {
    const overridePath = item.check === 'logo' ? documented.logo : documented.banner;
    if (typeof overridePath !== 'string') {
      findings.push(item);
      continue;
    }
    findings.push(
      await inspectDocumentedMedia(item.check, overridePath, overrideContext && overrideContext.overrideRoot),
    );
  }
  return findings;
}

async function inspectIncludedProductMedia(row, mediaRoot) {
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

  let overrideContext = { products: {}, overrideRoot: options.overrideRoot || null };
  if (options.overridesSource != null) {
    const overrides = inspectOverrideSource(options.overridesSource);
    if (!overrides.ok) {
      failures.push({ code: 'override', message: overrides.reason, line: 1 });
    } else {
      overrideContext = {
        products: overrides.products || {},
        overrideRoot: options.overrideRoot || null,
      };
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
      const media = await inspectProductMedia(row, options.mediaRoot, overrideContext);
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
