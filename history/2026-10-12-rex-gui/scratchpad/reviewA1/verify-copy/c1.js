const { render } = require('./harness.js');
(async () => {
  const r = await render(__dirname + '/new/dist/index.html', {}, { openAll: true });
  const lines = r.body.split('\n');
  const hits = lines.filter((l) => /comic switch/i.test(l));
  console.log('lines mentioning "comic switch":', hits.length);
  hits.slice(0, 4).forEach((l) => console.log('  ' + l.slice(0, 160)));
  // is "Their powers" panel present and is any element titled Comic switches?
  console.log('panel titles containing Comic switches:', (r.body.match(/^Comic switches\s*$/gm) || []).length);
  console.log('errs', r.errs);
})();
