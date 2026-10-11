#!/usr/bin/env python3
"""ANSUR II (male) numbers for drawing a body outline.

Usage: python3 -I ansur_outline.py /path/to/ANSUR_II_MALE_Public.csv > out.json

Computes, for the 4,082 men in the public working database:
  1. landmark heights as fractions of stature (median, mean, SD, p5, p95)
  2. breadths, depths and lengths as fractions of stature
  3. breadth/girth and depth/girth ratios at chest, waist (omphalion), buttock
  4. Ramanujan ellipse perimeter from breadth and depth vs measured girth
     (chest, waist, buttock; plus head, hand, ankle, foot as extra checks)
  5. how the ellipse ratio varies with build (BMI and chest/waist size quintiles)
All CSV lengths are mm; weightkg is kg x 10 (NSRDEC memo, 14 Apr 2017).
"""
import csv, json, math, sys
import numpy as np

path = sys.argv[1]
with open(path, newline='', encoding='latin-1') as f:
    rows = list(csv.DictReader(f))
N = len(rows)

def col(name):
    return np.array([float(r[name]) for r in rows])

S = col('stature')  # mm
W = col('weightkg') / 10.0
BMI = W / (S / 1000.0) ** 2

def stats(x):
    x = np.asarray(x, float)
    return {
        'mean': round(float(np.mean(x)), 4),
        'sd': round(float(np.std(x, ddof=1)), 4),
        'p5': round(float(np.percentile(x, 5)), 4),
        'p50': round(float(np.percentile(x, 50)), 4),
        'p95': round(float(np.percentile(x, 95)), 4),
        'min': round(float(np.min(x)), 4),
        'max': round(float(np.max(x)), 4),
    }

out = {'n': N, 'csv': path}

# 1. landmark heights / stature
heights = ['stature', 'cervicaleheight', 'suprasternaleheight', 'acromialheight',
           'axillaheight', 'chestheight', 'tenthribheight', 'waistheightomphalion',
           'iliocristaleheight', 'buttockheight', 'trochanterionheight', 'crotchheight',
           'kneeheightmidpatella', 'lateralfemoralepicondyleheight', 'tibialheight',
           'lateralmalleolusheight', 'wristheight']
out['height_fraction_of_stature'] = {h: stats(col(h) / S) for h in heights}
out['height_mm'] = {h: stats(col(h)) for h in heights}
# head top to tragion (vertical, sitting, Frankfurt plane); chin not in ANSUR II
out['height_fraction_of_stature']['tragion_height_derived'] = stats((S - col('tragiontopofhead')) / S)

# 2. breadths/depths/lengths / stature
dims = ['biacromialbreadth', 'bideltoidbreadth', 'chestbreadth', 'chestdepth',
        'waistbreadth', 'waistdepth', 'hipbreadth', 'buttockdepth', 'headbreadth',
        'headlength', 'tragiontopofhead', 'handbreadth', 'handlength', 'palmlength',
        'footbreadthhorizontal', 'footlength', 'bimalleolarbreadth', 'heelbreadth',
        'forearmforearmbreadth', 'thighclearance', 'acromionradialelength',
        'radialestylionlength', 'shoulderlength', 'interscyei', 'interscyeii',
        'bizygomaticbreadth', 'mentonsellionlength', 'span']
out['dim_fraction_of_stature'] = {d: stats(col(d) / S) for d in dims}
out['dim_mm'] = {d: stats(col(d)) for d in dims}

# 3/4. ellipse checks
def ramanujan(a_full, b_full):
    a = a_full / 2.0; b = b_full / 2.0
    h = ((a - b) / (a + b)) ** 2
    return math.pi * (a + b) * (1 + 3 * h / (10 + np.sqrt(4 - 3 * h)))

