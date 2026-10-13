const R='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewC2/verify-copy/repo/rex-strength-lab/';
global.window={}; require(R+'src/data.js'); const D=window.DINO_DATA; const L=require(R+'src/ladder.js');
const refs=D.energyRefs;
console.log('n rungs',refs.length);
refs.filter(r=>r.J>1e43).forEach(r=>console.log(r.J.toExponential(2), r.key, '|', r.short||r.page_short||r.text, r.rough?'ROUGH':''));
for (const J of [7e44,7.2e44,1e45,3e45,9e45,1.5e46,3e46]) console.log(J.toExponential(1), L.compare(J,refs).text);
