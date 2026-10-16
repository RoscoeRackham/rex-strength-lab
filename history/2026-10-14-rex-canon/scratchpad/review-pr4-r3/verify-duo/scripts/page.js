// usage: node page.js <rex-strength-lab dir> <case,...>
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const ROOT = process.argv[2], which = (process.argv[3] || 'all').split(',');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(ROOT + '/test/make-page-fixture.js');
(async () => {
  const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const out = path.join(__dirname, '..', 'wrap-' + path.basename(path.dirname(ROOT)) + '.html');
  fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(out).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); if (st.duoOpen) { await page.waitForTimeout(300); await settle(page, 'duo-bay'); } };
  const pick = async (v) => { await page.selectOption('#duo-effort', v); await page.waitForTimeout(300); await settle(page, 'duo-bay'); };
  const T = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#duo-bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
  const all = () => page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/\s+/g, ' '));
  const ollieKg = async (logKg) => { await page.evaluate(() => { document.getElementById('ollie-setup').open = true; }); await page.click('#o-own'); await page.waitForTimeout(300);
    await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, logKg); await page.waitForTimeout(800); await settle(page, 'duo-bay'); };
  const setUse = async (logKg) => { await page.evaluate((v) => { const s = document.getElementById('duo-effort-use'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, logKg); await page.waitForTimeout(1200); await settle(page, 'duo-bay'); };
  const W = { duoOpen: true, duoAction: 'wrestle' };
  const show = async (lab) => { console.log('=== ' + lab); console.log('VERDICT: ' + await T('.verdict')); console.log('STATUS: ' + await T('.status-row')); console.log('TILES: ' + await T('.tiles')); console.log('EFFORT: ' + (await T('.effort-read')).slice(0, 700)); };
  if (which.includes('all') || which.includes('f2')) {
    await load(Object.assign({ near: 3 }, W)); await ollieKg(3); await pick('least');
    await show('f2: shoving match, near 3 m, Ollie 1 t, least');
    await load(Object.assign({ near: 3, duoEffort: 'custom', duoLogKg: Math.log10(2800) }, W)); await ollieKg(3);
    await show('f2b: custom 2.8 t (state) Ollie 1 t');
    await setUse(Math.log10(2800)); await show('f2c: custom 2.8 t (slider) Ollie 1 t');
  }
  if (which.includes('all') || which.includes('f3')) {
    await load(W); await ollieKg(3); await setUse(3.544);
    await show('f3: Ollie 1 t, slider 3.544');
    const h = await T('.happens'); const m = h.match(/Walking him out[^.]*\.[^.]*\.[^.]*\.[^.]*\./); console.log('HAPPENS walk-out item: ' + (m ? m[0] : h.slice(0, 900)));
    const mm = h.match(/Its push back goes to his source[^.]*\./); console.log('PUSHBACK: ' + (mm && mm[0]));
    const bars = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay [aria-label], #duo-bay figcaption')).map((n) => n.getAttribute('aria-label') || n.textContent).filter((x) => /push/.test(x)).join(' | ')); console.log('BARS: ' + bars.slice(0, 500));
  }
  if (which.includes('all') || which.includes('f4')) {
    await load(Object.assign({ unbreakable: false, oAnchor: 'bolted' }, W)); await ollieKg(3); await pick('allout');
    await show('f4: Ollie bolted, real rock, Ollie 1 t, all-out');
  }
  if (which.includes('all') || which.includes('n10')) {
    await load(Object.assign({ anchor: 'bolted' }, W)); await pick('least');
    await show('n10: shoving match, Rex bolted, least');
  }
  if (which.includes('all') || which.includes('n12')) {
    await load(Object.assign({ anchor: 'bolted', logKg: 6, oLogKg: 6 }, W)); await pick('allout');
    await show('n12: shoving match, Rex bolted, 10^6 kg, all-out');
    const h = await T('.happens'); const m = h.match(/Bolted, Rex hands the ground[^.]*\.[^.]*\./); console.log('HAPPENS: ' + (m ? m[0] : 'none'));
    await pick('plaster'); await show('n12b: plaster preset');
  }
  if (which.includes('all') || which.includes('u1')) {
    await load({ duoOpen: true, duoAction: 'arm', keepForm: false }); await ollieKg(3); await pick('allout');
    const h = await T('.happens'); const m = h.match(/[^.]*feet hold less than[^.]*\./g); console.log('=== u1 HAPPENS: ' + (m ? m.join(' | ') : 'none')); console.log('STATUS: ' + await T('.status-row'));
  }
  if (which.includes('all') || which.includes('u3')) {
    await load(W); await ollieKg(3); await pick('allout');
    const bars = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay *')).filter((n) => n.children.length === 0 && /push/.test(n.textContent)).map((n) => n.textContent.trim()).join(' | ')); console.log('=== u3 leaf texts with push: ' + bars.slice(0, 900));
    const al = await all(); const m = al.match(/Strength, footing and push: [^.]*\./); console.log('CAPTION: ' + (m && m[0]));
  }
  if (which.includes('all') || which.includes('u10')) {
    await load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both', anchor: 'bolted', logKg: 6, oLogKg: 6 }); await pick('plaster');
    await show('u10: Both at once, Rex bolted, 10^6, plaster');
  }
  console.log('page errors: ' + errs.length + ' ' + errs.slice(0, 3).join(' | '));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
