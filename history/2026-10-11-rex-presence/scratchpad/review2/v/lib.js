const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL='file://'+__dirname+'/preview.html';
async function open(opts={}){
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const page=await browser.newPage({viewport:{width:opts.w||1280,height:opts.h||900},colorScheme:opts.scheme||'light'});
  const errs=[]; page.on('pageerror',e=>errs.push(e.message)); page.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await page.goto(URL); await page.waitForTimeout(opts.wait||1500);
  return {browser,page,errs};
}
module.exports={open,URL};
