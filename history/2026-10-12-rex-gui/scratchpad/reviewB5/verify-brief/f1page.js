const { open } = require('./harness.js');
(async () => {
  const h = await open();
  const base = { action: 'stomp', surface: 'sand', logKg: 6, near: 1.5 };
  await h.load(base);
  await h.pick('#effort', 'allout');
  let t = await h.text(); console.log('=== ALL-OUT, sand, 1.5 m, 1000 t dial ===\n' + t.slice(0, 4000));
  await h.slide('effort-use', 2.96); t = await h.text(); console.log('\n=== custom 10^2.96 kg (912 kg) ===\n' + t.slice(0, 3500));
  await h.slide('effort-use', 3.0); t = await h.text(); console.log('\n=== custom 10^3.0 kg (1 t) ===\n' + t.slice(0, 3500));
  console.log('errs', h.errs);
  await h.browser.close();
})();
