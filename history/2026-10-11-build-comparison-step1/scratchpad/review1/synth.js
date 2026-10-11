const S=__dirname+'/snap/';
const Fig=require(S+'build-comparison/src/figure.js');
const M=require(S+'build-comparison/src/measure.js');
// Smooth synthetic figure, H=1.8 m. Elliptic sections everywhere; arms tilted cylinders.
function build(H, opt){
  opt=opt||{};
  const P=(poly)=>({poly,mark:'own'});
  const crotch=0.47*H, shoulder=0.80*H, neckTop=0.87*H, headH=0.13*H;
  // torso: half-width w(y) and half-depth d(y) between crotch and shoulder (smooth)
  const tw=(y)=>{const t=(y-crotch)/(shoulder-crotch); return H*(0.095+0.03*Math.sin(Math.PI*t)+0.02*t*t);};
  const td=(y)=>{const t=(y-crotch)/(shoulder-crotch); return H*(0.07+0.012*Math.cos(2*Math.PI*t));};
  const N=200, prof=[], sprof=[];
  for(let i=0;i<=N;i++){const y=crotch+(shoulder-crotch)*i/N; prof.push([tw(y),y]); sprof.push([td(y),y]);}
  const sym=(pr)=>pr.map(p=>[p[0],p[1]]).concat(pr.slice().reverse().map(p=>[-p[0],p[1]]));
  const torsoF=sym(prof), torsoS=sym(sprof);
  // neck: elliptic cylinder
  const nw=0.035*H, nd=0.04*H;
  const rect=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
  // head ellipsoid
  const hw=0.045*H, hd=0.055*H;
  // legs: truncated cones, radius r0 at crotch to r1 at ground
  const legX=0.075*H, r0=0.06*H*0.95, r1=0.028*H;
  const leg=(s)=>[[s*legX-r1,0],[s*legX+r1,0],[s*legX+r0,crotch+0.002],[s*legX-r0,crotch+0.002]];
  const legS=[[-r1,0],[r1,0],[r0,crotch+0.002],[-r0,crotch+0.002]];
  // arms: tilted cylinders (radius ra, length L, angle th) hanging from a shoulder block
  const th=(opt.armDeg||30)*Math.PI/180, ra=0.025*H, L=0.32*H;
  const hwid=ra/Math.cos(th), ax=tw(shoulder)+0.03*H+hwid, ay=shoulder-0.035*H;
  const arm=(s)=>[[s*ax-hwid,ay],[s*ax+hwid,ay],[s*ax+hwid+s*Math.sin(th)*L,ay-Math.cos(th)*L],[s*ax-hwid+s*Math.sin(th)*L,ay-Math.cos(th)*L]];
  const bridgeF=(s)=>rect(Math.min(s*(ax+hwid), s*(tw(shoulder)-0.003)), ay, Math.max(s*(ax+hwid), s*(tw(shoulder)-0.003)), shoulder);
  const front=[P(torsoF),P(rect(-nw,shoulder-0.001,nw,neckTop)),P(Fig.ellipse(0,H-headH/2,hw,headH/2,720)),P(leg(1)),P(leg(-1)),P(arm(1)),P(arm(-1)),P(bridgeF(1)),P(bridgeF(-1))];
  const side=[P(torsoS),P(rect(-nd,shoulder-0.001,nd,neckTop)),P(Fig.ellipse(0,H-headH/2,hd,headH/2,720)),P(legS)];
  // exact volume
  let V=0; const n=20000;
  for(let i=0;i<n;i++){const y=crotch+(shoulder-crotch)*(i+0.5)/n; V+=Math.PI*tw(y)*td(y)*(shoulder-crotch)/n;}
  V+=Math.PI*nw*nd*(neckTop-shoulder);
  V+=4/3*Math.PI*hw*hd*(headH/2);
  V+=2*Math.PI*crotch/3*(r0*r0+r0*r1+r1*r1);
  V+=2*Math.PI*ra*ra*L;
  // bridge: block between arm top and torso at shoulder: front width x torso depth? In 3D the bridge front region is sliced with the torso run at those rows -> it is part of the torso run; its depth = td at those rows.
  let Vb=0; for(let i=0;i<200;i++){const y=ay+(shoulder-ay)*(i+0.5)/200; const W=2*(ax+hwid); Vb+=Math.PI/4*W*2*td(y)*(shoulder-ay)/200 - Math.PI*tw(y)*td(y)*(shoulder-ay)/200;}
  // arm part above ay is not in the arm; in the bridge rows, front run = full width (torso+bridges+arm tops) x torso depth
  V+=Vb;
  const chestRow=0.7351; // tool picks chest at 0.7351 of height
  const yc=chestRow*H, ywaist=null;
  return {front,side,V,H,tw,td,crotch,shoulder,legX,r0,r1,ra,ax,hwid,ay,th,L};
}
function run(H, px, armDeg){
  const s=build(H,{armDeg});
  const img=Fig.renderSheet({front:s.front,side:s.side},H,null,{figurePx:px});
  const r=M.measureSheet(img,{heightM:H,heightRef:'top',armK:1,shape:false,density:1000,bodyFatPct:0});
  const yc=r.girths.chest.row; // image row
  const k=img.k, g=img.ground;
  const yChest=(g-r.girths.chest.row-0.5)/k, yWaist=(g-r.girths.waist.row-0.5)/k, yThigh=(g-r.girths.thigh.row-0.5)/k, yCalf=(g-r.girths.calf.row-0.5)/k;
  const ell=(a,b)=>M.ellipsePerimeter(a,b);
  const trueChest=ell(2*s.tw(yChest),2*s.td(yChest)), trueWaist=ell(2*s.tw(yWaist),2*s.td(yWaist));
  const rAt=(y)=>s.r1+(s.r0-s.r1)*y/s.crotch;
  console.log('H',H,'px',px,'armDeg',armDeg,'ok',r.ok,r.errors.join(';'),
    '\n  volume',r.volume_m3.value.toFixed(5),'exact',s.V.toFixed(5),'ratio',(r.volume_m3.value/s.V).toFixed(4), 'parts',JSON.stringify(Object.fromEntries(Object.entries(r.volume_m3.parts).map(([a,b])=>[a,+b.toFixed(5)]))),
    '\n  chest',(r.girths.chest.value_m/trueChest).toFixed(4),'waist',(r.girths.waist.value_m/trueWaist).toFixed(4),'thigh',(r.girths.thigh.value_m/(2*Math.PI*rAt(yThigh))).toFixed(4),'calf',(r.girths.calf.value_m/(2*Math.PI*rAt(yCalf))).toFixed(4),'arm',(r.girths.arm_flexed.value_m/(2*Math.PI*s.ra)).toFixed(4),'fore',(r.girths.forearm.value_m/(2*Math.PI*s.ra)).toFixed(4),
    '\n  arm angle',r.lengths.arm_angle_deg&&r.lengths.arm_angle_deg.toFixed(2),'warnings',r.warnings.length);
}
run(1.8,2000,30); run(1.8,2000,40); run(1.8,800,30); run(3.0,2000,30);
module.exports={build};
