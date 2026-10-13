const {open}=require('./pg.js');
(async()=>{
  const {browser,page,load,pick,text,errs}=await open();
  await load({action:'throw',obj:'car',angle:90,logKg:11,mode:'comic'});
  await pick('#effort','allout');
  let t=await text('bay');
  const m=t.match(/[^.]*can bear[^.]*\.[^.]*\./g); console.log('THROW 1e11 allout:', m);
  const sh=t.match(/[^.]*(plaster|kg m\/s)[^.]*\./g); console.log('shake bits:', sh&&sh.slice(0,6));
  await load({action:'throw',obj:'car',angle:90,logKg:7,mode:'comic'});
  await pick('#effort','allout');
  t=await text('bay'); console.log('THROW 1e7 allout:', t.match(/[^.]*can bear[^.]*\.[^.]*\./g), (t.match(/[^.]*kg m\/s[^.]*\./g)||[]).slice(0,3));
  await load({action:'throw',obj:'car',angle:90,logKg:7,mode:'comic'});
  await pick('#effort','plaster');
  t=await text('bay'); console.log('THROW 1e7 plaster preset:', (t.match(/Effort:[^]*?\./)||[''])[0].slice(0,300), '|', (t.match(/[^.]*(not reachable|Even all-out|can’t|never)[^.]*\./g)||[]).slice(0,3));
  await load({duoOpen:true,duoAction:'wrestle',wrestleMove:'throw',wAngle:90,logKg:16,mode:'comic'});
  await pick('#duo-effort','allout');
  t=await text('duo-bay'); console.log('WRESTLE 1e16 90:', t.match(/[^.]*can bear[^.]*\.[^.]*\./g));
  console.log('errs',errs); await browser.close();
})();
