const run = require('./h.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const tabs = process.argv[2].split(',');
const cases = [];
for (const t of tabs) {
  cases.push({ id: t + '-def-least', tab: t, state: {} });
  cases.push({ id: t + '-def-allout', tab: t, state: {}, pick: 'allout' });
  cases.push({ id: t + '-off-allout', tab: t, state: OFF, pick: 'allout' });
}
run(cases).then(() => {});
