import json,sys
IN=0.0254; LB=0.45359237
def i2m(x): return round(x*IN,3)
def l2k(x): return round(x*LB,1)
def E(pmid): return f"https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:{pmid}%20AND%20SRC:MED&resultType=core&format=json"
S={
 'kouri':("Kouri EM, Pope HG, Katz DL, Oliva P. Fat-free mass index in users and nonusers of anabolic-androgenic steroids. Clin J Sport Med 1995;5:223-228 (Europe PMC abstract record, PMID 7496846)",E(7496846)),
 'lyle':("McDonald L. Another Look at the Fat-Free Mass Index (FFMI), BodyRecomposition.com (secondary summary of Kouri 1995 full text)","https://bodyrecomposition.com/muscle-gain/another-look-at-the-ffmi"),
 'helms':("Helms E. 'Weighing the evidence: Kouri et al., 1995', Alan Aragon's Research Review, Aug 2014 (PDF)","https://www.alanaragon.com/wp-content/uploads/2016/08/Helms-Aug-2014-AARR.pdf"),
 'graybeal':("Graybeal AJ, Moore ML, Cruz MR, Tinsley GM. Body composition assessment in male and female bodybuilders: a 4-compartment model comparison... J Strength Cond Res 2020;34(6):1676-1689 (PMID 30161092)",E(30161092)),
 'withers':("Withers RT et al. Body composition changes in elite male bodybuilders during preparation for competition. Aust J Sci Med Sport 1997;29(1):11-16 (PMID 9127683)",E(9127683)),
 'mcinnis':("McInnis KJ, Balady GJ. Effect of body composition on oxygen uptake during treadmill exercise: body builders versus weight-matched men. Res Q Exerc Sport 1999;70(2):150-156 (PMID 10380246)",E(10380246)),
 'katch':("Katch VL, Katch FI, Moffatt R, Gittleson M. Muscular development and lean body weight in body builders and weight lifters. Med Sci Sports Exerc 1980;12(5):340-344 (PMID 7453511)",E(7453511)),
 'fry':("Fry AC et al. Anthropometric characteristics as discriminators of body-building success. J Sports Sci 1991;9(1):23-32 (PMID 1856909)",E(1856909)),
 'demoraes':("de Moraes WMAM et al. Carbohydrate Loading Practice in Bodybuilders... J Sports Sci Med 2019;18(4):772-779, Table 2","https://jssm.org/tablejssm-18-772.xml/table002.xml"),
 'demoraes_ft':("de Moraes et al. 2019 full text (JSSM) - methods/participants","https://www.jssm.org/jssm-18-772.xml%3EFulltext"),
 'demoraes_ab':("de Moraes et al. 2019 abstract (PMID 31827362)",E(31827362)),
 'bamman':("Bamman MM et al. Changes in body composition, diet, and strength of bodybuilders during the 12 weeks prior to competition. J Sports Med Phys Fitness 1993;33(4):383-391 (PMID 8035587)",E(8035587)),
 'sukwong':("Sukwong T et al. The Difference of Anthropometric Characteristics Between Elite and Novice Bodybuilders in Thailand. Physical Education Theory and Methodology 2022;22(1) doi:10.17309/tmfv.2022.1.14 (PDF)","https://tmfv.com.ua/journal/article/download/1621/1462"),
 'mitchell':("Mitchell L, Slater G, Hackett D, Johnson N, O'Connor H. Physiological implications of preparing for a natural male bodybuilding competition. Eur J Sport Sci 2018;18(5):619-629 (PMID 29490578)",E(29490578)),
 'chappell19':("Chappell AJ, Simper T, Helms E. Nutritional strategies of British professional and amateur natural bodybuilders during competition preparation. JISSN 2019;16:35, Table 1 (Europe PMC full text PMC6704518)","https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6704518/fullTextXML"),
 'rossow':("Rossow LM, Fukuda DH, Fahs CA, Loenneke JP, Stout JR. Natural bodybuilding competition preparation and recovery: a 12-month case study. Int J Sports Physiol Perform 2013;8(5):582-592 (PMID 23412685)",E(23412685)),
 'biolayne':("Biolayne: 'Lessons learned from recent case studies in drug-tested physique athletes' (secondary)","https://biolayne.com/articles/research/lessons-learned-recent-case-studies-drug-tested-physique-athletes/"),
 'bauer':("Bauer P et al. Body Composition of Competitive Bodybuilders: A Systematic Review. J Strength Cond Res 2023;37(3):726-732 (PMID 36727905)",E(36727905)),
 'kraemer':("Kraemer WJ et al. Body Composition in Elite Strongman Competitors. J Strength Cond Res 2020;34(12):3326-3330 (PMID 33235016)",E(33235016)),
 'balshaw':("Balshaw TG, Massey GJ, Miller R, McDermott EJ, Maden-Wilkinson TM, Folland JP. Muscle and tendon morphology of a world strongman and deadlift champion. J Appl Physiol 2024;137(4):789-799 (full text PMC11486472)","https://www.ebi.ac.uk/europepmc/webservices/rest/PMC11486472/fullTextXML"),
 'mra':("MuscleMemory.org transcription: 'Measurements of Mr America winners taken when they won their titles, as listed in the program from the 1956 Mr USA contest' + later winners from magazines","https://s3.musclememory.net/articles/MrAsizes.html"),
 'gp_reeves':("GreatestPhysiques.com - Steve Reeves profile (fan site; published 2016-07-04, modified 2019-03-07)","https://www.greatestphysiques.com/male-physiques/steve-reeves/"),
 'im2003':("Iron Man Magazine, Lonnie Teper, 'Coleman Destroys Mr. O Field', reported Oct 27 2003","https://www.ironmanmagazine.com/?p=16762"),
 'im2004':("Iron Man Magazine, '2004 IFBB Mr. Olympia' (Feb 2005 issue)","https://www.ironmanmagazine.com/?p=17030"),
 'bb1998':("The Barbell (Greg Merritt / FLEX archive), 'The 1998 Mr. Olympia'","https://thebarbell.com/1998-mr-olympia/"),
 'bb2004':("The Barbell, 'The 2004 Mr. Olympia' (quotes Peter McGough's FLEX analysis)","https://thebarbell.com/2004-mr-olympia/"),
 'bb2005':("The Barbell, Greg Merritt, 'The 2005 Mr. Olympia' (orig. FLEX Jan 2006), Sep 15 2025","https://thebarbell.com/2005-mr-olympia/"),
 'fv_ronnie330':("FitnessVolt, Derek Hall, 'Ronnie Coleman Flashes Back To Time As A 330lb Mass Monster', Nov 7 2021 (quotes Coleman's own YouTube post)","https://fitnessvolt.com/ronnie-coleman-330lb-mass-monster/"),
 'fv_ronnie_prof':("FitnessVolt - Ronnie Coleman profile (stats box)","https://fitnessvolt.com/ronnie-coleman-profile/"),
 'fv_ronnie_db':("FitnessVolt Bodybuilding Database - Ronnie Coleman (height/weight, FFMI at assumed 6% BF; data updated Sep 30 2026)","https://fitnessvolt.com/bodybuilding/athletes/ronnie-coleman/"),
 'gp_ronnie':("GreatestPhysiques.com - Ronnie Coleman (fan site; 2017)","https://www.greatestphysiques.com/male-physiques/ronnie-coleman/"),
 'wiki_ronnie':("Wikipedia 'Ronnie Coleman' raw wikitext (wiki; cites bodybuildingpro.com and Bodybuilding.com 2015)","https://en.wikipedia.org/w/index.php?title=Ronnie_Coleman&action=raw"),
 'celeb_arnold':("CelebHeights.com - Arnold Schwarzenegger (quotes 'Education of a Bodybuilder' top-form measurements; 1969 and 1980 height reports; fan height estimate)","https://www.celebheights.com/s/Arnold-Schwarzenegger-177.html"),
 'fv_arnold':("FitnessVolt - Arnold Schwarzenegger profile (published 2021-06-26, modified 2026-08-15)","https://fitnessvolt.com/2220/arnold-schwarzenegger/"),
 'gp_arnold':("GreatestPhysiques.com - Arnold Schwarzenegger (fan site)","https://www.greatestphysiques.com/male-physiques/arnold-schwarzenegger/"),
 'bb1971':("The Barbell, Greg Merritt, 'The 1971 Mr. Olympia', Mar 15 2023","https://thebarbell.com/1971-mr-olympia/"),
 'bb1975':("The Barbell, Greg Merritt, 'The 1975 Mr. Olympia', Apr 9 2025","https://thebarbell.com/1975-mr-olympia/"),
 'wiki_arnold':("Wikipedia 'Arnold Schwarzenegger' raw wikitext (cites Bodybuilding.com profile, Oct 11 2015)","https://en.wikipedia.org/w/index.php?title=Arnold_Schwarzenegger&action=raw"),
 'gwr_dorian':("Guinness World Records - 'Heaviest Mr Olympia champion' (Dorian Yates, 1993)","https://guinnessworldrecords.com/world-records/71857-heaviest-mr-olympia-champion"),
 'bb1994':("The Barbell, Greg Merritt, 'The 1994 Mr. Olympia', Sep 5 2023","https://thebarbell.com/1994-mr-olympia/"),
 'fv_dorian':("FitnessVolt - Dorian Yates profile","https://fitnessvolt.com/dorian-yates/"),
 'gp_dorian':("GreatestPhysiques.com - Dorian Yates (fan site; 2016)","https://www.greatestphysiques.com/male-physiques/dorian-yates/"),
 'bb1999':("The Barbell, 'The 1999 Mr. Olympia' (orig. FLEX Jan 2000)","https://thebarbell.com/1999-mr-olympia/"),
 'bb2007':("The Barbell, Greg Merritt, 'The 2007 Mr. Olympia', Oct 20 2023","https://thebarbell.com/2007-mr-olympia/"),
 'bb2009':("The Barbell, Greg Merritt, 'The 2009 Mr. Olympia' (orig. FLEX Jan 2010), Apr 24 2024","https://thebarbell.com/2009-mr-olympia/"),
 'bb2010':("The Barbell, Greg Merritt, 'The 2010 Mr. Olympia' (orig. FLEX Dec 2010)","https://thebarbell.com/2010-mr-olympia/"),
 'bb2011':("The Barbell, Greg Merritt, 'The 2011 Mr. Olympia' (orig. FLEX Nov 2011), Aug 23 2024","https://thebarbell.com/2011-mr-olympia/"),
 'fv_jay':("FitnessVolt - Jay Cutler profile","https://fitnessvolt.com/jay-cutler/"),
 'gp_jay':("GreatestPhysiques.com - Jay Cutler (fan site; 2016)","https://www.greatestphysiques.com/male-physiques/jay-cutler/"),
 'wiki_jay':("Wikipedia 'Jay Cutler (bodybuilder)' raw wikitext (cites Bodybuilding.com 2015, M&F Dec 2018)","https://en.wikipedia.org/w/index.php?title=Jay_Cutler_(bodybuilder)&action=raw"),
 'fv_phil':("FitnessVolt - Phil Heath complete profile","https://fitnessvolt.com/phil-heath-complete-profile/"),
 'gp_phil':("GreatestPhysiques.com - Phil Heath (fan site; 2016)","https://www.greatestphysiques.com/male-physiques/phil-heath/"),
 'bb_phil':("The Barbell, 'Phil Heath' news item, Apr 30 2023 (quotes Heath's video)","https://thebarbell.com/phil-heath/"),
 'bb2014':("The Barbell, Greg Merritt, 'The 2014 Mr. Olympia' (orig. FLEX Dec/Jan 2015), Jan 24 2024","https://thebarbell.com/2014-mr-olympia/"),
 'bb2015':("The Barbell, Greg Merritt, 'The 2015 Mr. Olympia' (orig. FLEX), May 7 2025","https://thebarbell.com/2015-mr-olympia/"),
 'fv_ramy341':("FitnessVolt, Doug Murray, 'Big Ramy Revealed His Off Season Weight is 341lbs (155kg)', Jan 14 2022 (quotes Ramy on Instagram)","https://fitnessvolt.com/big-ramy-revealed-off-season-weight-341lbs/"),
 'bm_ramy337':("Breaking Muscle, Robert Zeglinski, 'Mamdouh \"Big Ramy\" Elssbiay Weighs 337 Pounds...', Sep 23 2022","https://breakingmuscle.com/mamdouh-big-ramy-elssbiay-weighs-337-pounds/"),
 'fv_ramy':("FitnessVolt - Big Ramy profile","https://fitnessvolt.com/mamdouh-big-ramy-elssbiay-profile/"),
 'gp_ramy':("GreatestPhysiques.com - Mamdouh Elssbiay (fan site; 2017)","https://www.greatestphysiques.com/male-physiques/mamdouh-elssbiay/"),
 'fv_dorian_db':("FitnessVolt Bodybuilding Database - Dorian Yates","https://fitnessvolt.com/bodybuilding/athletes/dorian-yates/"),
 'fv_jay_db':("FitnessVolt Bodybuilding Database - Jay Cutler","https://fitnessvolt.com/bodybuilding/athletes/jay-cutler/"),
 'fv_phil_db':("FitnessVolt Bodybuilding Database - Phil Heath","https://fitnessvolt.com/bodybuilding/athletes/phil-heath/"),
 'fv_sergio_db':("FitnessVolt Bodybuilding Database - Sergio Oliva","https://fitnessvolt.com/bodybuilding/athletes/sergio-oliva/"),
 'fv_arnold_db':("FitnessVolt Bodybuilding Database - Arnold Schwarzenegger","https://fitnessvolt.com/bodybuilding/athletes/arnold-schwarzenegger/"),
 'fv_ramy_db':("FitnessVolt Bodybuilding Database - Mamdouh Elssbiay","https://fitnessvolt.com/bodybuilding/athletes/mamdouh-elssbiay/"),
 'bb_sergio':("The Barbell, Greg Merritt, 'Sergio Oliva: The Full, Amazing Story of The Myth', Feb 27 2024 (quotes Rick Wayne)","https://thebarbell.com/sergio-oliva/"),
 'fv_sergio':("FitnessVolt - Sergio Oliva profile","https://fitnessvolt.com/sergio-oliva/"),
 'gp_sergio':("GreatestPhysiques.com - Sergio Oliva (fan site; 2016, mod. 2018)","https://www.greatestphysiques.com/male-physiques/sergio-oliva/"),
 'wiki_sergio':("Wikipedia 'Sergio Oliva' raw wikitext (cites M&F Olympia gallery)","https://en.wikipedia.org/w/index.php?title=Sergio_Oliva&action=raw"),
 'fv_shaw':("FitnessVolt - Brian Shaw profile","https://fitnessvolt.com/brian-shaw/"),
 'fv_shaw_hydro':("FitnessVolt, Vedad Tabakovic, 'Brian Shaw's Body Fat Percentage Comes Out To 17.6% During Hydrostatic Testing', Feb 8 2024","https://fitnessvolt.com/brian-shaws-body-fat-percentage-hydrostatic-testing/"),
 'fv_shaw_2019':("FitnessVolt, 'Brian Shaw weight loss journey', Aug 29 2019","https://fitnessvolt.com/brian-shaw-weight-loss-journey/"),
 'wiki_shaw':("Wikipedia 'Brian Shaw (strongman)' raw wikitext (cites WSM profile archived 2018 for 6'8\" and SHAWSTRENGTH YouTube 'BODY FAT TEST' for 6'6.75\")","https://en.wikipedia.org/w/index.php?title=Brian_Shaw_(strongman)&action=raw"),
 'wiki_thor':("Wikipedia 'Hafthor Julius Bjornsson' raw wikitext (cites WSM profile archived 2018; his YouTube for 210 kg)","https://en.wikipedia.org/w/index.php?title=Haf%C3%BE%C3%B3r_J%C3%BAl%C3%ADus_Bj%C3%B6rnsson&action=raw"),
 'fv_thor':("FitnessVolt - Hafthor Bjornsson profile","https://fitnessvolt.com/hafthor-bjornsson/"),
 'fv_thor200':("FitnessVolt, 'Hafthor Bjornsson Shares 200-kg (440.9-lb) Physique Update...', Jul 20 2025 (quotes his Instagram)","https://fitnessvolt.com/hafthor-bjornsson-200-kg-physique-update-upcoming-deadlift-world-record-attempt/"),
 'wiki_fight':("Wikipedia 'Eddie Hall vs. Hafthor Bjornsson' raw wikitext (tale of the tape)","https://en.wikipedia.org/w/index.php?title=Eddie_Hall_vs._Haf%C3%BE%C3%B3r_Bj%C3%B6rnsson&action=raw"),
 'gwr_dl':("Guinness World Records - Heaviest deadlift (male): 510 kg, 6 Sep 2025","https://www.guinnessworldrecords.com/world-records/heaviest-deadlift.html"),
 'talksport_hall':("talkSPORT, Josh Fordham, 'Eddie Hall posts incredible 31 stone throwback...', 21 Jan 2022 (quotes Hall's Instagram)","https://talksport.com/boxing/1025642/eddie-hall-throwback-transformation-weight-hafthor-bjornsson/"),
 'fv_hall':("FitnessVolt - Eddie Hall profile","https://fitnessvolt.com/eddie-hall-profile/"),
 'wiki_hall':("Wikipedia 'Eddie Hall' raw wikitext","https://en.wikipedia.org/w/index.php?title=Eddie_Hall&action=raw"),
 'tokyo_lasha':("Tokyo 2020 official results site - athlete profile TALAKHADZE Lasha","https://stacy.olympics.com/tokyo-2020/olympic-games/en/results/weightlifting/athlete-profile-n1290690-talakhadze-lasha.htm"),
 'oly_lasha':("Olympedia - Lasha Talakhadze (athlete page)","https://www.olympedia.org/athletes/134095"),
 'oly_2016':("Olympedia - 2016 Weightlifting Super-Heavyweight, Men results (bodyweight column)","https://www.olympedia.org/results/354353"),
 'oly_2020':("Olympedia - 2020 Weightlifting Super-Heavyweight, Men results (bodyweight column)","https://www.olympedia.org/results/19002074"),
 'oly_2024':("Olympedia - 2024 Weightlifting Super-Heavyweight, Men results (bodyweight column)","https://www.olympedia.org/results/2013236"),
 'wiki_lasha':("Wikipedia 'Lasha Talakhadze' raw wikitext","https://en.wikipedia.org/w/index.php?title=Lasha_Talakhadze&action=raw"),
 'fv_cooper':("FitnessVolt, 'Malcolm Cooper Wins 2023 WNBF Pro Universe', Sep 28 2023","https://fitnessvolt.com/malcom-cooper-wins-2023-wnbf-pro-universe/"),
 'bm_cooper':("Breaking Muscle, Chris Colucci, 'Malcolm Cooper Wins 2023 WNBF Pro Universe', Oct 10 2023","https://breakingmuscle.com/2023-wnbf-pro-universe-results/"),
}
def src(*ks): return [{"title":S[k][0],"url":S[k][1]} for k in ks]
F=[]
def add(key,label,status,values,sources,notes):
    F.append({"key":key,"label":label,"status":status,"values":json.dumps(values,ensure_ascii=False),"sources":src(*sources),"notes":notes})

