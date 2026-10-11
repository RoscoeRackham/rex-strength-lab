const fs=require('fs'), path=require('path');
const S=__dirname;
const orig=fs.writeFileSync, mk=fs.mkdirSync;
fs.mkdirSync=function(p,...a){ if(String(p).startsWith('/home/user')) return; return mk.call(fs,p,...a); };
fs.writeFileSync=function(p,d,...a){ if(String(p).startsWith('/home/user')){ const np=path.join(S,'dist_'+path.basename(p)); console.error('redirect',p,'->',np); return orig.call(fs,np,d,...a);} return orig.call(fs,p,d,...a); };
require('/home/user/rex-strength-lab/build-comparison/build.js');
