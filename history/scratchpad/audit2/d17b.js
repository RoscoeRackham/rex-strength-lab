const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const src = fs.readFileSync('/home/user/dino-strength-sim/dist/preview.html', 'utf8');
const variants = { d: 'Pressure kills half' };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [k, lab] of Object.entries(variants)) {
    const f = __dirname + '/prev_' + k + '.html';
    fs.writeFileSync(f, src.split('"label": "Half of people killed"').join('"label": "' + lab + '"'));
    for (const vw of [375, 1200]) {
      const p = await b.newPage({ viewport: { width: vw, height: 900 } });
      await p.goto('file://' + f);
      await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'clap', logKg: 12 })));
      await p.reload(); await p.waitForTimeout(500);
      const r = await p.evaluate((lab) => {
        const t = Array.from(document.querySelectorAll('svg text')).filter(t => /killed|kills/.test(t.textContent));
        return t.map(t => { const bb = t.getBBox(); const svg = t.ownerSVGElement.viewBox.baseVal; return { txt: t.textContent, x: Math.round(bb.x), w: Math.round(bb.width), vbw: svg.width }; });
      }, lab);
      const all = await p.evaluate(() => Array.from(document.querySelectorAll('svg[aria-label="Blast radius by damage level"] text')).filter(t => t.getBBox().x < 0).map(t => t.textContent + '@' + Math.round(t.getBBox().x)));
      console.log(k, vw, JSON.stringify(r), 'clipped:', all.join(', '));
      await p.close();
    }
  }
  await b.close();
})();
