const { open } = require('./h.js');
(async () => {
  const { browser, page, load } = await open(1280);
  await load({ action: 'throw' });
  const r = await page.evaluate(() => {
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n; while ((n = walker.nextNode())) { const p = n.parentElement; if (p.closest('script,style')) continue; const t = n.textContent; for (const ph of ['nothing changes', 'nothing outside changes', 'and it shows']) { const i = t.indexOf(ph); if (i >= 0) { const sec = p.closest('details, section, [id]'); out.push(ph + ' | in <' + p.tagName + '> under #' + (sec && sec.id) + ' | …' + t.slice(Math.max(0, i - 120), i + 40).replace(/ /g,' ') + '…'); } } }
    // card titles
    const titles = Array.from(document.querySelectorAll('h3, h4, summary, b, strong')).map((x) => x.textContent).filter((t) => /Absorbed energy and growth|The shimmer: what they take in shows/.test(t));
    return { out, titles };
  });
  console.log(r.out.join('\n')); console.log('titles', r.titles);
  await browser.close();
})();
