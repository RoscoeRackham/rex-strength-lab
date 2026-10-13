// The cue's text against what is painted behind it, in every theme combination (from a screenshot of the cue band
// with its text made transparent, and the text colour)
const { open, launch } = require('./h.js');
const { PNG } = (() => { try { return require('/opt/node22/lib/node_modules/playwright-core/lib/utilsBundle.js'); } catch (e) { return {}; } })();
const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
(async () => {
  const browser = await launch();
  for (const [scheme, theme] of [['light', null], ['dark', null], ['light', 'dark'], ['dark', 'light']]) {
    const { page } = await open(browser, { w: 1280, h: 900, scheme, theme });
    await page.evaluate(() => window.scrollTo(0, 600)); await page.waitForTimeout(300);
    const info = await page.evaluate(() => {
      const cue = document.getElementById('more-below'); const cs = getComputedStyle(cue);
      const r = cue.getBoundingClientRect();
      // the text's line box
      const range = document.createRange(); range.selectNodeContents(cue); const tr = range.getBoundingClientRect();
      return { color: cs.color, bg: cs.backgroundImage, rect: [r.top, r.bottom], text: [tr.left, tr.top, tr.right, tr.bottom], ink: getComputedStyle(document.documentElement).getPropertyValue('--ink'), surface: getComputedStyle(document.documentElement).getPropertyValue('--surface') };
    });

    // background: screenshot the text's box with the text colour made transparent
    await page.addStyleTag({ content: '#more-below{color:transparent!important}' });
    const buf = await page.screenshot({ clip: { x: info.text[0], y: info.text[1], width: info.text[2] - info.text[0], height: info.text[3] - info.text[1] } });
    const sharp = null;
    // decode with the PNG decoder bundled in playwright-core
    const px = { data: await page.evaluate(async (b64) => { const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode(); const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0); return Array.from(x.getImageData(0, 0, c.width, c.height).data); }, buf.toString('base64')) };
    let lightest = [0, 0, 0], darkest = [255, 255, 255], minR = Infinity, maxR = 0;
    const col = info.color.match(/\d+/g).map(Number).slice(0, 3);
    if (px) for (let i = 0; i < px.data.length; i += 4) { const c = [px.data[i], px.data[i + 1], px.data[i + 2]]; const rr = ratio(col, c); if (rr < minR) { minR = rr; darkest = c; } if (rr > maxR) maxR = rr; }
    console.log(scheme + (theme ? ' data-theme=' + theme : ''), 'text', info.color, 'surface', info.surface.trim(), 'ink', info.ink.trim(), 'worst background pixel', darkest, 'contrast min', minR.toFixed(2), 'max', maxR.toFixed(2));
    await page.context().close();
  }
  await browser.close();
})();
