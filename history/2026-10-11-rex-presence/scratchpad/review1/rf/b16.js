const { open, bay, select, range, check, click, close, grep } = require('./pwlib.js');
(async () => {
  let p = await open('wt', { action: 'throw', group: 'solo' });
  let t = await bay(p, 4000);
  console.log('=== default throw, lines with rattle/shake/feel/ground shaking:\n' + grep(t, /rattle|shak|feel|Effort|flies/i));
  const opts = await p.evaluate(() => [...document.querySelectorAll('#effort option')].map((o) => o.value + ':' + o.textContent));
  console.log(opts.join(' | '));
  await select(p, 'effort', 'rattle');
  t = await bay(p, 3000);
  console.log('=== rattle preset\n' + grep(t, /rattle|Effort|flies|Courtesy/i));
  await p.close();
  p = await open('wt', { action: 'weight', group: 'solo' });
  await select(p, 'absorb', 'runaway'); await p.waitForTimeout(400); await click(p, '#grow-what-chicxulub');
  t = await bay(p, 1500);
  console.log('=== runaway\n' + grep(t, /event horizon|0\.3 ×/i));
  await close();
})();
