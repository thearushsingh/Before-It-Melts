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
// itch.io permits 500 MB total, but no individual file above 200 MB.
// Use small, byte-verified transport pieces; preserve the complete Unity data.
const dataPath = 'Build/web-release.data.unityweb';
const dataFile = path.join(output, dataPath);
const original = manifest.files.find(file => file.path === dataPath);
const partSize = 8 * 1024 * 1024;
const prefix = Buffer.from('BIM-DATA-PART-01\n');
const parts = [];
const fd = fs.openSync(dataFile, 'r');
const fullHash = crypto.createHash('sha256');
try {
  for (let offset = 0, index = 0; offset < original.bytes; index++) {
    const bytes = Buffer.alloc(Math.min(partSize, original.bytes - offset));
    let read = 0;
    while (read < bytes.length) {
      const count = fs.readSync(fd, bytes, read, bytes.length - read, offset + read);
      if (!count) throw new Error('Unexpected end of Unity data');
      read += count;
    }
    fullHash.update(bytes);
    const name = `game-data-${String(index).padStart(3, '0')}.bin`;
    fs.writeFileSync(path.join(output, 'Build', name), Buffer.concat([prefix, bytes]));
    parts.push({ path: name, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
    offset += bytes.length;
  }
} finally { fs.closeSync(fd); }
if (fullHash.digest('hex') !== original.sha256) throw new Error('Data changed while packaging');
fs.writeFileSync(path.join(output, 'Build', 'game-data.json'), JSON.stringify({bytes: original.bytes, sha256: original.sha256, parts}));
fs.unlinkSync(dataFile);
console.log(`Packaged original Unity data losslessly into ${parts.length} download pieces.`);
if (!fs.existsSync(path.join(output, 'index.html'))) throw new Error('Missing game page');
console.log('Before It Melts is ready in dist/');
