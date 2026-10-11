"""Compile /home/user/build-calc/data/builds.json from the fact-checked research, the NHANES report and the
picture measurements. Run: python3 -I compile.py <out.json>"""
import json, math, sys, os, hashlib, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import facts_fix as FF

IN = 0.0254; LB = 0.45359237
def inch(x): return round(x * IN, 4)
def lbkg(x): return round(x * LB, 1)
def ftin(ft, i=0.0): return round((ft * 12 + i) * IN, 4)

d, F, CHECKS, TOPICS = FF.load()
LOG = FF.apply_all(F, CHECKS)

SITES = ['chest', 'waist', 'arm_flexed', 'forearm', 'thigh', 'calf', 'neck']

def val(v, status, keys, basis=None, rng=None, disputed=False, other=None, value_basis=None):
    o = {'value': v, 'status': status, 'source_keys': keys}
    if basis: o['basis'] = basis
    o['range'] = rng
    o['disputed'] = disputed
    if value_basis: o['value_basis'] = value_basis
    if other: o['other'] = other
    return o

def G(v, status, keys, definition, differs, rng=None, disputed=False, value_basis=None, **extra):
    o = {'value_m': v, 'range_m': rng, 'status': status, 'disputed': disputed, 'source_keys': keys,
         'definition': definition, 'definition_differs_from_ansur': differs}
    if value_basis: o['value_basis'] = value_basis
    o.update(extra)
    return o

UNK = lambda note=None: dict({'value_m': None, 'status': 'unknown'}, **({'note': note} if note else {}))

def girths(**kw):
    g = {}
    for s in SITES:
        g[s] = kw.get(s) if kw.get(s) is not None else UNK()
    return g

ANSUR_DEF = {
    'chest': 'ANSUR II: horizontal at the fullest part of the chest/bust, at maximum quiet breathing',
    'waist': 'ANSUR II: horizontal at the centre of the navel (omphalion), abdomen relaxed',
    'arm_flexed': "ANSUR II: biceps peak, upper arm held forward, elbow 90 degrees, maximum 'make a muscle' effort",
    'forearm': 'ANSUR II: at the elbow crease, elbow 90 degrees, fist tightly clenched',
    'thigh': "ANSUR II: at the gluteal furrow (top of thigh), perpendicular to the thigh's long axis, relaxed",
    'calf': 'ANSUR II: maximum calf girth, highest of three readings',
    'neck': "ANSUR II: at the lower edge of the Adam's apple (infrathyroid), perpendicular to the neck axis",
}
ANSUR_FACT = {'chest': 'ansur2_chest', 'waist': 'ansur2_waist_omphalion', 'arm_flexed': 'ansur2_biceps_flexed',
              'forearm': 'ansur2_forearm_flexed', 'thigh': 'ansur2_thigh', 'calf': 'ansur2_calf', 'neck': 'ansur2_neck'}

builds = []
def add(b):
    assert b['id'] not in [x['id'] for x in builds], b['id']
    builds.append(b)

# ====================================================================== EVERYDAY: ANSUR II percentiles
for sex, sx, n in (('M', 'male', 4082), ('F', 'female', 1986)):
    for p in (5, 50, 95):
        st = F['ansur2_stature']['values']; wt = F['ansur2_weight']['values']
        gg = {}
        for s in SITES:
            fv = F[ANSUR_FACT[s]]['values']
            gg[s] = G(fv['%s_p%d_m' % (sx, p)], 'measured', [ANSUR_FACT[s], 'ansur2_measurement_definitions'], ANSUR_DEF[s], False)
        add(dict(
            id='ansur2_%s_p%d' % (sex.lower(), p),
            name='US Army %s, %dth percentile (ANSUR II)' % ('men' if sex == 'M' else 'women', p),
            group='Everyday', sex=sex,
            description='Each number is that measure\'s own %dth percentile among %d US Army %s measured in 2010-2012. No single soldier has all of them.' % (p, n, 'men' if sex == 'M' else 'women'),
            height_m=val(st['%s_p%d_m' % (sx, p)], 'measured', ['ansur2_stature'], 'percentile of measured stature'),
            weight_kg=val(wt['%s_p%d_kg' % (sx, p)], 'measured', ['ansur2_weight'], 'percentile of measured scale weight'),
            body_fat_pct={'value': None, 'status': 'unknown', 'note': 'ANSUR II has no body-composition data.'},
            girths=gg, template=None,
            notes=['Percentile builds combine each measure\'s own percentile, so the girths are not a matched set.',
                   'Soldiers are younger and leaner than US civilians; see the NHANES builds for a civilian baseline.']))

# ANSUR II subgroups and the largest-arm man (measured data, selected rows)
def subgroup(sex, fk, n, rule, H, W, ch, wa, bi, fo, th, ca, ne, label):
    keys = [fk, 'ansur2_measurement_definitions']
    return dict(chest=G(ch, 'derived', keys, ANSUR_DEF['chest'] + '; subgroup median', False),
                waist=G(wa, 'derived', keys, ANSUR_DEF['waist'] + '; subgroup median', False),
                arm_flexed=G(bi, 'derived', keys, ANSUR_DEF['arm_flexed'] + '; subgroup median', False),
                forearm=G(fo, 'derived', keys, ANSUR_DEF['forearm'] + '; subgroup median', False),
                thigh=G(th, 'derived', keys, ANSUR_DEF['thigh'] + '; subgroup median', False),
                calf=G(ca, 'derived', keys, ANSUR_DEF['calf'] + '; subgroup median', False),
                neck=G(ne, 'derived', keys, ANSUR_DEF['neck'] + '; subgroup median', False))

add(dict(id='ansur2_m_leanheavy', name="US Army men, 'lean but heavy' subgroup (ANSUR II, n=39)", group='Everyday', sex='M',
         description='Medians of 39 soldiers with BMI 28 or more and chest at least 20 cm larger than the navel waist. The most athletic shape in ANSUR II; not an athlete sample.',
         height_m=val(1.759, 'derived', ['ansur2_male_subgroups'], 'subgroup median of measured stature'),
         weight_kg=val(92.1, 'derived', ['ansur2_male_subgroups'], 'subgroup median of measured weight'),
         body_fat_pct={'value': None, 'status': 'unknown'},
         girths=subgroup('M', 'ansur2_male_subgroups', 39, '', 1.759, 92.1, 1.151, 0.930, 0.407, 0.339, 0.655, 0.403, 0.411, ''),
         template=None,
         notes=['Selection rule (researcher\'s): BMI >= 28 and chest minus navel waist >= 20 cm. Chest and waist differ from other soldiers partly because of that rule.',
                'Forearm 33.9 and neck 41.1 cm are from the fact\'s orig text.']))
add(dict(id='ansur2_f_leanheavy', name="US Army women, 'lean but heavy' subgroup (ANSUR II, n=70)", group='Everyday', sex='F',
         description='Medians of 70 soldiers with BMI 26 or more and chest at least 15 cm larger than the navel waist. Not an athlete sample.',
         height_m=val(1.644, 'derived', ['ansur2_female_subgroups'], 'subgroup median of measured stature'),
         weight_kg=val(76.7, 'derived', ['ansur2_female_subgroups'], 'subgroup median of measured weight'),
         body_fat_pct={'value': None, 'status': 'unknown'},
         girths=subgroup('F', 'ansur2_female_subgroups', 70, '', 1.644, 76.7, 1.053, 0.870, 0.326, 0.275, 0.650, 0.391, 0.342, ''),
         template=None,
         notes=['Women\'s chest includes the bust, so the rule partly selects for bust size, not muscle. Biceps is not larger than in the big-waist group.',
                'Forearm 27.5 and neck 34.2 cm are from the fact\'s orig text.']))
k = ['ansur2_male_largest_arms', 'ansur2_measurement_definitions']
add(dict(id='ansur2_m_largest_arm', name='US Army man with the largest flexed arm (ANSUR II, one person)', group='Everyday', sex='M',
         description='One anonymous soldier: the largest flexed arm (49.0 cm) of 4,082 men. All his numbers are from one tape session.',
         height_m=val(1.745, 'measured', ['ansur2_male_largest_arms']),
         weight_kg=val(113.9, 'measured', ['ansur2_male_largest_arms']),
         body_fat_pct={'value': None, 'status': 'unknown'},
         girths=dict(chest=G(1.232, 'measured', k, ANSUR_DEF['chest'], False), waist=G(1.044, 'measured', k, ANSUR_DEF['waist'], False),
                     arm_flexed=G(0.490, 'measured', k, ANSUR_DEF['arm_flexed'], False), forearm=G(0.402, 'measured', k, ANSUR_DEF['forearm'], False),
                     thigh=G(0.732, 'measured', k, ANSUR_DEF['thigh'], False), calf=G(0.461, 'measured', k, ANSUR_DEF['calf'], False),
                     neck=G(0.453, 'measured', k, ANSUR_DEF['neck'], False)),
         template=None,
         notes=['BMI 37.4. His muscularity is unknown (no body-composition data). He marks the edge of the measured data.']))

# ====================================================================== EVERYDAY: NHANES 2015-2018
NH = 'nhanes_2015_2018_adults'
for sex, H, Hmean, W, Wmean, waist, waistmean, arm, armmean, bmi in (
        ('M', 1.754, 1.753, 87.4, 90.6, 1.018, 1.029, 0.344, 0.347, 28.5),
        ('F', 1.613, 1.613, 73.1, 77.5, 0.964, 0.984, 0.316, 0.323, 28.4)):
    add(dict(id='nhanes_%s_median' % sex.lower(), name='US %s 20 and over, median (NHANES 2015-2018)' % ('men' if sex == 'M' else 'women'),
             group='Everyday', sex=sex,
             description='Medians for US civilian %s aged 20 and over, measured in 2015-2018 (Fryar et al. 2021). Each value is its own median.' % ('men' if sex == 'M' else 'women'),
             height_m=val(H, 'measured', [NH], 'median standing height (Table %s)' % ('11' if sex == 'M' else '9'), other=[{'value': Hmean, 'label': 'mean', 'status': 'measured'}]),
             weight_kg=val(W, 'measured', [NH], 'median weight (Table %s)' % ('5' if sex == 'M' else '3'), other=[{'value': Wmean, 'label': 'mean', 'status': 'measured'}]),
             body_fat_pct={'value': None, 'status': 'unknown', 'note': 'Not in this report.'},
             girths=girths(waist=G(waist, 'measured', [NH], 'NHANES: tape at the uppermost lateral border of the hip crest (ilium). Not the navel level ANSUR uses.', True,
                                   other=[{'value_m': waistmean, 'label': 'mean'}])),
             extra_girths={'arm_relaxed': G(arm, 'measured', [NH], 'NHANES: mid-upper arm, relaxed, at the midpoint between acromion and olecranon. Not the flexed biceps ANSUR uses.', True,
                                            other=[{'value_m': armmean, 'label': 'mean'}])},
             template={'build_id': 'ansur2_%s_p50' % sex.lower(), 'method': 'ansur_predictor',
                       'reason': 'Civilian body, inside the ANSUR II weight and height range. The ANSUR II %s predictor (girth = A x W^p x H^q) gives average-shape girths for this height and weight. NHANES has no chest, forearm, thigh, calf or neck in this report.' % ('male' if sex == 'M' else 'female')},
             notes=['Median BMI %.1f (Table %s).' % (bmi, '15' if sex == 'M' else '14'),
                    'Medians of separate measures do not describe one real person.',
                    'The waist and arm here use NHANES landmarks, which differ from ANSUR II. No sourced conversion exists in this data.']))

