const { chromium, prep, loadOn, settledOn, W, CHROME } = require('./common.js');
const url = prep();
const DUO = (x) => Object.assign({ duoOpen: true }, x);
const [st, eff, n] = [JSON.parse(process.argv[2]), process.argv[3] === '-' ? null : process.argv[3], +(process.argv[4] || 3000)];
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await pg.goto(url);
  await loadOn(pg, st, eff);
  const bay = st.duoOpen ? 'duo-bay' : 'bay';
  const t = await pg.evaluate((b) => { const box = document.getElementById(b); return Array.from(box.querySelectorAll('.verdict, .tiles, .happens li, .callout')).map((x) => (x.className.includes('tiles') ? '[TILES] ' + Array.from(x.children).map((c) => c.textContent).join(' | ') : x.textContent)).join('\n'); }, bay);
  console.log(t.slice(0, n));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
