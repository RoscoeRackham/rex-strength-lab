const fs=require('fs');const d=__dirname;
const t=fs.readFileSync(d+'/traces-norm.json','utf8');
fs.writeFileSync(d+'/mock.html',fs.readFileSync(d+'/mock.src.html','utf8').replace('/*TRACES*/',t));
