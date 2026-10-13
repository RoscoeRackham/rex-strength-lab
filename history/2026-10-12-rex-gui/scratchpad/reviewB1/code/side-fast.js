// the lower-the-slider hint when its 0% search has to finish in the background: the page's clock runs 200x fast, so
// every render's search budget runs out at once
const { open } = require('./harness.js');
const fastClock = ({ k }) => { const now = performance.now.bind(performance), t0 = now(); performance.now = () => t0 + (now() - t0) * k; };
(async () => {
  for (const k of [1, 200]) {
    const h = await open('branch', { init: { fn: fastClock, arg: { k } } });
    await h.load({ action: 'throw', obj: 'baseball', angle: 0, logKg: 9, mode: 'comic' });
    await h.page.selectOption('#effort', 'windows');
    const seen = [];
    for (let i = 0; i < 600; i++) { const t = await h.text('bay'); const tag = /Working out whether/.test(t) ? 'side' : /working it out|Working out/i.test(t) ? 'busy' : /Lower Air resistance absorbed/.test(t) ? 'HINT' : /Even all-out/.test(t) ? 'never-no-hint' : 'other'; if (seen[seen.length - 1] !== tag) seen.push(tag); if (tag === 'HINT' || (tag === 'never-no-hint' && i > 80)) break; await h.page.waitForTimeout(100); }
    console.log('clock x' + k + ': states seen', seen.join(' -> '), h.errs.slice(0, 2));
    await h.browser.close();
  }
})();
