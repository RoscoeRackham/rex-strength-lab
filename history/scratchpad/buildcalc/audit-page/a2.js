const fs = require('fs');
const { chromium, CHROME, open } = require('./lib.js');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p, errs } = await open(browser, 390, 844, 'light');
  const ids = await p.evaluate(() => window.BUILD_DATA.builds.map(b => b.id));
  const out = {};
  for (const units of ['imperial', 'metric']) {
    await p.click(units === 'imperial' ? '#uImp' : '#uMet');
    for (const id of ids) {
      await p.selectOption('#buildSelect', id);
      const r = await p.evaluate(() => {
        const o = [];
        document.querySelectorAll('body *').forEach(el => {
          const rc = el.getBoundingClientRect();
          if (rc.width && rc.right > innerWidth + 0.5) {
            let a = el.parentElement, clipped = false;
            while (a && a !== document.body) { const cs = getComputedStyle(a); if (cs.overflowX !== 'visible') { clipped = true; break; } a = a.parentElement; }
            if (!clipped) o.push(el.tagName + '.' + el.className + ' ' + Math.round(rc.right) + ' ' + (el.textContent||'').slice(0,40));
          }
        });
        // elements whose content overflows its own box horizontally (text clipping)
        const clip = [];
        document.querySelectorAll('.sheet *, .panel *').forEach(el => {
          const cs = getComputedStyle(el);
          if (!el.classList.contains('sr') && (cs.overflowX === 'hidden' || cs.textOverflow === 'ellipsis') && el.scrollWidth > el.clientWidth + 1) clip.push(el.className + ': ' + el.textContent.slice(0, 50));
        });
        return { text: document.querySelector('.panel').innerText + '\n=====\n' + document.getElementById('sheet').innerText, sw: document.documentElement.scrollWidth, over: o, clip };
      });
      out[units + ':' + id] = r;
      if (r.sw > 390 || r.over.length) console.log('OVER', units, id, r.sw, r.over.slice(0, 5));
      if (r.clip.length) console.log('CLIP', units, id, r.clip.slice(0, 6));
    }
  }
  fs.writeFileSync('alltext.json', JSON.stringify(out, null, 1));
  console.log('errs', errs);
  await ctx.close(); await browser.close();
})();
