import cv2, numpy as np
im=cv2.imread('/mnt/user-data/attachments/34250499-b3f7-514b-a5a3-f6c3e1952c2e/54e83140-image.png').astype(np.float32)
H,W=im.shape[:2]
boxes=[(895,465,950,503),(880,498,995,600),(560,266,665,368),(350,328,460,444),(262,412,370,524),(482,526,590,644),(772,616,880,734),(1082,610,1190,730),(618,440,886,604),(586,356,644,392),
 (0,0,335,152),(785,4,1292,88),(1298,8,1536,218),(1293,226,1536,388),(0,753,374,982),(1380,815,1536,962),(1350,730,1452,834),(1290,830,1390,940),(1214,890,1294,978),(1436,668,1536,754),(0,982,1536,1024)]
mask=np.zeros((H,W),bool)
for x0,y0,x1,y1 in boxes: mask[y0:y1,x0:x1]=True
B=8
FORCE={(618,440,886,604):(300,196),(0,0,335,152):(0,152)}
def fill(box, rng):
    x0,y0,x1,y1=box; w,h=x1-x0,y1-y0
    ox0,oy0,ox1,oy1=max(0,x0-B),max(0,y0-B),min(W,x1+B),min(H,y1+B)
    ring=np.zeros((oy1-oy0,ox1-ox0),bool); ring[:,:]=True; ring[y0-oy0:y1-oy0,x0-ox0:x1-ox0]=False
    valid=ring & ~mask[oy0:oy1,ox0:ox1]
    tgt=im[oy0:oy1,ox0:ox1]
    best=None
    for dy in range(-rng,rng+1,6):
        for dx in range(-rng,rng+1,6):
            sx0,sy0=ox0+dx,oy0+dy; sx1,sy1=ox1+dx,oy1+dy
            if sx0<0 or sy0<0 or sx1>W or sy1>H: continue
            if abs(dx)<w*0.6 and abs(dy)<h*0.6: continue
            if mask[sy0:sy1,sx0:sx1].any(): continue
            src=im[sy0:sy1,sx0:sx1]
            d=((src-tgt)**2).sum(axis=2)[valid].mean() if valid.any() else 0
            if best is None or d<best[0]: best=(d,dx,dy)
    if box in FORCE: best=(0,)+FORCE[box]
    if best is None: print('no source',box); return
    _,dx,dy=best
    # feathered paste over box+border
    src=im[oy0+dy:oy1+dy,ox0+dx:ox1+dx].copy()
    a=np.zeros((oy1-oy0,ox1-ox0),np.float32); a[y0-oy0:y1-oy0,x0-ox0:x1-ox0]=1
    a=cv2.GaussianBlur(a,(0,0),3); a=np.maximum(a,(np.pad(np.ones((y1-y0,x1-x0)),((y0-oy0,oy1-y1),(x0-ox0,ox1-x1)))))
    im[oy0:oy1,ox0:ox1]=src*a[...,None]+im[oy0:oy1,ox0:ox1]*(1-a[...,None])
    mask[y0:y1,x0:x1]=False
    print(box,'from',dx,dy,round(best[0]))
for b in boxes: fill(b, 420 if (b[2]-b[0])*(b[3]-b[1])>40000 else 240)
cv2.imwrite('bg_patch.png',np.clip(im,0,255).astype(np.uint8))
