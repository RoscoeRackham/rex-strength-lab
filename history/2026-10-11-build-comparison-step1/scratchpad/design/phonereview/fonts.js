const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const base='/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/';
  for (const m of ['instrument','lineup','reader']) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await p.goto('file://'+base+m+'/mock.html'); await p.waitForTimeout(800);
    const r = await p.evaluate(() => {
      const hist = {}; const smalls=[];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n; 
      while ((n = walker.nextNode())) {
        const t = n.textContent.trim(); if (!t) continue;
        const el = n.parentElement; const cs = getComputedStyle(el);
        if (cs.display==='none' || cs.visibility==='hidden') continue;
        const rect = el.getBoundingClientRect(); if (rect.width===0) continue;
        let fs = parseFloat(cs.fontSize);
        // SVG text: account for scaling
        if (el.closest('svg') && el.getScreenCTM) {
          const svg = el.ownerSVGElement || el.closest('svg');
          try { const m = el.getScreenCTM(); fs = fs * Math.sqrt(Math.abs(m.a*m.d - m.b*m.c)); } catch(e){}
        }
        const k = Math.round(fs*2)/2; hist[k]=(hist[k]||0)+t.length;
        if (fs < 11.9) smalls.push([+fs.toFixed(1), t.slice(0,40), Math.round(rect.top+scrollY)]);
      }
      return { hist, smalls: smalls.slice(0,400), h: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth };
    });
    console.log('=== '+m, 'height', r.h, 'scrollWidth', r.sw);
    console.log(JSON.stringify(r.hist));
    const by = {}; r.smalls.forEach(s=>{ (by[s[0]]=by[s[0]]||[]).push(s[1]+'@'+s[2]); });
    for (const k of Object.keys(by).sort((a,b)=>a-b)) console.log(k, by[k].length, by[k].slice(0,30).join(' | '));
    await p.close();
  }
  await b.close();
})();
