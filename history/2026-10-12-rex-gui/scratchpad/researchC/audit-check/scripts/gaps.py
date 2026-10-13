import math
rungs=[('pitch',162.5),('corolla',5.171e5),('grenade',9.25e5),('MOAB',4.6024e10),('Hiroshima',6.276e13),('Bravo',6.276e16),('Tsar',2.092e17),('Krakatoa',5.23e17),('Chicxulub',5e23),('Sun-second',3.828e26),('Earth binding',2.489e32)]
# strict rule: multiple of nearest rung below <=10x
print("Strict (multiple of rung below <=10x): uncovered ranges")
for (a,x),(b,y) in zip(rungs,rungs[1:]):
    if y/x>10: print("  %s %.3g -> %s %.3g : uncovered %.3g to %.3g J (%.2g decades)"%(a,x,b,y,10*x,y,math.log10(y/(10*x))))
print("Lenient (<=10x of rung below OR >=10%% of rung above): uncovered")
for (a,x),(b,y) in zip(rungs,rungs[1:]):
    if y/x>100: print("  %s->%s : uncovered %.3g to %.3g J"%(a,b,10*x,0.1*y))
print("below bottom: 1 J to %.3g J (%.2g decades)"%(rungs[0][1],math.log10(rungs[0][1])))
print("above top: %.3g J to 1e44 J (%.2g decades)"%(rungs[-1][1],44-math.log10(rungs[-1][1])))
