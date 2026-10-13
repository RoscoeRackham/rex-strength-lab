const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const R='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewC2/verify-copy/repo/rex-strength-lab/';
const url='file://'+R+'dist/index.html';
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const errs=[];
  async function run(state, after, width=1280){
    const ctx=await browser.newContext({viewport:{width,height:900}});
    const page=await ctx.newPage();
    page.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
    await page.addInitScript(s=>{try{localStorage.setItem('rex-lab-v1',s)}catch(e){}}, JSON.stringify(state));
    await page.goto(url); await page.waitForTimeout(1500);
    if(after) await after(page);
    const t=await page.evaluate(()=>document.querySelector('#bay')?document.querySelector('#bay').innerText:document.body.innerText);
    await ctx.close(); return t.replace(/ | /g,' ');
  }
  const pick=(t,re)=>t.split('\n').filter(l=>re.test(l));
  // copy-2: weight tab at 500 m near BH
  let t=await run({action:'weight',H:500,m:9.6e28,build:'rex'});
  console.log('--- weight 500 m 9.6e28 kg'); pick(t,/For this Rex|Energy released|Jupiter|released/).forEach(l=>console.log(l.slice(0,400)));
  t=await run({action:'weight',H:500,m:9e28,build:'rex'});
  console.log('--- weight 500 m 9e28 kg'); pick(t,/For this Rex/).forEach(l=>console.log(l.slice(0,400)));
  // copy-5: weight 1e25 kg at default height
  t=await run({action:'weight',m:1e25});
  console.log('--- weight 1e25 kg'); pick(t,/blow|holds the Earth together/).forEach(l=>console.log(l.slice(0,500)));
  t=await run({action:'weight',m:1e18});
  console.log('--- weight 1e18 kg'); pick(t,/blow|holds the Earth together/).forEach(l=>console.log(l.slice(0,500)));
  // copy-4: growth what-if
  for (const mode of ['gradual','instant']) for (const g of ['krakatoa','chicxulub']) {
    t=await run({action:'weight'}, async p=>{ await p.selectOption('#absorb',mode); await p.waitForTimeout(400); await p.click('#grow-what-'+g); await p.waitForTimeout(600); });
    console.log('--- growth',mode,g); pick(t,/which becomes|It becomes|^Mix|^Pure|Mix \(default\)|Pure size|Pure density/).forEach(l=>console.log(l.slice(0,400)));
  }
  console.log('console errors', errs.length, errs.slice(0,3));
  await browser.close();
})();
