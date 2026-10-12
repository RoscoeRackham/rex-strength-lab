const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
for (const sid of ['sand','concrete','softclay','granite']) for (const e of [0, 0.5, 1]) {
  const st = P.walkStep(rex, surf(sid), { pace: 'walk', effort: e });
  const parts = st.src.map(s => [1,3,5,20,60].map(d => (P.ppvAt(s, d)*1000).toPrecision(2)).join('/'));
  console.log(sid, 'e', e, 'Fpulse/W', (st.Fpulse/st.W).toFixed(2), 'T', st.Tpulse.toFixed(4), 'ramp', st.kLoad.toFixed(2), st.tRamp.toFixed(3), '| hann mm/s @1/3/5/20/60', parts[0], '| ramp', parts[1], '| footprint', JSON.stringify(st.footprint), 'pressure kPa', (st.pressure/1e3).toFixed(0), 'peak', (st.peakPressure/1e3).toFixed(0), 'q', (st.q/1e3).toFixed(0));
}
const st = P.walkStep(rex, surf('sand'), {pace:'walk', effort:0.5});
console.log('v', st.v, 'steprate', st.stepRate, 'stance', st.stance, 'Eimp', st.Eimp, 'heelV', st.heelV, 'heelT', st.heelT);
// elephant comparison
for (const d of [5,20,100]) console.log('elephant', d, P.elephantPPV(d)*1000, 'rex sand ordinary', P.presence(rex, surf('sand'), {pace:'walk', effort:0.5}).ppv(d)*1000, 'soft', P.presence(rex, surf('sand'), {pace:'walk', effort:0}).ppv(d)*1000, 'stroll soft', P.presence(rex, surf('sand'), {pace:'stroll', effort:0}).ppv(d)*1000);