# ====================================================================== NATURAL ATHLETES
add(dict(id='chappell2019_natural_pro', name='British natural PRO bodybuilders, men (Chappell 2019, n=8)', group='Natural athletes', sex='M',
         description='Group mean of 8 DFAC/WNBF natural PROs, all top-5 at a PRO world final. Self-reported height and end-of-prep weight.',
         drug_status='Tested federations: all PROs polygraphed; urine tests for top placers only.',
         height_m=val(1.77, 'reported', ['chappell2019_natural_pro_bodybuilders'], 'self-reported group mean (SD 0.05)'),
         weight_kg=val(82.3, 'reported', ['chappell2019_natural_pro_bodybuilders'], 'self-reported weight at the end of contest prep (SD 6.6)',
                       other=[{'value': 95.6, 'label': 'start of diet (SD 8.3)', 'status': 'reported'}]),
         body_fat_pct={'value': None, 'status': 'unknown', 'note': 'FFMI 25.0 in the fact assumes 5% fat; that is an assumption.'},
         girths=girths(), template=None,
         notes=['End BMI 26.2 (Table 1).']))
add(dict(id='kouri1995_nonusers', name='Gym athletes who never used steroids (Kouri 1995, n=74)', group='Natural athletes', sex='M',
         description='Approximate group means of 74 male gym athletes who reported no steroid use (plus urine test). Means come second-hand from Helms and McDonald.',
         drug_status='Self-reported non-users plus urine test.',
         height_m=val(1.80, 'reported', ['kouri1995_group_means'], 'approximate group mean (about 1.8 m), secondary source'),
         weight_kg=val(82.0, 'reported', ['kouri1995_group_means'], 'approximate group mean (about 82 kg), secondary source'),
         body_fat_pct={'value': 13.0, 'status': 'reported', 'method': 'skinfolds; approximate group mean (about 13%), secondary source', 'source_keys': ['kouri1995_group_means']},
         girths=girths(), template=None,
         notes=['Highest normalized FFMI in this group: 25.0. That is a sample maximum, not a hard limit.']))

# Mr America mean of the 1956 program rows
mra = F['mr_america_1938_1954_program_girths']['values']
import re, statistics as stt
def hstr(s):
    m = re.match(r"(\d+)'([\d.]*)", s); return (int(m.group(1)) * 12 + (float(m.group(2)) if m.group(2) else 0)) * IN
rows = mra['rows']; cols = mra['columns']
Hm = stt.mean(hstr(r[2]) for r in rows); Wm = stt.mean(r[3] * LB for r in rows)
def cm(c):
    i = cols.index(c); v = [r[i] for r in rows if r[i] is not None]; return round(stt.mean(v) * IN, 4), len(v)
MRA_DEF = 'Contest program figure; method not stated (flexed or relaxed, cold or pumped unknown); mean of the program rows'
mk = ['mr_america_1938_1954_program_girths']
add(dict(id='mr_america_1938_1954_mean', name='Mr. America winners 1938-1954, mean of program figures', group='Natural athletes', sex='M',
         description='Mean of the 15 winners\' figures "taken when they won", from the 1956 Mr. USA contest program (MuscleMemory transcription). Pre-steroid era.',
         drug_status='Pre-steroid era; presumed drug-free, not tested.',
         height_m=val(round(Hm, 3), 'derived', mk, 'mean of 15 reported heights'),
         weight_kg=val(round(Wm, 1), 'derived', mk, 'mean of 15 reported weights'),
         body_fat_pct={'value': None, 'status': 'unknown'},
         girths=dict(chest=G(cm('chest')[0], 'derived', mk, MRA_DEF + '; chest expanded or not unknown', 'unknown'),
                     waist=G(cm('waist')[0], 'derived', mk, MRA_DEF + '; landmark not stated', 'unknown'),
                     arm_flexed=G(cm('arm')[0], 'derived', mk, MRA_DEF + '; flexed or relaxed not stated', 'unknown'),
                     forearm=G(cm('forearm')[0], 'derived', mk, MRA_DEF + '; landmark not stated', 'unknown'),
                     thigh=G(cm('thigh')[0], 'derived', mk, MRA_DEF + '; landmark not stated; 14 rows (1944 thigh missing)', 'unknown'),
                     calf=G(cm('calf')[0], 'derived', mk, MRA_DEF, 'unknown'),
                     neck=G(cm('neck')[0], 'derived', mk, MRA_DEF, 'unknown')),
         template=None,
         notes=['Means computed by the data compiler from the 15 program rows (1938-1954).',
                'Caveat (verifier): these heights and weights imply a mean normalized FFMI of about 27.4 at 5% fat, against Kouri\'s 25.4 for the same era. The program weights may not be contest-day weights.']))

rv = F['steve_reeves_presteroid']['values']; P = rv['program_1956']; GP = rv['GreatestPhysiques']
rk = ['steve_reeves_presteroid', 'mr_america_1938_1954_program_girths']
def rg(a, b, defn, vb='1956 program row (dated: when he won)'):
    lo, hi = min(a, b), max(a, b)
    return G(a, 'reported', rk, defn, 'unknown', rng=[lo, hi] if a != b else None, disputed=(a != b), value_basis=vb)
RD = 'Program/fan-site figure; method not stated'
add(dict(id='steve_reeves_1947', name='Steve Reeves (Mr. America 1947)', group='Natural athletes', sex='M',
         description='Classic pre-steroid physique. Two sources disagree: the 1956 contest program (when he won in 1947) and a later fan-site set.',
         drug_status='Pre-steroid era; presumed drug-free, not tested.',
         height_m=val(P['height_m'], 'reported', rk, "6'1\" in both sources"),
         weight_kg=val(P['mass_kg'], 'reported', rk, '213 lb in the 1956 program', rng=[96.6, 102.1], disputed=True,
                       value_basis='1956 program row', other=[{'value': [97.5, 102.1], 'label': '215-225 lb (GreatestPhysiques, undated)', 'status': 'reported'}]),
         body_fat_pct={'value': None, 'status': 'unknown'},
         girths=dict(chest=rg(P['chest_m'], GP['chest_m'], RD), waist=rg(P['waist_m'], GP['waist_m'], RD + '; landmark not stated'),
                     arm_flexed=rg(P['arm_m'], GP['arm_m'], RD + '; flexed or relaxed not stated'),
                     forearm=G(P['forearm_m'], 'reported', rk, RD, 'unknown', value_basis='1956 program row only'),
                     thigh=rg(P['thigh_m'], GP['thigh_m'], RD + '; landmark not stated'), calf=rg(P['calf_m'], GP['calf_m'], RD),
                     neck=G(P['neck_m'], 'reported', rk, RD, 'unknown', value_basis='1956 program row only')),
         template=None,
         notes=['GreatestPhysiques set: 18.5 / 52 / 29 / 26 / 18.5 in (arm, chest, waist, thigh, calf). Probably later or idealised figures (unverified inference).',
                'Derived FFMI 26.7 at an assumed 5% fat (normalized 26.4).']))

# ====================================================================== BODYBUILDERS (pros)
FV = 'Fan/profile site figure; date and method not stated'
ARMD = FV + '; flexed or relaxed not stated (bodybuilding convention is flexed)'
CHD = FV + '; chest may be expanded or lat-spread (ANSUR: quiet breathing)'
WAD = FV + '; landmark not stated (bodybuilding figures are usually the narrowest waist; ANSUR uses the navel)'
THD = FV + '; landmark not stated (ANSUR uses the top of the thigh)'
CAD = FV
def gi(v, keys, defn, status='reported', lo=None, hi=None, vb=None):
    if lo is not None:
        return G(inch(v), status, keys, defn, 'unknown', rng=[inch(lo), inch(hi)], disputed=True, value_basis=vb)
    return G(inch(v), status, keys, defn, 'unknown', value_basis=vb)

ck = ['ronnie_coleman_girths']
add(dict(id='ronnie_coleman', name='Ronnie Coleman (8x Mr. Olympia)', group='Bodybuilders', sex='M',
         description='Reference: his heaviest contest weight, 2004 Mr. Olympia.',
         drug_status='Not tested (open IFBB pro era).',
         height_m=val(ftin(5, 11), 'reported', ['ronnie_coleman_height_weight'], "5'11\" in all sources"),
         weight_kg=val(134.3, 'reported', ['ronnie_coleman_height_weight'], '2004 Mr. Olympia, 296 lb (FLEX via The Barbell)', rng=[132.0, 134.3],
                       value_basis='FLEX figure; Iron Man reports 291 lb the morning of prejudging',
                       other=[{'value': 112.9, 'label': '1998 Olympia, 249 lb', 'status': 'reported'}, {'value': 116.6, 'label': '1999 Olympia, 257 lb', 'status': 'reported'},
                              {'value': [129.7, 130.2], 'label': '2003 Olympia, 286-287 lb', 'status': 'reported'}, {'value': 124.7, 'label': '2005 Olympia, 275 lb', 'status': 'reported'},
                              {'value': [142.9, 149.7], 'label': 'off-season, 315-330 lb', 'status': 'reported'}]),
         body_fat_pct={'value': None, 'status': 'unknown', 'note': 'Derived FFMIs assume 5% (an assumption).'},
         girths=girths(chest=gi(58, ck, CHD, lo=58, hi=60, vb='58 in from two sites (GreatestPhysiques, FitnessVolt); Wikipedia gives chest/back 60'),
                       waist=gi(36, ck, WAD, vb='GreatestPhysiques only'),
                       arm_flexed=gi(24, ck, ARMD, vb='24 in, three sites agree'),
                       thigh=gi(35, ck, THD, lo=34, hi=36, vb='midpoint of 34 (FitnessVolt) and 36 (GreatestPhysiques)'),
                       calf=gi(22, ck, CAD, vb='GreatestPhysiques only')),
         template=None,
         notes=['Girths are undated; one fan site says "over 310 lbs", so they may be off-season, not contest, figures.',
                'Derived FFMI at an assumed 5% fat: 33.0 (1998) to 39.2 (2004).']))

