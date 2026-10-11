import sys
p='/home/user/dino-strength-sim/src/app.html'; s=open(p).read()
def R(old,new,count=1):
    global s
    n=s.count(old)
    if n!=count: sys.exit('count %d != %d for: %s'%(n,count,old[:160]))
    s=s.replace(old,new)

R("""    const sizes = [{ h: 0.4, label: 'Plush (40 cm)' }, { h: 2, label: 'Dino (2 m)' }, { h: 50, label: 'Kaiju (50 m)' }];
    for (const s of sizes) $('#size-chips').append(el('button', { type: 'button', class: 'chip', 'data-h': s.h, onclick: () => { state.H = s.h; state.m = 180 * Math.pow(s.h / 2, 3); update(); } }, s.label));
    $('#height').onchange = (e) => { const h = Math.min(500, Math.max(0.1, Number(e.target.value) || 2)); state.H = h; state.m = 180 * Math.pow(h / 2, 3); update(); };
    $('#mass').onchange = (e) => { const m = Number(e.target.value); if (m > 0) state.m = m; update(); };
    const tabs = $('#tabs');
    for (const a of ACTIONS) {
      tabs.append(el('button', { type: 'button', class: 'tab', role: 'tab', id: 'tab-' + a.id, 'aria-selected': 'false', 'aria-controls': 'bay', tabindex: '-1', onclick: () => { state.action = a.id; update(); } }, a.label));
    }
    tabs.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (step === undefined && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault();
      const i = ACTIONS.findIndex((a) => a.id === state.action), n = ACTIONS.length;
      const j = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (i + step + n) % n;
      state.action = ACTIONS[j].id; update(); $('#tab-' + state.action).focus();
    });
  }""","""    const sizes = [{ h: 0.4, label: 'Plush (40 cm)' }, { h: 2, label: 'Dino (2 m)' }, { h: 50, label: 'Kaiju (50 m)' }];
    // changing height keeps the current density
    const setH = (h) => { const rho = state.m / P.bodyVolume(state.H); state.H = h; state.m = rho * P.bodyVolume(h); update(); };
    for (const s of sizes) $('#size-chips').append(el('button', { type: 'button', class: 'chip', 'data-h': s.h, onclick: () => setH(s.h) }, s.label));
    $('#height').onchange = (e) => setH(Math.min(500, Math.max(0.1, Number(e.target.value) || 2)));
    $('#mass').onchange = (e) => { const m = Number(e.target.value); if (m > 0 && isFinite(m)) state.m = m; update(); };
    densityControl('', () => state.H, (m) => { state.m = m; });
    // Ollie
    $('#o-same').onclick = () => { state.oSame = true; update(); };
    $('#o-own').onclick = () => { if (state.oSame) { state.oLogKg = state.logKg; state.oInf = state.inf; } state.oSame = false; update(); };
    $('#o-strength').addEventListener('input', (e) => { state.oInf = false; state.oLogKg = Number(e.target.value); renderDial(); scheduleBay(); });
    $('#o-inf').onchange = (e) => { state.oInf = e.target.checked; update(); };
    $('#o-height').onchange = (e) => { const h = Math.min(500, Math.max(0.1, Number(e.target.value) || 2)); const rho = state.oM / P.bodyVolume(state.oH); state.oH = h; state.oM = rho * P.bodyVolume(h); update(); };
    $('#o-mass').onchange = (e) => { const m = Number(e.target.value); if (m > 0 && isFinite(m)) state.oM = m; update(); };
    $('#o-anchor').onchange = (e) => { state.oAnchor = e.target.value; update(); };
    densityControl('o-', () => state.oH, (m) => { state.oM = m; });
    // Rex alone / Rex + Ollie
    $('#grp-solo').onclick = () => { state.group = 'solo'; buildTabs(); update(); };
    $('#grp-duo').onclick = () => { state.group = 'duo'; buildTabs(); update(); };
    buildTabs();
    $('#tabs').addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (step === undefined && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault();
      const list = tabList(), i = list.findIndex((a) => a.id === curAction()), n = list.length;
      const j = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (i + step + n) % n;
      setAction(list[j].id); update(); $('#tab-' + curAction()).focus();
    });
  }
  const tabList = () => (isDuo() ? DUO_ACTIONS : ACTIONS);
  const setAction = (id) => { if (isDuo()) state.duoAction = id; else state.action = id; };
  function buildTabs() {
    const tabs = $('#tabs'), list = tabList();
    tabs.replaceChildren(...list.map((a) => el('button', { type: 'button', class: 'tab', role: 'tab', id: 'tab-' + a.id, 'aria-selected': 'false', 'aria-controls': 'bay', tabindex: '-1', title: a.title || null, onclick: () => { setAction(a.id); update(); } }, a.label)));
    tabs.classList.toggle('n4', list.length === 4);
    tabs.setAttribute('aria-label', isDuo() ? 'Two-player tests' : 'Moves');
  }

  // ---------------------------------------------------------------- density
  // Presets come from the sourced data; the slider is log10 of kg/m³.
  const DENSITY_PRESETS = (D.densities || []).slice().sort((a, b) => a.rho - b.rho);
  const fmtDensity = (rho) => (rho < 1e6 ? sig(rho, 3) : sci(rho, 2)) + ' kg/m³';
  function densityCompare(rho) {
    let best = null;
    for (const d of DENSITY_PRESETS) if (d.rho <= rho * 1.0001) best = d;
    if (!best) return DENSITY_PRESETS.length ? sig(rho / DENSITY_PRESETS[0].rho * 100, 2) + '% of ' + DENSITY_PRESETS[0].short : '';
    const r = rho / best.rho;
    return r < 1.15 ? '≈ ' + best.short : fmtRatio(r) + ' ' + best.short;
  }
  function densityControl(pre, getH, setM) {
    const slider = $('#' + pre + 'density');
    slider.addEventListener('input', (e) => { setM(Math.pow(10, Number(e.target.value)) * P.bodyVolume(getH())); renderDial(); scheduleBay(); scheduleLadder(); });
    slider.addEventListener('change', () => { save(); });
    for (const d of DENSITY_PRESETS) {
      $('#' + pre + 'density-chips').append(el('button', { type: 'button', class: 'chip', 'data-rho': d.rho, title: d.note || null, onclick: () => { setM(d.rho * P.bodyVolume(getH())); update(); } }, d.chip));
    }
  }
  function renderDensity(pre, H, m) {
    const rho = m / P.bodyVolume(H);
    $('#' + pre + 'density').value = Math.min(30, Math.max(1, Math.log10(rho)));
    $('#' + pre + 'density-big').textContent = fmtDensity(rho);
    $('#' + pre + 'density-cmp').textContent = densityCompare(rho) + ' · ' + fmtMass(m);
    $('#' + pre + 'density').setAttribute('aria-valuetext', fmtDensity(rho) + ', ' + fmtMass(m));
    for (const b of document.querySelectorAll('#' + pre + 'density-chips .chip')) b.setAttribute('aria-pressed', String(Math.abs(Math.log10(Number(b.dataset.rho) / rho)) < 0.005));
    $('#' + pre + (pre ? 'mass' : 'mass')).value = m < 1e6 ? Math.round(m * 1000) / 1000 : Number(m.toPrecision(4));
  }""")

