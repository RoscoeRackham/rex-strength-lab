const fs=require('fs');const path=require('path');
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{
 const page=fs.readFileSync('/home/user/rex-strength-lab/build-comparison/dist/index.html','utf8');
 const sk='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+page+'</body></html>';
 const f=path.join(__dirname,'page.html');fs.writeFileSync(f,sk);
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1280,height:900}});
 const errs=[];p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
 await p.goto('file://'+f);await p.waitForTimeout(800);
 // open all details elements
 await p.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
 const txt=await p.evaluate(()=>document.body.innerText);
 fs.writeFileSync(path.join(__dirname,'page.txt'),txt);
 const ids=await p.evaluate(()=>[...document.querySelectorAll('.fig[data-id]')].map(e=>e.dataset.id));
 const uniq=[...new Set(ids)];const drawers={};
 for(const id of uniq){await p.evaluate(id=>document.querySelector('.fig[data-id="'+id+'"]').click(),id);await p.waitForTimeout(50);
  drawers[id]=await p.evaluate(()=>{const d=document.getElementById('drawer');return {text:d.innerText,links:[...d.querySelectorAll('a')].map(a=>[a.textContent,a.href])}});
  await p.keyboard.press('Escape');}
 fs.writeFileSync(path.join(__dirname,'drawers.json'),JSON.stringify(drawers,null,1));
 const links=await p.evaluate(()=>[...document.querySelectorAll('a')].map(a=>[a.textContent.trim(),a.href]));
 fs.writeFileSync(path.join(__dirname,'links.json'),JSON.stringify(links,null,1));
 console.log('figs',uniq.length,'errs',errs);
 await b.close();})();
