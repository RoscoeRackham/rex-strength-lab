const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const PREV = 'file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit3/preview.html';
const TAB = { boom: 'punch', windows: 'clap', carmach3: 'throw', jumpliberty: 'jump', quake3: 'stomp', hiro: 'punch', quake7: 'stomp', tsar: 'clap', chix: 'punch', earth: 'punch' };
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(PREV);
  const configs = JSON.parse(process.argv[2]);
  for (const st of configs) {
    await page.evaluate((st) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(st)); }, st);
    await page.reload();
    await page.waitForTimeout(400);
    await page.waitForFunction(() => document.querySelectorAll('#ladder-viz g.mk[data-key^="R:"]').length > 0 || document.querySelector('#ladder-never').textContent.includes('Never'), null, { timeout: 300000, polling: 200 });
    console.log('\n=== ' + JSON.stringify(st));
    const keys = await page.evaluate(() => [...document.querySelectorAll('#ladder-viz g.mk[data-key^="R:"]')].map((g) => g.getAttribute('data-key')));
    for (const k of keys) {
      const id = k.slice(2);
      await page.evaluate((k) => { document.querySelector(`#ladder-viz g.mk[data-key="${k}"]`).dispatchEvent(new MouseEvent('click', { bubbles: true })); }, k);
      await page.waitForTimeout(100);
      await page.click('#tab-' + TAB[id]);
      if (id === 'carmach3') { await page.selectOption('#obj', 'car'); await page.evaluate(() => { const r = document.querySelector('#angle'); r.value = 45; r.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(150); }
      await page.waitForTimeout(100);
      const txt = await page.evaluate(() => { const b = document.querySelector('#bay'); return document.querySelector('#dial-big').textContent + ' || ' + b.querySelector('.verdict').textContent + ' || ' + [...b.querySelectorAll('.status')].map((x) => x.textContent).join(' | ') + ' || ' + [...b.querySelectorAll('.tile')].slice(0, 3).map((x) => x.innerText.replace(/\s+/g, ' ')).join(' | ') + ' || ' + (b.querySelector('.viz svg[aria-label^="Blast"]') ? b.querySelector('.viz svg[aria-label^="Blast"]').getAttribute('aria-label') : ''); });
      console.log(id + ': ' + txt);
    }
    // restore for next config
  }
  await browser.close();
})();
