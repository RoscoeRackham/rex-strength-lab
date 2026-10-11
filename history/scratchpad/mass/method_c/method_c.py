"""METHOD C - anthropometric scaling.

Each body segment of each figure = the matching segment of the ANSUR II mean man, multiplied by
  (segment length ratio) x (frontal width ratio) x (depth ratio)
with all ratios figure/human in metres.  Depth is invisible in a front view, so
  depth ratio = (H_f/H_h) * (relative width ratio)^k ,  relative width ratio = (w_f/H_f)/(w_h/H_h)
k = 1 is the 'squared width ratio' (cross-section keeps the human depth/breadth shape);
k < 1 = flatter than a human, k > 1 = deeper. H used for the k-normalisation = skull-top height
(comparable to ANSUR stature, which is to the vertex).
Tail = separate tapered elliptical cone (frusta) measured in the picture.
Monte Carlo over every pixel reading, depth exponent, perspective, and density.
All pixel readings were taken by eye from the zoomed grid crops c_*.png in this folder."""
import numpy as np, json, csv, math
rng = np.random.default_rng(12345)
N = 40000

def tri(lo, c, hi, n=N):
    return rng.triangular(lo, c, hi, n)

# ------------------------------------------------------------------ human reference (ANSUR II men)
rows = list(csv.DictReader(open('../ansur_dl/male.csv', encoding='latin-1')))
A = {k: np.mean([float(r[k]) for r in rows]) for k in rows[0].keys()
     if k not in ('subjectid', 'Gender', 'Date', 'Installation', 'Component', 'Branch', 'PrimaryMOS',
                  'SubjectsBirthLocation', 'SubjectNumericRace', 'Ethnicity', 'DODRace', 'WritingPreference')}
Hh = A['stature'] / 1000            # 1.7562 m
Mh = A['weightkg'] / 10             # 85.52 kg  (public file stores weight in 0.1 kg)
mm = lambda k: A[k] / 1000
# de Leva (1996) male mass fractions; Dempster (1955) segment densities as tabulated in Winter (2009) Table 4.1
frac = dict(headneck=.0694, trunk=.4346, upt=.1596, mpt=.1633, lpt=.1117, uarm=.0271, farm=.0162, hand=.0061,
            thigh=.1416, shank=.0433, foot=.0137)
dens = dict(headneck=1.11, trunk=1.03, uarm=1.07, farm=1.13, hand=1.16, thigh=1.05, shank=1.09, foot=1.10)
FRC, GI = 3.30, 0.10   # L; Quanjer et al. 1993 ERS reference FRC for a 1.76 m, ~30 y man; gut gas ~0.1 L
Vh = {}
Vh['headneck'] = frac['headneck'] * Mh / dens['headneck']
Vh['neck'] = 0.01258 * 0.100 * 1000           # cylinder: neck circ 397.6 mm -> 0.01258 m2, ~0.10 m long
Vh['head'] = Vh['headneck'] - Vh['neck']
trunk_tissue = frac['trunk'] * Mh / dens['trunk']
Vh['upt'] = trunk_tissue * frac['upt'] / frac['trunk'] + 0.7 * FRC
Vh['mpt'] = trunk_tissue * frac['mpt'] / frac['trunk'] + 0.3 * FRC + GI
Vh['lpt'] = trunk_tissue * frac['lpt'] / frac['trunk']
for s in ('uarm', 'farm', 'hand', 'thigh', 'shank', 'foot'):
    Vh[s] = frac[s] * Mh / dens[s]
Vh_total = Vh['headneck'] + Vh['upt'] + Vh['mpt'] + Vh['lpt'] + 2 * sum(Vh[s] for s in ('uarm', 'farm', 'hand', 'thigh', 'shank', 'foot'))
k_dl = Hh / 1.741   # de Leva lengths are for a 1.741 m man; rescale to ANSUR stature
Lh = dict(head=0.231, neck=0.100,
          upt=((mm('cervicaleheight') + mm('suprasternaleheight')) / 2) - (mm('suprasternaleheight') - 0.1707 * k_dl),
          mpt=0.2155 * k_dl, lpt=0.1457 * k_dl,
          uarm=0.2817 * k_dl, farm=0.2689 * k_dl, hand=mm('handlength'),
          thigh=mm('trochanterionheight') - mm('kneeheightmidpatella'),
          shank=mm('kneeheightmidpatella') - mm('lateralmalleolusheight'),
          foot=mm('footlength'))
