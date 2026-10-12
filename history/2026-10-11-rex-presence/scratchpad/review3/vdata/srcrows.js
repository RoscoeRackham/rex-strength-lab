global.window = {};
const L = '/home/user/rex-strength-lab/rex-strength-lab/';
require(L + 'src/data.js');
const D = window.DINO_DATA;
const F = Object.fromEntries(require(L + 'research/final-presence.json').facts.map((f) => [f.key, f]));
const keys = ['growth_worked_krakatoa', 'growth_worked_chicxulub', 'growth_worked_sun_second', 'growth_brief_number_check', 'comic_layperson_centrifuge_tolerance', 'comic_passenger_onset_rate_limits', 'vib_pisa_vs_empirical_laws'];
const rows = D.sourceRows || D.sources || D.rows;
console.log(Object.keys(D).join(' '));
const pk = Object.keys(F).filter((k) => /growth_worked|growth_brief|centrifuge|onset_rate|pisa_vs_empirical/.test(k));
for (const k of pk) {
  const f = F[k];
  const row = D.sourceRows.find((r) => r.value === f.display);
  console.log('\n## ' + k + ' [' + f.status + '] ' + f.sources.length + ' sources');
  console.log('  display:', f.display.slice(0, 400));
  console.log('  row shows:', row ? row.sources.map((s) => s.title.slice(0, 80)).join(' || ') : 'NO ROW FOUND');
  console.log('  all:', f.sources.map((s, i) => (i + 1) + '. ' + s.title.slice(0, 90)).join(' || '));
}
