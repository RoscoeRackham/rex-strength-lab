import json,subprocess,urllib.parse
dois=['10.1086/307521','10.1063/1.1291734','10.1093/mnras/stac432','10.1038/nature03525','10.1038/nature03519','10.1111/j.1745-3933.2008.00453.x','10.1111/j.1365-2966.2011.18872.x','10.3847/1538-4357/ab4a11','10.1142/S0217751X05029630','10.1038/s41586-020-03059-w','10.1146/annurev-nucl-102711-094901','10.1038/27155','10.1103/PhysRevLett.116.061102','10.1146/annurev-astro-081817-051935','10.3847/0004-6256/152/2/41','10.1016/0031-9201(81)90046-7']
for d in dois:
    out=subprocess.run(['curl','-sS','--max-time','30','https://api.crossref.org/works/'+urllib.parse.quote(d,safe='/')],capture_output=True,text=True).stdout
    try:
        m=json.loads(out)['message']
        print(d,'|',(m.get('title') or [''])[0][:90],'|',(m.get('container-title') or [''])[0][:40],m.get('volume'),m.get('page'),m.get('issued',{}).get('date-parts'),[a.get('family') for a in m.get('author',[])][:3])
    except Exception as e: print(d,'ERR',out[:100])
