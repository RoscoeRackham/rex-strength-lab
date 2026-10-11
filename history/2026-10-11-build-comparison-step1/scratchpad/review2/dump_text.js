const { open } = require('./render.js');
(async () => {
  const { browser, p, errs } = await open(1280);
  const out = await p.evaluate(() => {
    const t = (sel) => Array.from(document.querySelectorAll(sel)).map((e) => e.innerText.replace(/\s+\n/g, '\n'));
    return { stops: Array.from(document.querySelectorAll('#stops > section, #stops > div')).map((s) => '### ' + s.id + '\n' + Array.from(s.querySelectorAll('.stop-head, .limitnote, .inside > p')).map((e) => e.innerText).join('\n')),
      limits: t('#limits'), key: t('#key, .key'), };
  });
  console.log(out.stops.join('\n\n'));
  console.log('\n=====LIMITS=====\n' + out.limits.join('\n'));
  console.log('ERRS', errs);
  await browser.close();
})();