ak = ['arnold_schwarzenegger_girths']
BOOK = "Self-reported 'top form' figure from his book (via CelebHeights); method not stated"
add(dict(id='arnold_schwarzenegger', name='Arnold Schwarzenegger (7x Mr. Olympia)', group='Bodybuilders', sex='M',
         description="Reference: his book's 'top form' measurements, 235 lb at 6'2\".",
         drug_status='Not tested (pre-testing era).',
         height_m=val(ftin(6, 2), 'reported', ['arnold_schwarzenegger_height_weight'], "6'2\" in his book (self-reported)", rng=[1.867, 1.905], disputed=True,
                      value_basis="book figure; 6'1.5\" in a 1980 interview and a 1969 measurement, 6'1.75\" self-described, 6'3\" on one fan site"),
         weight_kg=val(106.6, 'reported', ['arnold_schwarzenegger_height_weight'], "235 lb 'top form' (book)",
                       other=[{'value': 111.6, 'label': '1971 Olympia, 246 lb', 'status': 'reported'}, {'value': 106.6, 'label': '1975 Olympia, 235 lb', 'status': 'reported'},
                              {'value': 117.9, 'label': 'off-season, 260 lb', 'status': 'reported'}]),
         body_fat_pct={'value': None, 'status': 'unknown'},
         girths=girths(chest=gi(57, ak, BOOK + '; may be expanded'), waist=gi(34, ak, BOOK + '; landmark not stated', lo=30, hi=34, vb='book figure; one fan site gives 30'),
                       arm_flexed=gi(22, ak, BOOK + '; flexed or relaxed not stated'), thigh=gi(28.5, ak, BOOK + '; landmark not stated'), calf=gi(20, ak, BOOK)),
         template=None,
         notes=['Derived FFMI at an assumed 5% fat: 28.7-30.4 (unnormalized).']))

yk = ['dorian_yates_girths']
add(dict(id='dorian_yates', name='Dorian Yates (6x Mr. Olympia)', group='Bodybuilders', sex='M',
         description='Reference: 1993 Mr. Olympia weight (Guinness).',
         drug_status='Not tested (open IFBB pro era).',
         height_m=val(1.765, 'reported', ['dorian_yates_height_weight'], "5'9\" or 5'10\"", rng=[1.753, 1.778], disputed=True, value_basis='midpoint of the disputed range'),
         weight_kg=val(116.6, 'reported', ['dorian_yates_height_weight'], '1993 Mr. Olympia: 116.57 kg (Guinness) = 257 lb (The Barbell)',
                       other=[{'value': 109.8, 'label': '1992 Olympia, 242 lb', 'status': 'reported'}, {'value': [117.9, 131.5], 'label': '260-290 lb, FitnessVolt (contest or off-season not stated)', 'status': 'reported'}]),
         body_fat_pct={'value': None, 'status': 'unknown'},
         girths=girths(chest=gi(56.5, yk, CHD, lo=56, hi=57, vb='midpoint'), waist=gi(36, yk, WAD, lo=34, hi=38, vb='midpoint'),
                       arm_flexed=gi(20.5, yk, ARMD, lo=20, hi=21, vb='midpoint'), thigh=gi(30, yk, THD, vb="FitnessVolt only ('legs 30')"),
                       calf=gi(21, yk, CAD, lo=20, hi=22, vb='midpoint')),
         template=None, notes=['The two sites disagree on every shared girth.']))

jk = ['jay_cutler_girths']
add(dict(id='jay_cutler', name='Jay Cutler (4x Mr. Olympia)', group='Bodybuilders', sex='M',
         description='Reference: 2009 Mr. Olympia weight.',
         drug_status='Not tested (open IFBB pro era).',
         height_m=val(1.765, 'reported', ['jay_cutler_height_weight'], "5'9\" or 5'10\"", rng=[1.753, 1.778], disputed=True, value_basis='midpoint of the disputed range'),
         weight_kg=val(lbkg(271), 'reported', ['jay_cutler_height_weight'], "2009 Mr. Olympia, '271 striated pounds' (FLEX via The Barbell)",
                       other=[{'value': lbkg(255), 'label': '1999 Olympia, 255 lb', 'status': 'reported'}, {'value': lbkg(273), 'label': '2004 Olympia, 273 lb', 'status': 'reported'},
                              {'value': lbkg(264), 'label': '2005 Olympia, 264 lb', 'status': 'reported'}, {'value': lbkg(260), 'label': '2010 Olympia, 260 lb', 'status': 'reported'},
                              {'value': [131.5, 140.6], 'label': 'off-season, 290-310 lb', 'status': 'reported'}]),
         body_fat_pct={'value': None, 'status': 'unknown'},
         girths=girths(chest=gi(58, jk, CHD, vb='three sources agree'), waist=gi(34, jk, WAD, lo=34, hi=39, vb='34 from two sources; FitnessVolt gives 39 (possibly off-season, not stated)'),
                       arm_flexed=gi(22, jk, ARMD, lo=21, hi=22, vb='22 from two sources; GreatestPhysiques gives 21'),
                       thigh=gi(30, jk, THD, vb='three sources agree'), calf=gi(19.5, jk, CAD, lo=19, hi=20, vb='midpoint')),
         template=None, notes=[]))

hk = ['phil_heath_girths']
add(dict(id='phil_heath', name='Phil Heath (7x Mr. Olympia)', group='Bodybuilders', sex='M',
         description='Reference: 2011 Mr. Olympia weight.',
         drug_status='Not tested (open IFBB pro era).',
         height_m=val(ftin(5, 9), 'reported', ['phil_heath_height_weight'], "5'9\""),
         weight_kg=val(lbkg(248), 'reported', ['phil_heath_height_weight'], "2011 Mr. Olympia, 'At 248' (FLEX via The Barbell)",
                       other=[{'value': lbkg(227), 'label': '2009 Olympia, 227 lb', 'status': 'reported'}, {'value': lbkg(245), 'label': "2010 Olympia, 245 lb (same report also says 242)", 'status': 'reported'},
                              {'value': lbkg(270), 'label': 'off-season, 270 lb', 'status': 'reported'}, {'value': lbkg(255), 'label': '2023, retired, 255 lb (self-reported)', 'status': 'reported'}]),
         body_fat_pct={'value': None, 'status': 'unknown'},
         girths=girths(chest=gi(54, hk, CHD), waist=gi(29, hk, WAD), arm_flexed=gi(23, hk, ARMD), thigh=gi(32, hk, THD), calf=gi(20, hk, CAD)),
         template=None, notes=["All girths from one fan site (GreatestPhysiques): show as 'fan site, unverified, no date or method'."]))

add(dict(id='big_ramy', name="Mamdouh 'Big Ramy' Elssbiay (Mr. Olympia 2020, 2021)", group='Bodybuilders', sex='M',
         description='Reference: 2014 Mr. Olympia weight, "285 lean pounds" (FLEX).',
         drug_status='Not tested (open IFBB pro era).',
         height_m=val(ftin(5, 10), 'reported', ['big_ramy_height_weight'], "5'9\" (FitnessVolt, GreatestPhysiques), 5'10\" (FLEX 2015), 5'11\" (FLEX 2014)",
                      rng=[ftin(5, 9), ftin(5, 11)], disputed=True, value_basis="middle value; FLEX 2015 says 5'10\""),
         weight_kg=val(lbkg(285), 'reported', ['big_ramy_height_weight'], '2014 Mr. Olympia, 285 lb (FLEX via The Barbell)',
                       other=[{'value': [138.3, 140.6], 'label': '2015 Olympia on stage, 305-310 lb', 'status': 'estimate'},
                              {'value': 143.3, 'label': '2015, 316 lb on a scale fully dressed, two days before the contest', 'status': 'reported'},
                              {'value': 155.0, 'label': 'off-season Jan 2022, 155 kg (his own statement)', 'status': 'reported'},
                              {'value': 153.2, 'label': 'off-season Sep 2022, 337.7 lb (his own post)', 'status': 'reported'}]),
         body_fat_pct={'value': None, 'status': 'unknown'},
         girths=girths(), template=None,
         notes=['No girths found in any source.', '2020 and 2021 stage weights not found in a fetchable source.']))

ok_ = ['sergio_oliva_girths']
add(dict(id='sergio_oliva', name='Sergio Oliva (3x Mr. Olympia)', group='Bodybuilders', sex='M',
         description='Reference: 1967 Mr. Olympia, about 225 lb at 5\'10" (The Barbell).',
         drug_status='Not tested (pre-testing era).',
         height_m=val(ftin(5, 10), 'reported', ['sergio_oliva_height_weight'], "5'10\""),
         weight_kg=val(lbkg(225), 'reported', ['sergio_oliva_height_weight'], "1967 Olympia, 'around 225 pounds'",
                       other=[{'value': lbkg(240), 'label': "1972 Olympia, 'around 240 pounds'", 'status': 'reported'},
                              {'value': [lbkg(225), lbkg(245)], 'label': 'contest range 225-245 lb (Wikipedia citing M&F)', 'status': 'reported'},
                              {'value': lbkg(255), 'label': 'FitnessVolt profile 255 lb (outlier vs its own database, 225)', 'status': 'reported'}]),
         body_fat_pct={'value': None, 'status': 'unknown'},
         girths=girths(chest=gi(55.5, ok_, CHD, lo=52, hi=59, vb='midpoint of FitnessVolt 52 and GreatestPhysiques 59'),
                       waist=gi(29, ok_, WAD, lo=27, hi=32, vb="Rick Wayne's '29 inches' (journalist anecdote); fan sites give 27 and 32"),
                       arm_flexed=gi(21.25, ok_, ARMD, lo=20, hi=22.5, vb='midpoint of FitnessVolt 20 and GreatestPhysiques 22.5'),
                       thigh=gi(29, ok_, "Rick Wayne: thighs equal to his 29 in waist (anecdote, not a recorded measurement); landmark not stated"),
                       calf=gi(20, ok_, "Rick Wayne: 'close to 20 inches' (anecdote)")),
         template=None, notes=['Very wide spread between sources.']))

# research-group bodybuilders
dk = ['demoraes2019_competition_day_girths']
DMD = 'de Moraes 2019 Table 2, contest day (M2), carb-loading group mean'
add(dict(id='demoraes2019_br_national', name='Brazilian national-level bodybuilders, contest day (de Moraes 2019, n=15)', group='Bodybuilders', sex='M',
         description='Group means of 15 IFBB amateur qualifiers measured on contest day after carbohydrate loading.',
         drug_status='Not stated.',
         height_m=val(1.73, 'measured', dk, 'group mean (the printed SD of 0.01 m is probably a typo)'),
         weight_kg=val(81.5, 'measured', dk, 'contest-day (M2) group mean', other=[{'value': 79.2, 'label': 'weigh-in day (M1)', 'status': 'measured'}]),
         body_fat_pct={'value': None, 'status': 'unknown'},
         girths=girths(chest=G(1.123, 'measured', dk, DMD + "; chest taken 'expired' (after breathing out)", True),
                       waist=G(0.792, 'measured', dk, DMD + '; landmark not stated in the pages read', 'unknown'),
                       arm_flexed=G(0.424, 'measured', dk, DMD + "; 'upper arm', flexed or relaxed not stated", 'unknown'),
                       forearm=G(0.335, 'measured', dk, DMD + '; landmark not stated', 'unknown'),
                       thigh=G(0.641, 'measured', dk, DMD + '; landmark not stated', 'unknown'),
                       calf=G(0.411, 'measured', dk, DMD, 'unknown')),
         template=None, notes=['Hip 101.4 cm also measured. Neck not measured.', 'Methods text and table disagree on which group had n=9 and n=15.']))

