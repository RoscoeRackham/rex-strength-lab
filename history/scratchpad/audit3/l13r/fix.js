const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const OUT = __dirname;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const scheme of ['light', 'dark']) {
    for (const variant of ['A-outline', 'B-rect-ring']) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: scheme, deviceScaleFactor: 2 });
      await page.goto('file://' + path.join(OUT, 'prev-' + scheme + '.html'));
      await page.evaluate(() => { try { localStorage.removeItem('rex-lab-v1'); } catch (e) {} });
      await page.reload(); await page.waitForTimeout(5000);
      await page.evaluate((variant) => {
        // drop the outline:none rule
        for (const ss of document.styleSheets) { try { const rules = ss.cssRules; for (let i = rules.length - 1; i >= 0; i--) if (rules[i].selectorText === '.ladder-wrap svg .mk:focus') ss.deleteRule(i); } catch (e) {} }
        if (variant === 'B-rect-ring') {
          const s = document.createElement('style');
          s.textContent = '.ladder-wrap svg .mk:focus-visible{outline:none}.ladder-wrap svg .mk:focus-visible rect{stroke:var(--accent);stroke-width:2px;rx:4px}.ladder-wrap svg .mk:focus-visible .ring{stroke:var(--accent);stroke-width:3px;r:7px}';
          document.head.append(s);
        }
      }, variant);
      await page.evaluate(() => document.querySelector('#ladder-viz').scrollIntoView({ block: 'center' }));
      for (const target of ['L:cap', 'R:boom']) {
        await page.focus('#ladder-viz .mk');
        let n = 0;
        while (n < 40) { const k = await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('data-key')); if (k === target) break; await page.keyboard.press('Tab'); n++; }
        await page.keyboard.press('Enter'); await page.waitForTimeout(600);
        const r = await page.evaluate((t) => { const g = document.querySelector('[data-key="' + t + '"]'); return { active: document.activeElement === g, outline: getComputedStyle(g).outlineStyle + ' ' + getComputedStyle(g).outlineWidth }; }, target);
        const box = await page.evaluate(() => { const c = document.querySelector('#ladder-viz svg').getBoundingClientRect(); return { x: c.x, y: c.y, w: c.width }; });
        const dot = await page.evaluate((t) => { const c = document.querySelector('[data-key="' + t + '"] .ring').getBoundingClientRect(); return c.y; }, target);
        console.log(scheme, variant, target, JSON.stringify(r));
        await page.screenshot({ path: path.join(OUT, `fix-${scheme}-${variant}-${target.replace(':', '')}.png`), clip: { x: box.x, y: dot - 90, width: box.w, height: 180 } });
      }
      await page.close();
    }
  }
  await browser.close();
})();
