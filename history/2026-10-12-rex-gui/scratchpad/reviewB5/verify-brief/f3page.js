const { open } = require('./harness.js');
(async () => {
  const h = await open();
  await h.load({ duoOpen: true, duoAction: 'collide', anchor: 'friction', colSrc: 'jump', logKg: 6.25, near: 3 }, 'duo-bay');
  await h.pick('#duo-effort', 'ground');
  let t = await h.text('duo-bay');
  const i = t.indexOf('Effort'); console.log('=== Break the ground ===\n' + t.slice(t.indexOf('Ollie jumps') >= 0 ? 0 : 0).replace(/\n+/g, '\n').split('\n').filter(l => !/^(Least disruptive|Courtesy ceiling$|Rattle|Risk|Break windows|Break the ground under|Flatten|Level|All-out$|Custom)/.test(l)).join('\n').slice(0, 5000));
  console.log('\nHAS shake chip:', /The hit shakes the ground/.test(t), ' HAS push item:', /push still goes into the ground|still goes into the ground/.test(t));
  await h.pick('#duo-effort', 'plaster');
  t = await h.text('duo-bay');
  console.log('\n=== plaster preset (power on) ===\nHAS shake chip:', /The hit shakes the ground/.test(t), (t.match(/The hit shakes the ground[^\n]*/) || [''])[0]);
  console.log('errs', h.errs);
  await h.browser.close();
})();
