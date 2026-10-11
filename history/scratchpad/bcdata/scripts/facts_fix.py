"""Load research-all.json, parse fact values, apply verifier corrections, record each change.
Imported by compile.py. Every edit asserts that the text it replaces exists, so nothing fails silently."""
import json, copy

R = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/research-all.json'

def load():
    d = json.load(open(R))
    facts, checks, topics = {}, {}, {}
    for t in d:
        topic = t['topic']
        topics[topic] = t
        for f in t['research']['facts']:
            g = copy.deepcopy(f)
            g['values'] = json.loads(f['values']) if isinstance(f['values'], str) else f['values']
            g['topic'] = topic
            facts[f['key']] = g
        for c in t['verify']['checks']:
            checks[(topic, c['key'])] = c
    return d, facts, checks, topics

LOG = []

def _rec(key, kind, change, facts, checks):
    topic = facts[key]['topic'] if key in facts else None
    ck = None
    for (tp, k), c in checks.items():
        if k == key:
            ck = c; topic = tp
    LOG.append(dict(topic=topic, key=key, check_ok=(ck['ok'] if ck else None), kind=kind, change=change))

def rep(f, field, old, new):
    s = f[field]
    assert old in s, (f['key'], field, old[:60])
    f[field] = s.replace(old, new)

def addnote(f, text):
    f['notes'] = (f['notes'].rstrip() + ' ' + text).strip()

