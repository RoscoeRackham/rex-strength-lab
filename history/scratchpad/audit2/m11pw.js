const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.evaluate(() => localStorage.clear());
  await p.reload();
  await p.waitForTimeout(500);
  async function featRun(title) {
    const ok = await p.evaluate((title) => {
      for (const a of document.querySelectorAll('article.feat')) { const t = a.querySelector('.t').textContent; if (t.includes(title)) { a.querySelector('button.run').click(); return t; } }
      return false;
    }, title);
    await p.waitForTimeout(800);
    return ok;
  }
  for (const title of ['Hulk and Thor: Class 100', 'Sun Wukong']) {
    for (const mode of ['comic','real']) {
      await p.evaluate(() => localStorage.clear());
      await p.reload(); await p.waitForTimeout(400);
      if (mode === 'real') { await p.click('#mode-real'); await p.waitForTimeout(300); }
      const ok = await featRun(title);
      const txt = await p.evaluate(() => {
        const bay = document.querySelector('#bay');
        const q = (s) => [...bay.querySelectorAll(s)].map(n => n.innerText).join(' | ');
        return 'VERDICT: ' + q('.verdict') + '\nTILES: ' + q('.tiles') + '\nHAPPENS: ' + q('.happens') + '\nSETUP: ' + (document.querySelector('#setup-sum')||{}).textContent + '\nANGLE: ' + JSON.stringify(localStorage.getItem('rex-lab-v1'));
      });
      console.log('=====', title, mode, ok); console.log(txt);
    }
  }
  await b.close();
})();
