const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/index.html');
  await p.waitForTimeout(5000);
  const r = await p.evaluate(() => {
    const card = [...document.querySelectorAll('article.feat')].find(a => a.textContent.includes('Milo'));
    const links = [...card.querySelectorAll('a')].map(a => [a.textContent, a.href]);
    const all = [...document.querySelectorAll('a')].map(a => a.href);
    return { text: card.innerText, links, athen: all.filter(h => /tlg0008|Athenaeus/i.test(h)), quint: all.filter(h => /phi1002/.test(h)).length, wikiMilo: all.filter(h => /Milo/.test(h)), bodyAthen: (document.body.innerText.match(/Athenaeus/g)||[]).length };
  });
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
