const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path=require('path');
const settle=async(p,id)=>{for(let i=0;i<120;i++){const busy=await p.evaluate(id=>/working it out|Working out/i.test(document.getElementById(id).textContent),id); if(!busy) return; await p.waitForTimeout(250);} };
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage({viewport:{width:1280,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('file://'+path.resolve('branch.html'));
  // 1. settings change while open re-renders both
  await p.evaluate(()=>localStorage.setItem('rex-lab-v1',JSON.stringify({duoOpen:true,duoAction:'wrestle',action:'throw'})));
  await p.reload(); await p.waitForTimeout(1000); await settle(p,'duo-bay');
  const v0=await p.evaluate(()=>[document.querySelector('#bay .verdict').textContent, document.querySelector('#duo-bay .verdict').textContent]);
  await p.selectOption('#surface','ice'); await p.waitForTimeout(800); await settle(p,'duo-bay');
  const v1=await p.evaluate(()=>[document.querySelector('#bay .verdict').textContent, document.querySelector('#duo-bay .verdict').textContent]);
  console.log('surface change while open:\n ',v0,'\n ',v1);
  // 2. Bolted Ollie toggles while open
  await p.evaluate(()=>{document.getElementById('powers').open=true;});
  await p.setChecked('#bolt-ollie',true); await p.waitForTimeout(800); await settle(p,'duo-bay');
  console.log('ollie bolted:', await p.evaluate(()=>[document.querySelector('#duo-bay .verdict').textContent, document.getElementById('powers-sum').textContent, JSON.parse(localStorage.getItem('rex-lab-v1')).oAnchor]));
  // 3. Walk walker chips
  await p.click('#tab-walk'); await p.waitForTimeout(500);
  console.log('walk chips:', await p.evaluate(()=>Array.from(document.querySelectorAll('#bay button.chip')).map(b=>b.id+':'+b.textContent).slice(0,12)));
  // 4. record book run
  const btn=await p.$$('#feats button, .feats button, button.run, [data-run]');
  console.log('run buttons found', btn.length);
  const btns=await p.evaluate(()=>Array.from(document.querySelectorAll('button')).filter(b=>/simulate|run|try/i.test(b.textContent)).slice(0,5).map(b=>b.textContent+'|'+(b.closest('section')||{}).id));
  console.log(btns);
  await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
  const sim=await p.$$('button:has-text("Simulate")');
  if (sim.length){ await sim[0].click(); await p.waitForTimeout(1500);
    console.log('after simulate:', await p.evaluate(()=>({act:JSON.parse(localStorage.getItem('rex-lab-v1')).action, duoOpen:document.getElementById('duo').open, mainTop:document.querySelector('main.panel').getBoundingClientRect().top, sel:(document.querySelector('#tabs [aria-selected=true]')||{}).id, duoSel:(document.querySelector('#duo-tabs [aria-selected=true]')||{}).id})));
  }
  console.log('errs',errs);
  await b.close();
})();
