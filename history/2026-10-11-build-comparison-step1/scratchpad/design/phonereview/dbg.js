const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const base='/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/';
  for (const dpr of [1,2]) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: dpr });
  const errs=[]; p.on('console', m=>{ if(m.type()==='error') errs.push(m.text())}); p.on('pageerror', e=>errs.push(String(e)));
  await p.goto('file://'+base+'reader/mock.html'); await p.waitForTimeout(1500);
  const info = await p.evaluate(()=>({h:document.documentElement.scrollHeight, stops:[...document.querySelectorAll('section, .stop')].slice(0,40).map(s=>[s.id||s.className, Math.round(s.getBoundingClientRect().top+scrollY), Math.round(s.getBoundingClientRect().height)]), cv: [...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).contentVisibility==='auto').length}));
  console.log('dpr',dpr, JSON.stringify(info), errs);
  await p.evaluate(()=>window.scrollTo(0,7450)); await p.waitForTimeout(1500);
  await p.screenshot({path:`v-reader-dpr${dpr}.png`});
  await p.close();
  }
  await b.close();
})();
