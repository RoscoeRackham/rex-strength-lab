const { open, tab, bayText } = require('./lib');
(async () => {
  const { browser, page, errs } = await open({ w: 390, h: 844, saved: { inf: true } });
  await tab(page, 'throw', false, 2500);
  const r = await page.evaluate(() => { const e = document.querySelector('#bay .effort-read'); return { txt: e.innerText, h: e.getBoundingClientRect().height }; });
  console.log(r.h, (r.txt.match(/vanishing share/g) || []).length); console.log(r.txt);
  const pos = await page.evaluate(() => { const b = document.querySelector('#bay'), bt = b.getBoundingClientRect().top; return [...b.children].map((c) => [c.className, Math.round(c.getBoundingClientRect().top - bt), Math.round(c.getBoundingClientRect().height)]); });
  console.log(pos.slice(0, 8));
  await page.screenshot({ path: 'u5-throw-inf-390.png', fullPage: false });
  await browser.close();
})();
