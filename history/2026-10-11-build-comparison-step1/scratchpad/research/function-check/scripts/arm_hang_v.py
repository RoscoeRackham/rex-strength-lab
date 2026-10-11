# Front-view rest abduction angle of a straight arm vs a width factor k (ANSUR II male medians, metres).
# Skeleton fixed: shoulder joint centre (GH) and hip joint centres do not move; outline half-widths scale by k
# about their own axis (torso about the midline, arm about the arm axis, thighs about the leg axes).
import math
H=1.755
xGH=0.415/2-0.02; yGH=1.439-0.04           # GH ~2 cm medial, ~4 cm below the acromion (estimate)
U=0.31; W=0.265; Hh=0.193                    # GH-elbow, elbow-wrist, hand length (estimates from ANSUR medians)
torso=[(1.328,0.289/2),(1.289,0.289/2),(1.055,0.325/2),(0.899,0.344/2),(0.845,0.344/2)]  # (height, half-width)
yAx=1.328; yCrotch=0.845; yKnee=0.487+0.04; HJC=0.087
def torso_hw(y,k):
    if y>torso[0][0] or y<yCrotch: return None
    for (y1,w1),(y2,w2) in zip(torso,torso[1:]):
        if y2<=y<=y1: return k*(w2+(w1-w2)*(y-y2)/(y1-y2))
def thigh_outer(y,k):
    if not (yKnee<=y<yCrotch): return None
    t=(yCrotch-y)/(yCrotch-yKnee); hw=0.624/(2*math.pi)*(1-t)+0.408/(2*math.pi)*t
    return HJC+k*hw
def arm_hw(s,k):   # s = distance from GH along the arm
    pts=[(0,0.06),(U*0.5,0.357/(2*math.pi)*0.93),(U,0.31/(2*math.pi)),(U+W,0.175/(2*math.pi)),(U+W+0.01,0.016),(U+W+Hh,0.012)]
    for (s1,w1),(s2,w2) in zip(pts,pts[1:]):
        if s1<=s<=s2: return k*(w1+(w2-w1)*(s-s1)/(s2-s1))
    return 0
def clears(theta,k):
    th=math.radians(theta)
    s=0.0
    while s<=U+W+Hh:
        x=xGH+s*math.sin(th); y=yGH-s*math.cos(th)
        inner=x-arm_hw(s,k)*math.cos(th)
        if y<=yAx:
            lim=torso_hw(y,k)
            if lim is None: lim=thigh_outer(y,k)
            if lim is not None and inner<lim: return False
        s+=0.005
    return True
def run(label):
  print(label)
  for k in (1.0,1.1,1.2,1.3,1.4,1.5,1.6,1.8,2.0,2.5,3.0):
      th=0.0
      while th<90 and not clears(th,k): th+=0.25
      print(f"  k={k:.1f}: rest abduction ~{th:.1f} deg")
import sys
YTOP=yAx
SMIN=0.0
def clears2(theta,k):
    th=math.radians(theta); s=SMIN
    while s<=U+W+Hh:
        x=xGH+s*math.sin(th); y=yGH-s*math.cos(th)
        inner=x-arm_hw(s,k)*math.cos(th)
        if y<=YTOP:
            lim=torso_hw(y,k)
            if lim is None: lim=thigh_outer(y,k)
            if lim is not None and inner<lim: return False
        s+=0.005
    return True
clears=clears2
YTOP=1.328; SMIN=0; run("armpit (axilla height) and below")
YTOP=1.289; SMIN=0; run("below chest height 1.289")
YTOP=1.328; SMIN=U; run("elbow and below (s>=U)")
