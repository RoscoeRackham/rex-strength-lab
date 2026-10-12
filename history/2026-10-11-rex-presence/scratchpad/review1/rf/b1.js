const { open, bay, select, range, check, click, close, grep } = require('./pwlib.js');
(async () => {
  // Finding 1: default throw, slider 4.58 (37.9 t), and goal 35 m
  let p = await open('wt', { action: 'throw', group: 'solo' });
  let t = await bay(p, 3000);
  console.log('--- default throw\n' + grep(t, /Effort|Courtesy|flies|lands|Grip|crush/i));
  await range(p, 'effort-use', 4.58);
  t = await bay(p, 2500);
  console.log('--- slider 4.58\n' + grep(t, /Effort|Courtesy|flies|Grip|crush|Above the courtesy|punch/i));
  await p.evaluate(() => { const d = document.querySelector('details.haz-list'); if (d) d.open = true; });
  t = await bay(p, 300);
  console.log('--- hazards list\n' + grep(t, /crushes|from|ceiling/i));
  p = await open('wt', { action: 'throw', group: 'solo', gThrow: 35 });
  t = await bay(p, 4000);
  console.log('--- goal 35 m\n' + grep(t, /Effort|Courtesy|flies|lands|To land|crush/i));
  console.log('errors', p._errs);
  await close();
})();
