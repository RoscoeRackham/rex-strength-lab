import sys
p = sys.argv[1]
s = open(p, encoding='utf8').read()
old_tile = "r.groundFails ? tile('Energy into the ground', fmtSI(r.Eground, 'J'), fmtTNT(r.Eground)) : null,"
new_tile = "r.groundFails ? tile('Energy into the ground', (footCapped ? 'at least ' : '') + fmtSI(r.Eground, 'J'), r.Eground >= K.EARTH_BIND ? 'enough to blow Earth apart' : fmtTNT(r.Eground)) : null,"
assert s.count(old_tile) == 1
s = s.replace(old_tile, new_tile)
old_b = "if (r.groundFails) items.push('His feet punch into the ground at ' + speedOnly(r.push.vB) + '."
new_b = "if (r.groundFails) items.push('His feet punch into the ground at ' + (footCapped ? 'at least 1% of light speed (past that the ground model stops, so the energy below is a lower bound)' : speedOnly(r.push.vB)) + '."
assert s.count(old_b) == 1
s = s.replace(old_b, new_b)
old_q = "fmtTNT(r.Eground) + (r.groundQuake > 2 ? ' (a magnitude ' + sig(r.groundQuake, 2) + ' quake)' : '') + '.');"
new_q = "fmtTNT(r.Eground) + (r.Eground >= K.EARTH_BIND ? ', more than it takes to blow Earth apart (' + fmtSI(K.EARTH_BIND, 'J') + '), so a quake magnitude means nothing' : r.groundQuake > 2 ? ' (a magnitude ' + sig(r.groundQuake, 2) + ' quake)' : '') + '.');"
assert s.count(old_q) == 1
s = s.replace(old_q, new_q)
old_decl = "    const items = [];\n    if (r.heldBack) items.push('The ground is the limit."
assert s.count(old_decl) == 1
# footCapped must be declared before tiles; insert after 'const out = [];' inside bayJump
anchor = "const rFree = !c.groundHolds && (r.groundFails || r.heldBack) ? P.jump(Object.assign({}, c, { groundHolds: true })) : null;"
assert s.count(anchor) == 1
s = s.replace(anchor, anchor + "\n    const footCapped = isFinite(r.F) && r.groundFails && r.push.vB >= 0.01 * K.c * (1 - 1e-9);")
open(p, 'w', encoding='utf8').write(s)
print('ok')