def rms(t):
    t = t if isinstance(t, tuple) else (t,)
    return math.sqrt(sum(x * x for x in t) / len(t))

Wh = dict(head=mm('headbreadth'), headlen=mm('headlength'), neck=mm('neckcircumference') / math.pi,
          upt=mm('chestbreadth'), mpt=rms((mm('chestbreadth'), mm('waistbreadth'))), lpt=rms((mm('waistbreadth'), mm('hipbreadth'))),
          uarm=mm('bicepscircumferenceflexed') / math.pi,
          farm=(mm('forearmcircumferenceflexed') / math.pi, mm('wristcircumference') / math.pi),
          hand=mm('handbreadth'),
          thigh=(mm('thighcircumference') / math.pi, mm('lowerthighcircumference') / math.pi),
          shank=(mm('calfcircumference') / math.pi, mm('anklecircumference') / math.pi),
          foot=mm('footbreadthhorizontal'), footh=mm('lateralmalleolusheight'))


# ------------------------------------------------------------------ scale from Rex
REX_TOP = 8.5            # crest spike tip row (profile scan)
REX_SKULL = tri(36, 42, 48)   # skull top under the crest
REX_GROUND = tri(793, 800.5, 809)  # ankle-plane ground row (claw tips 800/820, pads ~795/812)
s = 3.048 / (REX_GROUND - REX_TOP)      # m per px, per sample
persp = tri(0.97, 1.0, 1.03)            # width/length distortion vs height (perspective, AI-render proportion drift)

def segvol(Vref, Lf, Lref, wf, wref, Hf, k):
    """Vref * (Lf/Lref) * (wf/wref) * depth ratio, depth ratio = (Hf/Hh)*((wf/Hf)/(wref/Hh))**k"""
    wr = wf / wref
    rel = (wf / Hf) / (wref / Hh)
    dr = (Hf / Hh) * rel ** k
    return Vref * (Lf / Lref) * wr * dr

def frustum_tail(h_profile_px, s_px, wh_ratio, scale):
    """sum of elliptical frusta; h = dorso-ventral height seen in picture, width = wh_ratio*h"""
    v = 0.0
    for i in range(len(s_px) - 1):
        a, b = h_profile_px[i], h_profile_px[i + 1]
        L = s_px[i + 1] - s_px[i]
        v = v + L * (a * a + a * b + b * b) / 3.0
    return v * math.pi / 4 * wh_ratio * scale ** 3

# ------------------------------------------------------------------ density (whole body, kg/m3)
fat = tri(0.06, 0.10, 0.15)             # lean, visibly striated physique
ffm = tri(1.085, 1.089, 1.100)          # FFM density: 1.089 in weight trainers (Modlesky 1996), 1.100 Siri/Brozek reference
gas = tri(0.005, 0.010, 0.025)          # lung (FRC..TLC) + gut gas as fraction of a 2-3 m3 body
tissue = 1.0 / (fat / 0.9007 + (1 - fat) / ffm)
rho = tissue * (1 - gas) * 1000

def central(lo, c, hi):
    return c

