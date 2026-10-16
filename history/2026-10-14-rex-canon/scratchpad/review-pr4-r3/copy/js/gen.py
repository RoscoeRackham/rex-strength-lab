import json, sys
views = {
 'arm': {'duoAction':'arm'},
 'arm-kf': {'duoAction':'arm','keepForm':False},
 'push': {'duoAction':'wrestle','wrestleMove':'push'},
 'shoveR': {'duoAction':'wrestle','wrestleMove':'shove','wrestleWho':'rex'},
 'shoveB': {'duoAction':'wrestle','wrestleMove':'shove','wrestleWho':'both'},
 'lift': {'duoAction':'wrestle','wrestleMove':'lift','wrestleWho':'rex'},
 'throw': {'duoAction':'wrestle','wrestleMove':'throw','wrestleWho':'rex'},
 'catch': {'duoAction':'catch'},
 'toss': {'duoAction':'catch','cObj':'partner'},
 'col': {'duoAction':'collide'},
 'colB': {'duoAction':'collide','colBounce':'bounce'},
 'colJ': {'duoAction':'collide','colSrc':'jump'},
 'colS': {'duoAction':'collide','colSrc':'stomp'},
 'colSet': {'duoAction':'collide','colSrc':'set'},
 'colP': {'duoAction':'collide','colMode':'push'},
 'colI': {'duoAction':'collide','colImm':True},
}
variants = {
 'def': {},
 'off': {'ownRecoil':False},
 'rb': {'anchor':'bolted'},
 'ob': {'oAnchor':'bolted'},
 'bb': {'anchor':'bolted','oAnchor':'bolted'},
 'k9': {'logKg':9},
 'inf': {'inf':True},
 'pwoff': {'airAbsorb':0,'keepForm':False,'unbreakable':False,'ownRecoil':False,'safePassenger':False,'noKnockback':False,'oNoKnockback':False},
}
sel = sys.argv[1] if len(sys.argv) > 1 else None
cases = []
for vk, vs in views.items():
    for wk, ws in variants.items():
        for pick in [None, 'allout']:
            st = {'duoOpen': True}; st.update(vs); st.update(ws)
            if wk == 'pwoff' and 'keepForm' in vs: pass
            cid = vk + '.' + wk + '.' + (pick or 'least')
            c = {'id': cid, 'state': st}
            if pick: c['pick'] = pick
            cases.append(c)
json.dump(cases, open(sys.argv[2] if len(sys.argv) > 2 else 'matrix.json', 'w'))
print(len(cases))
