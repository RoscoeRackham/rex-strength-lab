const { open, tab, bayText } = require('./lib');
(async () => {
  const { browser, page } = await open({ w: 1280, h: 900, saved: { inf: true, mode: 'real', action: 'punch' } });
  await tab(page, 'punch', false, 2500);
  await page.selectOption('#effort', 'windows'); await page.waitForTimeout(2500);
  let t = await page.$eval('#bay .effort-read', (e) => e.innerText); console.log('PUNCH windows:\n' + t.slice(0, 400));
  await page.selectOption('#effort', 'ground'); await page.waitForTimeout(1500);
  t = await page.$eval('#bay .effort-read', (e) => e.innerText); console.log('PUNCH ground:\n' + t.slice(0, 300));
  await browser.close();
  // default dial, throw at 1.58 t (dial 3.2)
  const b2 = await open({ w: 1280, h: 900, saved: { logKg: 3.2, action: 'throw' } });
  await tab(b2.page, 'throw', false, 2500);
  t = await b2.page.$eval('#bay .effort-read', (e) => e.innerText); console.log('THROW at 1.58 t:\n' + t.slice(0, 300));
  console.log('verdict', await b2.page.$eval('#bay .verdict', (e) => e.innerText));
  // own effort
  await tab(b2.page, 'arm', true, 2500);
  await b2.page.check('#o-effort-own'); await b2.page.waitForTimeout(1500);
  await b2.page.evaluate(() => { const s = document.querySelector('#o-effort-use'); s.value = String(Number(s.min) + 0.3); s.dispatchEvent(new Event('input', { bubbles: true })); });
  await b2.page.waitForTimeout(1500);
  t = await b2.page.$eval('#bay .effort-read', (e) => e.innerText); console.log('ARM own (1.58t dial):\n' + t);
  await b2.browser.close();
  const b3 = await open({ w: 1280, h: 900 });
  await tab(b3.page, 'arm', true, 2500);
  await b3.page.check('#o-effort-own'); await b3.page.waitForTimeout(1500);
  await b3.page.evaluate(() => { const s = document.querySelector('#o-effort-use'); s.value = String(Number(s.min) + 0.3); s.dispatchEvent(new Event('input', { bubbles: true })); });
  await b3.page.waitForTimeout(1500);
  t = await b3.page.$eval('#bay .effort-read', (e) => e.innerText); console.log('ARM own (default dial):\n' + t);
  const cards = await b3.page.evaluate(() => document.querySelector('#bay').innerText.match(/using [^\n]+/g));
  console.log(cards);
  await b3.browser.close();
})();