# ---------------- Peer-reviewed / group data ----------------
add("kouri1995_ffmi_natural_limit","Kouri et al. 1995: FFMI of steroid users vs non-users; natural ceiling ~25","measured",
 {"n_total":157,"n_steroid_users":83,"n_nonusers":74,"nonuser_normalized_FFMI_upper_limit_kg_m2":25.0,"mr_america_presteroid_n":20,"mr_america_years":"1939-1959","mr_america_mean_normalized_FFMI_kg_m2":25.4,"users_some_exceeded_kg_m2":30,"FFMI_definition":"FFM_kg / height_m^2","normalization_in_abstract":"FFMI + 6.3*(1.80 - height_m)"},
 ["kouri","lyle","helms"],
 "Abstract (verbatim): 'We calculated fat-free mass index (FFMI) in a sample of 157 male athletes, comprising 83 users of anabolic-androgenic steroids and 74 nonusers... We then added a slight correction of 6.3 x (1.80 m - height) to normalize these values to the height of a 1.8-m man. The normalized FFMI values of athletes who had not used steroids extended up to a well-defined limit of 25.0. Similarly, a sample of 20 Mr. America winners from the presteroid era (1939-1959)... had a mean FFMI of 25.4. By contrast, the FFMI of many of the steroid users in our sample easily exceeded 25.0, and that of some even exceeded 30.' The authors called the findings 'preliminary'. Body fat was by skinfolds; steroid status by interview plus urine test. Paper notes the formula 'may not be satisfactory for fat individuals' (only 6 nonusers had >20% fat; quoted by McDonald). Many users were BELOW 25; the finding is that no nonuser exceeded it, not that every user does.")
