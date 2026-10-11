const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage();await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');await p.waitForTimeout(800);
const t=await p.evaluate(()=>document.body.innerText);
for(const re of [/[^\n]*vary by[^\n]*/,/[^\n]*Granite bedrock[^\n]*\n?[^\n]*/]){const m=t.match(re);console.log(m&&m[0].slice(0,300));}
await b.close();})();
