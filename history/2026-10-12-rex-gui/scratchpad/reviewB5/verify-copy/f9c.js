const run = require('./harness.js');
run([
  { id: 'pullNim', tab: 'pull', state: { obj: 'nimitz', surface: 'granite', logKg: 14, m: 3e9, ownRecoil: false }, pick: 'allout' },
  { id: 'pullNimOn', tab: 'pull', state: { obj: 'nimitz', surface: 'granite', logKg: 14, m: 3e9, ownRecoil: true }, pick: 'allout' },
]).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay.split("\n").filter(l=>l.trim()).filter(l => !/ · [0-9.,]+ (k?g|t)$|^[A-Z].* · /.test(l)).join("\n")); } });
