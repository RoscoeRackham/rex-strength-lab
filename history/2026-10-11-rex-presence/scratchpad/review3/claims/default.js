const H = require('./hc.js');
(async () => {
  const p = await H.open();
  for (const t of ['walk','lift','throw','jump','stomp','punch','clap','sprint','pull','weight','arm','wrestle','catch','collide']) {
    await H.tab(p, t); const ok = await H.settle(p);
    console.log('\n######## TAB', t, ok ? '' : '(NOT SETTLED)');
    console.log(await H.bayText(p));
  }
  console.log('ERRS', p.errs);
  await H.close();
})();
