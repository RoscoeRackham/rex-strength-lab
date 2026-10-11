import { validate } from './validate_palette.js';
function oklch2hex(L,C,h){const a=C*Math.cos(h*Math.PI/180),b=C*Math.sin(h*Math.PI/180);
const l_=L+0.3963377774*a+0.2158037573*b,m_=L-0.1055613458*a-0.0638541728*b,s_=L-0.0894841775*a-1.2914855480*b;
const l=l_**3,m=m_**3,s=s_**3;
let r=4.0767416621*l-3.3077115913*m+0.2309699292*s,g=-1.2684380046*l+2.6097574011*m-0.3413193965*s,bb=-0.0041960863*l-0.7034186147*m+1.7076147010*s;
const f=x=>{x=Math.max(0,Math.min(1,x));x=x<=0.0031308?12.92*x:1.055*x**(1/2.4)-0.055;return Math.round(x*255).toString(16).padStart(2,'0')};
if([r,g,bb].some(x=>x<-0.002||x>1.002))return null;return '#'+f(r)+f(g)+f(bb);}
const spec=JSON.parse(process.argv[2]); const mode=process.argv[3], surface=process.argv[4];
const O=spec.map(([h0,h1,C0,C1,L0,L1])=>{const o=[];for(let h=h0;h<=h1;h+=5)for(let C=C0;C<=C1+1e-9;C+=0.01)for(let L=L0;L<=L1+1e-9;L+=0.02){const x=oklch2hex(L,C,h);if(x)o.push(x)}return o});
let bestV=-1,best;
for(let i=0;i<80000;i++){const p=O.map(o=>o[Math.floor(Math.random()*o.length)]);
 const r=validate(p,{mode,surface,pairs:'all'});
 const cvd=r.report.find(x=>x[0].startsWith('CVD'))[1], nv=r.report.find(x=>x[0].startsWith('Normal'))[1];
 if(cvd!=='fail'&&nv==='pass'){const m=+(r.report.find(x=>x[0].startsWith('CVD'))[2].match(/ΔE ([\d.]+)/)[1]); if(m>bestV){bestV=m;best=p;}}
}
console.log(bestV,best&&best.join(','));
