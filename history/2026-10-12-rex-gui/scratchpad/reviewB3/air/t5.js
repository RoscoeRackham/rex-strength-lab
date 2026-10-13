const run = require('./page.js');
(async () => {
  const r = await run({ action: 'throw', obj: 'eiffel', angle: 0, logKg: 18.7602, airAbsorb: 0, keepForm: true }, { effort: 'allout' });
  console.log(r.errs);
  const t = r.solo; const i = t.indexOf('EFFORT (GENTLE');
  console.log(t.slice(i, i + 4000));
})();
