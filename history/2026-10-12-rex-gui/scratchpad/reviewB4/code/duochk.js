// generic: load a state into the branch page, optionally pick a duo effort, print the effort box and tab texts
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
async function settle(page, id) { for (let i = 0; i < 600; i++) { const busy = await page.evaluate((x) => /working it out|Working out/i.test(document.getElementById(x).textContent), id); if (!busy) return; await page.waitForTimeout(250); } throw new Error('busy'); }
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', (e) => console.log('ERR', e.message));
  await page.goto(pathToFileURL(process.env.PAGE || 'pages/branch.html').href);
  const runs = JSON.parse(process.argv[2]);
  for (const [st, eff, grep] of runs) {
    const bay = st.duoOpen ? 'duo-bay' : 'bay';
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(500); await settle(page, bay);
    if (eff) { await page.selectOption(st.duoOpen ? '#duo-effort' : '#effort', eff); await page.waitForTimeout(400); await settle(page, bay); }
    const r = await page.evaluate(([id, g]) => { const b = document.getElementById(id); const t = (n) => n ? n.textContent.replace(/\s+/g, ' ').trim() : ''; const re = new RegExp(g || '.', 'i');
      return { eff: t(b.querySelector('.effort-read')), verdict: t(b.querySelector('.verdict')), chips: Array.from(b.querySelectorAll('.status-row .status')).map(t), items: Array.from(b.querySelectorAll('.happens li, .callout, .tiles .tile')).map(t).filter((x) => re.test(x)) }; }, [bay, grep]);
    console.log('==', JSON.stringify(st), eff || ''); console.log(JSON.stringify(r, null, 1));
  }
  await browser.close();
})();
