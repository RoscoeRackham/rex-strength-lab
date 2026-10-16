// Probe the page texts changed by round 1's fixes. Usage: node probe.js <dist/index.html> [ids...]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { readResult, settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const CASES = {
  shoveInfTorn: [{ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', inf: true, oAnchor: 'bolted', unbreakable: false }, 'allout'],
  shoveInfTornLeast: [{ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', inf: true, oAnchor: 'bolted', unbreakable: false }, 'least'],
  shoveInfParadox: [{ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', inf: true, oAnchor: 'bolted' }, 'allout'],
  shoveDefault: [{ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'rex' }, 'least'],
  shoveAllout: [{ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'rex' }, 'allout'],
  shoveOllieBolted: [{ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'rex', oAnchor: 'bolted' }, 'least'],
  shoveBothBolted: [{ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'rex', oAnchor: 'bolted', anchor: 'bolted' }, 'least'],
  shovePlaster: [{ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'rex' }, 'plaster'],
  tossBolted: [{ duoOpen: true, duoAction: 'catch', cObj: 'partner', oAnchor: 'bolted' }, 'least'],
  tossFree: [{ duoOpen: true, duoAction: 'catch', cObj: 'partner' }, 'least'],
  pullBoltedOff: [{ action: 'pull', obj: 'car', anchor: 'bolted', ownRecoil: false }, 'allout'],
  pullBoltedOff9: [{ action: 'pull', obj: 'car', anchor: 'bolted', ownRecoil: false, logKg: 9 }, 'plaster'],
  stomp20k: [Object.assign({ action: 'stomp', logKg: Math.log10(20000) }, OFF), 'allout'],
  stompDefOff: [Object.assign({ action: 'stomp' }, OFF), 'allout'],
  stompBoltedOff: [Object.assign({ action: 'stomp', logKg: Math.log10(20000), anchor: 'bolted' }, OFF), 'allout'],
  stompOn: [{ action: 'stomp' }, 'allout'],
  pin: [{ duoOpen: true, duoAction: 'arm', oSame: false, oLogKg: 4.5 }, 'allout'],
  catchBus: [{ duoOpen: true, duoAction: 'catch', cObj: 'bus', cLogD: 1, cStyle: 'hard' }, 'least'],
};
(async () => {
  const file = process.argv[2], only = process.argv.slice(3);
  const body = fs.readFileSync(file, 'utf8');
  const prev = path.join(__dirname, 'probe-' + path.basename(path.dirname(path.resolve(file))) + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  for (const [id, [st, eff]] of Object.entries(CASES)) {
    if (only.length && !only.includes(id)) continue;
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st); await page.reload(); await page.waitForTimeout(800);
    const duo = !!st.duoOpen, bay = duo ? 'duo-bay' : 'bay';
    await settle(page, bay);
    if (eff !== 'least') { await page.selectOption(duo ? '#duo-effort' : '#effort', eff); await page.waitForTimeout(300); await settle(page, bay); }
    const r = await readResult(page, bay);
    console.log('==== ' + id + ' (' + eff + ')');
    console.log('verdict: ' + r.verdict);
    console.log('effort: ' + r.effort.join(' / '));
    console.log('happens: ' + r.happens.join(' / '));
  }
  const hint = await page.evaluate(() => document.getElementById('sw-recoil').parentElement.textContent.replace(/\s+/g, ' '));
  console.log('==== hint: ' + hint);
  console.log('page errors: ' + JSON.stringify(errs));
  await browser.close();
})();