sites = {
    'chest': ('chestbreadth', 'chestdepth', 'chestcircumference'),
    'waist_omphalion': ('waistbreadth', 'waistdepth', 'waistcircumference'),
    'buttock': ('hipbreadth', 'buttockdepth', 'buttockcircumference'),
    'head': ('headbreadth', 'headlength', 'headcircumference'),
}
ell = {}
for k, (b, d, c) in sites.items():
    B, D, C = col(b), col(d), col(c)
    P = ramanujan(B, D)
    r = C / P
    ell[k] = {
        'breadth': b, 'depth': d, 'girth': c,
        'girth_over_ellipse_perimeter': stats(r),
        'share_within_5pct': round(float(np.mean(np.abs(r - 1) <= 0.05)), 4),
        'depth_over_breadth': stats(D / B),
        'breadth_over_girth': stats(B / C),
        'depth_over_girth': stats(D / C),
        'circle_from_breadth_over_girth': stats(math.pi * B / C),
        'mean_abs_pct_error_if_ellipse_used_as_girth': round(float(np.mean(np.abs(P / C - 1)) * 100), 2),
    }
    # how the ratio moves with build: BMI quintiles and girth/stature quintiles
    def by_quintile(z, zname):
        qs = np.percentile(z, [0, 20, 40, 60, 80, 100])
        res = []
        for i in range(5):
            m = (z >= qs[i]) & (z <= qs[i + 1]) if i == 4 else (z >= qs[i]) & (z < qs[i + 1])
            res.append({'range': [round(float(qs[i]), 3), round(float(qs[i + 1]), 3)],
                        'n': int(m.sum()),
                        'mean_ratio': round(float(np.mean(r[m])), 4),
                        'mean_depth_over_breadth': round(float(np.mean((D / B)[m])), 4)})
        return res
    ell[k]['by_BMI_quintile'] = by_quintile(BMI, 'BMI')
    ell[k]['by_girth_over_stature_quintile'] = by_quintile(C / S, 'C/S')
    # linear fit ratio ~ BMI
    A = np.vstack([np.ones(N), BMI]).T
    coef, *_ = np.linalg.lstsq(A, r, rcond=None)
    pred = A @ coef
    ell[k]['fit_ratio_vs_BMI'] = {'intercept': round(float(coef[0]), 4), 'slope_per_BMI_unit': round(float(coef[1]), 5),
                                  'r2': round(float(1 - np.sum((r - pred) ** 2) / np.sum((r - r.mean()) ** 2)), 3)}
out['ellipse_vs_girth'] = ell

# extra: hand (breadth at metacarpals, thickness unknown) and foot not ellipse-testable
# without a depth; report breadth/girth only
out['breadth_over_girth_extra'] = {
    'hand': stats(col('handbreadth') / col('handcircumference')),
    'foot_ball': stats(col('footbreadthhorizontal') / col('balloffootcircumference')),
    'ankle_bimalleolar': stats(col('bimalleolarbreadth') / col('anklecircumference')),
    'thighclearance_over_thighcirc': stats(col('thighclearance') / col('thighcircumference')),
    'bideltoid_over_shouldercirc': stats(col('bideltoidbreadth') / col('shouldercircumference')),
}

# arm thickness at deltoid level implied by bideltoid - chest breadth (front view, each side)
out['bideltoid_minus_chestbreadth_half_mm'] = stats((col('bideltoidbreadth') - col('chestbreadth')) / 2)
out['bideltoid_minus_biacromial_half_mm'] = stats((col('bideltoidbreadth') - col('biacromialbreadth')) / 2)

# effective ellipse breadth: the breadth an ellipse needs (with the measured depth) to
# reproduce the measured girth; and the common scale factor if both axes are scaled
def solve_breadth(Dv, Cv):
    lo = np.full_like(Dv, 1.0); hi = np.full_like(Dv, 5000.0)
    for _ in range(80):
        m = (lo + hi) / 2
        too_small = ramanujan(m, Dv) < Cv
        lo = np.where(too_small, m, lo); hi = np.where(too_small, hi, m)
    return (lo + hi) / 2
eff = {}
for k, (b, d, c) in sites.items():
    B, Dv, C = col(b), col(d), col(c)
    be = solve_breadth(Dv, C)
    eff[k] = {'effective_breadth_over_measured_breadth': stats(be / B),
              'effective_breadth_over_girth': stats(be / C),
              'effective_depth_over_effective_breadth': stats(Dv / be)}
out['effective_ellipse_breadth'] = eff

