const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const base='/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/';
  for (const [m, labels] of [['lineup',['Real heights','All 49','Side']],['reader',['Real','Side']],['instrument',['Real heights','Zoom 15 to 50','Side']]]) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    const errs=[]; p.on('pageerror', e=>errs.push(String(e))); p.on('console', x=>{if(x.type()==='error')errs.push(x.text())});
    await p.goto('file://'+base+m+'/mock.html'); await p.waitForTimeout(2000);
    const res=[];
    for (const l of labels) {
      const btn = p.getByRole('button', { name: l, exact: true }).first();
      const n = await btn.count();
      if (!n) { res.push(l+': no button'); continue; }
      const before = await p.evaluate(()=>document.body.innerHTML.length);
      await btn.click(); await p.waitForTimeout(700);
      const r = await p.evaluate(()=>({sw:document.documentElement.scrollWidth, h:document.documentElement.scrollHeight, len:document.body.innerHTML.length}));
      res.push(`${l}: sw=${r.sw} h=${r.h} changed=${r.len!==before}`);
    }
    await p.screenshot({path:`m-${m}.png`, fullPage:false});
    console.log(m, res.join(' ; '), errs.slice(0,3));
    await p.close();
  }
  await b.close();
})();
