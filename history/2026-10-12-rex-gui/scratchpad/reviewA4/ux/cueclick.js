// A mouse click on a control showing through the cue's fade
const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  for (const [w, h, label] of [[1280, 900, 'Neutron star'], [1366, 768, null]]) {
    const { page } = await open(browser, { w, h });
    await page.evaluate(() => window.scrollTo(0, 400)); await page.waitForTimeout(400);
    const r = await page.evaluate((label) => {
      const cue = document.getElementById('more-below').getBoundingClientRect();
      const aside = document.querySelector('.panel-controls');
      const cands = Array.from(aside.querySelectorAll('button.chip, input, select, summary')).filter((n) => { const b = n.getBoundingClientRect(); return b.height && b.top < cue.top + 0.45 * cue.height && b.bottom > cue.top + 2 && (!label || n.textContent.trim() === label); });
      const n = cands[0]; if (!n) return null; const b = n.getBoundingClientRect();
      // a point on the control that is inside the cue's still-transparent top band
      const y = Math.max(b.top + 4, Math.min(b.bottom - 4, cue.top + 0.3 * cue.height));
      return { what: n.id || n.textContent.trim(), x: b.left + b.width / 2, y, cueTop: cue.top, ctl: [b.top, b.bottom], hit: document.elementFromPoint(b.left + b.width / 2, y).id || document.elementFromPoint(b.left + b.width / 2, y).tagName, rho: document.getElementById('density-big').textContent };
    }, label);
    if (!r) { console.log(w + 'x' + h, 'no control under the fade'); await page.context().close(); continue; }
    await page.mouse.click(r.x, r.y);
    await page.waitForTimeout(900);
    const after = await page.evaluate(() => ({ rho: document.getElementById('density-big').textContent, asideScrollTop: Math.round(document.querySelector('.panel-controls').scrollTop), focus: document.activeElement.id || document.activeElement.tagName }));
    console.log(w + 'x' + h, JSON.stringify(r), '-> after click', JSON.stringify(after));
    await page.screenshot({ path: __dirname + '/shots/cueclick-' + w + '.png', clip: { x: r.x - 160, y: r.cueTop - 120, width: 330, height: 180 } });
    await page.context().close();
  }
  await browser.close();
})();
