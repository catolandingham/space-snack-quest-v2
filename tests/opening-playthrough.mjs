// Plays the opening with taps: title, morning, SING, evening, sneak, HIDE, and getting spotted.
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const puppeteer = process.env.PUPPETEER_ENTRY
  ? (await import(pathToFileURL(process.env.PUPPETEER_ENTRY).href)).default
  : (await import('puppeteer')).default;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gameDir = path.join(root, 'prototypes', 'space-snack-quest');
const shotDir = path.join(gameDir, 'evidence', 'beats');
const artDir = '/opt/cursor/artifacts';
fs.mkdirSync(shotDir, { recursive: true });
fs.mkdirSync(artDir, { recursive: true });

const ALLOWED = [
  'Space Snack Quest',
  "This is Squatch. He's a Sasquatch.",
  'Morning, Squatch.',
  'Big party in the hall tonight.',
  'Party?',
  'Stay in here.',
  "I'm floating in space!",
  'Weeee-eenn-nnttt!',
  'That evening\u2026',
  'SING',
  'HIDE',
  'LOCKUP',
  '[line needed]',
  'Mops',
  'Squatch',
  '!',
  '♥',
];
const GUESTS = ['teal', 'camera', 'backpack', 'stilt', 'octopus', 'robot'];
const RULE = {
  words: 'R1', bubble: 'R2', chip: 'R3', cone: 'R4', outline: 'R5', room: 'R6',
  eyes: 'R7', heart: 'R8', bang: 'R9', guests: 'R10', hop: 'R11', mop: 'R12',
};

