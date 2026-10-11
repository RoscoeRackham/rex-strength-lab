function lum(h) { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
function cr(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
const L = { paper:'#ECEDF1', sheet:'#F8F8FA', wall:'#DADCE4', floor:'#F1F1F4', every:'#7D8599', natural:'#CFA23A', bb:'#B9592A', strong:'#5A3624', comic:'#3A55B0', duo:'#8A2F6E', geom:'#A4A7B3', ink:'#15181F', ink3:'#5C6270' };
const D = { paper:'#14151A', sheet:'#1B1D23', wall:'#262833', floor:'#30323D', every:'#9AB4D0', natural:'#E8C25A', bb:'#D9763F', strong:'#7A4536', comic:'#6680E0', duo:'#B85C8C', geom:'#6E7080', ink:'#E8E9EE', ink3:'#9CA1AF' };
for (const [n, T] of [['light', L], ['dark', D]]) {
  console.log(n);
  for (const g of ['every', 'natural', 'bb', 'strong', 'comic', 'duo', 'geom']) console.log('  ', g.padEnd(8), 'wall', cr(T[g], T.wall).toFixed(2), 'paper', cr(T[g], T.paper).toFixed(2), 'sheet', cr(T[g], T.sheet).toFixed(2), 'floor', cr(T[g], T.floor).toFixed(2), 'vs ink edge', cr(T[g], T.ink).toFixed(2));
  console.log('   ink3 on wall', cr(T.ink3, T.wall).toFixed(2));
}
console.log('proposed light natural #97720F wall', cr('#97720F', L.wall).toFixed(2), 'sheet', cr('#97720F', L.sheet).toFixed(2), ' every #6B7387 wall', cr('#6B7387', L.wall).toFixed(2), ' dark strong #B06A52 wall', cr('#B06A52', D.wall).toFixed(2));
