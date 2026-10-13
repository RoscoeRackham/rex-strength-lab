const { run, chromium } = require('./page.js');
const show = (label, r, pats) => { console.log('=== ' + label + (r.errs.length ? ' ERR ' + r.errs : '')); const lines = r.txt.split('\n').filter(Boolean); for (const l of lines) if (!pats || pats.some((p) => p.test(l))) console.log('  > ' + l.slice(0, 900)); };
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const which = process.argv[2];
  if (!which || which === 'stomp') {
    for (const pick of ['ceiling', 'plaster', 'allout']) {
      const r = await run(browser, { action: 'stomp', surface: 'sand', near: 2 }, { pick });
      show('stomp sand near 2 m, ' + pick, r, [/Effort|ceiling|plaster|Courtesy|ground takes|resists|shak/i]);
    }
  }
  if (!which || which === 'jump') {
    const r = await run(browser, { action: 'jump', inf: true, surface: 'concrete' }, { pick: 'allout' });
    show('jump inf concrete allout', r, [/bear|ground|push-off|shake/i]);
  }
  if (!which || which === 'throw') {
    const r = await run(browser, { action: 'throw', surface: 'sand', obj: 'car', angle: 45, ownRecoil: false, logKg: 5 }, { pick: 'allout' });
    show('throw sand car 45 own-off 100t allout', r, [/sideways|bear|ground takes|friction|slide|flies back/i]);
    const r2 = await run(browser, { action: 'throw', surface: 'sand', obj: 'car', angle: 0, logKg: 5 }, { pick: 'allout' });
    show('throw sand car 0 own-on 100t allout', r2, [/sideways|bear|ground takes|can carry|drives his feet/i]);
  }
  await browser.close();
})();
