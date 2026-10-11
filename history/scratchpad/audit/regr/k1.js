const { P, D, g, surf, obj, V, C } = require('./h.js');
// collide: charge speed monotone in charger strength; held monotone in holder strength; contact quantities finite
for (const src of ['sprint', 'jump', 'stomp']) for (const mode of ['comic', 'real']) for (const gh of [false, true]) for (const H of [0.1, 2, 500]) {
  let prev = null, row = [];
  for (let lg = 1; lg <= 34; lg += 0.25) {
    const cA = C({ kg: Math.pow(10, lg), mode, gh, H, m: 1000 * P.bodyVolume(H) }), cB = C({ kg: Math.pow(10, lg), mode, gh, H, m: 1000 * P.bodyVolume(H) });
    let r; try { r = P.collide(cA, cB, { source: src, bounce: false }); } catch (e) { console.log('THROW', src, mode, gh, H, lg, e.message); break; }
    const v = r.v0 || 0;
    row.push(r.noCharge ? '-' : (r.outcome || '?')[0]);
    if (prev != null && v < prev.v * 0.98 && !(r.noCharge === 'neverLands')) console.log('charge speed DROP', src, mode, 'gh' + gh, 'H' + H, 'lg' + prev.lg, prev.v.toPrecision(4), '->', 'lg' + lg, v.toPrecision(4), r.noCharge || '', prev.nc || '');
    prev = { v, lg, nc: r.noCharge };
  }
  console.log(src, mode, 'gh' + gh, 'H' + H, row.join(''));
}
