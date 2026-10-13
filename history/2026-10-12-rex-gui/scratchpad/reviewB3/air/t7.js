const run = require('./page.js');
(async () => {
  const r = await run({ action: 'throw', obj: 'pyramid', angle: 90, logKg: Number(process.argv[2]), airAbsorb: 0.5, keepForm: true }, { effort: 'allout' });
  console.log(r.errs);
  for (const l of r.solo.split('\n')) if (/Air resistance absorbed|Air blast|Energy in|^[\d.,]+ km\/s|leaves Earth|Launch/.test(l)) console.log(l);
})();
