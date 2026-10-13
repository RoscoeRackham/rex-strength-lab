const open = require('./pw.js');
(async () => {
  const { browser, page, errs, load } = await open(+process.argv[2] || 1280);
  await load({ action: 'punch' }, false);
  const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#src-table tbody tr')).map((tr) => Array.from(tr.cells).map((c, i) => i === 3 ? Array.from(c.querySelectorAll('a')).map((a) => a.textContent + ' <' + a.href + '>').join(' ;; ') : c.textContent).join(' | ')));
  const hdr = await page.evaluate(() => Array.from(document.querySelectorAll('#src-table thead th')).map((t) => t.textContent).join(' | '));
  console.log(hdr);
  for (const r of rows) if (/^Energy|Fastest pitch|Baseball|Corolla|Krakatoa|growth|Growth|Chicxulub|dinosaur/i.test(r)) console.log(r);
  const card = await page.evaluate(() => { const n = Array.from(document.querySelectorAll('*')).find((x) => x.children.length < 3 && /^Energy comparisons$/.test(x.textContent.trim())); return n ? n.parentElement.innerText : 'NONE'; });
  console.log('CARD:', card);
  console.log('ERRS', errs.slice(0, 5));
  await browser.close();
})();