# renderDial: density, Ollie readouts, group switch
R("""    $('#mass').value = Math.round(state.m * 100) / 100;""",
  """    renderDensity('', state.H, state.m);
    renderDensity('o-', state.oH, state.oM);
    $('#o-same').setAttribute('aria-pressed', String(state.oSame));
    $('#o-own').setAttribute('aria-pressed', String(!state.oSame));
    $('#o-dial').hidden = state.oSame;
    $('#o-strength').value = state.oLogKg;
    $('#o-inf').checked = state.oInf;
    $('#o-big').textContent = state.oInf ? 'Unlimited' : 'Lifts ' + fmtMass(Math.pow(10, state.oLogKg));
    $('#o-strength').setAttribute('aria-valuetext', state.oInf ? 'Unlimited' : 'Lifts ' + fmtMass(Math.pow(10, state.oLogKg)));
    $('#o-height').value = state.oH;
    $('#o-anchor').value = state.oAnchor;
    $('#grp-solo').setAttribute('aria-pressed', String(!isDuo()));
    $('#grp-duo').setAttribute('aria-pressed', String(isDuo()));
    $('#ollie-sum').textContent = [state.oSame ? 'Rex’s strength' : (state.oInf ? 'unlimited' : 'lifts ' + fmtMass(Math.pow(10, state.oLogKg))), sig(state.oH, 3) + ' m', fmtMass(state.oM), { friction: 'standing', braced: 'dug in', bolted: 'bolted' }[state.oAnchor]].join(' · ');""")
R("""    $('#mass').onchange""", """    $('#mass').onchange""")
open(p,'w').write(s); print('ok')
