const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const SP = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit3/m5';
(async () => {
  const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
  const prev = path.join(SP, 'preview.html'); fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const angle of [90, 89, 88, 85]) {
  for (const [w,h] of [[1280,900],[390,844]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto('file://' + prev);
    await page.evaluate((a) => { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', obj: 'car', angle: a })); }, angle);
    await page.reload();
    await page.waitForTimeout(5000);
    const info = await page.evaluate(() => {
      const bay = document.querySelector('main.panel');
      const v = bay.querySelector('.verdict') ? bay.querySelector('.verdict').textContent : null;
      const svgs = [...bay.querySelectorAll('svg')].filter(s => (s.getAttribute('aria-label')||'').startsWith('Flight path'));
      const texts = svgs.map(s => [...s.querySelectorAll('text')].map(t => t.textContent));
      const paths = svgs.map(s => [...s.querySelectorAll('path')].map(p => p.getAttribute('d').slice(0,200)));
      const tiles = [...bay.querySelectorAll('.tile')].map(t => t.textContent);
      const label = document.querySelector('label[for=angle]') && document.querySelector('label[for=angle]').textContent;
      return { label, v, texts, paths, tiles };
    });
    console.log(angle, w, JSON.stringify(info, null, 1));
    const svg = await page.$('svg[aria-label^="Flight path"]');
    if (svg) await (await svg.evaluateHandle(s => s.parentElement.parentElement)).asElement().screenshot({ path: path.join(SP, `chart_${angle}_${w}.png`) });
    await page.close();
  }}
  await browser.close();
})();