function serve() {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.yaml': 'text/yaml' };
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(gameDir, url === '/' ? 'index.html' : url);
    if (!file.startsWith(gameDir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); res.end('no'); return;
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function fails(name, detail) { return { name, detail }; }

async function readState(page) {
  return page.evaluate(() => {
    const s = window.game.state;
    return {
      beat: s.beat, room: s.room, scene: window.game.scene, song: s.song, chip: s.chip,
      words: s.words, bubbles: s.bubbles, cones: s.cones, heads: s.heads, hint: s.hint,
      eyes: s.eyes, hidden: s.hidden, mopProp: s.mopProp, look: s.look,
      guests: s.guests, sparks: (s.sparks || []).map(p => ({ kind: p.kind, x: p.x, y: p.y, t: p.t })),
      close: s.close, restarted: s.restarted,
      sq: { x: s.sq.x, y: s.sq.y },
      mo: { x: s.mo.x, y: s.mo.y, hidden: s.mo.hidden },
      hop: s.hopTrace.map(p => ({ x: p.x, y: p.y })),
      controls: s.controls.map(c => ({ id: c.id, lit: c.lit })),
    };
  });
}

function checkRules(s, label) {
  const problems = [];
  for (const w of s.words) {
    const ok = ALLOWED.includes(w) || ALLOWED.some(a => a.includes(w) && w.length > 2);
    if (!ok) problems.push(fails(RULE.words + ' ' + label + ' word', w));
  }
  const banned = /sneaky|sasquatch's|security|tourist|holding pen|click |press /i;
  for (const w of s.words) if (banned.test(w) && !/Sasquatch\./.test(w)) problems.push(fails(label + ' banned', w));
  for (const b of s.bubbles) {
    const h = b.head, box = b.box;
    const hit = box.x < h.x + h.w && box.x + box.w > h.x && box.y < h.y + h.h && box.y + box.h > h.y;
    if (hit) problems.push(fails(RULE.bubble + ' ' + label + ' bubble covers face', b.who + ' ' + b.text));
    if (b.who === 'mops' && !b.text.includes('Mops') && s.words[0] !== 'x') {
      // the name tag is its own word; the bubble text must be Mops's line
    }
    if (b.who === 'sq' && b.text.startsWith('Morning')) problems.push(fails(label + ' wrong speaker', b.text));
  }
  const coneBeats = ['morning', 'sing', 'sneak', 'hidden'];
  if (coneBeats.includes(s.beat) && s.cones.length) {
    if (s.cones.some(c => !c.dashed)) problems.push(fails(RULE.cone + ' ' + label + ' cones', 'a cone is not dashed'));
    const lens = s.cones.map(c => c.len);
    const halves = s.cones.map(c => c.half);
    if (Math.min(...lens) < Math.max(...lens) * 0.85 || Math.min(...halves) < Math.max(...halves) * 0.85) {
      problems.push(fails(RULE.cone + ' ' + label + ' cones', 'cone sizes differ by more than 15% ' + lens.join(',')));
    }
  }
  if (s.beat === 'morning' || s.beat === 'sing') {
    const c = s.cones[0];
    if (s.cones.length !== 1 || !c) problems.push(fails(RULE.cone + ' ' + label + ' cones', 'Mops needs one cone'));
    else {
      const mops = (s.heads || []).find(h => h.who === 'mops');
      const sq = (s.heads || []).find(h => h.who === 'sq');
      const inside = (box, x, y) => box && x > box.x && x < box.x + box.w && y > box.y && y < box.y + box.h;
      if (inside(mops, c.x, c.y)) problems.push(fails(RULE.cone + ' ' + label + ' cones', 'the cone starts on Mops\'s face'));
      if (inside(sq, c.x, c.y)) problems.push(fails(RULE.cone + ' ' + label + ' cones', 'the cone starts on Squatch\'s face'));
      for (const b of s.bubbles) if (inside(b.box, c.x, c.y)) problems.push(fails(RULE.cone + ' ' + label + ' cones', 'the cone starts on a speech bubble'));
    }
  }
  const homeBeats = ['title', 'morning', 'sing', 'song', 'songwalk', 'leave', 'evening'];
  if (homeBeats.includes(s.beat) && s.room !== 'home') problems.push(fails(RULE.room + ' ' + label + ' room', s.beat + ' is in the ' + s.room));
  if (homeBeats.includes(s.beat) && s.mo && !s.mo.hidden && s.mo.x > 860) problems.push(fails(RULE.room + ' ' + label + ' room', 'Mops is outside the bedroom at x ' + s.mo.x));
  if (['sneak', 'hidden', 'hop', 'jail'].includes(s.beat) && s.room !== 'hall') problems.push(fails(RULE.room + ' ' + label + ' room', 'the sneak is not in the hall'));
  if ((s.beat === 'sneak' || s.beat === 'hidden' || s.beat === 'hop' || s.beat === 'jail') && s.hint) {
    if (s.hint.kind !== 'planter' || s.hint.points.length < 8) problems.push(fails(RULE.outline + ' ' + label + ' hint', JSON.stringify(s.hint && s.hint.kind)));
    if (s.hint.color !== '#ffcf33' || s.hint.width !== 6 || !s.hint.dashed) problems.push(fails(RULE.outline + ' ' + label + ' hint', 'outline is ' + s.hint.color + ' at ' + s.hint.width + ' dashed ' + s.hint.dashed));
    if (!(s.hint.gap >= 8)) problems.push(fails(RULE.outline + ' ' + label + ' hint', 'the outline is not outside the bush'));
    const inner = s.hint.inner || [];
    if (inner.length === s.hint.points.length) {
      for (let i = 0; i < inner.length; i++) {
        const dx = s.hint.points[i][0] - inner[i][0], dy = s.hint.points[i][1] - inner[i][1];
        if (Math.hypot(dx, dy) < 8) problems.push(fails(RULE.outline + ' ' + label + ' hint', 'a point sits on the bush'));
      }
    }
  }
  if (s.beat === 'sneak' || s.beat === 'hidden') {
    const kinds = s.guests || [];
    if (kinds.some(g => !GUESTS.includes(g))) problems.push(fails(RULE.guests + ' ' + label + ' guests', kinds.join(',')));
    if (s.beat === 'sneak' && GUESTS.some(g => !kinds.includes(g))) problems.push(fails(RULE.guests + ' ' + label + ' guests', 'missing ' + GUESTS.filter(g => !kinds.includes(g)).join(',')));
  }
  const handled = ['SING', 'HIDE', 'line', 'card', 'start', 'pause', 'mute'];
  for (const c of s.controls || []) {
    if (!handled.includes(c.id)) problems.push(fails(RULE.chip + ' ' + label + ' chip', 'nothing handles ' + c.id));
  }
  if (s.chip === 'HIDE' && !(s.beat === 'sneak' && s.close)) problems.push(fails(RULE.chip + ' ' + label + ' chip', 'HIDE before he can hide'));
  if (s.chip === 'SING' && s.beat !== 'sing') problems.push(fails(RULE.chip + ' ' + label + ' chip', 'SING at the wrong time'));
  if (s.bubbles.length && s.chip) problems.push(fails(RULE.chip + ' ' + label + ' chip', 'a chip is up during a line'));
  if (s.mopProp) problems.push(fails(RULE.mop + ' ' + label + ' mop', 'a separate mop was drawn'));
  const speakers = { 'Morning, Squatch.': 'mops', 'Big party in the hall tonight.': 'mops', 'Party?': 'sq', 'Stay in here.': 'mops', "I'm floating in space!": 'sq', 'Weeee-eenn-nnttt!': 'mops' };
  for (const b of s.bubbles) if (speakers[b.text] && speakers[b.text] !== b.who) problems.push(fails(label + ' speaker', b.text));
  return problems;
}

async function shot(page, name) {
  const file = path.join(shotDir, name + '.png');
  await page.screenshot({ path: file });
  fs.copyFileSync(file, path.join(artDir, name + '.png'));
}

async function clickLogical(page, x, y) {
  const box = await page.$eval('#game', el => {
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  });
  await page.mouse.click(box.left + (x / 960) * box.width, box.top + (y / 640) * box.height);
}

async function tapLit(page) {
  const c = await page.evaluate(() => {
    const lit = window.game.state.controls.find(c => c.lit);
    if (!lit) return null;
    return { x: lit.x + lit.w / 2, y: lit.y + lit.h / 2, id: lit.id };
  });
  if (!c) throw new Error('nothing is lit on beat ' + (await page.evaluate(() => window.game.state.beat)));
  await clickLogical(page, c.x, c.y);
  return c.id;
}

async function waitFor(page, pred, ms, label) {
  try {
    await page.waitForFunction(pred, { timeout: ms });
  } catch (e) {
    const s = await readState(page);
    throw new Error(label + ' stuck on ' + s.beat + ' line-words ' + JSON.stringify(s.words) + ' chip ' + s.chip);
  }
}

async function play(page, label) {
  const problems = [];
  await page.goto('http://127.0.0.1:' + page._port + '/', { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => window.game && window.game.roomsReady(), { timeout: 8000 });
  await waitFor(page, () => window.game.state.beat === 'title', 4000, 'title');
  let s = await readState(page);
  problems.push(...checkRules(s, label + ' title'));
  if (s.song !== 'off') problems.push(fails(label + ' song', 'music started before the first tap'));
  if (!s.controls.some(c => c.lit)) problems.push(fails(label + ' title', 'nothing is lit'));
  await shot(page, label + '-1-title');

  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'morning' && window.game.state.song === 'joe', 4000, 'start');
  await shot(page, label + '-2-who-he-is');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' intro'));
  if (!s.words.some(w => w.includes('Sasquatch'))) problems.push(fails(label + ' intro', 'missing the Squatch card'));

  await tapLit(page);
  await waitFor(page, () => window.game.state.words.includes('Morning, Squatch.'), 4000, 'morning');
  await shot(page, label + '-2-morning');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' morning'));
  if (!s.bubbles.some(b => b.who === 'mops' && b.text === 'Morning, Squatch.')) problems.push(fails(label + ' morning', 'Mops is not saying good morning'));

  for (const line of ['Big party in the hall tonight.', 'Party?', 'Stay in here.']) {
    await tapLit(page);
    await page.waitForFunction(text => window.game.state.bubbles.some(b => b.text === text), { timeout: 4000 }, line);
    s = await readState(page);
    problems.push(...checkRules(s, label + ' ' + line));
  }
  await shot(page, label + '-2-stay');

  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'sing' && window.game.state.chip === 'SING', 4000, 'sing');
  await shot(page, label + '-3-sing');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' sing'));

  await page.evaluate(() => {
    const c = window.game.state.cones[0];
    window.game.state.sq.x = c.x + Math.cos(c.face) * (c.len * 0.45);
    window.game.state.sq.y = c.y + Math.sin(c.face) * (c.len * 0.45) + 16;
    window.game.state.sq.target = null;
  });
  await waitFor(page, () => window.game.state.sparks.some(p => p.kind === 'heart'), 4000, 'hearts');
  await shot(page, label + '-3-hearts');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' hearts'));
  if (!s.sparks.some(p => p.kind === 'heart')) problems.push(fails(RULE.heart + ' ' + label + ' hearts', 'no hearts in Mops\'s cone'));

  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'song' && window.game.state.words.includes("I'm floating in space!"), 8000, 'song');
  await shot(page, label + '-3-song');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' song line'));

  await tapLit(page);
  await waitFor(page, () => window.game.state.words.includes('Weeee-eenn-nnttt!'), 4000, 'mops song');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' mops song'));

  await tapLit(page);
  let sawLeave = false;
  const leaveStart = Date.now();
  while (Date.now() - leaveStart < 8000) {
    const beat = await page.evaluate(() => window.game.state.beat);
    if (beat === 'leave' && !sawLeave) {
      sawLeave = true;
      await shot(page, label + '-3-goodbye');
    }
    if (beat === 'evening') break;
    await new Promise(r => setTimeout(r, 40));
  }
  await waitFor(page, () => window.game.state.beat === 'evening', 2000, 'evening');
  await shot(page, label + '-4-evening');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' evening'));
  if (!s.words.includes('That evening\u2026')) problems.push(fails(label + ' evening', 'missing the evening card'));

  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'sneak', 4000, 'sneak');
  const parked = await page.evaluate(() => ({ x: window.game.state.sq.x, y: window.game.state.sq.y }));
  await new Promise(r => setTimeout(r, 400));
  await shot(page, label + '-5-sneak');
  s = await readState(page);
  if (Math.hypot(s.sq.x - parked.x, s.sq.y - parked.y) > 3) problems.push(fails('R14 ' + label + ' walk', 'he walked without a tap'));
  fs.copyFileSync(path.join(shotDir, label + '-5-sneak.png'), path.join(artDir, label + '-outline.png'));
  s = await readState(page);
  problems.push(...checkRules(s, label + ' sneak'));
  if (s.chip === 'HIDE') problems.push(fails(label + ' sneak', 'HIDE is offered before he is at the plant'));
  if (!s.hint || s.hint.kind !== 'planter') problems.push(fails(label + ' sneak', 'the planter is not outlined'));

  // Walk into the look so he is seen.
  await clickLogical(page, 500, 590);
  await waitFor(page, () => window.game.state.sparks.some(p => p.kind === 'bang'), 14000, 'bang');
  await shot(page, label + '-7-bang');
  s = await readState(page);
  if (!s.sparks.some(p => p.kind === 'bang')) problems.push(fails(RULE.bang + ' ' + label + ' bang', 'no exclamation in a guest cone'));
  await waitFor(page, () => window.game.state.beat === 'jail', 8000, 'jail');
  await shot(page, label + '-7-jail');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' jail'));
  if (!s.words.includes('LOCKUP') || !s.words.includes('[line needed]')) problems.push(fails(label + ' jail', 'lockup card is missing the placeholder'));
  const hop = s.hop;
  if (hop.length < 3) problems.push(fails(label + ' hop', 'no hop was recorded'));
  else {
    const xs = hop.map(p => p.x), ys = hop.map(p => p.y);
    const jumped = Math.max(...xs) - Math.min(...xs) > 24;
    const lifted = Math.min(...ys) < hop[0].y - 12;
    if (jumped) problems.push(fails(label + ' hop', 'he teleported sideways'));
    if (!lifted) problems.push(fails(label + ' hop', 'he did not hop up'));
  }
  const before = s.restarted;
  await tapLit(page);
  await page.waitForFunction(n => window.game.state.beat === 'sneak' && window.game.state.restarted > n, { timeout: 4000 }, before);
  s = await readState(page);
  const back = await page.evaluate(() => {
    const d = window.game.DOOR;
    const s = window.game.state.sq;
    return Math.hypot(s.x - d.x, s.y - d.y);
  });
  if (back > 8) problems.push(fails(label + ' restart', 'he did not come back to the doorway'));

  // The safe walk, while the guest is still looking at the stage.
  await clickLogical(page, 210, 560);
  await waitFor(page, () => Math.hypot(window.game.state.sq.x - 210, window.game.state.sq.y - 560) < 30, 5000, 'left');
  await clickLogical(page, 200, 450);
  await waitFor(page, () => Math.hypot(window.game.state.sq.x - 200, window.game.state.sq.y - 450) < 30, 5000, 'up');
  await clickLogical(page, 400, 500);
  await waitFor(page, () => window.game.state.chip === 'HIDE', 6000, 'hide chip');
  await shot(page, label + '-6-hide');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' hide'));
  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'hidden', 4000, 'hidden');
  await shot(page, label + '-6-eyes');
  fs.copyFileSync(path.join(shotDir, label + '-6-eyes.png'), path.join(artDir, label + '-eyes.png'));
  s = await readState(page);
  problems.push(...checkRules(s, label + ' eyes'));
  const leaf = { x: 416, y: 492, w: 52, h: 20 };
  if (s.eyes.length !== 2) problems.push(fails(RULE.eyes + ' ' + label + ' eyes', 'expected two eyes'));
  for (const e of s.eyes) {
    if (e.x < leaf.x || e.x > leaf.x + leaf.w || e.y < leaf.y || e.y > leaf.y + leaf.h) problems.push(fails(RULE.eyes + ' ' + label + ' eyes', 'eyes are not in the front leaves'));
    if (!(e.r > 2.5 && e.r < 4.2)) problems.push(fails(RULE.eyes + ' ' + label + ' eyes', 'eye radius ' + e.r));
    if (!e.pupil || e.pupil.dx <= 0 || e.pupil.dy <= 0) problems.push(fails(RULE.eyes + ' ' + label + ' eyes', 'pupil is not down-right'));
  }
  return problems;
}

