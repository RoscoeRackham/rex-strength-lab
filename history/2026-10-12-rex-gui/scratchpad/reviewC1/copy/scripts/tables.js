const { chromium, CHROME, preview, settle, OUT, fs } = require('./common.js');
(async () => {
  const url = preview();
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [w,h,scheme] of [[1280,900,'light'],[1280,900,'dark'],[390,844,'light'],[390,844,'dark']]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type()==='error'||m.type()==='warning') errs.push(m.text()); });
    await page.goto(url); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(1500); await settle(page, 'bay');
    // open the sources table
    await page.evaluate(() => { for (const d of document.querySelectorAll('details')) if (d.querySelector('#src-table')) d.open = true; });
    await page.waitForTimeout(300);
    const info = await page.evaluate(() => {
      const sw = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const tw = document.querySelector('.table-wrap'); const twOver = tw.scrollWidth - tw.clientWidth;
      const rows = Array.from(document.querySelectorAll('#src-table tbody tr')).filter(tr => tr.cells[0].textContent.startsWith('Energy:'));
      const wide = rows.filter(tr => Array.from(tr.cells).some(c => c.scrollWidth > c.clientWidth + 1)).map(tr => tr.cells[0].textContent.slice(0,60));
      const card = Array.from(document.querySelectorAll('#assume > div')).find(d => d.textContent.startsWith('Energy comparisons'));
      const pitch = Array.from(document.querySelectorAll('#feats *')).filter(n => n.children.length===0 && /47\.3 m\/s/.test(n.textContent)).map(n => n.parentElement.innerText);
      return { sw, twOver, n: rows.length, wide, card: card && card.innerText, pitch, badges: rows.map(tr => tr.cells[2].textContent), links: rows.map(tr => tr.cells[3].querySelectorAll('a').length) };
    });
    console.log('== ' + w + ' ' + scheme + ' page overflow ' + info.sw + ', table-wrap overflow ' + info.twOver + ', energy rows ' + info.n + ', cells overflowing ' + info.wide.length, info.wide.slice(0,5));
    if (w === 1280 && scheme === 'light') { console.log('CARD:', info.card); console.log('PITCH:', info.pitch); console.log('badges', [...new Set(info.badges)], 'min links', Math.min(...info.links)); }
    const tbl = await page.$('#src-table');
    const rows = await page.$$('#src-table tbody tr');
    let first = null; for (const r of rows) { const t = await r.evaluate(n => n.cells[0].textContent); if (t.startsWith('Energy:')) { first = r; break; } }
    if (first) { await first.scrollIntoViewIfNeeded(); await page.screenshot({ path: OUT + '/srctable-' + w + '-' + scheme + '.png' }); }
    const card = await page.$('#assume'); await card.scrollIntoViewIfNeeded();
    await page.evaluate(() => { const c = Array.from(document.querySelectorAll('#assume > div')).find(d => d.textContent.startsWith('Energy comparisons')); c.scrollIntoView(); });
    await page.screenshot({ path: OUT + '/card-' + w + '-' + scheme + '.png' });
    console.log('errors', errs);
    await page.close();
  }
  await browser.close();
})();
