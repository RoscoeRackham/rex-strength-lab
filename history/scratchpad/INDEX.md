# Scratchpad scripts

Working scripts from the session scratchpad that the repository cites (in README files, NOTES.md, fact notes and review records) but does not contain. They were written by Claude and its subagents to reproduce findings, measure the picture, compile data and sweep the pages. Paths inside them point at the session scratchpad and the old project folder (/home/user/dino-strength-sim), so most will not run as-is from here.

Copied: scripts up to 300 KB, plus JSON and text results up to 100 KB in mass/ and bcdata/. Listed but not copied: copies of project code, raw downloads, larger files and binaries (table at the end).

Each folder lists the files whose purpose is known (from the file's own header comment, or a one-liner written for this index); the full file list is collapsed below it. Most of the remaining files are short single-purpose repro scripts named after the finding they test.

## audit/

Review round 1 (engine audit, 9 Oct): the auditors' and verifiers' repro scripts.

364 files, 542 KB.

- `audit/a16_satfix.js`: Proposed closed-form saturated limit (F0 -&gt; infinity, relative speed pinned at vmax) that keeps the external resistances.
- `audit/a22_hillfix.js`: Patched copy of pushApartHill (scratch only) to validate the proposed fix.
- `audit/a3.js`: Jump on yielding ground: engine vs momentum-conserving version of its own model
- `audit/a4.js`: Jump on yielding ground with Poncelet resistance R(v) = A (q + k rho v^2), comic constant force,
- `audit/a5_fv_jump.js`: Emulate a Samozino loaded-squat-jump force-velocity test on the engine's real-muscle leg at 511 kg strength.
- `audit/bio3/repro.js`: Reproduce BIO-3 using the app's exact context (data.js objects, default surface concrete, friction anchor)
- `audit/bio5v/repro.js`: Independent reproduction of BIO-5 against the ORIGINAL engine (no patches).
- `audit/bio6/hilltest.js`: Hill (1950) premise: muscle STRESS constant across sizes =&gt; force ~ s^2. Does the engine,
- `audit/bio8_derive.js`: Weyand 2000 model: v = Lc/tc (Lc fixed), Favg/Wb = tstep/tc, tstep = (tsw + tc)/2, tsw ~ constant.
- `audit/drive.js`: usage: node drive.js states.json out.json  (states: [[name, state], ...])
- `audit/f12_isolate.js`: Isolate the anchor effect at exactly theta=0 (no slope term): current R vs R from the theta-&gt;0+ limit (0) vs friction capped at Nmax.
- `audit/f14/anchor_scan.js`: Does the constant-bearing anchor (line 241) matter for throws/punches? Look for cases limited by
- `audit/f14/jump_mono.js`: Jump height vs strength on loose sand: engine (constant qA) vs velocity-dependent resistance (k=0.5, 1).
- `audit/f14/jump_pon.js`: Independent jump-on-yielding-ground model. Leg force F (comic: constant) pushes body A (mA, up, gravity)
- `audit/f14/jump_real.js`: Real (Hill) mode: F = F0*hill((vA+vB)/vmax). Same ground laws as jump_pon.js. Semi-implicit midpoint like engine, tiny dt.
- `audit/f14/jump_real_sat.js`: Real mode, saturated (F0 &gt;&gt; everything): leg extends at vmax; feet in quasi-equilibrium
- `audit/f14/stomp_pen.js`: Independent check of stomp hole depth: numerically integrate a rigid foot (mass m = legEff)
- `audit/f14/throw_up.js`: Vertical (90 deg) throw on yielding ground: engine anchor = constant (Nmax - W)/sin, which is 0 when the
- `audit/f1_indep.py`: Independent check: adaptive Dormand-Prince 5(4) through the atmosphere, exact Kepler coast above H_SW.
- `audit/f2_refute.js`: Reproduce bayThrow's "Without air it would have gone ..." sentence logic and compare to true vacuum range.
- `audit/f2r/fixes.js`: Compare candidate fixes: (1) momentum-conserving lock only, (2) lock + optimal push (clamp to ground limit),
- `audit/f2r/mom.js`: Momentum audit of P.jump: external impulse during the stroke vs momentum the engine hands the dino.
- `audit/f2r/poncelet.js`: Independent check: feet resisted by Poncelet-type ground R(v) = A (q + k rho v^2), inelastic lock at full extension.
- `audit/f3v/fix.js`: Proposed minimal fix for pushApartHill (scratch only). Differences from engine:
- `audit/f3v/limit.js`: Analytic F0 -&gt; infinity limit (singular perturbation): instantaneous ramp to w = vmax with momentum
- `audit/f3v/ref.js`: Independent reference for pushApart real mode, no time stepping.
- `audit/f3v/variants.js`: Scratch copies of pushApartHill with candidate fixes; compare against refHill across strengths.
- `audit/f4_fixcheck.js`: Compare the auditor's minimal fix (RA = anc.R + RB) with the clamp-after-add fix where the ground
- `audit/f4_indep.js`: Independent 1-D vertical integrator (RK4, small fixed step), exponential atmosphere, inverse-square gravity
- `audit/f5_momentum.js`: Independent check: dino+object system momentum along the throw axis.
- `audit/f7refute/eqair.py`: Independent equilibrium-air solver (element-potential / Gibbs method), RRHO + truncated electronic sums.
- `audit/gen1.js`: Broad grid of page states.
- `audit/ns1d.py`: Independent 1-D straight-through-centre fall of neutron-star Rex, PREM density (polynomials), own gravity integration.
- `audit/r_bio2_ref.js`: Independent reference for pushApartHill in the strong limit.
- `audit/ref.js`: Reference integrator: same physics model as engine fly(), independent code.
- `audit/refute_F1.js`: Independent re-check of finding F1 (ladder thresholds in N labelled kg)
- `audit/refute_F4.js`: Independent re-check of F4 (stomp hole depth = E/(q_ult * footArea))
- `audit/regr/drive.js`: usage: node drive.js states.json out.jsonl  (states: [[name, state], ...]); streams one JSON line per state
- `audit/regr/drive2.js`: usage: node drive.js states.json out.jsonl  (states: [[name, state], ...]); streams one JSON line per state
- `audit/regr/gen1.js`: Broad grid of page states.
- `audit/regr/one.js`: node one.js '&lt;json state&gt;' [maxchars]
- `audit/t11_stagT.js`: Equilibrium-air stagnation temperature (N2,O2,N,O,N+,O+,e-; RRHO partition functions), vs engine's ideal-gas T0(1+0.2M^2).
- `audit/t12_cdmach.js`: Constant-Cd vs Mach-dependent sphere drag (subcritical sphere 0.47 -&gt; supersonic ~0.92-1.0; representative curve, cf. Hoerner 1965, Bailey & Hiatt 1972)
- `audit/t2_kepler.js`: Analytic vacuum (Kepler) apex & range for launch from r0 = R+h0 with speed v at elevation theta (round Earth, GM).
- `audit/ui.js`: Usage: node ui.js '&lt;json state&gt;' [tab]  -&gt; prints bay text
- `audit/v_bio1_newhill.js`: Proposed replacement for pushApartHill: backward-Euler step, Hill force solved exactly (quadratic per linear piece).
- `audit/v_bio1_ref.js`: Independent stiff-stable reference: backward Euler on velocities, exact scalar root for u each step.
- `audit/v_f10.js`: Independent repro of F10: jump ground chip uses c.F instead of r.F
- `audit/v_f2_sim.js`: Independent check: body A (up +) and feet B, internal leg force F while extension s &lt; d,
- `audit/v_f8_fix.js`: Proposed closed forms vs engine's own fly(Cd=0)
- `audit/v_f8_refute.js`: Independent re-check of F8: flat-g "no-air" claims in jump and throw bays.
- `audit/v_f9.js`: Independent re-check of F9: jump ground-status chip vs engine groundFails

<details><summary>All 364 files</summary>

`audit/a1.js`, `audit/a10.js`, `audit/a10_heavyflat.js`, `audit/a10_size.js`, `audit/a11.js`, `audit/a11_jumpfix.js`, `audit/a11_nan.js`, `audit/a12.js`, `audit/a12_mono.js`, `audit/a12_slow.js`, `audit/a13.js`, `audit/a13_nan_detail.js`, `audit/a13_sprint.js`, `audit/a14.js`, `audit/a14_calib.js`, `audit/a14_ladder.js`, `audit/a15.js`, `audit/a15_fuzz.js`, `audit/a15_hillref.js`, `audit/a16.js`, `audit/a16_anchor.js`, `audit/a16_satfix.js`, `audit/a17_moon.js`, `audit/a17_patched.js`, `audit/a18_stompsplit.js`, `audit/a19_jumpcap.js`, `audit/a1_params.js`, `audit/a1_pushapart.js`, `audit/a2.js`, `audit/a20_vacapex.js`, `audit/a21_hole.js`, `audit/a22_hillfix.js`, `audit/a2_ladder.js`, `audit/a2_scan.js`, `audit/a3.js`, `audit/a3_jump.js`, `audit/a3_stiff.js`, `audit/a4.js`, `audit/a4_realscan.js`, `audit/a4_window.js`, `audit/a4_window_patched.js`, `audit/a5.js`, `audit/a5_fv_jump.js`, `audit/a5_realwindow.js`, `audit/a6.js`, `audit/a6_jumpstatus.js`, `audit/a6_onset.js`, `audit/a7.js`, `audit/a7_sat.js`, `audit/a7_throwE.js`, `audit/a8.js`, `audit/a8_recoil.js`, `audit/a8_shot.js`, `audit/a9.js`, `audit/a9_fit.js`, `audit/a9_stomp.js`, `audit/aw.js`, `audit/bio3/fitcond.js`, `audit/bio3/fixcheck.js`, `audit/bio3/repro.js`, `audit/bio4/build.js`, `audit/bio4/probe.js`, `audit/bio5v/fit.js`, `audit/bio5v/repro.js`, `audit/bio5v/robust.js`, `audit/bio6/defaults.js`, `audit/bio6/hilltest.js`, `audit/bio6/patched.js`, `audit/bio6/ratio.js`, `audit/bio6/repro.js`, `audit/bio6/side.js`, `audit/bio7.js`, `audit/bio7b.js`, `audit/bio7c.js`, `audit/bio8.js`, `audit/bio8_derive.js`, `audit/build.js`, `audit/build_copy.js`, `audit/build_scratch.js`, `audit/carlob.py`, `audit/catch1.js`, `audit/col.js`, `audit/common.js`, `audit/common_patched.js`, `audit/contrast.js`, `audit/cs.js`, `audit/dfc.js`, `audit/dfl.js`, `audit/drive.js`, `audit/eng.js`, `audit/eng1.js`, `audit/f1.js`, `audit/f10_more.js`, `audit/f10_repro.js`, `audit/f10_snap.js`, `audit/f10_tank.js`, `audit/f10_tiers.js`, `audit/f10_verify.js`, `audit/f10v/build.js`, `audit/f10v/check_fix.js`, `audit/f10v/sanity_fix.js`, `audit/f10v_probe.js`, `audit/f11_fusion.js`, `audit/f11_reach.js`, `audit/f11_refute.js`, `audit/f11_retune.js`, `audit/f12_common.js`, `audit/f12_fix.js`, `audit/f12_isolate.js`, `audit/f12_moon.js`, `audit/f12_refute.js`, `audit/f12_verify_fix.js`, `audit/f13_pull.js`, `audit/f13_verify.js`, `audit/f14/anchor_scan.js`, `audit/f14/build.js`, `audit/f14/common.js`, `audit/f14/jump_mono.js`, `audit/f14/jump_pon.js`, `audit/f14/jump_real.js`, `audit/f14/jump_real_sat.js`, `audit/f14/stomp_pen.js`, `audit/f14/throw_up.js`, `audit/f14/ui.js`, `audit/f1_band.js`, `audit/f1_ghost.js`, `audit/f1_indep.py`, `audit/f1_jump.js`, `audit/f1_moon.js`, `audit/f1_repro.js`, `audit/f1_ui.js`, `audit/f1_vac.js`, `audit/f2.js`, `audit/f2_fixcost.js`, `audit/f2_highspeed.js`, `audit/f2_more.js`, `audit/f2_refute.js`, `audit/f2r/build.js`, `audit/f2r/fixes.js`, `audit/f2r/ladder.js`, `audit/f2r/ladderprobe.js`, `audit/f2r/mom.js`, `audit/f2r/poncelet.js`, `audit/f2r/probe.js`, `audit/f2r/probe2.js`, `audit/f2r/repro.js`, `audit/f3_fixcheck.js`, `audit/f3_fly.js`, `audit/f3_jump.js`, `audit/f3_jumpscan.js`, `audit/f3_refute.js`, `audit/f3_tiers.js`, `audit/f3v/cost.js`, `audit/f3v/fix.js`, `audit/f3v/fixtest.js`, `audit/f3v/fixtest2.js`, `audit/f3v/hulkjump.js`, `audit/f3v/jumpref.js`, `audit/f3v/limit.js`, `audit/f3v/ref.js`, `audit/f3v/repro.js`, `audit/f3v/satjump.js`, `audit/f3v/scan.js`, `audit/f3v/tiers.js`, `audit/f3v/variants.js`, `audit/f4.js`, `audit/f4_fixcheck.js`, `audit/f4_indep.js`, `audit/f4_jump.js`, `audit/f4_sweep.js`, `audit/f4_verify.js`, `audit/f4b.js`, `audit/f5_fix.js`, `audit/f5_jump.js`, `audit/f5_kaiju.js`, `audit/f5_momentum.js`, `audit/f5_refute.js`, `audit/f5_repro.js`, `audit/f5_side.js`, `audit/f5_verify.js`, `audit/f6.js`, `audit/f6_repro.js`, `audit/f6_tank.js`, `audit/f6_throw.js`, `audit/f6_verify.js`, `audit/f6v/extreme.js`, `audit/f6v/fix.js`, `audit/f6v/repro.js`, `audit/f7.js`, `audit/f7refute/eqair.py`, `audit/f7refute/repro.js`, `audit/f7refute/stag.py`, `audit/f7refute/table.py`, `audit/f7refute/table2.py`, `audit/f7refute/validate.py`, `audit/f8.js`, `audit/f8_plush.js`, `audit/f8_refute.js`, `audit/f8b.js`, `audit/f9_case.js`, `audit/f9_fixcheck.js`, `audit/f9_live.js`, `audit/f9_sweep.js`, `audit/f9_targeted.js`, `audit/f9_throw.js`, `audit/f9_verify.js`, `audit/fbflip.js`, `audit/fulltext.js`, `audit/g7/cont.js`, `audit/g7/final.js`, `audit/g7/jump2.js`, `audit/g7/run.js`, `audit/g7/sanity_fix2.js`, `audit/g7/scope.js`, `audit/g7/sweep.js`, `audit/g7/sweep2.js`, `audit/gen1.js`, `audit/gen2.js`, `audit/gen3.js`, `audit/h.js`, `audit/happ.js`, `audit/heat.js`, `audit/inf.js`, `audit/lib.js`, `audit/m1.js`, `audit/mkbuild.js`, `audit/mkprev.js`, `audit/ns.js`, `audit/ns1d.py`, `audit/ns2.js`, `audit/nsT.js`, `audit/objs.js`, `audit/pm.js`, `audit/r_bio2_actions.js`, `audit/r_bio2_brute2.js`, `audit/r_bio2_gap.js`, `audit/r_bio2_patchcheck.js`, `audit/r_bio2_pos.js`, `audit/r_bio2_ref.js`, `audit/r_bio2_repro.js`, `audit/r_bio4.js`, `audit/r_bio4b.js`, `audit/r_bio4c.js`, `audit/r_patched_tree/test/sanity.js`, `audit/rad.js`, `audit/ref.js`, `audit/refute_F1.js`, `audit/refute_F1_jump.js`, `audit/refute_F4.js`, `audit/refute_F4_ui.js`, `audit/regr/aw1.js`, `audit/regr/c1.js`, `audit/regr/c2.js`, `audit/regr/c3.js`, `audit/regr/c4.js`, `audit/regr/c5.js`, `audit/regr/c6.js`, `audit/regr/c7.js`, `audit/regr/c8.js`, `audit/regr/cmpExact.js`, `audit/regr/drive.js`, `audit/regr/drive2.js`, `audit/regr/gen1.js`, `audit/regr/gen2.js`, `audit/regr/gen3.js`, `audit/regr/gen4.js`, `audit/regr/gen5.js`, `audit/regr/gen6.js`, `audit/regr/h.js`, `audit/regr/k1.js`, `audit/regr/m1.js`, `audit/regr/one.js`, `audit/regr/scan.js`, `audit/regr/t1.js`, `audit/regr/w1.js`, `audit/regr/wr1.js`, `audit/rel.js`, `audit/rel2.js`, `audit/rg/f1.js`, `audit/rg/f1scan.js`, `audit/rg/f5.js`, `audit/rg/f5scan.js`, `audit/rg/f6.js`, `audit/rg/f7.js`, `audit/rg/h.js`, `audit/rg/shot.js`, `audit/rg/timing.js`, `audit/rows.js`, `audit/sanity_fixed.js`, `audit/scan.js`, `audit/shot-fresh.js`, `audit/shot.js`, `audit/shot2.js`, `audit/sink.js`, `audit/sk-ux/bars.js`, `audit/sk-ux/cut.js`, `audit/sk-ux/f5.js`, `audit/sk-ux/interact.js`, `audit/sk-ux/mkprev.js`, `audit/sk-ux/shot.js`, `audit/sweep.js`, `audit/sync.js`, `audit/t10_crater.js`, `audit/t11_stagT.js`, `audit/t12_cdmach.js`, `audit/t13_find.js`, `audit/t14_domain.js`, `audit/t15_stepcap.js`, `audit/t1_fly.js`, `audit/t2_kepler.js`, `audit/t3_escape.js`, `audit/t4_noair.js`, `audit/t5_timeout.js`, `audit/t6_timeout_ui.js`, `audit/t7_blast.js`, `audit/t8_ui_scan.js`, `audit/t9_misc.js`, `audit/thrcrush.js`, `audit/thrcrush2.js`, `audit/toss.js`, `audit/ui.js`, `audit/ui_build.js`, `audit/ui_probe.js`, `audit/ui_stomp.js`, `audit/v_bio1_drops.js`, `audit/v_bio1_drops2.js`, `audit/v_bio1_fixchecks.js`, `audit/v_bio1_kaiju.js`, `audit/v_bio1_mech.js`, `audit/v_bio1_newhill.js`, `audit/v_bio1_patchscope.js`, `audit/v_bio1_platecar.js`, `audit/v_bio1_ref.js`, `audit/v_bio1_repro.js`, `audit/v_bio1_sweep.js`, `audit/v_bio1_sweep_fix.js`, `audit/v_bio1_tankref.js`, `audit/v_bio1_tiers.js`, `audit/v_bio1_tiers2.js`, `audit/v_bio9_label.js`, `audit/v_bio9_repro.js`, `audit/v_f10.js`, `audit/v_f10_fix.js`, `audit/v_f11.js`, `audit/v_f11b.js`, `audit/v_f1_fix.js`, `audit/v_f1_hole.js`, `audit/v_f1_real.js`, `audit/v_f2_jump.js`, `audit/v_f2_mono.js`, `audit/v_f2_realcap.js`, `audit/v_f2_sim.js`, `audit/v_f7.js`, `audit/v_f7_scan.js`, `audit/v_f8_contra.js`, `audit/v_f8_fix.js`, `audit/v_f8_refute.js`, `audit/v_f9.js`, `audit/vf1_build.js`, `audit/vf1_probe.js`, `audit/wd.js`, `audit/wd1d.js`, `audit/well.py`, `audit/wf.js`

</details>

## audit2/

Review round 2 (page audit, 9 Oct): repro scripts, browser probes and checks.

412 files, 682 KB.

- `audit2/cal_m8.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
- `audit2/calib_r5c.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
- `audit2/claims/grid.js`: Usage: node grid.js &lt;outfile&gt; &lt;json of config list filter&gt;
- `audit2/claims/harness.js`: Shared Playwright harness: load page, drive controls, snapshot the bay.
- `audit2/crop.js`: screenshot specific element: node crop.js width scheme selector outname [stateJSON]
- `audit2/d11/copy/build-data.py`: Build src/data.js from the verified research datasets in research/final-.json.
- `audit2/d11/copy/build.js`: Inline the engine, data and image into one self-contained page.
- `audit2/d11/copy/test/calibration.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
- `audit2/d11/copy/test/fit-v2.js`: Fit throwPush.forceFrac and throwWhip.vmax so real-muscle throws at record strength hit the records.
- `audit2/d11/copy/test/sweep.js`: Sweep every action across strengths, sizes, surfaces, modes and anchors; flag NaN/undefined/negative outputs.
- `audit2/d3fix/build-data.py`: Build src/data.js from the verified research datasets in research/final-.json.
- `audit2/harness.js`: Shared Playwright harness: load page, drive controls, snapshot the bay.
- `audit2/l05v/cal_fix.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
- `audit2/l05v/shape.js`: Compare the original sine-interpolated arc with the true conic, before thinning, by monkeypatching the stride.
- `audit2/m2c.js`: Snowplow estimate with breakup: rigid until shock crosses body (size/Us), then debris expands laterally at u.
- `audit2/m2d.js`: Independent fine-step integration of the Hill leg push (continuum check of first microseconds)
- `audit2/m3/cal100.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
- `audit2/m3/sweep100.js`: Sweep every action across strengths, sizes, surfaces, modes and anchors; flag NaN/undefined/negative outputs.
- `audit2/m5/proj/build.js`: Inline the engine, data and image into one self-contained page.
- `audit2/r15/hill3b.js`: Hill's approximation of the Sun-Earth restricted 3-body problem (rotating frame, x toward anti-Sun).
- `audit2/r15/hill3b2.js`: Hill's approximation of the Sun-Earth restricted 3-body problem (rotating frame, x toward anti-Sun).
- `audit2/r15/repo/build.js`: Inline the engine, data and image into one self-contained page.
- `audit2/r15/repo/test/calibration.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
- `audit2/r15/repo/test/fit-v2.js`: Fit throwPush.forceFrac and throwWhip.vmax so real-muscle throws at record strength hit the records.
- `audit2/r15/repo/test/sweep.js`: Sweep every action across strengths, sizes, surfaces, modes and anchors; flag NaN/undefined/negative outputs.
- `audit2/r3v/cal/test/calibration.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
- `audit2/r3v/cal/test/sweep.js`: Sweep every action across strengths, sizes, surfaces, modes and anchors; flag NaN/undefined/negative outputs.
- `audit2/r4_ref.js`: Fine reference integration of the same two-body Hill push model used by jump() in real mode.
- `audit2/r4tree/test/calibration.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
- `audit2/r6t/test/calibration.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
- `audit2/r6t/test/sweep.js`: Sweep every action across strengths, sizes, surfaces, modes and anchors; flag NaN/undefined/negative outputs.
- `audit2/r7/repo/test/calibration.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
- `audit2/r7/repo/test/fit-v2.js`: Fit throwPush.forceFrac and throwWhip.vmax so real-muscle throws at record strength hit the records.
- `audit2/r7/repo/test/sweep.js`: Sweep every action across strengths, sizes, surfaces, modes and anchors; flag NaN/undefined/negative outputs.
- `audit2/ref.js`: Reference integrator: same physics model as engine fly(), independent code.
- `audit2/regress/a1_2d.js`: 2-D check of the throw with a sliding anchor (comic constant force, classical speeds).
- `audit2/regress/ref.js`: Reference integrator: same physics model as engine fly(), independent code.
- `audit2/regress/stag_solver.js`: Equilibrium-air stagnation temperature (N2,O2,N,O,N+,O+,e-; RRHO partition functions), vs engine's ideal-gas T0(1+0.2M^2).
- `audit2/regress/ui.js`: Usage: node ui.js '&lt;json array of states&gt;'   each state = localStorage 'rex-lab-v1' object (merged over defaults)
- `audit2/t/cal.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js

<details><summary>All 412 files</summary>

`audit2/a11y.js`, `audit2/apex.js`, `audit2/apex2.js`, `audit2/atlas.js`, `audit2/build.js`, `audit2/c1_band.js`, `audit2/c1_browser.js`, `audit2/c1_engine.js`, `audit2/c2.js`, `audit2/cal_m8.js`, `audit2/calib_r5c.js`, `audit2/claims/buildcur.js`, `audit2/claims/extra.js`, `audit2/claims/feats.js`, `audit2/claims/grid.js`, `audit2/claims/harness.js`, `audit2/claims/jumpscan.js`, `audit2/claims/ladder.js`, `audit2/claims/ladderweb.js`, `audit2/claims/realcap.js`, `audit2/claims/repro.js`, `audit2/claims/scan.js`, `audit2/claims/scan2.js`, `audit2/claims/show.js`, `audit2/claims/t0.js`, `audit2/common.js`, `audit2/contrast.py`, `audit2/crop.js`, `audit2/d1.js`, `audit2/d10.js`, `audit2/d10pw.js`, `audit2/d10tip.js`, `audit2/d11/copy/build-data.py`, `audit2/d11/copy/build.js`, `audit2/d11/copy/test/calibration.js`, `audit2/d11/copy/test/fit-v2.js`, `audit2/d11/copy/test/fit.js`, `audit2/d11/copy/test/fit2.js`, `audit2/d11/copy/test/fit3.js`, `audit2/d11/copy/test/sanity.js`, `audit2/d11/copy/test/shots.js`, `audit2/d11/copy/test/sweep.js`, `audit2/d11/eng.js`, `audit2/d11/eng2.js`, `audit2/d11/repro.js`, `audit2/d12/d12_check.py`, `audit2/d12/ui.js`, `audit2/d12/ui2.js`, `audit2/d12/ui3.js`, `audit2/d12/ui4.js`, `audit2/d13.js`, `audit2/d13pw.js`, `audit2/d14.js`, `audit2/d14b.js`, `audit2/d15.js`, `audit2/d15b.js`, `audit2/d15c.js`, `audit2/d15d.js`, `audit2/d16.js`, `audit2/d16b.js`, `audit2/d16c.js`, `audit2/d16fix.js`, `audit2/d16pw.js`, `audit2/d17.js`, `audit2/d17b.js`, `audit2/d2.js`, `audit2/d2b.js`, `audit2/d3.js`, `audit2/d3fix/build-data.py`, `audit2/d4/card.js`, `audit2/d5.js`, `audit2/d6.js`, `audit2/d7/card.js`, `audit2/d8.js`, `audit2/d8fix.js`, `audit2/d9-browser.js`, `audit2/d9.js`, `audit2/d9b.js`, `audit2/drag.js`, `audit2/drag2.js`, `audit2/feat.js`, `audit2/feats.js`, `audit2/flick.js`, `audit2/harness.js`, `audit2/hit.js`, `audit2/kb.js`, `audit2/kb2.js`, `audit2/keys.js`, `audit2/l01.js`, `audit2/l02/m.js`, `audit2/l02/m2.js`, `audit2/l02/patch.js`, `audit2/l02/z.js`, `audit2/l03-fixed.js`, `audit2/l03-verify.js`, `audit2/l03.js`, `audit2/l04_check.js`, `audit2/l04_drag.js`, `audit2/l04_drag2.js`, `audit2/l04_drag2_fix.js`, `audit2/l04_drag_fix.js`, `audit2/l05v/cal_fix.js`, `audit2/l05v/pw.js`, `audit2/l05v/pw_fix.js`, `audit2/l05v/repro.js`, `audit2/l05v/shape.js`, `audit2/l05v/sweep.js`, `audit2/l06.js`, `audit2/l06_b2.js`, `audit2/l06_browser.js`, `audit2/l07.js`, `audit2/l07fix.js`, `audit2/l08_browser.js`, `audit2/l08_contrast.js`, `audit2/l08_fix.js`, `audit2/l08_shots.js`, `audit2/l09/measure.js`, `audit2/l09/midbreak.js`, `audit2/l09/patch.js`, `audit2/l09/shots.js`, `audit2/l09/tilechk.js`, `audit2/l09/widths.js`, `audit2/l10.js`, `audit2/l10b.js`, `audit2/l11.js`, `audit2/l11b.js`, `audit2/l11c.js`, `audit2/l12.js`, `audit2/l13.js`, `audit2/l13b.js`, `audit2/l13c.js`, `audit2/l14/fix.js`, `audit2/l14/repro.js`, `audit2/l14/repro2.js`, `audit2/l14/repro3.js`, `audit2/l15.js`, `audit2/l15b.js`, `audit2/l15c.js`, `audit2/l16/node_th.js`, `audit2/l16/patch.js`, `audit2/l16/prof.js`, `audit2/l16/pw.js`, `audit2/l16/pw2.js`, `audit2/l17.js`, `audit2/l17b.js`, `audit2/l18.js`, `audit2/l18b.js`, `audit2/l19.js`, `audit2/l19p.js`, `audit2/load.js`, `audit2/ls.js`, `audit2/m10.js`, `audit2/m10_check.js`, `audit2/m10_check2.js`, `audit2/m10fix.js`, `audit2/m11.js`, `audit2/m11pw.js`, `audit2/m11sweep.js`, `audit2/m12/browser.js`, `audit2/m12/browser2.js`, `audit2/m12/engine.js`, `audit2/m12/jumpthr.js`, `audit2/m12/throwangles.js`, `audit2/m13.js`, `audit2/m13_drag.js`, `audit2/m14.js`, `audit2/m14_browser.js`, `audit2/m14_browser2.js`, `audit2/m14_thr.js`, `audit2/m14_throw.js`, `audit2/m14_throw2.js`, `audit2/m1_browser.js`, `audit2/m1_browser_fix.js`, `audit2/m1_fix.js`, `audit2/m1_jump.js`, `audit2/m1_jumpmono.js`, `audit2/m1_stomp.js`, `audit2/m1_sweep.js`, `audit2/m1_tile.js`, `audit2/m2.js`, `audit2/m2_browser.js`, `audit2/m2b.js`, `audit2/m2c.js`, `audit2/m2d.js`, `audit2/m2e.js`, `audit2/m2f.js`, `audit2/m2pw.js`, `audit2/m3.js`, `audit2/m3/browser.js`, `audit2/m3/cal100.js`, `audit2/m3/jumpdetail.js`, `audit2/m3/precise.js`, `audit2/m3/repro.js`, `audit2/m3/sweep100.js`, `audit2/m3b.js`, `audit2/m3c.js`, `audit2/m3d.js`, `audit2/m3p.js`, `audit2/m4/br.js`, `audit2/m4/sweep.js`, `audit2/m4_browser.js`, `audit2/m4_calib.js`, `audit2/m5/eng.js`, `audit2/m5/eng2.js`, `audit2/m5/fix777.js`, `audit2/m5/math.js`, `audit2/m5/math2.js`, `audit2/m5/proj/build.js`, `audit2/m5/repro.js`, `audit2/m5/repro2.js`, `audit2/m5/repro3.js`, `audit2/m5/repro4.js`, `audit2/m5/run.js`, `audit2/m6.js`, `audit2/m6/fixtest.js`, `audit2/m6/fmt.js`, `audit2/m6/ladder.js`, `audit2/m6/repro.js`, `audit2/m6/scan.js`, `audit2/m6/tiles.js`, `audit2/m6b.js`, `audit2/m6c.js`, `audit2/m7.js`, `audit2/m7/b2.js`, `audit2/m7/browser.js`, `audit2/m7/fix.js`, `audit2/m7/repro.js`, `audit2/m7b.js`, `audit2/m7c.js`, `audit2/m7d.js`, `audit2/m8.js`, `audit2/m8/browser.js`, `audit2/m8/edge.js`, `audit2/m8/edge2.js`, `audit2/m8/links.js`, `audit2/m8/scan.js`, `audit2/m8b.js`, `audit2/m8c.js`, `audit2/m8d.js`, `audit2/m8e.js`, `audit2/m8f.js`, `audit2/m9/patch.js`, `audit2/m9/run.js`, `audit2/m9/run2.js`, `audit2/m9_browser.js`, `audit2/m9_browser_fixed.js`, `audit2/m9_engine.js`, `audit2/m9_fixcheck.js`, `audit2/now.js`, `audit2/patch.py`, `audit2/patch13.js`, `audit2/patch_m8.js`, `audit2/perf.js`, `audit2/perf2.js`, `audit2/pw.js`, `audit2/r1-count.js`, `audit2/r1-engine.js`, `audit2/r1.js`, `audit2/r10.js`, `audit2/r10_b.js`, `audit2/r10_ui.js`, `audit2/r10_ui_fix.js`, `audit2/r11/r11.py`, `audit2/r11/ui.js`, `audit2/r11/ui2.js`, `audit2/r11/ui3.js`, `audit2/r12.js`, `audit2/r12b.js`, `audit2/r12c.js`, `audit2/r12d.js`, `audit2/r12e.js`, `audit2/r12pw.js`, `audit2/r13.js`, `audit2/r13b.js`, `audit2/r13c.js`, `audit2/r13d.js`, `audit2/r14_fixcheck.js`, `audit2/r14_stomp.js`, `audit2/r14_throw.js`, `audit2/r14_ui.js`, `audit2/r15/ghost.js`, `audit2/r15/hill3b.js`, `audit2/r15/hill3b2.js`, `audit2/r15/jump.js`, `audit2/r15/jump2.js`, `audit2/r15/jump3.js`, `audit2/r15/patch.js`, `audit2/r15/repo/build.js`, `audit2/r15/repo/test/calibration.js`, `audit2/r15/repo/test/fit-v2.js`, `audit2/r15/repo/test/fit.js`, `audit2/r15/repo/test/fit2.js`, `audit2/r15/repo/test/fit3.js`, `audit2/r15/repo/test/sanity.js`, `audit2/r15/repo/test/shots.js`, `audit2/r15/repo/test/sweep.js`, `audit2/r15/repro.js`, `audit2/r15/throwscan.js`, `audit2/r15/ui.js`, `audit2/r15/ui2.js`, `audit2/r15/ui3.js`, `audit2/r15/ui4.js`, `audit2/r16.js`, `audit2/r2_browser.js`, `audit2/r2_comic.js`, `audit2/r2_granite.js`, `audit2/r2_node.js`, `audit2/r2_node_fixed.js`, `audit2/r2_others.js`, `audit2/r3v/browser.js`, `audit2/r3v/cal/test/calibration.js`, `audit2/r3v/cal/test/sweep.js`, `audit2/r3v/cases.js`, `audit2/r3v/cmp.js`, `audit2/r3v/jumpdbg.js`, `audit2/r3v/maxcheck.js`, `audit2/r3v/repro.js`, `audit2/r3v/repro2.js`, `audit2/r4_browser.js`, `audit2/r4_browser_patched.js`, `audit2/r4_patch_test.js`, `audit2/r4_ref.js`, `audit2/r4_repro.js`, `audit2/r4_sweep.js`, `audit2/r4tree/test/calibration.js`, `audit2/r5_after.js`, `audit2/r5_browser.js`, `audit2/r5_browser_fixed.js`, `audit2/r5_cold.js`, `audit2/r5_dbg.js`, `audit2/r5_inf.js`, `audit2/r5_kaiju.js`, `audit2/r5_repro.js`, `audit2/r5_scan.js`, `audit2/r5_subopt.js`, `audit2/r5_time.js`, `audit2/r5_verify.js`, `audit2/r6_cmp.js`, `audit2/r6_real.js`, `audit2/r6_real2.js`, `audit2/r6_repro.js`, `audit2/r6_scan.js`, `audit2/r6_scan2.js`, `audit2/r6_ui.js`, `audit2/r6_ui_fixed.js`, `audit2/r6t/test/calibration.js`, `audit2/r6t/test/sweep.js`, `audit2/r7/browser.js`, `audit2/r7/cmp.js`, `audit2/r7/repo/test/calibration.js`, `audit2/r7/repo/test/fit-v2.js`, `audit2/r7/repo/test/fit.js`, `audit2/r7/repo/test/fit2.js`, `audit2/r7/repo/test/fit3.js`, `audit2/r7/repo/test/sanity.js`, `audit2/r7/repo/test/shots.js`, `audit2/r7/repo/test/sweep.js`, `audit2/r7/repro.js`, `audit2/r7/twod.js`, `audit2/r7/variants.js`, `audit2/r8_browser.js`, `audit2/r8_fixcheck.js`, `audit2/r8_stomp.js`, `audit2/r9/eng.js`, `audit2/r9/thr.js`, `audit2/r9/throw.js`, `audit2/r9/ui.js`, `audit2/r9/ui_fixed.js`, `audit2/ref.js`, `audit2/regress/a1_2d.js`, `audit2/regress/build.js`, `audit2/regress/c1_crater.js`, `audit2/regress/common.js`, `audit2/regress/f1_heavy.js`, `audit2/regress/feats.js`, `audit2/regress/fmt1.js`, `audit2/regress/fmt_ui.js`, `audit2/regress/h1_overshoot.js`, `audit2/regress/h2_sweep.js`, `audit2/regress/h3_stall.js`, `audit2/regress/h4_ref.js`, `audit2/regress/h5_eground.js`, `audit2/regress/h6_patch.js`, `audit2/regress/j1_inf.js`, `audit2/regress/j2_granite.js`, `audit2/regress/j3_realjump.js`, `audit2/regress/j4_nonmono.js`, `audit2/regress/j5_comicbest.js`, `audit2/regress/k1_vac.js`, `audit2/regress/k2_jumpfly.js`, `audit2/regress/k3_kaiju.js`, `audit2/regress/k4_drag.js`, `audit2/regress/k5_kaijuTO.js`, `audit2/regress/m2_mono.js`, `audit2/regress/q1_quasi.js`, `audit2/regress/ref.js`, `audit2/regress/stag_solver.js`, `audit2/regress/t1_throwmono.js`, `audit2/regress/u1_trunc.js`, `audit2/regress/ui.js`, `audit2/regress/waitm2.sh`, `audit2/rot.js`, `audit2/shot2.js`, `audit2/sticky.js`, `audit2/sweepui.js`, `audit2/t/cal.js`, `audit2/tapdot.js`, `audit2/thprof.js`, `audit2/tiers.js`, `audit2/tip.js`, `audit2/tip2.js`, `audit2/w320.js`

</details>

## audit3/

Review round 3 (fix verification, 9 Oct): checks of each fix and regression hunts.

205 files, 365 KB.

- `audit3/bay.js`: usage: node bay.js '&lt;settings json&gt;' [clickFeatTitle]
- `audit3/cal_fix.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
- `audit3/calib-fixed.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
- `audit3/calib_fix.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
- `audit3/copy/build-data.py`: Build src/data.js from the verified research datasets in research/final-.json.
- `audit3/n1/test/calibration.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
- `audit3/n6v/calib-final.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
- `audit3/pw.js`: usage: node pw.js '&lt;settings json or ""&gt;' '&lt;js to eval returning value&gt;' [waitms]
- `audit3/ui.js`: usage: node ui.js scenarios.json  -&gt; prints bay text per scenario

<details><summary>All 205 files</summary>

`audit3/allfeats.js`, `audit3/bay.js`, `audit3/build-check.js`, `audit3/build.js`, `audit3/cal_fix.js`, `audit3/calib-fixed.js`, `audit3/calib_fix.js`, `audit3/cap.js`, `audit3/cap2.js`, `audit3/common.js`, `audit3/copy/build-data.py`, `audit3/d10.js`, `audit3/d10b.js`, `audit3/d10c.js`, `audit3/d10d.js`, `audit3/d10e.js`, `audit3/d13/ice.js`, `audit3/d13/ice2.js`, `audit3/h.js`, `audit3/jumpchk.js`, `audit3/l02v/dbg.js`, `audit3/l02v/full.js`, `audit3/l02v/inf.js`, `audit3/l02v/lead.js`, `audit3/l02v/verify.js`, `audit3/l02v/wrap.js`, `audit3/l03v/repro.js`, `audit3/l08b.js`, `audit3/l08c.js`, `audit3/l09r/repro.js`, `audit3/l09r/repro2.js`, `audit3/l09r/tile.js`, `audit3/l10.js`, `audit3/l10b.js`, `audit3/l10c.js`, `audit3/l13r/fix.js`, `audit3/l13r/run.js`, `audit3/ladder.js`, `audit3/ladder2.js`, `audit3/m5/repro.js`, `audit3/mkprev.js`, `audit3/n1.js`, `audit3/n1/browser.js`, `audit3/n1/repro.js`, `audit3/n1/scan.js`, `audit3/n1/t.js`, `audit3/n1/t2.js`, `audit3/n1/test/calibration.js`, `audit3/n10.js`, `audit3/n1b.js`, `audit3/n1fix.js`, `audit3/n2.js`, `audit3/n2/run.js`, `audit3/n2b.js`, `audit3/n2c.js`, `audit3/n2d.js`, `audit3/n2e.js`, `audit3/n2fix.js`, `audit3/n2j.js`, `audit3/n2orig.js`, `audit3/n2peak.js`, `audit3/n2pw.js`, `audit3/n2verify.js`, `audit3/n3-browser.js`, `audit3/n3-scan.js`, `audit3/n3-scan2.js`, `audit3/n3.js`, `audit3/n3b.js`, `audit3/n3pw.js`, `audit3/n3v/ovf.js`, `audit3/n3v/run.js`, `audit3/n3v/runfx.js`, `audit3/n3v/shot.js`, `audit3/n4.js`, `audit3/n4b.js`, `audit3/n4c.js`, `audit3/n4d.js`, `audit3/n4e.js`, `audit3/n4f.js`, `audit3/n4g.js`, `audit3/n4h.js`, `audit3/n4i.js`, `audit3/n4ui.js`, `audit3/n4ui2.js`, `audit3/n5.js`, `audit3/n5/car.js`, `audit3/n5/kaiju.js`, `audit3/n5/pw.js`, `audit3/n5/repro.js`, `audit3/n5b.js`, `audit3/n5c.js`, `audit3/n5d.js`, `audit3/n5e.js`, `audit3/n5f.js`, `audit3/n5gap.js`, `audit3/n5page.js`, `audit3/n5scan.js`, `audit3/n6.js`, `audit3/n6v/calib-final.js`, `audit3/n6v/cmp.js`, `audit3/n6v/dbg.js`, `audit3/n6v/extract.js`, `audit3/n6v/ks.js`, `audit3/n6v/pw.js`, `audit3/n6v/pw2.js`, `audit3/n6v/pyr.js`, `audit3/n6v/pyr2.js`, `audit3/n6v/t1.js`, `audit3/n6v/t2.js`, `audit3/n6v/t3.js`, `audit3/n6v/worst.js`, `audit3/n7.js`, `audit3/n7/mk.js`, `audit3/n7/run.js`, `audit3/n7e.js`, `audit3/n7u.js`, `audit3/n8.js`, `audit3/n8tabs/fix.js`, `audit3/n8tabs/run.js`, `audit3/n8tabs/zoom.js`, `audit3/n9.js`, `audit3/n9b.js`, `audit3/n9c.js`, `audit3/olddata.js`, `audit3/page.js`, `audit3/phone.js`, `audit3/pw.js`, `audit3/r10.js`, `audit3/r14.js`, `audit3/r15.js`, `audit3/r2.js`, `audit3/r2f.js`, `audit3/r2pw.js`, `audit3/r2sweep.js`, `audit3/r3.js`, `audit3/r5.js`, `audit3/r5b.js`, `audit3/r6.js`, `audit3/r6scan.js`, `audit3/r7.js`, `audit3/r9.js`, `audit3/r9b.js`, `audit3/r9c.js`, `audit3/r9d.js`, `audit3/rows.js`, `audit3/scan.js`, `audit3/scanj.js`, `audit3/scanj2.js`, `audit3/shot.js`, `audit3/sweep.js`, `audit3/t1.js`, `audit3/t2.js`, `audit3/t3.js`, `audit3/t4.js`, `audit3/t5.js`, `audit3/t6.js`, `audit3/t7.js`, `audit3/t8.js`, `audit3/t9.js`, `audit3/ui.js`, `audit3/uisweep.js`, `audit3/ux/apex.js`, `audit3/ux/build.js`, `audit3/ux/charts390.js`, `audit3/ux/contrast.js`, `audit3/ux/drag.js`, `audit3/ux/esc.js`, `audit3/ux/fonts.js`, `audit3/ux/h.js`, `audit3/ux/l06.js`, `audit3/ux/l06b.js`, `audit3/ux/l11.js`, `audit3/ux/l12.js`, `audit3/ux/l13.js`, `audit3/ux/l14.js`, `audit3/ux/l14b.js`, `audit3/ux/l15.js`, `audit3/ux/l16.js`, `audit3/ux/l19.js`, `audit3/ux/ladder.js`, `audit3/ux/liftnear.js`, `audit3/ux/mass.js`, `audit3/ux/mid.js`, `audit3/ux/nowsweep.js`, `audit3/ux/orbit.js`, `audit3/ux/path1.js`, `audit3/ux/perf.js`, `audit3/ux/perf2.js`, `audit3/ux/perf3.js`, `audit3/ux/prof.js`, `audit3/ux/rot.js`, `audit3/ux/sweepui.js`, `audit3/ux/tabs.js`, `audit3/ux/tabsold.js`, `audit3/ux/tap.js`, `audit3/ux/thr.js`, `audit3/ux/thrw.js`, `audit3/ux/thrwb.js`, `audit3/ux/titanic.js`, `audit3/ux/ylab.js`, `audit3/ux/ylab2.js`, `audit3/ux/zoom.js`, `audit3/ylab/ylab.js`, `audit3/ylab/ylab2.js`, `audit3/ylab/ylab3.js`

</details>

## duo/

Density and Rex + Ollie design (9-10 Oct): the designers' prototypes (density/calc/weight.js, contest/contest.js, collide/collide-ref.js, catch/flyto.js and catch2.js) and the four critiques' independent checks (*-check/).

75 files, 293 KB.

- `duo/catch-check/indep_fly.py`: Independent flat-ish check: 2-D point mass over a round Earth with exponential atmosphere,
- `duo/catch/catch.js`: Reference implementation of the "Game of catch" design (Rex and Ollie).
- `duo/catch/catch2.js`: Reference implementation v2 of the "Game of catch" (Rex and Ollie). Port to engine.js.
- `duo/catch/flyto.js`: fly() from engine.js with three additions proposed for the catch game:
- `duo/catch/tests-engine.js`: Expected values for the design's test list. Run: node tests.js
- `duo/catch/tests.js`: Expected values for the design's test list. Run: node tests.js
- `duo/collide-check/indep.py`: Independent recomputation of the Collide design's test cases (50-digit Decimal arithmetic).
- `duo/collide/collide-ref.js`: Reference implementation: "Unstoppable force vs immovable object" (Rex vs Ollie).
- `duo/collide/collide.js`: Prototype: unstoppable force vs immovable object (Rex vs Ollie). Port into engine.js.
- `duo/collide/hemi.js`: Force between two halves of a uniform sphere (G=M=R=1): z-force on upper half from whole sphere's field.
- `duo/contest-check/indep.js`: Independent recomputation of the contest design's test values (no project code used).
- `duo/contest-check/shapes.js`: Mutual gravity of two touching 2 m bodies (V = 0.18 m^3 each) for different shapes, relative to equal-volume balls.
- `duo/contest-check/shapes2.js`: Mutual gravity of two touching 2 m bodies (V = 0.18 m^3 each): box and cylinder shapes vs equal-volume balls.
- `duo/contest/contest.js`: Prototype of the arm-wrestling and wrestling design (scratch; not project code).
- `duo/density-check/calc/fall3d.js`: Independent 3-D fall-through integrator (own PREM table, regularised friction, fixed-step RK4 with step refinement).
- `duo/density-check/calc/gravdrag.js`: Order-of-magnitude: gravitational (Bondi-Hoyle-Lyttleton / dynamical-friction) drag on a dense Rex moving through rock,
- `duo/density-check/calc/gravdrag2.js`: Gravitational drag (Ostriker 1999 gaseous-medium form) as an order-of-magnitude check:
- `duo/density-check/calc/prem_check.js`: Independent PREM integration (numerical, not closed form). Coefficients from the GENIE listing (Dziewonski & Anderson 1981).
- `duo/density/calc/prem.js`: PREM density (Dziewonski & Anderson 1981, Table 1; polynomial in x = r/6371 km), g/cm3 -&gt; kg/m3
- `duo/density/calc/weight.js`: Prototype of the proposed engine additions for the "Weight" tab (density, self-gravity,

<details><summary>All 75 files</summary>

`duo/catch-check/indep_fly.py`, `duo/catch-check/listobj.js`, `duo/catch-check/probe_a.js`, `duo/catch-check/probe_b.js`, `duo/catch-check/probe_c.js`, `duo/catch-check/probe_d.js`, `duo/catch-check/probe_e.js`, `duo/catch-check/probe_wells.js`, `duo/catch/catch.js`, `duo/catch/catch2.js`, `duo/catch/flyto.js`, `duo/catch/listobj.js`, `duo/catch/probe1.js`, `duo/catch/probe2.js`, `duo/catch/run1.js`, `duo/catch/run2.js`, `duo/catch/run3.js`, `duo/catch/run4.js`, `duo/catch/run5.js`, `duo/catch/run6.js`, `duo/catch/run7.js`, `duo/catch/run8.js`, `duo/catch/run9.js`, `duo/catch/tests-engine.js`, `duo/catch/tests.js`, `duo/catch/timing.js`, `duo/collide-check/indep.py`, `duo/collide-check/probe.js`, `duo/collide/collide-ref.js`, `duo/collide/collide.js`, `duo/collide/final-tests-engine.js`, `duo/collide/final-tests.js`, `duo/collide/hemi.js`, `duo/collide/probe.js`, `duo/collide/run.js`, `duo/collide/run2.js`, `duo/collide/run3.js`, `duo/contest-check/engine-run.js`, `duo/contest-check/fixes.js`, `duo/contest-check/indep.js`, `duo/contest-check/shapes.js`, `duo/contest-check/shapes2.js`, `duo/contest/contest.js`, `duo/contest/final.js`, `duo/contest/probe.js`, `duo/contest/run.js`, `duo/contest/run2.js`, `duo/contest/run3.js`, `duo/contest/run4.js`, `duo/density-check/calc/basic.py`, `duo/density-check/calc/edge.js`, `duo/density-check/calc/engine_check.js`, `duo/density-check/calc/fall3d.js`, `duo/density-check/calc/gravdrag.js`, `duo/density-check/calc/gravdrag2.js`, `duo/density-check/calc/hips.js`, `duo/density-check/calc/prem_check.js`, `duo/density-check/calc/scan.js`, `duo/density-check/calc/scan2.js`, `duo/density-check/calc/settle.js`, `duo/density-check/calc/wd.js`, `duo/density/calc/dbg.js`, `duo/density/calc/dbg2.js`, `duo/density/calc/dbg3.js`, `duo/density/calc/final.js`, `duo/density/calc/prem.js`, `duo/density/calc/run1.js`, `duo/density/calc/run2.js`, `duo/density/calc/run3.js`, `duo/density/calc/run4.js`, `duo/density/calc/run5.js`, `duo/density/calc/run6.js`, `duo/density/calc/run7.js`, `duo/density/calc/run8.js`, `duo/density/calc/weight.js`

</details>

## mass/

The picture-based body estimate (10 Oct): method A pixel slices (seg.py, regions.py, volume.py, compute.py, final.py and friends), method_b/ segment solids, method_c/ anthropometric scaling, checker/ reconciliation. final.json is the reconciled result.

48 files, 221 KB.

- `mass/checker/ansur_k.py`: Checker: what cross-section area does ANSUR II imply, relative to (caliper breadth)^2?
- `mass/checker/check_vol.py`: Checker: independent slicer on Method A's (visually verified) region masks.
- `mass/checker/reconcile.py`: Checker's reconciled estimate.
- `mass/compute.py`: Method A: silhouette slices -&gt; elliptical cross-sections -&gt; volume.
- `mass/final.py`: Method A final pass: slice volumes per body region with hand-set limb axis angles.
- `mass/method_b/geom.py`: Shared geometry helpers for Method B (segment solids).
- `mass/method_b/method_b.py`: METHOD B - segment solids for Rex and Ollie from the reference picture.
- `mass/method_b/seg3.py`: Silhouette mask for Method B (segment solids).
- `mass/method_b/segdefs.py`: Hand-measured segment definitions (image pixels, 1280x853 picture).
- `mass/method_c/annotate.py`: Draw every Method C pixel reading on the picture so it can be checked (methodcmeasurements.png).
- `mass/method_c/area.py`: Frontal silhouette area from the figure masks (reused from ../rexfig.npy, ../olfig.npy, checked on ovmasks.png), with floor-shadow pixels clipped below each ...
- `mass/method_c/method_c.py`: METHOD C - anthropometric scaling.
- `mass/method_c/write_results.py`: Collect Method C outputs into methodcresults.json (+ proportion table and sanity checks).
- `mass/regions.py`: Region polygons (image x,y px) for both figures.
- `mass/report.py`: Assemble Method A results from finalraw.pkl into segments, uncertainty factors and results JSON.
- `mass/run_all.py`: Method A run: sets the scale from each figure's pixel height (Rex = 3.048 m) and computes region volumes with depth factors per zone.
- `mass/sanity.py`: Sanity check: widest shoulder span of each figure in metres.
- `mass/seg.py`: Segment the two figures from the grey studio background.
- `mass/volume.py`: First-pass volume from the foreground mask, split into Rex and Ollie.
- `mass/write_json.py`: Writes the Method A volume and mass ranges, scale and density to JSON.

<details><summary>All 48 files</summary>

`mass/checker/A_recheck.json`, `mass/checker/ansur_k.json`, `mass/checker/ansur_k.py`, `mass/checker/check_vol.py`, `mass/checker/reconcile.py`, `mass/checker/reconcile_raw.json`, `mass/checker/results_checker.json`, `mass/checker/write_checker_json.py`, `mass/checker/zoom.py`, `mass/compute.py`, `mass/diag.py`, `mass/final.json`, `mass/final.py`, `mass/grid.py`, `mass/method_b/ansur.py`, `mass/method_b/ansur_ratios.json`, `mass/method_b/crop.py`, `mass/method_b/dl/ansur_m.csv`, `mass/method_b/dl/t.csv`, `mass/method_b/geom.py`, `mass/method_b/method_b.py`, `mass/method_b/overlay.py`, `mass/method_b/results.json`, `mass/method_b/results_method_b.json`, `mass/method_b/seg3.py`, `mass/method_b/segdefs.py`, `mass/method_b/summarize.py`, `mass/method_c/annotate.py`, `mass/method_c/area.py`, `mass/method_c/area_px.json`, `mass/method_c/crop.py`, `mass/method_c/method_c.py`, `mass/method_c/method_c_raw.json`, `mass/method_c/method_c_results.json`, `mass/method_c/ov.py`, `mass/method_c/runs.py`, `mass/method_c/tail_scan.py`, `mass/method_c/write_results.py`, `mass/region_px.json`, `mass/regions.py`, `mass/report.py`, `mass/results_methodA.json`, `mass/run_all.py`, `mass/sanity.py`, `mass/seg.py`, `mass/viewcrop.py`, `mass/volume.py`, `mass/write_json.py`

</details>

## a3/

Page render and sweep tools used throughout: weightshot.js renders page states and dumps their text; check2.js is the 1,512-state browser sweep; plus one-off probes.

25 files, 189 KB.

- `a3/bay_catch.js`: ---------------------------------------------------------------- catch
- `a3/bay_collide.js`: ---------------------------------------------------------------- unstoppable force vs immovable object
- `a3/bay_contest.js`: ---------------------------------------------------------------- two-player helpers
- `a3/bayweight.js`: ---------------------------------------------------------------- weight (density) tab
- `a3/check.js`: Sweep UI states and look for broken text; check links, feats and slider render time.
- `a3/check2.js`: Sweep solo and duo tabs over strength, density, ground and anchoring; flag broken text and errors.
- `a3/contest_engine.js`: Two-player contests: arm wrestling and wrestling (Rex vs Ollie). Each side is a full context
- `a3/density_engine.js`: Density, weight and the planet under him
- `a3/mkprev.js`: Same wrapper test/shots.js writes, without the screenshots; plus a what-if copy that doesn't force oSame.
- `a3/weightshot.js`: Renders page states given as JSON and dumps their text, for checking wording.

<details><summary>All 25 files</summary>

`a3/aside.js`, `a3/bay_catch.js`, `a3/bay_collide.js`, `a3/bay_contest.js`, `a3/bayweight.js`, `a3/cards.js`, `a3/check.js`, `a3/check2.js`, `a3/contest_engine.js`, `a3/density_engine.js`, `a3/edge.js`, `a3/ladder.js`, `a3/mkprev.js`, `a3/mkwhatif.sh`, `a3/patch_app1.py`, `a3/patch_app2.py`, `a3/patch_app3.py`, `a3/patch_app4.py`, `a3/patch_data.py`, `a3/scaffold1.py`, `a3/scaffold2.py`, `a3/scaffold3.py`, `a3/scaffold4.py`, `a3/weightshot.js`, `a3/whatifshot.js`

</details>

## reverify/

Round 4 re-verification (10 Oct): the two re-checkers' scripts.

31 files, 42 KB.

- `reverify/r.js`: usage: node r.js '[["name",1280,{state},"dark"?]]' [whatif]
- `reverify/rold.js`: usage: node r.js '[["name",1280,{state},"dark"?]]' [whatif]
- `reverify/wsweep.js`: Weight tab: count bullets and check matter caveat presence; also items that would be cut (re-run builder isn't accessible, so we compare bullet count to 6)

<details><summary>All 31 files</summary>

`reverify/cards.js`, `reverify/ctl.js`, `reverify/cut.js`, `reverify/d6.js`, `reverify/drift.js`, `reverify/p0.js`, `reverify/p1.js`, `reverify/p2.js`, `reverify/p3.js`, `reverify/p4.js`, `reverify/p5.js`, `reverify/p7.js`, `reverify/p7b.js`, `reverify/r.js`, `reverify/r0.js`, `reverify/r0b.js`, `reverify/r4.js`, `reverify/r4b.js`, `reverify/r5.js`, `reverify/r6.js`, `reverify/r6b.js`, `reverify/r6c.js`, `reverify/r9.js`, `reverify/r9b.js`, `reverify/rold.js`, `reverify/shot.js`, `reverify/shot2.js`, `reverify/sweep.js`, `reverify/u9c.js`, `reverify/u9c2.js`, `reverify/wsweep.js`

</details>

## r4/

Round 4 leftover fixes (10 Oct): targeted text sweeps (tsweep.js, tsweep2.js).

2 files, 8 KB.

- `r4/tsweep.js`: Targeted page sweep for this round's fixes: wording patterns that should never appear.
- `r4/tsweep2.js`: Targeted page sweep for this round's fixes: wording patterns that should never appear.

<details><summary>All 2 files</summary>

`r4/tsweep.js`, `r4/tsweep2.js`

</details>

## final-verify/

Final verification of the leftover fixes (10 Oct): mysweep.js, p5.js and others.

12 files, 20 KB.

- `final-verify/mysweep.js`: Headless-browser sweep of the page at phone width, collecting page errors and broken text.
- `final-verify/p5.js`: Engine check for one of the leftover fixes, run in node against the built data.
- `final-verify/render.js`: usage: node render.js '[["name",width,{state},"light|dark"],...]'  -&gt; writes out/&lt;name&gt;.txt and out/&lt;name&gt;.png

<details><summary>All 12 files</summary>

`final-verify/bayshot.js`, `final-verify/bus.js`, `final-verify/cal.js`, `final-verify/chips.js`, `final-verify/drift.js`, `final-verify/mysweep.js`, `final-verify/p5.js`, `final-verify/p5b.js`, `final-verify/p5c.js`, `final-verify/render.js`, `final-verify/slipscan.js`, `final-verify/toss.js`

</details>

## bcdata/

Build Calculator data compile (10 Oct): scripts/compile.py builds data/builds.json; facts_fix.py applies the fact-check corrections; girths.py derives Rex and Ollie girths; resolve_test.py checks every template.

23 files, 437 KB.

- `bcdata/scripts/ansur1_waist.py`: Compares natural and omphalion waist girths in ANSUR CSVs (ratio and difference).
- `bcdata/scripts/compile.py`: Compile /home/user/build-calc/data/builds.json from the fact-checked research, the NHANES report and the picture measurements.
- `bcdata/scripts/facts_fix.py`: Load research-all.json, parse fact values, apply verifier corrections, record each change.
- `bcdata/scripts/girths.py`: Rex and Ollie girths from widths and depths measured on the reference picture (3.048 m per 790 px), using an ellipse perimeter with a shape factor and range per site.
- `bcdata/scripts/mra.py`: Averages the 1938-1954 Mr America programme heights, weights and girths from the research facts.
- `bcdata/scripts/resolve_test.py`: Resolves the seven girths of every build in a compiled builds.json through its template chain, to check that each one resolves.

<details><summary>All 23 files</summary>

`bcdata/corr.md`, `bcdata/dump_anthro.txt`, `bcdata/dump_comics.txt`, `bcdata/dump_model.txt`, `bcdata/dump_muscle.txt`, `bcdata/girth/armline.py`, `bcdata/girth/grid.py`, `bcdata/girth/limbs.py`, `bcdata/girth/ovl.py`, `bcdata/girth/prof.py`, `bcdata/notes_gaps.md`, `bcdata/notes_head.md`, `bcdata/notes_ro.md`, `bcdata/notes_tail.md`, `bcdata/ro.md`, `bcdata/scripts/ansur1_waist.py`, `bcdata/scripts/compile.py`, `bcdata/scripts/facts_fix.py`, `bcdata/scripts/girths.py`, `bcdata/scripts/mra.py`, `bcdata/scripts/resolve_test.py`, `bcdata/scripts/rexollie_girths.json`, `bcdata/tmpl.md`

</details>

## buildcalc/

Build Calculator research (10 Oct): ANSUR II analysis and fits, model checks, comic and bodybuilder data scripts.

62 files, 214 KB.

- `buildcalc/ansur2/scripts/analyze_ansur2.py`: ANSUR II (US Army 2012) baselines for the build calculator.
- `buildcalc/ansur2/scripts/extras_ansur2.py`: Extras: readable allometric girth predictors, a lean-heavy ('muscular') subgroup, sanity predictions.
- `buildcalc/anthro_check/scripts/check_desc.py`: Independent recompute of ANSUR II descriptives and comparison to TR-15/007 tables.
- `buildcalc/anthro_check/scripts/check_fits.py`: Independent re-fit of the researcher's derived ANSUR II models.
- `buildcalc/comics/scripts/entry.py`: Print the stat block for an entry heading: find heading line (exact regex), then the next lines up to N containing HEIGHT/WEIGHT
- `buildcalc/comics/scripts/metrics.py`: Derived metrics for stated comic heights/weights.
- `buildcalc/comics/scripts/revhist.py`: usage: python3 -I revhist.py &lt;api_base&gt; &lt;page&gt; &lt;outdir&gt;
- `buildcalc/comics/scripts/statctx.py`: print HEIGHT/WEIGHT lines that occur within N lines after a line matching the name regex
- `buildcalc/model_check/scripts/svlib.py`: Crude segmental frustum volume model on ANSUR II, to measure how well a geometric (girths + lengths) body volume predicts scale weight, and how the implied ...
- `buildcalc/physics/scripts/derived_tables.py`: Derived numbers used in the design note (pure arithmetic; no external data).
- `buildcalc/physics/scripts/scaling_analysis.py`: Scaling / allometry checks on measured anthropometric data.
- `buildcalc/physics/scripts/segment_volume.py`: Crude segmental frustum volume model on ANSUR II, to measure how well a geometric (girths + lengths) body volume predicts scale weight, and how the implied ...
- `buildcalc/physics/scripts/segment_volume_lib.py`: Crude segmental frustum volume model on ANSUR II, to measure how well a geometric (girths + lengths) body volume predicts scale weight, and how the implied ...
- `buildcalc/physics/scripts/vtaper_check.py`: Bias of three weight-from-girth estimators in the most V-shaped / most 'muscular-looking' ANSUR II subjects.
- `buildcalc/scripts/ffmi_bb.py`: Derived FFMI for reported athlete heights/weights. Body-fat values are ASSUMPTIONS unless noted.

<details><summary>All 62 files</summary>

`buildcalc/ansur2/scripts/analyze_ansur2.py`, `buildcalc/ansur2/scripts/compact.py`, `buildcalc/ansur2/scripts/extras_ansur2.py`, `buildcalc/ansur2/scripts/make_facts.py`, `buildcalc/anthro_check/scripts/check_ansur1.py`, `buildcalc/anthro_check/scripts/check_desc.py`, `buildcalc/anthro_check/scripts/check_fits.py`, `buildcalc/anthro_check/scripts/check_seg.py`, `buildcalc/audit-numbers/scripts/ansur.js`, `buildcalc/audit-numbers/scripts/evidence.js`, `buildcalc/audit-numbers/scripts/geo.js`, `buildcalc/audit-numbers/scripts/page.js`, `buildcalc/audit-numbers/scripts/reg.js`, `buildcalc/audit-numbers/scripts/sub.js`, `buildcalc/audit-numbers/scripts/t_bf.js`, `buildcalc/audit-numbers/scripts/t_misc.js`, `buildcalc/audit-numbers/scripts/t_misc2.js`, `buildcalc/audit-page/a1.js`, `buildcalc/audit-page/a10.js`, `buildcalc/audit-page/a11.js`, `buildcalc/audit-page/a12.js`, `buildcalc/audit-page/a13.js`, `buildcalc/audit-page/a2.js`, `buildcalc/audit-page/a3.js`, `buildcalc/audit-page/a4.js`, `buildcalc/audit-page/a5.js`, `buildcalc/audit-page/a6.js`, `buildcalc/audit-page/a7.js`, `buildcalc/audit-page/a8.js`, `buildcalc/audit-page/a9.js`, `buildcalc/audit-page/lib.js`, `buildcalc/comics/scripts/entry.py`, `buildcalc/comics/scripts/gb.py`, `buildcalc/comics/scripts/iafts.py`, `buildcalc/comics/scripts/metrics.py`, `buildcalc/comics/scripts/revcomments.py`, `buildcalc/comics/scripts/revhist.py`, `buildcalc/comics/scripts/statctx.py`, `buildcalc/comics_factcheck/scripts/grepctx.py`, `buildcalc/comics_factcheck/scripts/recompute.py`, `buildcalc/comics_factcheck/scripts/strip.py`, `buildcalc/epmc.py`, `buildcalc/model_check/scripts/abs.py`, `buildcalc/model_check/scripts/recheck.py`, `buildcalc/model_check/scripts/recheck2.py`, `buildcalc/model_check/scripts/recheck3.py`, `buildcalc/model_check/scripts/recheck4.py`, `buildcalc/model_check/scripts/svlib.py`, `buildcalc/muscle_check/scripts/abs.py`, `buildcalc/muscle_check/scripts/h2t.py`, `buildcalc/muscle_check/scripts/recompute.py`, `buildcalc/muscle_check/scripts/xmltxt.py`, `buildcalc/physics/scripts/derived_tables.py`, `buildcalc/physics/scripts/epmc.py`, `buildcalc/physics/scripts/scaling_analysis.py`, `buildcalc/physics/scripts/segment_volume.py`, `buildcalc/physics/scripts/segment_volume_lib.py`, `buildcalc/physics/scripts/txt.py`, `buildcalc/physics/scripts/vtaper_check.py`, `buildcalc/scripts/build_bb_facts.py`, `buildcalc/scripts/ffmi_bb.py`, `buildcalc/txt.py`

</details>

## Top level

One-off scripts at the top of the scratchpad.

1 files, 1 KB.


<details><summary>All 1 files</summary>

`cutshot.js`

</details>

## workflows/

The workflow orchestration scripts (each Workflow launch). They compute the subagent prompts quoted in the transcript.

13 files, 110 KB.

- `workflows/build-calc-research-wf_16409832-67f.js`: build-calc-research: Research sourced data for a character build calculator (weight and girths from height and build), then adversarially verify each topic
- `workflows/build-calculator-wf_84d11c85-160.js`: build-calculator: Compile verified build data, build the character build calculator page, then audit it from two angles and fix confirmed findings
- `workflows/dino-engine-audit-wf_3ca2666a-955.js`: dino-engine-audit: Adversarially audit the super-strength physics engine from four physics lenses, then verify each finding
- `workflows/dino-strength-research-wf_fb502a4a-d6e.js`: dino-strength-research: Research + adversarially verify the data behind a super-strength physics simulator
- `workflows/rex-audit-fixes-wf_068bea6f-0e1.js`: rex-audit-fixes: Fix the 54 confirmed audit findings in four serial batches (density/weight, catch, collide/wrestle, arm/duo/misc), then re-verify every finding on the final build
- `workflows/rex-duo-density-audit-wf_194cccff-88d.js`: rex-duo-density-audit: Adversarial audit of the density/weight and Rex+Ollie features: find issues per lens, then verify each lens
- `workflows/rex-final-fixes-wf_47795ee8-097.js`: rex-final-fixes: Fix the leftovers from the audit re-verification and update the Rex lab text for the new 10 ft picture-based bodies, then re-verify
- `workflows/rex-fix-verification-wf_81cd9d92-dce.js`: rex-fix-verification: Check every confirmed second-audit finding is fixed in the current Rex lab build, and hunt for regressions from the fixes
- `workflows/rex-fix-verification-wf_e1c701fc-dbc.js`: rex-fix-verification: Check every confirmed second-audit finding is fixed in the current Rex lab build, and hunt for regressions from the fixes
- `workflows/rex-mass-from-picture-wf_1b86f7c9-3cf.js`: rex-mass-from-picture: Estimate Rex (and Ollie) body volume and mass from the reference picture at a 10 ft height, three independent methods plus an adversarial check
- `workflows/rex-ollie-design-wf_173e4620-19f.js`: rex-ollie-design: Research and design the physics for density/weight effects and four Rex-and-Ollie two-person simulations, each adversarially checked
- `workflows/rex-page-audit-wf_9deb3ae2-a54.js`: rex-page-audit: Audit the finished Rex Super-Strength Lab page: claims vs numbers, fix regression, data/citations, layout/accessibility; verify each finding
- `workflows/transcript-verify-wf_0032b2ad-0cd.js`: transcript-verify: Independently verify the session-history files against the raw logs: completeness, accuracy, redaction and readability

<details><summary>All 13 files</summary>

`workflows/build-calc-research-wf_16409832-67f.js`, `workflows/build-calculator-wf_84d11c85-160.js`, `workflows/dino-engine-audit-wf_3ca2666a-955.js`, `workflows/dino-strength-research-wf_fb502a4a-d6e.js`, `workflows/rex-audit-fixes-wf_068bea6f-0e1.js`, `workflows/rex-duo-density-audit-wf_194cccff-88d.js`, `workflows/rex-final-fixes-wf_47795ee8-097.js`, `workflows/rex-fix-verification-wf_81cd9d92-dce.js`, `workflows/rex-fix-verification-wf_e1c701fc-dbc.js`, `workflows/rex-mass-from-picture-wf_1b86f7c9-3cf.js`, `workflows/rex-ollie-design-wf_173e4620-19f.js`, `workflows/rex-page-audit-wf_9deb3ae2-a54.js`, `workflows/transcript-verify-wf_0032b2ad-0cd.js`

</details>

## Not copied

Copies of project code are earlier states of engine.js, data.js and the tests, kept for diffing (the patched engine variants in audit/, the catch-base and src-before-armduo baselines, backup/ and old/ trees). The released versions are in the repository.

| Folder | Why | Files | Total size | Main types |
|---|---|---|---|---|
| audit2 | third-party install | 104 | 844.7 MB | .0, .so, .1, .4 |
| final-verify | binary or output | 221 | 783.1 MB | .png, .txt, .log, .json |
| audit2 | binary or output | 307 | 222.2 MB | .json, .png, .html, .txt |
| duo | binary or output | 271 | 200.7 MB | .pdf, .txt, .html, .json |
| audit | binary or output | 223 | 147.2 MB | .json, .png, .jsonl, .pdf |
| mass | binary or output | 105 | 141.6 MB | .npy, .png, .pkl, .csv |
| buildcalc | raw download | 366 | 94.1 MB | .txt, .pdf, .csv, .html |
| buildcalc | binary or output | 416 | 78.8 MB | .html, .png, .txt, .json |
| a3 | binary or output | 227 | 67.6 MB | .png, .html, .out |
| audit3 | binary or output | 303 | 64.0 MB | .json, .png, .html, .txt |
| bcdata | binary or output | 16 | 5.8 MB | .png, .pdf, .json, .txt |
| audit | copy of project code | 36 | 3.3 MB | .js |
| audit2 | copy of project code | 61 | 3.0 MB | .js, .html |
| r4 | copy of project code | 30 | 2.9 MB | .json, .js, .html, .txt |
| catch-base | copy of project code | 30 | 2.8 MB | .json, .js, .txt, .html |
| reverify | binary or output | 87 | 2.6 MB | .html, .txt, .png, .json |
| audit3 | copy of project code | 32 | 1.7 MB | .js, .html |
| reverify | copy of project code | 6 | 1.6 MB | .html, .js |
| src-before-armduo | copy of project code | 4 | 0.6 MB | .js, .html |
| buildcalc | too large | 1 | 0.3 MB | .js |
| duo | copy of project code | 1 | 0.1 MB | .js |
| a3 | copy of project code | 1 | 0.1 MB | .js |
| r4 | binary or output | 4 | 0.0 MB | .log |

Other scratchpad folders that the repository does not cite (earlier probes, backups, page previews) were not copied.
