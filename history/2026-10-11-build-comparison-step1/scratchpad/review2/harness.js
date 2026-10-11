// Shared Playwright harness: wraps dist/index.html like the artifact host and opens it.
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const T = process.env.TREE;
function wrap() {
  const page = fs.readFileSync(path.join(T, 'build-comparison/dist/index.html'), 'utf8');
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page + '</body></html>';
}
async function open(opts) {
  opts = opts || {};
  const html = wrap();
  const file = path.join(process.env.SCR, 'page.html'); fs.writeFileSync(file, html);
  let server = null, url = 'file://' + file;
  if (opts.http) {
    server = http.createServer((req, res) => { res.writeHead(200, Object.assign({ 'content-type': 'text/html; charset=utf-8' }, opts.headers || {})); res.end(html); });
    await new Promise((r) => server.listen(0, r));
    url = 'http://127.0.0.1:' + server.address().port + '/';
  }
  const browser = await chromium.launch({ executablePath: CHROME });
  const ctx = await browser.newContext({ viewport: { width: opts.w || 1280, height: 900 } });
  await ctx.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (r) => r.abort());
  const p = await ctx.newPage();
  const logs = [];
  p.on('console', (m) => logs.push(m.type() + ': ' + m.text()));
  p.on('pageerror', (e) => logs.push('pageerror: ' + e));
  if (opts.init) await p.addInitScript(opts.init);
  await p.goto(url);
  return { browser, ctx, p, logs, close: async () => { await browser.close(); if (server) server.close(); } };
}
module.exports = { open };
