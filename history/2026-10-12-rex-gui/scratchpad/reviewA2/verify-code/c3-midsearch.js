const { chromium, EXE } = require('./h.js');
const { pathToFileURL } = require('url');
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const slow = ({ names, delay, tab }) => {
  window.__calls = 0; let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => { for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__calls++; const t = performance.now(); while (performance.now() - t < delay) {} return f.apply(this, arguments); }; } v = x; } });
  const iv = setInterval(() => { const b = document.getElementById('duo-bay'); if (b && /Effort: working it out/i.test(b.textContent)) { clearInterval(iv); window.__busyAt = window.__calls; if (tab) document.getElementById('tab-' + tab).click(); } }, 5);
};
(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  for (const name of process.argv.slice(2)) {
    for (const tab of [null, 'jump', 'weight', 'lift', 'walk']) {
      const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await pg.addInitScript(slow, { names: DUO_FNS, delay: 60, tab });
      await pg.goto(pathToFileURL(__dirname + '/pages/' + name + '.html').href);
      await pg.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm' })));
      await pg.reload(); await pg.waitForTimeout(6000);
      const r = await pg.evaluate(() => { const t = document.getElementById('duo-bay').textContent; const m = t.match(/Effort: [^.]*\.[^.]*/); return { busyAt: window.__busyAt, calls: window.__calls, working: /working it out/i.test(t), effort: m ? m[0].slice(0, 50) : null, rexTab: (document.querySelector('#tabs [aria-selected="true"]') || {}).id }; });
      console.log(name.padEnd(10), ('click ' + tab).padEnd(13), JSON.stringify(r));
      await pg.close();
    }
  }
  await browser.close();
})();
