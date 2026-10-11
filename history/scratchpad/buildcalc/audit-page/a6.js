const { chromium, CHROME, open } = require('./lib.js');
const SITES = ['chest', 'waist', 'arm_flexed', 'forearm', 'thigh', 'calf', 'neck'];
async function rv(p) {
  return p.evaluate(() => {
    const o = [];
    document.querySelectorAll('#reverse *').forEach(el => { const r = el.getBoundingClientRect(); if (r.width && (r.right > innerWidth + 0.5 || r.left < -0.5)) o.push(el.className + ':' + Math.round(r.left) + '-' + Math.round(r.right) + ' ' + el.textContent.slice(0, 30)); });
    const sec = document.getElementById('reverse').getBoundingClientRect();
    const nl = document.querySelector('.nline'); const nlr = nl ? nl.getBoundingClientRect() : null;
    const labs = [...document.querySelectorAll('.nline .lab, .nline .stated span')].map(e => { const r = e.getBoundingClientRect(); return e.textContent + ' [' + Math.round(r.left) + ',' + Math.round(r.right) + ']'; });
    return { out: document.getElementById('revOut').innerText, sw: document.documentElement.scrollWidth, over: o.slice(0, 8), nl: nlr ? [Math.round(nlr.left), Math.round(nlr.right)] : null, labs, src: document.getElementById('revSource').innerText, inv: [...document.querySelectorAll('#reverse [aria-invalid="true"]')].map(e => e.id).join(',') };
  });
}
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p, errs } = await open(browser, 390, 844, 'light', { dpr: 2 });
  await p.selectOption('#buildSelect', 'ronnie_coleman');
  const set = async (h, g) => { await p.fill('#rhFt', h[0]); await p.fill('#rhIn', h[1]); for (const s of SITES) await p.fill('#rg_' + s, String(g[s] != null ? g[s] : g.all)); };
  const cases = [
    ['all1', ['5', '10'], { all: 1 }],
    ['all1000', ['5', '10'], { all: 1000 }],
    ['chest1000', ['5', '10'], { all: 15, chest: 1000 }],
    ['h33ft', ['33', '0'], { all: 20 }],
    ['h0', ['0', '0'], { all: 20 }],
    ['zeroGirth', ['5', '10'], { all: 20, neck: 0 }],
    ['neg', ['5', '10'], { all: 20, neck: -3 }],
    ['text', ['5', '10'], { all: 20, neck: 'abc' }],
  ];
  for (const [name, h, g] of cases) {
    await set(h, g);
    const r = await rv(p);
    console.log('#####', name, 'sw', r.sw, 'nl', r.nl, 'labs', r.labs, 'over', r.over, 'inv', r.inv);
    console.log(r.out.slice(0, 900));
    if (name === 'chest1000' || name === 'all1000') await (await p.$('#reverse')).screenshot({ path: '/home/user/build-calc/shots/audit-390-rev-' + name + '.png' });
  }
  // body fat extremes for B
  await set(['5', '10'], { all: 15 });
  for (const bf of ['0', '1', '69', '70', '200']) {
    await p.fill('#rBf', bf);
    const r = await rv(p);
    console.log('bf', bf, r.out.split('\n').filter(l => /B ·|Volume|body fat|fat/i.test(l)).join(' / ').slice(0, 400));
  }
  console.log('errs', errs);
  await ctx.close(); await browser.close();
})();
