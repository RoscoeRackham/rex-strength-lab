const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const page=await browser.newPage({viewport:{width:390,height:844},colorScheme:'dark'});
 await page.goto(pathToFileURL(path.resolve(process.argv[2])).href);
 await page.evaluate((s)=>{localStorage.clear();localStorage.setItem('rex-lab-v1',s);},process.argv[3]);
 await page.reload(); await page.waitForTimeout(6000);
 const r=await page.evaluate(()=>{const out=[];for(const n of document.querySelectorAll('#duo-bay *')){const b=n.getBoundingClientRect();if(b.width>0&&b.right>391){let p=n.parentElement,chain=[];let clipped=false;while(p&&p!==document.body){const cs=getComputedStyle(p);if(cs.overflowX!=='visible'){clipped=true;chain.push((p.getAttribute('class')||p.tagName)+'['+cs.overflowX+']');break;}p=p.parentElement;}out.push({tag:n.tagName,right:Math.round(b.right),txt:(n.textContent||'').slice(0,60),clipped,chain});if(out.length>8)break;}}return out;});
 console.log(JSON.stringify(r,null,0));
 await page.screenshot({path:process.argv[4],fullPage:true});
 await browser.close();
})();
