const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  const { page } = await open(browser, { w: 1280, h: 900, state: { duoOpen: true, duoAction: 'arm' } });
  await page.waitForTimeout(3000);
  await page.evaluate(() => { window.__w = []; for (const id of ['bay-live', 'duo-live']) new MutationObserver(() => window.__w.push(id + ': ' + document.getElementById(id).textContent.slice(0, 60))).observe(document.getElementById(id), { childList: true, characterData: true, subtree: true }); });
  const step = async (label, fn) => { await page.evaluate(() => { window.__w = []; }); await fn(); await page.waitForTimeout(2500); console.log(label.padEnd(34), JSON.stringify(await page.evaluate(() => window.__w))); };
  await step('Rex tab -> Jump', () => page.click('#tab-jump'));
  await step('two-player tab -> Wrestle', () => page.click('#tab-wrestle'));
  await step('strength chip Hulk (both change)', () => page.click('#tier-chips .chip:nth-child(4)'));
  await step('typed near box in Rex bay', async () => { await page.click('#tab-throw'); await page.waitForTimeout(1500); await page.evaluate(() => { window.__w = []; }); await page.click('#bay summary:has-text("Adjust effort")'); await page.fill('#near', '60'); await page.press('#near', 'Enter'); });
  await step('close element', () => page.click('#duo > summary'));
  await step('Rex tab while closed -> Lift', () => page.click('#tab-lift'));
  await browser.close();
})();
