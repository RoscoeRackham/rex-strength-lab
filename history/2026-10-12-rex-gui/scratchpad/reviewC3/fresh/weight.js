const open = require('./pw.js');
(async () => {
  const { browser, page, errs, load, bayText } = await open(+process.argv[2] || 1280);
  const H0 = 3.048;
  for (const st of [{ m: 1e5 }, { m: 1e7 }, { m: 1e9 }, { m: 1e11 }, { m: 1e13 }, { m: 1e15 }, { m: 1e17 }, { m: 1e19 }, { m: 1e21 }, { m: 1e22 }, { m: 1e23 }, { m: 6e24 }, { m: 1e25 }, { m: 1e26 }, { m: 1e27 }, { H: 500, m: 1e27 }, {H: 500, m: 1e29}, {H: 500, m: 1e30}, {H: 0.1, m: 1.1e13}, {H: 0.01, m: 1e12}]) {
    await load(Object.assign({ action: 'weight' }, st), false);
    const t = await bayText();
    const lines = t.split('\n').filter((l) => /energy|Energy|×|% of|beyond|TNT|blow|Earth apart/.test(l));
    console.log('=== ' + JSON.stringify(st));
    console.log(lines.join('\n'));
  }
  console.log('ERRS', errs.slice(0, 5));
  await browser.close();
})();
