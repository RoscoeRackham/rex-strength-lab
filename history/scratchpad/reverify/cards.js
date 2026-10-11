const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(800);
  const t = await page.evaluate(() => [...document.querySelectorAll('div')].filter((d) => d.querySelector(':scope > b') && /Rex’s body|Rex and Ollie|Two muscle models|Density and weight|Sinking|catch|Blasts/.test(d.querySelector(':scope > b').textContent)).map((d) => d.innerText).join('\n---\n'));
  const chips = await page.evaluate(() => [...document.querySelectorAll('#density-chips .chip, .chip')].filter(b=>/Water/.test(b.textContent)).map((b) => b.textContent + ' | ' + b.title).join('\n'));
  const all = await page.evaluate(() => document.body.innerText);
  require('fs').writeFileSync(process.argv[2] || '/dev/null', all);
  console.log(errs, '\n' + t + '\n===\n' + chips);
  await browser.close();
})();
