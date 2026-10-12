const H = require('./vh.js');
const CASES = [
  // [label, state, steps, grep]
  ['F1 tank 1e5t concrete least', { group: 'solo', action: 'throw', obj: 'tank', logKg: 8 }, [], 'flies|Even all-out|Calculation|Courtesy ceiling'],
  ['F1 tank 1e5t concrete allout', { group: 'solo', action: 'throw', obj: 'tank', logKg: 8 }, [['sel', '#effort', 'allout']], 'flies'],
  ['F1 semi 1e4t least', { group: 'solo', action: 'throw', obj: 'semi', logKg: 7 }, [], 'flies|Even all-out|Courtesy ceiling'],
  ['F1 semi 1e4t allout', { group: 'solo', action: 'throw', obj: 'semi', logKg: 7 }, [['sel', '#effort', 'allout']], 'flies'],
  ['F1 tank granite least', { group: 'solo', action: 'throw', obj: 'tank', logKg: 8, surface: 'granite' }, [], 'Calculation|flies|ceiling'],
  ['F3 stomp ceiling', { group: 'solo', action: 'stomp' }, [['sel', '#effort', 'ceiling']], 'within|Courtesy'],
  ['F3 stomp sand least', { group: 'solo', action: 'stomp', surface: 'sand' }, [], 'within|Courtesy'],
  ['F3 stomp sand 511 allout', { group: 'solo', action: 'stomp', surface: 'sand', logKg: Math.log10(511) }, [['sel', '#effort', 'allout']], 'within|Courtesy|None of the hazards'],
  ['F3 near label', { group: 'solo', action: 'stomp' }, [], 'People and buildings'],
  ['F4 punch 1e4t rattle', { group: 'solo', action: 'punch', logKg: 7 }, [['sel', '#effort', 'rattle']], 'reaches|blasts houses|Upper bound|now out to'],
  ['F5 jump math', { group: 'solo', action: 'jump' }, [], 'dial’s force|Effort:'],
  ['F5 throw math', { group: 'solo', action: 'throw' }, [], 'Drive:|Effort:'],
  ['F5 loco ceiling comic ground', { group: 'solo', action: 'throw', obj: 'loco', logKg: 8, groundHolds: true }, [['sel', '#effort', 'ceiling']], 'can’t throw|full strength|Effort:'],
  ['F7 person safe allout', { group: 'solo', action: 'throw', obj: 'person' }, [['check', '#sw-passenger'], ['sel', '#effort', 'allout']], 'drag|ride|landing'],
  ['F7 person safe least', { group: 'solo', action: 'throw', obj: 'person' }, [['check', '#sw-passenger']], 'Effort:|landing|launch only|Courtesy'],
  ['F7 switch label', { group: 'solo', action: 'throw' }, [], 'Safe passenger'],
  ['F8 walk sand 50', { group: 'solo', action: 'walk', surface: 'sand', walkD: 50 }, [], 'elephant|measured'],
  ['F10 runaway punch', { group: 'solo', action: 'punch', logKg: 20 }, [['check', '#sw-silent'], ['sel', '#effort', 'allout'], ['sel', '#absorb', 'runaway']], 'nothing outside|bears only|own harms'],
  ['F11 gradual punch 1e7', { group: 'solo', action: 'punch', logKg: 7 }, [['check', '#sw-silent'], ['sel', '#effort', 'allout'], ['sel', '#absorb', 'gradual']], 'own harms|unnoticeable|harmless'],
  ['F13 stomp blast chart', { group: 'solo', action: 'stomp' }, [], 'Foot speed|Upper bound|Windows shatter|Houses collapse|thump'],
  ['F14 soft landing', { group: 'solo', action: 'jump' }, [['check', '#sw-soft']], 'absorbed'],
  ['F16 throw cool', { group: 'solo', action: 'throw', obj: 'shot', logKg: 8 }, [['check', '#sw-cool'], ['sel', '#effort', 'allout']], 'Catch tab'],
  ['F17 walk granite', { group: 'solo', action: 'walk', surface: 'granite' }, [], 'Canon says'],
  ['F18 walk 6000', { group: 'solo', action: 'walk', m: 6000 }, [], '3,007|6 t'],
  ['F19 ollie clay', { group: 'solo', action: 'walk', surface: 'softclay', walker: 'ollie' }, [], 'knee'],
  ['F19 ollie clay 2500', { group: 'solo', action: 'walk', surface: 'softclay', walker: 'ollie', oM: 2500 }, [], 'knee'],
  ['F20 houses', { group: 'solo', action: 'throw' }, [['sel', '#effort', 'houses']], 'flat'],
  ['F20 fireball windows', { group: 'solo', action: 'throw', inf: true }, [['sel', '#effort', 'windows']], 'never lands|where it lands|Plaster'],
  ['F21 punch goal', { group: 'solo', action: 'punch' }, [], 'boxers'],
  ['F22 walk glass', { group: 'solo', action: 'walk' }, [], 'glass|estimate|Glass'],
  ['F23 jump sand 1e9 ceiling', { group: 'solo', action: 'jump', surface: 'sand', logKg: 9 }, [['sel', '#effort', 'ceiling']], 'jumps|crater|Ground gives|punch|ground takes|Courtesy|ground breaks|Effort:'],
  ['F24 loco 1e9 allout', { group: 'solo', action: 'throw', obj: 'loco', logKg: 9 }, [['sel', '#effort', 'allout']], 'flies|Where each|Sonic|ground breaks|crushes|shoved'],
  ['F25 car 1e12 allout', { group: 'solo', action: 'throw', logKg: 12 }, [['sel', '#effort', 'allout']], '× 10⁻|Courtesy'],
  ['F23b jump sand 1e9 ground preset', { group: 'solo', action: 'jump', surface: 'sand', logKg: 9 }, [['sel', '#effort', 'ground']], 'jumps|crater|Ground gives|Even all-out|Effort:|ground breaks'],
  ['F23c sprint sand 1e9 ground preset', { group: 'solo', action: 'sprint', surface: 'sand', logKg: 9 }, [['sel', '#effort', 'ground']], 'Ground|Even all-out|Effort:|sink|crater'],
  ['F24b loco comic ground gentle allout', { group: 'solo', action: 'throw', obj: 'loco', logKg: 9, groundHolds: true }, [['check', '#sw-gentle'], ['sel', '#effort', 'allout']], 'flies|shoved|Courtesy|None of the hazards|Effort|All-out'],
  ['F12 weight krakatoa', { group: 'solo', action: 'weight' }, [['chip', 'Krakatoa']], '\\(1×\\)|0\\.3%|unnoticeable'],
];
(async () => {
  const only = process.argv[2];
  for (const [label, st, steps, re] of CASES) {
    if (only && !label.startsWith(only)) continue;
    const p = await H.open(st);
    await H.settle(p);
    for (const s of steps) {
      if (s[0] === 'sel') { try { await H.sel(p, s[1], s[2]); } catch (e) { console.log('  (no control ' + s[1] + ')'); } }
      else if (s[0] === 'check') await H.check(p, s[1]);
      else if (s[0] === 'chip') { await p.locator('#bay .chip', { hasText: s[1] }).first().click(); await p.waitForTimeout(300); }
    }
    await H.settle(p);
    const t = await p.evaluate(() => { document.querySelectorAll('details').forEach((d) => { d.open = true; }); return document.querySelector('#bay').innerText + '\n' + (document.querySelector('#comic-setup') ? document.querySelector('#comic-setup').innerText : ''); });
    const lines = [...new Set(t.split('\n').filter((l) => new RegExp(re, 'i').test(l)))];
    console.log('===== ' + label);
    console.log(lines.map((l) => '  ' + l.slice(0, 700)).join('\n'));
    if (p.errs.length) console.log('  ERRS', p.errs.map((e) => e.split('\n')[0]));
    await p.close();
  }
  await H.close();
})();
