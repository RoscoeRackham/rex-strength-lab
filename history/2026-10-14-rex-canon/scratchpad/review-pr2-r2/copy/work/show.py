import json,sys,re
b=json.load(open(sys.argv[1]))
pat=re.compile(sys.argv[3],re.I) if len(sys.argv)>3 else None
for k,r in b.items():
  if k=='__errs' or not re.search(sys.argv[2],k):continue
  print('=====',k)
  for f in ['verdict','status','tiles','effort','happens','math']:
    x=r[f]; xs=x if isinstance(x,list) else [x]
    for s in xs:
      if s and (not pat or pat.search(s)): print(' ',f[:3].upper()+':',s)
