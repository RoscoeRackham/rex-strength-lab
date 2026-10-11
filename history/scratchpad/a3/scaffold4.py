import sys
p='/home/user/dino-strength-sim/src/app.html'; s=open(p).read()
def R(old,new,count=1):
    global s
    n=s.count(old)
    if n!=count: sys.exit('count %d != %d for: %s'%(n,count,old[:160]))
    s=s.replace(old,new)
R("""$('#' + pre + (pre ? 'mass' : 'mass')).value""", """$('#' + pre + 'mass').value""")
R("""    { id: 'pull', label: 'Pull' },
  ];""","""    { id: 'pull', label: 'Pull' },
    { id: 'weight', label: 'Weight', title: 'What his density does just standing there' },
  ];
  const DUO_ACTIONS = [
    { id: 'arm', label: 'Arm wrestle' },
    { id: 'wrestle', label: 'Wrestle' },
    { id: 'catch', label: 'Catch' },
    { id: 'collide', label: 'Collide', title: 'Unstoppable force vs immovable object' },
  ];""")
R("""  const BAYS = { lift: bayLift, throw: bayThrow, jump: bayJump, stomp: bayStomp, punch: bayPunch, clap: bayClap, sprint: baySprint, pull: bayPull };""",
  """  const BAYS = { lift: bayLift, throw: bayThrow, jump: bayJump, stomp: bayStomp, punch: bayPunch, clap: bayClap, sprint: baySprint, pull: bayPull, weight: bayWeight, arm: bayArm, wrestle: bayWrestle, catch: bayCatch, collide: bayCollide };""")
R("""    for (const a of ACTIONS) {
      const tb = $('#tab-' + a.id);
      tb.setAttribute('aria-selected', String(a.id === state.action));
      tb.setAttribute('tabindex', a.id === state.action ? '0' : '-1');
    }
    const bay = $('#bay');
    bay.setAttribute('aria-labelledby', 'tab-' + state.action);
    bay.classList.toggle('enter', lastBayAction !== state.action);
    lastBayAction = state.action;""","""    const act = curAction();
    if (!$('#tab-' + act)) buildTabs();
    for (const a of tabList()) {
      const tb = $('#tab-' + a.id);
      tb.setAttribute('aria-selected', String(a.id === act));
      tb.setAttribute('tabindex', a.id === act ? '0' : '-1');
    }
    const bay = $('#bay');
    bay.setAttribute('aria-labelledby', 'tab-' + act);
    bay.classList.toggle('enter', lastBayAction !== act);
    lastBayAction = act;""")
R("""    try { parts = BAYS[state.action](ctx()); }""","""    try { parts = BAYS[act](ctx()); }""")
# stub bays (filled in once the physics designs land)
R("""  function bayPull(c) {""","""  function bayWeight(c) { return [callout('Weight and density: coming in this build.')]; }
  function bayArm(c) { return [callout('Arm wrestling: coming in this build.')]; }
  function bayWrestle(c) { return [callout('Wrestling: coming in this build.')]; }
  function bayCatch(c) { return [callout('Catch: coming in this build.')]; }
  function bayCollide(c) { return [callout('Unstoppable force vs immovable object: coming in this build.')]; }

  function bayPull(c) {""")
# settings summary shows density when it is not the default
R("""    $('#setup-sum').textContent = [state.mode === 'real' ? 'Real muscle' : 'Comic book', state.groundHolds ? 'comic ground' : surf.name.replace(/ \\(.*\\)$/, ''), { friction: 'standing', braced: 'claws dug in', bolted: 'bolted' }[state.anchor], sig(state.H, 3) + ' m'].join(' · ');""",
  """    const rhoRex = state.m / P.bodyVolume(state.H);
    $('#setup-sum').textContent = [state.mode === 'real' ? 'Real muscle' : 'Comic book', state.groundHolds ? 'comic ground' : surf.name.replace(/ \\(.*\\)$/, ''), { friction: 'standing', braced: 'claws dug in', bolted: 'bolted' }[state.anchor], sig(state.H, 3) + ' m', Math.abs(Math.log10(rhoRex / 1000)) > 0.005 ? fmtDensity(rhoRex) : null].filter(Boolean).join(' · ');""")
open(p,'w').write(s); print('ok')
