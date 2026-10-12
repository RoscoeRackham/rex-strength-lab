import numpy as np
N = 2**20; Ttot = 400.0
t = np.arange(N)*Ttot/N
def peak(f, power):
    Fw = np.fft.rfft(f)
    w = 2*np.pi*np.fft.rfftfreq(N, Ttot/N)
    Hw = (1j*w)**power
    return np.max(np.abs(np.fft.irfft(Fw*Hw, N)))
T = 1.0
hann = np.where(t < T, np.sin(np.pi*t/T)**2, 0.0)
p15 = peak(hann, 1.5)
print('Hann: max |D^1.5 F| =', p15, ' -> far coef =', 0.07634*p15, '(code 0.620)')
# near field: max dF/dt
print('Hann max dF/dt', peak(hann,1.0), '-> near coef (1-nu)/(2pi) * that =', 0.75/(2*np.pi)*peak(hann,1.0), '(code 0.375)')
# ramp: half-cosine rise over tau then hold
tau = 1.0
ramp = np.where(t < tau, 0.5*(1-np.cos(np.pi*t/tau)), 1.0)
# need to taper at end to avoid FFT wrap: subtract a slow ramp down at end region far away
ramp = ramp * np.where(t < Ttot*0.7, 1.0, 0.5*(1+np.cos(np.pi*np.clip((t-Ttot*0.7)/(Ttot*0.25),0,1))))
print('Ramp: max |D^1.5 F| near start =', p := peak(ramp,1.5), '-> far coef', 0.07634*p, '(code 0.181)')
print('Ramp max dF/dt', peak(ramp,1.0), '-> near coef', 0.75/(2*np.pi)*peak(ramp,1.0), '(code 0.1875)')
