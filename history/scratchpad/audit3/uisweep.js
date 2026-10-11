const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const PREV = 'file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit3/preview.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(PREV);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(300);
  const tabs = (process.argv[2] || 'lift,jump,stomp,punch,clap,sprint,pull').split(',');
  const out = [];
  for (const tab of tabs) {
    const res = await page.evaluate(async (tab) => {
      const fire = (sel, ev) => document.querySelector(sel).dispatchEvent(new Event(ev, { bubbles: true }));
      const setSel = (sel, v) => { const s = document.querySelector(sel); s.value = v; fire(sel, 'change'); };
      document.querySelector('#tab-' + tab).click();
      const rows = [];
      const strengths = [1, 2, 2.708, 3.5, 4.958, 6, 9, 12, 15, 20, 23.26, 27, 30, 34, 'inf'];
      const objs = tab === 'lift' ? ['shot', 'car', 'b777', 'sun', 'sky'] : (tab === 'pull' ? ['car', 'cc177', 'semi'] : [null]);
      for (const mode of ['comic', 'real']) {
        document.querySelector('#mode-' + mode).click();
        for (const H of ['0.4', '2', '50']) {
          document.querySelector(`#size-chips .chip[data-h="${H}"]`).click();
          for (const anchor of ['friction', 'braced', 'bolted']) {
            setSel('#anchor', anchor);
            for (const surface of ['sand', 'concrete', 'granite', 'ice']) {
              setSel('#surface', surface);
              for (const gh of [false, true]) {
                const cb = document.querySelector('#ground-holds'); cb.checked = gh; fire('#ground-holds', 'change');
                for (const s of strengths) {
                  if (s === 'inf') document.querySelector('#tier-chips .chip[data-id="inf"]').click();
                  else { const r = document.querySelector('#strength'); r.value = s; fire('#strength', 'input'); }
                  for (const o of objs) {
                    if (o) setSel('#obj', o);
                    const bay = document.querySelector('#bay');
                    rows.push({ cfg: [tab, mode, H, anchor, surface, gh ? 'comicground' : '', s, o].join(' '), text: bay.innerText.replace(/\s+/g, ' ') });
                  }
                }
              }
            }
          }
        }
      }
      return rows;
    }, tab);
    out.push(...res);
    console.error('done', tab, res.length);
  }
  fs.writeFileSync(process.argv[3] || 'uisweep.json', JSON.stringify(out));
  console.log('ERRORS', JSON.stringify(errs.slice(0, 20)));
  await browser.close();
})();
