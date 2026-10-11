function hex(h){h=h.replace('#','');return [0,2,4].map(i=>parseInt(h.substr(i,2),16));}
function lin(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
function L(rgb){return 0.2126*lin(rgb[0])+0.7152*lin(rgb[1])+0.0722*lin(rgb[2]);}
function cr(a,b){const la=L(typeof a==='string'?hex(a):a),lb=L(typeof b==='string'?hex(b):b);return (Math.max(la,lb)+0.05)/(Math.min(la,lb)+0.05);}
function blend(fg,bg,a){fg=hex(fg);bg=hex(bg);return fg.map((v,i)=>Math.round(v*a+bg[i]*(1-a)));}
const Lt={bg:'#e9ece2',surface:'#f6f7f1',s2:'#dfe3d5',ink3:'#686f5b',line:'#c9cebd',accent:'#b5650a',accentInk:'#7d4303',good:'#0ca30c',warn:'#c98500',bad:'#d03b3b'};
const Dk={bg:'#11130d',surface:'#1a1d14',s2:'#252a1d',ink3:'#939a80',line:'#363c2b',accent:'#f0a23a',good:'#3fbf4f',warn:'#fab219',bad:'#e66767'};
const out=[];
const p=(n,v)=>out.push(n.padEnd(55)+v.toFixed(2));
p('L ink3 on bg',cr(Lt.ink3,Lt.bg));
p('L ink3 on surface',cr(Lt.ink3,Lt.surface));
p('D ink3 on bg',cr(Dk.ink3,Dk.bg));
p('D ink3 on surface',cr(Dk.ink3,Dk.surface));
p('L tab #1b1306 on accent',cr('#1b1306',Lt.accent));
p('L #000 on accent',cr('#000000',Lt.accent));
p('L #fff on accentInk',cr('#ffffff',Lt.accentInk));
p('D tab #1b1306 on accent',cr('#1b1306',Dk.accent));
p('L line on bg',cr(Lt.line,Lt.bg));
p('L line on surface',cr(Lt.line,Lt.surface));
p('D line on bg',cr(Dk.line,Dk.bg));
p('D line on surface',cr(Dk.line,Dk.surface));
p('L ghost ink3@.55 on surface',cr(blend(Lt.ink3,Lt.surface,0.55),Lt.surface));
p('L ghost ink3@.55 on bg',cr(blend(Lt.ink3,Lt.bg,0.55),Lt.bg));
p('D ghost ink3@.55 on surface',cr(blend(Dk.ink3,Dk.surface,0.55),Dk.surface));
p('D ghost ink3@.55 on bg',cr(blend(Dk.ink3,Dk.bg,0.55),Dk.bg));
p('L s2 on surface',cr(Lt.s2,Lt.surface));
p('D s2 on surface',cr(Dk.s2,Dk.surface));
p('L good on s2',cr(Lt.good,Lt.s2));
p('L good on surface',cr(Lt.good,Lt.surface));
p('L bad on s2',cr(Lt.bad,Lt.s2));
p('D good on s2',cr(Dk.good,Dk.s2));
p('L warn on surface',cr(Lt.warn,Lt.surface));
p('D warn on surface',cr(Dk.warn,Dk.surface));
p('L #1b1306 on warn',cr('#1b1306',Lt.warn));
p('L white on good',cr('#ffffff',Lt.good));
p('D white on good',cr('#ffffff',Dk.good));
p('D #1b1306 on good',cr('#1b1306',Dk.good));
p('L white on bad',cr('#ffffff',Lt.bad));
p('D white on bad',cr('#ffffff',Dk.bad));
p('L good on surface (circle)',cr(Lt.good,Lt.surface));
p('D good on surface (circle)',cr(Dk.good,Dk.surface));
p('L #626954 on bg',cr('#626954',Lt.bg));
p('L badge good text on surface',cr(Lt.good,Lt.surface));
p('L badge warn text on surface',cr(Lt.warn,Lt.surface));
p('L ink3 on accent-wash approx',cr(Lt.ink3,blend(Lt.accent,Lt.surface,0.12).map(v=>v)));
console.log(out.join('\n'));
