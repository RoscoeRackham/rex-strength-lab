// Re-runs exactly the limits.json assertion from test/test.js against a settings.json whose
// limit thresholds were changed (arms 30 -> 40 deg, face 100 -> 110 deg) without regenerating limits.json.
const assert = require('assert');
const dir = process.argv[2];
const L = require(dir + '/data/limits.json'), S = require(dir + '/data/settings.json').limits;
assert.strictEqual(L.verdict, S.verdict); assert.strictEqual(L.method, S.method); assert.deepStrictEqual(L.notes, S.notes);
for (const it of L.items) {
  for (const k of ['label', 'short', 'tiny', 'definition']) assert.strictEqual(it[k], S[it.id].text[k]);
  assert.strictEqual(it.headline, S[it.id].headline !== false);
}
console.log('test/test.js limits assertion PASSES with settings arms.angle_deg=' + S.arms.angle_deg + ', face.max_flexion_deg=' + S.face.max_flexion_deg + '; limits.json still says ' + L.definitions.arms_angle_deg + ' / ' + L.definitions.max_flexion_deg + ', arms score ' + L.items[0].score);
