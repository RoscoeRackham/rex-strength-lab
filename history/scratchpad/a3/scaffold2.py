import sys
p='/home/user/dino-strength-sim/src/app.html'; s=open(p).read()
def R(old,new,count=1):
    global s
    n=s.count(old)
    if n!=count: sys.exit('count %d != %d for: %s'%(n,count,old[:160]))
    s=s.replace(old,new)

# ---------- state
R("""  const DEFAULTS = { logKg: Math.log10(100 * 907.18474), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45 };""",
  """  const DEFAULTS = {
    logKg: Math.log10(100 * 907.18474), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45,
    // two-player tests: which group of tabs is showing, and the last tab picked in the Rex + Ollie group
    group: 'solo', duoAction: 'arm',
    // Ollie: strength linked to Rex's dial unless oSame is false
    oSame: true, oLogKg: Math.log10(100 * 907.18474), oInf: false, oH: 2, oM: 180, oAnchor: 'friction',
  };""")
R("""      action: (v) => ['lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull'].includes(v),""",
  """      action: (v) => ['lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'].includes(v),
      group: (v) => v === 'solo' || v === 'duo',
      duoAction: (v) => ['arm', 'wrestle', 'catch', 'collide'].includes(v),
      oSame: (v) => typeof v === 'boolean', oInf: (v) => typeof v === 'boolean',
      oLogKg: num(1, 34), oH: num(0.1, 500), oM: (v) => typeof v === 'number' && isFinite(v) && v > 0,
      oAnchor: (v) => v === 'friction' || v === 'braced' || v === 'bolted',""")
R("""  function ctx(overrides) {
    const body = P.makeBody({ H: state.H, m: state.m });
    const surface = D.surfaces.find((s) => s.id === state.surface);
    const c = { F: state.inf ? Infinity : Math.pow(10, state.logKg) * g, mode: state.mode, body, surface, groundHolds: state.groundHolds, anchor: state.anchor };
    return Object.assign(c, overrides || {});
  }""","""  function ctx(overrides) {
    const body = P.makeBody({ H: state.H, m: state.m });
    const surface = D.surfaces.find((s) => s.id === state.surface);
    const c = { F: state.inf ? Infinity : Math.pow(10, state.logKg) * g, mode: state.mode, body, surface, groundHolds: state.groundHolds, anchor: state.anchor };
    return Object.assign(c, overrides || {});
  }
  // Ollie shares the ground and the muscle setting; his strength follows Rex's dial unless set apart.
  function ctxOllie(overrides) {
    const body = P.makeBody({ H: state.oH, m: state.oM });
    const F = state.oSame ? (state.inf ? Infinity : Math.pow(10, state.logKg) * g) : (state.oInf ? Infinity : Math.pow(10, state.oLogKg) * g);
    return Object.assign(ctx(), { F, body, anchor: state.oAnchor }, overrides || {});
  }
  const isDuo = () => state.group === 'duo';
  const curAction = () => (isDuo() ? state.duoAction : state.action);""")
open(p,'w').write(s); print('ok')
