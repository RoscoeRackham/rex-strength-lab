// innerText skips the contents of closed <details>. How much text does the shots audit never see?
const { open } = require('./harness.js');
(async () => {
  const { browser, p } = await open({ viewport: { width: 390, height: 844 } });
  await p.waitForFunction(() => /measures/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 });
  const r = await p.evaluate(() => {
    const closed = Array.from(document.querySelectorAll('details')).filter((d) => !d.open);
    const before = document.body.innerText.length;
    const hiddenText = closed.map((d) => d.textContent.length).reduce((a, b) => a + b, 0);
    closed.forEach((d) => { d.open = true; });
    const t = document.body.innerText;
    const bad = t.match(/.{0,40}\b(NaN|undefined|Infinity)\b.{0,40}/g);
    const numbersInClosed = closed.map((d) => (d.querySelector('summary') || {}).textContent).slice(0, 12);
    return { closedCount: closed.length, innerTextBefore: before, innerTextAfter: t.length, closedTextChars: hiddenText, bad, sample: numbersInClosed };
  });
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
})();
