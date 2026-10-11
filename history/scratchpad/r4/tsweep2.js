// Targeted page sweep for this round's fixes: wording patterns that should never appear.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(800);
  const states = [];
  const vol = { rex: 0.08995, human: 0.0225 };
  for (const [H, build] of [[3.048, 'rex'], [2, 'human'], [50, 'rex']]) for (let lm = 3; lm <= 26; lm += 0.5) for (const groundHolds of [false, true]) {
    const m = Math.pow(10, lm) * (H / 3.048) ** 3;
    states.push({ group: 'solo', action: 'weight', H, build, m, groundHolds });
  }
  for (const m of [2.6e9, 3e9, 7.06e9, 2e10, 4e10, 5e10, 1e11, 1.5e15, 1e18, 1e22]) states.push({ group: 'solo', action: 'weight', m });
  if (0) for (const obj of ['baseball', 'shot', 'bowling', 'piano', 'motorcycle', 'car', 'tank', 'bus']) for (const cStyle of ['easy', 'hard']) for (const lk of [3, 5, 7, 9]) for (const oAnchor of ['friction', 'bolted']) for (const cLogD of [1, 3])
    states.push({ group: 'duo', duoAction: 'catch', cObj: obj, cStyle, logKg: lk, oAnchor, cLogD });
  if (0) for (const lk of [1, 1.5, 2, 3, 5, 8]) for (const oM of [2700, 1e3, 3e6, 3e8]) for (const cStyle of ['easy', 'hard']) for (const cLogD of [0.5, 1, 3, 5])
    states.push({ group: 'duo', duoAction: 'catch', cObj: 'partner', cStyle, logKg: lk, oM, cLogD });
  if (0) for (const lk of [1, 2, 3, 5, 8, 12]) for (const oM of [1000, 2700, 3000, 3e6, 3e8]) for (const anchor of ['friction', 'braced', 'bolted']) {
    states.push({ group: 'duo', duoAction: 'arm', logKg: lk, oM, anchor });
    for (const wm of ['push', 'shove', 'lift', 'throw']) states.push({ group: 'duo', duoAction: 'wrestle', wrestleMove: wm, logKg: lk, oM, anchor });
  }
  const bad = [];
  const checks = [
    [/up up/, 'up up'],
    [/\d{1,3}(,\d{3}){3,}(?! ?(t|kg|years|km|m|J|N|W|Pa|×|°C))/, 'long digit string'],
    [/NaN|undefined|\bnull\b|\[object|Infinity/, 'broken value'],
    [/comes down steeply/, 'steep', (t) => /Arrives at\n[^\n]*\nlevel/.test(t)],
    [/Air falls onto him|Pressure under his feet|Rock crushed where/, 'surface text in reshape', (t) => /Reshapes the planet|Earth falls onto him|Rex is a black hole/.test(t)],
    [/(east|west) of straight down/, 'drift with far side', (t) => /far side of it|past it on the far side/.test(t)],
    [/Pushing force|Time to pin|Twist on/, 'contest tiles without contest', (t) => /can’t even hold his forearm up/.test(t)],
    [/leaves at\n0 m\/s|thrown back at\n0 m\/s/, 'zero-speed shove tile'],
    [/Stopping him puts|hands give .* while he catches/, 'catch notes without catch', (t) => /No toss gets|can’t toss|Can’t be done|into orbit|off the planet|fireball|isn’t modelled/.test(t)],
    [/arm is stronger \(/, 'old stronger wording'],
    [/tosses Ollie [^.]* up\./, 'old toss wording'],
  ];
  let n = 0;
  for (const st of states) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(25);
    await page.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => (d.open = true)));
    const t = await page.evaluate(() => document.querySelector('#bay').innerText);
    for (const [re, name, extra] of checks) {
      const m = t.match(re);
      if (m && (!extra || extra(t))) bad.push(name + ' :: ' + JSON.stringify(st) + ' :: ' + t.slice(Math.max(0, m.index - 120), m.index + 80).replace(/\n/g, ' | '));
    }
    n++;
  }
  console.log('states', n, 'bad', bad.length);
  const seen = {};
  for (const b of bad) { const k = b.split(' :: ')[0]; seen[k] = (seen[k] || 0) + 1; if (seen[k] <= 4) console.log('  ' + b); }
  console.log(JSON.stringify(seen));
  console.log('errors', errs.slice(0, 8));
  await browser.close();
})();
