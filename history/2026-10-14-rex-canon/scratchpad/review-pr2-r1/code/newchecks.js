// node newchecks.js <dist/index.html> : the checks pull request 2 added to test/shots.js, run alone on any page
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(path.join(__dirname, 'repo/rex-strength-lab/test/make-page-fixture.js'));
const dist = process.argv[2], which = (process.argv[3] || 'all').split(',');
(async () => {
  const body = fs.readFileSync(dist, 'utf8');
  const prev = path.join(path.dirname(dist), 'nc-preview.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); };
  const bayText = () => page.evaluate(() => document.getElementById('bay').textContent.replace(/\s+/g, ' '));
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(page, sel === '#duo-effort' ? 'duo-bay' : 'bay'); };
  const chips = () => page.evaluate(() => Array.from(document.querySelectorAll('#bay .status-row .status, #bay .status-row > *')).map((n) => n.textContent.trim()));
  const res = {};
  const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'], DUO = ['arm', 'wrestle', 'catch', 'collide'];
  if (which.includes('all') || which.includes('chip')) {
    await load({ action: 'throw' }); await pick('#effort', 'allout');
    const thr = (await chips()).join(' | ');
    res.chip = thr.includes('His recoil goes to the endless ocean: their power') ? 'pass' : 'FAIL: ' + thr;
  }
  if (which.includes('all') || which.includes('planet')) {
    const RECOIL_PLANET = /(?:recoil|push back|pull back)[^.]*(?<!not )into the planet|the planet keeps (?:the|it|no)\b|still obeys Newton|momentum is never absorbed|no power absorbs momentum/gi;
    const pageText = () => page.evaluate(() => { const b = document.body.cloneNode(true); b.querySelectorAll('script, style').forEach((x) => x.remove()); return b.textContent.replace(/\s+/g, ' '); });
    const planet = [];
    for (const foot of [{ anchor: 'friction', oAnchor: 'friction' }, { anchor: 'bolted', oAnchor: 'bolted' }]) {
      for (const tab of SOLO.concat(DUO)) {
        const duo = DUO.includes(tab), st = Object.assign({}, foot, duo ? { duoOpen: true, duoAction: tab } : { action: tab });
        await load(st); if (duo) await settle(page, 'duo-bay');
        for (const e of ['least', 'allout']) {
          if (e === 'allout') { if (duo) await pick('#duo-effort', 'allout'); else if (await page.$('#effort')) await pick('#effort', 'allout'); else continue; }
          const hits = (await pageText()).match(RECOIL_PLANET);
          if (hits) planet.push(tab + ' (' + foot.anchor + ', ' + e + '): ' + Array.from(new Set(hits)).join(' | ').slice(0, 200));
        }
      }
    }
    const eyebrow = await page.$eval('.hero .eyebrow', (n) => n.textContent.trim());
    res.planet = planet.length || eyebrow !== 'Indestructible · never tires · unlimited' ? 'FAIL: ' + eyebrow + ' ; ' + planet.length + ' hits: ' + planet.slice(0, 4).join(' ; ') : 'pass';
  }
  if (which.includes('all') || which.includes('pull')) {
    await load({ action: 'pull' }); await pick('#effort', 'plaster');
    const pullOn = await page.$eval('#bay .effort-read', (n) => n.textContent.replace(/\s+/g, ' '));
    await load({ action: 'pull', ownRecoil: false }); await pick('#effort', 'plaster');
    const pullOff = await page.$eval('#bay .effort-read', (n) => n.textContent.replace(/\s+/g, ' '));
    res.pull = (!/the rope’s pull back on him goes to the endless ocean, so nothing of the pull reaches the ground/.test(pullOn) || /doesn’t model the ground shaking from this move/.test(pullOn + pullOff) || !/the lab doesn’t count it/.test(pullOff) || /only with (They take their own recoil|the power) on/.test(pullOff)) ? 'FAIL: on ' + pullOn.slice(0, 200) + ' | off ' + pullOff.slice(0, 200) : 'pass';
  }
  if (which.includes('all') || which.includes('throw22k')) {
    await load({ action: 'throw' });
    const thrT = await bayText(), thrM = thrT.match(/goes into their source, the endless ocean: ([\d,]+) kg·m\/s, the car’s momentum/), thrUse = thrT.match(/as hard as lifting ([\d.,]+)\s(t|kg)/);
    const thrJ = thrUse ? await page.evaluate((kg) => { const P = window.DinoPhys, D = window.DINO_DATA, g = P.K.g; const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
      const c = { F: 100 * 907.18474 * g, mode: 'comic', body, surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, use: kg * g };
      const r = P.throwObject(c, D.objects.find((x) => x.id === 'car'), 45); return r.recoilAbsorbed ? r.recoilAbsorbed.J : null; }, Number(thrUse[1].replace(/,/g, '')) * (thrUse[2] === 't' ? 1000 : 1)) : null;
    const thrShown = thrM ? Number(thrM[1].replace(/,/g, '')) : null;
    res.throw22k = (!thrShown || !(thrJ > 0) || Math.abs(thrShown / thrJ - 1) > 0.03 || Math.abs(thrShown / 22000 - 1) > 0.03) ? 'FAIL: shown ' + thrShown + ' engine ' + thrJ + ' use ' + (thrUse && thrUse[0]) : 'pass (' + thrShown + ' vs ' + Math.round(thrJ) + ', ' + thrUse[0] + ')';
  }
  if (which.includes('all') || which.includes('carried')) {
    await load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 20 }); await settle(page, 'duo-bay'); await pick('#duo-effort', 'allout');
    const carried = await page.$eval('#duo-bay', (n) => n.textContent.replace(/\s+/g, ' '));
    res.carried = (!/He isn’t carried off: without it the catch would carry him off/.test(carried) || /[Cc]arries Ollie off|carries him off at|Ollie carried off/.test(carried)) ? 'FAIL: ' + ((carried.match(/[^.]*carr[^.]*\./g) || []).join(' ').slice(0, 300)) : 'pass';
  }
  if (which.includes('all') || which.includes('duoplaster')) {
    const dp = [], RECOIL_WHY = /Even all-out, this test doesn’t shake the ground enough that plaster may crack [^.]*\. They take their own recoil: /;
    for (const [tab, extra, want] of [['arm', { logKg: 12 }, 'never'], ['wrestle', { wrestleMove: 'shove', logKg: 8 }, 'recoil'], ['wrestle', { wrestleMove: 'shove', logKg: 8, ownRecoil: false, anchor: 'bolted' }, 'finds'], ['wrestle', { wrestleMove: 'throw', logKg: 8 }, 'finds'],
      ['catch', { cObj: 'car', cStyle: 'hard', logKg: 9 }, 'recoil'], ['catch', { cObj: 'car', cStyle: 'hard', logKg: 9, ownRecoil: false, anchor: 'bolted', oAnchor: 'bolted' }, 'finds']]) {
      await load(Object.assign({ duoOpen: true, duoAction: tab }, extra)); await settle(page, 'duo-bay'); await pick('#duo-effort', 'plaster');
      const t = await page.evaluate(() => document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' '));
      if (!({ finds: /Effort: .*The least effort that shakes the ground enough that plaster may crack/, never: /Even all-out, this test doesn’t shake the ground/, recoil: RECOIL_WHY })[want].test(t) || /undefined|NaN/.test(t)) dp.push(tab + (extra.wrestleMove || '') + (extra.ownRecoil === false ? ' (own recoil off, bolted)' : '') + ': ' + t.slice(0, 200));
    }
    res.duoplaster = dp.length ? 'FAIL: ' + dp.join(' ; ') : 'pass';
  }
  res.errs = errs.slice(0, 3);
  console.log(JSON.stringify(res, null, 1));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(2); });
