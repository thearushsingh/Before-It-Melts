import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const release = JSON.parse(fs.readFileSync(path.join(root, 'release-manifest.json')));
const data = JSON.parse(fs.readFileSync(path.join(dist, 'Build/game-data.json')));
const prefix = Buffer.from('BIM-DATA-PART-01\n');
const full = crypto.createHash('sha256');
let bytes = 0;
for (const part of data.parts) {
  const file = fs.readFileSync(path.join(dist, 'Build', part.path));
  if (!file.subarray(0, prefix.length).equals(prefix)) throw Error('Invalid part prefix');
  const payload = file.subarray(prefix.length);
  if (payload.length !== part.bytes || crypto.createHash('sha256').update(payload).digest('hex') !== part.sha256)
    throw Error('Part checksum mismatch: ' + part.path);
  full.update(payload); bytes += payload.length;
}
const original = release.files.find(f => f.path === 'Build/web-release.data.unityweb');
if (bytes !== original.bytes || full.digest('hex') !== original.sha256 || data.sha256 !== original.sha256)
  throw Error('Reassembled data differs from original Unity export');
for (const file of release.files.filter(f => f !== original)) {
  const content = fs.readFileSync(path.join(dist, file.path));
  if (content.length !== file.bytes || crypto.createHash('sha256').update(content).digest('hex') !== file.sha256)
    throw Error('Release file differs: ' + file.path);
}
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const file = path.join(dir, e.name);
    return e.isDirectory() ? walk(file) : [{ path: path.relative(dist, file), bytes: fs.statSync(file).size }];
  });
}
const files = walk(dist);
const total = files.reduce((sum, f) => sum + f.bytes, 0);
const largest = files.reduce((a, b) => a.bytes > b.bytes ? a : b);
if (files.length > 1000 || total > 500000000 || largest.bytes > 200000000 || files.some(f => f.path.length > 240))
  throw Error('itch.io archive limits exceeded');
console.log(JSON.stringify({ originalDataIdentical: true, otherReleaseFilesVerified: release.files.length - 1, files: files.length, totalBytes: total, largestFile: largest }, null, 2));
