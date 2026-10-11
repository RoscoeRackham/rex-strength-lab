"""Shared geometry helpers for Method B (segment solids)."""
import numpy as np
from PIL import Image, ImageDraw
IMG='/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg'
H,W=853,1280
MASK=np.load('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/method_b/mask.npy')

# Ollie | Rex split polyline (x as function of y); pixels with x < split(y) belong to Ollie.
SPLIT=[(0,600),(180,600),(250,604),(270,600),(300,596),(330,590),(350,586),(370,581),(440,578),(500,580),(560,590),(640,602),(700,613),(853,613)]
def split_x(y):
    ys=[p[0] for p in SPLIT]; xs=[p[1] for p in SPLIT]
    return np.interp(y,ys,xs)
yy,xx=np.mgrid[0:H,0:W]
OLLIE=MASK&(xx<split_x(yy))
REX=MASK&(xx>=split_x(yy))

def poly_mask(poly):
    im=Image.new('L',(W,H),0); ImageDraw.Draw(im).polygon([tuple(p) for p in poly],fill=1)
    return np.asarray(im).astype(bool)

def bilinear(m,x,y):
    # nearest sample (mask is binary)
    xi=np.clip(np.round(x).astype(int),0,W-1); yi=np.clip(np.round(y).astype(int),0,H-1)
    inside=(x>=0)&(x<W)&(y>=0)&(y<H)
    return m[yi,xi]&inside

def axis_widths(m,p0,p1,step=1.0,half=200,shrink=0.0):
    """Perpendicular chord widths of binary mask m along axis p0->p1.
    Returns arrays s (px along axis) and w (px). shrink: px removed from each width (fur fringe)."""
    p0=np.array(p0,float); p1=np.array(p1,float)
    L=np.linalg.norm(p1-p0); u=(p1-p0)/L; n=np.array([-u[1],u[0]])
    s=np.arange(0,L+1e-9,step)
    t=np.arange(-half,half+1e-9,0.5)
    w=[]
    for si in s:
        c=p0+u*si
        X=c[0]+n[0]*t; Y=c[1]+n[1]*t
        w.append(bilinear(m,X,Y).sum()*0.5)
    w=np.maximum(np.array(w)-shrink*(np.array(w)>0),0)
    return s,w

def stack_volume(s,w,k):
    """Elliptic-section stack: sum of pi/4*w*(k*w) ds (trapezoid). k scalar or array."""
    a=np.pi/4*np.asarray(k)*w*w
    return float(np.trapezoid(a,s)) if hasattr(np,'trapezoid') else float(np.trapz(a,s))

def frustum_chain(lengths,diams,ratio):
    """Elliptic frustums: diam = one axis, ratio*diam = other axis."""
    V=0.0
    for L,(d1,d2) in zip(lengths,zip(diams[:-1],diams[1:])):
        V+=np.pi/4*ratio*L*(d1*d1+d1*d2+d2*d2)/3
    return V

def ellipsoid(a,b,c):
    """full axis lengths"""
    return np.pi/6*a*b*c
