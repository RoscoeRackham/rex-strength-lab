const root='/home/user/rex-strength-lab/';
const BC=require(root+'build-calculator/src/calc.js'), data=require(root+'build-calculator/data/builds.json');
const Fig=require(root+'build-comparison/src/figure.js'), T=require(root+'build-comparison/data/outline.json'), DUO=require(root+'build-comparison/data/duo-outlines.json');
const M=BC.create(data);
const ids=(process.argv[2]||'ansur2_m_p5,ansur2_m_p50,ansur2_m_p95,steve_reeves_1947,ronnie_coleman,eddie_hall,thor,hulk_savage,darkseid').split(',');
const view=process.argv[3]||'front';
const figs=ids.map(id=>{ const r=M.compute({buildId:id}); const g={},marks={}; for(const s of BC.SITES){g[s]=r.girths[s].value; marks[s]=r.girths[s].kind==='own'?'own':'template';}
  return {id, f:Fig.human(T, r.height.value, g, marks, {buttockFit: BC.FRUSTUM.M.buttock})}; });
figs.push({id:'rex', f:Fig.traced(DUO.characters.rex, view, 2.923)}); figs.push({id:'ollie', f:Fig.traced(DUO.characters.ollie, view, 2.91)});
const Hd=300, gap=24; let x=20; let body='';
const dash={own:'',template:'7 5',art:'1.5 3',average:'',tail:'4 4'};
for(const {id,f} of figs){ const parts=(view==='front'?f.front:f.side)||f.parts; const H=f.skullH||f.H; const k=Hd/H; const b=Fig.bounds(parts); const ox=x-b[0]*k, oy=360;
  let strokes='',fills='';
  for(const p of parts){ const d=Fig.pathData(p.poly,k,ox,oy);
    const edges=p.edges||[{pts:p.poly.concat([p.poly[0]]),mark:p.mark}];
    for(const e of edges){ if(e.mark==='average') continue; const pd=e.pts.map((q,i)=>(i?'L':'M')+(ox+q[0]*k).toFixed(1)+' '+(oy-q[1]*k).toFixed(1)).join(''); strokes+=`<path d="${pd}" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round" stroke-dasharray="${dash[e.mark]}"/>`; }
    fills+=`<path d="${d}" fill="${p.mark==='tail'?'#d8c8b8':'#8a5a40'}"/>`; }
  body+=strokes+fills+`<text x="${ox}" y="385" font-size="11" text-anchor="middle">${id}</text>`; x+= (b[2]-b[0])*k+gap; }
body+=`<line x1="0" x2="${x}" y1="60" y2="60" stroke="red" stroke-width="0.5"/>`;
const out=process.argv[4]||'/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/fig/p';
require('fs').writeFileSync(out+'.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="${x}" height="400" style="background:#eee">${body}</svg>`);
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'}); const p=await b.newPage({viewport:{width:Math.ceil(x),height:400}}); await p.goto('file://'+out+'.svg'); await p.screenshot({path:out+'.png'}); await b.close(); console.log('ok',x);})();
