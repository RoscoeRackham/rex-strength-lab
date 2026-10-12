const H = require('./h.js');
(async () => {
  const q = await H.open({ action: 'stomp', surface: 'granite', near: 3 });
  await H.tab(q, 'stomp');
  await H.settle(q);
  const t2 = await H.text(q);
  console.log(t2.split('\n').filter((l) => /Effort|Even all-out|Courtesy ceiling:/.test(l)).join('\n'));
  await H.close();
})();
