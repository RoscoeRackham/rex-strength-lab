import re,sys
s=open(sys.argv[1],encoding='utf-8',errors='replace').read()
# find positions of fuel tank and curb weight entries, and nearest preceding model code
for lab in ['Fuel tank (gal.)','Curb Weight (lb.)','Curb weight (lb.)']:
    for m in re.finditer(re.escape(lab)+r'":\{[^}]*?"value":"([^"]*)"', s):
        pre=s[max(0,m.start()-200000):m.start()]
        codes=re.findall(r'"(?:modelCode|code|modelNumber|seriesCode|trimCode)":"(\w+)"', pre)
        codes2=re.findall(r'"(18\d\d)"', pre)
        print(lab, m.group(1), 'last code keys:', codes[-3:] if codes else None, 'last 18xx:', codes2[-2:] if codes2 else None)
