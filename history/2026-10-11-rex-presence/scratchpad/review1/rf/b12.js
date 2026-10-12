const { open, bay, select, range, check, click, close, grep } = require('./pwlib.js');
(async () => {
  const p = await open('wt', { action: 'throw', group: 'solo', obj: 'person' });
  const t = await bay(p, 4000);
  console.log(grep(t, /presses them|Effort|Courtesy|flies/i));
  await close();
})();
