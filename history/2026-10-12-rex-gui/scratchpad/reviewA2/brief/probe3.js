const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path=require('path');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  for (const f of process.argv.slice(2)) {
  const p=await b.newPage({viewport:{width:1280,height:900}});
  await p.goto('file://'+path.resolve(f)); await p.waitForTimeout(1500);
  const rows=await p.evaluate(()=>Array.from(document.querySelectorAll('#src-table tbody tr')).map(r=>Array.from(r.cells).map(c=>c.textContent.replace(/\s+/g,' ').trim())));
  const cards=await p.evaluate(()=>Array.from(document.querySelectorAll('.assume div')).map(d=>d.textContent));
  console.log('==',f, rows.length,'rows');
  for (const r of rows) if (/claw|dug|brace|shear|bite|tear|bolt|footing|grip/i.test(r.join(' '))) console.log(' ROW', r.slice(0,3).join(' | ').slice(0,400));
  for (const c of cards) if (/claw|dug|brace|bolt|footing/i.test(c)) console.log(' CARD', c.slice(0,600));
  await p.close();
  }
  await b.close();
})();
