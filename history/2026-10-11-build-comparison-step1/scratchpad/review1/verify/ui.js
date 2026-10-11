const fs=require('fs'),path=require('path');
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const B='/home/user/rex-strength-lab/build-comparison/';
const here=__dirname;
const page=fs.readFileSync(B+'dist/index.html','utf8');
const html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+page+'</body></html>';
fs.writeFileSync(here+'/page.html',html);
(async()=>{
  const br=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const ctx=await br.newContext({viewport:{width:1280,height:900}});
  await ctx.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
  const p=await ctx.newPage();
  const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text());}); p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+here+'/page.html');
  await p.waitForFunction(()=>document.querySelectorAll('#results tr').length>5 && /measures|reach|fails/.test(document.getElementById('targetStatus').textContent),null,{timeout:120000});
  const T=async()=>p.evaluate(()=>({status:document.getElementById('toolStatus').innerText,checks:document.getElementById('checks').innerText,results:document.getElementById('results').innerText,caps:document.getElementById('viewCaps').innerText,gutter:document.getElementById('gutter').innerText}));
  const measure=async()=>{await p.click('#measureBtn'); await p.waitForFunction(()=>!document.getElementById('measureBtn').disabled && !/Measuring/.test(document.getElementById('toolStatus').textContent),null,{timeout:120000});};
  await p.evaluate(()=>document.querySelectorAll('details.adv').forEach(d=>d.open=true));
  // F13 hint
  console.log('F13 hint:',await p.evaluate(()=>document.querySelector('#tSkull').parentElement.textContent));
  console.log('F13 order options:',await p.evaluate(()=>[...document.querySelectorAll('#tOrder option')].map(o=>o.value+' = '+o.textContent)));
  // F8: stale height in copy
  await p.fill('#tH','1.80'); await measure();
  const before=await T(); console.log('F8 measured at 1.80 -> score line:',before.results.split('\n').filter(l=>/^Score|^Mass/.test(l)));
  for (const v of ['3.00','abc']) {
    await p.fill('#tH',v);
    await p.click('#copyBtn'); await p.waitForTimeout(300);
    const txt=await p.evaluate(()=>document.getElementById('copyOut').value);
    const j=JSON.parse(txt); console.log('F8 field',v,'-> copied height_m',j.height_m.value,'weight_kg',j.weight_kg.value,'notes',j.notes[1]);
  }
  // F3: skull row typo on the example sheet
  await p.fill('#tH','1.80');
  for (const rows of ['640','5000']) {
    await p.fill('#tSkull',rows); await measure();
    const r=await T(); console.log('\nF3 skull rows',rows,'\n status:',r.status.slice(0,120),'\n checks:',r.checks.replace(/\n/g,' | ').slice(0,700),'\n results:',r.results.split('\n').filter(l=>/^(Volume|Mass|Score|Thigh|Crotch height)/.test(l)).join(' | '),'\n gutter:',r.gutter);
  }
  await p.fill('#tSkull','');
  // F2: front+back only sheet via file input
  async function loadAndMeasure(file,H,skull){
    await p.selectOption('#tExample','file').catch(()=>{});
    await p.setInputFiles('#file',file);
    await p.waitForFunction(()=>/Loaded|not an image/.test(document.getElementById('toolStatus').textContent),null,{timeout:30000});
    await p.fill('#tH',H); await p.fill('#tSkull',skull||''); await measure(); return T();
  }
  let r=await loadAndMeasure(here+'/frontback.png','1.80','56');
  console.log('\nF2 front+back:\n status:',r.status.slice(0,140),'\n caps:',r.caps,'\n checks:',r.checks.replace(/\n/g,' | '),'\n score:',r.results.split('\n').filter(l=>/^(Score|Volume)/.test(l)).join(' | '));
  r=await loadAndMeasure(here+'/ok-sheet.png','1.80','56');
  console.log('\nF2 control ok-sheet:\n caps:',r.caps,'\n score:',r.results.split('\n').filter(l=>/^(Score|Volume)/.test(l)).join(' | '));
  // F9
  for (const f of ['alpha-black.png','lowcontrast.png']) { r=await loadAndMeasure(here+'/'+f,'1.80',''); console.log('\nF9',f,':',r.status.slice(0,200),'| checks:',r.checks.replace(/\n/g,' | ').slice(0,300)); }
  console.log('\nconsole errors:',errs);
  await br.close();
})().catch(e=>{console.error(e);process.exit(1);});
