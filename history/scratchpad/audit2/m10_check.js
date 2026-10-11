const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const out = {};
    const intro = [...document.querySelectorAll('p.intro')].map(e => e.innerText);
    out.intro = intro.filter(t => /Verified|Estimates/.test(t));
    const cards = [...document.querySelectorAll('.badge')].map(b => ({ txt: b.innerText, cls: b.className, ctx: (b.closest('article,.feat,li,div,tr')||b.parentElement).innerText.slice(0,90).replace(/\n/g,' | ') }));
    out.badges = cards.filter(c => /Spider|Hulk and Thor|car on the cover|Class 100|DeSoto|Estimate|ESTIMATE/i.test(c.ctx + c.txt));
    out.badgeCSS = (() => { const b = document.querySelector('.badge.estimate'); return b ? getComputedStyle(b).textTransform : null; })();
    return out;
  });
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
