import numpy as np, cv2, random, math
from PIL import Image, ImageFilter
from soft import W, H
def _grad(stops):
    y=np.linspace(0,1,H)[:,None]; out=np.zeros((H,1,3))
    for (p0,c0),(p1,c1) in zip(stops,stops[1:]):
        m=(y>=p0)&(y<=p1); t=np.clip((y-p0)/(p1-p0),0,1)
        out[m[:,0]]=(np.array(c0)+(np.array(c1)-np.array(c0))*t[m[:,0]][:,None])[:,0][:,None]
    return np.broadcast_to(out,(H,W,3)).copy()
def _grain(a,amt=5,seed=0):
    r=np.random.default_rng(seed); return a+r.normal(0,amt,a.shape)
def _blobs(a,items,blur):
    lay=np.zeros_like(a); al=np.zeros(a.shape[:2])
    for (x,y,rx,ry,c,o) in items:
        m=np.zeros(a.shape[:2],np.uint8); cv2.ellipse(m,(int(x),int(y)),(int(rx),int(ry)),0,0,360,255,-1)
        mm=m>0; lay[mm]=c; al[mm]=np.maximum(al[mm],o)
    pm=cv2.GaussianBlur(lay*al[...,None],(0,0),blur); al=cv2.GaussianBlur(al,(0,0),blur)
    col=pm/np.maximum(al,1e-4)[...,None]
    return a*(1-al[...,None])+col*al[...,None]
def _hill(a,ybase,amp,col,seed,blur=2,freq=2.0):
    r=random.Random(seed); xs=np.arange(W)
    yy=ybase+amp*(np.sin(xs/W*math.pi*freq+r.uniform(0,6))*0.6+np.sin(xs/W*math.pi*freq*2.3+r.uniform(0,6))*0.4)
    m=(np.arange(H)[:,None]>yy[None,:]).astype(np.float32)
    m=cv2.GaussianBlur(m,(0,0),blur)
    return a*(1-m[...,None])+np.array(col,float)*m[...,None]
def fin(a,blur=1.2,seed=0,grain=4):
    a=_grain(a,grain,seed); img=Image.fromarray(a.clip(0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(blur))
    return img
def meadow(seed=0):
    r=random.Random(seed)
    a=_grad([(0,(168,206,246)),(0.45,(226,236,250)),(1,(240,244,236))])
    a=_blobs(a,[(r.uniform(0,W),r.uniform(80,420),r.uniform(120,260),r.uniform(40,70),(255,255,255),0.85) for _ in range(7)],30)
    a=_hill(a,700,40,(178,206,196),seed,10)
    a=_hill(a,820,50,(150,196,140),seed+1,5)
    a=_hill(a,950,40,(124,182,108),seed+2,3)
    rr=np.random.default_rng(seed)
    items=[]
    for _ in range(900):
        y=rr.uniform(900,H); s=(y-880)/470
        c=[(255,190,214),(255,255,255),(255,232,140),(214,196,255)][rr.integers(0,4)]
        items.append((rr.uniform(0,W),y,3+9*s,2+6*s,c,0.95))
    a=_blobs(a,items,1.2)
    return fin(a,1.0,seed)
def night(seed=0):
    rr=np.random.default_rng(seed)
    a=_grad([(0,(26,30,70)),(0.6,(58,62,120)),(1,(96,86,150))])
    for _ in range(260):
        x,y=int(rr.uniform(0,W)),int(rr.uniform(0,850)); s=rr.uniform(0.6,2.2)
        cv2.circle(a,(x,y),int(s),(255,250,235),-1,cv2.LINE_AA)
    glow=np.zeros(a.shape[:2]); cv2.circle(glow,(170,600),60,1,-1); glow=cv2.GaussianBlur(glow,(0,0),40)*0.6
    a=a*(1-glow[...,None])+np.array((255,246,214))*glow[...,None]
    cv2.circle(a,(170,600),52,(255,248,224),-1,cv2.LINE_AA)
    a=_hill(a,960,50,(40,40,88),seed,4)
    a=_hill(a,1080,40,(28,28,64),seed+2,3)
    return fin(a,0.8,seed,3)
def rain(seed=0):
    rr=np.random.default_rng(seed)
    a=_grad([(0,(120,132,160)),(0.7,(160,170,192)),(1,(132,140,160))])
    a=_blobs(a,[(rr.uniform(0,W),rr.uniform(0,H),rr.uniform(20,60),0,(230,230,240),0.25) for _ in range(30)],8) if False else a
    items=[(rr.uniform(0,W),rr.uniform(0,H),r_:=rr.uniform(14,46),r_,(220,226,240),0.3) for _ in range(40)]
    a=_blobs(a,items,6)
    lay=np.zeros(a.shape[:2])
    for _ in range(700):
        x,y=rr.uniform(-100,W),rr.uniform(-100,H); L=rr.uniform(30,80)
        cv2.line(lay,(int(x),int(y)),(int(x+L*0.25),int(y+L)),1,1,cv2.LINE_AA)
    lay=cv2.GaussianBlur(lay,(0,0),0.6)*0.5
    a=a*(1-lay[...,None])+255*lay[...,None]
    return fin(a,0.6,seed,3)
def sunset(seed=0):
    a=_grad([(0,(255,196,170)),(0.35,(255,176,190)),(0.65,(206,182,240)),(1,(170,160,226))])
    glow=np.zeros(a.shape[:2]); cv2.circle(glow,(540,640),90,1,-1); glow=cv2.GaussianBlur(glow,(0,0),60)*0.7
    a=a*(1-glow[...,None])+np.array((255,236,200))*glow[...,None]
    a=_hill(a,820,45,(178,150,214),seed,6)
    a=_hill(a,960,35,(150,124,196),seed+1,4)
    a=_hill(a,1100,30,(126,104,176),seed+2,3)
    return fin(a,1.0,seed,3)
def dots(col=(255,236,242),dot=(255,214,226),seed=0):
    a=np.ones((H,W,3))*np.array(col,float)
    for y in range(0,H+60,90):
        for x in range(0 if (y//90)%2 else 45,W+60,90):
            cv2.circle(a,(x,y),9,dot,-1,cv2.LINE_AA)
    return fin(a,0.3,seed,2)
