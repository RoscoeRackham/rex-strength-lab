const {open,settle,text,chromium}=require('./page.js');
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const pg=await open(browser,{duoOpen:true,duoAction:'collide',anchor:'bolted'});
  await pg.selectOption('#duo-effort','allout'); await settle(pg);
  const t=await pg.evaluate(()=>document.body.innerText);
  console.log(t.split('\n').filter(l=>/real physics says|shakes the ground: plaster/.test(l)).map(l=>l.slice(0,500)).join('\n')||'(not found)');
  await browser.close();
})();