add("kouri1995_group_means","Kouri 1995 group means (from secondary summaries of the full paper's tables)","reported",
 {"users_mean_FFMI_approx":25,"nonusers_mean_FFMI_approx":22,"both_groups_height_m_approx":1.8,"both_groups_bodyfat_pct_approx":13,"users_mean_mass_kg_approx":92,"nonusers_mean_mass_kg_approx":82,"overall_bodyfat_pct":12.8,"overall_bodyfat_sd":4.8,"users_lean_mass_lb":175,"users_lean_mass_kg":l2k(175),"nonusers_lean_mass_lb":158,"nonusers_lean_mass_kg":l2k(158),"mr_america_FFMI_sd":1.5,"mr_america_n_above_27":3,"mr_america_max_FFMI":28.0,"mr_america_1939_1944_mean":24.9,"mr_america_1939_1944_max":27.3,"mr_america_1939_1953_mean":25.6,"mr_america_1939_1953_max":28.0,"mr_america_FFMI_trend_per_yr":0.044,"trend_p":0.44},
 ["helms","lyle"],
 "I could not access the full Kouri paper; these numbers are as quoted by Eric Helms (AARR Aug 2014: users ~25 vs non-users ~22, ~1.8 m, ~13% fat, ~92 vs ~82 kg; Mr America mean 25.4, highest 28; 1939-44 mean 24.9 max 27.3; 1939-53 mean 25.6 max 28.0; slope 0.044 FFMI units/yr, p=0.44) and Lyle McDonald (mean body fat 12.8 +/- 4.8%; lean mass ~175 lb users vs ~158 lb nonusers; Mr America mean 25.4 +/- 1.5 with 3 above 27.0; says Mr America FFMIs were computed from reported heights/weights assuming 5% body fat). McDonald also says only 134 of 156 gym recruits had full data, plus 23 from a testosterone study. Treat these as secondary.")
add("kouri1995_normalization_constant","Kouri normalized-FFMI height correction constant: 6.3 vs 6.1","disputed",
 {"constant_in_PubMed_abstract":6.3,"constant_quoted_by_McDonald_and_common_use":6.1,"formula":"FFMI_norm = FFM/h^2 + k*(1.80 - h)"},
 ["kouri","lyle"],
 "The Europe PMC/PubMed abstract says '6.3 x (1.80 m - height)'. McDonald's write-up of the paper (and most online FFMI calculators) use 6.1. I could not see the paper body to resolve it. Practical effect is tiny (<0.1 FFMI unit for heights 1.65-2.05 m).")
add("graybeal2020_bodybuilders_4C","Graybeal et al. 2020: 4-compartment FFMI of competitive bodybuilders","measured",
 {"male_n":17,"male_FFMI_kg_m2_mean":25.1,"male_FFMI_sd":1.8,"male_bodyfat_pct_mean":11.8,"male_bodyfat_sd":4.4,"female_n":10,"female_FFMI_kg_m2_mean":18.3,"female_FFMI_sd":1.4,"female_bodyfat_pct_mean":19.7,"female_bodyfat_sd":4.9},
 ["graybeal"],
 "Abstract: 'Twenty-seven male (n = 17; 4-compartment [4C] model fat-free mass index [FFMI]: 25.1 +/- 1.8 kg/m2; 4C body fat: 11.8 +/- 4.4%) and female (n = 10; 4C FFMI: 18.3 +/- 1.4 kg/m2; 4C body fat: 19.7 +/- 4.9%) bodybuilders'. Competition level and drug status not stated in the abstract. Also concludes single-method body-comp (DXA, BIA) has individual errors large enough to be questionable in muscular physique athletes.")
add("withers1997_elite_bb_4C","Withers et al. 1997: 3 elite male bodybuilders, 4-compartment body composition 10 wk and 5 d pre-contest","measured",
 {"n":3,"mass_10wk_kg":99.70,"mass_5d_kg":92.79,"BMI_10wk":31.6,"BMI_5d":29.2,"FFM_10wk_kg":90.60,"FFM_5d_kg":88.14,"bodyfat_10wk_pct":9.1,"bodyfat_5d_pct":5.0,"fat_mass_10wk_kg":9.10,"fat_mass_5d_kg":4.65,"implied_height_m_derived":round((99.70/31.6)**0.5,3),"implied_FFMI_5d_derived":27.9},
 ["withers"],
 "Abstract gives mass, Quetelet index, FFM, %fat (4C: deuterium dilution + DXA + hydrodensitometry). Height is not in the abstract; 1.776 m is derived from mass/BMI, and FFMI 27.9 is derived from that (my calculation). 64% of the 6.91 kg loss was fat. Drug status not stated.")
