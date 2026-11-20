// Character drawings from the live game on main, commit 4d1faa2 (2026-11-17).
// Squatch: Re in src/game/60-frame-draw.js
// Mops: Fe in the same file. The separate mop prop is left out; the beard is the mop.
// Guests: drawCh1Alien in src/game/12-ch1-redesign.js
// Hidden eyes: ga in src/game/10-ch1.js
// The title screen of that game still uses an older Squatch and Mops. Those are not used here.
(function () {
  let e, y = "#1e2430", n = { T: 0 };
  function use(ctx, time) { e = ctx; n = { T: time || 0 }; }
function m(l, o, i, s, q) {
  let d = Math.max(0, Math.min(q, i / 2, s / 2));
  (e.beginPath(),
    e.moveTo(l + d, o),
    e.arcTo(l + i, o, l + i, o + s, d),
    e.arcTo(l + i, o + s, l, o + s, d),
    e.arcTo(l, o + s, l, o, d),
    e.arcTo(l, o, l + i, o, d),
    e.closePath());
}
function L(l, o, i) {
  (e.beginPath(), e.arc(l, o, Math.abs(i), 0, Math.PI * 2));
}
function X(l, o, i, s) {
  (e.beginPath(), e.ellipse(l, o, Math.abs(i), Math.abs(s), 0, 0, Math.PI * 2));
}
function r(l, o = 2) {
  (l && ((e.fillStyle = l), e.fill()),
    o && ((e.strokeStyle = y), (e.lineWidth = o), (e.lineJoin = "round"), (e.lineCap = "round"), e.stroke()));
}
function C(l, o, i) {
  (e.beginPath(), e.moveTo(l[0], l[1]));
  for (let s = 2; s < l.length; s += 2) e.lineTo(l[s], l[s + 1]);
  ((e.strokeStyle = o), (e.lineWidth = i), (e.lineCap = "round"), (e.lineJoin = "round"), e.stroke());
}
  m5 = {
    fur: "#6b4428",
    dark: "#55351f",
    mask: "#f4c39a",
    ear: "#d98c62",
    head: 15,
    bodyW: 11.5,
    bodyH: 14,
    arm: 12,
    leg: 7,
    out: 2,
    amp: 2.2,
  };
function XV(l, o, i, s, q, d, A = 0) {
  e.beginPath();
  for (let T = 0; T <= q; T++) {
    let R = A + (T / q) * Math.PI * 2,
      P = l + Math.cos(R) * i,
      _ = o + Math.sin(R) * s;
    if (T === 0) {
      e.moveTo(P, _);
      continue;
    }
    let $ = A + ((T - 0.5) / q) * Math.PI * 2;
    e.quadraticCurveTo(l + Math.cos($) * (i + d * 1.6), o + Math.sin($) * (s + d * 1.6), P, _);
  }
  e.closePath();
}
function wV(l, o) {
  ((e.fillStyle = l), e.fill(), o && ((e.lineWidth = o), (e.strokeStyle = y), (e.lineJoin = "round"), e.stroke()));
}
function G2(l, o, i, s) {
  (e.beginPath(),
    e.moveTo(l, o - s * 0.28),
    e.bezierCurveTo(l - i * 0.15, o - s * 0.62, l - i * 0.62, o - s * 0.55, l - i * 0.5, o - s * 0.05),
    e.bezierCurveTo(l - i * 0.45, o + s * 0.4, l - i * 0.2, o + s * 0.52, l, o + s * 0.52),
    e.bezierCurveTo(l + i * 0.2, o + s * 0.52, l + i * 0.45, o + s * 0.4, l + i * 0.5, o - s * 0.05),
    e.bezierCurveTo(l + i * 0.62, o - s * 0.55, l + i * 0.15, o - s * 0.62, l, o - s * 0.28),
    e.closePath());
}
function St(l, o, i, s, q, d, A) {
  ((e.lineCap = "round"),
    A && ((e.strokeStyle = y), (e.lineWidth = q + A * 2), e.beginPath(), e.moveTo(l, o), e.lineTo(i, s), e.stroke()),
    (e.strokeStyle = d),
    (e.lineWidth = q),
    e.beginPath(),
    e.moveTo(l, o),
    e.lineTo(i, s),
    e.stroke());
}
function F(l, o, i, s) {
  (e.beginPath(), e.arc(l, o, i, 0, 7), (e.fillStyle = s), e.fill());
}
function Re(l, o, i, s) {
  let q = m5;
  (e.save(), e.translate(l, o), e.scale(i * (s.f || 1), i));
  let d = s.walk || 0,
    A = Math.sin(d) * 0.5,
    T = q.leg,
    R = q.bodyH,
    P = -T - R - q.head * 0.75;
  s.legs !== !1 &&
    (e.beginPath(),
    e.ellipse(0, 1, q.bodyW + 5, 3, 0, 0, 7),
    (e.fillStyle = "rgba(30,36,48,.15)"),
    e.fill(),
    St(-3, -T, -3 + A * 6, 0, 4.2, q.dark, q.out),
    St(3, -T, 3 - A * 6, 0, 4.2, q.dark, q.out),
    F(-3 + A * 6 + 0.5, 0, 2.4, q.mask),
    F(3 - A * 6 + 0.5, 0, 2.4, q.mask));
  let _ = -T - R + 3,
    $ = s.singing ? Math.PI - 0.5 : s.carry ? 1.2 : 0.35 + A * 0.4,
    gV = s.singing ? -(Math.PI - 0.6) : -0.35 - A * 0.4;
  (St(-q.bodyW + 1, _, -q.bodyW + 1 + Math.sin(gV) * q.arm, _ + Math.cos(gV) * q.arm, 3.6, q.dark, q.out),
    F(-q.bodyW + 1 + Math.sin(gV) * q.arm, _ + Math.cos(gV) * q.arm, 2.2, q.mask),
    XV(0, -T - R / 2, q.bodyW, R / 2 + 1, 11, q.amp * 0.8, 0.3),
    wV(q.fur, q.out));
  let oe = q.bodyW - 1 + Math.sin($) * q.arm,
    ve = _ + Math.cos($) * q.arm;
  (St(q.bodyW - 1, _, oe, ve, 3.6, q.fur, q.out),
    F(oe, ve, 2.2, q.mask),
    s.carry && (m(oe - 4, ve - 2, 10, 11, 1.5), r("#cdbb98", 1.2)),
    // The robot janitors notice from the lobby (D15): a white sheet in his hand.
    s.paper && (m(oe - 3, ve - 12, 11, 14, 1), r("#ffffff", 1), C([oe - 1, ve - 8, oe + 6, ve - 8], "#e5533d", 1.4), C([oe - 1, ve - 4, oe + 6, ve - 4], y, 0.8)));
  for (let Qe of [-q.head * 0.95, q.head * 0.95]) (e.beginPath(), e.arc(Qe, P + 1, 3.4, 0, 7), wV(q.ear, q.out));
  if (
    (XV(0, P, q.head * 0.92, q.head * 0.85, 14, q.amp, -Math.PI / 2),
    wV(q.fur, q.out),
    G2(0, P + q.head * 0.18, q.head * 1.25, q.head * 1.05),
    wV(q.mask, 1.5),
    s.eyes === "closed")
  ) {
    ((e.strokeStyle = y), (e.lineWidth = 1.1));
    for (let Qe of [-1, 1]) (e.beginPath(), e.arc(Qe * q.head * 0.27, P + q.head * 0.1, 1.6, 0.1, Math.PI - 0.1), e.stroke());
  } else if (s.eyes === "wide")
    (F(-q.head * 0.28, P + q.head * 0.1, 3.4, "#ffffff"),
      F(q.head * 0.28, P + q.head * 0.1, 3.4, "#ffffff"),
      F(-q.head * 0.28, P + q.head * 0.14, 1.7, y),
      F(q.head * 0.28, P + q.head * 0.14, 1.7, y));
  else (F(-q.head * 0.27, P + q.head * 0.12, 1.5, y), F(q.head * 0.27, P + q.head * 0.12, 1.5, y));
  (s.singing
    ? (e.beginPath(), e.ellipse(0, P + q.head * 0.45, 1.8, 2.2 + Math.sin(n.T * 12) * 0.5, 0, 0, 7), (e.fillStyle = y), e.fill())
    : (e.beginPath(), e.arc(0, P + q.head * 0.38, 2.2, 0.2, Math.PI - 0.2), (e.strokeStyle = y), (e.lineWidth = 1.1), e.stroke()),
    s.jacket &&
      (m(-q.bodyW * 0.95, -T - R * 0.35, q.bodyW * 1.9, R * 0.85, 5),
      r("#3478f6", 1.4),
      m(-3, -T - R * 0.05, 8, 6, 1),
      r("#2456b0", 1)),
    s.horns &&
      ((e.strokeStyle = "#c9ad84"),
      (e.lineWidth = 2.8),
      (e.lineCap = "round"),
      e.beginPath(),
      e.moveTo(-q.head * 0.28, P - q.head * 0.55),
      e.quadraticCurveTo(-q.head * 0.95, P - q.head * 1.35, -q.head * 0.15, P - q.head * 1.05),
      e.moveTo(q.head * 0.28, P - q.head * 0.55),
      e.quadraticCurveTo(q.head * 0.95, P - q.head * 1.35, q.head * 0.15, P - q.head * 1.05),
      e.stroke()),
    s.goatBeard &&
      (e.beginPath(),
      e.moveTo(-2, P + q.head * 0.55),
      e.quadraticCurveTo(-7, P + q.head * 1.15, 0, P + q.head * 1.35),
      e.quadraticCurveTo(7, P + q.head * 1.15, 2, P + q.head * 0.55),
      r("#f7f4ee", 1.2)),
    s.hawaiian &&
      (m(-q.bodyW * 0.95, -T - R * 0.35, q.bodyW * 1.9, R * 0.85, 5),
      r("#ff8a3d", 1.4),
      F(-6, -T - R * 0.1, 2, "#2bc48a"),
      F(5, -T + 2, 2, "#3478f6")),
    s.leap && (St(-5, 0, -10, 22, 5.5, "#6b3a1c", 2), St(5, 0, 12, 24, 5.5, "#6b3a1c", 2)),
    s.hat &&
      (e.save(),
      s.hatAskew && (e.translate(0, P), e.rotate(0.5), e.translate(0, -P)),
      m(-q.head * 0.7, P - q.head * 0.85, q.head * 1.4, q.head * 0.35, 3),
      r("#2b3a67", 1.2),
      e.restore()),
    s.shades && (m(-q.head * 0.55, P + q.head * 0.02, q.head * 1.1, q.head * 0.22, 2), r("#1e2430", 1)),
    e.restore());
}
function Fe(l, o, i, s) {
  let q = 2;
  (e.save(), e.translate(l, o), e.scale(i * (s.f || 1), i), s.sway && e.rotate(s.sway));
  let d = Math.sin(s.walk || 0) * 2;
  (e.beginPath(),
    e.ellipse(0, 1, 22, 3.5, 0, 0, 7),
    (e.fillStyle = "rgba(30,36,48,.15)"),
    e.fill(),
    [
      [-12, d],
      [-6, -d],
      [6, d],
      [12, -d],
    ].forEach(([T, R]) => St(T, -10, T + R, 0, 3.4, "#cfd5dd", q)),
    XV(0, -17, 17, 9, 14, 2, 0),
    wV("#ffffff", q),
    // His own jacket. Squatch wears the spare from the wardrobe, so this one stays on.
    m(-14, -24, 28, 14, 4),
    r("#3478f6", 1.2),
    m(-3, -16, 6, 4, 1),
    r("#2456b0", 1));
  let A = s.headDown ? 6 : 0;
  (e.beginPath(),
    e.moveTo(14, -24 + A),
    e.quadraticCurveTo(27, -16, 22, -8),
    e.quadraticCurveTo(29, -4, 25, 0),
    e.quadraticCurveTo(20, 2.5, 17, -1),
    e.quadraticCurveTo(12, -10, 14, -24 + A),
    wV("#f1f3f6", q),
    C([19, -16, 21, -6], "#c9ced8", 0.8),
    XV(17, -29 + A, 7, 7, 10, 1.6, 0),
    wV("#ffffff", q),
    e.beginPath(),
    e.moveTo(13, -34 + A),
    e.quadraticCurveTo(10, -44 + A, 5, -44 + A),
    e.quadraticCurveTo(2, -43 + A, 3, -40 + A),
    e.moveTo(20, -35 + A),
    e.quadraticCurveTo(22, -45 + A, 27, -45 + A),
    e.quadraticCurveTo(30, -44 + A, 29, -41 + A),
    (e.strokeStyle = y),
    (e.lineWidth = 4.6),
    (e.lineCap = "round"),
    e.stroke(),
    (e.strokeStyle = "#c9ad84"),
    (e.lineWidth = 2.6),
    e.stroke(),
    s.eyes === "closed" ? C([17.5, -29 + A, 21, -29 + A], y, 1.2) : F(19.5, -29 + A, 1.4, y),
    F(23.5, -26.5 + A, 1.1, "#f2a7b6"),
    s.mouth === "o" && (e.beginPath(), e.ellipse(22, -24 + A, 1.4, 1.9, 0, 0, 7), (e.fillStyle = y), e.fill()),
    e.beginPath(),
    e.arc(-2, -18, 3.2, 0, 7),
    wV("#ffcf33", 1.2),
    F(-2, -18, 1.2, "#e8a400"),
    e.restore());
}
function drawCh1Alien(ax, ay, kind, sc, face) {
  let f = face < 0 ? -1 : 1,
    bob = Math.sin(n.T * 2 + ax * 0.01) * 1.5;
  (e.save(), e.translate(ax, ay + bob), e.scale(sc * f, sc));
  (e.beginPath(), e.ellipse(0, 2, 16, 4, 0, 0, 7), (e.fillStyle = "rgba(30,36,48,.16)"), e.fill());
  let body = "#7ad0c8",
    skin = "#d8fff6";
  kind === "croc" && ((body = "#3f8f4a"), (skin = "#b6e7a8"));
  kind === "hat" && ((body = "#ff8a3d"), (skin = "#f0bf93"));
  kind === "hair" && ((body = "#3478f6"), (skin = "#f2c1b0"));
  kind === "spots" && ((body = "#ffcf33"), (skin = "#fff3c4"));
  kind === "horns" && ((body = "#c9b6f2"), (skin = "#efe8ff"));
  kind === "blob" && ((body = "#59657d"), (skin = "#d5dbe6"));
  kind === "cape" && ((body = "#1f9d8a"), (skin = "#d8fff6"));
  (m(-6, -20, 7, 20, 2),
    r("#3d4454", 2),
    m(2, -20, 7, 20, 2),
    r("#3d4454", 2),
    m(-16, -54, 32, 36, 10),
    r(body, 3),
    m(-22, -48, 8, 22, 3),
    r(body, 2),
    m(14, -48, 8, 22, 2),
    r(body, 2),
    L(0, -70, 14),
    r(skin, 3),
    F(-5, -72, 1.8, y),
    F(5, -72, 1.8, y),
    C([-3, -64, 0, -62, 3, -64], y, 1.2));
  if (kind === "antenna") (C([-5, -82, -10, -98], y, 2.2), C([5, -82, 10, -98], y, 2.2), F(-10, -100, 3.2, "#ffcf33"), F(10, -100, 3.2, "#ffcf33"));
  else if (kind === "croc")
    (e.beginPath(),
      e.moveTo(8, -76),
      e.lineTo(30, -72),
      e.lineTo(30, -62),
      e.lineTo(8, -66),
      e.closePath(),
      r("#2f7a3a", 2),
      F(24, -70, 1.3, y),
      F(24, -65, 1.3, y),
      C([14, -66, 20, -64, 26, -67], "#1e2430", 1.2));
  else if (kind === "hat") (m(-14, -78, 28, 6, 2), r("#2b3a67", 2), m(-7, -92, 14, 16, 2), r("#2b3a67", 2));
  else if (kind === "hair") (e.beginPath(), e.arc(0, -70, 14, Math.PI, 0), r("#7a4ad0", 3));
  else if (kind === "spots") (F(-6, -48, 3, "#e5533d"), F(6, -40, 2.4, "#e5533d"), F(0, -56, 2, "#e5533d"));
  else if (kind === "horns") (C([-4, -78, -12, -94], y, 3), C([4, -78, 12, -94], y, 3));
  else if (kind === "blob") (F(-6, -70, 2, y), F(0, -70, 2, y), F(6, -70, 2, y), L(0, -40, 8), r("#8a93a3", 2));
  else (m(-18, -46, 8, 18, 3), r("#e5533d", 2));
  e.restore();
}
// One peeking eye from ga() in src/game/10-ch1.js at 4d1faa2 (decision C21, Brian t230).
// White circle, 2px outline, pupil nudged down-right, and the same blink.
// k scales the whole drawing. 1 is the original size on the original 40px front leaf.
function ga(l, o, k) {
  k = k || 1;
  let i = Math.sin(n.T * 2.3) > 0.94 ? 0.25 : 1;
  X(l, o, 6 * k, 6 * k * i);
  r("#ffffff", 2 * k);
  F(l + k, o + k, 2.4 * k, y);
}
// The Nov 8 guests (C12). The sprite files were not in the repo, so these are drawn
// from Brian's description of that set. Not the later eight code-drawn guests.
function drawApprovedGuest(ax, ay, kind, sc, face) {
  const f = face < 0 ? -1 : 1;
  e.save();
  e.translate(ax, ay);
  e.scale((sc || 1) * f, sc || 1);
  if (kind === "teal") drawTeal();
  else if (kind === "camera") drawCameraGuest();
  else if (kind === "backpack") drawBackpack();
  else if (kind === "stilt") drawStilt();
  else if (kind === "octopus") drawOctopusGuest();
  else if (kind === "robot") drawRobotGuest();
  e.restore();
}
function drawTeal() {
  m(-10, -36, 8, 36, 2); r("#1e2430", 2);
  m(2, -36, 8, 36, 2); r("#1e2430", 2);
  m(-16, -72, 32, 40, 6); r("#1aa8a8", 2.5);
  m(-8, -66, 16, 22, 3); r("#ffffff", 2);
  m(-24, -68, 8, 22, 3); r("#8d5524", 2);
  m(16, -68, 8, 22, 3); r("#8d5524", 2);
  L(0, -88, 14); r("#8d5524", 2.5);
  e.beginPath(); e.arc(0, -92, 14, Math.PI, 0); r("#1e2430", 2);
  F(-5, -88, 1.6, y); F(5, -88, 1.6, y);
  C([-4, -80, 0, -78, 4, -80], y, 1.4);
  C([12, -100, 26, -114], y, 2.2);
  F(28, -116, 4.2, y);
}
function drawCameraGuest() {
  m(-10, -30, 8, 30, 2); r("#e0b07a", 2);
  m(2, -30, 8, 30, 2); r("#e0b07a", 2);
  m(-12, -42, 24, 16, 3); r("#2a3142", 2);
  m(-16, -74, 32, 36, 6); r("#3478f6", 2.5);
  F(-6, -60, 4, "#ffcf33"); F(6, -56, 3.4, "#ff8fb8");
  m(-8, -64, 16, 12, 2); r("#1e2430", 2);
  F(0, -58, 3, "#8fd0ff");
  m(-24, -70, 8, 20, 3); r("#f3d2b0", 2);
  m(16, -70, 8, 20, 3); r("#f3d2b0", 2);
  L(0, -90, 14); r("#f3d2b0", 2.5);
  e.beginPath(); e.arc(0, -94, 14, Math.PI, 0); r("#6b3a1c", 2);
  F(-5, -90, 1.6, y); F(5, -90, 1.6, y);
  C([-4, -82, 0, -80, 4, -82], y, 1.3);
}
function drawBackpack() {
  m(-14, -10, 12, 10, 2); r("#8fd0e8", 2);
  m(2, -10, 12, 10, 2); r("#8fd0e8", 2);
  m(-8, -38, 7, 30, 2); r("#3d4c5c", 2);
  m(2, -38, 7, 30, 2); r("#3d4c5c", 2);
  m(12, -68, 16, 30, 4); r("#8b5a3c", 2);
  m(-14, -72, 28, 38, 8); r("#3d4c5c", 2.5);
  L(0, -90, 16); r("#7f93a8", 2.5);
  F(-7, -90, 2.2, y); F(0, -96, 2.2, y); F(7, -90, 2.2, y);
  C([-6, -104, -12, -120], y, 2);
  C([6, -104, 12, -120], y, 2);
  F(-12, -122, 2.6, y); F(12, -122, 2.6, y);
}
function drawStilt() {
  C([-5, -78, -8, 0], "#2a3142", 3);
  C([5, -78, 8, 0], "#2a3142", 3);
  F(-8, -2, 4.2, "#9b6dff"); F(8, -2, 4.2, "#9b6dff");
  m(-14, -108, 28, 32, 3); r("#ffcf33", 2.5);
  C([-14, -100, -36, -70], "#2a3142", 2.4);
  C([14, -100, 36, -70], "#2a3142", 2.4);
  F(-36, -68, 4, "#9b6dff"); F(36, -68, 4, "#9b6dff");
  L(0, -126, 14); r("#b48cff", 2.5);
  F(-5, -126, 1.8, y); F(5, -126, 1.8, y);
  C([-6, -138, -14, -156], y, 2);
  C([6, -138, 14, -156], y, 2);
  F(-14, -158, 3.6, "#b48cff"); F(14, -158, 3.6, "#b48cff");
}
function drawOctopusGuest() {
  [[-18, -8], [-9, -3], [0, 2], [9, 5], [18, 3]].forEach(([x, lean]) => {
    C([x, -42, x + lean, 0], "#ff8fb8", 4);
    F(x + lean * 0.45, -20, 2.4, "#ffffff");
  });
  e.beginPath(); e.ellipse(0, -46, 18, 6, 0, 0, 7); r("#3478f6", 2.2);
  L(0, -74, 22); r("#ff8fb8", 2.5);
  F(-8, -76, 2.1, y); F(8, -76, 2.1, y);
  C([-8, -64, 0, -58, 8, -64], y, 1.6);
  m(-14, -98, 28, 8, 2); r("#ffcf33", 2);
  m(-7, -110, 14, 14, 3); r("#ffcf33", 2);
}
function drawRobotGuest() {
  m(-14, -10, 12, 10, 2); r("#1e2430", 2);
  m(2, -10, 12, 10, 2); r("#1e2430", 2);
  m(-8, -32, 7, 24, 2); r("#c5cad3", 2);
  m(2, -32, 7, 24, 2); r("#c5cad3", 2);
  m(-18, -70, 36, 40, 4); r("#dfe3ea", 2.5);
  m(-11, -60, 22, 16, 2); r("#2bc48a", 2);
  F(-5, -52, 1.7, "#ffcf33"); F(0, -52, 1.7, "#ffcf33"); F(5, -52, 1.7, "#ffcf33");
  F(-24, -52, 5, "#3478f6"); F(24, -52, 5, "#3478f6");
  m(-15, -102, 30, 28, 3); r("#eef1f6", 2.5);
  m(-10, -94, 7, 7, 1); r("#3478f6", 1.4);
  m(3, -94, 7, 7, 1); r("#3478f6", 1.4);
  C([-6, -82, 0, -79, 6, -82], y, 1.4);
  C([0, -102, 0, -118], "#e5533d", 2.6);
  F(0, -120, 3.2, "#e5533d");
}

  window.ART = {
    squatch(ctx, x, yy, scale, opt) {
      use(ctx, opt.t);
      Re(x, yy, scale, { f: opt.f, walk: opt.walk, singing: opt.singing, eyes: opt.eyes });
    },
    mops(ctx, x, yy, scale, opt) {
      use(ctx, opt.t);
      Fe(x, yy, scale, { f: opt.f, walk: opt.walk, sway: opt.sway, mouth: opt.mouth, eyes: opt.eyes, headDown: opt.headDown });
    },
    guest(ctx, x, yy, kind, scale, face, time) {
      use(ctx, time);
      drawApprovedGuest(x, yy, kind, scale, face);
    },
    eyes(ctx, x, yy, time, scale) {
      use(ctx, time);
      ga(x, yy, scale);
    },
    // Original front leaf is a 40px clump. This locked bush's front clumps are about 22px.
    eyeScale: 22 / 40,
    guests: ["teal", "camera", "backpack", "stilt", "octopus", "robot"],
  };
})();
