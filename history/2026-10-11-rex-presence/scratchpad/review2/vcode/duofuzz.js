const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const states = [];
for (const mode of ['comic','real']) for (const dial of [{logKg:7},{logKg:12},{inf:true}]) {
  for (const cObj of ['car','baseball','bus','person']) for (const cStyle of ['easy','hard']) states.push(Object.assign({group:'duo', duoAction:'catch', cObj, cStyle, cLogD:3, mode, inf:false}, dial));
  for (const colSrc of ['sprint','jump','stomp']) states.push(Object.assign({group:'duo', duoAction:'collide', colSrc, mode, inf:false}, dial));
  for (const wrestleMove of ['shove','throw']) states.push(Object.assign({group:'duo', duoAction:'wrestle', wrestleMove, mode, inf:false}, dial));
  states.push(Object.assign({group:'duo', duoAction:'arm', mode, inf:false}, dial));
}
(async()=>{
 const repo = process.argv[2];
 const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
 let bad = 0;
 for (const st of states) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript((s)=>{ localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
  await page.goto(pathToFileURL(__dirname+'/'+repo+'/rex-strength-lab/dist/preview.html').href);
  await page.waitForFunction(()=>{ const r=document.querySelector('.effort-read'); return r && !/working it out/i.test(r.innerText); }, null, {timeout:180000, polling:200}).catch(()=>{});
  const t = await page.evaluate(()=>{ const r=document.querySelector('.effort-read'); return r ? r.innerText.replace(/\n+/g,' / ') : 'NO READ'; });
  const claimsSafe = /no cap needed|while nothing around them breaks|Nothing in this test harms/.test(t);
  const harm = /At this effort/.test(t);
  if (claimsSafe && harm) { bad++; console.log('CONTRADICTION', JSON.stringify(st), '\n   ', t.slice(0,300)); }
  await page.close();
 }
 console.log(repo, states.length, 'states,', bad, 'contradictions');
 await browser.close();
})();
