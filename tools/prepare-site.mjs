import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'release-manifest.json'), 'utf8'));
fs.mkdirSync(output, { recursive: true });
fs.cpSync(path.join(root, 'site'), output, { recursive: true });
for (const asset of manifest.splitFiles) {
  const destination = path.resolve(output, asset.path);
  if (!destination.startsWith(output + path.sep)) throw new Error('Invalid asset path');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const fd = fs.openSync(destination, 'w');
  const hash = crypto.createHash('sha256');
  let total = 0;
  try {
    for (const part of asset.parts) {
      const source = path.resolve(root, part);
      if (!source.startsWith(path.join(root, 'asset-parts') + path.sep)) throw new Error('Invalid part path');
      const bytes = fs.readFileSync(source);
      let written = 0;
      while (written < bytes.length) written += fs.writeSync(fd, bytes, written, bytes.length - written);
      hash.update(bytes); total += bytes.length;
    }
  } finally { fs.closeSync(fd); }
  if (total !== asset.bytes || hash.digest('hex') !== asset.sha256) throw new Error('Asset verification failed: ' + asset.path);
  console.log('Verified ' + asset.path + ' (' + total + ' bytes)');
}
if (!fs.existsSync(path.join(output, 'index.html'))) throw new Error('Missing game page');
console.log('Before It Melts is ready in dist/');
