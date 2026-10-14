const { wrap, S } = require('./h.js');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const countDuoCalls = ({ names, delay }) => {
  window.__duoCalls = 0; window.__callTimes = [];
  let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
    for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; window.__callTimes.push(Math.round(performance.now())); if (delay) { const t = performance.now(); while (performance.now() - t < delay) { } } return f.apply(this, arguments); }; }
    v = x;
  } });
};
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [name, dir] of [['branch', 'lab'], ['B2-no-cancel', 'labB2']]) {
    const url = wrap(S + '/' + dir + '/dist/index.html', name + '.html');
    // 1. exactly the shots.js test
    {
      const slow = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await slow.addInitScript(countDuoCalls, { names: DUO_FNS, delay: 60 });
      await slow.goto(url);
      await slow.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm' })));
      await slow.reload(); await slow.waitForTimeout(600);
      const busy = await slow.evaluate(() => /working it out/i.test(document.getElementById('duo-bay').textContent));
      await slow.click('#duo > summary');
      const c0 = await slow.evaluate(() => window.__duoCalls);
      await slow.waitForTimeout(3000);
      const c1 = await slow.evaluate(() => window.__duoCalls);
      const rexOk = await slow.evaluate(() => !!document.querySelector('#bay .verdict'));
      const times = await slow.evaluate(() => window.__callTimes);
      const pass = busy && c1 === c0 && rexOk;
      console.log(name, 'shots.js test:', pass ? 'PASSES' : 'FAILS', JSON.stringify({ busy, c0, c1, rexOk, ncalls: times.length, first: times[0], last: times[times.length - 1] }));
      await slow.close();
    }
    // 2. left open: how many calls the search makes in total
    {
      const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await p.addInitScript(countDuoCalls, { names: DUO_FNS, delay: 60 });
      await p.goto(url);
      await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm' })));
      await p.reload(); await p.waitForTimeout(5000);
      console.log(name, 'left open: total calls', await p.evaluate(() => window.__duoCalls), 'text', await p.evaluate(() => (document.querySelector('#duo-bay .effort-read b') || {}).textContent));
      await p.close();
    }
    // 3. close from inside the page as soon as the placeholder shows
    {
      const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await p.addInitScript(countDuoCalls, { names: DUO_FNS, delay: 60 });
      await p.addInitScript(() => {
        const iv = setInterval(() => {
          const b = document.getElementById('duo-bay');
          if (b && /working it out/i.test(b.textContent) && localStorage.getItem('rex-lab-v1') && JSON.parse(localStorage.getItem('rex-lab-v1')).duoOpen) {
            window.__c0 = window.__duoCalls; document.getElementById('duo').open = false; clearInterval(iv);
          }
        }, 5);
      });
      await p.goto(url);
      await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm' })));
      await p.reload(); await p.waitForTimeout(4000);
      const r = await p.evaluate(() => ({ c0: window.__c0, now: window.__duoCalls, open: document.getElementById('duo').open }));
      console.log(name, 'in-page close while busy:', JSON.stringify(r), r.c0 === r.now ? 'stopped' : 'SEARCH KEPT RUNNING');
      await p.close();
    }
  }
  await browser.close();
})();
