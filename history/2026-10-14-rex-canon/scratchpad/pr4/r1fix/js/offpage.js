// The two-player tabs with every power off, on several pages: node offpage.js out.json page1.html [page2.html ...]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const { readResult, settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false, safePassenger: false, noKnockback: false, oNoKnockback: false, saveV: 3 };
const S = {
  arm: { duoAction: 'arm' }, 'arm-bolt6': { duoAction: 'arm', oAnchor: 'bolted', logKg: 6 }, push: { duoAction: 'wrestle' }, 'push-rb': { duoAction: 'wrestle', anchor: 'bolted' }, 'push-inf-ob': { duoAction: 'wrestle', inf: true, oAnchor: 'bolted' },
  shove: { duoAction: 'wrestle', wrestleMove: 'shove' }, both: { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' }, 'both-inf-rb': { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both', inf: true, anchor: 'bolted' },
  lift: { duoAction: 'wrestle', wrestleMove: 'lift' }, throw: { duoAction: 'wrestle', wrestleMove: 'throw' }, catch: { duoAction: 'catch' }, 'catch-car': { duoAction: 'catch', cObj: 'car' },
  toss: { duoAction: 'catch', cObj: 'partner' }, fire: { duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14 }, 'fire-1km': { duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, cLogD: 3 },
  sprint: { duoAction: 'collide' }, bounce: { duoAction: 'collide', colBounce: 'bounce' }, jump: { duoAction: 'collide', colSrc: 'jump' }, jump9: { duoAction: 'collide', colSrc: 'jump', logKg: 9 }, stomp: { duoAction: 'collide', colSrc: 'stomp' },
  set: { duoAction: 'collide', colSrc: 'set' }, bolted: { duoAction: 'collide', anchor: 'bolted' }, 'jump-bolted': { duoAction: 'collide', colSrc: 'jump', anchor: 'bolted' }, cpush: { duoAction: 'collide', colMode: 'push' }, 'cpush-rb': { duoAction: 'collide', colMode: 'push', anchor: 'bolted' },
  'cpush-inf-b': { duoAction: 'collide', colMode: 'push', inf: true, anchor: 'bolted' }, imm: { duoAction: 'collide', colImm: true }, inf: { duoAction: 'collide', colSrc: 'set', colInf: true },
};
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const res = {};
  for (const file of process.argv.slice(3)) {
    const body = fs.readFileSync(file, 'utf8'), prev = path.join(__dirname, '..', 'view', 'off-' + path.basename(path.dirname(path.dirname(file))) + '-' + process.pid + '.html');
    fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(prev).href);
    const out = {};
    for (const [k, st] of Object.entries(S)) for (const eff of [null, 'allout', 'ground', 'plaster']) {
      await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ duoOpen: true }, OFF, st));
      await page.reload(); await page.waitForTimeout(500); await settle(page, 'bay'); await page.waitForTimeout(200); await settle(page, 'duo-bay');
      if (eff) { await page.selectOption('#duo-effort', eff); await page.waitForTimeout(300); await settle(page, 'duo-bay'); }
      out[k + (eff ? '-' + eff : '')] = await readResult(page, 'duo-bay');
    }
    res[file] = out;
    await page.close();
  }
  fs.writeFileSync(process.argv[2], JSON.stringify(res));
  const files = process.argv.slice(3), base = res[files[0]];
  for (const f of files.slice(1)) { const d = Object.keys(base).filter((k) => JSON.stringify(base[k]) !== JSON.stringify(res[f][k])); console.log(f, ': ', Object.keys(base).length - d.length, 'of', Object.keys(base).length, 'the same; differ:', d.join(', ')); }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
