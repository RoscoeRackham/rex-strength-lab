// usage: node render.js cases.json outdir [w h scheme]
const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r1/copy/repo/rex-strength-lab';
const cases=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const outdir=process.argv[3]; fs.mkdirSync(outdir,{recursive:true});
const W=+(process.argv[4]||1280),H=+(process.argv[5]||900),scheme=process.argv[6]||'light';
const shots=process.argv[7]==='shots';
(async()=>{
  const body=fs.readFileSync(path.join(REPO,'dist','index.html'),'utf8');
  const wrapped='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+body+'</body></html>';
  const prev=path.join(outdir,'..',(REPO.includes('/base/')?'page-base.html':'page.html')); fs.writeFileSync(prev,wrapped);
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const page=await browser.newPage({viewport:{width:W,height:H},colorScheme:scheme});
  const errs=[]; page.on('pageerror',e=>errs.push('PAGEERROR '+e.message)); page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await page.goto(pathToFileURL(prev).href);
  const settle=async(id)=>{for(let i=0;i<160;i++){const busy=await page.evaluate((id)=>{const n=document.getElementById(id);return n&&/working it out|Working out/i.test(n.textContent);},id);if(!busy)return;await page.waitForTimeout(250);}console.log('TIMEOUT settle',id);};
  for(const c of cases){
    const e0=errs.length;
    await page.evaluate((x)=>{localStorage.clear();localStorage.setItem('rex-lab-v1',JSON.stringify(x));},c.state);
    await page.reload(); await page.waitForTimeout(800); await settle('bay');
    if(c.state.duoOpen){await page.waitForTimeout(300);await settle('duo-bay');}
    if(c.pick){await page.selectOption('#duo-effort',c.pick);await page.waitForTimeout(300);await settle('duo-bay');}
    if(c.eval){await page.evaluate(c.eval);await page.waitForTimeout(800);await settle('duo-bay');await settle('bay');}
    const res=await page.evaluate((sel)=>{
      const b=document.getElementById(sel||'duo-bay');
      const parts=[];
      const walk=(n)=>{ for(const ch of n.children){ const cl=ch.className||''; if(typeof cl==='string' && /verdict|status-row|tiles|happens|callout|effort-read|math|grid|cases|bars/.test(cl)){parts.push('['+cl+'] '+ch.innerText.replace(/\n+/g,' | '));} else walk(ch);} };
      walk(b);
      const overflow=document.documentElement.scrollWidth-document.documentElement.clientWidth;
      // elements overflowing the viewport horizontally
      const wide=[];for(const n of b.querySelectorAll('*')){const r=n.getBoundingClientRect();if(r.width>0&&r.right>window.innerWidth+1&&getComputedStyle(n).position!=='fixed')wide.push((n.className||n.tagName)+':'+Math.round(r.right));if(wide.length>5)break;}
      return {parts,overflow,wide,all:b.innerText};
    },c.sel);
    const ps=await page.evaluate(()=>document.getElementById('powers-sum').textContent);
    fs.writeFileSync(path.join(outdir,c.id+'.txt'),'POWERS: '+ps+'\nOVERFLOW: '+res.overflow+' '+res.wide.join(',')+'\nERRS: '+errs.slice(e0).join(' ; ')+'\n\n'+res.parts.join('\n\n')+'\n\n=====ALL=====\n'+res.all);
    if(shots) await page.screenshot({path:path.join(outdir,c.id+'.png'),fullPage:true});
    console.log(c.id,'overflow',res.overflow,res.wide.slice(0,3).join(','),'errs',errs.length-e0);
  }
  await browser.close();
})();