sk = ['sukwong2022_thai_elite_bodybuilders']
add(dict(id='sukwong2022_thai_elite', name='Thai national-team bodybuilders (Sukwong 2022, n=10)', group='Bodybuilders', sex='M',
         description='Group means of the Thai national team (3 world, 5 Asian, 2 SE Asian champions), measured off-contest.',
         drug_status='Not stated.',
         height_m=val(1.702, 'measured', sk, 'group mean (SD 0.0723)'),
         weight_kg=val(81.33, 'measured', sk, 'group mean (SD 7.9)'),
         body_fat_pct={'value': 17.56, 'status': 'measured', 'method': 'bioelectrical impedance (BIA), off-contest', 'source_keys': sk},
         girths=girths(chest=G(1.0495, 'measured', sk, 'Group mean; method not stated in the text read', 'unknown'),
                       arm_flexed=G(0.4175, 'measured', sk, 'Group mean, flexed upper arm', False)),
         extra_girths={'arm_relaxed': G(0.370, 'measured', sk, 'Group mean, relaxed upper arm', True)},
         template=None, notes=['Other girths (neck, waist, hip, thigh, calf) were measured but did not extract from the PDF.',
                                'Flexed minus relaxed arm: +4.75 cm (about +13%).']))

add(dict(id='mcinnis1999_bodybuilders', name='Male bodybuilders (McInnis & Balady 1999, n=14)', group='Bodybuilders', sex='M',
         description='Group means of 14 male bodybuilders in an exercise study.',
         drug_status='Not stated (an FFMI of 28 suggests many were not drug-free; inference, not a finding).',
         height_m=val(1.80, 'measured', ['mcinnis1999_bodybuilders'], 'group mean (SD 0.08)'),
         weight_kg=val(99.0, 'measured', ['mcinnis1999_bodybuilders'], 'group mean (SD 7)'),
         body_fat_pct={'value': 8.0, 'status': 'measured', 'method': 'not stated in the abstract (SD 3)', 'source_keys': ['mcinnis1999_bodybuilders']},
         girths=girths(), template=None, notes=['FFM 91 kg; derived FFMI 28.1.']))

add(dict(id='withers1997_elite', name='Elite male bodybuilders 5 days before a contest (Withers 1997, n=3)', group='Bodybuilders', sex='M',
         description='Group means of 3 elite bodybuilders measured by a 4-compartment model.',
         drug_status='Not stated.',
         height_m=val(1.78, 'derived', ['withers1997_elite_bb_4C'], 'derived from mass / BMI (not in the abstract)', rng=[1.776, 1.783]),
         weight_kg=val(92.79, 'measured', ['withers1997_elite_bb_4C'], '5 days pre-contest', other=[{'value': 99.7, 'label': '10 weeks pre-contest', 'status': 'measured'}]),
         body_fat_pct={'value': 5.0, 'status': 'measured', 'method': '4-compartment model, 5 days pre-contest (9.1% at 10 weeks)', 'source_keys': ['withers1997_elite_bb_4C']},
         girths=girths(), template=None, notes=['Derived FFMI about 27.8 (27.7-27.9).']))

add(dict(id='fry1991_nonelite', name='Non-elite male bodybuilders at competition (Fry 1991, n=36)', group='Bodybuilders', sex='M',
         description='Group means of 36 non-elite competitors.',
         drug_status='Not stated.',
         height_m=val(1.744, 'measured', ['fry1991_nonelite_bodybuilders'], 'group mean (SD 0.067)'),
         weight_kg=val(80.3, 'measured', ['fry1991_nonelite_bodybuilders'], 'group mean (SD 11.0)'),
         body_fat_pct={'value': 9.3, 'status': 'measured', 'method': 'not stated in the fact (SD 1.6)', 'source_keys': ['fry1991_nonelite_bodybuilders']},
         girths=girths(), template=None, notes=['Chest / abdominal circumference ratio 1.345 (individual girths not given).']))

# ====================================================================== STRONGMEN AND LIFTERS
add(dict(id='brian_shaw', name="Brian Shaw (4x World's Strongest Man)", group='Strongmen and lifters', sex='M',
         description='Reference: his hydrostatic test, Feb 2024.',
         drug_status='Not stated.',
         height_m=val(2.016, 'reported', ['brian_shaw_height_weight'], "6'8\" (WSM profile) or 6'6.75\" (his own 2025 video)", rng=[2.0, 2.032], disputed=True, value_basis='midpoint of the disputed range'),
         weight_kg=val(174.5, 'reported', ['brian_shaw_height_weight'], '384.6 lb at a self-filmed hydrostatic test, Feb 2024',
                       other=[{'value': 199.6, 'label': '2019 start of a cut, 440 lb', 'status': 'reported'}]),
         body_fat_pct={'value': 17.6, 'status': 'reported', 'method': 'hydrostatic weighing, self-filmed test relayed by FitnessVolt (Feb 2024)', 'source_keys': ['brian_shaw_height_weight']},
         girths=girths(), template=None,
         notes=['No credible girths found. SEO pages with contradictory numbers exist and are not used.', 'Derived FFMI 34.8-35.9 (unnormalized).']))
add(dict(id='hafthor_bjornsson', name='Hafthor Julius Bjornsson (WSM 2018)', group='Strongmen and lifters', sex='M',
         description='Reference: his self-reported 200 kg, July 2025, before the 510 kg deadlift.',
         drug_status='Not stated.',
         height_m=val(2.05, 'reported', ['hafthor_bjornsson_height_weight'], '205 cm (WSM profile, tale of the tape)', rng=[2.05, 2.06], disputed=True, value_basis="WSM profile; FitnessVolt says 6'9\" (2.06 m)"),
         weight_kg=val(200.0, 'reported', ['hafthor_bjornsson_height_weight'], '200 kg, his own Instagram, Jul 2025',
                       other=[{'value': 210.0, 'label': 'career heaviest, 2012', 'status': 'reported'}, {'value': 152.0, 'label': 'boxing weigh-in, 18 Mar 2022', 'status': 'reported'}]),
         body_fat_pct={'value': None, 'status': 'unknown'},
         girths=girths(), template=None, notes=['No girths found.']))
add(dict(id='eddie_hall', name="Eddie Hall (WSM 2017)", group='Strongmen and lifters', sex='M',
         description='Reference: lab-measured height and mass about 14 months after his WSM win (Balshaw 2024).',
         drug_status='Not stated.',
         height_m=val(1.90, 'measured', ['eddie_hall_height_weight', 'balshaw2024_eddie_hall_mri'], 'lab measurement (Balshaw 2024 Table 1)'),
         weight_kg=val(172.0, 'measured', ['eddie_hall_height_weight', 'balshaw2024_eddie_hall_mri'], 'lab measurement, about 2018',
                       other=[{'value': 196.5, 'label': 'self-reported peak', 'status': 'reported'}, {'value': 142.2, 'label': 'boxing weigh-in, 18 Mar 2022', 'status': 'reported'}]),
         body_fat_pct={'value': None, 'status': 'unknown'},
         girths=girths(), template=None,
         notes=['The paper does not name him; the identification is an inference from his titles.', 'MRI leg muscle volume about 2x untrained men; no tape girths.']))
add(dict(id='lasha_talakhadze', name='Lasha Talakhadze (3x Olympic weightlifting champion)', group='Strongmen and lifters', sex='M',
         description='Reference: official weigh-in at the Tokyo 2020 Olympics.',
         drug_status='Tested (Olympic weightlifting).',
         height_m=val(1.95, 'official', ['lasha_talakhadze_height_weight'], 'Tokyo 2020 official profile', rng=[1.95, 1.97], disputed=True, value_basis='official profile; Olympedia and Wikipedia say 1.97 m'),
         weight_kg=val(177.0, 'official', ['lasha_talakhadze_height_weight'], 'Tokyo 2020 weigh-in (Olympedia results table)',
                       other=[{'value': 157.34, 'label': 'Rio 2016 weigh-in', 'status': 'official'}, {'value': 178.45, 'label': 'Paris 2024 weigh-in', 'status': 'official'}]),
         body_fat_pct={'value': None, 'status': 'unknown'},
         girths=girths(), template=None, notes=['No girths published.']))
add(dict(id='kraemer2020_strongmen', name='Elite strongman competitors (Kraemer 2020, n=18)', group='Strongmen and lifters', sex='M',
         description='Group means of 18 elite strongmen measured by DXA over 5 annual screenings.',
         drug_status='Not stated.',
         height_m=val(1.874, 'measured', ['kraemer2020_elite_strongmen_dxa'], 'group mean (SD 0.071)'),
         weight_kg=val(152.9, 'measured', ['kraemer2020_elite_strongmen_dxa'], 'group mean (SD 19.3)'),
         body_fat_pct={'value': 18.7, 'status': 'measured', 'method': 'DXA (SD 6.2)', 'source_keys': ['kraemer2020_elite_strongmen_dxa']},
         girths=girths(), template=None, notes=['Lean mass 118.0 kg; derived FFMI 35.1.']))

# ====================================================================== COMIC CHARACTERS
def comic(id, name, sex, key, H, W, status, basis_h, basis_w, editions=None, variants=None, notes=None, hr=None, wr=None, disputed=False, vb=None, other_w=None, girth_basis_kg=None, extra=None):
    b = dict(id=id, name=name, group='Comic characters', sex=sex,
             description='Publisher or licensed-book figures. No source gives any girth.',
             height_m=val(H, status, [key], basis_h, rng=hr, disputed=disputed and hr is not None, value_basis=vb if hr else None),
             weight_kg=val(W, status, [key], basis_w, rng=wr, disputed=disputed and wr is not None, value_basis=vb if wr else None, other=other_w),
             body_fat_pct={'value': None, 'status': 'unknown'},
             girths=girths(), template=None, notes=notes or [])
    if editions: b['editions'] = editions
    if variants: b['variants'] = variants
    if girth_basis_kg: b['girth_basis_weight_kg'] = girth_basis_kg
    if extra: b.update(extra)
    add(b)

comic('superman', 'Superman', 'M', 'superman', ftin(6, 3), lbkg(235), 'official', "6'3\" (DK 2007, 2008, 2019, 2021)", '235 lb (four DK books agree)',
      other_w=[{'value': lbkg(225), 'label': "225 lb, DC-licensed Mayfair RPG 'Superman: The Man of Steel Sourcebook' (1989)", 'status': 'reported'}])
comic('batman', 'Batman', 'M', 'batman', ftin(6, 2), lbkg(210), 'official', "6'2\" (DK books; DK 2019 prints 1.88 m)", '210 lb (DK books; DK 2019 prints 95 kg)')
comic('captain_america', 'Captain America (Steve Rogers)', 'M', 'captain_america', ftin(6, 2), lbkg(240), 'official', "6'2\" (DK Avengers guides print 1.87 m)", '240 lb (Marvel.com, DK 2019)',
      wr=[lbkg(220), lbkg(240)], disputed=True, vb='240 lb: the publisher\'s own site and the latest DK book; 220 lb: DK Avengers guides 2010 and 2013',
      editions=[{'label': 'Marvel.com; DK Marvel Encyclopedia 2019', 'height_m': ftin(6, 2), 'weight_kg': lbkg(240), 'status': 'official'},
                {'label': 'DK Avengers Ultimate Character Guides (2010, 2013)', 'height_m': 1.87, 'weight_kg': lbkg(220), 'status': 'official (licensed)'}])
