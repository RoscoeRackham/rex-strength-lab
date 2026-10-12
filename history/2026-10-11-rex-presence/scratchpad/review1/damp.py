import numpy as np
N = 2**20; Ttot = 400.0
t = np.arange(N)*Ttot/N
w = 2*np.pi*np.fft.rfftfreq(N, Ttot/N)
def peak(f, power, zeta):
    Fw = np.fft.rfft(f)
    return np.max(np.abs(np.fft.irfft(Fw*(1j*w)**power*np.exp(-w*zeta), N)))
hann = np.where(t < 1, np.sin(np.pi*t)**2, 0.0)
ramp = np.where(t < 1, 0.5*(1-np.cos(np.pi*t)), 1.0) * np.where(t < Ttot*0.7, 1.0, 0.5*(1+np.cos(np.pi*np.clip((t-Ttot*0.7)/(Ttot*0.25),0,1))))
h0 = peak(hann,1.5,0); r0 = peak(ramp,1.5,0)
for z in [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10]:
    Dh = peak(hann,1.5,z)/h0; Dr = peak(ramp,1.5,z)/r0
    fh = (1+(z/0.224)**1.4)**(-2.5/1.4); fr = (1+(z/0.195)**2.05)**(-1.5/2.05)
    print(f'zeta {z:5}: Hann exact {Dh:.4f} fit {fh:.4f} ({fh/Dh:.2f}x) | ramp exact {Dr:.4f} fit {fr:.4f} ({fr/Dr:.2f}x)')
