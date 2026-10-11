function hex(h){h=h.replace('#','');return [0,2,4].map(i=>parseInt(h.substr(i,2),16));}
function lin(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
function L(rgb){return 0.2126*lin(rgb[0])+0.7152*lin(rgb[1])+0.0722*lin(rgb[2]);}
function cr(a,b){const la=L(typeof a==='string'?hex(a):a),lb=L(typeof b==='string'?hex(b):b);return (Math.max(la,lb)+0.05)/(Math.min(la,lb)+0.05);}
function blend(fg,bg,a){fg=hex(fg);bg=hex(bg);return fg.map((v,i)=>Math.round(v*a+bg[i]*(1-a)));}
const bg='#e9ece2',sf='#f6f7f1',s2='#dfe3d5';
for (const c of ['#626954','#5f6652']) console.log(c,'bg',cr(c,bg).toFixed(2),'surface',cr(c,sf).toFixed(2),'s2',cr(c,s2).toFixed(2));
for (const c of ['#0a8a0a','#08800a','#0b7a0b']) console.log('good',c,'surface',cr(c,sf).toFixed(2),'s2',cr(c,s2).toFixed(2),'white',cr('#ffffff',c).toFixed(2),'vs bad on s2', cr('#d03b3b',s2).toFixed(2));
for (const c of ['#9a6a00','#946500','#8f6200']) console.log('warn',c,'surface',cr(c,sf).toFixed(2),'#1b1306 on',cr('#1b1306',c).toFixed(2));
console.log('ghost ink3 full on surface',cr('#686f5b',sf).toFixed(2),'dark',cr('#939a80','#1a1d14').toFixed(2));
console.log('ink3 ticks on bg light',cr('#686f5b',bg).toFixed(2));