add("mcinnis1999_bodybuilders","McInnis & Balady 1999: 14 male bodybuilders vs weight-matched men","measured",
 {"n":14,"mass_kg":99,"mass_sd":7,"height_m":1.80,"height_sd_m":0.08,"bodyfat_pct":8,"bodyfat_sd":3,"FFM_kg":91,"FFM_sd":7,"FFMI_derived_kg_m2":28.1,"control_mass_kg":99,"control_bodyfat_pct":24,"control_FFM_kg":73},
 ["mcinnis"],
 "Abstract values. FFMI 28.1 is my derivation from group means (91/1.80^2). Drug status not stated; an FFMI this far above 25 suggests many were not drug-free, but that is an inference, not a finding.")
add("katch1980_bodybuilders","Katch et al. 1980: lean body weight and 'excess muscle' in bodybuilders vs lifters","measured",
 {"bodybuilders_n":18,"bodybuilders_LBW_kg":74.6,"bodybuilders_bodyfat_pct":9.3,"bodybuilders_excess_muscle_kg":15.6,"powerlifters_n":13,"powerlifters_LBW_kg":73.3,"powerlifters_bodyfat_pct":9.1,"oly_lifters_n":8,"oly_lifters_LBW_kg":68.2,"oly_lifters_bodyfat_pct":10.8,"girth_values":"unknown (not in abstract)"},
 ["katch"],
 "Abstract: only shoulder, chest, biceps relaxed and flexed, and forearm girths differed between groups, bodybuilders being larger; no differences in frame size, %fat, LBW, skinfolds or diameters. Actual girth numbers are in the paywalled paper and were not obtained - unknown.")
add("fry1991_nonelite_bodybuilders","Fry et al. 1991: 36 non-elite male bodybuilders at competition","measured",
 {"n":36,"height_m":1.744,"height_sd_m":0.067,"mass_kg":80.3,"mass_sd":11.0,"bodyfat_pct":9.3,"bodyfat_sd":1.6,"FFM_kg":72.8,"FFM_sd":9.8,"FFMI_derived":round(72.8/1.744**2,1),"chest_to_abdominal_circ_ratio":1.345,"ratio_sd":0.059,"biacromial_to_biiliac_ratio":1.463,"somatotype":"2.3-6.2-1.2"},
 ["fry"],
 "Abstract values; FFMI derived from group means. Authors note these non-elite competitors had 'smaller circumferences' than elite bodybuilders in prior literature. Chest/abdominal circumference ratio and shoulder/hip breadth ratio discriminated successful competitors.")
add("demoraes2019_competition_day_girths","de Moraes et al. 2019: girths of 24 national-level Brazilian bodybuilders at weigh-in (M1) and on contest day (M2)","measured",
 {"population":"IFBB Amateur South American Arnold Classic / 47th Brazilian Championship 2016 qualifiers","height_m":1.73,"CL_n":15,"CL_mass_kg_M1":79.2,"CL_mass_kg_M2":81.5,"CL_chest_cm_M2":112.3,"CL_waist_cm_M2":79.2,"CL_hip_cm_M2":101.4,"CL_thigh_cm_M2":64.1,"CL_arm_cm_M2":42.4,"CL_calf_cm_M2":41.1,"CL_forearm_cm_M2":33.5,"NC_n":9,"NC_mass_kg_M1":80.5,"NC_chest_cm_M1":112.5,"NC_waist_cm_M1":77.5,"NC_thigh_cm_M1":64.9,"NC_arm_cm_M1":42.6,"NC_calf_cm_M1":40.4,"NC_forearm_cm_M1":32.7,"orig":"Table 2, mean +/- SD; SDs: chest ~6, waist ~3.8, thigh ~3-4, arm ~1.5, calf ~1.4-2, forearm ~2-2.8 cm"},
 ["demoraes","demoraes_ft","demoraes_ab"],
 "Values from Table 2 (CL = carbohydrate-loading group; NC = no loading). Carb loading raised arm, chest, thigh, calf, forearm and hip girths by ~0.5-2.3 cm overnight. The pages I read do not say whether 'arm' was flexed or relaxed - treat as unspecified. Note an internal inconsistency: methods text says CL n=9/NC n=15 but abstract and table say NC n=9/CL n=15. These are regional/national amateurs, far smaller than IFBB pros.")
add("bamman1993_precontest_girth_changes","Bamman et al. 1993: girth changes over 12 weeks of contest prep (6 male bodybuilders)","measured",
 {"n":6,"body_mass_change_kg":-7.3,"bodyfat_change_pct_points":-5.0,"waist_change_cm":-6.9,"hips_change_cm":-4.3,"chest_change":"not significant"},
 ["bamman"],
 "Abstract: 'Circumferences decreased significantly at all sites (p < 0.05) except the chest. The greatest decreases were at the waist (-6.9 cm) and hips (-4.3 cm).' Fat-free mass showed little change; biceps muscle thickness (ultrasound) unchanged. Useful for converting off-season to stage girths.")
add("sukwong2022_thai_elite_bodybuilders","Sukwong et al. 2022: elite vs novice Thai bodybuilders (girths)","measured",
 {"elite_n":10,"elite_mass_kg":81.33,"elite_mass_sd":7.90,"elite_height_cm":170.20,"elite_height_sd":7.23,"elite_flexed_upper_arm_cm":41.75,"flexed_arm_sd":1.84,"elite_upper_arm_cm":37.0,"upper_arm_sd":2.59,"elite_chest_cm":104.95,"chest_sd":4.79,"elite_bodyfat_pct_BIA":17.56,"novice_mass_kg":77.27,"novice_height_cm":170.10,"novice_chest_cm":99.75,"novice_bodyfat_pct_BIA":20.99},
 ["sukwong"],
 "From the PDF text. Body fat by BIA (not stage-lean values). Neck, arm, waist, hip, thigh and calf girths did not differ significantly between groups (values for those not extracted). National-level Asian amateurs; a lower bound for 'competitive bodybuilder' girths.")
add("mitchell2018_natural_bodybuilders","Mitchell et al. 2018: 9 natural male bodybuilders, DXA over contest prep","measured",
 {"n":9,"lean_mass_kg_PRE8":71.8,"lean_mass_kg_PRE1":70.9,"lean_mass_sd":9.1,"lean_mass_kg_POST4":72.5,"fat_mass_kg_PRE16":8.8,"fat_mass_kg_PRE1":5.3,"protein_g_per_kg_day":"2.8-3.1"},
 ["mitchell"],
 "Abstract values. Height not in abstract, so FFMI cannot be derived here. 'Despite substantial reductions in FM, participants maintained almost all of their LM.'")
add("chappell2019_natural_pro_bodybuilders","Chappell, Simper & Helms 2019: British natural PRO vs amateur bodybuilders (WNBF/DFAC, polygraph + WADA testing)","reported",
 {"male_PRO_n":8,"male_PRO_height_m":1.77,"male_PRO_height_sd":0.05,"male_PRO_diet_start_mass_kg":95.6,"start_sd":8.3,"male_PRO_diet_end_mass_kg":82.3,"end_sd":6.6,"male_AMA_n":25,"male_AMA_height_m":1.77,"male_AMA_start_kg":88.3,"male_AMA_end_kg":74.9,"male_PRO_weeks_dieting":28.1,"male_PRO_FFMI_at_end_if_5pct_fat_derived":25.0},
 ["chappell19"],
 "Table 1 is explicitly 'Self-reported Characteristics' (height and bodyweight self-reported), hence 'reported'. All 8 male PROs had placed top-5 at DFAC or WNBF PRO World Finals; cohort included a two-time overall PRO world champion. The FFMI 25.0 is my derivation assuming 5% stage body fat (an assumption, not measured).")
add("rossow2013_natural_pro_case","Rossow et al. 2013: 12-month case study of a drug-free IFPA pro bodybuilder","measured",
 {"age_y":"26-27","bodyfat_pct_start":14.8,"bodyfat_pct_contest":4.5,"bodyfat_pct_6mo_after":14.6,"testosterone_ng_mL_start":9.22,"testosterone_contest":2.27,"testosterone_after":9.91,"body_mass_loss_kg_secondary":16,"FFMI_at_contest_secondary":24.9,"squat_bench_deadlift_1RM_lb_start":[464,354,570],"at_contest":[400,324,530],"height_m":"unknown"},
 ["rossow","helms","biolayne"],
 "Abstract gives body fat 14.8% -> 4.5% -> 14.6% and testosterone values. The 16 kg body-mass loss and FFMI 24.9 at contest are from Helms (AARR 2014) reading the full paper; 1RMs from Biolayne. Height and absolute masses not obtained (paywalled) - unknown.")
