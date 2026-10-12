// claims harness: node h.js spec.json [brief]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const PREV = __dirname + '/snap2/dist/preview.html';
const OUT = __dirname + '/';
async function run(specs) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const results = [];
  for (const spec of specs) {
    const ctx = await browser.newContext({ viewport: { width: spec.w || 1280, height: 900 } });
    const st = Object.assign({}, spec.state || {});
    if (spec.tab) { if (['arm','wrestle','catch','collide'].includes(spec.tab)) { st.group = 'duo'; st.duoAction = spec.tab; } else { st.group = 'solo'; st.action = spec.tab; } }
    await ctx.addInitScript((s) => { try { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('x', '1'); } } catch (e) {} }, st);
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(pathToFileURL(PREV).href);
    await page.waitForTimeout(400);
    const sel = async (id, v) => { await page.evaluate(([id, v]) => { const e = document.getElementById(id); if (!e) throw new Error('no #' + id); e.value = v; e.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]); await page.waitForTimeout(150); };
    if (spec.switches) for (const [id, on] of Object.entries(spec.switches)) { await page.evaluate(([id, on]) => { const e = document.getElementById(id); e.checked = on; e.dispatchEvent(new Event('change', { bubbles: true })); }, ['sw-' + id, on]); await page.waitForTimeout(100); }
    if (spec.absorb) await sel('absorb', spec.absorb);
    if (spec.growT) await sel('grow-t', String(spec.growT));
    if (spec.halfLife) await sel('half-life', String(spec.halfLife));
    if (spec.effort) await sel('effort', spec.effort);
    if (spec.duoEffort) await sel('duo-effort', spec.duoEffort);
    if (spec.clicks) for (const t of spec.clicks) { await page.evaluate((v) => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === v); if (b) b.click(); else throw new Error('no button ' + v); }, t); await page.waitForTimeout(200); }
    if (spec.step != null) { await page.evaluate((v) => { const e = document.getElementById('step-effort'); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(spec.step)); await page.waitForTimeout(400); }
    if (spec.sels) for (const [id, v] of spec.sels) await sel(id, v);
    for (let i = 0; i < 300; i++) { const t = await page.evaluate(() => document.querySelector('#bay').innerText); if (!/Working out the courtesy ceiling/.test(t)) break; await page.waitForTimeout(100); }
    await page.waitForTimeout(spec.wait || 300);
    await page.evaluate(() => document.querySelectorAll('#bay details.haz-list').forEach((d) => { d.open = true; }));
    const text = spec.brief ? await page.evaluate(() => [...document.querySelectorAll('#bay > .verdict, #bay > .status-row, #bay .effort-read, #bay > .callout')].map((e) => '[' + e.className.split(' ')[0] + '] ' + e.innerText.replace(/\n+/g, ' | ')).join('\n'))
      : await page.evaluate(() => { const b = document.querySelector('#bay').cloneNode(true); b.querySelectorAll('svg, select, .bay-controls').forEach((x) => x.remove()); b.querySelectorAll('details.math').forEach((d) => d.setAttribute('open', '')); document.body.append(b); const t = b.innerText; b.remove(); return t; });
    if (spec.shot) await (await page.$('main.panel')).screenshot({ path: OUT + spec.shot + '.png' });
    results.push({ name: spec.name || spec.tab, text, errs });
    await ctx.close();
  }
  await browser.close();
  return results;
}
module.exports = { run };
if (require.main === module) {
  const specs = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8'));
  run(specs).then((rs) => { for (const r of rs) { console.log('=================== ' + r.name + (r.errs.length ? ' ERRS ' + JSON.stringify(r.errs) : '')); console.log(r.text); } }).catch((e) => { console.error('FAIL', e); process.exit(1); });
}
