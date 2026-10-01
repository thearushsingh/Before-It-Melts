import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.argv[2] || 8080);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Choose a port between 1 and 65535, for example: npm start -- 8081');
  process.exit(1);
}
if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error('The game is not prepared yet. Run npm run build first.');
  process.exit(1);
}
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.json': 'application/json', '.css': 'text/css', '.wasm': 'application/wasm', '.mp4': 'video/mp4', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }
  let name;
  try { name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end(); return; }
  const file = path.resolve(root, '.' + name + (name.endsWith('/') ? 'index.html' : ''));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) { res.writeHead(404); res.end('Not found'); return; }
    const compressed = file.endsWith('.unityweb');
    const original = compressed ? file.slice(0, -9) : file;
    const headers = { 'Content-Type': types[path.extname(original)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'Accept-Ranges': 'bytes' };
    if (compressed) headers['Content-Encoding'] = 'gzip';
    let start = 0, end = stat.size - 1;
    if (req.headers.range) {
      const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
      if (!range) { res.writeHead(416, { 'Content-Range': 'bytes */' + stat.size }); res.end(); return; }
      start = Number(range[1]);
      if (range[2]) end = Math.min(Number(range[2]), end);
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= stat.size) {
        res.writeHead(416, { 'Content-Range': 'bytes */' + stat.size }); res.end(); return;
      }
      headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
    }
    headers['Content-Length'] = end - start + 1;
    res.writeHead(req.headers.range ? 206 : 200, headers);
    if (req.method === 'HEAD') res.end();
    else fs.createReadStream(file, { start, end }).on('error', () => res.destroy()).pipe(res);
  });
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is busy. Try npm start -- ${port === 8080 ? 8081 : port + 1}.` : error.message);
  process.exit(1);
});
server.listen(port, '127.0.0.1', () => {
  console.log(`Before It Melts: http://127.0.0.1:${port}/`);
  console.log('Keep this terminal open while playing. Press Ctrl+C to stop.');
});
