# Page mutants for pull request 5's shots.js block: each copies the lab, reverts or breaks one part of the page build,
# rebuilds, runs `node test/shots.js --pr5`, and records which of the block's checks fail.
# python3 mutants.py [name ...]   (results in results.json and results.md beside this file)
import json, os, shutil, subprocess, sys, time
LAB = '/home/user/rex-strength-lab/rex-strength-lab'
HERE = os.path.dirname(os.path.abspath(__file__))
APP, CARDS = 'src/app.html', 'src/static-data.js'
M = [
  # (name, what it breaks, the check it guards, [(file, old, new)])
  ('no-tile-stomp', 'the Stomp tab without its Shimmer tile', 'solo-tiles', [(APP, "r.vBody > 0.5 ? speedOnly(r.vBody) : ''),\n      shimmerTile(tb)));", "r.vBody > 0.5 ? speedOnly(r.vBody) : '')));")]),
  ('tile-first-throw', 'the Throw tab\'s tile first in its row, not last', 'solo-tiles', [(APP, "    out.push(tiles(\n      speedTile('Launch speed', r.v, [fmtMach(r.v)", "    out.push(tiles(\n      shimmerTile(tb),\n      speedTile('Launch speed', r.v, [fmtMach(r.v)"), (APP, "          : bolted ? 'bolted down' : 'push aimed so steeply down his feet can’t slide'),\n      shimmerTile(tb)));", "          : bolted ? 'bolted down' : 'push aimed so steeply down his feet can’t slide')));")]),
  ('no-ladder-wording', 'the tile without the ladder\'s comparison', 'solo-tiles', [(APP, "', from ' + partsOf(b) + ' · ' + lad.compare(b.E, refs).text;", "', from ' + partsOf(b);")]),
  ('tile-when-zero', 'a tile where nothing is taken back (the E > 0 guard gone)', 'powers-off', [(APP, "    if (!tb || !(tb.E > 0)) return null;\n    const refs = D.energyRefs, lad = window.EnergyLadder;", "    if (!tb) return null;\n    const refs = D.energyRefs, lad = window.EnergyLadder;")]),
  ('glow-never-hidden', 'the glow layer never hidden (drawn at strength 0 too)', 'powers-off', [(APP, "    layer.hidden = !(s > 0);", "    layer.hidden = false;")]),
  ('no-tile-collide', 'Collide without its Shimmer tile', 'duo-tiles', [(APP, "'it would take ' + fmtDuration(r.earth.t1mm) + ' to move 1 mm') : null,\n      shimmerTile(tb, { duo: true })));", "'it would take ' + fmtDuration(r.earth.t1mm) + ' to move 1 mm') : null));")]),
  ('level-total', 'the tile\'s level from both of them together, not Rex\'s take', 'duo-tiles', [(APP, "    const gl = lad.glow(tb.by.rex.E, refs);", "    const gl = lad.glow(tb.E, refs);")]),
  ('who-unnamed', 'the two-player lines without who takes it in', 'duo-who', [(APP, "      return (o.duo ? NAME[w] + ' takes in ' + jT(b.E) : jT(b.E) + ' taken in')", "      return (false ? NAME[w] + ' takes in ' + jT(b.E) : jT(b.E) + ' taken in')")]),
  ('ollie-note-missing', 'no note that canon gives the shimmer to Rex', 'duo-who', [(APP, "      + (o.duo && tb.by.ollie.E > 0 ? ' Canon gives the shimmer to Rex; whether Ollie shows what he takes in is still to be ruled.' : '');", "      + '';")]),
  ('catch-return-always', 'the game of catch counting the return leg after any outcome', 'duo-who', [(APP, "const tb = takenBack('catch', backThrow ? { a, b } : { a },", "const tb = takenBack('catch', { a, b },")]),
  ('no-weight-tile', 'the growth what-if without its tile', 'weight', [(APP, "    if (st) box.append(tiles(st));", "")]),
  ('weight-three-figures', 'the growth what-if\'s rough energy to three figures', 'weight', [(APP, "    const st = shimmerTile(tb, { rough: ref.rough });", "    const st = shimmerTile(tb, {});")]),
  ('infinity-in-tile', 'an unbounded energy printed as a figure (∞ J)', 'unbounded', [(APP, "    const jT = (J) => (!isFinite(J) ? 'unbounded' :", "    const jT = (J) => (!isFinite(J) ? fmtSI(J, 'J') :"), (APP, "      if (!isFinite(b.E)) return (o.duo ? NAME[w] + ' takes in unbounded energy' : 'Unbounded energy taken in') + ', from ' + partsOf(b) + ': unlimited strength has no physical answer here, so there is no figure.';\n", "")]),
  ('glow-not-aria-hidden', 'the glow layers without aria-hidden', 'a11y', [(APP, '<div class="glow" id="hero-glow" aria-hidden="true" hidden></div>', '<div class="glow" id="hero-glow" hidden></div>'), (APP, "      const layer = el('div', { class: 'glow', 'aria-hidden': 'true' }, glowSpots(glow.spots));", "      const layer = el('div', { class: 'glow' }, glowSpots(glow.spots));")]),
  ('tile-aria-hidden', 'the tile hidden from screen readers', 'a11y', [(APP, "    const t = el('div', { class: 'tile shimmer' },", "    const t = el('div', { class: 'tile shimmer', 'aria-hidden': 'true' },")]),
  ('header-not-following', 'the header glow not set from Rex\'s tab', 'follows', [(APP, "      if (!duo) setGlow($('#hero-glow'), shimmerSeen ? shimmerSeen.by.rex.E : 0);\n", "")]),
  ('collide-art-total', 'the Collide picture glowing with both takes, not Rex\'s', 'follows', [(APP, "    out.push(unstoppableArt(tb.by.rex.E));", "    out.push(unstoppableArt(tb.E));")]),
  ('catch-heat-text', 'the catch saying its energy ends up as heat in his plush with the power on', 'copy', [(APP, "    const keptC = !!a.recoilAbsorbedC &&", "    const keptC = false &&")]),
  ('toss-heat-text', 'the partner toss saying its energy ends up as heat in his plush with the power on', 'copy', [(APP, "      tb.parts.catch > 0 ? 'Stopping him frees '", "      false ? 'Stopping him frees '")]),
  ('collide-not-drawn', 'Collide\'s hit tile saying the shimmer isn\'t drawn yet', 'copy', [(APP, "' · taken back by default (the Shimmer tile)';", "' · taken back by default (canon: it shows as his shimmer, not drawn here yet)';")]),
  ('fireball-not-drawn', 'the fireball saying the shimmer isn\'t drawn yet', 'copy', [(APP, "canon takes a hit’s freed energy back by default, so that part goes to the endless ocean (the Shimmer tile counts it), unless he means it (a blast preset).", "canon takes a hit’s freed energy back by default (it shows as his shimmer, which the lab doesn’t draw yet), so that part goes to the endless ocean, unless he means it (a blast preset).")]),
  ('throw-drag-note', 'the Throw tab\'s drag-free item without the shimmer\'s figure', 'copy', [(APP, "      const dragShimmer = dragJ > 0 ?", "      const dragShimmer = false ?")]),
  ('stop-motion', 'Collide\'s carry without the charger\'s motion going to his source', 'copy', [(APP, "', and his motion, ' + stopE + ', go to his source too), and '", "', goes to his source too), and '")]),
  ('spots-shifted', 'the glows moved off his features (15% of the width to the right)', 'glow-features', [(APP, "style: 'left:' + 100 * p.x + '%;", "style: 'left:' + 100 * (p.x + 0.15) + '%;")]),
  ('spots-huge', 'glows five times as wide, over the background and spires', 'glow-features', [(APP, ";width:' + 200 * p.rx + '%;height:' + 200 * p.ry + '%' }", ";width:' + 1000 * p.rx + '%;height:' + 1000 * p.ry + '%' }")]),
  ('no-overflow-hidden', 'the picture boxes not clipping the glow', 'layout', [(APP, ".glow-art { position: relative; overflow: hidden; display: block; }", ".glow-art { position: relative; display: block; }")]),
  ('box-wider-390', 'at 480 px and below, the Collide picture\'s box wider than its image', 'layout', [(APP, ".art-figure img, .art-figure .glow-art { max-width: 260px; }", ".art-figure img { max-width: 260px; }")]),
  ('tile-too-wide', 'the tile wider than a phone (it pushes the page sideways)', 'no-scroll', [(APP, ".tile.shimmer { grid-column: 1 / -1; }", ".tile.shimmer { grid-column: 1 / -1; min-width: 480px; }")]),
  ('animation-unguarded', 'the shimmer animated outside the reduced-motion guard', 'motion', [(APP, "  .glow i { animation: shimmer 2.6s ease-in-out infinite alternate; } .glow i:nth-child(3n + 1) { animation-delay: -0.9s; } .glow i:nth-child(3n + 2) { animation-delay: -1.8s; } @keyframes shimmer { from { opacity: 1; } to { opacity: 0.7; } } }", "  }\n.glow i { animation: shimmer 2.6s ease-in-out infinite alternate; } @keyframes shimmer { from { opacity: 1; } to { opacity: 0.7; } }")]),
]
def run(m):
  name, what, guards, edits = m
  d = os.path.join(HERE, name)
  if os.path.exists(d): shutil.rmtree(d)
  shutil.copytree(LAB, d, ignore=shutil.ignore_patterns('shots', 'preview.html'))
  cards = False
  for f, old, new in edits:
    p = os.path.join(d, f); s = open(p, encoding='utf-8').read()
    n = s.count(old)
    if n != 1: return dict(name=name, what=what, guards=guards, error='edit matched %d times: %s' % (n, old[:80]))
    open(p, 'w', encoding='utf-8').write(s.replace(old, new)); cards = cards or f == CARDS
  if cards: subprocess.run(['python3', 'build-data.py'], cwd=d, check=True, capture_output=True)
  subprocess.run(['node', 'build.js'], cwd=d, check=True, capture_output=True)
  t0 = time.time()
  r = subprocess.run(['node', 'test/shots.js', '--pr5'], cwd=d, capture_output=True, text=True, timeout=900)
  log = r.stdout + r.stderr
  open(os.path.join(HERE, name + '.log'), 'w').write(log)
  f = json.loads(subprocess.run(['node', os.path.join(HERE, 'fails.js'), os.path.join(HERE, name + '.log')], capture_output=True, text=True).stdout)
  shutil.rmtree(d)
  return dict(name=name, what=what, guards=guards, failed=f['failed'], crashed=f['crashed'], exit=r.returncode, seconds=round(time.time() - t0), guardFails=guards in f['failed'])
if __name__ == '__main__':
  pick = sys.argv[1:]
  out = []
  for m in M:
    if pick and m[0] not in pick: continue
    res = run(m); out.append(res); print(json.dumps(res), flush=True)
  json.dump(out, open(os.path.join(HERE, 'results.json'), 'w'), indent=1)
  with open(os.path.join(HERE, 'results.md'), 'w') as fh:
    fh.write('| Mutant | What it breaks | Guarded by | Fails it | All checks that fail |\n|---|---|---|---|---|\n')
    for x in out: fh.write('| `%s` | %s | %s | %s | %s |\n' % (x['name'], x['what'], x['guards'], 'yes' if x.get('guardFails') else 'NO' + (' (' + x.get('error', '') + ')' if x.get('error') else ''), ', '.join(x.get('failed', []))))
