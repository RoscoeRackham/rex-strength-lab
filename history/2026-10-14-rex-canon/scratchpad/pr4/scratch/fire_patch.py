p='src/engine.js'
s=open(p,encoding='utf-8').read()
def rep(old,new):
    global s
    assert s.count(old)==1, old[:80]
    s=s.replace(old,new)
rep("""    // kIn (Air resistance absorbed): the share of the air's drag that still acts. The heat made in the air between them
    // is that share of the snowplow's (the brief's rule); the rest of the energy rides on with the object and is freed
    // when it stops at him, as before.
    function fireballAt(obj, v, D, ctxC, Eknown, kIn, kept) {""","""    // kIn (Air resistance absorbed): the share of the air's drag that still acts. The heat made in the air between them
    // is that share of the snowplow's (the brief's rule); the rest of the energy rides on with the object and is freed
    // when it stops at him, as before.
    // Never knocked back (the catcher's ctxC.noKnockback; BRIEF-canon.md item 4, decision 13 of pull request 4; canon:
    // incoming hits are absorbed, "he is never knocked back"): what reaches him here isn't caught (no hands catch plasma),
    // so it is an incoming hit outside a contest: he isn't moved, and its whole momentum goes to the endless ocean,
    // bolted or not (the power wins over Bolted, as They take their own recoil does for his own moves). Reported only
    // then: knockAbsorbed { J kg m/s: its momentum (Infinity unbounded), the way it was moving; E J: the motion energy
    // freed where he stands that is taken back (canon: "A hit's freed energy is absorbed by default (it shows in his
    // shimmer) and is real only when he means it"): the lump's motion as it reaches him, E - Egap, or 0 when he means it
    // (ctxC.meanIt: the page's blast presets) }. Then push = { recoilV: 0, earthRecoilV: 0 }, Eafter = Ecarry = Enear = 0,
    // Ehere = E (everything is freed where he stands: Egap, the heat made in the air on the way, real; and the motion, as
    // knockAbsorbed says), and Eblast (the real part near him) = Egap, plus the motion when he means it; a 'before'
    // fireball's overpressure uses Eblast too. With the switch off (or left out), as before: he and the lump move off
    // together (bolted, the Earth takes it).
    function fireballAt(obj, v, D, ctxC, Eknown, kIn, kept) {""")
rep("""      const body = ctxC.body, bolted = ctxC.anchor === 'bolted';
      if (kind === 'before') {
        // the fireball keeps rushing toward him; a point blast at the sweep distance is an order of magnitude, probably low
        const r = Math.max(D - (kAir < 1 ? out.sweepK : sweep), body.H); out.rBlast = r; out.overpressure = isFinite(E) ? overpressureAt(E, r) : Infinity;
      }""","""      const body = ctxC.body, bolted = ctxC.anchor === 'bolted', nkb = !!ctxC.noKnockback;
      // Never knocked back: the real energy near him (the air's heat, and the motion when he means it)
      const Ereal = nkb ? Egap + (ctxC.meanIt ? Earr : 0) : E;
      if (kind === 'before') {
        // the fireball keeps rushing toward him; a point blast at the sweep distance is an order of magnitude, probably low
        const r = Math.max(D - (kAir < 1 ? out.sweepK : sweep), body.H); out.rBlast = r; out.overpressure = isFinite(Ereal) ? overpressureAt(Ereal, r) : Infinity;
      }""")
rep("""      out.push = { recoilV: bolted ? 0 : momentumToV(p, body.m + mLump), earthRecoilV: bolted ? p / K.M_E : 0 };""",
"""      out.push = nkb ? { recoilV: 0, earthRecoilV: 0 } : { recoilV: bolted ? 0 : momentumToV(p, body.m + mLump), earthRecoilV: bolted ? p / K.M_E : 0 };
      if (nkb) out.knockAbsorbed = { J: p, E: ctxC.meanIt ? 0 : Earr };""")
rep("""      const Eafter = !isFinite(p) || !isFinite(mLump) ? Infinity : momentumToKE(p, bolted ? K.M_E : body.m + mLump);
      out.Ehere = isFinite(E) ? Math.max(0, E - Eafter) : Infinity;
      out.Eafter = Eafter;
      out.Ecarry = bolted ? 0 : Eafter;
      out.Enear = 0;
      if (!bolted && isFinite(Eafter)) {""","""      const Eafter = nkb ? 0 : !isFinite(p) || !isFinite(mLump) ? Infinity : momentumToKE(p, bolted ? K.M_E : body.m + mLump);
      out.Ehere = isFinite(E) ? Math.max(0, E - Eafter) : Infinity;
      out.Eafter = Eafter;
      out.Ecarry = bolted || nkb ? 0 : Eafter;
      out.Enear = 0;
      if (!bolted && !nkb && isFinite(Eafter)) {""")
rep("""      out.Eblast = kind === 'before' ? E : out.Ehere + out.Enear;""","""      out.Eblast = nkb ? Ereal : kind === 'before' ? E : out.Ehere + out.Enear;""")
open(p,'w',encoding='utf-8').write(s)
print('ok')
