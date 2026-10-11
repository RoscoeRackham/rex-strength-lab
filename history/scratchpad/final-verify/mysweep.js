const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html'); await page.waitForTimeout(800);
  const V = 2.5471; const hits = {}; let n = 0;
  const add = (k, st, t, i) => { (hits[k] = hits[k] || []).push(JSON.stringify(st) + ' :: ' + (i != null ? t.slice(Math.max(0, i - 120), i + 120).replace(/\n/g, ' | ') : '')); };
  const states = [];
  for (let e = 2; e <= 28; e += 0.5) for (const gh of [false, true]) states.push({ group: 'solo', action: 'weight', m: Math.pow(10, e), groundHolds: gh });
  for (const H of [0.4, 50]) for (let e = -1; e <= 30; e += 1.5) states.push({ group: 'solo', action: 'weight', H, m: Math.pow(10, e) * H * H * H * 0.08995 / 1000 * 1000 });
  for (const rho of [30, 1060, 22587, 2.77e9, 4.12e17, 1e22, 3e26]) for (const lk of [2, 4.96, 9, 'inf']) {
    const base = { logKg: lk === 'inf' ? 34 : lk, inf: lk === 'inf', m: rho * V, oM: rho * V };
    for (const [a, o] of [['arm', {}], ['arm', { anchor: 'bolted' }], ['wrestle', { wrestleMove: 'push' }], ['wrestle', { wrestleMove: 'shove' }], ['wrestle', { wrestleMove: 'lift' }], ['wrestle', { wrestleMove: 'throw' }], ['catch', { cObj: 'partner' }], ['catch', { cObj: 'partner', cStyle: 'hard' }], ['catch', { cObj: 'baseball' }], ['catch', { cObj: 'car', cStyle: 'hard' }], ['collide', {}]])
      states.push(Object.assign({ group: 'duo', duoAction: a }, base, o));
  }
  for (const st of states) {
    await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.reload(); await page.waitForTimeout(30);
    const t = await page.evaluate(() => { document.querySelectorAll('#bay details').forEach((d) => (d.open = true)); return document.querySelector('#bay').innerText + '\n' + [...document.querySelectorAll('#bay svg text')].map((x) => x.textContent).join(' '); });
    n++;
    let m;
    if ((m = t.match(/NaN|undefined|\bnull\b|\[object|Infinity|Calculation failed/))) add('bad', st, t, m.index);
    if ((m = t.match(/up up|\bthe the\b|\ba a\b/))) add('dup', st, t, m.index);
    if ((m = t.match(/\d{1,3}(,\d{3}){4,}/))) add('longdigits', st, t, m.index);
    const reshape = /Reshapes the planet|outweighs the Earth|is a black hole/.test(t);
    if (reshape && (m = t.match(/Pressure under his feet|Air falls onto him|Rock crushed where|Feet: W ÷|Bedrock carries/))) add('surfaceInReshape', st, t, m.index);
    if (/far side/.test(t) && (m = t.match(/(east|west) of straight down/)) && /past it on the far side|on the far side of it/.test(t)) add('driftFar', st, t, m.index);
    if ((m = t.match(/tosses Ollie (?!straight)[^.]*? up\b/))) add('oldToss', st, t, m.index);
    if ((m = t.match(/arm is stronger \(/))) add('oldStronger', st, t, m.index);
    if (/No contest/.test(t) && (m = t.match(/Time to pin|Pushing force|Twist on/))) add('contestTiles', st, t, m.index);
    if (/air stops him first|can’t toss/.test(t) && (m = t.match(/hands give [^ ]+ while he catches/))) add('catchNotesNoCatch', st, t, m.index);
    if ((m = t.match(/held up by the pressure of its squeezed electrons/)) && /neutron drip/.test(t)) add('bothCrust', st, t, m.index);
    if ((m = t.match(/(^|[^\d.,])2 m\b[^²³]|180 kg/)) && !/calibration/.test(t.slice(Math.max(0, m.index - 80), m.index + 80))) add('old2m', st, t, m.index);
  }
  console.log('states', n);
  for (const [k, v] of Object.entries(hits)) { console.log(k, v.length); v.slice(0, 4).forEach((x) => console.log('   ' + x)); }
  console.log('errors', errs.slice(0, 5));
  await browser.close();
})();
