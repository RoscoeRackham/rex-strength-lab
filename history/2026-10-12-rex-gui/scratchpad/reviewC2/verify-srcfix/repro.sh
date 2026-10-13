#!/bin/sh
# srcfix-1
grep -n -A2 'typical values ranging' salinas_raw.txt; grep -n -A2 'lower end of' salinas_raw.txt
python3 -I -c "import json;d=json.load(open('/home/user/rex-strength-lab/rex-strength-lab/research/final-energy.json'));f=[x for x in (d if isinstance(d,list) else d['facts']) if x['key'] in('energy_lightning_flash','energy_month_of_food_2000_calories')];[print(x['key'],x.get('low_si'),x['display']) for x in f]"
# srcfix-2
U='https://api.eia.gov/v2/electricity/facility-fuel/data/?frequency=annual&data[0]=generation&facets[plantCode][]=154&facets[plantCode][]=8902&facets[fuel2002][]=ALL'
curl -sS -g -o /dev/null -w 'cited: %{http_code}\n' "$U"; curl -sS -g -o /dev/null -w 'with DEMO_KEY: %{http_code}\n' "$U&api_key=[redacted]"
python3 -I eia_check.py dl_eia/demo.json | tail -4
# srcfix-3
grep -o 'Fuel tank (gal.)[^}]*}' dl_toyota/toyota.html | grep -o '"value":"[^"]*"' | sort | uniq -c
