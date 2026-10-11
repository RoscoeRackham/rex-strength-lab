const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const out = [];
    const docs = [document, ...Array.from(document.querySelectorAll('iframe')).map(f => { try { return f.contentDocument; } catch (e) { return null; } }).filter(Boolean)];
    for (const d of docs) for (const a of d.querySelectorAll('article.feat')) if (/Milo/.test(a.textContent)) out.push({ text: a.innerText, href: (a.querySelector('a') || {}).href });
    return out;
  });
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
