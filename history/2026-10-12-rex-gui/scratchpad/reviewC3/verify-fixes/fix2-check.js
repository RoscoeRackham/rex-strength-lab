// the proposed fixes-2 check, on the head page's and the mutant's strings
const sigf = (s) => s.replace(/[,.]/g, '').replace(/^0+/, '').replace(/0+$/, '').length;
const twoFigAll = (t) => t.split(' | ').every((c) => { if (c === '3.05 m' || c === '1,060 kg/m³') return true; const m = c.match(/^([\d.,]+)/); return !m || sigf(m[1]) <= 2; });
const itemBad = /\d,\d*[1-9]\d* t|\d\.\d+ m tall|\d,\d*[1-9]\d* kg\/m³/;
const cases = {
  head: { table: '5,600 t (1,900×) | 11 m | 46,000 kg/m³ | 5,600 t (1,900×) | 37 m | 1,060 kg/m³ | 5,600 t (1,900×) | 3.05 m | 2 × 10⁶ kg/m³', item: 'It becomes about 6,000 t of new mass (energy ÷ c²): about 2,000× his mass, so he is about 11 m tall at about 46,000 kg/m³ (the even mix of size and density).' },
  mB: { table: '5,600 t (1,900×) | 10.7 m | 45,600 kg/m³ | 5,600 t (1,900×) | 37.4 m | 1,060 kg/m³ | 5,600 t (1,900×) | 3.05 m | 2 × 10⁶ kg/m³', item: 'It becomes about 6,000 t of new mass (energy ÷ c²): about 2,000× his mass, so he is about 11 m tall at 45,600 kg/m³ (the even mix of size and density).' },
};
for (const [k, v] of Object.entries(cases)) console.log(k, 'tableOK', twoFigAll(v.table), 'itemOK', !itemBad.test(v.item));
