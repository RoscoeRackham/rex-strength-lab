const H = require('./h.js'); const fs = require('fs');
(async () => {
  const page = await H.open(1280, 900);
  for (const [n, st] of [['def', {}], ['big', { logKg: 15 }], ['huge', { logKg: 23 }]]) {
    await H.load(page, st);
    const t = await page.evaluate(() => { const b = document.body.cloneNode(true); b.querySelectorAll('script,style,#bay,#duo-bay,#powers').forEach((x) => x.remove()); b.querySelectorAll('li,p,div,summary,h3,h4,tr').forEach((x) => x.append('\n')); return b.textContent.replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n'); });
    fs.writeFileSync(H.DIR + '/txt/outside_' + n + '.txt', t);
  }
  await H.close();
})();
