const run = require('./page.js');
(async () => {
  const res = await run([
    { name: 'granite 9.15', state: { action: 'throw', obj: 'person', logKg: 9.15, surface: 'granite' }, effort: 'allout' },
    { name: 'steel 9.15', state: { action: 'throw', obj: 'person', logKg: 9.15, surface: 'steel' }, effort: 'allout' },
  ]);
  for (const r of res) { const m = r.text.match(/They land at[^.]*\.[^.]*\.[^.]*\.[^.]*\.[^.]*\./); const i = r.text.match(/Impact:[^.]*\.[^.]*\./); console.log(r.name, '\n  ', m && m[0], '\n  ', i && i[0]); }
})();
