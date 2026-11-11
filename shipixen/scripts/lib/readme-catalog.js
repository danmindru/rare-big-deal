const { vetUrlSyntax } = require('./public-address');

const EXPECTED_HEADER = ['', 'Name', 'Description', 'Deal', 'Expires on date'];
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

function cells(line) {
  const parts = line.split('|').map((part) => part.trim());
  if (parts[0] === '') parts.shift();
  if (parts[parts.length - 1] === '') parts.pop();
  return parts;
}

function isSeparator(row) {
  return row.length > 0 && row.every((cell) => /^:?-+:?$/.test(cell));
}

function normalizeUrl(raw) {
  const url = new URL(raw);
  url.hash = '';
  url.hostname = url.hostname.toLowerCase();
  for (const key of [...url.searchParams.keys()]) {
    if (key.toLowerCase().startsWith('utm_') || key === 'ref' || key === 'via') {
      url.searchParams.delete(key);
    }
  }
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
  }
  return url.toString();
}

function rowKey(row) {
  return `${row.name.trim().toLowerCase()} ${normalizeUrl(row.website)}`;
}

function sameCells(left, right) {
  return left.length === right.length && left.every((cell, index) => cell === right[index]);
}

function isDealHeader(row) {
  return sameCells(row, EXPECTED_HEADER);
}

function isNearDealHeader(row) {
  const text = row.join(' ').toLowerCase();
  return text.includes('name') || text.includes('deal') || text.includes('expires');
}

function parseCatalog(markdown) {
  const lines = markdown.split(/\r?\n/);
  const headings = [];
  const tables = [];
  const formatErrors = [];
  let category = null;
  let subcategory = null;
  let current = null;

  const finish = () => {
    current = null;
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const lineNo = index + 1;
    if (line.startsWith('## ')) {
      category = line.slice(3).trim();
      subcategory = null;
      headings.push({ level: 2, text: category, line: lineNo });
      finish();
      continue;
    }
    if (line.startsWith('### ')) {
      subcategory = line.slice(4).trim();
      headings.push({ level: 3, text: subcategory, line: lineNo, category });
      finish();
      continue;
    }
    if (!line.startsWith('|')) {
      if (line.trim() === '') finish();
      continue;
    }
    const row = cells(line);
    if (!current) {
      current = { category, subcategory, header: null, rows: [], line: lineNo, ignoring: false };
    }
    if (current.ignoring) continue;
    if (isSeparator(row)) continue;
    if (!current.header) {
      current.header = row;
      if (isDealHeader(row)) {
        tables.push(current);
      } else if (isNearDealHeader(row)) {
        formatErrors.push({
          line: lineNo,
          code: 'header',
          message: `Line ${lineNo}: table header must stay "| | Name | Description | Deal | Expires on date |".`,
        });
        current.ignoring = true;
      } else {
        current.ignoring = true;
      }
      continue;
    }
    if (!category) {
      formatErrors.push({
        line: lineNo,
        code: 'placement',
        message: `Line ${lineNo}: a deal row has to sit inside a category.`,
      });
      continue;
    }
    if (row.length !== 5) {
      formatErrors.push({
        line: lineNo,
        code: 'columns',
        message: `Line ${lineNo}: a deal row needs emoji, name and link, description, deal, and expiry.`,
      });
      continue;
    }
    const link = row[1].match(LINK);
    if (!link) {
      formatErrors.push({
        line: lineNo,
        code: 'link',
        message: `Line ${lineNo}: the name cell has to be a markdown link, [Name](https://example.com).`,
      });
      continue;
    }
    const parsed = {
      line: lineNo,
      emoji: row[0],
      name: link[1].trim(),
      website: link[2].trim(),
      description: row[2].trim(),
      deal: row[3].trim(),
      expires: row[4].trim(),
      category,
      subcategory,
    };
    if (!parsed.name) {
      formatErrors.push({
        line: lineNo,
        code: 'name',
        message: `Line ${lineNo}: the product name is empty.`,
      });
      continue;
    }
    if (!parsed.description) {
      formatErrors.push({
        line: lineNo,
        code: 'description',
        message: `Line ${lineNo}: the description is empty.`,
      });
      continue;
    }
    try {
      vetUrlSyntax(parsed.website);
    } catch (error) {
      formatErrors.push({
        line: lineNo,
        code: 'website',
        message: `Line ${lineNo}: ${parsed.name} link is not a public http(s) address (${error.message}).`,
      });
      continue;
    }
    current.rows.push(parsed);
  }

  return { headings, tables, formatErrors };
}

function headingKey(heading) {
  return `${heading.level}:${heading.text}`;
}

function tableKey(table) {
  return `${table.category || ''}\n${table.subcategory || ''}`;
}

function indexTables(tables) {
  const map = new Map();
  for (const table of tables) {
    const key = tableKey(table);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(...table.rows);
  }
  return map;
}

