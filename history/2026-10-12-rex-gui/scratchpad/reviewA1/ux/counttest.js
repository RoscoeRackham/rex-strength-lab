const { NEW, launch } = require('./common');
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const countDuoCalls = ({ names }) => { window.__duoCalls = 0; let v; Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => { for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; return f.apply(this, arguments); }; } v = x; } }); };
(async () => {
  const b = await launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(countDuoCalls, { names: DUO_FNS });
  await page.goto(NEW()); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(3000);
  const a = await page.evaluate(() => window.__duoCalls);
  await page.click('#duo > summary'); await page.waitForTimeout(2000);
  const c = await page.evaluate(() => window.__duoCalls);
  console.log('closed:', a, 'after opening:', c);
  await b.close();
})();
