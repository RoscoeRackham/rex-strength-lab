const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1300, height: 900 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.evaluate(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: Math.log10(5.9724e24), inf:false, action:'lift', obj:'earth' })); });
  await p.reload();
  await p.waitForTimeout(1500);
  const txt = await p.evaluate(() => document.body.textContent.replace(/(\S)(Strength: )/g,"$1\n$2"));
  const lines = txt.split('\n').filter(l => /planet|Three times|Veritas|vol\. 3|benches Earth|Weight of a/i.test(l));
  console.log(lines.join('\n---\n'));
  await b.close();
})();
