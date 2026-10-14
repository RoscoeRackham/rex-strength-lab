global.window = {};
for (const src of [process.argv[2], process.argv[3]]) {
  delete require.cache[require.resolve(src + '/engine.js')];
  const P = require(src + '/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
  const D = window.DINO_DATA, K = P.K, surf = D.surfaces.find(s => s.id === 'concrete'), ball = D.objects.find(o => o.id === 'baseball');
  const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 1e20 });
  const base = { F: 1e17 * K.g, mode: 'comic', surface: surf, anchor: 'bolted', airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
  const L = P.catchLeg(Object.assign({}, base, { body: rex }), Object.assign({}, base, { body: ollie }), ball, 15000, 'hard');
  console.log(src.split('/').slice(-1)[0], 'powers off:', L.result, L.fireball && L.fireball.kind);
}