def run(fig, KT=None, KL=None):
    """returns dict of per-sample segment volumes (m3)"""
    seg = {}
    if fig == 'rex':
        sc = s * persp
        Hf = (REX_GROUND - REX_SKULL) * s          # skull-top height in m
        kt = tri(0.7, 1.0, 1.2) if KT is None else KT; kl = tri(0.85, 1.0, 1.1) if KL is None else KL
        # head (turned ~40 deg: projected 145 px = l*sin + b*cos)
        head_h = (tri(124, 130, 136) - REX_SKULL) * sc
        head_b = tri(65, 79, 100) * sc; head_l = tri(110, 131, 150) * sc
        seg['head'] = Vh['head'] / 1000 * (head_h / Lh['head']) * (head_b / Wh['head']) * (head_l / Wh['headlen'])
        seg['neck'] = segvol(Vh['neck'] / 1000, tri(25, 35, 50) * sc, Lh['neck'], tri(100, 120, 140) * sc, Wh['neck'], Hf, kl)
        seg['crest'] = tri(0.001, 0.002, 0.004)
        c7 = tri(130, 140, 150); supr = tri(160, 170, 180); xyph = tri(255, 265, 275); omph = tri(355, 365, 375); hipj = tri(495, 510, 525)
        knee = tri(582, 592, 602); ankle = tri(712, 720, 728)
        wc, ww, wp = tri(275, 295, 320), tri(229, 237, 245), tri(300, 315, 347)
        seg['upt'] = segvol(Vh['upt'] / 1000, (xyph - (c7 + supr) / 2) * sc, Lh['upt'], wc * sc, Wh['upt'], Hf, kt)
        seg['mpt'] = segvol(Vh['mpt'] / 1000, (omph - xyph) * sc, Lh['mpt'], np.sqrt((wc**2 + ww**2) / 2) * sc, Wh['mpt'], Hf, kt)
        seg['lpt'] = segvol(Vh['lpt'] / 1000, (hipj - omph) * sc, Lh['lpt'], np.sqrt((ww**2 + wp**2) / 2) * sc, Wh['lpt'], Hf, kt)
        seg['pouches'] = tri(0.0, 0.010, 0.015)
        # arms: the two arms are seen in different orientations (L 105 px, R 165 px at the biceps belly);
        # their product is used as width x depth of one arm (no k needed)
        prod_u = 105 * 165 * tri(0.8, 1.0, 1.2) * sc ** 2
        Lu = tri(150, 165, 185) * sc
        seg['uarm'] = 2 * Vh['uarm'] / 1000 * (Lu / Lh['uarm']) * prod_u / Wh['uarm'] ** 2
        prod_fmax = 129 * 150 * tri(0.8, 1.0, 1.2); prod_fw = 86 * 95 * tri(0.8, 1.0, 1.2)
        Lfa = tri(100, 115, 130) * sc
        seg['farm'] = 2 * Vh['farm'] / 1000 * (Lfa / Lh['farm']) * ((prod_fmax + prod_fw) / 2 * sc ** 2) / rms(Wh['farm']) ** 2
        seg['hand'] = 2 * segvol(Vh['hand'] / 1000, tri(80, 90, 100) * sc, Lh['hand'], tri(70, 82, 95) * sc, Wh['hand'], Hf, kl)
        # legs: front view only, circular-ish columns -> k_l
        wth = np.sqrt((tri(140, 150, 160) ** 2 + tri(135, 143, 155) ** 2) / 2) * sc
        seg['thigh'] = 2 * segvol(Vh['thigh'] / 1000, (knee - hipj) * sc, Lh['thigh'], wth, rms(Wh['thigh']), Hf, kl)
        wsh = np.sqrt((tri(155, 165, 172) ** 2 + tri(105, 116, 125) ** 2) / 2) * sc
        seg['shank'] = 2 * segvol(Vh['shank'] / 1000, (ankle - knee) * sc, Lh['shank'], wsh, rms(Wh['shank']), Hf, kl)
        fh = (REX_GROUND - ankle) * sc; fb = tri(155, 170, 195) * sc; fl = tri(0.65, 0.80, 1.00)
        seg['foot'] = 2 * Vh['foot'] / 1000 * (fl / Lh['foot']) * (fb / Wh['foot']) * (fh / Wh['footh'])
        # tail: hidden frustum (rump -> emergence beside right calf) + measured visible profile
        hid = tri(0.75, 0.95, 1.25) / sc       # in px units of this sample's scale
        base = tri(130, 155, 175); emerg = tri(95, 105, 115); whr = tri(0.6, 0.8, 1.0)
        prof_s = [0, 70, 130, 180, 230, 255, 285, 305]
        prof_h = [1.0, 94 / 105, 79 / 105, 57 / 105, 45 / 105, 35 / 105, 22 / 105, 0.0]
        hidden = math.pi / 4 * whr * hid * (base ** 2 + base * emerg + emerg ** 2) / 3 * sc ** 3
        vis = np.zeros(N)
        for i in range(len(prof_s) - 1):
            a = emerg * prof_h[i]; b = emerg * prof_h[i + 1]
            vis += (prof_s[i + 1] - prof_s[i]) * (a * a + a * b + b * b) / 3
        vis *= math.pi / 4 * whr * sc ** 3
        seg['tail_hidden'] = hidden; seg['tail_visible'] = vis
        seg['_foot_sole'] = fb * fl * tri(0.45, 0.55, 0.65)
        seg['_H_crest'] = (REX_GROUND - REX_TOP) * s
        seg['_H_skull'] = Hf
    else:
        rel = tri(0.97, 1.0, 1.03)               # Ollie may sit at a slightly different depth than Rex
        sH = s * rel                              # height scale for Ollie
        sc = sH * persp
        G = tri(800, 807.5, 815)
        HORN, HAIR, SKULL = 13.5, 24.5, tri(31, 34.5, 40)
        Hf = (G - SKULL) * sH
        kt = tri(0.7, 1.0, 1.2) if KT is None else KT; kl = tri(0.85, 1.0, 1.1) if KL is None else KL
        head_h = (tri(124, 130, 136) - SKULL) * sc
        head_b = tri(95, 105, 115) * sc
        head_l = head_b * tri(1.3, 1.5, 1.8)      # bovine muzzle: head length/breadth > human 1.29
        seg['head'] = Vh['head'] / 1000 * (head_h / Lh['head']) * (head_b / Wh['head']) * (head_l / Wh['headlen'])
        seg['neck'] = segvol(Vh['neck'] / 1000, tri(15, 25, 40) * sc, Lh['neck'], tri(105, 120, 135) * sc, Wh['neck'], Hf, kl)
        seg['horns_ears'] = tri(0.001, 0.002, 0.004)
        c7 = tri(110, 120, 130); supr = tri(140, 150, 160); xyph = tri(245, 255, 265); omph = tri(335, 343, 351); hipj = tri(490, 505, 520)
        knee = tri(595, 610, 625); ankle = tri(747, 757, 767)
        wc, ww, wp = tri(280, 290, 320), tri(300, 320, 330), tri(350, 370, 380)
        seg['upt'] = segvol(Vh['upt'] / 1000, (xyph - (c7 + supr) / 2) * sc, Lh['upt'], wc * sc, Wh['upt'], Hf, kt)
        seg['mpt'] = segvol(Vh['mpt'] / 1000, (omph - xyph) * sc, Lh['mpt'], np.sqrt((wc**2 + ww**2) / 2) * sc, Wh['mpt'], Hf, kt)
        seg['lpt'] = segvol(Vh['lpt'] / 1000, (hipj - omph) * sc, Lh['lpt'], np.sqrt((ww**2 + wp**2) / 2) * sc, Wh['lpt'], Hf, kt)
        # arms akimbo, in the image plane; image-left arm measured, image-right arm (partly behind vest/Rex) assumed equal
        seg['uarm'] = 2 * segvol(Vh['uarm'] / 1000, tri(170, 185, 200) * sc, Lh['uarm'], tri(105, 115, 125) * sc, Wh['uarm'], Hf, kl)
        wfa = np.sqrt((tri(80, 90, 100) ** 2 + tri(52, 60, 68) ** 2) / 2) * sc
        seg['farm'] = 2 * segvol(Vh['farm'] / 1000, tri(150, 165, 180) * sc, Lh['farm'], wfa, rms(Wh['farm']), Hf, kl)
        seg['hand'] = 2 * segvol(Vh['hand'] / 1000, tri(85, 100, 110) * sc, Lh['hand'], tri(80, 90, 100) * sc, Wh['hand'], Hf, kl)
        wth = np.sqrt((tri(155, 164, 172) ** 2 + tri(143, 153, 163) ** 2) / 2) * sc
        seg['thigh'] = 2 * segvol(Vh['thigh'] / 1000, (knee - hipj) * sc, Lh['thigh'], wth, rms(Wh['thigh']), Hf, kl)
        wsh = np.sqrt((tri(165, 172, 178) ** 2 + tri(100, 110, 118) ** 2) / 2) * sc
        seg['shank'] = 2 * segvol(Vh['shank'] / 1000, (ankle - knee) * sc, Lh['shank'], wsh, rms(Wh['shank']), Hf, kl)
        fh = (G - ankle) * sc; fb = tri(0.30, 0.34, 0.40) * persp; fl = tri(0.65, 0.72, 0.80) * persp
        seg['foot'] = 2 * Vh['foot'] / 1000 * (fl / Lh['foot']) * (fb / Wh['foot']) * (fh / Wh['footh'])
        seg['tail'] = tri(0.004, 0.006, 0.009)
        seg['_foot_sole'] = fb * fl * tri(0.60, 0.70, 0.80)
        seg['_H_horn'] = (G - HORN) * sH
        seg['_H_hair'] = (G - HAIR) * sH
        seg['_H_skull'] = Hf
    return seg