def apply_all(facts, checks):
    F = facts
    def do(key, kind, change, fn):
        fn(F[key]); _rec(key, kind, change, F, checks)
    MUST = 'verifier correction (check ok=false): applied as required'
    OPT = 'verifier correction (check ok=true, corrected text given): applied'
    NOTE = 'verifier issue note (check ok=true, no corrected text): applied as a note or wording fix'

    # ------------------------------------------------------------------ ANTHRO
    def f1(f):
        rep(f, 'notes', "NECK = at infrathyroid landmark (just below Adam's apple), perpendicular to neck axis",
            "NECK = at the infrathyroid landmark, the lowest point of the thyroid cartilage (Adam's apple), perpendicular to the neck axis")
        rep(f, 'notes', 'THIGH = at the gluteal furrow (top of thigh), muscles relaxed.',
            "THIGH = at the gluteal furrow (top of thigh), perpendicular to the thigh's long axis, thigh relaxed.")
        rep(f, 'notes', 'CALF = maximum horizontal calf girth, standing.',
            'CALF = three readings in the region of maximum girth; the highest is kept (TR-15/007).')
        rep(f, 'notes', 'Allowable observer error from Table G-1.',
            'Allowable observer error from Table G-1 (pp.224-227); these are allowable thresholds, not measured error. TR-15/007 reports measured inter-observer error separately (for example about 5.9 mm for waist).')
    do('ansur2_measurement_definitions', OPT, 'Neck, thigh and calf protocol wording replaced with the corrected text; Table G-1 marked as allowable thresholds.', f1)

    do('ansur2_dataset', NOTE, "Added: the OPEN Lab page now redirects to /datasets/ansur2/ and says the sample 'is still not an approximation of the US Civilian population'.",
       lambda f: addnote(f, "The OPEN Lab page now redirects to https://www.openlab.psu.edu/datasets/ansur2/ and says the sample 'is still not an approximation of the US Civilian population'."))

    do('ansur2_biceps_flexed', NOTE, "Softened 'matches a bodybuilder's flexed-arm number' (pose and pump differ).",
       lambda f: rep(f, 'notes', "so the protocol matches a bodybuilder's flexed-arm number.",
                     "so the protocol is close to a bodybuilder's flexed-arm number, but the pose (upper arm held forward, elbow at 90 degrees) and pump state differ."))

    do('ansur2_thigh', NOTE, 'Added: tape perpendicular to the thigh axis; male SD 5.84 vs TR 5.85 is rounding.',
       lambda f: addnote(f, "The tape is perpendicular to the thigh's long axis. Male SD 5.84 here vs 5.85 in TR-15/007 is a rounding edge."))

    do('ansur2_lower_thigh', OPT, "Replaced 'Not cross-checked against a TR table' with 'Matches TR-15/007 table (60)'.",
       lambda f: rep(f, 'notes', 'Not cross-checked against a TR table.', 'Matches TR-15/007 table (60).'))

    def f_calf(f):
        rep(f, 'notes', 'The handbook has measurers record 3 readings near the maximum; the public file holds one value per subject, and which reduction (max or mean) was used is not stated in the documents read.',
            'Three readings around the observed maximum; the highest value is kept (TR-15/007). This equals the 1988 landmark method within 0.1 mm.')
    do('ansur2_calf', MUST, 'Notes replaced: the highest of three readings is kept (TR-15/007); research gap #8 deleted.', f_calf)

    do('ansur2_neck', NOTE, "Label fixed: the tape sits at the lower edge of the Adam's apple, not below it.",
       lambda f: f.__setitem__('label', "Neck circumference (at the lower edge of the Adam's apple)"))

    do('ansur2_wrist', OPT, "Replaced 'Not cross-checked' with 'Matches TR-15/007 table (92)'.",
       lambda f: rep(f, 'notes', 'Not cross-checked against a TR table.', 'Matches TR-15/007 table (92).'))

    do('ansur2_hip', OPT, "Replaced 'Not cross-checked' with 'Matches TR-15/007 table (16)'; noted it is the buttock-level girth.",
       lambda f: rep(f, 'notes', 'Not cross-checked against a TR table.', 'Matches TR-15/007 table (16) BUTTOCK CIRCUMFERENCE. It is the buttock-level girth.'))

    do('ansur2_selfreport_bias', OPT, 'Added the excluded record (Weightlbs=0) and the median biases.',
       lambda f: addnote(f, 'One male record with Weightlbs=0 excluded; medians: height +2.10 / +1.18 cm, weight -0.05 / -0.59 kg (M/F). Each sex has 18 height self-reports more than 10 cm off; trimmed means (|diff| <= 10 cm) are +2.21 / +1.21 cm.'))

    do('ansur2_girth_scaling_male', MUST, "Replaced 'how soldiers differ, which is mostly fat' with the Forbes/Hall 2007 estimate wording; values kept.",
       lambda f: rep(f, 'notes', 'These exponents describe how soldiers differ, which is mostly fat.',
                     "These exponents describe how soldiers differ in size. ANSUR II has no body-composition data. By Forbes's relation (Hall 2007, Br J Nutr 97:1059, PMC2376748), at typical fat masses roughly 60-70% of between-person weight difference is fat (estimate, derived from data on women)."))

    do('ansur2_girth_scaling_female', NOTE, 'Added the same no-body-composition caveat as the male entry.',
       lambda f: addnote(f, 'ANSUR II has no body-composition data, so the fat share of between-person differences is an estimate (see ansur2_girth_scaling_male).'))

    do('ansur2_girth_predictor_male', MUST, "Replaced 'whose extra weight is mostly fat' with the corrected wording.",
       lambda f: rep(f, 'notes', 'whose extra weight is mostly fat.',
                     'whose extra weight includes a large but unmeasured fat share (no body-composition data; see Forbes/Hall 2007 for an estimate).'))

    do('ansur2_volume_model_male', MUST, "Replaced 'Being physical, it scales sensibly to extreme builds' with the estimate-labelled caveat.",
       lambda f: rep(f, 'notes', 'Being physical, it scales sensibly to extreme builds.',
                     'It is a geometric base for extreme builds (assumption, not validated beyond ANSUR II; status of this claim: estimate). Expect it to under-predict very lean muscular bodies because the constant falls with fatness (r=-0.23 with BMI).'))

    do('ansur2_volume_model_female', NOTE, 'Added: the extreme-build caveat of the male entry applies.',
       lambda f: addnote(f, 'The extreme-build caveat in ansur2_volume_model_male applies here too.'))

    do('ansur2_segments_male', NOTE, 'Added: status covers measured values; derived lengths and ratios are flagged in notes.',
       lambda f: addnote(f, "Status 'measured' applies to the landmark heights, lengths and breadths; the derived lengths and the breadth/depth ratios are derived."))
    do('ansur2_segments_female', NOTE, 'Added: same mixed-status note as the male entry.',
       lambda f: addnote(f, "Status 'measured' applies to the landmark heights, lengths and breadths; the derived lengths and the breadth/depth ratios are derived."))

    do('ansur2_male_subgroups', MUST, "Replaced 'That is the direction a muscular build shifts the girths' with the selection-rule caveat.",
       lambda f: rep(f, 'notes', 'That is the direction a muscular build shifts the girths.',
                     'Chest and waist k differ partly because of the selection rule. The independent signal is a higher biceps k (5.52 vs 5.08) in the lean-heavy group, with thigh and calf k about unchanged. Small n, not an athlete sample.'))

    do('ansur2_female_subgroups', NOTE, 'Added the selection-circularity caveat for chest and waist k.',
       lambda f: addnote(f, 'Chest and waist k differ partly because the selection rule uses chest minus waist.'))

    do('ansur2_female_largest_arms', MUST, "Replaced 'not to muscular ones' with the corrected sentence (muscularity unknown).",
       lambda f: rep(f, 'notes', 'The largest female arms belong to high-BMI women, not to muscular ones.',
                     'The largest female flexed arms belong to high-BMI women (BMI 36.5-40.4, navel waist 109-133 cm); their muscularity is unknown (no body-composition data).'))

    # ------------------------------------------------------------------ MUSCLE
    def f_kouri(f):
        f['label'] = 'Kouri 1995: highest normalized FFMI among 74 non-users (self-report plus urine test) = 25.0; this is the sample maximum, not a hard physiological limit.'
        f['values']['value_status'] = {
            'nonuser_normalized_FFMI_upper_limit_kg_m2': 'measured (skinfold-based body fat)',
            'mr_america_mean_normalized_FFMI_kg_m2': 'estimate (reported heights and weights, assumed 5% fat, per McDonald)'}
        addnote(f, "Show 25 as a soft line, not a cap. The same paper's presumed-natural Mr America winners reached 28.0 (Helms), and Jan Todd's 2008 re-analysis gives a mean of 26.4 with 15 winners above 26 (as quoted by McDonald; primary not fetched).")
    do('kouri1995_ffmi_natural_limit', MUST, 'Label rewritten (sample maximum, not a hard limit); per-value statuses added (non-user limit measured, Mr America mean estimate); soft-line note added.', f_kouri)

    do('kouri1995_group_means', NOTE, 'Added: Helms says some users reached about 32; McDonald miscalls the winners Mr USA.',
       lambda f: addnote(f, "Helms also says some users reached about 32. McDonald's page miscalls the winners 'Mr. USA'."))

    do('kouri1995_normalization_constant', NOTE, 'Added: gap is at most 0.05 FFMI units for 1.55-2.05 m; recommend 6.1 with a footnote.',
       lambda f: addnote(f, 'Verifier recompute: the gap is 0.2 x |1.8 - h|, at most 0.05 FFMI units for heights 1.55-2.05 m. Recommended use: 6.1, with a footnote that the abstract prints 6.3.'))

    def f_with(f):
        f['values']['implied_height_m_derived'] = [1.776, 1.783]
        f['values']['implied_FFMI_5d_derived'] = 27.8
        f['values']['implied_FFMI_5d_derived_range'] = [27.7, 27.9]
        rep(f, 'notes', 'Height is not in the abstract; 1.776 m is derived from mass/BMI, and FFMI 27.9 is derived from that (my calculation).',
            'Height is not in the abstract; 1.776-1.783 m is derived from mass/BMI (the two BMIs give slightly different heights), and FFMI about 27.8 (27.7-27.9) is derived from that.')
    do('withers1997_elite_bb_4C', OPT, 'Implied height set to 1.776-1.783 m and derived FFMI to about 27.8 (27.7-27.9).', f_with)

    def f_suk(f):
        rep(f, 'notes', "National-level Asian amateurs; a lower bound for 'competitive bodybuilder' girths.",
            'Thai national team (3 world, 5 Asian, 2 SE Asian champions; amateur weight-class athletes), off-contest, BIA body fat. The girth table for the other sites did not extract from the PDF.')
        f['values']['flexed_minus_relaxed_arm_cm'] = 4.75
        f['values']['flexed_over_relaxed_arm_ratio'] = 1.128
        addnote(f, 'Measured conversion: flexed upper arm exceeds relaxed by 4.75 cm (41.75 vs 37.0 cm, about +13%) in this group.')
    do('sukwong2022_thai_elite_bodybuilders', MUST, 'Description corrected (national team incl. world and Asian champions); flexed-minus-relaxed arm gap +4.75 cm (~13%) recorded as a measured conversion.', f_suk)

    def f_chap(f):
        f['label'] = 'Chappell, Simper & Helms 2019: British natural PRO vs amateur bodybuilders (DFAC/WNBF; all PROs polygraphed, top placers urine-tested)'
        f['values']['male_PRO_end_BMI'] = 26.2
        addnote(f, "The 'end' weight is the end-of-prep self-reported weight, before competition, not exactly stage weight. Urine tests went only to the top 3 at the DFAC British PRO GP and WNBF Worlds and to class winners at BNBF qualifiers.")
    do('chappell2019_natural_pro_bodybuilders', MUST, "Label changed to 'all PROs polygraphed, top placers urine-tested'; note 'end-of-prep self-reported weight'.", f_chap)

    def f_ron(f):
        f['values']['contest_1999_lb'] = 257
        f['values']['contest_1999_kg'] = 116.6
        f['values']['contest_2003_lb'] = [286, 287]
        f['values']['contest_2003_Olympia_kg'] = [129.7, 130.2]
        addnote(f, "FLEX 1999 report (via The Barbell): 'RONNIE COLEMAN: 257 pounds'. FLEX 2004 says he was 'nine pounds bigger than last year', putting 2003 at about 287 lb (Iron Man: 286). 'All-time heaviest contest weight' is a photo caption.")
    do('ronnie_coleman_height_weight', OPT, 'Added 1999 contest weight 257 lb; 2003 recorded as 286-287 lb.', f_ron)

    def f_ramy(f):
        v = f['values']
        v['height_orig'] = "5'9\" (FitnessVolt, GreatestPhysiques), 5'10\" (FLEX 2015 via The Barbell), 5'11\" (FLEX 2014 via The Barbell)"
        del v['weight_heard_2015_lb']
        v['weighin_2015_clothed_lb'] = 316
        v['weighin_2015_clothed_kg'] = 143.3
        v['contest_2015_estimate_status'] = 'estimate (journalist inference, Greg Merritt)'
        addnote(f, "Correction: 316 lb was an actual scale reading, fully dressed, at the athletes' meeting two days before the 2015 contest, not hearsay. The 305-310 lb on-stage figure is Merritt's inference (estimate). FLEX 2015 calls him 'the 5'10\" Elssbiay'.")
    do('big_ramy_height_weight', MUST, "height_orig now lists 5'9\", 5'10\" (FLEX 2015) and 5'11\"; weight_heard_2015_lb replaced by weighin_2015_clothed_lb 316 (143.3 kg); 2015 stage 305-310 lb marked estimate.", f_ramy)

    def f_haf(f):
        v = f['values']
        v['boxing_weighin_18Mar2022_kg'] = v.pop('boxing_weighin_19Mar2022_kg')
        addnote(f, 'The boxing weigh-in was on 18 Mar 2022; the fight was on 19 Mar 2022.')
    do('hafthor_bjornsson_height_weight', OPT, 'Renamed boxing_weighin_19Mar2022_kg to boxing_weighin_18Mar2022_kg (fight 19 Mar 2022).', f_haf)

    def f_hall(f):
        v = f['values']
        v.pop('boxing_weighin_19Mar2022_kg')
        v['boxing_weighin_18Mar2022_kg'] = 142.2
        v['boxing_weighin_lb'] = 313.5
        addnote(f, 'Boxing weigh-in 142.2 kg (313.5 lb) on 18 Mar 2022 (FitnessVolt via search). The talkSPORT page with the 196.5 kg quote was blocked to the verifier, so that self-report is not re-verified.')
    do('eddie_hall_height_weight', OPT, 'Boxing weigh-in set to 142.2 kg (313.5 lb), dated 18 Mar 2022.', f_hall)

    def f_dffmi(f):
        v = f['values']
        IN=0.0254; LB=0.45359237
        def ff(lb, h_in, bf=0.05, kg=None):
            m=(kg if kg is not None else lb*LB); h=h_in*IN; x=m*(1-bf)/h**2
            return round(x,1), round(x+6.1*(1.80-h),1)
        cases={'Ronnie_2004_296lb_5ft11':ff(296,71),'Ronnie_2003_286lb':ff(286,71),'Ronnie_1998_249lb':ff(249,71),
               'Dorian_1993_116.57kg_5ft10':ff(None,70,kg=116.57),'Jay_2009_271lb_5ft9':ff(271,69),'Phil_2011_248lb_5ft9':ff(248,69),
               'Ramy_2015_307.5lb_5ft9':ff(307.5,69),'Ramy_2015_at_5ft10':ff(307.5,70),'Ramy_2015_at_5ft11':ff(307.5,71),
               'Arnold_1971_246lb_6ft1.5':ff(246,73.5),'Arnold_1975_235lb_6ft1.5':ff(235,73.5),'Arnold_book_235lb_6ft2':ff(235,74),
               'Sergio_1967_225lb_5ft10':ff(225,70),'Reeves_1947_213lb_6ft1':ff(213,73),
               'Shaw_2024_at_2.03m':ff(None,2.032/IN,bf=0.176,kg=174.5),'Shaw_2024_at_2.00m':ff(None,2.0/IN,bf=0.176,kg=174.5)}
        v['normalized_6p1'] = {k:c[1] for k,c in cases.items()}
        v['normalized_6p1']['note'] = 'FFMI + 6.1 x (1.80 - h), computed by the data compiler with the same inputs. Kouri 25.0 is a normalized value, so compare against these.'
        v['unnormalized_recomputed'] = {k:c[0] for k,c in cases.items()}
        v['Ronnie_1998_249lb_5ft11'] = 33.0
        v['Ramy_2015_at_5ft10'] = 41.9
        v['Arnold_book_235lb_6ft2'] = 28.7
        v['ranges'] = {'Coleman': [33.0, 39.2], 'Ramy_2015': [40.7, 43.1], 'Arnold': [28.7, 30.4]}
        rep(f, 'notes', 'Bauer 2023 review: male near-contest 5.8-10.7%, which would lower these by ~0.4-2 units',
            'Bauer 2023 review: male near-contest 5.8-10.7%, which would lower these by about 0.3-2.6 units (Ramy 2015 at 10.7% loses 2.6)')
        rep(f, 'notes', 'The open-class pros listed here, from Oliva (1967) on, land at 29-43, far above the Kouri natural ceiling of 25;',
            'The open-class pros listed here, from Oliva (1967) on, land at about 29-43, far above the Kouri non-user maximum of 25.0 (a normalized value; normalized figures are in normalized_6p1). Coleman spans 33.0 (1998, 249 lb) to 39.2 (2004); Ramy 2015 spans 40.7-43.1 (41.9 at the 5\'10" FLEX gives); Arnold spans 28.7-30.4.')
    do('derived_ffmi_pros', MUST, 'Bauer sensitivity corrected to 0.3-2.6 units; normalized values added; Coleman range 33.0-39.2; Ramy 40.7-43.1 (41.9 at 5\'10"); Arnold 28.7-30.4.', f_dffmi)

    def f_arn(f):
        f['values']['height_selfdescribed'] = "6'1.75\""
        f['values']['height_selfdescribed_m'] = 1.873
        addnote(f, "CelebHeights also quotes Arnold calling himself '6ft 1 and 3/4'. The book figures are self-reported and reach us second-hand through a fan site.")
    do('arnold_schwarzenegger_height_weight', NOTE, "Added his self-description 6'1.75\" (1.873 m); book figures marked self-reported, second-hand.", f_arn)

    def f_arng(f):
        f['status'] = 'reported'
        f['values']['value_status'] = {'arm': 'reported (self-reported in his book)', 'chest': 'reported', 'thigh': 'reported', 'calf': 'reported', 'waist': 'disputed (book 34 in, one fan site 30 in)'}
        addnote(f, "Status set to 'reported' (self-reported in his own book) for arm, chest, thigh and calf; only the waist is disputed.")
    do('arnold_schwarzenegger_girths', NOTE, "Fact status changed from 'disputed' to 'reported'; only the waist kept as disputed.", f_arng)

    def f_jay(f):
        f['values']['FV_profile_competition_lb'] = 274
        addnote(f, "FitnessVolt's profile box also shows Competition 274 lb. The 2007 report captions a '267-pound Cutler'.")
    do('jay_cutler_height_weight', NOTE, 'Added FitnessVolt competition 274 lb and the 2007 caption 267 lb.', f_jay)

    do('phil_heath_height_weight', NOTE, "Added: the 2010 report also says 'At 242'; the 2009 report says he was also 227 the year before.",
       lambda f: addnote(f, "The 2010 report also says 'At 242' later on. The 2009 report says he was also 227 the year before."))

    do('phil_heath_girths', NOTE, "Added UI requirement: show 'fan site, unverified, no date or method'.",
       lambda f: addnote(f, "Show these as 'fan site, unverified, no date or method'."))

    do('brian_shaw_height_weight', NOTE, "Added: the bodyweight and fat figures are reported (self-filmed test relayed by FitnessVolt), not lab-published; 6'6.75\" is exactly 2.000 m.",
       lambda f: addnote(f, "FitnessVolt relays his own video, so the 174.5 kg and 17.6% figures are reported (self-filmed test), not lab-published. 6'6.75\" is exactly 2.000 m."))

    do('brian_shaw_girths', NOTE, "Fact status changed from 'disputed' to 'unknown'.",
       lambda f: f.__setitem__('status', 'unknown'))

    do('lasha_talakhadze_height_weight', NOTE, "Added: weigh-ins are Olympedia's compilation of the official results; 492 kg total WR on 17 Dec 2021.",
       lambda f: addnote(f, "Strictly, the weigh-ins come from Olympedia's compilation of the official results. Olympedia confirms the 492 kg total world record (17 Dec 2021, Tashkent)."))

    do('mr_america_1938_1954_program_girths', NOTE, 'Added the verifier caveat: these program heights and weights imply a mean normalized FFMI of 27.4 at 5% fat, against Kouri 25.4 for the same era.',
       lambda f: addnote(f, 'Verifier recompute: these program heights and weights at 5% fat give a mean normalized FFMI of 27.4 (SD 1.7, max 30.7; n=16 incl. 1939 and 1959 magazine rows), against Kouri 25.4 (max 28.0) for the same era. The program weights are probably not the figures Kouri used, or not contest-day weights. Do not pair this table with the Kouri 25 line without that caveat. Magazine rows not transcribed here: 1939 Essmaker, 1959 H. Johnson, 1960 Lerille, 1966 Gajda, 1968 Haislop, 1977 Dave Johns.'))

    do('demoraes2019_competition_day_girths', NOTE, "Added: chest was taken 'expired'; arm is 'upper arm', flexed/relaxed not stated; height SD of 0.01 m is probably a typo.",
       lambda f: addnote(f, "Table 2 labels chest 'Chest \"expired\"' (after breathing out). Arm is 'upper arm', flexed or relaxed not stated. The height SD of +/-0.01 m for 24 men is implausibly small, probably a typo."))

    do('balshaw2024_eddie_hall_mri', NOTE, "Added: upper body was not scanned because of the size of his shoulders and arms; paper says 'twice World Deadlift Champion'.",
       lambda f: addnote(f, "The upper body was not scanned because of the size of his shoulders and arms. The paper says 'twice being World Deadlift Champion' while Hall is often credited with 2014-2016; this does not affect the numbers."))

    do('sergio_oliva_girths', NOTE, "Added: Rick Wayne's figures are a journalist's anecdote, not a recorded measurement.",
       lambda f: addnote(f, "Rick Wayne's figures are a journalist's anecdote, not a recorded measurement."))

    do('steve_reeves_presteroid', NOTE, 'Added the normalized FFMI 26.4 (verifier recompute).',
       lambda f: (f['values'].__setitem__('FFMI_normalized_derived_at_5pct_fat', 26.4), addnote(f, 'Normalized FFMI at 5% fat: 26.4 (verifier recompute 26.37).')))

    do('rossow2013_natural_pro_case', NOTE, 'Added: the Biolayne 1RMs were not re-checked by the verifier.',
       lambda f: addnote(f, 'The 1RMs from Biolayne were not re-checked by the verifier.'))

    # ------------------------------------------------------------------ COMICS
    def f_sup(f):
        v = f['values']
        v['alt_reported_weight_kg'] = 102.1
        v['alt_reported_orig'] = "225 lbs, DC-licensed Mayfair DC Heroes RPG 'Superman: The Man of Steel Sourcebook' (1989)"
        v['alt_reported_status'] = 'reported'
        v['book_metric_dk2019'] = '1.91 m, 107 kg (DK 2019 Ultimate Character Guide)'
        f['sources'].append({'title': 'DK DC Comics Ultimate Character Guide New Edition (2019), archive.org OCR text', 'url': 'https://archive.org/download/dc-comics-ultimate-character-guide-new-edition/DC%20Comics%20Ultimate%20Character%20Guide%2C%20New%20Edition_djvu.txt'})
        f['sources'].append({'title': "Mayfair Games, DC Heroes RPG 'Superman: The Man of Steel Sourcebook' (1989), archive.org community upload", 'url': 'https://archive.org/details/mfg-258-superman-man-of-steel-sourcebook'})
        rep(f, 'notes', 'The 225 lb figure is widely repeated online and appeared in DC Database revisions in 2009-10, but I found no official source for it. Status for 225 lb: reported.',
            "The 225 lb figure has a DC-licensed source: Mayfair's DC Heroes RPG 'Superman: The Man of Steel Sourcebook' (1989): 'Height: 6'3\" Weight: 225 lbs.' Status for 225 lb: reported (licensed RPG). 235 lb stays the official value; four DK books agree (2007, 2008, 2019 guide, 2021). The DK 2007/2008 snippets do not name the character, so that identification is inferred. The DK 2021 line is OCR-corrected ('Gft 3in' read as 6ft 3in).")
    do('superman', MUST, '225 lb alternative re-sourced to the 1989 DC-licensed Mayfair sourcebook (status reported); DK 2019 guide added as a fourth source for 235 lb / 107 kg.', f_sup)

    do('batman', NOTE, "Marked the DK 2021 line as OCR-corrected (raw OCR: 'HEIGHT Gft 2in WEIGHT 210 los').",
       lambda f: addnote(f, "The DK 2021 line is OCR-corrected; the raw OCR reads 'HEIGHT Gft 2in WEIGHT 210 los Eves Blue Hair Black'."))

    def f_cap(f):
        f['status'] = 'disputed'
        v = f['values']
        v['weight_kg_min'] = 99.8; v['weight_kg_max'] = 108.9
        v['orig'] = "6 ft 2 in; 240 lbs (Marvel.com; DK Marvel Encyclopedia 2019) vs 220 lbs (DK Avengers Ultimate Character Guides 2010 and 2013)"
        v['height_m_dk_avengers_print'] = 1.87
        v.pop('alt_reported_weight_kg'); v.pop('alt_reported_orig')
        v['editions'] = [
            {'label': 'Marvel.com; DK Marvel Encyclopedia 2019', 'height_m': 1.88, 'weight_kg': 108.9, 'orig': '6 ft 2 in, 240 lbs', 'status': 'official'},
            {'label': "DK 'The Avengers: Earth's Mightiest Heroes - The Ultimate Character Guide' (2010) and 'The Avengers: The Ultimate Character Guide' (2013)", 'height_m': 1.87, 'weight_kg': 99.8, 'orig': '6 ft 2 in (1.87 m), 220 lbs (99.75 kg)', 'status': 'official (licensed)'}]
        f['sources'].append({'title': "DK The Avengers: Earth's Mightiest Heroes - The Ultimate Character Guide (2010), archive.org search-inside (avengersearthsmi0000cows)", 'url': 'https://archive.org/details/avengersearthsmi0000cows'})
        f['sources'].append({'title': 'DK The Avengers: The Ultimate Character Guide (2013, ISBN 9781409342458), archive.org search-inside (avengersultimate0000alan)', 'url': 'https://archive.org/details/avengersultimate0000alan'})
        rep(f, 'notes', 'Fan-wiki edit summaries, not verified, say the following.',
            "Two DK licensed books print 220 lb: 'REAL NAME Steve Rogers ... HEIGHT 6 ft 2 in (1.87 m) WEIGHT 220 lbs (99.75 kg)'. Both 220 and 240 are official or licensed, so the weight is disputed, range 220-240 lb. The fan wiki's current 220 lb cites 'Marvel Avengers: The Ultimate Character Guide (Updated and Expanded)'. Fan-wiki edit summaries, not verified, say the following.")
        rep(f, 'notes', "A fan-wiki editor also wrote in 2026 that 'Marvel.com profiles are too often incomplete and inaccurate' compared with the handbooks.",
            "A 2026-05-29 fan-wiki edit summary says 'Marvel.com profiles are too often incomplete and inaccurate'; it was about his powers, not his weight.")
    do('captain_america', MUST, 'Status set to disputed; height 6 ft 2 in (1.88 m; DK prints 1.87 m); weight 220 lb (DK Avengers guides 2010/2013) vs 240 lb (Marvel.com, DK 2019), range 220-240 lb; DK Avengers sources added.', f_cap)

    do('thor', NOTE, 'Added caution: the same DK OCR gives 6 ft 6 in / 640 lbs for Ragnarok and Thunderstrike too.',
       lambda f: addnote(f, 'Caution for re-extraction: the same DK 2019 OCR also gives 6 ft 6 in / 640 lbs for Ragnarok (Thor\'s clone) and Thunderstrike (Eric); do not attribute those lines to Thor.'))

    do('hulk_savage', NOTE, 'Added: the 7 ft / 1,040 lb end is official (DK 2019); the 8 ft / 1,400 lb end is fan-wiki reported.',
       lambda f: addnote(f, 'Label the 7 ft / 1,040 lb end official (DK 2019) and the 8 ft / 1,400 lb end reported (fan wiki only).'))

    do('juggernaut', NOTE, "Added: default to 6 ft 10 in / 900 lb because Marvel flags the 9 ft 5 in figure as unverified; the wiki infobox shows 9'5\"/1,900 since 2025-10-31.",
       lambda f: addnote(f, "Default to 6 ft 10 in / 900 lb: Marvel itself flags the 9 ft 5 in / 1,900 lb page as unverified crowd-sourced content. Since 2025-10-31 the fan-wiki infobox shows 9'5\"/1,900 lbs citing marvel.com."))

    do('wolverine', NOTE, "Added: DK's 195 lb most likely matches Marvel.com's 'without adamantium' figure.",
       lambda f: addnote(f, "DK's 195 lb most likely matches Marvel.com's 'without adamantium' figure."))

    def f_king(f):
        rep(f, 'notes', "Taking 'mostly muscle' at face value implies a normalised FFMI near 45-49, far above the Kouri 1995 human values (derived).",
            "Marvel.com's words are 'Most of Fisk's bulk is actually muscle, not fat'. Derived (status derived): normalised FFMI 44-49 if fat is 10% or less, or if the fan-wiki/OHOTMU-reported 9 lb of fat is true; 34-39 at 20-30% fat; above 25.0 at any fat below about 48%. 'Most of the bulk is muscle' only bounds fat below about 50%.")
        f['values']['ffmi_norm_derived'] = {'fat_0pct': 49.4, 'fat_9lb': 48.4, 'fat_10pct': 44.3, 'fat_20pct': 39.3, 'fat_30pct': 34.2, 'exceeds_25_below_fat_pct': 48}
    do('kingpin', MUST, "Quote fixed ('Most of Fisk's bulk is actually muscle, not fat'); derived FFMI restated: 44-49 only at <=10% fat or 9 lb fat; 34-39 at 20-30%; >25 below ~48% fat.", f_king)

    do('bane', MUST, "Notes reworded: FFMI about 33 at 10% fat is above 30, a level the Kouri abstract reports only some users exceeding (no maximum given).",
       lambda f: rep(f, 'notes', 'At 10% body fat his normalised FFMI is about 33, above every non-user in Kouri 1995 and at the top of the steroid-user range (derived).',
                     'Normalised FFMI about 33 at 10% fat (derived); above 30, a level the Kouri 1995 abstract reports only some steroid users exceeding (no maximum given). The DK 2008 snippet does not name the character, so that identification is inferred.'))

    do('doomsday', NOTE, "Added: the DK 2021 OCR literally reads 'HEIGHT /ft GIN', so 7 ft 6 in is an OCR interpretation, supported by DC Database's Prime Earth infobox.",
       lambda f: addnote(f, "The DK 2021 OCR literally reads 'HEIGHT /ft GIN WEIGHT 915 lbs', so 7 ft 6 in is an OCR interpretation; DC Database's Doomsday (Prime Earth) infobox gives 7'6\"/915 lbs citing the DK New Edition."))

    def f_dark(f):
        f['sources'].append({'title': 'DK Batman Character Encyclopedia (2016), archive.org search-inside snippet', 'url': 'https://archive.org/details/batmancharactere0000matt'})
        addnote(f, "DK 2016 Batman Character Encyclopedia also reads 'Ruler of Apokolips Height: 8ft Qin Weight: 1,815 lbs' (OCR).")
    do('darkseid', NOTE, 'Added the DK 2016 Batman Character Encyclopedia as a further source.', f_dark)

    do('dc_com_no_stats', NOTE, "Added: the Doomsday page's Character Facts list only Powers and First Appearance.",
       lambda f: addnote(f, "Minor: the Doomsday page's Character Facts list only Powers and First Appearance."))

    do('human_ref_kouri_ffmi', NOTE, 'Added: men-only sample, so not a valid ceiling for She-Hulk or other female builds; 25.0 is a sample maximum.',
       lambda f: addnote(f, 'The sample is men only, so it is not a valid reference for She-Hulk or other female builds. 25.0 is the non-user sample maximum, not a hard limit (see kouri1995_ffmi_natural_limit).'))

    def f_plaus(f):
        rep(f, 'notes', '- Superman is at the drug-free limit.\n- Captain America at 240 lb exceeds the drug-free limit but is within the steroid-user range.\n- Bane and Wolverine (even without adamantium) are above 30 at 10-15% body fat, the top of the reported human range.',
            "- Superman is at the non-user maximum at about 12.6% fat.\n- Captain America: at 240 lb, normalised FFMI exceeds 25.0 only below about 17% body fat; at 220 lb (DK 2010/2013) it is within the non-user range (24.9 at 10% fat).\n- Bane and Wolverine (even without adamantium) are above 30 at 10-15% body fat, a level the Kouri 1995 abstract reports only some steroid users exceeding (no maximum given).\n- She-Hulk: FFMI has no valid human reference here (Kouri sampled men only).")
        rep(f, 'notes', "and Kingpin's bulk being 'mostly muscle'.", "and 'Most of Fisk's bulk is actually muscle, not fat' (Kingpin; see the kingpin entry for what that does and does not imply).")
        f['values']['she_hulk_ffmi_note'] = 'no valid human reference (Kouri 1995 is men only)'
    do('plausibility_metrics', MUST, 'Captain America verdict made fat-dependent (exceeds 25 only below ~17% fat at 240 lb; within range at 220 lb); She-Hulk FFMI marked as having no valid human reference; Kingpin and Bane wording fixed; Superman at the limit only at ~12.6% fat.', f_plaus)

    do('colossus_density_check', NOTE, "Added: using osmium's density instead of steel would make the gap about 3x larger (not fetched).",
       lambda f: addnote(f, "Using osmium's density instead of steel would make the gap about 3 times larger; that density was not fetched either."))

    # ------------------------------------------------------------------ MODEL
    do('brozek_equation', OPT, "Added: a 0.9007/1.100 mix gives 497.1/D - 451.9; Brozek's equation comes from a reference body (endpoints imply 0.889 and 1.103 g/cm3).",
       lambda f: addnote(f, "A two-compartment mix of 0.9007 fat and 1.100 FFM would give %fat = 497.1/D - 451.9. Brozek's 457/D - 414.2 comes from the 1963 reference-body approach; its endpoints imply 1.103 g/cm3 at 0% fat and 0.889 g/cm3 at 100% fat."))

    def f_wbd(f):
        v = f['values']
        v.update({'n': 247, 'min_kg_m3': 995.0, 'max_kg_m3': 1098.3, 'mean_kg_m3': 1055.2, 'p2_5_kg_m3': 1021.0, 'p97_5_kg_m3': 1089.6,
                  'orig': 'about 0.995-1.098 g/cm^3 (n=247 after excluding documented problem cases 42, 48, 76, 96, 182)',
                  'excluded_cases': [42, 48, 76, 96, 182], 'max_case': 172})
        f['label'] = 'Measured whole-body density in 247 men (underwater weighing, documented problem cases excluded)'
        rep(f, 'notes', "Computed by me from the data file (out/scaling_results.json), excluding case 42, whose height is documented as wrong.",
            'Corrected by the verifier: exclude the documented problem cases 42 (wrong height), 48, 76 and 96 (one-digit density errors) and 182 (density implies negative fat). The earlier maximum of 1.1089 was case 182 and is not a credible measurement. The maximum is now case 172 (Siri 0.7%).')
    do('whole_body_density_sample', MUST, 'Excluded cases 42, 48, 76, 96, 182 (n=247); range 0.995-1.0983 g/cm3, mean 1.0552, P2.5 1.0210, P97.5 1.0896.', f_wbd)

    def f_dens(f):
        addnote(f, "The table uses 0.900 (Siri); Kuriyan gives 0.9007, a difference of 0.05% or less. These are tissue densities, not whole-body-in-air densities (no lung-volume source). Using this table to add about 3% for a lean build assumes ANSUR men average about 20% fat; ANSUR has no fat measurement, so that correction is an estimate (k_eff 1053 matching the Siri 20% density 1053.2 is a coincidence, not a calibration).")
    do('density_from_fat_table', NOTE, 'Added: 0.900 vs 0.9007; tissue density only; the summary\'s +3% lean-build correction is an estimate (ANSUR fat % unknown), from check summary_density_reference_20pct.', f_dens)

    def f_ffmih(f):
        v = f['values']
        v['implied_FFM_height_exponent_kouri'] = 2.45
        v['implied_FFM_height_exponent_kouri_c6p1'] = 2.44
        v['implied_FFM_height_exponent_trexler_label'] = 'not significantly different from 2'
        addnote(f, "Kouri: p = 2.45 with the abstract's 6.3, or 2.44 with 6.1. Trexler's p of about 2.2 comes from a slope not significantly different from zero (r=0.13, p=0.16), so it is not evidence that p > 2 for athletes. The design note's 'p of about 2.2 to 2.45 for muscular athletes' is a weak estimate.")
    do('ffmi_height_correction', OPT, 'Kouri implied exponent 2.45 (c=6.3) or 2.44 (c=6.1); Trexler-based p 2.2 labelled not significantly different from 2.', f_ffmih)

    do('heymsfield_2011_circumferences', OPT, "Replaced 'univariate height powers' with 'height powers adjusted for age and race (not for weight or BMI)'.",
       lambda f: rep(f, 'notes', 'These are univariate height powers, not at fixed BMI.', 'These are height powers adjusted for age and race (not for weight or BMI).'))

    def f_frus(f):
        v = f['values']
        v['calc_inputs_only'] = {'mass_err_sd_men_pct': 2.31, 'p95_abs_men_pct': 4.6, 'mass_err_sd_women_pct': 2.78, 'p95_abs_women_pct': 5.5, 'k_eff_men_kg_m3': 1052.5, 'k_eff_women_kg_m3': 1052.8}
        addnote(f, 'The 2.07%/2.44% errors use about 25 ANSUR measurements (buttock, lower-thigh, ankle, wrist and neck-base circumferences, head and hand/foot dimensions, measured landmark heights). With only stature and the 7 calculator girths (lengths from ANSUR mean proportions, other girths imputed), the error is 2.31% men (P95 4.6%) and 2.78% women (P95 5.5%), k about 1052.5 / 1052.8 kg/m3. The imputations are ANSUR-shaped and will be wrong for bodybuilder or comic proportions.')
    do('ansur_frustum_volume_model', MUST, 'Added calculator-inputs-only figures: SD 2.31% men (P95 4.6%), 2.78% women (P95 5.5%), k 1052.5 / 1052.8; 2.1/2.4% reported only as the full-input figure.', f_frus)

    def f_trunk(f):
        rep(f, 'notes', 'A circle-from-girth model overstates the area of a flattened (wide-lat) torso by up to 16-25% at depth/breadth 0.5-0.4.',
            "The true area is 16-25% smaller than the circle's at depth/breadth 0.5-0.4; the circle overstates by 19-34%. Relative to the ANSUR-calibrated baseline (waist factor about 0.95 already absorbed in k_eff), the weight shift is about 0.51 x (1 - 0.841/0.95), about 6%, at 0.5, and about 11% at 0.4. Because real chests are 24% longer in perimeter than their breadth/depth ellipse, these factors are idealizations.")
    do('trunk_cross_section_shape', MUST, 'Wording fixed (true area 16-25% smaller; circle overstates by 19-34%); weight shift vs ANSUR baseline about 6% at 0.5 and 11% at 0.4.', f_trunk)

    def f_yea(f):
        rep(f, 'notes', 'Gittoes 2009 tested 5 athletic performers with Dempster segment densities.',
            "Gittoes 2009 tested 5 athletic performers (the Dempster densities are stated by Williams 2013, not in the Gittoes abstract). The 2.1% is the 'Yeadon model with direct measurements, n = 5 (Gittoes 2009)', not Yeadon's own validation.")
    do('yeadon_model_accuracy', MUST, "Dropped 'Dempster' from Gittoes (attributed to Williams 2013); 2.1% relabelled 'Yeadon model with direct measurements, n = 5 (Gittoes 2009)'.", f_yea)

    do('ansur_extrapolation_tests', NOTE, "Added the corrected robustness wording from check summary_loglinear_robustness_claims.",
       lambda f: addnote(f, "Correct reading (verifier): top 2.5% by BMI: log-linear bias -1.1%; top 2.5% flexed arm: +0.1%. A separate 5-girth ANSUR equation applied to the Penrose men gave a bias of +0.1% and an SD of 2.8%; that test does not test the 7-girth equation."))

    do('ansur_geometric_law_test', NOTE, "Added: 'accurate to about 1%' holds for height changes of about 10% or less; 1.8 to 2.2 m gives about 2.7% (waist) and 3.5% (neck).",
       lambda f: addnote(f, "'Accurate to about 1%' holds for height changes of about 10% or less. For 1.8 to 2.2 m the error is about 2.7% for the waist and 3.5% for the neck."))

    do('ansur_mass_height_exponent', NOTE, "Added: neither OLS nor RMA should be used as p for 'the same build at another height'.",
       lambda f: addnote(f, "Neither number should be used as p for 'the same build at another height'; RMA is not a 'true' structural exponent either."))

    do('ffmi_athletes', NOTE, 'Added: Trexler max 31.7 is height-adjusted; sample BF 19.8%, height 184.7 cm; Currier reference height not stated in the abstract.',
       lambda f: addnote(f, "Trexler's full text gives an FFMIAdj range of 19.0-31.7, so the max is height-adjusted; sample body fat 19.8 +/- 7.4%, height 184.7 cm. The Currier abstract does not state the 1.80 m reference height."))

    do('ffmi_definition_kouri_limit', NOTE, 'Added: limit applies to normalized FFMI; non-use self-reported; some secondary pages reverse the 83/74 split.',
       lambda f: addnote(f, 'The limit applies to height-normalized FFMI. Non-use is self-reported (plus urine test). Some secondary pages reverse the 83/74 split; use the abstract.'))

    do('ponderal_somatogram', NOTE, 'Added: the <1.5 kg agreement is for data-set means, not individuals.',
       lambda f: addnote(f, 'The < 1.5 kg agreement is between data-set means, not the error for individuals.'))

    do('action_toy_allometry_precedent', NOTE, "Added: 'classical allometry' to 1.78 m is in effect a p = 3 copy (girths proportional to height).",
       lambda f: addnote(f, "In effect this is a p = 3 copy, with girths proportional to height."))

    do('muscle_tissue_density', NOTE, 'Added: fixed-muscle values are mean +/- SE (n=54).',
       lambda f: addnote(f, 'The fixed human values are mean +/- SE (1.112 +/- 0.006 and 1.055 +/- 0.006, n=54).'))

    # consistency: the same 'mostly fat' claim in model-topic facts (judgement call; follows the anthro correction)
    do('ansur_girth_allometry', 'consistency edit by the data compiler (same unsupported claim the anthro verifier corrected)',
       "Replaced 'because between-person weight differences are mostly fat' with estimate wording.",
       lambda f: rep(f, 'notes', 'because between-person weight differences are mostly fat.',
                     'probably because a large share of between-person weight difference is fat (estimate; ANSUR II has no body-composition data; see ansur2_girth_scaling_male).'))
    do('absi_waist_allometry', 'consistency edit by the data compiler (same unsupported claim the anthro verifier corrected)',
       "Replaced 'because between-person weight differences are largely fat' with estimate wording.",
       lambda f: rep(f, 'notes', 'because between-person weight differences are largely fat.',
                     'probably because a large share of between-person weight difference is fat (estimate; not measured in this paper).'))
    def f_dk(f):
        f['values']['Kouri_nonuser_max_normalized'] = f['values'].pop('Kouri_natural_ceiling')
    do('derived_ffmi_pros', 'consistency edit by the data compiler (follows the kouri1995_ffmi_natural_limit correction)',
       "Renamed value key 'Kouri_natural_ceiling' to 'Kouri_nonuser_max_normalized' (25.0 is a sample maximum, not a ceiling).", f_dk)
    do('human_ref_kouri_ffmi', 'consistency edit by the data compiler (follows the kouri1995_ffmi_natural_limit correction)',
       "Label changed from 'ceiling' to 'non-user maximum'.",
       lambda f: f.__setitem__('label', 'Human reference: highest normalized fat-free mass index among non-users (Kouri et al. 1995); a sample maximum, not a ceiling'))
    do('ffmi_definition_kouri_limit', 'consistency edit by the data compiler (follows the kouri1995_ffmi_natural_limit correction)',
       "Label changed from \"the 'natural limit' of 25\" to 'the non-user maximum of 25'.",
       lambda f: f.__setitem__('label', "FFMI definition and the non-user maximum of 25 (Kouri et al. 1995); a sample maximum, not a hard limit"))
    return LOG