# breadth/girth and depth/girth by BMI quintile (how the front/side widths per unit girth move with build)
q = {}
qs = np.percentile(BMI, [0, 20, 40, 60, 80, 100])
for k, (b, d, c) in sites.items():
    B, Dv, C = col(b), col(d), col(c)
    rows_ = []
    for i in range(5):
        m = (BMI >= qs[i]) & ((BMI <= qs[i + 1]) if i == 4 else (BMI < qs[i + 1]))
        rows_.append({'BMI': [round(float(qs[i]), 1), round(float(qs[i + 1]), 1)],
                      'breadth_over_girth': round(float(np.median((B / C)[m])), 4),
                      'depth_over_girth': round(float(np.median((Dv / C)[m])), 4)})
    q[k] = rows_
out['width_ratios_by_BMI_quintile'] = q

# joint centres by de Leva (1996, J Biomech 29:1223, Table 2, males): longitudinal offsets
# from bony landmarks, expressed as % of the segment length used to compute them
#   shoulder: 34.5 mm distal to acromion, from acromion-radiale 331.8 mm  -> 10.40 %
#   elbow:    14.3 mm proximal to radiale (acromion-radiale)             ->  4.31 %
#   hip:       3.2 mm proximal to trochanterion, troch-tibiale 520.2-66.9 = 453.3 mm -> 0.71 %
#   knee:     33.5 mm proximal to tibiale (troch-tibiale)                ->  7.39 %
#   wrist:     1.5 mm distal to stylion (radiale-stylion 251.3)          ->  0.60 %
AR = col('acromionradialelength'); TRO = col('trochanterionheight'); TIB = col('tibialheight')
sjc = col('acromialheight') - 0.1040 * AR
ejc = col('acromialheight') - AR + 0.0431 * AR   # radiale height approximated as acromial height - acromion-radiale (arm hanging)
hjc = TRO + 0.0071 * (TRO - TIB)
kjc = TIB + 0.0739 * (TRO - TIB)
wjc = col('wristheight') - 0.0060 * col('radialestylionlength')
out['joint_centre_heights_deLeva_offsets'] = {
    'shoulder_over_stature': stats(sjc / S), 'shoulder_below_acromion_mm': stats(0.1040 * AR),
    'elbow_over_stature': stats(ejc / S), 'hip_over_stature': stats(hjc / S),
    'hip_above_trochanterion_mm': stats(0.0071 * (TRO - TIB)),
    'knee_over_stature': stats(kjc / S), 'knee_above_tibiale_mm': stats(0.0739 * (TRO - TIB)),
    'knee_minus_lat_femoral_epicondyle_mm': stats(kjc - col('lateralfemoralepicondyleheight')),
    'wrist_over_stature': stats(wjc / S),
}

# chin (menton) height estimate: ANSUR has tragion-top-of-head but no vertex-menton.
# Scale it by the AIST 1991-92 young-men ratio total head height / tragion-vertex = 238.7/138.6
R_AIST = 238.7 / 138.6
head_h = col('tragiontopofhead') * R_AIST
out['head_height_estimate'] = {'ratio_used': round(R_AIST, 4),
                               'head_height_mm': stats(head_h), 'head_height_over_stature': stats(head_h / S),
                               'heads_per_stature': stats(S / head_h),
                               'chin_height_over_stature': stats((S - head_h) / S)}

# fingertip (dactylion III) height = wrist height - hand length (TR-15/007 derived dimension D12)
out['fingertip_height_over_stature'] = stats((col('wristheight') - col('handlength')) / S)
out['head_length_over_breadth'] = stats(col('headlength') / col('headbreadth'))
out['chin_minus_cervicale_mm_estimate'] = stats(S - head_h - col('cervicaleheight'))

# sanity: medians in cm of raw sites to compare with TR-15/007
out['check_medians_cm'] = {c: round(float(np.median(col(c))) / 10, 2) for c in
                           ['stature', 'chestbreadth', 'chestdepth', 'chestcircumference', 'waistbreadth',
                            'waistdepth', 'waistcircumference', 'hipbreadth', 'buttockdepth',
                            'buttockcircumference', 'biacromialbreadth', 'bideltoidbreadth']}
json.dump(out, sys.stdout, indent=1)
