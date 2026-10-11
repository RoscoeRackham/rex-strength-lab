# Planar reach check: can any point of the hand get as close to the shoulder joint (GH) as the mouth is?
# Shoulder is free (any orientation), so only the GH-to-hand-point distance matters.
import math
def rmin(phi_deg, U, W, Hh, wrist_flex_max_deg):
    # elbow at origin, GH at (U,0); forearm at interior angle alpha = 180-phi from the elbow->GH direction
    a = math.radians(180 - phi_deg)
    wx, wy = W*math.cos(a), W*math.sin(a)
    best = 1e9
    for bdeg in range(0, int(wrist_flex_max_deg)+1):
        b = math.radians(bdeg)
        d = a - b                     # flexing the wrist turns the hand toward the inside of the angle (palm side)
        for i in range(0, 101):
            s = Hh*i/100
            px, py = wx + s*math.cos(d), wy + s*math.sin(d)
            best = min(best, math.hypot(px-U, py))
    # also forearm points (wrist end only matters)
    return best
def phi_needed(dmouth, U, W, Hh, wf):
    lo, hi = 60.0, 160.0
    # rmin decreases as phi increases
    for _ in range(60):
        mid = (lo+hi)/2
        if rmin(mid, U, W, Hh, wf) > dmouth: lo = mid
        else: hi = mid
    return hi
# ANSUR II male medians (m): biacromial 0.415, acromial ht 1.439, stature 1.755, tragion-top 0.131, menton-sellion 0.123
# acromion-radiale 0.335, radiale-stylion 0.267, hand length 0.193
U0, W0, H0 = 0.31, 0.265, 0.193
for label, dx, dy, dz in [("mouth, base case", 0.1875, 0.173, 0.11), ("mouth, chin forward 3 cm", 0.1875, 0.173, 0.14),
                           ("mouth, GH 2 cm lower/narrower", 0.1675, 0.193, 0.11), ("same-side cheek", 0.1875-0.06, 0.18, 0.08)]:
    d = math.sqrt(dx*dx+dy*dy+dz*dz)
    print(f"{label:30s} d={d:.3f} m  phi needed: wrist neutral {phi_needed(d,U0,W0,H0,0):.0f}, wrist flexed up to 80 deg {phi_needed(d,U0,W0,H0,80):.0f}")
print("sensitivity to upper-arm length U (base mouth):")
d=math.sqrt(0.1875**2+0.173**2+0.11**2)
for U in (0.29,0.31,0.33):
    print(f"  U={U}: neutral {phi_needed(d,U,W0,H0,0):.0f}, flexed {phi_needed(d,U,W0,H0,80):.0f}")
