const R='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewC2/verify-copy/repo/rex-strength-lab/';
global.window={}; require(R+'src/data.js'); const D=window.DINO_DATA;
for (const r of D.sourceRows.filter(r=>/krakatoa|chicxulub|dinosaur|asteroid|Morgan/i.test(r.label+' '+r.value))) {
  console.log('['+r.status+'] '+r.label+'\n   VALUE: '+r.value+'\n   SRC: '+(r.sources||[]).map(s=>s.title+' <'+s.url+'>').join(' · ')+'\n');
}
