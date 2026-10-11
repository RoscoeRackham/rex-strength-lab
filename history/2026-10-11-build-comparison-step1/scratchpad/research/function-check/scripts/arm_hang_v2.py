exec(open('arm_hang_v.py').read().split('YTOP=1.328; SMIN=0; run')[0])
YTOP=yGH-U; SMIN=0; run("y below elbow height at hang (yGH-U=%.3f)"%(yGH-U))
YTOP=1.05; SMIN=0; run("y below 1.05 (approx elbow height)")
