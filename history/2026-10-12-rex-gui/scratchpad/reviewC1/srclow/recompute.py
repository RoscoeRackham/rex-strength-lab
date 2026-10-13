import json,glob,sys
root=sys.argv[1]
F={}
for fn in glob.glob(root+'/research/final-*.json'):
    for f in json.load(open(fn))['facts']: F[f['key']]=f
lb=0.45359237; oz=0.028349523125; ftlb=1.355818; kcal=4184; mph=0.44704; kmh=1/3.6
chk=[
 ('apple', 0.101*9.80665*1, 'energy_apple_small_lift_one_metre'),
 ('airrifle', 12*ftlb, 'energy_air_rifle_england_wales_limit'),
 ('pitch', 0.5*(5.125*oz)*(105.8*mph)**2, 'energy_fastest_pitch_kinetic'),
 ('pitch lo', 0.5*(5*oz)*(105.8*mph)**2, None),
 ('pitch hi', 0.5*(5.25*oz)*(105.8*mph)**2, None),
 ('rifle', 0.5*(62*64.79891e-6)*(3025*0.3048)**2, 'energy_rifle_bullet_556'),
 ('bolt', 0.5*95*12.42**2, 'energy_usain_bolt_top_speed'),
 ('bolt lo', 0.5*95*12.14**2, None),
 ('bolt hi', 0.5*(3932/(4.2*9.80665))*12.42**2, None),
 ('sugar', 4.2*1620, 'energy_sugar_teaspoon_food_energy'),
 ('corolla', 0.5*(2955*lb)*(100*kmh)**2, 'energy_corolla_100kmh_kinetic'),
 ('corolla hi', 0.5*(3150*lb)*(100*kmh)**2, None),
 ('grenade', 6.5*oz*5.02e6, 'energy_m67_tnt_equivalent_estimate'),
 ('grenade lo', 6.5*oz*4.69e6, None),
 ('grenade hi', 6.5*oz*1.33*4.184e6, None),
 ('grenade AMCP', 6.5*oz*1240*4184, None),
 ('food', 2000*kcal, 'energy_day_of_food_2000_calories'),
 ('truck', 0.5*(80000*lb)*(100*kmh)**2, 'energy_semi_truck_100kmh'),
 ('homeday', 10791/365*3.6e6, 'energy_us_home_electricity_day'),
 ('foodmonth', 30*2000*kcal, 'energy_month_of_food_2000_calories'),
 ('train', 0.5*454000*(320*kmh)**2, 'energy_high_speed_train_full_speed'),
 ('train full', 0.5*(454000+460*80)*(320*kmh)**2, None),
 ('tnt', 4.184e9, 'energy_tnt_equivalent_per_tonne'),
 ('a380', 0.5*575000*(0.85*(1.4*287.05*(273.15-56.46))**0.5)**2, 'energy_a380_cruise'),
 ('a380 lo', 0.5*386000*(0.85*(1.4*287.05*(273.15-56.46))**0.5)**2, None),
 ('moab', 11*4.184e9, 'energy_moab_yield'),
 ('moab lo', 18700*lb*923*4184, None),
 ('moab hi', 18700*lb*1.35*4.184e6, None),
 ('moab fullcomb', 18700*lb*3972*4184, None),
]
for name,v,k in chk:
    if k:
        f=F[k]; print('%-12s mine %.5g  fact %.5g  ratio %.4f  lo %s hi %s status %s' % (name,v,f['value_si'],v/f['value_si'],f.get('low_si'),f.get('high_si'),f['status']))
    else:
        print('%-12s mine %.5g' % (name,v))
