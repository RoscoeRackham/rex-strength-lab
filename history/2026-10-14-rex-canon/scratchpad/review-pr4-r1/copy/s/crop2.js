const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{
 const [,,file,out,w,scheme]=process.argv;
 const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const page=await browser.newPage({viewport:{width:+w,height:900},colorScheme:scheme});
 await page.goto(pathToFileURL(path.resolve(file)).href);
 await page.evaluate(()=>{localStorage.clear();});
 await page.reload(); await page.waitForTimeout(2500);
 await page.evaluate(()=>{document.getElementById('powers').open=true;});
 await page.waitForTimeout(300);
 const el=await page.$('#nkb-lbl'); const f=await el.evaluateHandle(n=>n.closest('.field'));
 await f.asElement().scrollIntoViewIfNeeded();
 const box=await f.asElement().boundingBox();
 await page.screenshot({path:out,clip:{x:Math.max(0,box.x-10),y:box.y-120,width:Math.min(+w,box.width+20),height:box.height+200}});
 const ov=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 console.log('overflow',ov);
 await browser.close();
})();
