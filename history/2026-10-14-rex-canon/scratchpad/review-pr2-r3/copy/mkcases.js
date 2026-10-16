const fs = require('fs');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const cfg = { D: {}, B: { anchor: 'bolted' }, RO: { ownRecoil: false }, ROB: { ownRecoil: false, anchor: 'bolted' }, OFF, OFFB: Object.assign({ anchor: 'bolted' }, OFF) };
const solo = ['throw', 'stomp', 'punch', 'pull', 'lift', 'jump', 'clap', 'sprint', 'walk', 'weight'];
const efforts = [null, 'allout', 'rattle', 'plaster', 'ground'];
const cases = [];
for (const t of solo) for (const [k, c] of Object.entries(cfg)) for (const e of efforts) {
  if ((t === 'lift' || t === 'walk' || t === 'weight') && e) continue;
  cases.push({ id: `${t}-${k}-${e || 'least'}`, state: Object.assign({ action: t }, c), effort: e || undefined });
}
fs.writeFileSync('cases-solo.json', JSON.stringify(cases));
// duo
const duo = [];
const dviews = {
  arm: { duoAction: 'arm' },
  push: { duoAction: 'wrestle', wrestleMove: 'push' },
  shove: { duoAction: 'wrestle', wrestleMove: 'shove' },
  shoveO: { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'ollie' },
  shoveBoth: { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' },
  wlift: { duoAction: 'wrestle', wrestleMove: 'lift' },
  wthrow: { duoAction: 'wrestle', wrestleMove: 'throw' },
  ballE: { duoAction: 'catch', cObj: 'baseball', cStyle: 'easy' },
  ballH: { duoAction: 'catch', cObj: 'baseball', cStyle: 'hard' },
  busH: { duoAction: 'catch', cObj: 'bus', cStyle: 'hard' },
  car: { duoAction: 'catch', cObj: 'car' },
  semi: { duoAction: 'catch', cObj: 'semi' },
  partner: { duoAction: 'catch', cObj: 'partner' },
  partnerH: { duoAction: 'catch', cObj: 'partner', cStyle: 'hard' },
  collide: { duoAction: 'collide' },
};
const dcfg = { D: {}, OB: { oAnchor: 'bolted' }, BB: { anchor: 'bolted', oAnchor: 'bolted' }, RO: { ownRecoil: false }, OFF, OFFBB: Object.assign({ anchor: 'bolted', oAnchor: 'bolted' }, OFF) };
for (const [v, s] of Object.entries(dviews)) for (const [k, c] of Object.entries(dcfg)) for (const e of [null, 'allout', 'plaster', 'ground']) {
  duo.push({ id: `${v}-${k}-${e || 'least'}`, state: Object.assign({ duoOpen: true }, s, c), effort: e || undefined });
}
fs.writeFileSync('cases-duo.json', JSON.stringify(duo));
console.log(cases.length, duo.length);
