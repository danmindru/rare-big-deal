/**
 * Compile every product page with the MDX parser Contentlayer uses.
 * Contentlayer calls @mdx-js/mdx compile through mdx-bundler and
 * @mdx-js/esbuild, after gray-matter strips frontmatter. An unclosed
 * `<br>` fails that parse with "Expected a closing tag".
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile } from '@mdx-js/mdx';

const require = createRequire(import.meta.url);
const grayMatter = require('gray-matter');

const productsDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'data',
  'products',
);

const files = fs
  .readdirSync(productsDir)
  .filter((name) => name.endsWith('.mdx'))
  .sort();

if (files.length === 0) {
  console.error(`No product MDX files in ${productsDir}`);
  process.exit(1);
}

const errors = [];

for (const file of files) {
  const source = fs.readFileSync(path.join(productsDir, file), 'utf8');
  let body = source;
  try {
    body = grayMatter(source).content;
  } catch (error) {
    errors.push(`${file}: frontmatter: ${error.message}`);
    continue;
  }

  try {
    await compile({ path: file, value: body }, { development: false });
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
  }
}

if (errors.length > 0) {
  console.error(`Product MDX failed to compile (${errors.length}):`);
  for (const error of errors) console.error(error);
  process.exit(1);
}

console.log(`Compiled ${files.length} product MDX files with @mdx-js/mdx.`);
