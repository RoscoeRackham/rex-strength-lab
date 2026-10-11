// Sweep UI states and look for broken text; check links, feats and slider render time.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(1500);
  console.log('links in sources table:', await page.$$eval('#src-table a', (a) => a.length), 'cells starting with comma:', await page.$$eval('#src-table td', (t) => t.filter((x) => x.textContent.trim().startsWith(',')).length));
  console.log('Milo links:', await page.evaluate(() => [...document.querySelectorAll('article.feat')].find((x) => x.querySelector('.t').textContent.includes('Milo')).querySelectorAll('a').length));
  const bad = [];
  const objs = ['baseball', 'car', 'tank', 'shot', 'piano'];
  let n = 0;
  for (const mode of ['comic', 'real']) for (const lk of [1.33, 5, 20, 'inf']) for (const surface of ['sand', 'concrete']) for (const groundHolds of [false, true]) for (const action of ['lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull']) {
    const obj = action === 'throw' || action === 'lift' || action === 'pull' ? objs[n % objs.length] : 'car';
    const st = { logKg: lk === 'inf' ? 34 : lk, inf: lk === 'inf', mode, surface, groundHolds, anchor: ['friction', 'braced', 'bolted'][n % 3], H: n % 7 === 0 ? 20 : 2, m: n % 7 === 0 ? 180000 : 180, action, obj, angle: [45, 90, 10][n % 3] };
    n++;
    const txt = await page.evaluate((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); return s; }, st);
    await page.reload(); await page.waitForTimeout(60);
    const t = await page.evaluate(() => document.querySelector('#bay').innerText + '\n' + [...document.querySelectorAll('#bay svg text')].map((x) => x.textContent).join(' '));
    const m = t.match(/NaN|undefined|null|\[object|Infinity|,https?:/);
    if (m) bad.push(JSON.stringify(st) + ' -> ' + m[0] + ' … ' + t.slice(Math.max(0, m.index - 80), m.index + 40).replace(/\n/g, ' | '));
  }
  console.log('states', n, 'bad', bad.length); bad.slice(0, 10).forEach((b) => console.log('  ' + b));
  // slider render time on Throw (default car)
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 5, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45 })));
  await page.reload(); await page.waitForTimeout(800);
  const ms = await page.evaluate(async () => {
    const s = document.querySelector('#strength'); const t0 = performance.now();
    for (let i = 0; i < 20; i++) { s.value = String(5 + i * 0.05); s.dispatchEvent(new Event('input', { bubbles: true })); await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0))); }
    return (performance.now() - t0) / 20;
  });
  console.log('ms per slider step (incl. frame):', ms.toFixed(1));
  console.log('errors', errs.slice(0, 5));
  await browser.close();
})();
