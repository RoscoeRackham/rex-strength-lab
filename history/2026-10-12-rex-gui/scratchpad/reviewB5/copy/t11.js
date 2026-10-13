const run = require('./h.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const cases = [];
for (const mv of ['push', 'shove', 'throw']) {
  cases.push({ id: 'wr-' + mv + '-def', tab: 'wrestle', state: { wrestleMove: mv } });
  cases.push({ id: 'wr-' + mv + '-def-allout', tab: 'wrestle', state: { wrestleMove: mv }, pick: 'allout' });
  cases.push({ id: 'wr-' + mv + '-off-allout', tab: 'wrestle', state: { wrestleMove: mv, ...OFF }, pick: 'allout' });
}
run(cases).then(()=>{});