comic('thor', 'Thor (Thor Odinson)', 'M', 'thor', ftin(6, 6), lbkg(640), 'official', "6'6\" (Marvel.com, DK 2019)", '640 lb (Marvel.com, DK 2019)',
      variants=[{'name': 'Donald Blake (human host)', 'height_m': ftin(5, 9), 'weight_kg': lbkg(150), 'status': 'official', 'source_keys': ['thor']}],
      notes=['Marvel.com gives no density explanation.'])
comic('bruce_banner', 'Bruce Banner (human form)', 'M', 'hulk_banner', ftin(5, 9), lbkg(128), 'official', "5'9\" (Marvel.com)", '128 lb (Marvel.com)',
      notes=["The fan wiki lists 5'10\" citing Avengers: Roll Call #1 (reported)."],
      extra={'description': 'Publisher figures for the human form. No source gives any girth.'})
comic('hulk_savage', 'Hulk, savage green form', 'M', 'hulk_savage', ftin(7), lbkg(1040), 'official', "7 ft (DK 2019)", '1,040 lb (DK 2019)',
      hr=[ftin(7), ftin(8)], wr=[lbkg(1040), lbkg(1400)], disputed=True, vb='DK 2019 (official); the 8 ft / 1,400 lb end is fan-wiki reported',
      editions=[{'label': 'DK Marvel Encyclopedia 2019', 'height_m': ftin(7), 'weight_kg': lbkg(1040), 'status': 'official'},
                {'label': 'Fan wiki, upper limit (citing handbooks, not verified)', 'height_m': ftin(8), 'weight_kg': lbkg(1400), 'status': 'reported'}])
comic('hulk_grey', "Hulk, grey 'Joe Fixit' form", 'M', 'hulk_grey_joe_fixit', ftin(6, 6), lbkg(900), 'reported', "6'6\" (fan wiki only)", '900 lb (fan wiki only)',
      notes=['No official page gives a separate grey-Hulk figure.'],
      extra={'description': 'Fan-wiki figures only (reported). No source gives any girth.'})
comic('hulk_marvelcom', 'Hulk (as listed on Marvel.com)', 'M', 'hulk_merged_marvelcom', ftin(7, 6), lbkg(1150), 'official', "7'6\" (Marvel.com)", '1,150 lb (Marvel.com)',
      notes=['Marvel.com does not say which form. The fan wiki calls these the Merged Hulk values (reported).'])
comic('thing', 'The Thing (Ben Grimm)', 'M', 'thing', ftin(6), lbkg(500), 'official', '6 ft (Marvel.com, DK 2019)', '500 lb (Marvel.com, DK 2019)',
      other_w=[{'value': lbkg(430), 'label': "430 lb at 6'6\", fan-wiki infobox citing The Thing #1 (2022); its own body text says 'almost 500 pounds'", 'status': 'reported'}],
      notes=['Often drawn much taller than the 6 ft listing (fan wiki).'])
comic('juggernaut', 'Juggernaut (Cain Marko)', 'M', 'juggernaut', ftin(6, 10), lbkg(900), 'official', "6'10\" (DK 2019)", '900 lb (DK 2019)',
      hr=[ftin(6, 10), ftin(9, 5)], wr=[lbkg(900), lbkg(1900)], disputed=True, vb="DK 2019; Marvel.com's 9'5\" / 1,900 lb page is flagged by Marvel as unverified crowd-sourced content",
      editions=[{'label': 'DK Marvel Encyclopedia 2019 (fan-wiki editors: "every handbook")', 'height_m': ftin(6, 10), 'weight_kg': lbkg(900), 'status': 'official'},
                {'label': 'Marvel.com, crowd-sourced, flagged unverified by Marvel', 'height_m': ftin(9, 5), 'weight_kg': lbkg(1900), 'status': 'reported'}])
comic('colossus_human', 'Piotr Rasputin (Colossus, human form)', 'M', 'colossus', ftin(6, 6), lbkg(250), 'official', "6'6\" (Marvel.com)", '250 lb (Marvel.com)',
      extra={'description': 'Publisher figures for the human form. No source gives any girth.'})
comic('colossus_armored', 'Colossus (armoured form)', 'M', 'colossus', ftin(7, 5), lbkg(500), 'official', "7'5\" (Marvel.com, DK 2019)", '500 lb (Marvel.com, DK 2019)',
      notes=["Marvel.com calls the tissue 'steel-like ... analogous to osmium and to carbon steel'. A steel body of this size would weigh about 1,200-1,320 kg (estimate, colossus_density_check). The stated weight implies a mean density of only about 1,350-1,480 kg/m^3."])
comic('wolverine', 'Wolverine (Logan)', 'M', 'wolverine', ftin(5, 3), lbkg(300), 'official', "5'3\" in every source", '300 lb with adamantium skeleton (Marvel.com)',
      wr=[lbkg(195), lbkg(300)], disputed=True, vb="Marvel.com with adamantium; 195 lb is Marvel.com's 'without adamantium' figure, and DK 2019 prints 195 lb unqualified",
      variants=[{'name': 'Without adamantium skeleton', 'height_m': ftin(5, 3), 'weight_kg': lbkg(195), 'status': 'official', 'source_keys': ['wolverine']}],
      girth_basis_kg=lbkg(195),
      notes=['The adamantium adds 105 lb (47.6 kg) inside the bones (Marvel.com). It adds weight but no girth, so girths should be scaled from the 195 lb body.'])
comic('kingpin', 'Kingpin (Wilson Fisk)', 'M', 'kingpin', ftin(6, 7), lbkg(450), 'official', "6'7\" (Marvel.com, DK 2019)", '450 lb (Marvel.com, DK 2019)',
      notes=["Marvel.com: 'Most of Fisk's bulk is actually muscle, not fat; his enormous size is comparable to that of a sumo wrestler.'",
             "The fan wiki says 'only the bare 9 pounds actually being fat', citing OHOTMU: Daredevil 2004 (reported, unverified)."])
comic('luke_cage', 'Luke Cage', 'M', 'luke_cage', ftin(6, 6), lbkg(425), 'official', "6'6\" (Marvel.com, DK 2019)", '425 lb (Marvel.com; DK 2019 weight illegible)',
      notes=["Marvel.com: 'Superdense Body Mass' and 'incredibly dense muscle tissues'. Denser tissue would mean smaller girths than a human-density estimate."])
comic('black_panther', "Black Panther (T'Challa)", 'M', 'black_panther', ftin(6), lbkg(200), 'official', '6 ft (Marvel.com, DK 2019)', '200 lb (Marvel.com, DK 2019)')
comic('bane', 'Bane', 'M', 'bane', ftin(6, 8), lbkg(350), 'official', "6'8\" (DK 2021, 2019)", '350 lb (DK 2021, 2019, 2008)',
      variants=[{'name': 'With Venom', 'height_m': ftin(6, 8), 'weight_kg': lbkg(425), 'status': 'official', 'source_keys': ['bane'], 'note': '425 lb with Venom (DK 2021)'}])
comic('doomsday', 'Doomsday', 'M', 'doomsday', ftin(8, 10), lbkg(915), 'official', "8'10\" (DK 2019 guide prints 2.69 m)", '915 lb (DK 2019 guide prints 415 kg)',
      hr=[ftin(7), ftin(8, 10)], wr=[lbkg(615), lbkg(915)], disputed=True, vb='DK 2019 guide (legible, with printed metric); the DK editions differ',
      editions=[{'label': 'DK DC Comics Encyclopedia 2008', 'height_m': ftin(7), 'weight_kg': lbkg(615), 'status': 'official'},
                {'label': 'DK DC Comics Encyclopedia New Edition 2021 (height read from OCR)', 'height_m': ftin(7, 6), 'weight_kg': lbkg(915), 'status': 'official'},
                {'label': 'DK DC Comics Ultimate Character Guide 2019 (prints 2.69 m, 415 kg)', 'height_m': ftin(8, 10), 'weight_kg': lbkg(915), 'status': 'official'}],
      notes=['Height and weight ranges do not combine freely: use one edition at a time.'])
comic('darkseid', 'Darkseid', 'M', 'darkseid', ftin(8, 9), lbkg(1815), 'official', "8'9\" (DK 2007, 2008, 2016, 2019, 2021)", '1,815 lb (DK 2007-2021; DK 2019 prints 823 kg)')
comic('she_hulk', 'She-Hulk (Jennifer Walters)', 'F', 'she_hulk', ftin(6, 7), lbkg(700), 'official', "6'7\" (Marvel.com, DK 2019)", '700 lb (Marvel.com)',
      wr=[lbkg(650), lbkg(700)], disputed=True, vb="700 lb: Marvel.com (publisher's own site); 650 lb: DK 2019",
      editions=[{'label': 'Marvel.com', 'height_m': ftin(6, 7), 'weight_kg': lbkg(700), 'status': 'official'},
                {'label': 'DK Marvel Encyclopedia 2019', 'height_m': ftin(6, 7), 'weight_kg': lbkg(650), 'status': 'official'}],
      variants=[{'name': 'Jennifer Walters (human form)', 'height_m': ftin(5, 10), 'weight_kg': lbkg(150), 'status': 'official', 'source_keys': ['she_hulk']}],
      notes=['No female FFMI ceiling exists in these data; Kouri 1995 covers men only.'])
comic('abomination', 'Abomination (Emil Blonsky)', 'M', 'abomination', ftin(6, 8), lbkg(980), 'official', "6'8\" (Marvel.com)", '980 lb (Marvel.com, DK 2019)',
      variants=[{'name': 'Emil Blonsky (human form)', 'height_m': ftin(5, 10), 'weight_kg': lbkg(180), 'status': 'official', 'source_keys': ['abomination']}])

# ====================================================================== REX AND OLLIE
RO = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'rexollie_girths.json')))
CLOTH = {
 'rex': {'chest': (True, 'over the tank top (thin)'), 'waist': (True, 'over the tank top and belt'), 'arm_flexed': (False, 'bare'),
         'forearm': (False, 'bare skin, above the wrist strap'), 'thigh': (True, 'over baggy cargo pants'), 'calf': (True, 'over baggy cargo pants, which bunch at the knee'), 'neck': (False, 'bare')},
 'ollie': {'chest': (True, 'includes the open vest at the sides'), 'waist': (True, 'includes the vest flaps at the sides; both edges partly behind his fists'), 'arm_flexed': (False, 'bare (fur)'),
           'forearm': (False, 'bare (fur)'), 'thigh': (True, 'over baggy cargo pants'), 'calf': (True, 'over cargo pants, above the boots'), 'neck': (False, 'bare')}}
