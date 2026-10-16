const { P, mk, ol, g } = require('./common.js');
const show = (lbl, r) => console.log(lbl, JSON.stringify({ outcome: r.outcome, clash: r.clash, oneSided: r.oneSided, contact: r.contact, draggedA: r.draggedA, draggedB: r.draggedB, RA: r.RA, RB: r.RB, tableBreaks: r.tableBreaks }));
show('inf, Rex bolted:', P.armWrestle(mk({ F: Infinity, keepForm: false, anchor: 'bolted' }), ol({ F: Infinity, keepForm: false })));
show('dial, Rex bolted:', P.armWrestle(mk({ keepForm: false, anchor: 'bolted' }), ol({ keepForm: false })));
show('1e12, Rex bolted:', P.armWrestle(mk({ F: 1e12 * g, keepForm: false, anchor: 'bolted' }), ol({ F: 1e12 * g, keepForm: false })));
show('1e20, Rex bolted:', P.armWrestle(mk({ F: 1e20 * g, keepForm: false, anchor: 'bolted' }), ol({ F: 1e20 * g, keepForm: false })));
// shoving match analog
const pm = P.pushMatch(mk({ F: Infinity, anchor: 'bolted' }), ol({ F: Infinity }));
console.log('pushMatch inf Rex bolted:', JSON.stringify(pm, (k, v) => typeof v === 'number' && !isFinite(v) ? String(v) : v).slice(0, 600));
