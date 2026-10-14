const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const D = __dirname;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const file of ['branch.html', 'main.html']) for (const [w, h] of [[1280, 800], [1280, 900], [1440, 900], [1920, 1080]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto('file://' + D + '/' + file); await p.waitForTimeout(1500);
    const m = async () => p.evaluate(() => {
      const a = document.querySelector('.panel-controls'), r = a.getBoundingClientRect();
      const top = (sel) => { const n = document.querySelector(sel); return n ? Math.round(n.getBoundingClientRect().top) : null; };
      const lastSum = [...a.querySelectorAll(':scope > details > summary, :scope > section, :scope > details')].pop();
      return { scrollY: Math.round(scrollY), box: [Math.round(r.top), Math.round(r.bottom)], ch: a.clientHeight, sh: a.scrollHeight, st: a.scrollTop,
        ground: top('#ground-sec') ?? top('#surface'), powers: top('#powers > summary') ?? top('#comic-setup > summary'), setupOpen: document.getElementById('setup')?.open, lastChild: a.lastElementChild.id, lastTop: Math.round(a.lastElementChild.getBoundingClientRect().top) };
    });
    const first = await m();
    // scroll the page so the end of the rig is at the bottom of the viewport
    await p.evaluate(() => { const rig = document.querySelector('.rig'); const r = rig.getBoundingClientRect(); window.scrollTo(0, r.bottom + scrollY - innerHeight); });
    await p.waitForTimeout(300);
    const end = await m();
    // then scroll the sidebar with the wheel over it
    const box = await p.$eval('.panel-controls', a => { const r = a.getBoundingClientRect(); return { x: r.x + 100, y: Math.max(r.top + 50, 100) }; });
    await p.mouse.move(box.x, box.y); await p.mouse.wheel(0, 400); await p.waitForTimeout(300);
    const wheeled = await m();
    console.log(file, w + 'x' + h, JSON.stringify({ first, end, wheeled }));
    if (file === 'branch.html' && w === 1280 && h === 900) {
      await p.evaluate(() => { const rig = document.querySelector('.rig'); window.scrollTo(0, 400); document.querySelector('.panel-controls').scrollTop = 0; });
      await p.waitForTimeout(300);
      await p.screenshot({ path: D + '/sidebar-1280x900.png' });
    }
    await p.close();
  }
  await b.close();
})();
