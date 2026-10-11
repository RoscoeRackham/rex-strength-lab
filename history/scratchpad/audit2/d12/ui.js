const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1500);
  const hits = await p.evaluate(() => {
    const out = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) if (/Anderson’s 11 km\/s|Air heating/.test(n.textContent)) {
      const row = n.parentElement.closest('tr') || n.parentElement;
      out.push(row.innerText.slice(0, 600));
    }
    return out;
  });
  console.log(hits.join('\n----\n'));
  await b.close();
})();
