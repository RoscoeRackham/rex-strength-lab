// Does the sliceRotated regression test fail on the old (3cd65f5) code?
for (const [name, M] of [['old', require(process.argv[2])], ['new', require(process.argv[3])]]) {
  const w = 200, h = 300, mask = new Uint8Array(w * h);
  for (let y = 100; y < 200; y++) for (let x = 80; x < 120; x++) mask[y * w + x] = 1;
  const k = M.kProfile([[100, 1], [200, 0.5]]);
  const a = M.sliceRotated(mask, w, h, k, 0.001) / M.sliceRows(mask, w, h, k);
  const b = (M.sliceRotated(mask, w, h, k, 30) / M.sliceRows(mask, w, h, k)) / (M.sliceRotated(mask, w, h, 0.75, 30) / M.sliceRows(mask, w, h, 0.75));
  console.log(name, 'tilt 0.001 ratio', a.toFixed(4), '(test wants 1 +/- 0.01)', '| 30 deg profile/flat', b.toFixed(4), '(1 +/- 0.005)');
}
