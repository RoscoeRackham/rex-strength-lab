import numpy as np, sys
R=np.load('../rex_fig.npy'); O=np.load('../ol_fig.npy')
M={'rex':R,'ol':O}[sys.argv[1]]
for y in range(int(sys.argv[2]),int(sys.argv[3]),int(sys.argv[4])):
    row=M[y].astype(int); d=np.diff(np.r_[0,row,0]); s=np.nonzero(d==1)[0]; e=np.nonzero(d==-1)[0]
    print(y,[(a,b-1,b-a) for a,b in zip(s,e) if b-a>2])
