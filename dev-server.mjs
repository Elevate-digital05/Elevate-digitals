/* Local static server that resolves URLs the way Vercel does.
   `python -m http.server` does not, so every extensionless link on the site —
   /services/web-design, /blog/whatsapp-marketing-website, /menu — 404s locally
   while working fine in production. That gap meant links could only be checked
   by reading their href, never by clicking them.

   Reads vercel.json rather than restating it, so local and production cannot
   drift apart. No dependencies, same as the rest of the repo.
   Run: node dev-server.mjs [port] */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, normalize, extname, resolve, sep } from 'node:path';

const root = resolve(process.cwd());
const port = Number(process.argv[2] || 4321);
const { cleanUrls = false, trailingSlash, redirects = [] } =
  JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
};

const read = async p => {
  // Refuse anything that escapes the repo, however it was encoded.
  const full = resolve(root, '.' + p);
  if (full !== root && !full.startsWith(root + sep)) return null;
  try { return await readFile(full); } catch { return null; }
};

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  let path = normalize(decodeURIComponent(url.pathname));

  const send = (code, body, type) => {
    res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' });
    res.end(body);
    console.log(`${code} ${url.pathname}`);
  };
  const redirect = (code, to) => {
    res.writeHead(code, { location: to + url.search });
    res.end();
    console.log(`${code} ${url.pathname} -> ${to}`);
  };

  const rule = redirects.find(r => r.source === path);
  if (rule) return redirect(rule.permanent ? 308 : 307, rule.destination);

  if (trailingSlash === false && path.length > 1 && path.endsWith('/')) {
    return redirect(308, path.slice(0, -1));
  }

  // Vercel's order: the exact file, then <path>.html, then <path>/index.html.
  const tries = [path];
  if (path.endsWith('/')) tries.push(path + 'index.html');
  else {
    if (cleanUrls && !extname(path)) tries.push(path + '.html');
    tries.push(path + '/index.html');
  }
  // cleanUrls also means the .html URL is not the canonical one.
  if (cleanUrls && path.endsWith('.html')) return redirect(308, path.slice(0, -5));

  for (const t of tries) {
    const body = await read(t);
    if (body) return send(200, body, TYPES[extname(t)] || 'application/octet-stream');
  }
  send(404, `404 — no file for ${url.pathname}\n`, 'text/plain; charset=utf-8');
}).listen(port, () => {
  console.log(`serving ${root} on http://localhost:${port}`);
  console.log(`cleanUrls=${cleanUrls} trailingSlash=${trailingSlash} redirects=${redirects.length}`);
});
