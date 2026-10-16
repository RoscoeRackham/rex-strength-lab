// dump.js <dist html> <outdir> <scenarios.json> [width] [scheme]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [distPath, outDir, scenFile, W = '1280', SCHEME = 'light'] = process.argv.slice(2);
const scen = JSON.parse(fs.readFileSync(scenFile, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });
(async () => {
  const body = fs.readFileSync(distPath, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const prev = path.join(outDir, 'page.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const width = Number(W), height = width < 600 ? 844 : 900;
  for (const s of scen) {
    const ctxB = await browser.newContext({ viewport: { width, height }, colorScheme: SCHEME });
    const page = await ctxB.newPage();
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    await page.goto(pathToFileURL(prev).href);
    await page.evaluate((st) => { localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ saveV: 2 }, st))); }, s.state);
    await page.reload();
    const sel = s.duo ? '#duo-bay' : '#bay';
    // wait for searches
    const settle = async () => {
      const t0 = Date.now();
      await page.waitForTimeout(800);
      while (Date.now() - t0 < 180000) {
        const busy = await page.evaluate((sel) => /working it out|Working out/i.test(document.querySelector(sel).textContent), sel);
        if (!busy) break;
        await page.waitForTimeout(500);
      }
    };
    await settle();
    const effId = s.duo ? '#duo-effort' : '#effort', eff = s.duo ? s.state.duoEffort : s.state.effort, effLog = s.duo ? s.state.duoLogKg : s.state.effortLogKg;
    if (eff && eff !== 'least') {
      if (eff === 'custom') {
        await page.evaluate(([id, v]) => { const sl = document.querySelector(id + '-use'); sl.value = String(v); sl.dispatchEvent(new Event('input', { bubbles: true })); }, [effId, effLog]);
      } else await page.selectOption(effId, eff);
      await settle();
    }
    await page.waitForTimeout(300);
    const txt = await page.evaluate((sel) => {
      const BL = /^(block|flex|grid|list-item|table|table-row|table-cell|flow-root)$/;
      const ser = (n) => {
        let out = '';
        for (const ch of n.childNodes) {
          if (ch.nodeType === 3) out += ch.textContent;
          else if (ch.nodeType === 1) {
            if (/^(SCRIPT|STYLE|svg)$/i.test(ch.tagName)) { if (/svg/i.test(ch.tagName)) { const t = ch.getAttribute('aria-label'); if (t) out += '\n[svg: ' + t + ']\n'; } continue; }
            if (ch.tagName === 'IMG') { out += '[img]'; continue; }
            if (ch.tagName === 'SELECT') { out += '[select ' + ch.id + '=' + ch.value + ']'; continue; }
            const d = getComputedStyle(ch).display;
            const b = BL.test(d) || ch.tagName === 'LI' || ch.tagName === 'P' || ch.tagName === 'SUMMARY';
            const cls = ch.className && typeof ch.className === 'string' ? ch.className.split(' ')[0] : '';
            const tag = /^(verdict|status|chip|tile|callout|math)/.test(cls) ? '<' + cls + '> ' : '';
            out += (b ? '\n' : '') + tag + ser(ch) + (b ? '\n' : '');
          }
        }
        return out;
      };
      return ser(document.querySelector(sel)).replace(/[ \t]+\n/g, '\n').replace(/\n{2,}/g, '\n');
    }, sel);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const hdr = await page.evaluate(() => document.querySelector('.hero .eyebrow').textContent);
    fs.writeFileSync(path.join(outDir, s.name + '.txt'), '# ' + s.name + ' overflow=' + overflow + ' errs=' + JSON.stringify(errs) + '\n# eyebrow: ' + hdr + '\n' + txt);
    if (s.shot) await (await page.$(s.duo ? '#duo' : 'main.panel')).screenshot({ path: path.join(outDir, s.name + '.png') });
    console.log(s.name, 'overflow', overflow, errs.length ? 'ERRS ' + errs.join(' | ') : '');
    await ctxB.close();
  }
  await browser.close();
})();
