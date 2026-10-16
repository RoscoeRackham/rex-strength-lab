for (const [lab, root] of [['PR3', process.argv[2]], ['PR4', process.argv[3]]]) {
  delete require.cache[require.resolve(root + '/src/engine.js')];
  const P = require(root + '/src/engine.js'); global.window = {}; delete require.cache[require.resolve(root + '/src/data.js')]; require(root + '/src/data.js'); const D = window.DINO_DATA;
  const surf = D.surfaces.find(s => s.id === 'concrete');
  const mk = (b, o) => Object.assign({ F: 100 * 907.18474 * P.K.g, mode: 'comic', body: P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] }), surface: surf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o || {});
  for (const own of [true, false]) {
    const r = P.collide(mk('ollie', { ownRecoil: own }), mk('rex', { ownRecoil: own }), { source: 'sprint', bounce: true });
    const a = r.after || {};
    console.log(lab, 'ownRecoil', own, 'toGround', JSON.stringify(r.toGround), 'Q', r.h && r.h.Q, 'keys', Object.keys(r).filter(k=>/ground|Ground|foot/i.test(k)).join(','));
  }
}
