const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const lin=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4)};
const L=rgb=>0.2126*lin(rgb[0])+0.7152*lin(rgb[1])+0.0722*lin(rgb[2]);
const cr=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)};
const mix=(f,b,a)=>f.map((v,i)=>v*a+b[i]*(1-a));
const P=(n,a,b)=>console.log(n.padEnd(46),cr(a,b).toFixed(2));
const lt={bg:'#e9ece2',s:'#f6f7f1',s2:'#dfe3d5',i3:'#626954',warn:'#c98500',good:'#0b7a0b',bad:'#d03b3b',glyph:'#1b1306'};
const dk={bg:'#11130d',s:'#1a1d14',s2:'#252a1d',i3:'#939a80',warn:'#fab219',good:'#3fbf4f'};
for (const [n,t] of [['light',lt],['dark',dk]]){
 const H={};for(const k in t)H[k]=hex(t[k]);
 P(n+' leader ink-3@0.6 on bg',mix(H.i3,H.bg,0.6),H.bg);
 P(n+' leader ink-3@1 on bg',H.i3,H.bg);
 P(n+' meter track s2 on s',H.s2,H.s);
 P(n+' meter track s2 on bg',H.s2,H.bg);
 P(n+' good bar on s2',H.good,H.s2);
 P(n+' good bar on s',H.good,H.s);
 P(n+' warn on s',H.warn,H.s);
 if(H.glyph){P(n+' warn glyph on warn',H.glyph,H.warn);P(n+' warn glyph on surface',H.glyph,H.s);}
}
P('light #a36d00 on s',hex('#a36d00'),hex(lt.s));
P('light #b07800 on s',hex('#b07800'),hex(lt.s));
P('light #1b1306 on #a36d00',hex('#1b1306'),hex('#a36d00'));
P('light #1b1306 on #b07800',hex('#1b1306'),hex('#b07800'));
P('light ink-3 on s',hex(lt.i3),hex(lt.s));
