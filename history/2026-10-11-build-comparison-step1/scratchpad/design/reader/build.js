const fs = require('fs');
const src = fs.readFileSync(__dirname + '/mock.src.html', 'utf8');
const data = fs.readFileSync(__dirname + '/mockdata.js', 'utf8');
fs.writeFileSync(__dirname + '/mock.html', src.replace('/*MOCKDATA*/', () => data));
console.log('mock.html', fs.statSync(__dirname + '/mock.html').size);
