const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(() => { try { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', angle: 45 })); } catch (e) {} });
  await page.goto('file://' + process.argv[2]);
  await page.waitForTimeout(400);
  const txt = () => page.evaluate(() => [...document.getElementById('bay').children].slice(1).map(e=>e.innerText).join(' ').slice(0, 600).replace(/\s+/g, ' '));
  const t0 = await txt();
  const r = await page.$('#angle'); const box = await r.boundingBox();
  const y = box.y + box.height / 2, x0 = box.x + box.width * 0.5, x1 = box.x + box.width * 0.2;
  await page.mouse.move(x0, y); await page.mouse.down();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(x0 + (x1 - x0) * i / 10, y); await page.waitForTimeout(50); }
  const tMid = await txt();
  await page.mouse.up(); await page.waitForTimeout(100);
  console.log('changed during drag:', t0 !== tMid);
  console.log('T0 :', t0.slice(0, 300)); console.log('MID:', tMid.slice(0, 300));
  await page.focus('#angle'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(80);
  console.log('after ArrowRight:', await page.evaluate(() => [document.getElementById('angle').value, document.activeElement.id]));
  await page.selectOption('#obj', { index: 3 }); await page.waitForTimeout(80);
  console.log('after obj change: obj=', await page.evaluate(() => document.getElementById('obj').value), 'angle', await page.evaluate(() => document.getElementById('angle').value));
  await browser.close();
})();