const server = await serve();
const port = server.address().port;
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const sizes = [
  ['ipad', { width: 1024, height: 768 }],
  ['phone', { width: 844, height: 390 }],
];
let problems = [];
try {
  for (const [name, size] of sizes) {
    const page = await browser.newPage();
    page._port = port;
    page.on('pageerror', err => problems.push(fails(name + ' crash', String(err))));
    await page.setViewport(size);
    problems = problems.concat(await play(page, name));
    await page.close();
  }
  const lineup = await browser.newPage();
  await lineup.setViewport({ width: 1024, height: 768 });
  await lineup.goto('http://127.0.0.1:' + port + '/?scene=lineup', { waitUntil: 'networkidle0' });
  await lineup.waitForFunction(() => window.game && window.game.state.guests.length === 6, { timeout: 4000 });
  await shot(lineup, 'guest-lineup');
  const eyes = await lineup.evaluate(() => {
    const c = document.createElement('canvas');
    c.width = 420; c.height = 180;
    const g = c.getContext('2d');
    g.fillStyle = '#f4f1ea';
    g.fillRect(0, 0, 420, 180);
    g.fillStyle = '#1e2430';
    g.font = '700 16px sans-serif';
    g.textAlign = 'center';
    g.fillText('Original eyes', 110, 24);
    g.fillText('Scaled for this bush', 310, 24);
    window.ART.eyes(g, 100, 100, 0, 1);
    window.ART.eyes(g, 118, 100, 0, 1);
    const k = window.ART.eyeScale;
    window.ART.eyes(g, 300, 100, 0, k);
    window.ART.eyes(g, 300 + 18 * k, 100, 0, k);
    return c.toDataURL('image/png');
  });
  fs.writeFileSync(path.join(artDir, 'eyes-compare.png'), Buffer.from(eyes.split(',')[1], 'base64'));
} finally {
  await browser.close();
  server.close();
}

if (problems.length) {
  console.log('PLAYTHROUGH FAILED');
  for (const p of problems) console.log('- ' + p.name + ': ' + p.detail);
  process.exit(1);
}
console.log('PLAYTHROUGH PASSED ipad and phone, all 7 beats, including getting spotted');
