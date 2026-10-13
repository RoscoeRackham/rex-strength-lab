const { run, chromium } = require('./page.js');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const [st, opts] = JSON.parse(process.argv[2]);
  const r = await run(browser, st, opts);
  const pat = process.argv[3] ? new RegExp(process.argv[3], 'i') : null;
  console.log(r.errs.length ? 'ERR ' + r.errs : '');
  for (const l of r.txt.split('\n').filter(Boolean)) if (!pat || pat.test(l)) console.log('> ' + l.slice(0, 1200));
  await browser.close();
})();
