const run = require('./harness.js');
run([
  { id: 'stompDef', tab: 'stomp', state: {}, pick: 'allout' },
  { id: 'stomp10', tab: 'stomp', state: { logKg: 10 }, pick: 'allout' },
  { id: 'stompLeast', tab: 'stomp', state: {} },
]).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay.split('\n').filter(l => l.trim()).join('\n')); } });
