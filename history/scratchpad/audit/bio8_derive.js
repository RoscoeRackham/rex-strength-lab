// Weyand 2000 model: v = Lc/tc (Lc fixed), Favg/Wb = tstep/tc, tstep = (tsw + tc)/2, tsw ~ constant.
// Raise stance-average force from running top-speed value 2.08 Wb to hopping value 2.71 Wb (Weyand 2010 abstract).
const ratio = (2 * 2.71 - 1) / (2 * 2.08 - 1);
console.log('speed ratio', ratio.toFixed(3), '-> Bolt 12.4 m/s becomes', (12.4 * ratio).toFixed(2), 'm/s =', (12.4 * ratio / 0.44704).toFixed(1), 'mph');
