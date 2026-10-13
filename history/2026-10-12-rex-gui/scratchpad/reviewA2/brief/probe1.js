const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path=require('path');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  for (const w of [1280,390]) {
  const p=await b.newPage({viewport:{width:w,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('file://'+path.resolve('branch.html'));
  await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(2500);
  const r=await p.evaluate(()=>{
    const aside=document.querySelector('aside');
    const kids=Array.from(aside.children).map(n=>n.tagName+'#'+n.id+'.'+n.className+(n.tagName==='DETAILS'?'[open='+n.open+']':''));
    const powers=document.getElementById('powers');
    const ptxt=Array.from(powers.querySelectorAll('summary, .eyebrow, label, .lbl, .hint, p, select, button')).map(n=>n.tagName+': '+n.textContent.replace(/\s+/g,' ').trim().slice(0,140));
    const setup=document.getElementById('setup');
    const stxt=Array.from(setup.querySelectorAll('summary, label, .lbl, .hint, button')).map(n=>n.tagName+': '+n.textContent.replace(/\s+/g,' ').trim().slice(0,100));
    const duo=document.getElementById('duo');
    return {kids, ptxt, stxt, sum:document.getElementById('powers-sum').textContent, setupSum:document.getElementById('setup-sum').textContent, duoOpen:duo.open, duoSum:document.getElementById('duo-sum').textContent, duoSummary: duo.querySelector('summary').textContent, ollieOpen:document.getElementById('ollie-setup').open, tabsLabel:document.getElementById('tabs').getAttribute('aria-label'), duoTabsLabel: document.getElementById('duo-tabs').getAttribute('aria-label'), soloTabs:Array.from(document.querySelectorAll('#tabs .tab')).map(t=>t.textContent), duoTabs:Array.from(document.querySelectorAll('#duo-tabs .tab')).map(t=>t.textContent), mainLabel:document.querySelector('main').getAttribute('aria-label'), mainH: Array.from(document.querySelectorAll('main h2, main h1')).map(n=>n.textContent), duoBay: document.getElementById('duo-bay').textContent.slice(0,100), order: (()=>{const a=document.querySelector('main.panel'), d=document.getElementById('duo'); return {sameParent:a.parentElement===d.parentElement, next: a.nextElementSibling===d};})()};
  });
  console.log(w, JSON.stringify(r,null,1)); console.log('errs',errs);
  await p.close();
  }
  await b.close();
})();
