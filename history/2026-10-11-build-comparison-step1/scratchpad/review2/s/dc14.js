const { open } = require('./h.js');
(async () => {
  const { browser, p } = await open({ w: 1280, fonts: false });
  const r = await p.evaluate(() => [...document.querySelectorAll('.chip')].filter((c) => /disputed/i.test(c.textContent)).map((c) => ({ text: c.textContent, cls: c.className, title: c.getAttribute('title'), ctx: (c.closest('li, .fact, tr, div') || c).textContent.slice(0, 90) })));
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
})();
