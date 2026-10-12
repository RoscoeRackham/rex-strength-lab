import numpy as np
N = 2**20; Ttot = 400.0
t = np.arange(N)*Ttot/N
w = 2*np.pi*np.fft.rfftfreq(N, Ttot/N)
hann = np.where(t < 1, np.sin(np.pi*t)**2, 0.0)
def pk(p, z=0):
    return np.max(np.abs(np.fft.irfft(np.fft.rfft(hann)*(1j*w)**p*np.exp(-w*z), N)))
for z in [0, 0.1, 0.5]:
    print('far zeta', z, 'max|a|/max|v| in units of 2pi/T:', pk(2.5,z)/pk(1.5,z)/(2*np.pi))
print('near: max|a|/max|v| /(2pi/T):', pk(2)/pk(1)/(2*np.pi))
