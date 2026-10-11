/*
 * Silhouettes for the Build Comparison chart.
 *
 * Plain JS. In node: const Figure = require('./figure.js'). In a page: window.Figure.
 * All lengths in metres. Front view: x to the figure's left (the viewer's right), y up from the
 * ground, x = 0 on the midline. Side view: x forward.
 *
 * Human figures are built from a build's height and girths on a template with ANSUR II
 * proportions (data/outline.json): landmark heights as fractions of stature, breadths and depths
 * as fractions of the girth at the same site, limbs as round sections (width = girth / pi).
 * Rex and Ollie are traced from their turnarounds (data/duo-outlines.json).
 *
 * A figure is a list of parts: { name, poly: [[x, y], ...], mark }. mark is one of
 *   'own'      the build's own number (measured, official or reported)  - solid edge
 *   'template' filled in: from a template build, or derived               - dotted edge
 *   'art'      traced from art                                           - dash-dot edge
 * (Nothing is drawn dashed: a dashed border means "reported" on the house status chips.)
 *   'average'  average proportions for every human build (head, hands, feet) - no edge
 *   'tail'     drawn but excluded from the score
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.Figure = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SITES = ['chest', 'waist', 'arm_flexed', 'forearm', 'thigh', 'calf', 'neck'];

  // ---------- curves ----------
  /** Centripetal-free uniform Catmull-Rom through points, n samples per span; open curve. */
  function spline(pts, n) {
    n = n || 6;
    if (pts.length < 3) return pts.slice();
    var out = [];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (var k = 0; k < n; k++) {
        var t = k / n, t2 = t * t, t3 = t2 * t;
        out.push([
          0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
        ]);
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }
  function mirror(pts) { return pts.map(function (p) { return [-p[0], p[1]]; }); }
  /** A closed shape symmetric about x = cx from its right-hand profile [[halfWidth, y], ...] top to bottom. */
  function symmetric(profile, cx, n) {
    var right = spline(profile.map(function (p) { return [cx + p[0], p[1]]; }), n);
    var left = right.slice().reverse().map(function (p) { return [2 * cx - p[0], p[1]]; });
    return right.concat(left);
  }
  /**
   * A limb as a closed outline around an axis from point a in direction angle (radians from
   * straight down, positive towards +x), with stations [[distance, radius], ...].
   */
  function limb(a, angle, stations, n) {
    var dx = Math.sin(angle), dy = -Math.cos(angle); // along the axis
    var nx = -dy, ny = dx;                            // perpendicular, to the +x side when hanging
    var sideA = spline(stations.map(function (s) { return [a[0] + dx * s[0] + nx * s[1], a[1] + dy * s[0] + ny * s[1]]; }), n);
    var sideB = spline(stations.map(function (s) { return [a[0] + dx * s[0] - nx * s[1], a[1] + dy * s[0] - ny * s[1]]; }), n);
    // round caps at both ends
    var cap = function (s, from, to) {
      var c = [a[0] + dx * s[0], a[1] + dy * s[0]], pts = [];
      for (var k = 1; k < 8; k++) {
        var t = from + (to - from) * k / 8;
        pts.push([c[0] + s[1] * (nx * Math.cos(t) + dx * Math.sin(t)), c[1] + s[1] * (ny * Math.cos(t) + dy * Math.sin(t))]);
      }
      return pts;
    };
    var last = stations[stations.length - 1], first = stations[0];
    return sideA.concat(cap(last, 0, Math.PI)).concat(sideB.reverse()).concat(cap(first, Math.PI, 2 * Math.PI));
  }
  function ellipse(cx, cy, rx, ry, n) {
    var out = [];
    n = n || 32;
    for (var k = 0; k < n; k++) { var t = 2 * Math.PI * k / n; out.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]); }
    return out;
  }

  /** Split a closed outline into open polylines, one per run of points in the same band. */
  function bandEdges(poly, bandOf) {
    var edges = [], cur = null;
    for (var i = 0; i <= poly.length; i++) {
      var p = poly[i % poly.length], b = bandOf(p);
      if (!cur || cur.band !== b.band) {
        if (cur) cur.pts.push(p);
        if (i === poly.length) break;
        cur = { band: b.band, mark: b.mark, pts: [p] };
        edges.push(cur);
      } else cur.pts.push(p);
    }
    return edges.filter(function (e) { return e.pts.length > 1; });
  }

  /** Full depth of the ellipse with full width w whose perimeter is G (bisection; w <= G / pi). */
  function ellipseDepthFor(G, w) {
    var per = function (a, b) { var A = a / 2, B = b / 2, h = (A - B) * (A - B) / ((A + B) * (A + B)); return Math.PI * (A + B) * (1 + 3 * h / (10 + Math.sqrt(4 - 3 * h))); };
    var lo = 0, hi = G / 2;
    for (var i = 0; i < 50; i++) { var mid = (lo + hi) / 2; if (per(w, mid) < G) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }

  // ---------- the human template ----------
  /**
   * Builds the geometry of a human figure.
   * T: data/outline.json. g: girths in metres { chest, waist, arm_flexed, forearm, thigh, calf, neck }.
   * marks: { site: 'own' | 'template' } for the 7 girths. opts: { armDeg (A-pose angle, default 20),
   * widthScale (multiplies every width and depth around its own axis, default 1), hipJoint (half
   * spacing of the hip joints as a fraction of stature), shoulderJoint: { in, down } fractions of stature
   * of the shoulder joint centre from the acromion }.
   * Returns { H, front: [parts], side: [parts], dims: {...} }.
   */
  function human(T, H, g, marks, opts) {
    opts = opts || {};
    var f = opts.widthScale || 1;
    var mean = function (group, key) { return T[group][key].mean; };
    var Lv = function (k) { return mean('levels', k) * H; };
    var Ln = function (k) { return mean('lengths', k) * H; };
    var sec = T.sections;
    var C = opts.constants || {};
    var hj = (C.hipJointHalf != null ? C.hipJointHalf : 0.05) * H;
    // Shoulder joint centre: about 2 cm medial to and 4 cm below the acromion in a 1.755 m man
    // (research fact shoulder joint; scaled with height).
    var sjIn = (C.shoulderJointIn != null ? C.shoulderJointIn : 0.0114) * H;
    var sjDown = (C.shoulderJointDown != null ? C.shoulderJointDown : 0.0228) * H;
    var headH = (C.headHeight != null ? C.headHeight : 0.13) * H;
    var armDeg = opts.armDeg != null ? opts.armDeg : 20;

    // Girths that the builds do not carry, from ANSUR II fits on the ones they do.
    var fitS = T.fits.shoulder_girth.b;
    var shoulderG = Math.exp(fitS[0] + fitS[1] * Math.log(g.chest * 1000) + fitS[2] * Math.log(g.arm_flexed * 1000)) / 1000;
    var bt = opts.buttockFit; // [c0, c1, c2, c3] in metres: ln b = c0 + c1 ln waist + c2 ln thigh + c3 ln H
    var buttockG = Math.exp(bt[0] + bt[1] * Math.log(g.waist) + bt[2] * Math.log(g.thigh) + bt[3] * Math.log(H));

    var r = function (girth) { return girth / Math.PI / 2; }; // radius of a round section
    var d = {
      H: H,
      chestB: sec.chest.breadth_over_girth.mean * g.chest * f, chestD: sec.chest.depth_over_girth.mean * g.chest * f,
      waistB: sec.waist.breadth_over_girth.mean * g.waist * f, waistD: sec.waist.depth_over_girth.mean * g.waist * f,
      hipB: sec.hip.breadth_over_girth.mean * buttockG * f, hipD: sec.hip.depth_over_girth.mean * buttockG * f,
      bideltoid: sec.shoulder.breadth_over_girth.mean * shoulderG, biacromial: Ln('biacromialbreadth'),
      neckR: r(g.neck) * f, neckBaseR: r(g.neck * T.ratios.neckbase_over_neck.mean) * f,
      armR: r(g.arm_flexed) * f, foreR: r(g.forearm) * f, wristR: r(g.forearm * T.ratios.wrist_over_forearm.mean) * f,
      thighR: r(g.thigh) * f, lowThighR: r(g.thigh * T.ratios.lowerthigh_over_thigh.mean) * f,
      calfR: r(g.calf) * f, ankleR: r(g.calf * T.ratios.ankle_over_calf.mean) * f,
      headB: Ln('headbreadth'), headL: Ln('headlength'), headH: headH,
      handB: Ln('handbreadth'), handL: Ln('handlength'), footB: Ln('footbreadthhorizontal'), footL: Ln('footlength'),
      upperArmL: Ln('shoulderelbowlength') - sjDown * 0.5, foreArmL: Ln('radialestylionlength'),
      shoulderG: shoulderG, buttockG: buttockG, hipJointHalf: hj
    };
    // The deltoid: the arm's top, sized so that hanging straight down it reaches the bideltoid breadth.
    var sj = [d.biacromial / 2 - sjIn, Lv('acromialheight') - sjDown];
    d.shoulderJoint = sj;
    // bideltoid comes from the unscaled girths, so the deltoid is scaled here with the other widths.
    d.deltR = Math.max(d.bideltoid / 2 - sj[0], d.armR / f) * f;

    var y = {
      top: H, chin: H - headH, neckBase: (Lv('cervicaleheight') + Lv('suprasternaleheight')) / 2,
      acromion: Lv('acromialheight'), axilla: Lv('axillaheight'), chest: Lv('chestheight'), waist: Lv('waistheightomphalion'),
      hip: Lv('trochanterionheight'), crotch: Lv('crotchheight'), knee: Lv('kneeheightmidpatella'),
      tibial: Lv('tibialheight'), malleolus: Lv('lateralmalleolusheight')
    };
    y.lowThigh = y.knee + 0.03 * H;
    y.calf = y.malleolus + 0.65 * (y.tibial - y.malleolus);
    y.ankle = y.malleolus + 0.02 * H;
    d.levels = y;

    var mk = function (site) { return marks && marks[site] ? marks[site] : 'own'; };
    var weakest = function () { for (var i = 0; i < arguments.length; i++) if (mk(arguments[i]) === 'template') return 'template'; return 'own'; };
    var front = [], side = [];

    // One outline for the neck, torso and legs (right half, then mirrored). Where the thighs or
    // calves meet, the inner edge runs down the midline, as in a silhouette of touching legs.
    var chestHalf = d.chestB / 2, waistHalf = d.waistB / 2, hipHalf = d.hipB / 2;
    // The leg axes are bones: a scaled-up figure keeps the unscaled build's axes (opts.legAxis).
    var legX = opts.legAxis != null ? opts.legAxis : Math.max(hj, hipHalf - d.thighR);
    // Two round thighs would be wider than the hips (ANSUR II hip breadth is the widest point of the
    // hips and upper thighs, standing). So the top of the thigh is drawn no wider than the hip line
    // allows, and deeper to keep its girth: an ellipse with that width and the measured girth.
    d.thighW = Math.min(d.thighR, Math.max(hipHalf - legX, d.lowThighR));
    d.thighD = ellipseDepthFor(2 * Math.PI * d.thighR, 2 * d.thighW) / 2;
    d.legAxis = legX;
    var fb = d.footB / 2, fo = 0.012 * H;
    // The trapezius: a convex slope from the side of the neck to the acromion.
    var trapX = function (t) { var x0 = d.neckR * 1.1; return x0 + t * (Math.max(d.biacromial / 2, x0 + 0.01 * H) - x0); };
    var outer = spline([
      // The neck starts inside the head (so a thick neck meets the jaw instead of showing a flat top).
      [Math.min(d.neckR, d.headB * 0.42), y.chin + 0.3 * headH], [d.neckR, y.chin - 0.004 * H], [d.neckR * 1.1, y.neckBase + 0.016 * H],
      [trapX(0.3), y.neckBase + 0.005 * H], [trapX(0.65), (y.neckBase + y.acromion) / 2 - 0.001 * H],
      [d.biacromial / 2, y.acromion], [Math.max(sj[0] + d.armR * 0.3, chestHalf * 1.04), y.axilla + 0.012 * H],
      [chestHalf * 1.02, y.axilla - 0.006 * H], [chestHalf, y.chest], [(chestHalf + waistHalf) / 2 + 0.003 * H, (y.chest + y.waist) / 2],
      [waistHalf, y.waist], [(waistHalf + hipHalf) / 2 + 0.003 * H, (y.waist + y.hip) / 2], [hipHalf, y.hip],
      [Math.max(hipHalf, legX + d.thighW) * 0.995, y.crotch - 0.015 * H], [legX + (d.thighW + d.lowThighR) / 2 * 1.02, (y.crotch + y.lowThigh) / 2],
      [legX + d.lowThighR, y.lowThigh], [legX + d.lowThighR * 0.9, y.knee], [legX + d.calfR, y.calf],
      [legX + (d.calfR + d.ankleR) / 2 * 0.96, (y.calf + y.ankle) / 2], [legX + d.ankleR, y.ankle], [legX + d.ankleR * 0.97, y.malleolus]
    ], 6);
    var foot = [[legX + fo + fb, 0.014 * H], [legX + fo + fb * 0.92, 0], [legX + fo - fb * 0.92, 0], [legX + fo - fb, 0.014 * H]];
    var inner = spline([
      [legX - d.ankleR * 0.97, y.malleolus], [legX - d.ankleR, y.ankle], [legX - (d.calfR * 0.9 + d.ankleR) / 2, (y.calf + y.ankle) / 2],
      [legX - d.calfR * 0.9, y.calf], [legX - d.lowThighR * 0.85, y.knee], [legX - d.lowThighR, y.lowThigh],
      [legX - (d.thighW + d.lowThighR) / 2, (y.crotch + y.lowThigh) / 2], [legX - d.thighW * 0.97, y.crotch - 0.03 * H]
    ], 6).map(function (p) { return [Math.max(0, p[0]), p[1]]; });
    var crotchY = y.crotch;
    // The inner edges meet the crotch; when the thighs overlap, the midline carries the outline up to it.
    var right = outer.concat(foot).concat(inner).concat([[0, Math.max(crotchY, inner[inner.length - 1][1])]]);
    var body = right.concat(mirror(right).reverse().slice(1));
    // Marking bands down the outline: which girth (or none) sets each stretch of edge.
    var bandOf = function (p) {
      if (p[1] > y.neckBase + 0.01 * H) return { band: 'neck', mark: mk('neck') };
      if (p[1] > y.axilla) return { band: 'shoulders', mark: weakest('chest', 'arm_flexed') };
      if (p[1] > (y.chest + y.waist) / 2) return { band: 'chest', mark: mk('chest') };
      if (p[1] > (y.waist + y.hip) / 2) return { band: 'waist', mark: mk('waist') };
      if (p[1] > y.crotch - 0.015 * H && Math.abs(p[0]) > legX) return { band: 'hips', mark: weakest('waist', 'thigh') };
      if (p[1] > y.knee) return { band: 'thigh', mark: mk('thigh') };
      if (p[1] > y.malleolus) return { band: 'calf', mark: mk('calf') };
      return { band: 'foot', mark: 'average' };
    };
    var edges = bandEdges(body, bandOf);
    front.push({ name: 'head', mark: 'average', poly: ellipse(0, H - headH / 2, d.headB / 2 * 1.02, headH / 2, 36) });
    front.push({ name: 'body', mark: 'own', poly: body, edges: edges });
    // Arms in an A-pose: upper arm from the shoulder joint, forearm from the elbow, hand.
    var ang = armDeg * Math.PI / 180;
    [1, -1].forEach(function (s) {
      var a = s * ang, origin = [s * sj[0], sj[1]];
      var Lu = d.upperArmL, Lf = d.foreArmL;
      var elbowR = (d.armR + d.foreR) / 2 * 0.78;
      d.armStations = { upper: [[0, d.deltR], [0.22 * Lu, d.deltR * 0.92], [0.45 * Lu, d.armR], [0.75 * Lu, d.armR * 0.9], [Lu, elbowR]],
        fore: [[0, elbowR], [0.22 * Lf, d.foreR], [0.6 * Lf, (d.foreR + d.wristR) / 2 * 1.02], [Lf, d.wristR]], Lu: Lu, Lf: Lf };
      front.push({ name: s > 0 ? 'left upper arm' : 'right upper arm', mark: mk('arm_flexed'), poly: limb(origin, a, [[0, d.deltR], [0.22 * Lu, d.deltR * 0.92], [0.45 * Lu, d.armR], [0.75 * Lu, d.armR * 0.9], [Lu, elbowR]], 6) });
      var elbow = [origin[0] + Math.sin(a) * Lu, origin[1] - Math.cos(a) * Lu];
      front.push({ name: s > 0 ? 'left forearm' : 'right forearm', mark: mk('forearm'), poly: limb(elbow, a, [[0, elbowR], [0.22 * Lf, d.foreR], [0.6 * Lf, (d.foreR + d.wristR) / 2 * 1.02], [Lf, d.wristR]], 6) });
      var wrist = [elbow[0] + Math.sin(a) * Lf, elbow[1] - Math.cos(a) * Lf];
      front.push({ name: s > 0 ? 'left hand' : 'right hand', mark: 'average', poly: limb(wrist, a, [[0, d.wristR * 0.95], [0.35 * d.handL, d.handB * 0.36], [0.75 * d.handL, d.handB * 0.32], [d.handL * 0.95, d.handB * 0.22]], 5) });
    });

    // Side view: depth split front/back of a plumb line through the hip joint (estimate: average
    // posture; ANSUR II gives depths, not where they sit).
    var A = function (depth, fwd) { return [depth * fwd, depth * (1 - fwd)]; }; // [forward, back]
    var stations = [
      [y.chin + headH * 0.4, A(d.neckR * 1.6, 0.4)], [y.chin, A(d.neckR * 2, 0.5)], [y.neckBase + 0.01 * H, A(d.neckBaseR * 2, 0.45)],
      [y.acromion, A(d.chestD * 0.9, 0.5)], [y.chest, A(d.chestD, 0.55)], [(y.chest + y.waist) / 2, A((d.chestD + d.waistD) / 2, 0.55)], [y.waist, A(d.waistD, 0.55)],
      [y.hip, A(d.hipD, 0.42)], [y.crotch, A(d.hipD * 0.85, 0.45)], [y.crotch - 0.05 * H, A(d.thighD * 2, 0.52)],
      [y.lowThigh, A(d.lowThighR * 2, 0.55)], [y.knee, A(d.lowThighR * 1.85, 0.58)], [y.calf, A(d.calfR * 2, 0.42)],
      [y.ankle, A(d.ankleR * 2, 0.5)]
    ];
    var fwdPts = spline(stations.map(function (s) { return [s[1][0], s[0]]; }), 5);
    var backPts = spline(stations.map(function (s) { return [-s[1][1], s[0]]; }), 5);
    var sidePoly = fwdPts.concat([[d.ankleR * 1.1, y.malleolus], [d.footL * 0.75, 0.012 * H], [d.footL * 0.75, 0], [-d.footL * 0.25, 0], [-d.footL * 0.25, 0.015 * H], [-d.ankleR * 0.9, y.malleolus]]).concat(backPts.reverse());
    var sideBand = function (p) {
      if (p[1] > H - headH * 0.9) return { band: 'head', mark: 'average' };
      if (p[1] > y.neckBase) return { band: 'neck', mark: mk('neck') };
      if (p[1] > y.axilla) return { band: 'shoulders', mark: weakest('chest', 'arm_flexed') };
      if (p[1] > (y.chest + y.waist) / 2) return { band: 'chest', mark: mk('chest') };
      if (p[1] > (y.waist + y.hip) / 2) return { band: 'waist', mark: mk('waist') };
      if (p[1] > y.crotch - 0.015 * H) return { band: 'hips', mark: weakest('waist', 'thigh') };
      if (p[1] > y.knee) return { band: 'thigh', mark: mk('thigh') };
      if (p[1] > y.malleolus) return { band: 'calf', mark: mk('calf') };
      return { band: 'foot', mark: 'average' };
    };
    side.push({ name: 'head', mark: 'average', poly: ellipse(d.headL * 0.08, H - headH * 0.5, d.headL / 2, headH / 2, 36) });
    side.push({ name: 'body', mark: 'own', poly: sidePoly, edges: bandEdges(sidePoly, sideBand) });
    return { H: H, front: front, side: side, dims: d };
  }

  // ---------- Rex and Ollie ----------
  /**
   * A traced figure in metres. outlines: one character from data/duo-outlines.json; view: 'front'
   * or 'side'; skullH: height of the top of the skull in metres. Points are scaled so the skull top
   * sits at skullH, x centred on the body's midline; the side view faces +x.
   */
  function traced(C, view, skullH) {
    var v = C.views[view];
    var s = skullH / (v.ground_y - v.skull_y);
    var flip = v.facing === 'left' ? -1 : 1; // side views are drawn facing right, like the human ones
    var conv = function (p) { return [(p[0] - v.mid_x) * s * flip, (v.ground_y - p[1]) * s]; };
    var parts = v.body.map(function (p, i) { return { name: 'body ' + (i + 1), mark: 'art', poly: p.map(conv) }; });
    v.tail.forEach(function (p, i) { parts.push({ name: 'tail ' + (i + 1), mark: 'tail', poly: p.map(conv) }); });
    return { H: (v.ground_y - v.top_y) * s, skullH: skullH, front: view === 'front' ? parts : null, side: view === 'side' ? parts : null, parts: parts, mPerPx: s };
  }


  // ---------- sheets ----------
  /** Fill polygons (metres) into an RGBA image at k px per metre with origin (ox, oy) on the ground. */
  function fillParts(img, parts, k, ox, oy, rgb) {
    parts.forEach(function (p) {
      var poly = p.poly.map(function (q) { return [ox + q[0] * k, oy - q[1] * k]; });
      var y0 = Infinity, y1 = -Infinity;
      poly.forEach(function (q) { if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; });
      for (var y = Math.max(0, Math.floor(y0)); y <= Math.min(img.height - 1, Math.ceil(y1)); y++) {
        var yc = y + 0.5, xs = [];
        for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
          var a = poly[j], b = poly[i];
          if ((a[1] <= yc && b[1] > yc) || (b[1] <= yc && a[1] > yc)) xs.push(a[0] + (yc - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
        }
        xs.sort(function (p1, p2) { return p1 - p2; });
        for (var q = 0; q + 1 < xs.length; q += 2) {
          for (var x = Math.max(0, Math.ceil(xs[q] - 0.5)); x <= Math.min(img.width - 1, Math.floor(xs[q + 1] - 0.5)); x++) {
            var o = (y * img.width + x) * 4; img.data[o] = rgb[0]; img.data[o + 1] = rgb[1]; img.data[o + 2] = rgb[2]; img.data[o + 3] = 255;
          }
        }
      }
    });
  }

  /**
   * A model sheet to the spec: front, side and back views side by side at one scale, a shared
   * ground line, a height bar, and guide lines at the shoulder, chest, waist, crotch and knee.
   * views: { front: parts, side: parts, back: parts (default: the front mirrored) } in metres;
   * H: the height the bar marks (top of the skull); levels: { shoulder, chest, waist, crotch, knee }
   * in metres. opts: { figurePx (default 2000), fg, bg, line }.
   * Returns { width, height, data: Uint8ClampedArray RGBA, k (px per metre), ground (row) }.
   */
  function renderSheet(views, H, levels, opts) {
    opts = opts || {};
    var figurePx = opts.figurePx || 2000;
    var k = figurePx / H;
    var back = views.back || views.front.map(function (p) { return { name: p.name, mark: p.mark, poly: p.poly.map(function (q) { return [-q[0], q[1]]; }) }; });
    var list = [views.front, views.side, back];
    var boxes = list.map(bounds);
    var top = Math.max.apply(null, boxes.map(function (b) { return b[3]; }));
    var margin = Math.round(0.08 * figurePx), gap = Math.round(0.12 * figurePx), barW = Math.round(0.012 * figurePx);
    var width = margin + barW + gap, xs = [];
    boxes.forEach(function (b) { xs.push(width - b[0] * k); width += (b[2] - b[0]) * k + gap; });
    width = Math.ceil(width - gap + margin);
    var height = Math.ceil(margin + top * k + margin);
    var ground = height - margin;
    var bg = opts.bg || [255, 255, 255], fg = opts.fg || [0, 0, 0], line = opts.line || [150, 150, 150];
    var data = new Uint8ClampedArray(width * height * 4);
    for (var i = 0; i < width * height; i++) { data[i * 4] = bg[0]; data[i * 4 + 1] = bg[1]; data[i * 4 + 2] = bg[2]; data[i * 4 + 3] = 255; }
    var img = { width: width, height: height, data: data };
    list.forEach(function (parts, n) { fillParts(img, parts, k, xs[n], ground, fg); });
    var hline = function (yRow, col, thick) {
      for (var t = 0; t < thick; t++) { var yy = Math.round(yRow) + t; if (yy < 0 || yy >= height) continue; for (var x = 0; x < width; x++) { var o = (yy * width + x) * 4; data[o] = col[0]; data[o + 1] = col[1]; data[o + 2] = col[2]; } }
    };
    if (levels) ['shoulder', 'chest', 'waist', 'crotch', 'knee'].forEach(function (key) { if (levels[key] != null) hline(ground - levels[key] * k, line, 2); });
    hline(ground, line, 2);
    // height bar: from the ground to H, at the left
    for (var y = Math.round(ground - H * k); y < ground; y++) for (var x = margin; x < margin + barW; x++) { var o = (y * width + x) * 4; data[o] = line[0]; data[o + 1] = line[1]; data[o + 2] = line[2]; }
    img.k = k; img.ground = ground; img.views = xs;
    return img;
  }


  // ---------- where the body stops working ----------
  function pointInPoly(pt, poly) {
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var a = poly[i], b = poly[j];
      if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
    }
    return inside;
  }
  /** Radius of a limb at distance s along its stations (linear between stations). */
  function radiusAt(st, s) {
    if (s <= st[0][0]) return st[0][1];
    for (var i = 1; i < st.length; i++) if (s <= st[i][0]) return st[i - 1][1] + (st[i][1] - st[i - 1][1]) * (s - st[i - 1][0]) / (st[i][0] - st[i - 1][0]);
    return st[st.length - 1][1];
  }

  /**
   * (a) The smallest angle from vertical at which the arm clears the torso in the front view.
   * The arm swings about the shoulder joint; only the arm below the deltoid (from 30% of the upper
   * arm down) and the torso below the armpit are tested. Returns degrees.
   */
  function armClearance(fig) {
    var d = fig.dims, body = fig.front.filter(function (p) { return p.name === 'body'; })[0].poly;
    var torso = body.filter(function (p) { return p[1] < d.levels.axilla && p[1] > d.levels.crotch; });
    var sj = d.shoulderJoint, st = d.armStations;
    for (var deg = 0; deg <= 90; deg += 0.25) {
      var a = deg * Math.PI / 180, hit = false;
      var dx = Math.sin(a), dy = -Math.cos(a), nx = -dy, ny = dx;
      // inner edge of the upper arm and forearm (the side facing the body: -n)
      for (var s = 0.3 * st.Lu; s <= st.Lu + st.Lf && !hit; s += (st.Lu + st.Lf) / 120) {
        var r = s <= st.Lu ? radiusAt(st.upper, s) : radiusAt(st.fore, s - st.Lu);
        var p = [sj[0] + dx * s - nx * r, sj[1] + dy * s - ny * r];
        if (p[1] < d.levels.axilla && p[1] > d.levels.crotch && pointInPoly(p, body)) hit = true;
      }
      // and no torso edge point inside the arm band
      if (!hit) for (var i = 0; i < torso.length && !hit; i++) {
        var q = torso[i]; if (q[0] <= 0) continue;
        var rx = q[0] - sj[0], ry = q[1] - sj[1];
        var along = rx * dx + ry * dy, across = rx * nx + ry * ny;
        if (along < 0.3 * st.Lu || along > st.Lu + st.Lf) continue;
        var rr = along <= st.Lu ? radiusAt(st.upper, along) : radiusAt(st.fore, along - st.Lu);
        if (Math.abs(across) < rr) hit = true;
      }
      if (!hit) return deg;
    }
    return 90;
  }


  /**
   * (a') The smallest angle from vertical at which the upper-arm bone (the line from the shoulder
   * joint to the elbow) stays outside the torso outline: the arm cannot hang closer even if all the
   * soft tissue between arm and body were squashed flat. Returns degrees.
   */
  function armBoneClearance(fig) {
    var d = fig.dims, body = fig.front.filter(function (p) { return p.name === 'body'; })[0].poly;
    var sj = d.shoulderJoint, Lu = d.armStations.Lu;
    for (var deg = 0; deg <= 90; deg += 0.25) {
      var a = deg * Math.PI / 180, hit = false;
      for (var s = 0.15 * Lu; s <= Lu && !hit; s += Lu / 100) {
        var p = [sj[0] + Math.sin(a) * s, sj[1] - Math.cos(a) * s];
        if (p[1] < d.levels.axilla && pointInPoly(p, body)) hit = true;
      }
      if (!hit) return deg;
    }
    return 90;
  }


  /**
   * (a) Arm rest angle: the smallest angle from vertical at which the arm hangs clear of the body
   * outline (torso, hips, thighs) in the front view, testing only below chest height (the armpit
   * folds join arm and torso above it). build(armDeg) returns the figure with its arms at armDeg.
   * Returns degrees (90 if the arm cannot clear).
   */
  function armRestAngle(build) {
    var clear = function (deg) {
      var fig = build(deg), d = fig.dims, yc = d.levels.chest, sj = d.shoulderJoint, near = 0.35 * d.armStations.Lu;
      var ax = Math.sin(deg * Math.PI / 180), ay = -Math.cos(deg * Math.PI / 180);
      // Only below chest height, and only from a third of the way down the upper arm (measured along
      // the arm): above that, the deltoid and the armpit folds join arm and torso.
      var tested = function (q) { return q[1] < yc && (q[0] - sj[0]) * ax + (q[1] - sj[1]) * ay > near; };
      var body = fig.front.filter(function (p) { return p.name === 'body'; })[0].poly;
      var arm = fig.front.filter(function (p) { return /^left (upper arm|forearm|hand)$/.test(p.name); });
      for (var i = 0; i < arm.length; i++) {
        var poly = arm[i].poly;
        for (var j = 0; j < poly.length; j++) if (tested(poly[j]) && pointInPoly(poly[j], body)) return false;
      }
      for (var k = 0; k < body.length; k++) {
        if (body[k][0] <= 0 || !tested(body[k])) continue;
        for (var a = 0; a < arm.length; a++) if (pointInPoly(body[k], arm[a].poly)) return false;
      }
      return true;
    };
    if (clear(0)) return 0;
    if (!clear(90)) return 90;
    var lo = 0, hi = 90;
    for (var it = 0; it < 14; it++) { var mid = (lo + hi) / 2; if (clear(mid)) hi = mid; else lo = mid; }
    return hi;
  }

  /**
   * (b) How far down the thighs touch, as a fraction of the way from the crotch to the knee
   * (1 = all the way). The leg axes stay where the bones are.
   */
  function thighContact(fig) {
    var d = fig.dims, y = d.levels, steps = 50, touch = 0;
    for (var i = 0; i <= steps; i++) {
      var yy = y.crotch - 0.03 * d.H - (y.crotch - 0.03 * d.H - y.lowThigh) * i / steps;
      var t = (y.crotch - 0.03 * d.H - yy) / (y.crotch - 0.03 * d.H - y.lowThigh);
      var r = d.thighW * 0.97 + (d.lowThighR - d.thighW * 0.97) * t; // the inner edge between its stations
      if (d.legAxis - r <= 0) touch = i / steps; else break;
    }
    return touch;
  }

  /**
   * (c) The most the elbow can bend before the front of the forearm meets the front of the upper
   * arm, in degrees (0 = straight, 180 = folded flat). Round limbs, the bones on their axes, in the
   * plane of the bend. Contact closer to the elbow than crease (metres, along the upper arm) is
   * the skin fold of the elbow crease and does not stop the bend.
   */
  function elbowFlexion(fig, crease, squash) {
    squash = squash || 0;
    var st = fig.dims.armStations, Lu = st.Lu, Lf = st.Lf;
    var up = function (x) { return radiusAt(st.upper, Lu - x); }; // x measured from the elbow
    var fo = function (t) { return radiusAt(st.fore, t); };
    var blocked = function (phi) {
      var alpha = (180 - phi) * Math.PI / 180; // interior angle between the segments
      // Upper arm along +x from the elbow, front surface y = up(x). A point on the forearm's front
      // surface at distance t: t along the forearm axis plus fo(t) towards the upper arm.
      for (var t = 0; t <= Lf; t += Lf / 300) {
        var px = t * Math.cos(alpha) + fo(t) * Math.sin(alpha), py = t * Math.sin(alpha) - fo(t) * Math.cos(alpha);
        if (px >= crease && px <= Lu && py < up(px) - squash) return true;
      }
      return false;
    };
    for (var phi = 0; phi <= 180; phi += 0.25) if (blocked(phi)) return phi - 0.25;
    return 180;
  }

  /** Solve for the width factor at which f(widthScale) crosses a target (bisection; f increasing). */
  function solveScale(build, test, lo, hi) {
    lo = lo || 1; hi = hi || 6;
    if (test(build(lo))) return lo;
    if (!test(build(hi))) return null;
    for (var i = 0; i < 40; i++) { var mid = (lo + hi) / 2; if (test(build(mid))) hi = mid; else lo = mid; }
    return hi;
  }

  /** Bounding box of a list of parts. */
  function bounds(parts) {
    var b = [Infinity, Infinity, -Infinity, -Infinity];
    parts.forEach(function (p) { p.poly.forEach(function (q) { if (q[0] < b[0]) b[0] = q[0]; if (q[1] < b[1]) b[1] = q[1]; if (q[0] > b[2]) b[2] = q[0]; if (q[1] > b[3]) b[3] = q[1]; }); });
    return b;
  }

  /** SVG path data for a polygon, mapping metres to pixels with scale k and origin (ox, oy). */
  function pathData(poly, k, ox, oy) {
    var s = '';
    for (var i = 0; i < poly.length; i++) s += (i ? 'L' : 'M') + (ox + poly[i][0] * k).toFixed(1) + ' ' + (oy - poly[i][1] * k).toFixed(1);
    return s + 'Z';
  }

  return { SITES: SITES, armClearance: armClearance, armBoneClearance: armBoneClearance, armRestAngle: armRestAngle, thighContact: thighContact, elbowFlexion: elbowFlexion, solveScale: solveScale, pointInPoly: pointInPoly, fillParts: fillParts, renderSheet: renderSheet, bandEdges: bandEdges, spline: spline, symmetric: symmetric, limb: limb, ellipse: ellipse, human: human, traced: traced, bounds: bounds, pathData: pathData };
});
