const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const OUT = __dirname;
(async () => {
  const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
  for (const scheme of ['light', 'dark']) {
    const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>:root{color-scheme:' + scheme + '}body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
    const prev = path.join(OUT, 'prev-' + scheme + '.html');
    fs.writeFileSync(prev, wrapped);
    const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: scheme, deviceScaleFactor: 2 });
    await page.goto('file://' + prev);
    await page.evaluate(() => { try { localStorage.removeItem('rex-lab-v1'); } catch (e) {} });
    await page.reload();
    await page.waitForTimeout(5000);
    const info = await page.evaluate(() => {
      const mks = [...document.querySelectorAll('#ladder-viz .mk')];
      return mks.map((g) => { const c = g.querySelector('.ring'); return { key: g.dataset.key, label: g.getAttribute('aria-label'), cy: +c.getAttribute('cy'), cx: +c.getAttribute('cx') }; });
    });
    const cap = info.find((i) => /Captain/.test(i.label));
    const sh = info.find((i) => /Strongest human/i.test(i.label));
    console.log(scheme, 'markers', info.length, 'cap', JSON.stringify(cap), 'strongest', JSON.stringify(sh));
    // focus via keyboard: click body then tab until cap
    await page.evaluate(() => document.querySelector('#ladder-viz').scrollIntoView({ block: 'center' }));
    const capSel = '#ladder-viz [data-key="' + cap.key + '"]';
    // use keyboard to get :focus-visible
    await page.focus('#ladder-viz .mk'); // first marker
    let n = 0;
    while (n < 40) {
      const k = await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('data-key'));
      if (k === cap.key) break;
      await page.keyboard.press('Tab'); n++;
    }
    await page.waitForTimeout(200);
    const st = async (tag) => page.evaluate(([sel, tag]) => {
      const g = document.querySelector(sel); const ring = g.querySelector('.ring');
      const cs = getComputedStyle(g), rc = getComputedStyle(ring);
      return { tag, active: document.activeElement === g, activeKey: document.activeElement && document.activeElement.getAttribute('data-key'), fv: g.matches(':focus-visible'), outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth, ringStroke: rc.stroke, ringW: rc.strokeWidth, r: ring.getAttribute('r') };
    }, [capSel, tag]);
    console.log(JSON.stringify(await st('focused-before-enter')));
    const clipFor = async () => {
      const box = await page.evaluate((sel) => { const c = document.querySelector(sel).querySelector('.ring').getBoundingClientRect(); return { x: c.x, y: c.y, w: c.width, h: c.height }; }, capSel);
      return { x: box.x - 60, y: box.y - 40, width: 140, height: 90 };
    };
    await page.screenshot({ path: path.join(OUT, scheme + '-1-focused.png'), clip: await clipFor() });
    await page.screenshot({ path: path.join(OUT, scheme + '-1-focused-wide.png'), clip: { ...(await clipFor()), x: (await clipFor()).x - 400, width: 900, y: (await clipFor()).y - 40, height: 170 } });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(600);
    console.log(JSON.stringify(await st('after-enter')));
    await page.screenshot({ path: path.join(OUT, scheme + '-2-after-enter.png'), clip: await clipFor() });
    await page.screenshot({ path: path.join(OUT, scheme + '-2-after-enter-wide.png'), clip: { ...(await clipFor()), x: (await clipFor()).x - 400, width: 900, y: (await clipFor()).y - 40, height: 170 } });
    // now blur (unfocused) for comparison, current setting at cap
    await page.evaluate(() => document.activeElement.blur());
    await page.mouse.move(5, 5);
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(OUT, scheme + '-3-after-enter-blurred.png'), clip: await clipFor() });
    // unfocused default (reload)
    await page.evaluate(() => { try { localStorage.removeItem('rex-lab-v1'); } catch (e) {} });
    await page.reload(); await page.waitForTimeout(5000);
    await page.evaluate(() => document.querySelector('#ladder-viz').scrollIntoView({ block: 'center' }));
    await page.screenshot({ path: path.join(OUT, scheme + '-0-unfocused.png'), clip: await clipFor() });
    // sound barrier marker with Space
    const sb = await page.evaluate(() => { const g = [...document.querySelectorAll('#ladder-viz .mk')].find((g) => /sound barrier/i.test(g.getAttribute('aria-label'))); return g && g.dataset.key; });
    console.log('sound barrier key', sb);
    if (sb) {
      const sel = '#ladder-viz [data-key="' + sb + '"]';
      await page.focus('#ladder-viz .mk'); n = 0;
      while (n < 40) { const k = await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('data-key')); if (k === sb) break; await page.keyboard.press('Tab'); n++; }
      await page.keyboard.press(' '); await page.waitForTimeout(600);
      const r = await page.evaluate((sel) => { const g = document.querySelector(sel); return { active: document.activeElement === g, fv: g.matches(':focus-visible'), outline: getComputedStyle(g).outlineStyle, stroke: getComputedStyle(g.querySelector('.ring')).stroke }; }, sel);
      console.log('sound barrier after space', JSON.stringify(r));
      const box = await page.evaluate((sel) => { const c = document.querySelector(sel).querySelector('.ring').getBoundingClientRect(); return { x: c.x, y: c.y }; }, sel);
      await page.screenshot({ path: path.join(OUT, scheme + '-4-sb-after-space.png'), clip: { x: box.x - 60, y: box.y - 40, width: 140, height: 90 } });
      await page.screenshot({ path: path.join(OUT, scheme + '-4-sb-after-space-wide.png'), clip: { x: box.x - 460, y: box.y - 80, width: 900, height: 170 } });
    }
    await browser.close();
  }
})();
