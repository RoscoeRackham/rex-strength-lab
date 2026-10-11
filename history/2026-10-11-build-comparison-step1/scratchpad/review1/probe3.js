const path = require('path'); const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  await p.route(/fonts\./, (r) => r.abort());
  await p.goto(pathToFileURL(path.resolve(process.argv[2])).href);
  for (const id of process.argv[3].split(',')) {
    const t = await p.evaluate((id) => { document.querySelector('.fig[data-id="' + id + '"]').click(); const d = document.getElementById('drawer'); const out = []; d.querySelectorAll('.ign li').forEach((l) => out.push('IGN: ' + l.textContent)); const txt = d.innerText; const m = txt.match(/The range covers[^\n]*/); if (m) out.push(m[0]); const w = txt.match(/WEIGHT COUNTED\n[^\n]*\n[^\n]*\n[^\n]*/); if (w) out.push(w[0].replace(/\n/g, ' | ')); const h = txt.split('\n').slice(0, 6).join(' | '); out.push(h); return out.join('\n'); }, id);
    console.log('== ' + id + '\n' + t);
    await p.keyboard.press('Escape');
  }
  await b.close();
})();
