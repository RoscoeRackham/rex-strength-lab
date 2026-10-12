const H = require('./h.js');
(async () => {
  const p = await H.open({ action: 'stomp', inf: true });
  await H.tab(p, 'stomp');
  await H.effort(p, 'allout');
  const t = await H.text(p);
  console.log(t.split('\n').filter((l) => /∞|Earth blown|whole planet|now out to/.test(l)).join('\n'));
  await H.close();
})();
