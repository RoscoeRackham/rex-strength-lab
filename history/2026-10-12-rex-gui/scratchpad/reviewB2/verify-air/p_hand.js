const { open, load, pick, text } = require('./page');
(async () => {
  const { browser, page, errs } = await open();
  await load(page, { action: 'throw', obj: 'baseball', angle: 0, logKg: 9 });
  await pick(page, '#effort', 'windows');
  const t = await text(page, 'bay');
  const grab = (re) => (t.match(re) || [''])[0];
  console.log('Launch:', grab(/Launch[^.]{0,40}/));
  console.log(grab(/Even all-out[^]{0,400}/));
  await pick(page, '#effort', 'allout');
  const t2 = await text(page, 'bay');
  console.log('ALL-OUT:', (t2.match(/(boom|blast)[^.]{0,200}\./gi) || []).slice(0, 6).join(' | '));
  console.log('errs', errs);
  await browser.close();
})();
