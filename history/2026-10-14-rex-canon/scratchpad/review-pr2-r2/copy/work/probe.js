const path=require('path'),{pathToFileURL}=require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto(pathToFileURL(path.resolve('branch.html')).href);await p.evaluate(()=>{localStorage.clear();localStorage.setItem('rex-lab-v1',JSON.stringify({action:'throw'}))});await p.reload();await p.waitForTimeout(1500);
const cls=await p.evaluate(()=>{const s={};document.querySelectorAll('#bay *').forEach(n=>{const c=n.tagName.toLowerCase()+'.'+[...n.classList].join('.');s[c]=(s[c]||0)+1});return s});console.log(cls);await b.close();})();
