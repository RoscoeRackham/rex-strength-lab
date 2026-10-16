const path=require('path'),{pathToFileURL}=require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [pg, ...rest] = process.argv.slice(2);
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto(pathToFileURL(path.resolve(pg)).href);
const settle=async()=>{for(let i=0;i<160;i++){const busy=await p.evaluate(()=>/working it out|Working out/i.test(document.getElementById('duo-bay').textContent));if(!busy)return;await p.waitForTimeout(250);}};
for (const [label, extra, lvl, eff] of [['on',{},'4.5','allout'],['on-least',{},'4.5','least'],['recoff',{ownRecoil:false},'4.5','allout'],['unboff',{unbreakable:false},'4.5','allout'],['on-1e9',{logKg:9},'8.5','allout'],['off',{airAbsorb:0,keepForm:false,unbreakable:false,ownRecoil:false},'4.5','allout'],['on-plaster',{},'4.5','plaster']]) {
  await p.evaluate((s)=>{localStorage.clear();localStorage.setItem('rex-lab-v1',JSON.stringify(Object.assign({saveV:2,duoOpen:true,duoAction:'arm'},s)))},extra);
  await p.reload();await p.waitForTimeout(900);await settle();
  await p.evaluate(()=>{document.getElementById('ollie-setup').open=true});await p.click('#o-own');await p.waitForTimeout(300);
  await p.evaluate((v)=>{const s=document.getElementById('o-strength');s.value=v;s.dispatchEvent(new Event('input',{bubbles:true}));s.dispatchEvent(new Event('change',{bubbles:true}))},lvl);
  await p.waitForTimeout(900);await settle();
  if(eff!=='least'){await p.selectOption('#duo-effort',eff);await p.waitForTimeout(400);await settle();}
  const t=await p.evaluate(()=>{const b=document.getElementById('duo-bay');const tx=(n)=>n.textContent.replace(/\s+/g,' ').trim();return {v:tx(b.querySelector('.verdict')),st:[...b.querySelectorAll('.status-row .status')].map(tx),ti:[...b.querySelectorAll('.tile')].map(tx),e:[...b.querySelectorAll('.effort-read p')].map(tx),h:[...b.querySelectorAll('.happens > li')].map(tx),m:[...b.querySelectorAll('details.math .eq')].map(tx)}});
  console.log('=====',label);console.log(JSON.stringify(t,null,1));
}
await b.close();})();
