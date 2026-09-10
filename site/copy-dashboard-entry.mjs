import fs from 'node:fs';
import path from 'node:path';

const siteRoot = path.dirname(new URL(import.meta.url).pathname).replace(/^\/(\w:)/, '$1');
const docsIndex = path.resolve(siteRoot, '..', 'docs', 'index.html');

for (const route of ['dashboard', 'excel']) {
  const routeDir = path.resolve(siteRoot, '..', 'docs', route);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.copyFileSync(docsIndex, path.join(routeDir, 'index.html'));
  console.log(`Copied ${docsIndex} to ${routeDir}/index.html`);
}