def summarize(seg, rho):
    keys = [k for k in seg if not k.startswith('_')]
    # model-form factor: how well human segment shape factors transfer to these cartoon bodies (not tail)
    mf = tri(0.88, 1.0, 1.12)
    V = sum(seg[k] for k in keys if not k.startswith('tail')) * mf + sum(seg[k] for k in keys if k.startswith('tail'))
    M = V * rho
    q = lambda x: [float(np.percentile(x, p)) for p in (5, 50, 95)]
    return keys, V, M, q

out = {}
for fig in ('rex', 'ollie'):
    seg = run(fig)
    keys, V, M, q = summarize(seg, rho)
    out[fig] = dict(seg={k: q(seg[k]) for k in seg}, V=q(V), M=q(M), Vmean=float(V.mean()), Mmean=float(M.mean()),
                    V2575=[float(np.percentile(V, p)) for p in (2.5, 97.5)], M2575=[float(np.percentile(M, p)) for p in (2.5, 97.5)])

# ---------------------------------------------- deterministic central case (every input at its mode)
def mode_run(KT=None, KL=None):
    global tri
    saved = tri
    tri = lambda lo, c, hi, n=1: np.array([c], float)
    import types
    g = globals()
    g['REX_SKULL'] = np.array([42.0]); g['REX_GROUND'] = np.array([800.5])
    g['s'] = 3.048 / (g['REX_GROUND'] - REX_TOP); g['persp'] = np.array([1.0])
    res = {}
    for fig in ('rex', 'ollie'):
        sg = run(fig, KT, KL)
        res[fig] = {k: float(np.asarray(v).ravel()[0]) for k, v in sg.items()}
    tri = saved
    return res

