import sys
def patch(p, pairs):
    s=open(p).read()
    for old,new in pairs:
        n=s.count(old)
        if n!=1: sys.exit('%s: count %d for %s'%(p,n,old[:140]))
        s=s.replace(old,new)
    open(p,'w').write(s)

patch('/home/user/dino-strength-sim/build-data.py', [
 # N5: who attributions say where the figure comes from
 ("who='Secret Wars #4 (1984): 150 billion tons',", "who='Secret Wars #4 (1984): 150 billion tons, per press accounts',"),
 ("note='Quoted from Reed Richards in press accounts; the panel itself was not seen.'", "note='Quoted from Reed Richards; the panel itself was not seen.'"),
 ("who='All-Star Superman #1 (2005): 200 quintillion tons',", "who='All-Star Superman #1 (2005): 200 quintillion tons, per reviews',"),
 ("note='Issue and exact wording rest on reviews; it may be a force rather than a literal object.'", "note='The issue and exact wording are unconfirmed; it may be a force rather than a literal object.'"),
 # N4: don't assert what an unseen panel says
 ("liftNote='The comic never says what the load is. It is about", "liftNote='None of the accounts we found say what the load is. It is about"),
 # N2/N10: real vs comic shares
 ("Share of full strength: shove 52% per hand, whip/punch/clap 30%, stomp 50%, legs 140% (they also carry his body weight).', [], st='estimate')",
  "Real muscle, share of full strength from a standstill: shove 52% per hand, whip/punch/clap 30%, stomp 50%, legs 140% (they also carry his body weight). Comic book, fixed shares fitted so both modes match record athletes: shove 17% per hand, whip 7%, punch 6%, clap 7%, stomp 13%, legs 66%.', [], st='estimate')\n"
  "row('Body shape and air (assumed)', 'At 2 m (areas scale with height², lengths with height): drag Cd 1.0; frontal area 0.8 m² when sprinting, 0.3 m² head-first when jumping or launched by a stomp; claw dig area 0.2 m² when braced (a quarter of that per stride when sprinting); release height 0.9 × height; each sprint stride puts about 2.5× his weight on one foot. Overarm whip: effective mass at the hand 0.3% of body mass, fitted with the whip speed to the 47.3 m/s pitch; that is smaller than Dempster’s hand alone (0.6%) and is not a measured segment.', [], st='estimate')"),
 # N6: hurdle card says it switches models
 ("Runs the jump at the strength it needs (20 stories ≈ 60 m).', ['action_comics_1_leap'],",
  "Switches to Comic book mode and runs the jump at the strength it needs (20 stories ≈ 60 m). A 2 m Rex on real muscle tops out near 7 m.', ['action_comics_1_leap'],"),
 # N3: Milo card links both accounts
 ("def feat(group, title, who, claim, keys, run=None, st=None):\n    k = keys[0] if keys else None\n    s = st or (status(*keys) if keys else 'estimate')\n    first = fact(k)['sources'][0] if k else None\n    return dict(group=group, title=title, who=who, claim=claim, status=s,\n                source={'url': first['url'], 'title': 'Source'} if first else None, run=run)",
  "def feat(group, title, who, claim, keys, run=None, st=None, src_title='Source', also=None):\n    k = keys[0] if keys else None\n    s = st or (status(*keys) if keys else 'estimate')\n    first = fact(k)['sources'][0] if k else None\n    return dict(group=group, title=title, who=who, claim=claim, status=s,\n                source={'url': first['url'], 'title': src_title} if first else None, run=run,\n                also=[{'url': fact(k2)['sources'][0]['url'], 'title': t} for k2, t in (also or [])])"),
 ("No weight is recorded.', ['milo_of_croton_calf_training', 'milo_of_croton_bull']),",
  "No weight is recorded.', ['milo_of_croton_calf_training', 'milo_of_croton_bull'],\n         src_title='Quintilian', also=[('milo_of_croton_bull', 'Athenaeus')]),"),
])

patch('/home/user/dino-strength-sim/src/static-data.js', [
 ("Every other move uses a set share of it, except the jump, which drives with 1.4× because the legs push his own body as well (a lifting record counts only the bar).",
  "Each move drives with a set share of it, and the shares differ between the two muscle models (Show the math gives each one). With real muscle the share is the most the limb can push from a standstill, falling as the limb speeds up; the legs get up to 1.4× because they also carry his body (a lifting record counts only the bar). Comic mode keeps one smaller share per move at every speed, fitted so both modes match record athletes (66% for the jump)."),
 ("(1.6 m shove, 2.2 m overarm throw, 0.7 m punch, 0.5 m leg drive)", "(1.6 m shove, 2.2 m overarm throw, 0.7 m punch, 0.5 m leg drive, 0.6 m stomp, 0.5 m clap; all at 2 m, scaling with height)"),
 ("non-rotating round Earth; above 150 km the arc is solved exactly.", "non-rotating round Earth; above 150 km the arc is solved exactly as an Earth-only Kepler arc (no Moon or Sun pull, so arcs past the Moon’s orbit are rough)."),
 ("Real soils, pavement and slabs run from about half to three times these values;", "Real soils, pavement and slabs run from about half to three times these values; lake ice is set at the bottom of its 5–25 MPa crushing strength (colder, faster-loaded ice is up to 5× stronger), and a floating sheet can snap in bending under far less total load, which is not modelled;"),
])
print('ok')