SITE_DEF = {
 'rex': {'chest': 'torso width between the arms at row 250 (pectoral level)', 'waist': 'torso width at row ~365 (navel level estimated; navel hidden by the tank top)',
         'arm_flexed': 'upper arm as drawn, at the biceps belly, perpendicular to the arm (fully visible image-right arm); not a flexed pose',
         'forearm': 'forearm just below the elbow, perpendicular to the arm', 'thigh': 'top of the thigh just below the crotch (row ~543)',
         'calf': 'widest part of the lower leg below the knee (rows ~610-650)', 'neck': 'neck below the jaw (rows ~140-160)'},
 'ollie': {'chest': 'torso width at row 240 (nipple level)', 'waist': 'torso width at row ~360 (navel level)',
           'arm_flexed': 'upper arm as drawn, mid-length, perpendicular to the arm (fully visible image-left arm, akimbo); not a flexed pose',
           'forearm': 'forearm, mean of its widest stretch, perpendicular to the arm', 'thigh': 'top of the thigh just below the crotch (row ~558)',
           'calf': 'widest part of the lower leg (rows ~630-650)', 'neck': 'neck below the jaw (rows ~125-140)'}}
WSRC = {
 'rex': {'chest': 'checker reading (278 px at row 250)', 'waist': 'Method C reading at its omphalion row (237 px); masks give 235-242 px at rows 360-370',
         'arm_flexed': 'checker reading (165 px, image-right arm); Method C also 165 px at the biceps belly', 'forearm': 'checker reading (145 px, image-right arm)',
         'thigh': 'Method B reading (160/158 px at row 543); checker 150-165 px', 'calf': 'Method C reading (165 px); Method B 174/165 px; checker 150-165 px',
         'neck': 'midpoint of Method B (135 px) and Method C (120 px)'},
 'ollie': {'chest': 'Method A mask at row 240 (297 px); Method C 290 px, Method B 307 px', 'waist': 'Method C reading (320 px); mask 319-320 px at rows 350-360',
           'arm_flexed': 'Method A mask with the checker\'s 2 px fur erosion, mid upper arm (148 px); Method C read 115 px', 'forearm': 'Method A mask, 2 px erosion, mean of the widest stretch (108 px); Method C read 90 px',
           'thigh': 'Method B (165/162 px) and Method C (164 px)', 'calf': 'Method C (172 px); masks 167/177 px; Method B 176/180 px',
           'neck': 'midpoint of Method B (125 px) and Method C (120 px)'}}
for who in ('rex', 'ollie'):
    gg = {}
    for s in SITES:
        r = RO[who][s]; inc, cl = CLOTH[who][s]
        gg[s] = {'value_m': r['girth_m'], 'range_m': r['range_m'], 'status': 'derived', 'derived_from': 'picture',
                 'disputed': False, 'source_keys': ['rex_ollie_picture_girths'],
                 'definition': SITE_DEF[who][s], 'definition_differs_from_ansur': True,
                 'includes_clothing': inc, 'clothing_note': cl,
                 'derivation': {'width_px': r['width_px'], 'width_m': r['width_m'], 'depth_ratio_k': r['k'], 'scale_m_per_px': round(3.048 / 790, 7),
                                'formula': 'Ramanujan perimeter of an ellipse with axes width and k x width', 'width_source': WSRC[who][s]}}
    add(dict(id=who, name='Rex' if who == 'rex' else 'Ollie', group='Rex and Ollie', sex=None,
             description=('Original character measured from a reference picture. Lizard build with a large tail; wears a tank top and cargo pants.' if who == 'rex'
                          else 'Original character measured from a reference picture. Bull-headed build; wears cargo pants, boots and an open vest.'),
             height_m=val(3.048, 'estimate', ['rex_ollie_picture_mass'], '10 ft, set by the project; Rex\'s crest tip to the floor fixes the picture scale' if who == 'rex'
                          else '10 ft, set by the project. At Rex\'s scale Ollie measures 3.06 m to the horn tips, 3.02 m to the hair, 2.98 m to the skull.'),
             weight_kg=val(2700, 'estimate', ['rex_ollie_picture_mass'], 'picture measurement: volume x density', rng=[2300, 3000]),
             volume_m3={'value': 2.55, 'status': 'estimate', 'source_keys': ['rex_ollie_picture_mass'],
                        'note': 'Checker central volume: Rex 2.553 m^3, Ollie 2.531 m^3.'},
             density_kg_m3={'value': 1060, 'range': [1020, 1080], 'status': 'estimate', 'source_keys': ['rex_ollie_picture_mass'],
                            'note': 'Bodybuilder whole-body density 1.0812 g/mL (Fry, Cisar & Housh 1987) less about 2% for lung gas.'},
             body_fat_pct={'value': None, 'status': 'unknown'},
             girths=gg, template=None,
             clothing=('Tank top and cargo pants. Chest and waist are over the tank top; thigh and calf are over the cargo pants. Arms, forearms and neck are bare.' if who == 'rex'
                       else 'Cargo pants, boots and an open vest. Chest and waist include the vest at the sides; thigh and calf are over the cargo pants (calf above the boots). Arms, forearms and neck are bare (fur).'),
             tail=({'volume_m3': 0.289, 'mass_kg_at_1060': 307, 'status': 'derived', 'derived_from': 'picture', 'source_keys': ['rex_ollie_picture_mass'],
                    'note': 'The large tail adds weight (about 0.29 m^3, about 11% of the volume, about 307 kg at 1,060 kg/m^3) but has no listed girth. It is included in the 2,700 kg.'} if who == 'rex'
                   else {'volume_m3': 0.01, 'mass_kg_at_1060': 11, 'status': 'derived', 'derived_from': 'picture', 'source_keys': ['rex_ollie_picture_mass'],
                         'note': 'Small tufted tail, about 0.01 m^3 (about 11 kg), included in the 2,700 kg; no girth.'}),
             notes=['All girths are derived from one front-view picture. Depth is not visible, so each girth assumes an ellipse with depth = k x width; k comes from the reconciled volume model.',
                    'Method check on ANSUR II medians: the same construction from chest breadth gives a chest girth about 12% short of the real tape (0.931 vs 1.056 m); the waist is about 2% short. So the chest here may read low.',
                    'The arm is not in a flexed pose; the page field is "flexed upper arm", so the definition differs.',
                    'Height, mass, volume and density are estimates from the picture; the girths are derived from the picture.']))

# ====================================================================== new facts
NEWF = {}
NEWF['nhanes_2015_2018_adults'] = dict(key='nhanes_2015_2018_adults', topic='added',
    label='US adults aged 20 and over: weight, height, BMI, waist and mid-upper-arm circumference (NHANES 2015-2018)', status='measured',
    values={'men': {'weight_kg': {'n': 5085, 'mean': 90.6, 'p5': 61.7, 'p50': 87.4, 'p95': 130.3, 'table': 5},
                    'height_cm': {'n': 5092, 'mean': 175.3, 'p5': 162.8, 'p50': 175.4, 'p95': 187.4, 'table': 11},
                    'bmi': {'n': 5076, 'mean': 29.4, 'p5': 20.8, 'p50': 28.5, 'p95': 41.0, 'table': 15},
                    'waist_cm': {'n': 4881, 'mean': 102.9, 'p5': 77.6, 'p50': 101.8, 'p95': 132.6, 'table': 20},
                    'mid_upper_arm_cm': {'n': 4919, 'mean': 34.7, 'p5': 27.5, 'p50': 34.4, 'p95': 42.8, 'table': 23},
                    'weight_lb_mean': 199.8, 'height_in_mean': 69.0},
            'women': {'weight_kg': {'n': 5386, 'mean': 77.5, 'p5': 49.8, 'p50': 73.1, 'p95': 119.6, 'table': 3},
                      'height_cm': {'n': 5510, 'mean': 161.3, 'p5': 149.8, 'p50': 161.3, 'p95': 172.5, 'table': 9},
                      'bmi': {'n': 5381, 'mean': 29.8, 'p5': 19.7, 'p50': 28.4, 'p95': 44.6, 'table': 14},
                      'waist_cm': {'n': 5065, 'mean': 98.4, 'p5': 73.3, 'p50': 96.4, 'p95': 129.7, 'table': 19},
                      'mid_upper_arm_cm': {'n': 5140, 'mean': 32.3, 'p5': 24.7, 'p50': 31.6, 'p95': 42.6, 'table': 22},
                      'weight_lb_mean': 170.8, 'height_in_mean': 63.5},
            'orig': 'All race and Hispanic-origin groups, age 20 and over, weighted estimates. Pregnant females excluded from weight, BMI and circumferences.'},
    sources=[{'title': 'Fryar CD, Carroll MD, Gu Q, Afful J, Ogden CL. Anthropometric reference data for children and adults: United States, 2015-2018. National Center for Health Statistics. Vital Health Stat 3(46). 2021.',
              'url': 'https://www.cdc.gov/nchs/data/series/sr_03/sr03-046-508.pdf'}],
    notes="Read by the data compiler from the PDF fetched on 2026-10-10 (sha256 936396720de7ce66...). Waist: 'measured with a tape measure at the uppermost lateral border of the hip crest (ilium)'. Mid-upper arm: tape at the midpoint of the acromion-olecranon length (relaxed). Weighted means and percentiles of the civilian noninstitutionalized population; 18,061 examined persons (all ages). The report has no chest, forearm, thigh, calf or neck girths.")
NEWF['ansur1988_natural_vs_omphalion_waist'] = dict(key='ansur1988_natural_vs_omphalion_waist', topic='added',
    label='Natural (narrowest) waist vs navel waist, US Army 1988 (ANSUR I)', status='derived',
    values={'men': {'n': 1774, 'ratio_natural_over_omphalion_median': 0.975, 'p5': 0.929, 'p95': 1.022, 'median_difference_cm': 2.1},
            'women': {'n': 2208, 'ratio_natural_over_omphalion_median': 0.920, 'p5': 0.843, 'p95': 0.985, 'median_difference_cm': 6.2}},
    sources=[{'title': 'ANSUR 1988 public male data (OPEN Design Lab)', 'url': 'https://tools.openlab.psu.edu/publicData/ansurMen.csv'},
             {'title': 'ANSUR 1988 public female data (OPEN Design Lab)', 'url': 'https://tools.openlab.psu.edu/publicData/ansurWomen.csv'}],
    notes="Proposed by the anthro verifier (missing item 2); recomputed by the data compiler from the verifier's downloaded CSVs (WAIST_CIRC_NATURAL / WAIST_CIRC-OMPHALION): identical results. 1988 soldiers, not 2010-12. Use to put a natural-waist tape number on the ANSUR navel basis: navel waist = natural waist / ratio. Status derived.")
