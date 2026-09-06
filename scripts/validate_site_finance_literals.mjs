#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const targets = ['site/app/forecast-page8.tsx', 'site/app/dashboard-page10.tsx'];
const forbidden = ['82.514','12.896','24.207','8.812','13.956','15.815','3.204','5.608','4.554','9.402'];
for (const file of targets) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const literal of forbidden) if (text.includes(literal)) throw new Error(`${file} contains finance result literal ${literal}`);
}
console.log(`PASS: finance literal regression (${targets.length} TSX files)`);
