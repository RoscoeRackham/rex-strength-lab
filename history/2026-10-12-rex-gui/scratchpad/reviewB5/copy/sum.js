const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(path.join(__dirname, 'page.html')).href);
  const states = [
    { groundHolds: false, gentleHold: false, coolFlight: true },
    {}, { airAbsorb: 0.3 }, { airAbsorb: 0 }, { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false },
    { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false, anchor: 'bolted', silentStrike: true },
    { airAbsorb: 0.999 }, { airAbsorb: 0.004 }, { mode: 'real', unbreakable: false },
  ];
  for (const s of states) {
    await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, s);
    await page.reload(); await page.waitForTimeout(600);
    const r = await page.evaluate(() => ({ sum: document.getElementById('powers-sum').textContent, big: document.getElementById('air-absorb-big').textContent, read: document.getElementById('air-absorb-read').textContent, saved: JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'), checks: ['sw-unbreakable', 'sw-recoil', 'sw-keep'].map((id) => document.getElementById(id).checked) }));
    console.log(JSON.stringify(s), '\n  sum:', r.sum, '\n  slider:', r.big, '|', r.read, '\n  checks', r.checks, 'saved keys old?', ['groundHolds', 'gentleHold', 'coolFlight'].filter((k) => k in r.saved));
  }
  // drag slider via keyboard
  await page.evaluate(() => { localStorage.clear(); }); await page.reload(); await page.waitForTimeout(600);
  await page.evaluate(() => { document.getElementById('powers').open = true; });
  await page.focus('#air-absorb'); for (let i = 0; i < 50; i++) await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(500);
  console.log('after 50 left:', await page.evaluate(() => [document.getElementById('air-absorb').value, document.getElementById('air-absorb-big').textContent, document.getElementById('air-absorb').getAttribute('aria-valuetext'), document.getElementById('powers-sum').textContent, JSON.parse(localStorage.getItem('rex-lab-v1')).airAbsorb]));
  await browser.close();
})();
