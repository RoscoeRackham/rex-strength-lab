const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const page=await browser.newPage({viewport:{width:390,height:844},colorScheme:'dark'});
 await page.goto(pathToFileURL(path.resolve(process.argv[2])).href);
 await page.evaluate(()=>{localStorage.clear();localStorage.setItem('rex-lab-v1',JSON.stringify({duoOpen:true,duoAction:'collide',colMode:'push'}));});
 await page.reload(); await page.waitForTimeout(4000);
 const r=await page.evaluate(()=>{const out=[];for(const n of document.querySelectorAll('#duo-bay svg')){const b=n.getBoundingClientRect();if(b.right>391){let p=n.parentElement,chain=[];while(p&&p.id!=='duo-bay'){const cs=getComputedStyle(p);chain.push((p.className||p.tagName)+'['+cs.overflowX+']');p=p.parentElement;}out.push({right:b.right,w:b.width,cls:n.getAttribute('class'),aria:n.getAttribute('aria-label'),chain:chain.slice(0,5)});}}return out;});
 console.log(JSON.stringify(r,null,1));
 await browser.close();
})();
