const { chromium, CHROME, open } = require('./lib.js');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p, errs } = await open(browser, 390, 844, 'dark', { dpr: 2 });
  await p.click('summary');
  await p.check('#modeAnsur');
  await p.selectOption('#buildSelect', 'she_hulk');
  await p.fill('#hFt', '7'); await p.fill('#hIn', '0');
  let t = await p.evaluate(() => document.getElementById('girths').innerText.split('\n').slice(0, 14).join(' / '));
  console.log('ansur she-hulk 7ft:', t);
  await p.uncheck('#showBeyond');
  t = await p.evaluate(() => ({ g: document.getElementById('girths').innerText.split('\n').slice(0, 10).join(' / '), rev: document.getElementById('revOut').innerText, cmp: document.getElementById('cmp').innerText.replace(/\n/g, ' ') , sum: document.getElementById('optsSum').innerText}));
  console.log('hidden:', JSON.stringify(t, null, 1));
  await (await p.$('#sheet')).screenshot({ path: '/home/user/build-calc/shots/audit-390-dark-shehulk-hidden.png' });
  console.log('errs', errs);
  await ctx.close(); await browser.close();
})();