add("bauer2023_bodyfat_ranges_review","Bauer et al. 2023 systematic review: body fat of competitive bodybuilders","measured",
 {"studies_included":16,"male_offseason_or_general_prep_bodyfat_pct":[9.6,16.3],"male_near_competition_bodyfat_pct":[5.8,10.7],"female_general_prep_bodyfat_pct":[15.3,25.2],"female_near_competition_bodyfat_pct":[8.1,18.3],"relative_bodyfat_reduction_during_prep_pct":[30,60]},
 ["bauer"],
 "Abstract: 'In the general preparation phase, body fat levels... ranged between 15.3 and 25.2% (female) and from 9.6 to 16.3% (male). Close to competition... 8.1 to 18.3% for female and 5.8-10.7% for male athletes.' Lean mass mostly maintained. Ranges span different methods (DXA, BIA, skinfolds, etc.).")
add("kraemer2020_elite_strongmen_dxa","Kraemer et al. 2020: DXA body composition of 18 elite strongman competitors","measured",
 {"n":18,"age_y":33.0,"height_m":1.874,"height_sd_m":0.071,"mass_kg":152.9,"mass_sd":19.3,"BMI":43.5,"fat_mass_kg":30.9,"lean_mass_kg":118.0,"lean_sd":11.7,"bodyfat_pct":18.7,"bodyfat_sd":6.2,"BMC_kg":5.23,"BMD_g_cm2":1.78,"FFMI_lean_plus_BMC_derived":35.1},
 ["kraemer"],
 "Abstract values (composite of 5 annual screenings, apparently at the Arnold Strongman Classic per the authors' affiliations - venue not stated in abstract). FFMI derived by me as (lean 118.0 + BMC 5.23)/1.874^2 = 35.1 kg/m2.")
add("balshaw2024_eddie_hall_mri","Balshaw et al. 2024: MRI muscle volumes of a World's Strongest Man and deadlift champion (identifiable as Eddie Hall)","measured",
 {"height_m":1.90,"body_mass_kg":172.0,"age_y":30.6,"leg_muscle_volume_unilateral_cm3":14922,"untrained_controls_cm3":7628,"vs_untrained_pct":96,"quadriceps_cm3":4386,"quadriceps_vs_untrained_pct":127,"hamstrings_cm3":1545,"vastus_lateralis_cm3":1508,"rectus_femoris_cm3":453,"patellar_tendon_CSA_vs_untrained_pct":30,"CMJ_peak_power_W":9866,"IMTP_gross_N":9171},
 ["balshaw"],
 "Table 1 lists the WSM: n=1, age 30.6 y, height 1.90 m, body mass 172.0 kg. The paper anonymises him but describes one WSM title (14 mo before testing), five Britain's Strongest Man titles and the 500 kg deadlift world record, which identifies Eddie Hall (WSM 2017); the paper itself does not name him. Testing therefore ~mid-2018. MRI covered T12 to ankle only (no upper-body or girth tape measurements).")
add("mr_america_1938_1954_program_girths","Mr America winners' measurements when they won (1956 Mr USA contest program) - pre-steroid girth reference","reported",
 {"units":"inches / lb","columns":["year","name","height","weight_lb","neck","arm","forearm","chest","waist","thigh","calf","wrist","ankle"],
  "rows":[["1938","Bert Goodrich","5'10.5\"",195,17,17,14,47,33,24,17,7.6,9.2],["1940/41","John Grimek","5'8.5\"",195,17,17.5,14,47,31,25,17,8,9.8],["1942","Frank Leight","5'11.5\"",209,17.5,17.5,14,48.5,33,24,16,8,9.5],["1943","Jules Bacon","5'7\"",175,15.5,15.5,12.5,44,31,23,15,7,9],["1944","Steve Stanko","5'11.5\"",223,18,18,14.3,48.5,35.9,None,17,8,10],["1945","Clarence Ross","5'9.5\"",185,16.5,17,13.5,47,32,24,16,7.5,9.2],["1946","Alan Stephan","5'11.5\"",205,17.1,17,14.2,47.9,32.4,24.8,16.1,7.7,9.7],["1947","Steve Reeves","6'1\"",213,17.6,17.5,14,48,31,25.3,17.5,7.9,9.8],["1948","George Eiferman","5'7.5\"",195,16.5,16.7,13.4,47.5,32,25,16,7.3,9.6],["1949","Jack Delinger","5'6\"",195,16.8,17.2,13.8,47.5,32,25,16.6,7.7,9.5],["1950","John Farbotnik","5'9\"",195,16.8,17,13.5,47.5,32,24.5,15.7,7.5,9.3],["1951","Roy Hilligenn","5'6\"",178,16.6,16.7,13.4,46,32,23.6,15.4,7.5,9.2],["1952","James Park","5'7.5\"",190,16.7,17,13.4,47,32.5,24.2,15.2,7.3,9],["1953","Bill Pearl","5'9\"",201,17.5,17.5,14,48,32.5,25,16.2,7.8,9.5],["1954","Dick Dubois","6'1\"",220,17.8,18,14.2,49,32.5,25.5,17.2,8,9.6]],
  "later_from_magazines":[["1965","Jerry Daniels","6'",215,None,19,None,52,32,26.75,17],["1967","Dennis Tinerino","6'0\"",217,None,19.75,None,52,32,27,18],["1975","Dale Adrian","5'8\"",200,18,19.25,15,53,30,26,18],["1977","Kalman Szkalak","5'10\"",215,None,20,None,52,30,26.5,17],["1981","Tim Belknap","5'4\"",225,None,21,17.5,None,31,29,19.5]],
  "SI_example_Reeves":{"height_m":i2m(73),"mass_kg":l2k(213),"neck_m":i2m(17.6),"arm_m":i2m(17.5),"forearm_m":i2m(14),"chest_m":i2m(48),"waist_m":i2m(31),"thigh_m":i2m(25.3),"calf_m":i2m(17.5)}},
 ["mra"],
 "Transcribed by MuscleMemory.org from the 1956 Mr USA contest program ('Measurements of Mr America winners, taken when they won their titles'); 1939, 1959+ rows from 'various bodybuilding magazines'. Contest-program/magazine numbers, method of measuring (flexed arm? cold or pumped?) not stated - label as reported. These overlap the Kouri 1939-1959 pre-steroid sample. Note how modest arm (15.5-18 in) and calf (15-17.5 in) girths were vs modern pros.")

# ---------------- Athletes ----------------
add("ronnie_coleman_height_weight","Ronnie Coleman (8x Mr. Olympia 1998-2005): height and bodyweights","reported",
 {"height_m":i2m(71),"orig_height":"5'11\"","contest_1998_Olympia_kg":l2k(249),"contest_1998_lb":249,"contest_2003_Olympia_kg":l2k(286),"contest_2003_lb":286,"contest_2004_Olympia_kg":l2k(296),"contest_2004_lb":296,"contest_2004_prejudging_morning_lb":291,"contest_2005_Olympia_kg":l2k(275),"contest_2005_lb":275,"offseason_range_kg":[l2k(315),l2k(330)],"offseason_range_lb":[315,330],"heaviest_selfreported_lb":330,"heaviest_selfreported_kg":l2k(330)},
 ["im2003","im2004","bb1998","bb2004","bb2005","fv_ronnie330","wiki_ronnie","fv_ronnie_db","fv_ronnie_prof"],
 "Iron Man (Lonnie Teper, Oct 27 2003): 'coming in at an unheard of 286 pounds on his 5'11\" frame'. Iron Man 2004 report: nutrition adviser Chad Nicholls said he weighed 291 the morning of prejudging and 'was probably around 295' after eating. FLEX/Peter McGough via The Barbell: '5'11\", 296 pounds... at his all-time heaviest contest weight' (2004); 1998 posedown '249 pounds next to [Flex Wheeler's] 230'; 2005 'at 275 pounds instead of the 296 of last year'. Off-season 315-330 lb per Wikipedia (citing bodybuildingpro.com/Bodybuilding.com); 330 lb is Coleman's own description of his biggest ever ('I weighed about 330lb. Not contest shape'). CONFLICT: FitnessVolt's profile box lists 'Competition Weight 330 lbs / Off Season 296 lbs' - apparently swapped labels; its own database lists 287 lb.")
add("ronnie_coleman_girths","Ronnie Coleman: published girths","disputed",
 {"arm_in":24,"arm_m":i2m(24),"chest_in":[58,60],"chest_m":[i2m(58),i2m(60)],"waist_in":36,"waist_m":i2m(36),"thigh_in":[34,36],"thigh_m":[i2m(34),i2m(36)],"calf_in":22,"calf_m":i2m(22),"neck":"unknown","forearm":"unknown"},
 ["gp_ronnie","fv_ronnie_prof","wiki_ronnie"],
 "Arms 24 in agreed by GreatestPhysiques, FitnessVolt and Wikipedia (Wikipedia: 'biggest upper arms he ever posed on stage at over 24 in in contest shape' at 2006 Olympia). Chest 58 in (GreatestPhysiques, FitnessVolt) vs 'Chest/Back 60 in' (Wikipedia citing bodybuildingpro.com). Thighs 36 in (GreatestPhysiques) vs 34 in (FitnessVolt). Waist 36 in and calves 22 in from GreatestPhysiques only (fan site). None of these state when or how measured (cold/pumped, flexed/relaxed). No neck or forearm figure found.")
