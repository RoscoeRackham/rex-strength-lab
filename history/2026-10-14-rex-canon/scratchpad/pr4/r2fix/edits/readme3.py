p='/home/user/rex-strength-lab/rex-strength-lab/README.md'; s=open(p,encoding='utf-8').read()
def rep(old,new,cnt=1):
    global s
    assert s.count(old)==cnt, (s.count(old), old[:100])
    s=s.replace(old,new)
rep("""  - Collide's steady push follows the one driven back as the shoving match follows a shove-off: the pusher's push less his hold over the shove's stroke (2.44 m, an estimate), then his slide (review round 1). The pusher pushes from where he stands; the lab doesn't have him walk after the one he drives back.""",
"""  - Collide's steady push follows the one driven back as the shoving match follows a shove-off: the pusher's push less his hold over the shove's stroke (2.44 m, an estimate), then his slide (review round 1). The pusher pushes from where he stands; the lab doesn't have him walk after the one he drives back. With real muscle that drive, like the shoving match's, uses the static push, so its speeds are an upper bound (a real push falls as the hands speed up; review round 2).
  - The effort search judges where the one pushed ends up in the shoving match, the steady push and Collide's charge (his travel during the push or the carry, plus his slide; review round 2). The Shove tab (one shove, and Both at once) still judges only the slide after the stroke, as before this pull request, so its courtesy ceilings sit a little high: the one shoved also moves up to the stroke (2.44 m) during the push.""")
rep("""  - Arm wrestling's pad loads come from torques about each elbow with rigid forearms (the forearm and hand 2.2% of body mass, centred 0.55 of the way to the grip; estimates): the power-off pad load, and with the winner's power on the loser's pad (review round 1).""",
"""  - Arm wrestling's pad loads come from torques about each elbow with rigid forearms (the forearm and hand 2.2% of body mass, centred 0.55 of the way to the grip; estimates): the power-off pad load, and with the winner's power on the loser's pad (review round 1) and, standing, the same force at the loser's elbow, which his feet or his bolts carry (review round 2). It is largest as the pin starts; the lab takes that peak for the whole pin.""")
rep("""and, standing in Arm wrestle, against the press that reaches him (the other's in a stalemate, the loser's in a pin).""",
"""and, standing in Arm wrestle, against what reaches him (the other's press in a stalemate; in a pin, the force at the loser's elbow: review round 2).""")
open(p,'w',encoding='utf-8').write(s)
