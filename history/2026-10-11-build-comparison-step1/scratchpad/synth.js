const Fig=require('/home/user/rex-strength-lab/build-comparison/src/figure.js');
const M=require('/home/user/rex-strength-lab/build-comparison/src/measure.js');
const png=require('/home/user/rex-strength-lab/build-comparison/tools/png.js');
// A blocky figure with an exact volume: elliptic-section torso, ellipsoid head, round legs, tilted round arms.
function synth(H, f) {
  f = f || 1;
  const rect=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
  const crotch=0.47*H, shoulder=0.80*H, neckTop=0.87*H, headH=0.13*H;
  const a=0.30*H*f, b=0.16*H*f;           // torso width and depth
  const nw=0.07*H, nd=0.075*H;           // neck
  const hw=0.09*H, hd=0.11*H;            // head
  const r=0.05*H*f, legX=0.075*H;        // legs
  const aw=0.05*H*f, th=20*Math.PI/180, L=0.30*H; // arms
  const ax=a/2+0.035*H+aw/2/Math.cos(th), ay=shoulder-0.03*H;
  const arm=(s)=>{ const dx=s*Math.sin(th)*L, dy=Math.cos(th)*L, hwid=aw/2/Math.cos(th); return [[s*ax-hwid,ay],[s*ax+hwid,ay],[s*ax+hwid+dx,ay-dy],[s*ax-hwid+dx,ay-dy]]; };
  const front=[ {poly:rect(-a/2,crotch,a/2,shoulder)}, {poly:rect(-nw/2,shoulder,nw/2,neckTop+0.01*H)}, {poly:Fig.ellipse(0,H-headH/2,hw/2,headH/2,180)},
    {poly:rect(-legX-r,0,-legX+r,crotch+0.001)}, {poly:rect(legX-r,0,legX+r,crotch+0.001)}, {poly:arm(1)}, {poly:arm(-1)},
    {poly:rect(-a/2+0.001,shoulder-0.002,-ax+0.01,shoulder)}, {poly:rect(ax-0.01,shoulder-0.002,a/2-0.001,shoulder)} ].map(p=>({poly:p.poly,mark:'own'}));
  // bridge from torso to arm top so the arm hangs from the shoulder
  front.push({poly:rect(-ax-aw/2/Math.cos(th),ay,-a/2+0.001,shoulder),mark:'own'}); front.push({poly:rect(a/2-0.001,ay,ax+aw/2/Math.cos(th),shoulder),mark:'own'});
  const side=[ {poly:rect(-b/2,crotch,b/2,shoulder)}, {poly:rect(-nd/2,shoulder,nd/2,neckTop+0.01*H)}, {poly:Fig.ellipse(0,H-headH/2,hd/2,headH/2,180)}, {poly:rect(-r,0,r,crotch+0.001)} ].map(p=>({poly:p.poly,mark:'own'}));
  const bridgeV = 2*(ax+aw/2/Math.cos(th)-a/2)*(shoulder-ay)*b*Math.PI/4; // rough: the shoulder bridge, sliced with torso depth
  const V = Math.PI/4*a*b*(shoulder-crotch) + Math.PI/4*nw*nd*(neckTop+0.01*H-shoulder) + Math.PI/6*hw*hd*headH + 2*Math.PI*r*r*crotch + 2*Math.PI/4*aw*aw*L;
  return {front, side, V, levels:{shoulder:shoulder-0.01*H, chest:0.72*H, waist:0.6*H, crotch, knee:0.28*H}, girth:{chest:M.ellipsePerimeter(a,b), thigh:2*Math.PI*r, arm:Math.PI*aw}};
}
const H=1.8; const s=synth(H, +process.argv[2]||1);
const img=Fig.renderSheet({front:s.front, side:s.side}, H, process.argv[3]==='lines'?s.levels:null, {figurePx:2000});
png.write('/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/synth.png', img);
const r=M.measureSheet(img,{heightM:H, heightRef:'top', order:['front','side','back'], armK:1});
console.log('ok',r.ok, r.errors, r.warnings.slice(0,3), 'lines', r.guideLines, r.landmarkSource);
console.log('checks', r.checks.map(c=>(c.ok?'OK ':'XX ')+c.name).join('; '));
console.log('V tool', r.volume_m3.value.toFixed(5), 'analytic', s.V.toFixed(5), 'ratio', (r.volume_m3.value/s.V).toFixed(4), JSON.stringify(r.volume_m3.parts,(k,v)=>typeof v==='number'?+v.toFixed(5):v));
console.log('girths chest', r.girths.chest.value_m.toFixed(4), s.girth.chest.toFixed(4), 'thigh', r.girths.thigh.value_m.toFixed(4), s.girth.thigh.toFixed(4), 'arm', r.girths.arm_flexed.value_m.toFixed(4), s.girth.arm.toFixed(4));
console.log('rows', JSON.stringify(r.landmarks.front), 'arms', r.landmarks.arms.map(a=>a&&a.angleDeg.toFixed(1)));