add("arnold_schwarzenegger_height_weight","Arnold Schwarzenegger (7x Mr. Olympia): height and bodyweights","disputed",
 {"height_claimed_m":i2m(74),"height_claimed":"6'2\"","height_1969_1980_reports_m":i2m(73.5),"height_reports":"6'1.5\"","height_GP_m":i2m(75),"height_range_m":[i2m(73.5),i2m(75)],"contest_topform_lb":235,"contest_topform_kg":l2k(235),"contest_1971_Olympia_lb":246,"contest_1971_kg":l2k(246),"contest_1975_Olympia_lb":235,"offseason_lb":260,"offseason_kg":l2k(260),"GP_weight_range_lb":[225,235]},
 ["celeb_arnold","fv_arnold","gp_arnold","bb1971","bb1975","wiki_arnold"],
 "Height: his book 'Education of a Bodybuilder' lists 6 ft 2 in (as quoted by CelebHeights); CelebHeights also reports a 1980 interview where he said 6 ft 1.5 and a bodybuilder's claim to have measured him at 6 ft 1.5 in 1969; GreatestPhysiques lists 6'3\". Weights: 235 lb top form (book); The Barbell (Greg Merritt): '246-pound Arnold' at the 1971 Olympia ('bigger but smoother'), 'at 235 pounds, Arnold was undersized and a little smooth' in 1975. Off-season 260 lb per FitnessVolt and Wikipedia (citing Bodybuilding.com 2015).")
add("arnold_schwarzenegger_girths","Arnold Schwarzenegger: published 'top form' girths","disputed",
 {"arm_in":22,"arm_m":i2m(22),"chest_in":57,"chest_m":i2m(57),"waist_in":[30,34],"waist_m":[i2m(30),i2m(34)],"thigh_in":28.5,"thigh_m":i2m(28.5),"calf_in":20,"calf_m":i2m(20),"neck":"unknown","forearm":"unknown","orig":"Arms 22in, Chest 57in, Waist 34in, Thighs 28.5in, Calves 20in, Weight 235 lbs, Height 6 feet 2 inches"},
 ["celeb_arnold","fv_arnold","gp_arnold"],
 "Self-reported in his book (quoted by CelebHeights: 'Top Form Measurements were: Arms 22in, Chest 57in, Waist 34in, Thighs 28.5in, Calves 20in, Weight 235 lbs, Height 6 feet 2 inches'); FitnessVolt repeats the same set. GreatestPhysiques lists waist 30 in (others identical) - hence disputed waist 30-34 in. Self-reported by the athlete; no independent measurement found.")
add("dorian_yates_height_weight","Dorian Yates (6x Mr. Olympia 1992-97): height and bodyweights","disputed",
 {"height_m":[i2m(69),i2m(70)],"height_orig":"5'9\" (FitnessVolt) or 5'10\" (GreatestPhysiques, Wikipedia)","contest_1992_Olympia_lb":242,"contest_1992_kg":l2k(242),"contest_1993_Olympia_kg":116.57,"contest_1993_lb":257,"contest_range_GP_lb":[255,265],"FV_weight_range_lb":[260,290],"offseason":"unknown (no year-specific source found)"},
 ["gwr_dorian","bb1994","fv_dorian","gp_dorian"],
 "Guinness: 'In 1993 Dorian Yates (UK) weighed 116.57 kg (18 st 5 lb) when he was crowned Mr Olympia' (page is titled 'Heaviest Mr Olympia champion' but is out of date - Coleman 2003-04 and Elssbiay were heavier). The Barbell (Merritt): 'When Dorian Yates won his first Mr. Olympia in 1992, he weighed 242. One year later... he was 257 grainy pounds'. FitnessVolt gives '260 - 290 lbs' without saying which is contest vs off-season, so off-season is left unknown.")
add("dorian_yates_girths","Dorian Yates: published girths","disputed",
 {"arm_in":[20,21],"arm_m":[i2m(20),i2m(21)],"chest_in":[56,57],"chest_m":[i2m(56),i2m(57)],"waist_in":[34,38],"waist_m":[i2m(34),i2m(38)],"thigh_in":30,"thigh_m":i2m(30),"calf_in":[20,22],"calf_m":[i2m(20),i2m(22)],"neck":"unknown"},
 ["gp_dorian","fv_dorian"],
 "GreatestPhysiques: arms 20, chest 56, waist 38, calves 20 in. FitnessVolt: arms 21, legs 30, waist 34, chest 57, calves 22 in. Both fan/magazine-style sites with no date or method; the two disagree on every shared girth.")
add("jay_cutler_height_weight","Jay Cutler (4x Mr. Olympia): height and bodyweights","disputed",
 {"height_m":[i2m(69),i2m(70)],"height_orig":"5'9\" (FLEX 2004 via The Barbell; FitnessVolt profile; GreatestPhysiques; M&F per Wikipedia) or 5'10\" (Bodybuilding.com per Wikipedia; FitnessVolt database)","contest_1999_Olympia_lb":255,"contest_2004_lb":273,"contest_2005_lb":264,"contest_2007_lb_approx":[260,265],"contest_2009_lb":271,"contest_2009_kg":l2k(271),"contest_2010_lb":260,"offseason_lb":[290,310],"offseason_kg":[l2k(290),l2k(310)]},
 ["bb1999","bb2004","bb2005","bb2007","bb2009","bb2010","fv_jay","gp_jay","wiki_jay"],
 "FLEX contest reports republished by The Barbell: 1999 'JAY CUTLER: 255 pounds'; 2004 '2nd JAY CUTLER 5'9\", 273 pounds'; 2005 'Cutler, at 264'; 2007 'He planned to come in at 275, but his weight fell to 265 and was five pounds less than that after prejudging'; 2009 '271 striated pounds'; 2010 '260-pound' Cutler vs 245-pound Heath. Off-season 310 lb (FitnessVolt) / 290-310 lb (Wikipedia citing Bodybuilding.com 2015).")
add("jay_cutler_girths","Jay Cutler: published girths","disputed",
 {"arm_in":[21,22],"arm_m":[i2m(21),i2m(22)],"chest_in":58,"chest_m":i2m(58),"waist_in":[34,39],"waist_m":[i2m(34),i2m(39)],"thigh_in":30,"thigh_m":i2m(30),"calf_in":[19,20],"calf_m":[i2m(19),i2m(20)],"neck":"unknown"},
 ["fv_jay","gp_jay","wiki_jay"],
 "FitnessVolt: arms 22, waist 39, chest 58, thighs 30, calves 20. GreatestPhysiques: arms 21, chest 58, waist 34, thighs 30, calves 19. Wikipedia (citing Bodybuilding.com 2015): upper arms 22, chest 58, thighs 30, waist 34. The 39 in waist is likely an off-season figure but no source says so.")
add("phil_heath_height_weight","Phil Heath (7x Mr. Olympia 2011-17): height and bodyweights","reported",
 {"height_m":i2m(69),"height_orig":"5'9\"","contest_2009_Olympia_lb":227,"contest_2010_lb":245,"contest_2011_lb":248,"contest_2011_kg":l2k(248),"GP_range_lb":[245,255],"FV_database_lb":240,"offseason_lb":270,"offseason_kg":l2k(270),"retired_2023_selfreported_lb":255},
 ["bb2009","bb2010","bb2011","fv_phil","gp_phil","bb_phil"],
 "FLEX via The Barbell: 2009 'Friday night he's 227'; 2010 '245-pound Heath'; 2011 'At 248, he's only two pounds more than last year' (orig. FLEX Nov 2011). Off-season 270 lb: Wikipedia citing FitnessVolt 2019; FitnessVolt profile now shows '240-270lbs'. April 2023 (retired): 'I'm sitting around 255 pounds right now' (his video, quoted by The Barbell).")
add("phil_heath_girths","Phil Heath: published girths","reported",
 {"arm_in":23,"arm_m":i2m(23),"chest_in":54,"chest_m":i2m(54),"waist_in":29,"waist_m":i2m(29),"thigh_in":32,"thigh_m":i2m(32),"calf_in":20,"calf_m":i2m(20),"neck":"unknown"},
 ["gp_phil"],
 "Single source: GreatestPhysiques.com (fan site, published 2016, modified 2017), no date or method. Not corroborated - treat as low confidence.")
