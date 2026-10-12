const H = require('./h.js');
(async () => {
  const p = await H.open({ action: 'lift', obj: 'semi', gentleHold: true });
  await H.tab(p, 'lift');
  const t = await H.text(p);
  const L = t.split('\n');
  L.forEach((l, i) => { if (/Grip plate|Gentle hold|Grip pressure|hand pressure|palms press/i.test(l)) console.log(L.slice(i, i + 3).join(' | ')); });
  console.log('ARIA:', await H.aria(p));
  await H.close();
})();
