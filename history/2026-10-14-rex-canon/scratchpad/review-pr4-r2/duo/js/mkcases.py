import json, sys, math
tests = {
 'arm': {'duoAction':'arm'},
 'armKF0': {'duoAction':'arm','keepForm':False},
 'push': {'duoAction':'wrestle','wrestleMove':'push'},
 'shoveRex': {'duoAction':'wrestle','wrestleMove':'shove','wrestleWho':'rex'},
 'shoveOllie': {'duoAction':'wrestle','wrestleMove':'shove','wrestleWho':'ollie'},
 'shoveBoth': {'duoAction':'wrestle','wrestleMove':'shove','wrestleWho':'both'},
 'lift': {'duoAction':'wrestle','wrestleMove':'lift'},
 'throw': {'duoAction':'wrestle','wrestleMove':'throw'},
 'sprint': {'duoAction':'collide'},
 'sprintB': {'duoAction':'collide','colBounce':'bounce'},
 'sprintRex': {'duoAction':'collide','colWho':'rex'},
 'jump': {'duoAction':'collide','colSrc':'jump'},
 'stomp': {'duoAction':'collide','colSrc':'stomp'},
 'set': {'duoAction':'collide','colSrc':'set'},
 'cpush': {'duoAction':'collide','colMode':'push'},
 'cpushRex': {'duoAction':'collide','colMode':'push','colWho':'rex'},
 'catch': {'duoAction':'catch'},
 'toss': {'duoAction':'catch','cObj':'partner'},
 'fireball': {'duoAction':'catch','keepForm':False,'airAbsorb':0.5,'cStyle':'hard'},
}
mode = sys.argv[1]
powers = {'on': {}, 'off': {'ownRecoil': False}, 'alloff': {'airAbsorb':0,'keepForm':False,'unbreakable':False,'ownRecoil':False,'safePassenger':False,'noKnockback':False,'oNoKnockback':False}}
bolts = {'nn': {}, 'rb': {'anchor':'bolted'}, 'ob': {'oAnchor':'bolted'}, 'bb': {'anchor':'bolted','oAnchor':'bolted'}}
dials = {'d': {}, 'g9': {'logKg':9, 'oLogKg':9}, 'inf': {'inf':True}, 'g14': {'logKg':14,'oLogKg':14}}
cases=[]
pw = sys.argv[2].split(',')
ds = sys.argv[3].split(',')
ts = sys.argv[4].split(',') if len(sys.argv)>4 and sys.argv[4] else list(tests)
bs = sys.argv[5].split(',') if len(sys.argv)>5 else list(bolts)
for t in ts:
  for p in pw:
    for b in bs:
      for d in ds:
        st = {}
        for x in (tests[t], powers[p], bolts[b], dials[d]): st.update(x)
        if p=='alloff' and t=='fireball': st.update({'airAbsorb':0.5})
        cases.append({'id': '|'.join([t,p,b,d]), 'state': st, 'picks': ['allout']})
json.dump(cases, sys.stdout, indent=0)