add("big_ramy_height_weight","Mamdouh 'Big Ramy' Elssbiay (Mr. Olympia 2020, 2021): height and bodyweights","disputed",
 {"height_m":[i2m(69),i2m(71)],"height_orig":"5'9\" (FitnessVolt, GreatestPhysiques, Wikipedia) vs 5'11\" (FLEX 2014 report via The Barbell)","contest_2014_Olympia_lb":285,"contest_2014_kg":l2k(285),"contest_2015_Olympia_lb_est":[305,310],"contest_2015_kg_est":[l2k(305),l2k(310)],"weight_heard_2015_lb":316,"FV_database_contest_lb":295,"GP_range_lb":[295,310],"offseason_Jan2022_kg":155,"offseason_Jan2022_lb":341,"offseason_Sep2022_lb":337.7,"offseason_Sep2022_kg":l2k(337.7)},
 ["bb2014","bb2015","fv_ramy","gp_ramy","fv_ramy_db","fv_ramy341","bm_ramy337"],
 "FLEX/Merritt (2014): 'he carries 285 lean pounds on a 5'11\" frame'. 2015: 'Elssbiay likely got into the 305-310 range on stage at Friday's prejudging... Phil Heath wasn't concerned when he heard 316'. Jan 2022 to coach Dennis James: 'Right now, I'm 155kg, (341lbs) with abs' (FitnessVolt). Sep 22 2022 Instagram: 337.7 lb before contest diet (Breaking Muscle). Wikipedia's 'off season 310 lb' (citing FitnessVolt) conflicts with his own 337-341 lb statements. 2020/2021 stage weights not found in a source I could fetch.")
add("big_ramy_girths","Big Ramy: published girths","disputed",
 {"arm":"unknown","chest":"unknown","waist":"unknown","thigh":"unknown","calf":"unknown","neck":"unknown"},
 [],
 "No girths found in any source I fetched (FitnessVolt and GreatestPhysiques profiles list only height/weight). Widely repeated internet arm figures were not traceable to a primary or magazine source - left unknown.") if False else None
pass # removed: F.append({"key":"big_ramy_girths","label":"Big Ramy: published girths","status":"estimate","values":json.dumps({"arm":"unknown","chest":"unknown","waist":"unknown","thigh":"unknown","calf":"unknown","neck":"unknown"}),"sources":src("fv_ramy","gp_ramy"),"notes":"UNKNOWN. Neither the FitnessVolt nor the GreatestPhysiques profile lists any girth, and I found no magazine or primary source with tape measurements. Do not invent; if the calculator needs one, derive from the build model and label as estimate."})
add("sergio_oliva_height_weight","Sergio Oliva (Mr. Olympia 1967-69): height and bodyweights","disputed",
 {"height_m":i2m(70),"height_orig":"5'10\"","contest_1967_lb_approx":225,"contest_1967_kg":l2k(225),"contest_1972_lb_approx":240,"contest_1972_kg":l2k(240),"contest_range_lb_Wikipedia":[225,245],"GP_range_lb":[225,235],"FV_profile_lb":255,"FV_database_lb":225,"offseason_lb_Wikipedia":235},
 ["bb_sergio","gp_sergio","fv_sergio","wiki_sergio"],
 "The Barbell (Greg Merritt, 2024): 'At 5'10\" and around 225 pounds' at the 1967 Olympia; 'At around 240 pounds' at the 1972 Olympia. Wikipedia (citing M&F): contest 225-245 lb; off-season 235 lb (citing GreatestPhysiques). FitnessVolt profile '255 lbs' is an outlier vs its own database (225 lb).")
add("sergio_oliva_girths","Sergio Oliva: published girths","disputed",
 {"arm_in":[20,22.5],"arm_m":[i2m(20),i2m(22.5)],"chest_in":[52,59],"chest_m":[i2m(52),i2m(59)],"waist_in":[27,32],"waist_m":[i2m(27),i2m(32)],"waist_RickWayne_in":29,"thigh_in_RickWayne":29,"thigh_m":i2m(29),"calf_in_RickWayne":"close to 20","calf_m_approx":i2m(20),"neck":"unknown"},
 ["bb_sergio","gp_sergio","fv_sergio"],
 "Rick Wayne (quoted in The Barbell): 'His waist measured all of 29 inches, precisely the circumference of his thighs... His calves measured close to 20 inches!' GreatestPhysiques: arms 22.5, chest 59, waist 27. FitnessVolt: arms 20, waist 32, chest 52. Very wide spread (arm 20-22.5, chest 52-59, waist 27-32).")
add("brian_shaw_height_weight","Brian Shaw (4x World's Strongest Man): height, bodyweight, body fat","disputed",
 {"height_m":[2.0,i2m(80)],"height_orig":"6'8\" (WSM profile per Wikipedia; FitnessVolt) vs 6'6.75\" (his own 2025 'BODY FAT TEST' video per Wikipedia)","weight_2019_start_lb":440,"weight_2019_start_kg":l2k(440),"weight_Feb2024_hydrostatic_lb":384.6,"weight_Feb2024_kg":174.5,"bodyfat_Feb2024_hydrostatic_pct":17.6,"FFM_Feb2024_derived_kg":round(174.5*(1-0.176),1),"FV_weight_range_lb":[385,440],"Wikipedia_weight_range_lb":[340,454],"FFMI_derived_range":[34.8,35.9]},
 ["fv_shaw","fv_shaw_hydro","fv_shaw_2019","wiki_shaw"],
 "FitnessVolt Feb 8 2024: 'Brian came out at 384.6 pounds (174.5 kilograms)'; hydrostatic body fat 17.6% (filmed for his YouTube, Feb 1). Aug 2019: cutting 'to a goal weight of 400lbs, from a starting weight of 440lbs'. Shaw distrusted his earlier DXA results (reportedly too big for the machine). Height: I did not watch the YouTube short; the 6'6.75\" figure is as cited by Wikipedia. FFM and FFMI (34.8 at 2.03 m, 35.9 at 2.00 m) are my derivations.")
F.append({"key":"brian_shaw_girths","label":"Brian Shaw: published girths","status":"disputed","values":json.dumps({"arm":"unknown","chest":"unknown","waist":"unknown","thigh":"unknown","calf":"unknown","neck":"unknown","unreliable_web_claims_in":{"chest":60,"biceps":[20,23],"waist":[40,47],"thigh":30}}),"sources":src("fv_shaw"),"notes":"UNKNOWN from any credible source. A web search surfaced only low-quality SEO pages (chest ~60 in, biceps 20-23 in, waist 40-47 in, thigh 30 in) that contradict each other and also misstate his height (6'3\") - listed only so the owner knows they exist; do not use as data."})
add("hafthor_bjornsson_height_weight","Hafthor Julius Bjornsson (WSM 2018; deadlift WR 510 kg, 2025): height and bodyweights","reported",
 {"height_m":[2.05,2.06],"height_orig":"205 cm (WSM profile per Wikipedia; fight tale of tape '6 ft 9 in (205 cm)') / 206 cm (FitnessVolt '6'9\"')","heaviest_2012_kg":210,"heaviest_2012_lb":l2k(210) and round(210/LB),"jul2025_selfreported_kg":200,"jul2025_lb":440.9,"boxing_weighin_19Mar2022_kg":152,"boxing_weighin_lb":335,"FV_profile_lb":323},
 ["wiki_thor","fv_thor","fv_thor200","wiki_fight","gwr_dl"],
 "Wikipedia: career-heaviest 210 kg at 2012 Europe's Strongest Man (cites his YouTube). July 2025 Instagram: '200kg bodyweight. I haven't felt this strong since 2020. I'm ready for 505kg' (FitnessVolt). Boxing vs Eddie Hall, Dubai 19 Mar 2022: 152 kg vs Hall 142 kg (tale of the tape). Wikipedia's infobox note claims 205 kg 'officially measured' at the Sept 2025 World Deadlift Championships - not verified (Guinness record page gives the 510 kg lift but no bodyweight). FitnessVolt profile '323 lbs' matches neither (likely his ~2021 boxing-era weight).")
