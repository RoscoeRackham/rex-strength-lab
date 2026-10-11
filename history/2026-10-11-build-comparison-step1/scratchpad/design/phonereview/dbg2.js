const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const base='/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/';
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await p.goto('file://'+base+'reader/mock.html'); await p.waitForTimeout(3000);
  for (const [y,w] of [[3000,100],[5000,400],[7450,400],[9000,1200]]) {
    await p.evaluate(y=>window.scrollTo(0,y), y); await p.waitForTimeout(w);
    const blank = await p.evaluate(()=>{ const el=document.elementFromPoint(250,500); return el? (el.tagName+'.'+el.className).slice(0,60):'none'; });
    await p.screenshot({path:`t-${y}.png`}); console.log(y,w,blank);
  }
  await b.close();
})();
