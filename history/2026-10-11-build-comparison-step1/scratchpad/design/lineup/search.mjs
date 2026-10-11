import { validate } from './vp.mjs';
// OKLCH -> hex
function oklch2hex(L,C,h){const a=C*Math.cos(h*Math.PI/180),b=C*Math.sin(h*Math.PI/180);
const l_=L+0.3963377774*a+0.2158037573*b,m_=L-0.1055613458*a-0.0638541728*b,s_=L-0.0894841775*a-1.2914855480*b;
const l=l_**3,m=m_**3,s=s_**3;
let r=4.0767416621*l-3.3077115913*m+0.2309699292*s,g=-1.2684380046*l+2.6097574011*m-0.3413193965*s,bb=-0.0041960863*l-0.7034186147*m+1.7076147010*s;
const f=x=>{x=Math.max(0,Math.min(1,x));x=x<=0.0031308?12.92*x:1.055*x**(1/2.4)-0.055;return Math.round(x*255).toString(16).padStart(2,'0')};
if([r,g,bb].some(x=>x<-0.001||x>1.001))return null;return '#'+f(r)+f(g)+f(bb);}
const mode=process.argv[2]||'light', surface=process.argv[3]||'#E2E3EA';
// anchors: hue ranges from the art: slate(250-265), gold(75-90), orange-brown(45-60), umber/brick(25-40), navy(260-275), maroon(355-15)
const band = mode==='light'?[0.45,0.75]:[0.50,0.66];
const cand = {
 everyday:{h:[240,255,270],C:[0.10,0.11]},
 natural:{h:[78,85,92],C:[0.12,0.14]},
 bb:{h:[40,48,55],C:[0.12,0.15]},
 strong:{h:[15,22,30],C:[0.10,0.12]},
 comic:{h:[265,272,280],C:[0.13,0.16]},
};
const Ls=[]; for(let L=band[0];L<=band[1]+1e-9;L+=0.05)Ls.push(+L.toFixed(2));
function opts(k){const o=[];for(const h of cand[k].h)for(const C of cand[k].C)for(const L of Ls){const x=oklch2hex(L,C,h);if(x)o.push(x)}return o}
const O=Object.keys(cand).map(opts);
let best=null,count=0;
function score(p){const r=validate(p,{mode,surface,pairs:'all'});return r}
// random search
for(let i=0;i<60000;i++){
 const p=O.map(o=>o[Math.floor(Math.random()*o.length)]);
 const r=validate(p,{mode,surface,pairs:'all'});
 const fails=r.report.filter(x=>x[1]==='fail').length;
 if(fails===0){const low=r.report.find(x=>x[0].startsWith('Contrast'))[1]; if(low==='pass'||!best){best=p;console.log(p.join(','),low);count++; if(count>8)break;}}
}
console.log('done',best&&best.join(','));
