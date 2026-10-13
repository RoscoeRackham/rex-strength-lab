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
    const t=await page.evaluate(()=>document.getElementById('bay').innerText);
    await ctx.close(); return t.replace(/[  ]/g,' ');
  }
  const sentences=(t,re)=>{const out=[];for(const m of t.matchAll(/[^.\n]*(?:\.\d[^.\n]*)*[^.\n]*/g)){ if(re.test(m[0])) out.push(m[0].trim()); } return out;};
  const grab=(t,re,n=300)=>{const out=[];let i=0;const g=new RegExp(re.source,'g');for(const m of t.matchAll(g)) out.push(t.slice(Math.max(0,m.index-40), m.index+n).replace(/\n/g,' ⏎ '));return out;};
  let t=await run({action:'weight',H:500,m:9.6e28,build:'rex'});
  console.log('--- weight 500 m 9.6e28 kg'); grab(t,/For this Rex/,260).forEach(l=>console.log(l)); grab(t,/Energy released/,160).forEach(l=>console.log(l));
  t=await run({action:'weight',H:500,m:9e28,build:'rex'});
  console.log('--- weight 500 m 9e28 kg'); grab(t,/For this Rex/,260).forEach(l=>console.log(l));
  t=await run({action:'weight',m:1e25});
  console.log('--- weight 1e25 kg'); grab(t,/blow|holds the Earth together/,40).forEach(l=>console.log(l));
  grab(t,/For this Rex/,220).forEach(l=>console.log(l));
  t=await run({action:'weight',m:1e18});
  console.log('--- weight 1e18 kg'); grab(t,/For this Rex/,260).forEach(l=>console.log(l));
  for (const mode of ['gradual','instant']) for (const g of ['krakatoa','chicxulub']) {
    t=await run({action:'weight'}, async p=>{ await p.click('#tab-weight').catch(()=>{}); await p.evaluate(()=>{document.getElementById('powers').open=true}); await p.selectOption('#absorb',mode); await p.waitForTimeout(400); await p.click('#grow-what-'+g); await p.waitForTimeout(800); });
    console.log('--- growth',mode,g); grab(t,/which becomes|It becomes|Mix \(default\)|Pure size|Pure density/,170).forEach(l=>console.log(l));
  }
  console.log('console errors', errs.length, errs.slice(0,3));
  await browser.close();
})();
