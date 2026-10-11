const { run } = require('./ui.js');
const states = [];
for (const action of ['throw', 'jump', 'stomp', 'punch', 'clap', 'sprint']) {
  for (const s of [{ inf: true }, { logKg: 34 }, { logKg: 25 }]) states.push(Object.assign({ action, mode: 'comic', obj: 'car', angle: 45 }, s));
}
run(states).then((res) => {
  for (const r of res) {
    const lines = r.txt.split('\n').filter((l) => /NaN|Infinity|undefined|∞|light speed|km|magnitude|crater|Quake|°C/.test(l) && !/·\s*\d/.test(l.slice(0, 3)));
    console.log('=== ', JSON.stringify(r.st));
    for (const l of lines) if (!/^(Baseball|Shot put|Toyota|School|M1A2|Boeing|The Moon ·)/.test(l)) console.log('   ', l.slice(0, 300));
    if (r.errs.length) console.log('   ERRORS', r.errs);
  }
});