NEWF['rex_ollie_picture_mass'] = dict(key='rex_ollie_picture_mass', topic='added',
    label='Rex and Ollie: height, volume, density and mass from the reference picture', status='estimate',
    values={'height_m_each': 3.048, 'height_note': "10 ft set by the project. Rex: 790 px crest tip to floor, 0.0038582 m/px. Ollie at the same scale: 3.063 m to horn tips, 3.021 m hair, 2.982 m skull.",
            'mass_kg_each': 2700, 'mass_range_kg': [2300, 3000], 'mc_p2_5_p97_5_kg': {'rex': [2373, 2940], 'ollie': [2318, 2921]},
            'all_extremes_kg': {'rex': [1950, 3450], 'ollie': [1990, 3250]},
            'volume_m3': 2.55, 'volume_central_m3': {'rex': 2.553, 'ollie': 2.531},
            'density_kg_m3': 1060, 'density_range_kg_m3': [1020, 1080],
            'segments_m3': {'rex': {'head_neck': 0.09, 'torso': 1.125, 'arm_each': 0.254, 'legs': 0.390, 'feet': 0.15, 'tail': 0.289},
                            'ollie': {'head_neck': 0.075, 'torso': 1.626, 'arm_each': 0.188, 'legs': 0.374, 'feet': 0.07, 'tail': 0.01}},
            'frontal_area_m2': {'rex': 4.92, 'ollie': 4.5}},
    sources=[{'title': 'Picture measurement: reconciled estimate (checker) of Methods A, B and C', 'file': '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/final.json'},
             {'title': 'Checker results', 'file': '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/checker/results_checker.json'},
             {'title': 'Fry, Cisar & Housh 1987, J Applied Sport Science Research 1(4):61-65 (bodybuilder body density 1.0812 g/mL at 8.48% fat)', 'url': 'https://www.bisp-surf.de/Record/PU198802031700'},
             {'title': 'Modlesky et al. 1996, J Appl Physiol 80:2085 (FFM density 1.089 in weight trainers)', 'url': 'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:8806917%20AND%20SRC:MED&resultType=core&format=json'}],
    notes="Status: estimate; source: picture measurement. Three methods (pixel slices, segment solids, anthropometric scaling) were reconciled by a checker who re-measured the picture. Density 1,060 = 1,081 kg/m^3 (Fry 1987, lungs removed) x 0.98 (about 2% lung gas). Not included: bird- or dinosaur-style air sacs, which could put Rex near 950-1,000 kg/m^3 (about 7% less mass). Pants and boots are counted as body volume.")
NEWF['rex_ollie_picture_girths'] = dict(key='rex_ollie_picture_girths', topic='added',
    label='Rex and Ollie: girths derived from the reference picture', status='derived',
    values={who: {s: {'width_px': RO[who][s]['width_px'], 'k': RO[who][s]['k'], 'girth_m': RO[who][s]['girth_m'], 'range_m': RO[who][s]['range_m']} for s in SITES} for who in ('rex', 'ollie')},
    sources=[{'title': 'Region masks and measurements (Methods A, B, C) and checker readings', 'file': '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/'},
             {'title': 'Girth computation script (data compiler)', 'file': '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/bcdata/scripts/girths.py'}],
    notes="Girth = Ramanujan ellipse perimeter of the measured frontal width w and depth k x w, at the checker's scale 0.0038582 m/px. k is the depth ratio the reconciled volume model used at that site: chest 1.05 (range 0.90-1.25), waist 0.80 (0.70-0.90), legs 1.0 (0.85-1.10), Rex upper arm 0.90, Ollie upper arm 0.95, forearm 0.85, Rex neck 1.05 (head-neck k), Ollie neck 1.0. Arm k ranges 0.80-1.00 (Rex) and 0.85-1.05 (Ollie), forearm 0.75-0.95 and neck +/-0.10 are the compiler's choices. Ranges combine the width range with the k range. Method check on ANSUR II medians: from chest breadth 0.289 m at k 1.05 this construction gives 0.931 m vs a measured chest of 1.056 m (12% short); from waist breadth 0.325 m at k 0.80 it gives 0.922 vs 0.937 m (2% short).")
NEWF['build_templates_rule'] = dict(key='build_templates_rule', topic='added',
    label='How missing girths are filled (template choice)', status='derived',
    values={'methods': {'geometric': 'G = G_template x sqrt((W/H) / (W_template/H_template)): fixed shape (chest follows this in ANSUR II, exponent 1.02)',
                        'isometric': 'G = G_template x (H / H_template): pure size scaling, same shape and same density',
                        'ansur_predictor': 'G_cm = A x W_kg^p x H_m^q from ansur2_girth_predictor_male / _female: average soldier shape for that height and weight'},
            'rule': 'Same sex. Pick the shape class from the source (muscular hero or bodybuilder; heavy, thick-waisted; everyday). Within the class, pick the build with recorded girths whose W/H^3 is closest (log distance). Muscular class: Reeves, Mr America mean, de Moraes, Arnold, Oliva, Heath, Yates, Cutler, Coleman. Heavy class: ANSUR II largest-arm man. Female: ANSUR II women only (no female athlete girths exist in these data).'},
    sources=[], notes='Rule set by the data compiler. Girths filled this way are derived. Builds with BMI above 43.5 (the highest BMI of any person with measured girths here) are flagged beyond_human_girth_data.')

for kk, vv in NEWF.items():
    assert kk not in F
    F[kk] = vv

# ====================================================================== derived metrics and templates
def bmi(b): return b['weight_kg']['value'] / b['height_m']['value'] ** 2
def pi(b, w=None): return (w or b['weight_kg']['value']) / b['height_m']['value'] ** 3
B = {b['id']: b for b in builds}
for b in builds:
    w = b.get('girth_basis_weight_kg') or b['weight_kg']['value']
    b['derived'] = {'bmi': round(bmi(b), 1), 'pi_kg_m3': round(pi(b), 1), 'status': 'derived',
                    'note': 'BMI = W/H^2 and ponderal index W/H^3 from the reference height and weight.'}
    if b.get('girth_basis_weight_kg'):
        b['derived']['pi_girth_basis_kg_m3'] = round(pi(b, w), 1)

MUSC = ['steve_reeves_1947', 'mr_america_1938_1954_mean', 'demoraes2019_br_national', 'arnold_schwarzenegger', 'sergio_oliva', 'phil_heath', 'dorian_yates', 'jay_cutler', 'ronnie_coleman']
HEAVY = ['ansur2_m_largest_arm']
def closest(build, cands, w=None):
    p = pi(build, w)
    return min(cands, key=lambda c: abs(math.log(p / pi(B[c]))))
def have(bid, sites):
    return all(B[bid]['girths'][s]['value_m'] is not None for s in sites)

def T(bid, tid, method, reason):
    b = B[bid]; t = B[tid]
    w = b.get('girth_basis_weight_kg') or b['weight_kg']['value']
    b['template'] = {'build_id': tid, 'method': method, 'reason': reason,
                     'pi_build_kg_m3': round(pi(b, w), 1), 'pi_template_kg_m3': round(pi(t), 1),
                     'outside_template_range': bool(method == 'geometric' and abs(math.log(pi(b, w) / pi(t))) > math.log(1.10))}

missing = lambda bid: [s for s in SITES if B[bid]['girths'][s]['value_m'] is None]
# bodybuilders and research groups missing neck/forearm etc: closest muscular build that has those sites
for bid in ['ronnie_coleman', 'arnold_schwarzenegger', 'dorian_yates', 'jay_cutler', 'phil_heath', 'sergio_oliva', 'big_ramy',
            'demoraes2019_br_national', 'sukwong2022_thai_elite', 'mcinnis1999_bodybuilders', 'withers1997_elite', 'fry1991_nonelite',
            'chappell2019_natural_pro', 'kouri1995_nonusers']:
    need = missing(bid)
    pool = [c for c in MUSC if c != bid and have(c, need)]
    if bid == 'big_ramy':
        pool = [c for c in MUSC if c != bid]
    tid = closest(B[bid], pool)
    T(bid, tid, 'geometric', 'Closest W/H^3 among bodybuilder builds that have the missing sites (%s).' % ', '.join(need))
for bid in ['brian_shaw', 'hafthor_bjornsson', 'eddie_hall', 'lasha_talakhadze', 'kraemer2020_strongmen']:
    T(bid, 'ansur2_m_largest_arm', 'geometric', 'No strongman girths exist. The heaviest measured man with a full ANSUR II tape set (BMI 37.4, thick waist) is a better shape for strongmen (17-19% fat) than a stage-lean bodybuilder. W/H^3 21.4 is also the closest measured value.')

hero_note = 'Muscular hero class: closest W/H^3 among bodybuilder builds with recorded girths.'
for bid in ['superman', 'batman', 'captain_america', 'black_panther', 'colossus_human', 'bane', 'doomsday', 'wolverine', 'luke_cage',
            'thor', 'hulk_savage', 'hulk_grey', 'hulk_marvelcom', 'thing', 'juggernaut', 'darkseid', 'abomination']:
    w = B[bid].get('girth_basis_weight_kg')
    tid = closest(B[bid], MUSC, w)
    r = hero_note
    if w: r += ' Uses the 195 lb body (without adamantium): the metal adds weight inside the bones, not girth.'
    T(bid, tid, 'geometric', r)
T('kingpin', 'ansur2_m_largest_arm', 'geometric', "Marvel compares his size to a sumo wrestler's, so a thick-waisted heavy template fits better than a stage-lean bodybuilder. The ANSUR II largest-arm man is the heaviest measured full tape set (W/H^3 21.4).")
T('colossus_armored', 'colossus_human', 'isometric', "The armoured form is Piotr's body changed to a steel-like substance. Scale Piotr's shape by height. Weight-based scaling would assume human density, which Marvel's description rules out.")
for sx in ('m', 'f'):
    T('nhanes_%s_median' % sx, 'ansur2_%s_p50' % sx, 'ansur_predictor', B['nhanes_%s_median' % sx]['template']['reason'])
T('bruce_banner', 'ansur2_m_p50', 'ansur_predictor', 'Ordinary (non-muscular) body inside the ANSUR II range: use the male average-shape predictor.')
T('she_hulk', 'ansur2_f_leanheavy', 'geometric', 'No female athlete girths exist in these data. The ANSUR II lean-but-heavy women are the most athletic female shape available and the closest female W/H^3 with a full tape set (the largest-arm woman is obese-shaped, waist 133 cm). Male bodybuilder shapes were rejected for proportions.')
# Kouri non-users: gym athletes, not contest-lean; the rule above already picked; keep rule result but note
B['kouri1995_nonusers']['template']['reason'] += ' Gym athletes at about 13% fat, so the waist may read small.'

# flags
for b in builds:
    bm = bmi(b)
    if b.get('girth_basis_weight_kg'):
        bm = b['girth_basis_weight_kg'] / b['height_m']['value'] ** 2
    if not b['template']:
        b['flags'] = {'beyond_human_girth_data': False,
                      'note': ('Girths come from the picture, not from a human model. Weight and BMI are far beyond any human.' if b['group'] == 'Rex and Ollie' else None)}
        continue
    b['flags'] = {'beyond_human_girth_data': bool(bm > 43.5),
                  'note': ('BMI %.0f is above 43.5, the highest BMI of any person with measured girths in these data. The comics verifier recommends showing such girths as "unknown / beyond human data" rather than extrapolating; if shown, label them estimates.' % bm) if bm > 43.5 else None}
    if b['template'] and b['template'].get('outside_template_range'):
        b['flags']['outside_template_range'] = True

