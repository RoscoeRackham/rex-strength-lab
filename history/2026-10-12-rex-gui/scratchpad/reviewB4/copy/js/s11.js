module.exports = [
  { name: 'grow_inst_krak', tab: 'weight', st: {}, pre: "(() => { const a = document.getElementById('absorb'); a.value = 'instant'; a.dispatchEvent(new Event('change', { bubbles: true })); })()" },
  { name: 'jump_soft_1e8', tab: 'jump', st: { logKg: 8, softLanding: true }, effort: 'allout' },
  { name: 'stomp_grow_1e8', tab: 'stomp', st: { logKg: 8 }, effort: 'allout', pre: "(() => { const a = document.getElementById('absorb'); a.value = 'gradual'; a.dispatchEvent(new Event('change', { bubbles: true })); })()" },
];
