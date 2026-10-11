const fs=require('fs');const path=require('path');
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{
 const f=path.join(__dirname,'page.html');
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1280,height:900}});
 await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
 await p.goto('file://'+f);await p.waitForTimeout(800);
 const out=await p.evaluate(()=>[...document.querySelectorAll('.chip')].filter(c=>/disputed/i.test(c.textContent)).map(c=>({cls:c.className,text:c.textContent,title:c.title,ctx:c.parentElement.textContent.slice(0,120)})));
 console.log(JSON.stringify(out,null,1));
 const statuses=await p.evaluate(()=>{const s={};document.querySelectorAll('.chip').forEach(c=>{s[c.textContent.trim().toLowerCase()]=(s[c.textContent.trim().toLowerCase()]||0)+1});return s;});
 console.log(statuses);
 await b.close();})();
