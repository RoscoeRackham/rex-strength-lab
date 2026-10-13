import re,sys
s=open(sys.argv[1],encoding='utf-8',errors='replace').read()
# find each occurrence of Fuel tank and Curb Weight; look back for nearest model code
for lab in ['Fuel tank (gal.)','Curb Weight (lb.)']:
    for m in re.finditer(re.escape(lab)+r'":\{[^}]*?"value":"([^"]*)"', s):
        start=m.start()
        back=s[max(0,start-200000):start]
        codes=re.findall(r'"(?:modelCode|code|seriesCode|modelNumber|model_code)"\s*:\s*"([^"]+)"', back)
        grades=re.findall(r'"(?:grade|gradeName|trim|title)"\s*:\s*"([^"]{1,40})"', back)
        print(lab, m.group(1), 'pos', start, 'lastcodes', codes[-3:], 'lastgrades', grades[-2:])
