const { chromium, CHROME, open } = require('./lib.js');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p } = await open(browser, 390, 844, 'light');
  await p.selectOption('#buildSelect', 'ronnie_coleman');
  await p.fill('#hFt', '6'); await p.fill('#hIn', '6'); await p.fill('#wIn', '320');
  console.log('before', await p.evaluate(() => [document.getElementById('bName').textContent, document.getElementById('hFt').value, document.getElementById('hIn').value, document.getElementById('wIn').value]));
  await p.click('#buildSearch'); await p.keyboard.type('j');
  console.log('after typing j', await p.evaluate(() => [document.getElementById('bName').textContent, document.getElementById('hFt').value, document.getElementById('hIn').value, document.getElementById('wIn').value]));
  await p.keyboard.press('Backspace');
  console.log('after clearing', await p.evaluate(() => [document.getElementById('bName').textContent, document.getElementById('hFt').value, document.getElementById('hIn').value, document.getElementById('wIn').value]));
  await ctx.close(); await browser.close();
})();
