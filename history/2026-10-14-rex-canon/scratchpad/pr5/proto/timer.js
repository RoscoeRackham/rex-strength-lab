const t0 = Date.now(); let last = t0; const log = console.log;
console.log = (...a) => { const now = Date.now(); log(((now - last) / 1000).toFixed(1).padStart(6), String(a[0]).slice(0, 70)); last = now; };