pass # removed: F.append({"key":"hafthor_bjornsson_girths","label":"Hafthor Bjornsson: published girths","status":"estimate","values":json.dumps({"arm":"unknown","chest":"unknown","waist":"unknown","thigh":"unknown","calf":"unknown","neck":"unknown"}),"sources":src("fv_thor","wiki_thor"),"notes":"UNKNOWN - no tape measurements found in any source fetched."})
add("eddie_hall_height_weight","Eddie Hall (WSM 2017; first 500 kg deadlift 2016): height and bodyweights","measured",
 {"height_measured_m":1.90,"mass_measured_kg_c2018":172.0,"height_selfreported":"6ft 2.5 (1.89 m)","peak_selfreported_kg":196.5,"peak_selfreported_lb":433,"pre_boxing_Dec2021_kg":158,"boxing_weighin_19Mar2022_kg":142,"boxing_weighin_lb":313,"FV_profile":"157 kg, 190 cm"},
 ["balshaw","talksport_hall","wiki_fight","fv_hall","wiki_hall"],
 "Measured: Balshaw et al. 2024 Table 1, 1.90 m and 172.0 kg (lab visit ~14 months after his 2017 WSM win). Self-reported peak: Instagram 'This is what peak physical strength looks like! 196.5kg // 433lbs // 31stone // 6ft 2.5' (talkSPORT, 21 Jan 2022). Boxing weigh-in 142 kg (tale of the tape). Wikipedia lists 6 ft 2 in (citing a 2018 BarBend list, now a dead link) - the lab-measured 1.90 m should be preferred. Status 'measured' applies to the 1.90 m / 172.0 kg pair only; the others are reported.")
pass # removed: F.append({"key":"eddie_hall_girths","label":"Eddie Hall: published girths","status":"estimate","values":json.dumps({"arm":"unknown","chest":"unknown","waist":"unknown","thigh":"unknown","calf":"unknown","neck":"unknown","MRI_quadriceps_volume_cm3":4386,"MRI_total_unilateral_leg_muscle_cm3":14922}),"sources":src("balshaw"),"notes":"No tape girths found. The only measured size data are MRI muscle volumes (single leg, T12 to ankle) from Balshaw et al. 2024 - quadriceps 4,386 cm3 (+127% vs untrained), total 22-muscle unilateral volume 14,922 cm3 (+96%)."})
add("lasha_talakhadze_height_weight","Lasha Talakhadze (3x Olympic +109/+102 kg champion; total WR 492 kg): height and official bodyweights","official",
 {"height_official_Tokyo2020_m":1.95,"height_Olympedia_m":1.97,"bodyweight_Rio2016_kg":157.34,"bodyweight_Tokyo2020_kg":177.00,"bodyweight_Paris2024_kg":178.45,"bodyweight_Tokyo2020_lb":round(177.00/LB,1),"Olympedia_profile_kg":"158-160 (stale)","Wikipedia_kg":183},
 ["tokyo_lasha","oly_lasha","oly_2016","oly_2020","oly_2024","wiki_lasha"],
 "Bodyweights are the competition weigh-in values in Olympedia's results tables ('Bodyweight (kg)' column): Rio 2016 157.34 (473 kg total, gold, WR), Tokyo 2020 177.00 (488 kg, gold, WR/OR), Paris 2024 178.45 (470 kg, gold). Height is DISPUTED: Tokyo 2020 official profile 'Height ( m / ft ): 1.95/6'4''' vs Olympedia and Wikipedia 197 cm. Wikipedia's 183 kg is unsourced. Girths: unknown (none published).")
add("natural_wnbf_malcolm_cooper","Malcolm Cooper - 2023 WNBF Pro Universe winner (drug-tested: polygraph + WADA-style urinalysis federation)","reported",
 {"stage_weight_lb":174,"stage_weight_kg":79,"pre_2016_weight_lb":">260","height":"unknown","girths":"unknown","age_y":37},
 ["fv_cooper","bm_cooper"],
 "FitnessVolt (Sep 28 2023): 'Malcolm Cooper, who commanded the stage at a weight of 174 pounds... Cooper weighed over 260 pounds at one point before his amateur debut back in 2016.' Breaking Muscle: 'Cooper weighed roughly 174 pounds (79 kilograms)'. Height not found, so FFMI cannot be computed. For a named 'top natural' with height use the Chappell 2019 PRO group (1.77 m, ~82 kg stage, self-reported) or the Rossow 2013 case (FFMI 24.9 at 4.5% fat).")
add("steve_reeves_presteroid","Steve Reeves (Mr America 1947, Mr Universe 1950) - pre-steroid-era reference (NOT drug-tested)","disputed",
 {"program_1956":{"height_m":i2m(73),"mass_kg":l2k(213),"neck_m":i2m(17.6),"arm_m":i2m(17.5),"forearm_m":i2m(14),"chest_m":i2m(48),"waist_m":i2m(31),"thigh_m":i2m(25.3),"calf_m":i2m(17.5),"orig":"6'1\", 213 lb, neck 17.6, arm 17.5, forearm 14, chest 48, waist 31, thigh 25.3, calf 17.5, wrist 7.9, ankle 9.8 in"},
  "GreatestPhysiques":{"mass_kg":[l2k(215),l2k(225)],"arm_m":i2m(18.5),"chest_m":i2m(52),"waist_m":i2m(29),"thigh_m":i2m(26),"calf_m":i2m(18.5),"orig":"215-225 lb, 6'1\", arms 18.5, chest 52, waist 29, thighs 26, calves 18.5 in"},
  "FFMI_derived_at_5pct_fat":26.7},
 ["mra","gp_reeves"],
 "Two incompatible sets: the 1956 Mr USA program (measurements 'taken when they won their titles') vs the widely repeated 18.5/52/29/26/18.5 set (GreatestPhysiques; probably later 'peak' or idealised figures - the 18.5 in arm = neck = calf matches Reeves' own symmetry ideal). A web-search summary also cited a Sept 1947 Muscle Power listing (neck 17 5/8, chest 49.5, biceps 18, waist 29, thigh 25.25, calf 17 1/8, 213 lb) but the page is script-rendered and I could not read it - unverified. FFMI 26.7 is my derivation (213 lb, 6'1\", assumed 5% fat).")
add("fitnessvolt_db_ffmi_method","FitnessVolt database FFMI rankings (contest height/weight, assumed 6% body fat)","derived",
 {"assumed_bodyfat_pct":6,"Ronnie_Coleman":{"height":"5'11\"","weight_lb":287,"FFMI":37.8,"norm":37.8},"Dorian_Yates":{"height":"5'10\"","weight_lb":267,"FFMI":35.5,"norm":35.6},"Jay_Cutler":{"height":"5'10\"","weight_lb":260,"FFMI":35.0,"norm":35.1},"Phil_Heath":{"height":"5'9\"","weight_lb":240,"FFMI":33.4,"norm":33.7},"Big_Ramy":{"height":"5'9\"","weight_lb":295,"FFMI":41.1,"norm":41.4,"rank":"2nd of 316 measured men"},"Sergio_Oliva":{"height":"5'10\"","weight_lb":225,"FFMI":30.3,"norm":30.4},"Arnold":{"height":"6'2\"","weight_lb":249,"FFMI":30.1,"norm":29.6}},
 ["fv_ronnie_db","fv_ramy_db","fv_dorian_db","fv_jay_db","fv_phil_db","fv_sergio_db","fv_arnold_db"],
 "FitnessVolt: 'Both assume the 6% body fat a competitor steps on stage at, because that is the only condition the recorded weight was taken in.' Database holds height+weight for only 463 athletes. Note its single heights/weights differ from other sources (e.g. Jay 5'10\"/260, Dorian 267 lb, Arnold 249 lb).")
add("derived_ffmi_pros","Derived FFMI of pro bodybuilders at reported stage weight (assumed 5% fat)","derived",
 {"assumption_bodyfat_pct":5,"Ronnie_2004_296lb_5ft11":39.2,"Ronnie_2003_286lb":37.9,"Dorian_1993_116.57kg_5ft10":35.0,"Jay_2009_271lb_5ft9":38.0,"Phil_2011_248lb_5ft9":34.8,"Ramy_2015_307.5lb_5ft9":43.1,"Ramy_2015_at_5ft11":40.7,"Arnold_1971_246lb_6ft1.5":30.4,"Arnold_1975_235lb":29.1,"Sergio_1967_225lb_5ft10":30.7,"Reeves_1947_213lb_6ft1":26.7,"Shaw_2024_measured_17.6pct_at_2.03m":34.8,"Kouri_natural_ceiling":25.0},
 ["kouri"],
 "My calculation: FFMI = mass*(1-bf)/h^2 using the reported weights/heights in the athlete facts above. Every pro open bodybuilder since the 1960s lands at 29-43, far above the Kouri natural ceiling of 25; stage body fat of 5% is an assumption (Bauer 2023 review: male near-contest 5.8-10.7%, which would lower these by ~0.4-2 units). Script: buildcalc/scripts/ffmi_bb.py.")
F=[f for f in F if f]
json.dump(F,open(sys.argv[1],'w'),indent=1,ensure_ascii=False)
print(len(F))
