const fs = require('fs');
const { chromium, CHROME, open } = require('./lib.js');
async function state(p) {
  return p.evaluate(() => ({
    w: document.getElementById('wBig').textContent + ' ' + document.getElementById('wBigU').textContent,
    other: document.getElementById('wOther').textContent,
    notes: document.getElementById('wNotes').innerText,
    hH: document.getElementById('hHint').innerText, wH: document.getElementById('wHint').innerText,
    stats: document.getElementById('stats').innerText.replace(/\n+/g, ' | '),
    ffmi: document.getElementById('ffmiNote').innerText.slice(0, 120),
    flags: document.getElementById('bFlags').innerText.replace(/\n/g, ' | '),
    g: [...document.querySelectorAll('.g')].map(li => li.querySelector('.v1').textContent).join(', '),
    sw: document.documentElement.scrollWidth,
    revSrc: document.getElementById('revSource').innerText,
    revOut: document.getElementById('revOut').innerText.slice(0, 400),
    invalid: [...document.querySelectorAll('[aria-invalid="true"]')].map(e => e.id).join(','),
  }));
}
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p, errs } = await open(browser, 390, 844, 'light', { dpr: 2 });
  await p.selectOption('#buildSelect', 'ronnie_coleman');
  const cases = [['1', '7.7'], ['32', '9.7'], ['33', '0'], ['0', '11.8'], ['1', '0'], ['0', '0'], ['', '']];
  for (const [ft, inch] of cases) {
    await p.fill('#hFt', ft); await p.fill('#hIn', inch);
    console.log('IMP', ft, inch, JSON.stringify(await state(p), null, 0));
  }
  await p.fill('#hFt', '1'); await p.fill('#hIn', '7.7');
  await p.screenshot({ path: '/home/user/build-calc/shots/audit-390-h05m.png', fullPage: true });
  await p.fill('#hFt', '32'); await p.fill('#hIn', '9.7');
  await p.screenshot({ path: '/home/user/build-calc/shots/audit-390-h10m.png', fullPage: true });
  await p.click('#uMet');
  for (const cm of ['50', '1000', '1001', '29', '30']) {
    await p.fill('#hCm', cm);
    console.log('MET', cm, JSON.stringify(await state(p), null, 0));
  }
  await p.fill('#hCm', '1000');
  await p.screenshot({ path: '/home/user/build-calc/shots/audit-390-h10m-metric.png', fullPage: true });
  // weight extremes
  await p.fill('#hCm', '180');
  for (const w of ['0.1', '1', '1000000', '1e9', '-5', 'abc']) {
    await p.fill('#wIn', w);
    console.log('W', w, JSON.stringify(await state(p), null, 0));
  }
  await p.fill('#wIn', '1000000');
  await p.screenshot({ path: '/home/user/build-calc/shots/audit-390-w1e6kg.png', fullPage: true });
  console.log('errs', errs);
  await ctx.close(); await browser.close();
})();
