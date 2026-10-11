const pw = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1500);
  const txt = await p.evaluate(() => document.body.innerText);
  for (const re of [/[^\n]*elite[^\n]*/gi, /[^\n]*punch fist[^\n]*/gi]) {
    const m = txt.match(re); console.log(re, m ? m.map(s=>s.slice(0,400)) : m);
  }
  // is it visible (in DOM text, possibly collapsed sections)?
  const vis = await p.evaluate(() => {
    const out = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) if (/elite/i.test(n.textContent)) {
      const el = n.parentElement; const r = el.getBoundingClientRect();
      let d = el.closest('details'); out.push({tag: el.tagName, text: n.textContent.slice(0,120), w: r.width, h: r.height, inDetails: !!d, open: d ? d.open : null});
    }
    return out;
  });
  console.log(JSON.stringify(vis, null, 1));
  await b.close();
})();
