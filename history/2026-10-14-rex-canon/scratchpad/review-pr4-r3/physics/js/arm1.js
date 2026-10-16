const { P, D, g, R3, O3, c3, dial, sig, surf, conc } = require('./h.js');
const show = (lab, r) => console.log(lab, JSON.stringify(r, (k, v) => (typeof v === 'number' ? (isFinite(v) ? sig(v) : String(v)) : v), 0).slice(0, 900));
show('Rex dial bolted UF vs Ollie unlimited, kf off', P.armWrestle(c3(dial, R3, { keepForm: false, anchor: 'bolted' }), c3(Infinity, O3, { keepForm: false })));
show('Rex unlimited vs Ollie dial bolted UF, kf off', P.armWrestle(c3(Infinity, R3, { keepForm: false }), c3(dial, O3, { keepForm: false, anchor: 'bolted' })));
show('Rex unlimited vs Ollie dial bolted real, kf off', P.armWrestle(c3(Infinity, R3, { keepForm: false, unbreakable: false }), c3(dial, O3, { keepForm: false, anchor: 'bolted', unbreakable: false })));
