import fs from 'node:fs';
import path from 'node:path';

const siteRoot = path.dirname(new URL(import.meta.url).pathname).replace(/^\/(\w:)/, '$1');
const docsIndex = path.resolve(siteRoot, '..', 'docs', 'index.html');
const dashboardDir = path.resolve(siteRoot, '..', 'docs', 'dashboard');
fs.mkdirSync(dashboardDir, { recursive: true });
fs.copyFileSync(docsIndex, path.join(dashboardDir, 'index.html'));
console.log(`Copied ${docsIndex} to ${dashboardDir}/index.html`);