SUMMARY_CORRECTIONS = [
    dict(topic='anthro', key='(summary/gaps)', check_ok=False, kind='verifier verdict item', change="Gap #8 (calf reduction unknown) deleted: TR-15/007 keeps the highest of three readings."),
    dict(topic='anthro', key='(summary/gaps)', check_ok=False, kind='verifier verdict item', change="Gap #10 corrected: p5/p50/p95 match the TR tables within 0.03, but 1st/99th percentiles differ by up to 0.85 (e.g. F weight p99 97.45 vs TR 98.30 kg). Cite TR tables directly for 1st/99th."),
    dict(topic='anthro', key='(summary)', check_ok=False, kind='verifier correction', change="Summary claim that girth exponents reflect 'mostly fat' differences re-worded to the Forbes/Hall estimate (see ansur2_girth_scaling_male)."),
    dict(topic='model', key='summary_brozek_derivation', check_ok=False, kind='verifier correction (extra check, no fact)', change="Summary finding (1) corrected: Siri's 495/D - 450 follows from 0.900/1.100; Brozek's 457/D - 414.2 is from a reference body (endpoints 0.889 and 1.103 g/cm3). Applied as a note on brozek_equation."),
    dict(topic='model', key='summary_loglinear_robustness_claims', check_ok=False, kind='verifier correction (extra check, no fact)', change="Design note C corrected: top 2.5% by BMI bias -1.1%; top 2.5% flexed arm +0.1%; the Penrose test used a separate 5-girth equation (bias +0.1%, SD 2.8%). Applied as a note on ansur_extrapolation_tests."),
    dict(topic='model', key='summary_density_reference_20pct', check_ok=False, kind='verifier correction (extra check, no fact)', change="The +3% lean-build density correction is labelled an estimate; ANSUR's fat % is unknown. Applied as a note on density_from_fat_table."),
    dict(topic='model', key='(summary)', check_ok=None, kind='verifier verdict item', change="Whole-body density range in the summary ('0.995 to 1.109 g/cm3', '252 men') superseded by whole_body_density_sample (0.995-1.098, n=247)."),
    dict(topic='model', key='(summary)', check_ok=None, kind='verifier verdict item', change="Trunk-shape wording and frustum-error labelling in the summary superseded by the corrected facts trunk_cross_section_shape and ansur_frustum_volume_model."),
    dict(topic='muscle', key='(summary)', check_ok=None, kind='verifier verdict item', change="Kouri 25.0 described as a sample maximum and soft line, not a natural ceiling; Mr America mean 25.4 is an estimate."),
    dict(topic='muscle', key='(summary)', check_ok=None, kind='verifier verdict item', change="Derived stage FFMIs in the summary superseded by derived_ffmi_pros (normalized values and ranges added)."),
    dict(topic='comics', key='(summary)', check_ok=None, kind='verifier verdict item', change="Captain America 220 lb is licensed DK data (disputed 220-240), Superman 225 lb has a licensed 1989 source; Kingpin and Bane FFMI verdicts reworded."),
]
