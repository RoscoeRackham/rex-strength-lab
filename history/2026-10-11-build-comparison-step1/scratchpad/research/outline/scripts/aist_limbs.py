#!/usr/bin/env python3
"""Limb cross-section shape from the AIST Human Body Dimensions Database 1991-92.

Young adult Japanese men (18-29 y, measured Jul-Aug 1991), right side.
Values transcribed by hand from the per-item statistics images at
https://www.airc.aist.go.jp/dhrt/91-92/data/gif/<ID>.gif (saved in ../dl/aist/).
Only summary statistics are public, so every ratio here is a ratio of MEANS
(not a mean of individual ratios). With CVs of 5-9% the difference is <1%.

Usage: python3 -I aist_limbs.py > aist_limbs_out.json
"""
import json, math

# (mean_mm, sd_mm, n) young adult men
D = {
    'stature_B1': (1714.0, 62.55, 217),
    # thigh, all at the lower edge of the gluteal furrow
    'thigh_breadth_D15': (165.2, 12.44, 216),
    'thigh_depth_E8': (168.2, 15.48, 216),
    'thigh_circ_gluteal_furrow_F16': (535.7, 40.20, 217),
    # knee, all at mid-patella
    'knee_breadth_D16': (107.6, 5.89, 216),
    'knee_depth_E9': (117.6, 6.26, 216),
    'knee_circ_F19': (364.4, 18.32, 217),
    # calf, all at the level where the calf outline is widest seen from the front
    'calf_breadth_max_D17': (113.0, 7.81, 217),
    'calf_depth_max_E10': (110.9, 7.67, 217),
    'calf_circ_max_F20': (362.3, 23.24, 217),
    # ankle, all at the narrowest level above the medial malleolus
    'ankle_breadth_min_D18': (58.6, 4.15, 217),
    'ankle_depth_min_E11': (73.5, 4.56, 217),
    'ankle_circ_min_F21': (219.4, 12.86, 217),
    # forearm: breadth (max, parallel to palm, palms forward) and girth (max bulge
    # a few cm below the elbow, arm hanging, fingers straight) are NOT at one level
    'forearm_breadth_max_D14': (92.6, 5.51, 217),
    'forearm_circ_max_F26': (259.2, 15.66, 214),
    # neck base: breadth between neck-root points; girth loop through cervicale,
    # neck-root points and jugular notch (a tilted loop, not one horizontal level)
    'neck_root_breadth_D1': (144.2, 7.76, 217),
    'neckbase_circ_F3': (433.6, 22.39, 217),
    'neck_circ_F1': (356.3, 17.84, 217),
    'upper_arm_circ_F25': (280.8, 25.04, 217),
    # head and hand/foot
    'total_head_height_A36': (238.7, 8.03, 217),
    'tragion_vertex_A33': (138.6, 5.98, 217),
    'hand_thickness_L16': (27.5, 2.65, 214),
    'dorsal_arch_height_M6': (61.9, 5.43, 214),
    'max_body_breadth_D3': (469.9, 26.41, 217),
}

def ramanujan(b, d):
    a, c = b / 2, d / 2
    h = ((a - c) / (a + c)) ** 2
    return math.pi * (a + c) * (1 + 3 * h / (10 + math.sqrt(4 - 3 * h)))

def depth_for_perimeter(b, P):
    lo, hi = 1e-6, 10 * b
    for _ in range(200):
        m = (lo + hi) / 2
        if ramanujan(b, m) < P:
            lo = m
        else:
            hi = m
    return (lo + hi) / 2

out = {'source': 'AIST Human Body Dimensions Database 1991-92, young men, ratios of means', 'sites': {}}
for site, (b, d, c) in {
    'thigh_gluteal_furrow': ('thigh_breadth_D15', 'thigh_depth_E8', 'thigh_circ_gluteal_furrow_F16'),
    'knee_midpatella': ('knee_breadth_D16', 'knee_depth_E9', 'knee_circ_F19'),
    'calf_max': ('calf_breadth_max_D17', 'calf_depth_max_E10', 'calf_circ_max_F20'),
    'ankle_min': ('ankle_breadth_min_D18', 'ankle_depth_min_E11', 'ankle_circ_min_F21'),
}.items():
    B, Dd, C = D[b][0], D[d][0], D[c][0]
    P = ramanujan(B, Dd)
    out['sites'][site] = {
        'breadth_mm': B, 'depth_mm': Dd, 'girth_mm': C,
        'depth_over_breadth': round(Dd / B, 3),
        'breadth_over_girth': round(B / C, 3),
        'depth_over_girth': round(Dd / C, 3),
        'ellipse_perimeter_mm': round(P, 1),
        'girth_over_ellipse_perimeter': round(C / P, 3),
        'circle_diameter_from_girth_mm': round(C / math.pi, 1),
        'breadth_over_circle_diameter': round(B / (C / math.pi), 3),
    }
# forearm and neck base: only a breadth and a girth; infer the depth an ellipse would need
for site, (b, c, note) in {
    'forearm': ('forearm_breadth_max_D14', 'forearm_circ_max_F26', 'breadth and girth at different levels; palms forward'),
    'neck_base': ('neck_root_breadth_D1', 'neckbase_circ_F3', 'girth loop is tilted, not horizontal'),
}.items():
    B, C = D[b][0], D[c][0]
    dd = depth_for_perimeter(B, C)
    out['sites'][site] = {
        'breadth_mm': B, 'girth_mm': C, 'note': note,
        'breadth_over_girth': round(B / C, 3),
        'breadth_over_circle_diameter': round(B / (C / math.pi), 3),
        'implied_ellipse_depth_mm': round(dd, 1),
        'implied_depth_over_breadth': round(dd / B, 3),
    }
S = D['stature_B1'][0]
out['fractions_of_stature'] = {k: round(v[0] / S, 4) for k, v in D.items() if k != 'stature_B1'}
out['head_height_over_tragion_vertex'] = round(D['total_head_height_A36'][0] / D['tragion_vertex_A33'][0], 4)
out['raw'] = D
print(json.dumps(out, indent=1))
