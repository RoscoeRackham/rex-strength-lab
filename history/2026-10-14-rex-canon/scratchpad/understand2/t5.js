// the checks in test/powers.js that read figures the change removes (3,007 kg bodies, as the test builds them)
global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const ctxOf = (F, extra) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction' }, extra || {});
const sig = (x) => Number(x).toPrecision(4);
// line 369-371
{ const cR = ctxOf(1e6 * g), cO = Object.assign({}, cR, { body: ollie }), cOr = Object.assign({ ownRecoil: true }, cO);
  const k1 = P.catchIt(cOr, obj('car'), 60, 10, null), k0 = P.catchIt(cO, obj('car'), 60, 10, null);
  console.log('L370 catchIt car 60 m/s: slide off', sig(k0.slide), 'on', sig(k1.slide), 'R', sig(k0.R), 'uAfter', sig(k0.uAfter), 'slips', k0.slips); }
// line 164-171: sheath catch, ON + bolted
{ const ob = obj('baseball');
  for (const [F, sh] of [[200e18 * 907.18474 * g, 0.5], [200e18 * 907.18474 * g, 1], [1e16 * g, 0.99]]) {
    const cR = ctxOf(F, Object.assign({}, ON, { airAbsorb: sh, anchor: 'bolted' })), L = P.catchLeg(cR, Object.assign({}, cR, { body: ollie }), ob, 1000, 'hard');
    console.log('L169 sheath', sh, L.result, 'toGroundC', L.toGroundC ? sig(L.toGroundC.J) : '-', 'catcher anchor', 'bolted'); } }
// line 448-449 moved to UB alone: friction vs bolted
{ const sand = surf('sand');
  for (const ex of [Object.assign({}, ON, { surface: sand }), Object.assign({}, ON, { surface: sand, ownRecoil: false }), Object.assign({}, ON, { surface: sand, ownRecoil: false, anchor: 'bolted' })]) {
    const r = P.throwObject(ctxOf(1e6 * g, ex), obj('car'), 30), tg = r.toGround;
    console.log('L448 30deg sand', 'ownRecoil', ex.ownRecoil, 'anchor', ex.anchor || 'friction', 'J', sig(tg.J), 'whole', sig(tg.whole), 'J/whole', sig(tg.J / tg.whole), 'cos30', sig(Math.cos(Math.PI / 6)), 'supDown', sig(tg.suppliedDown), 'supSide', sig(tg.suppliedSide), 'recoilV', sig(r.recoilV)); } }
// line 384-385 straight up escape: ownRecoil off gives the same?
{ const a = P.throwObject(ctxOf(1e11 * g, ON), obj('car'), 90).toGround, b = P.throwObject(ctxOf(1e11 * g, Object.assign({}, ON, { ownRecoil: false })), obj('car'), 90).toGround;
  console.log('L384 straight up: ON', JSON.stringify(a), '\n      UB alone', JSON.stringify(b)); }
// line 388-390 toss on sand
{ const sand = surf('sand'); for (const orc of [true, false]) { const c = ctxOf(1e7 * g, Object.assign({}, ON, { surface: sand, ownRecoil: orc })), te = P.tossPartner(c, ollie, 'Ollie', 'easy', 1000, 'friction'), th = P.tossPartner(c, ollie, 'Ollie', 'hard', 1000, 'friction');
  console.log('L388 toss sand ownRecoil', orc, 'easy', JSON.stringify(te.toGroundT), 'hard', JSON.stringify(th.toGroundT)); } }
// line 460-461 gentle toss and catch concrete
{ for (const orc of [true, false]) { const c = ctxOf(1e7 * g, Object.assign({}, ON, { ownRecoil: orc })), t = P.tossPartner(c, ollie, 'Ollie', 'easy', 1000, 'friction');
  console.log('L460 toss conc ownRecoil', orc, 'T', JSON.stringify(t.toGroundT), 'C', JSON.stringify(t.toGroundC)); } }
// line 464-466 lobbed car to bolted Ollie
{ for (const orc of [true, false]) { const c = ctxOf(1e7 * g, Object.assign({}, ON, { ownRecoil: orc })), L = P.catchLeg(c, Object.assign({}, c, { body: ollie, anchor: 'bolted' }), obj('car'), 1000, 'easy');
  console.log('L464 lob ownRecoil', orc, L.result, 'angle', sig(L.angleDeg), 'C', JSON.stringify(L.toGroundC)); } }
// line 473-476 unbounded throw / toss
{ for (const orc of [true, false]) { const c = ctxOf(Infinity, Object.assign({}, ON, { ownRecoil: orc })), r = P.throwObject(c, obj('car'), 90), t = P.tossPartner(c, ollie, 'Ollie', 'hard', 10, 'friction');
  console.log('L473 unbounded ownRecoil', orc, 'throw', JSON.stringify(r.toGround), 'toss', JSON.stringify(t.toGroundT)); } }
// line 518-520 angled unbounded
{ for (const ex of [ON, Object.assign({}, ON, { ownRecoil: false }), Object.assign({}, ON, { ownRecoil: false, anchor: 'bolted' })]) { const r = P.throwObject(ctxOf(Infinity, ex), obj('car'), 45);
  console.log('L518 unbounded 45', 'ownRecoil', ex.ownRecoil, 'anchor', ex.anchor || 'friction', JSON.stringify(r.toGround), 'recoilV', r.recoilV); } }
// line 457-458 only ownRecoil on sand
{ const r = P.throwObject(ctxOf(1e6 * g, { ownRecoil: true, surface: surf('sand') }), obj('car'), 30); console.log('L457', JSON.stringify(r.toGround)); }
// line 364-365 toss
{ const cR = ctxOf(1e6 * g); const tp = P.tossPartner(Object.assign({}, cR, ON), ollie, 'Ollie', 'hard', 10, 'friction'); console.log('L364 toss', tp.result, JSON.stringify(tp.toGroundT), JSON.stringify(tp.toGroundC)); }
