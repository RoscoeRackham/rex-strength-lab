// the lower-the-slider hint when its 0% search has to finish in the background (each throw slowed by 3 ms)
const { open } = require('./harness.js');
const slow = ({ ms }) => { let v; Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => { const f = x.throwObject; x.throwObject = function () { const t = performance.now(); while (performance.now() - t < ms) {} return f.apply(this, arguments); }; v = x; } }); };
(async () => {
  for (const ms of [30]) {
    const h = await open('branch', { init: { fn: slow, arg: { ms } } });
    await h.load({ action: 'throw', obj: 'baseball', angle: 0, logKg: 9, mode: 'comic' });
    await h.page.selectOption('#effort', 'windows');
    const seen = [];
    for (let i = 0; i < 1200; i++) { const t = await h.text('bay'); const tag = /Working out whether/.test(t) ? 'side' : /working it out|Working out/i.test(t) ? 'busy' : /Lower Air resistance absorbed/.test(t) ? 'HINT' : /Even all-out/.test(t) ? 'never-no-hint' : 'other'; if (seen[seen.length - 1] !== tag) seen.push(tag); if (tag === 'HINT' || (tag === 'never-no-hint' && i > 40)) break; await h.page.waitForTimeout(250); }
    console.log('delay', ms, 'ms: states seen', seen.join(' -> '), h.errs.slice(0, 2));
    await h.browser.close();
  }
})();
