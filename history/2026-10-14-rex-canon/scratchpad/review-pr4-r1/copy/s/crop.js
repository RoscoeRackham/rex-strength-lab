const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{
 const [,,file,st,sel,out,w,scheme]=process.argv;
 const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const page=await browser.newPage({viewport:{width:+(w||390),height:844},colorScheme:scheme||'dark'});
 await page.goto(pathToFileURL(path.resolve(file)).href);
 await page.evaluate((s)=>{localStorage.clear();localStorage.setItem('rex-lab-v1',s);},st);
 await page.reload(); await page.waitForTimeout(6000);
 const h=await page.evaluateHandle((s)=>{const n=eval(s);n.scrollIntoView();return n;},sel);
 await page.waitForTimeout(300);
 await h.asElement().screenshot({path:out});
 await browser.close();
})();