old_N = N
N = 1
cen = mode_run()
dlo = mode_run(0.7, 0.85)
dhi = mode_run(1.2, 1.1)
N = old_N
rho_c = 1.0 / (0.10 / 0.9007 + 0.90 / 1.089) * (1 - 0.010) * 1000

json.dump(dict(mc=out, central=cen, depth_low=dlo, depth_high=dhi, rho_central=rho_c,
               rho_pct=[float(np.percentile(rho, p)) for p in (5, 50, 95)],
               human=dict(Vh_L=Vh, Vh_total_L=Vh_total, Lh=Lh, Wh={k: (list(v) if isinstance(v, tuple) else v) for k, v in Wh.items()},
                          Hh=Hh, Mh=Mh)),
          open('method_c_raw.json', 'w'), indent=1, default=float)
print('human total volume L', round(Vh_total, 2), 'implied density', round(Mh / Vh_total, 4))
print('rho central', round(rho_c, 1), 'pct', [round(x) for x in np.percentile(rho, (5, 50, 95))])
for fig in ('rex', 'ollie'):
    c = cen[fig]
    tot = sum(v for k, v in c.items() if not k.startswith('_'))
    print('\n==', fig, 'central total m3 %.3f  mass %.0f kg' % (tot, tot * rho_c))
    for k, v in c.items():
        print('  %-13s %.4f' % (k, v), ' MC 5/50/95:', ['%.4f' % x for x in out[fig]['seg'][k]])
    for nm, d in (('depth-low k_t=.7,k_l=.85', dlo), ('depth-high k_t=1.2,k_l=1.1', dhi)):
        tv = sum(v for k, v in d[fig].items() if not k.startswith('_')); print('  ', nm, 'V %.3f' % tv)
    print('  MC V 5/50/95', ['%.3f' % x for x in out[fig]['V']], ' M', ['%.0f' % x for x in out[fig]['M']])