function compareCatalogs(baseMarkdown, headMarkdown) {
  const base = parseCatalog(baseMarkdown);
  const head = parseCatalog(headMarkdown);
  const findings = [...head.formatErrors];
  const baseHeadings = base.headings.map(headingKey);
  const headHeadings = head.headings.map(headingKey);
  if (baseHeadings.join('\n') !== headHeadings.join('\n')) {
    const length = Math.max(baseHeadings.length, headHeadings.length);
    let mismatch = 'the category tree changed';
    for (let i = 0; i < length; i += 1) {
      if (baseHeadings[i] !== headHeadings[i]) {
        mismatch = `heading ${i + 1} is "${headHeadings[i] || '(missing)'}", the catalog has "${baseHeadings[i] || '(end)'}"`;
        break;
      }
    }
    findings.push({
      line: head.headings[0]?.line || 1,
      code: 'tree',
      message: `The category and subcategory tree has to stay as it is (${mismatch}).`,
    });
  }

  const baseMap = indexTables(base.tables);
  const headMap = indexTables(head.tables);
  const changes = [];

  for (const [key, baseRows] of baseMap) {
    const headRows = headMap.get(key) || [];
    const [category, subcategory] = key.split('\n');
    const label = subcategory ? `${category} / ${subcategory}` : category || '(no category)';
    const seen = new Map();
    const duplicateLines = [];
    for (const row of headRows) {
      let url = row.website;
      try {
        url = normalizeUrl(row.website);
      } catch {
        // Keep the raw link when it is not a URL. Format checks report that separately.
      }
      const ids = [`name:${row.name.trim().toLowerCase()}`, `url:${url}`];
      const previous = ids.map((id) => seen.get(id)).find(Boolean);
      if (previous) {
        duplicateLines.push([previous.line, row.line, row.name]);
      }
      for (const id of ids) {
        if (!seen.has(id)) seen.set(id, row);
      }
    }
    for (const [first, second, name] of duplicateLines) {
      findings.push({
        line: second,
        code: 'duplicate',
        message: `${label}: "${name}" is listed more than once in this category (lines ${first} and ${second}). The same product may be listed in a different category.`,
      });
    }

    const baseKeys = [];
    const baseByKey = new Map();
    for (const row of baseRows) {
      try {
        const id = rowKey(row);
        if (!baseByKey.has(id)) {
          baseKeys.push(id);
          baseByKey.set(id, row);
        }
      } catch {
        // A broken historical link is reported from the head parse, not from order.
      }
    }
    const headKeys = headRows.map((row) => {
      try {
        return rowKey(row);
      } catch {
        return `unparsed:${row.line}`;
      }
    });
    const baseSet = new Set(baseKeys);
    const surviving = headKeys.filter((id) => baseSet.has(id));
    const expected = baseKeys.filter((id) => headKeys.includes(id));
    if (surviving.join('\n') !== expected.join('\n')) {
      findings.push({
        line: headRows[0]?.line || 1,
        code: 'reorder',
        message: `${label}: existing rows were reordered or moved. Leave them where they are.`,
      });
    }
    const firstNew = headKeys.findIndex((id) => !baseSet.has(id));
    let lastSurviving = -1;
    headKeys.forEach((id, index) => {
      if (baseSet.has(id)) lastSurviving = index;
    });
    if (firstNew !== -1 && lastSurviving !== -1 && firstNew < lastSurviving) {
      findings.push({
        line: headRows[firstNew].line,
        code: 'insert',
        message: `${label}: "${headRows[firstNew].name}" was inserted above an existing row. Add new rows at the bottom of that category.`,
      });
    }

    const added = [];
    const edited = [];
    const removed = [];
    for (const row of headRows) {
      let id;
      try {
        id = rowKey(row);
      } catch {
        continue;
      }
      const previous = baseByKey.get(id);
      if (!previous) added.push(row);
      else if (
        previous.description !== row.description ||
        previous.deal !== row.deal ||
        previous.expires !== row.expires
      ) {
        edited.push(row);
      }
    }
    for (const id of baseKeys) {
      if (!headKeys.includes(id)) removed.push(baseByKey.get(id));
    }
    changes.push({ category, subcategory, added, edited, removed });
  }

  for (const key of baseMap.keys()) {
    if (headMap.has(key)) continue;
    const [category, subcategory] = key.split('\n');
    const label = subcategory ? `${category} / ${subcategory}` : category || '(no category)';
    findings.push({
      line: 1,
      code: 'header',
      message: `${label}: the deal table was removed.`,
    });
  }

  for (const [key, headRows] of headMap) {
    if (baseMap.has(key)) continue;
    const [category, subcategory] = key.split('\n');
    findings.push({
      line: headRows[0]?.line || 1,
      code: 'tree',
      message: `${category} / ${subcategory}: this table is not part of the catalog tree.`,
    });
    changes.push({ category, subcategory, added: headRows, edited: [], removed: [] });
  }

  return { base, head, findings, changes };
}

module.exports = {
  EXPECTED_HEADER,
  compareCatalogs,
  normalizeUrl,
  parseCatalog,
  rowKey,
};
