const pre = "(() => { const a = document.getElementById('absorb'); a.value = 'instant'; a.dispatchEvent(new Event('change', { bubbles: true })); setTimeout(() => { const b = Array.from(document.querySelectorAll('#bay button')).find((x) => /Dinosaur-killer/.test(x.textContent)); if (b) b.click(); }, 300); })()";
module.exports = [
  { name: 'grow_inst_krak', tab: 'weight', st: {}, pre },
  { name: 'grow_inst_krak_sand', tab: 'weight', st: { surface: 'sand' }, pre },
];
