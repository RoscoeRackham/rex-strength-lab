import json,difflib,re
a=json.load(open('off-main.json'));b=json.load(open('off-branch.json'))
print('errs',a['__errs'],b['__errs'])
for k in a:
  if k=='__errs':continue
  for f in ['verdict','status','tiles','effort','happens','math']:
    x=a[k][f];y=b[k][f]
    if x!=y:
      xs=x if isinstance(x,list) else [x]; ys=y if isinstance(y,list) else [y]
      d=[l for l in difflib.unified_diff(xs or [],ys or [],lineterm='',n=0) if not l.startswith(('---','+++','@@'))]
      print('==',k,f)
      for l in d: print('  ',l[:900])
