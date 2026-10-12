import numpy as np
from scipy.optimize import brentq
# Poisson solid nu = 1/4, mu = 1, rho = 1 -> cs = 1, ks = omega
nu = 0.25
ks = 1.0
kp = ks/np.sqrt(3.0)
F = lambda k: (2*k*k - ks*ks)**2 - 4*k*k*np.sqrt(k*k-kp*kp)*np.sqrt(k*k-ks*ks)
kR = brentq(F, ks*1.0001, ks*1.5)
print('cR/cs', ks/kR)
h = 1e-7
Fp = (F(kR+h)-F(kR-h))/(2*h)
aR = np.sqrt(kR*kR-kp*kp)
# u_z = (P/(2 pi mu)) * Int ks^2 alpha k J0(kr)/F(k) dk ; Rayleigh residue -> (P/(2 pi mu)) * pi * ks^2 aR kR/|F'| * |H0(kR r)|
C = 0.5*ks*ks*aR*kR/abs(Fp)   # |u| = (P/mu) * C * sqrt(2/(pi kR r))
# so |u| = P/mu * C*sqrt(2/(pi kR)) / sqrt(r) ; with ks=omega/cs: C scales as ks, sqrt(1/kR) as ks^-0.5
coef_u = C*np.sqrt(2/(np.pi*kR))   # |u| = coef_u * P * ks^0.5 / (mu sqrt r)  (ks=1 here)
# velocity amplitude = omega |u| = coef_u * P * omega * (omega/cs)^0.5 / (rho cs^2 sqrt r) = coef_u * P omega^1.5 / (rho cs^2.5 sqrt r)
print('far-field velocity coefficient', coef_u)
# static check of the near field: Boussinesq w = (1-nu) P / (2 pi mu r)
