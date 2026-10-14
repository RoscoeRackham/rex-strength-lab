const {open}=require('./pg.js');
(async()=>{
  const {browser,page,load,pick,text,errs}=await open();
  const verdict=(id)=>page.evaluate(i=>((document.getElementById(i).querySelector('.verdict')||{}).textContent||'').replace(/\s+/g,' '),id);
  const body=(id)=>page.evaluate(i=>{const b=document.getElementById(i);return Array.from(b.querySelectorAll('.happens li, .happens p, .tiles, .status-row')).map(n=>n.textContent.replace(/\s+/g,' ')).join(' ## ');},id);
  // F3: partner toss fast, wrestle throw fast, game of catch fast at 100%
  for (const a of [0.5,1]) {
    await load({duoOpen:true,duoAction:'catch',cObj:'partner',cStyle:'hard',logKg:16,airAbsorb:a,mode:'comic'}); await pick('#duo-effort','allout');
    console.log('TOSS 1e16 share',a,'VERDICT:',await verdict('duo-bay'));
    const t=await text('duo-bay'); console.log('   bend/straight/galaxy/solar mentions:', /straight line|bend|galaxy|solar|Sun/.test(t), (t.match(/[^.]*(straight line|bends|galaxy|solar system)[^.]*\./g)||[]).slice(0,3));
    await load({duoOpen:true,duoAction:'wrestle',wrestleMove:'throw',wAngle:30,logKg:16,airAbsorb:a,mode:'comic'}); await pick('#duo-effort','allout');
    const w=await text('duo-bay');
    console.log('WRESTLE 1e16 30deg share',a,'VERDICT:',await verdict('duo-bay'));
    console.log('   bend/galaxy/solar mentions:', (w.match(/[^.]*(bends|bend |galaxy|solar system|arcsecond)[^.]*\./g)||[]).slice(0,3));
  }
  // game of catch at 100%, very fast
  await load({duoOpen:true,duoAction:'catch',cObj:'baseball',cStyle:'hard',cLogD:2,logKg:16,airAbsorb:1,mode:'comic'}); await pick('#duo-effort','allout');
  const g=await text('duo-bay'); console.log('CATCH baseball 1e16 100%: VERDICT', (await verdict('duo-bay')).slice(0,400)); console.log('   bend mentions:', (g.match(/[^.]*(bends|bend |arcsecond)[^.]*\./g)||[]).slice(0,3));
  // F4: partner toss at 1000 t dial plaster preset; and sand 90.7 t
  await load({duoOpen:true,duoAction:'catch',cObj:'partner',cStyle:'hard',logKg:6,mode:'comic'}); await pick('#duo-effort','plaster');
  console.log('TOSS 1e6 plaster: effort', ((await page.evaluate(()=>document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g,' ')))).slice(0,400));
  let tb=await body('duo-bay'); console.log('   bay body:', tb.slice(0,1500)); console.log('   shaking text present:', /kg·m\/s|kg m\/s|plaster may crack out to|shakes the ground/.test(tb));
  await load({duoOpen:true,duoAction:'catch',cObj:'partner',cStyle:'hard',logKg:Math.log10(90700),surface:'sand',mode:'comic'}); await pick('#duo-effort','allout');
  console.log('TOSS sand 90.7t VERDICT:', await verdict('duo-bay')); tb=await body('duo-bay'); console.log('   body:', tb.slice(0,1200));
  console.log('errs',errs); await browser.close();
})();
