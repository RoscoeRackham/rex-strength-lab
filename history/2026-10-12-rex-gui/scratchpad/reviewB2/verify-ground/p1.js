const {open,settle,text,chromium}=require('./page.js');
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const pg=await open(browser,{action:'stomp',surface:'sand',logKg:12});
  await pg.selectOption('#effort','windows'); await settle(pg);
  const t=await pg.evaluate(()=>document.body.innerText);
  const lines=t.split('\n').filter(l=>/Hole|hole|Unbreakable|windows|shatter|houses|Energy into|blast|foot stops|Effort/i.test(l));
  console.log(lines.slice(0,40).join('\n'));
  console.log('ERRORS',pg.errs);
  await browser.close();
})();