# ====================================================================== exact citations for reference height and weight
CITE = {
 'ronnie_coleman': (['Iron Man Magazine, Lonnie Teper', "The 2004 Mr. Olympia"], ["The 2004 Mr. Olympia", "'2004 IFBB Mr. Olympia'"]),
 'arnold_schwarzenegger': (['CelebHeights'], ['CelebHeights']),
 'dorian_yates': (['FitnessVolt - Dorian Yates profile', 'GreatestPhysiques.com - Dorian Yates'], ['Guinness World Records', "The 1994 Mr. Olympia"]),
 'jay_cutler': (["The 2004 Mr. Olympia", 'FitnessVolt - Jay Cutler profile', 'GreatestPhysiques.com - Jay Cutler', "Wikipedia 'Jay Cutler"], ["The 2009 Mr. Olympia"]),
 'phil_heath': (['GreatestPhysiques.com - Phil Heath'], ["The 2011 Mr. Olympia"]),
 'big_ramy': (["The 2014 Mr. Olympia", "The 2015 Mr. Olympia", 'FitnessVolt - Big Ramy profile', 'GreatestPhysiques.com - Mamdouh'], ["The 2014 Mr. Olympia"]),
 'sergio_oliva': (['Sergio Oliva: The Full'], ['Sergio Oliva: The Full']),
 'brian_shaw': (["Wikipedia 'Brian Shaw", 'FitnessVolt - Brian Shaw profile'], ["Body Fat Percentage Comes Out"]),
 'hafthor_bjornsson': (["Wikipedia 'Hafthor", 'FitnessVolt - Hafthor Bjornsson profile'], ['200-kg (440.9-lb) Physique Update']),
 'eddie_hall': (['Balshaw TG'], ['Balshaw TG']),
 'lasha_talakhadze': (['Tokyo 2020 official results site', 'Olympedia - Lasha Talakhadze'], ['2020 Weightlifting Super-Heavyweight']),
 'steve_reeves_1947': (['MuscleMemory.org'], ['MuscleMemory.org']),
 'superman': (['DK'], ['DK']), 'batman': (['DK'], ['DK']),
 'captain_america': (['Marvel.com', 'DK'], ['Marvel.com', 'DK Marvel Encyclopedia', 'DK The Avengers']),
 'thor': (['Marvel.com', 'DK'], ['Marvel.com', 'DK']), 'bruce_banner': (['Marvel.com'], ['Marvel.com']),
 'hulk_savage': (['DK', 'Marvel Database'], ['DK', 'Marvel Database']), 'hulk_grey': (['Marvel Database'], ['Marvel Database']),
 'hulk_marvelcom': (['Marvel.com'], ['Marvel.com']), 'thing': (['Marvel.com', 'DK'], ['Marvel.com', 'DK']),
 'juggernaut': (['Marvel.com', 'DK'], ['Marvel.com', 'DK']), 'colossus_human': (['Marvel.com'], ['Marvel.com']),
 'colossus_armored': (['Marvel.com', 'DK'], ['Marvel.com', 'DK']), 'wolverine': (['Marvel.com', 'DK'], ['Marvel.com', 'DK']),
 'kingpin': (['Marvel.com', 'DK'], ['Marvel.com', 'DK']), 'luke_cage': (['Marvel.com', 'DK'], ['Marvel.com']),
 'black_panther': (['Marvel.com', 'DK'], ['Marvel.com', 'DK']), 'bane': (['DK'], ['DK']),
 'doomsday': (['DK'], ['DK']), 'darkseid': (['DK'], ['DK']), 'she_hulk': (['Marvel.com', 'DK'], ['Marvel.com', 'DK']),
 'abomination': (['Marvel.com'], ['Marvel.com', 'DK']),
}
for b in builds:
    for fld, idx in (('height_m', 0), ('weight_kg', 1)):
        o = b[fld]; key = o['source_keys'][0]; srcs = F[key]['sources']
        if b['id'] in CITE:
            subs = CITE[b['id']][idx]
            c = [x for x in srcs if any(sb in x['title'] for sb in subs)]
            assert c, (b['id'], fld, subs)
        else:
            c = list(srcs)
        o['cite'] = c

# ====================================================================== assemble
GROUPS = ['Everyday', 'Natural athletes', 'Bodybuilders', 'Strongmen and lifters', 'Comic characters', 'Rex and Ollie']
assert all(b['group'] in GROUPS for b in builds)
builds.sort(key=lambda b: GROUPS.index(b['group']))

# facts: ordered, with verify info attached
facts_out = {}
for (topic, key), c in CHECKS.items():
    pass
for key, f in F.items():
    g = dict(key=f['key'], topic=f['topic'], label=f['label'], status=f['status'], values=f['values'], sources=f['sources'], notes=f['notes'])
    ck = CHECKS.get((f['topic'], key))
    if ck:
        g['verify'] = {'ok': ck['ok'], 'issue': ck['issue'], 'corrected': ck.get('corrected') or None,
                       'applied': [e['change'] for e in LOG if e['key'] == key]}
    else:
        g['verify'] = {'ok': None, 'issue': 'Added by the data compiler; not part of the verified research.', 'corrected': None, 'applied': []}
    facts_out[key] = g

# source-key integrity
for b in builds:
    def chk(o):
        for k2 in o.get('source_keys', []): assert k2 in facts_out, (b['id'], k2)
    chk(b['height_m']); chk(b['weight_kg'])
    for s, g in b['girths'].items(): chk(g)
    for g in (b.get('extra_girths') or {}).values(): chk(g)

out = {
 'meta': {
   'title': 'Build calculator data', 'compiled': '2026-10-10', 'version': 1,
   'units': 'SI throughout: metres, kilograms, kg/m^3. Girths in metres. 1 in = 0.0254 m, 1 lb = 0.45359237 kg.',
   'inputs': {'research': FF.R,
              'nhanes_pdf': {'url': 'https://www.cdc.gov/nchs/data/series/sr_03/sr03-046-508.pdf', 'sha256': '936396720de7ce66b69e392a3b964d552f3170fc241f91fc9e93efb74c447b2d', 'fetched': '2026-10-10'},
              'picture_measurements': '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/',
              'compiler_scripts': '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/bcdata/scripts/'},
   'notes_file': 'data/NOTES.md'},
 'status_vocabulary': {
   'measured': 'Taken with a tape, scale or scanner in a study or survey, or a statistic (percentile, mean) of such measurements.',
   'official': "Printed by the publisher or a licensed book (comics), or an official results record (sport).",
   'reported': 'Stated by a magazine, fan site, the athlete, or a secondary source; not independently measured.',
   'derived': 'Calculated by us or the researchers from other numbers (includes girths filled from a template, and picture-derived girths).',
   'estimate': 'A modelled or assumed value with a stated range.',
   'unknown': 'No source. Show "unknown"; do not invent.',
   'disputed': 'Facts only (kept from the research): sources disagree. Builds never use it as a status; they set disputed: true and give a range.'},
 'schema': {
   'build': {'id': 'unique id', 'name': 'display name', 'group': 'one of groups', 'sex': "'M', 'F' or null (not stated)",
             'height_m / weight_kg': '{value, status, source_keys, basis, range, disputed, value_basis?, other?}. range is [lo, hi] when sources disagree or a value is uncertain; value is the reference value used for calculation. other lists dated or alternative values.',
             'body_fat_pct': '{value or null, status, method?, source_keys?}',
             'girths': 'object with the seven sites chest, waist, arm_flexed, forearm, thigh, calf, neck. Each is a girth entry or {value_m: null, status: "unknown"}.',
             'extra_girths': 'optional girths that do not match a site definition (e.g. arm_relaxed)',
             'template': 'null if all seven girths are recorded, else {build_id, method, reason, pi_build_kg_m3, pi_template_kg_m3, outside_template_range}. Fill each missing girth from the template build; if the template also lacks it, use the template\'s own template. Label filled girths derived.',
             'girth_basis_weight_kg': 'optional: weight to use for template scaling when part of the weight adds no girth (Wolverine\'s adamantium)',
             'editions': 'optional (comics): each published height/weight pair; height and weight ranges must not be combined across editions',
             'variants': 'optional (comics): other forms with their own height and weight (human alter egos etc.)',
             'derived': 'BMI and W/H^3 from the reference values',
             'flags': 'beyond_human_girth_data, outside_template_range',
             'drug_status / clothing / tail / volume_m3 / density_kg_m3': 'present where relevant',
             'notes': 'short plain-text notes'},
   'girth_entry': {'value_m': 'reference value in metres (null if unknown)', 'range_m': '[lo, hi] or null', 'status': 'see status_vocabulary',
                   'disputed': 'true when sources disagree', 'value_basis': 'why value_m was chosen when disputed',
                   'source_keys': 'keys into facts', 'definition': 'how this number was taken', 'definition_differs_from_ansur': "true, false or 'unknown'",
                   'includes_clothing': 'Rex and Ollie only', 'derivation': 'Rex and Ollie only'}},
 'girth_sites': {s: {'label': {'chest': 'Chest', 'waist': 'Waist', 'arm_flexed': 'Upper arm (flexed)', 'forearm': 'Forearm', 'thigh': 'Thigh', 'calf': 'Calf', 'neck': 'Neck'}[s],
                     'ansur_definition': ANSUR_DEF[s], 'ansur_fact': ANSUR_FACT[s]} for s in SITES},
 'template_methods': NEWF['build_templates_rule']['values']['methods'],
 'conversions': {
   'natural_waist_over_navel_waist': {'men': 0.975, 'women': 0.920, 'status': 'derived', 'source_keys': ['ansur1988_natural_vs_omphalion_waist'],
                                      'note': 'Median ratio in 1988 soldiers (men p5-p95 0.929-1.022; women 0.843-0.985).'},
   'flexed_minus_relaxed_upper_arm': {'cm': 4.75, 'ratio': 1.128, 'status': 'measured', 'source_keys': ['sukwong2022_thai_elite_bodybuilders'],
                                      'note': 'Group means of 10 elite Thai bodybuilders (41.75 vs 37.0 cm). No paired data for ordinary people.'},
   'in_to_m': 0.0254, 'lb_to_kg': 0.45359237},
 'groups': GROUPS,
 'builds': builds,
 'facts': facts_out,
 'corrections_applied': LOG + FF.SUMMARY_CORRECTIONS,
}
json.dump(out, open(sys.argv[1], 'w'), indent=1, ensure_ascii=False)
print('builds', len(builds), 'facts', len(facts_out), 'corrections', len(out['corrections_applied']))
for b in builds:
    t = b['template']
    print('%-28s %-22s H %.3f W %7.1f BMI %5.1f PI %5.1f  tmpl %-26s %s %s' % (b['id'], b['group'][:22], b['height_m']['value'], b['weight_kg']['value'], b['derived']['bmi'], b['derived']['pi_kg_m3'],
          (t or {}).get('build_id', '-'), (t or {}).get('method', ''), 'BEYOND' if b['flags']['beyond_human_girth_data'] else ''))
