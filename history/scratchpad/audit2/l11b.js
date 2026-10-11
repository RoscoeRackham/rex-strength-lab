const pw = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  for (const name of (process.argv[2] || 'firefox,webkit').split(',')) {
    let browser;
    try { browser = await pw[name].launch(); } catch (e) { console.log(name, 'LAUNCH FAIL', e.message.split('\n').slice(0, 6).join(' | ')); continue; }
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript(() => { try { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 9, inf: false, mode: 'comic', action: 'stomp' })); } catch (e) {} });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(1500);
    const snap = await page.accessibility.snapshot({ interestingOnly: false });
    const imgs = [];
    const walk = (n, inImg) => { if (!n) return; if (n.role === 'img' || n.role === 'image' || n.role === 'graphic') imgs.push(n); (n.children || []).forEach(c => walk(c)); };
    walk(snap);
    for (const n of imgs) {
      const desc = []; const w2 = (x) => { (x.children || []).forEach(c => { desc.push(c.role + ':' + (c.name || '').slice(0, 50)); w2(c); }); }; w2(n);
      console.log(name, 'IMG', JSON.stringify((n.name || '').slice(0, 60)), 'descendants:', desc.length, desc.filter(d => /button/.test(d)).length + ' buttons', desc.slice(0, 5));
    }
    let btns = 0; const w3 = (x) => { if (x.role === 'button' && /Set strength here/.test(x.name || '')) btns++; (x.children || []).forEach(w3); }; w3(snap);
    console.log(name, 'ladder buttons anywhere in AX snapshot:', btns);
    // keyboard focus check
    const focusable = await page.evaluate(() => document.querySelectorAll('svg[role=img] g[role=button][tabindex="0"]').length);
    console.log(name, 'focusable markers in DOM:', focusable);
    await browser.close();
  }
})();
