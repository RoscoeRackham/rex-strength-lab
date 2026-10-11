const fs = require('fs');
let h = fs.readFileSync('/home/user/dino-strength-sim/dist/preview.html', 'utf8');
const a1 = "RA: mA * K.g, RB: 0, mode: ctx.mode, vmax: sizeVmax('stomp', body) }";
const b1 = "RA: ctx.anchor === 'bolted' ? Infinity : mA * K.g, RB: 0, mode: ctx.mode, vmax: sizeVmax('stomp', body) }";
const a2 = "items.push('Newton’s third law again: driving the foot down pushes the rest of him up just as hard. Only his own weight holds him down, so at high strength the stomp throws Rex into the sky. Here the foot takes ' + sig(100 * r.footShare, 2) + '% of the energy and his body the rest.');";
const b2 = "items.push(c.anchor === 'bolted' ? 'Newton’s third law again: driving the foot down pushes the rest of him up just as hard, but he is bolted to the planet, so the bolts take that push and the foot gets all the energy.' : 'Newton’s third law again: driving the foot down pushes the rest of him up just as hard. Only his own weight holds him down, so at high strength the stomp throws Rex into the sky. Here the foot takes ' + sig(100 * r.footShare, 2) + '% of the energy and his body the rest.');";
for (const [a, b] of [[a1, b1], [a2, b2]]) { if (h.split(a).length !== 2) throw new Error('not unique: ' + a.slice(0, 40)); h = h.replace(a, b); }
fs.writeFileSync('preview_m8.html', h);
console.log('ok');
