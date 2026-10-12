const { open, tab, bayText } = require('./lib');
(async () => {
  const { browser, page } = await open({ w: 1280, h: 900, saved: { group: 'duo', duoAction: 'wrestle', wrestleMove: 'throw' } });
  await tab(page, 'wrestle', true, 3000);
  const t = await bayText(page);
  const i = t.indexOf('Effort:'); console.log(t.slice(i < 0 ? t.indexOf('All-out') : i, (i < 0 ? t.indexOf('All-out') : i) + 300));
  const j = t.search(/lands|flies|throws/); console.log(t.slice(j - 100, j + 500));
  await browser.close();
})();
