const { chromium, CHROME, open } = require('./lib.js');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p, errs } = await open(browser, 390, 844, 'light', { dpr: 1 });
  await p.click('#uMet');
  await p.selectOption('#buildSelect', 'ansur2_m_p50');
  await p.fill('#hCm', '1000'); await p.fill('#wIn', '2500');
  let r = await p.evaluate(() => ({ flags: document.getElementById('bFlags').innerText, stats: document.getElementById('stats').innerText.replace(/\n+/g,' | '),
    chips: [...document.querySelectorAll('.g')].map(li => li.querySelector('.v1').textContent + ' ' + li.querySelector('.meta').innerText.replace(/\n/g,' ')).join(' ; '),
    warns: (document.querySelector('.warns')||{innerText:''}).innerText }));
  console.log('10m BMI25', JSON.stringify(r, null, 1));
  await p.fill('#hCm', '50'); await p.fill('#wIn', '');
  r = await p.evaluate(() => ({ flags: document.getElementById('bFlags').innerText, stats: document.getElementById('stats').innerText.replace(/\n+/g,' | '),
    chips: [...document.querySelectorAll('.g')].map(li => li.querySelector('.v1').textContent + ' ' + li.querySelector('.meta').innerText.replace(/\n/g,' ')).join(' ; '),
    ffmi: document.getElementById('ffmiNote').innerText,
    warns: (document.querySelector('.warns')||{innerText:''}).innerText }));
  console.log('0.5m', JSON.stringify(r, null, 1));
  // search behaviour
  await p.fill('#hCm', '');
  await p.fill('#buildSearch', 'hulk');
  r = await p.evaluate(() => ({ name: document.getElementById('bName').textContent, sel: document.getElementById('buildSelect').value, cnt: document.getElementById('buildCount').textContent }));
  console.log('search hulk', r);
  await p.fill('#buildSearch', 'zzzz');
  r = await p.evaluate(() => ({ name: document.getElementById('bName').textContent, sel: document.getElementById('buildSelect').value, opts: document.getElementById('buildSelect').options.length, cnt: document.getElementById('buildCount').textContent }));
  console.log('search zzzz', r);
  await p.fill('#buildSearch', '');
  r = await p.evaluate(() => ({ name: document.getElementById('bName').textContent, sel: document.getElementById('buildSelect').value }));
  console.log('search cleared', r);
  // search for 'woman' and 'women'
  for (const q of ['women', 'woman', 'colossus', 'army', 'Mr Olympia', 'olympia', 'logan', 'spider']) {
    await p.fill('#buildSearch', q);
    r = await p.evaluate(() => ({ name: document.getElementById('bName').textContent, cnt: document.getElementById('buildCount').textContent }));
    console.log('search', q, r);
  }
  console.log('errs', errs);
  await ctx.close(); await browser.close();
})();
