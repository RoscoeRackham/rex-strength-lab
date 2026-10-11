const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const out = {};
    out.cards = [...document.querySelectorAll('.badge')].filter(b => !b.closest('tr')).map(b => {
      let n = b; for (let i = 0; i < 4 && n.parentElement; i++) { n = n.parentElement; if (n.innerText.length > 120) break; }
      return b.innerText + ' :: ' + n.innerText.slice(0, 160).replace(/\n/g, ' | ');
    }).filter(t => /Spider|Class 100|cover/.test(t));
    out.rows = [...document.querySelectorAll('#src-table tr')].map(tr => [...tr.children].map(c=>c.textContent+"["+(c.querySelector(".badge")?getComputedStyle(c.querySelector(".badge")).textTransform:"")+"]").join(" | ").replace(/\n|\t/g, ' | ')).filter(t => /Spider|Hulk & Thor/.test(t));
    return out;
  });
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
