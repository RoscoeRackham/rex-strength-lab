const fs=require('fs'), path=require('path');
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const {execFileSync}=require('child_process');
const page=fs.readFileSync('/home/user/rex-strength-lab/build-comparison/dist/index.html','utf8');
const sk='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style></head><body>'+page+'</body></html>';
const tmp='/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page/p.html'; fs.writeFileSync(tmp,sk);
const cache={};
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for (const [w,h,sch] of (process.argv[2]?JSON.parse(process.argv[2]):[[1280,900,'light'],[390,844,'dark']])) {
  const ctx=await b.newContext({viewport:{width:w,height:h},colorScheme:sch, deviceScaleFactor: 1});
  await ctx.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, async (route) => { const url=route.request().url(); try { if(!cache[url]) cache[url]={body:execFileSync('curl',['-sS','-A','Mozilla/5.0 Chrome/130',url],{maxBuffer:1<<24}),type:url.includes('googleapis')?'text/css':'font/woff2'}; await route.fulfill({status:200,body:cache[url].body,contentType:cache[url].type,headers:{'access-control-allow-origin':'*'}}); } catch(e){ await route.abort(); } });
  const p=await ctx.newPage(); const errs=[];
  p.on('console',m=>{if(m.type()==='error')errs.push(m.text());}); p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+tmp); await p.waitForTimeout(2500);
  const info=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,iw:window.innerWidth,h:document.documentElement.scrollHeight}));
  console.log(w,sch,JSON.stringify(info),'errors',errs.slice(0,5));
  await p.screenshot({path:`/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page/${w}-${sch}.png`,fullPage:true});
  await ctx.close();
 }
 await b.close();
})();
