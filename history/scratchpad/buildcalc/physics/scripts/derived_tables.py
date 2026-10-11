"""Derived numbers used in the design note (pure arithmetic; no external data)."""
import json, math, sys
out = {}
# Siri two-compartment: 1/D = f/0.900 + (1-f)/1.100  -> %fat = 495/D - 450
out["siri_check"] = {"coef_a": round(100/(1/0.9-1/1.1)*1/1, 2), "coef_b": round(100*(1/1.1)/(1/0.9-1/1.1), 2)}
out["density_from_fat_siri"] = {f"{p}%": round(1/(p/100/0.9 + (1-p/100)/1.1), 4) for p in [3,5,8,10,15,20,25,30,40,50]}
# Brozek reference-body constants check: 457/D - 414.2 ; zero-fat density
out["brozek_zero_fat_density"] = round(457/414.2, 4)
out["schutte_zero_fat_density"] = round(4.374/3.928, 4)
# FFM density 1.089 (Modlesky weight trainers) vs 1.100 -> %fat bias at D=1.07
def pf(D, dffm, dfat=0.9):
    return 100*(1/D - 1/dffm)/(1/dfat - 1/dffm)
out["pctfat_at_D1.070"] = {"dffm_1.100": round(pf(1.07,1.1),2), "dffm_1.089": round(pf(1.07,1.089),2), "dffm_1.113": round(pf(1.07,1.113),2)}
# isoperimetric shape factor: area of ellipse (axis ratio r) / area of circle with same perimeter
def ell_perim(a,b):
    return math.pi*(3*(a+b)-math.sqrt((3*a+b)*(a+3*b)))
sf = {}
for r in [1.0,0.9,0.8,0.7,0.6,0.5,0.4]:
    a,b = 1.0, r
    P = ell_perim(a,b); A = math.pi*a*b
    sf[str(r)] = round(A/(P**2/(4*math.pi)),3)
out["ellipse_area_over_circle_area_same_perimeter"] = sf
# Kouri / Trexler height corrections -> implied FFM-height exponent at FFMI 25 and H 1.8
for name, slope in [("kouri_6.1", 6.1), ("kouri_abstract_6.3", 6.3), ("trexler_2017_2.943", 2.943)]:
    out[f"implied_FFM_height_exponent_{name}"] = round(2 + slope*1.8/25, 2)
# mass multipliers for a 1.80 m build moved to other heights under exponent p
out["mass_multiplier"] = {f"H={h}": {f"p={p}": round((h/1.8)**p, 3) for p in [2, 2.3, 2.5, 3]} for h in [1.6, 1.7, 1.9, 2.0, 2.2, 2.5]}
# girth multiplier = sqrt((W1/W0)/(H1/H0)) = (H1/H0)^((p-1)/2)
out["girth_multiplier_geometric_law"] = {f"H={h}": {f"p={p}": round((h/1.8)**((p-1)/2), 3) for p in [2, 2.3, 2.5, 3]} for h in [1.6, 1.7, 1.9, 2.0, 2.2, 2.5]}
json.dump(out, open(sys.argv[1], "w"), indent=1)
print(json.dumps(out, indent=1))
