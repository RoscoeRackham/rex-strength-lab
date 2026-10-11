// Mock data for the design mockup only. Heights, weights and girths come from builds.json;
// body-fat ranges are MOCK assumptions for the mockup, not research.
const fs = require('fs');
const b = require('/home/user/rex-strength-lab/build-calculator/data/builds.json');
const duo = JSON.parse(fs.readFileSync(__dirname + '/duo-paths.json', 'utf8'));
const BF = { // working, low, high (percent) - MOCK
  ansur2_m_p5: [18, 12, 25], ansur2_m_p50: [22, 15, 30], ansur2_m_p95: [28, 20, 35], ansur2_m_leanheavy: [15, 10, 20],
  ansur2_m_largest_arm: [25, 18, 32], nhanes_m_median: [28, 20, 35],
  chappell2019_natural_pro: [8, 5, 12], kouri1995_nonusers: [13, 10, 16], mr_america_1938_1954_mean: [9, 6, 12], steve_reeves_1947: [9, 6, 12],
  sukwong2022_thai_elite: [17.6, 15.6, 19.6], mcinnis1999_bodybuilders: [8, 6, 10], withers1997_elite: [5, 4, 6.5], fry1991_nonelite: [9.3, 7.5, 11],
  demoraes2019_br_national: [6, 4, 9],
  brian_shaw: [17.6, 15, 22], hafthor_bjornsson: [20, 15, 28], eddie_hall: [22, 15, 30], lasha_talakhadze: [25, 18, 32], kraemer2020_strongmen: [18.7, 16, 21.5],
  bruce_banner: [15, 10, 22], kingpin: [20, 10, 35]
};
const SHORT = {
  ansur2_m_p5: 'US Army men, 5th percentile', ansur2_m_p50: 'US Army men, median', ansur2_m_p95: 'US Army men, 95th percentile',
  ansur2_m_leanheavy: "Army 'lean but heavy' men", ansur2_m_largest_arm: 'Army man with the largest arm', nhanes_m_median: 'US men, median (NHANES)',
  chappell2019_natural_pro: 'Natural pro bodybuilders (Chappell)', kouri1995_nonusers: 'Drug-free lifters (Kouri 1995)', mr_america_1938_1954_mean: 'Mr. America 1938–54, mean',
  steve_reeves_1947: 'Steve Reeves (1947)', ronnie_coleman: 'Ronnie Coleman', arnold_schwarzenegger: 'Arnold Schwarzenegger', dorian_yates: 'Dorian Yates', jay_cutler: 'Jay Cutler',
  phil_heath: 'Phil Heath', big_ramy: "Big Ramy", sergio_oliva: 'Sergio Oliva', demoraes2019_br_national: 'Brazilian national bodybuilders', sukwong2022_thai_elite: 'Thai national-team bodybuilders',
  mcinnis1999_bodybuilders: 'Bodybuilders (McInnis 1999)', withers1997_elite: 'Elite bodybuilders, contest week', fry1991_nonelite: 'Non-elite bodybuilders (Fry 1991)',
  brian_shaw: 'Brian Shaw', hafthor_bjornsson: 'Hafthor Bjornsson', eddie_hall: 'Eddie Hall', lasha_talakhadze: 'Lasha Talakhadze', kraemer2020_strongmen: 'Elite strongmen (Kraemer 2020)',
  hulk_savage: 'Hulk (savage)', hulk_grey: 'Hulk (grey)', hulk_marvelcom: 'Hulk (Marvel.com)', thing: 'The Thing', colossus_human: 'Colossus (human form)', colossus_armored: 'Colossus (armoured)',
  captain_america: 'Captain America', bruce_banner: 'Bruce Banner', black_panther: 'Black Panther', luke_cage: 'Luke Cage', wolverine: 'Wolverine'
};
const FLAG = { thing: ['upper', 'Body is rock: part of the weight is not muscle. True score is lower.'],
  colossus_armored: ['upper', 'Armoured form is steel: not comparable with muscle.'],
  thor: ['denser', 'Asgardian tissue is said to be denser than human. The score may be overstated.'],
  wolverine: ['excluded', 'Not scored: his adamantium skeleton adds unknown weight.'] };
const groupBF = { 'Bodybuilders': [5, 3, 8], 'Comic characters': [10, 6, 15] };
const out = [];
for (const x of b.builds) {
  if (x.sex !== 'M' || x.group === 'Rex and Ollie') continue;
  let bf = BF[x.id] || groupBF[x.group];
  const bfs = x.body_fat_pct && x.body_fat_pct.value != null ? x.body_fat_pct.status : 'estimate';
  const g = {};
  for (const [k, v] of Object.entries(x.girths || {})) g[k] = { v: v.value_m, s: v.status };
  out.push({ id: x.id, name: SHORT[x.id] || x.name, full: x.name, group: x.group, h: x.height_m.value, hs: x.height_m.status,
    w: x.weight_kg.value, ws: x.weight_kg.status, bf, bfs, g, flag: FLAG[x.id] || null });
}
out.push({ id: 'rex', name: 'Rex', full: 'Rex', group: 'Rex and Ollie', h: 2.85, hs: 'estimate', w: 2700, ws: 'derived', bf: [7.5, 5, 10], bfs: 'estimate', g: {},
  mock: { S: [151, 160, 168], F: [262, 277, 290] }, art: duo.rex, note: 'Tail excluded from the score. Skull-top height measured from art (mock).' });
out.push({ id: 'ollie', name: 'Ollie', full: 'Ollie', group: 'Rex and Ollie', h: 2.90, hs: 'estimate', w: 2700, ws: 'derived', bf: [7.5, 5, 10], bfs: 'estimate', g: {},
  mock: { S: [170, 180, 189], F: [271, 287, 300] }, art: duo.ollie, note: 'Tail excluded from the score. Horns not counted in height (mock).' });
fs.writeFileSync(__dirname + '/mockdata.json', JSON.stringify(out));
console.log(out.length, 'builds;', fs.statSync(__dirname + '/mockdata.json').size, 'bytes');
