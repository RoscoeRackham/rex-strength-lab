import sys,re
import xml.etree.ElementTree as ET
t=ET.parse(sys.argv[1]).getroot()
def txt(e): return ''.join(e.itertext())
body=t.find('.//body')
out=[]
for el in t.iter():
    if el.tag in ('title',):
        out.append('\n## '+txt(el).strip())
    elif el.tag=='p':
        out.append(re.sub(r'\s+',' ',txt(el)).strip())
    elif el.tag=='table-wrap':
        out.append('\n[TABLE] '+re.sub(r'\s+',' ',txt(el.find('caption')) if el.find('caption') is not None else ''))
        for tr in el.iter('tr'):
            out.append(' | '.join(re.sub(r'\s+',' ',txt(c)).strip() for c in tr))
print('\n'.join(out))
