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
  'Stormtop Cloud Resort, floating above Jupiter.',
  "This is Squatch. He's a Sasquatch.",
  'Morning, Squatch.',
  'Good morning, Stormtop! Big party in the hall tonight!',
  'Party?',
  "Now here's a classic hit from Dog Zylan!",
  'Stay in here.',
  "I'm floating in space!",
  'Weeee-eenn-nnttt!',
  'MOONMUNCH',
  'FUZZUARY',
  'Sponsored by MOON PIES',
  'Sock hunt',
  'family Olympics night',
  'Wash outside windows (remember space suit!)',
  'Blanket fort night',
  "Mops's costumes. And my Guardian Box.",
  'Not sleepy anymore.',
  'DO \u00b7 homework',
  'That evening\u2026',
  'PEEK',
  'ROBOTICS DELEGATION!',
  'Mmf mmf... mm-mmf... mmf!',
  'Robots?',
  'SING ALONG',
  'HIDE · plant',
  'LOCKUP',
  'A guest saw Squatch!',
  'Isfred',
  'Welcome, everybody, to the Stormtop Space Party!',
  "Let's give a big hello to our friends from Bleep-Bloop Robotics!",
  'Soon their helper robots will be here, to help with the heavy work.',
  'And now... put your hands together for the Croc Boys!',
  'COMING SOON!',
  'Everyone out there has someone.',
  'You have me.',
  'Years ago, on Stormtop...',
  'A Wookie tour group came to visit Stormtop.',
  'They shed. A LOT.',
  'The fur clogged the air scrubbers. Everyone gasped for air!',
  'Nobody can live outside. The scrubbers keep us breathing. NO FUR.',
  'Onto the ship.',
  "I've never gotten to dance at a party.",
  'top hat',
  'sunglasses',
  'shirt',
  'boots',
  '...Nice gloves.',
  'Wait a second... fur!',
  "That's our song.",
  'I have to go to work now.',
  'Big party in the hall tonight.',
  'SPACE MATH',
  'Name: Squatch',
  '♪',
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
      close: s.close, restarted: s.restarted, step: s.step, home: s.look,
      sq: { x: s.sq.x, y: s.sq.y },
      mo: { x: s.mo.x, y: s.mo.y, hidden: s.mo.hidden, face: s.mo.face },
      hop: s.hopTrace.map(p => ({ x: p.x, y: p.y })),
      controls: s.controls.map(c => ({ id: c.id, lit: c.lit, x: c.x })),
      closetOpen: !!s.closetOpen,
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
  const homeBeats = ['title', 'resort', 'intro', 'asleep', 'wake', 'partyq', 'mophello', 'wring', 'zylan', 'hopout', 'oursong', 'sing', 'song', 'songwalk', 'work', 'partyagain', 'stay', 'leave', 'alone', 'homework', 'evening', 'peekready', 'dress', 'walkout', 'return', 'miss', 'have', 'tv', 'after'];
  if (homeBeats.includes(s.beat) && s.room !== 'home') problems.push(fails(RULE.room + ' ' + label + ' room', s.beat + ' is in the ' + s.room));
  if (homeBeats.includes(s.beat) && s.mo && !s.mo.hidden && s.mo.x > 860) problems.push(fails(RULE.room + ' ' + label + ' room', 'Mops is outside the bedroom at x ' + s.mo.x));
  if (['peek', 'sneak', 'hidden', 'hop', 'jail', 'announce', 'poster', 'band', 'groove', 'wish', 'sneakback', 'approach', 'dance', 'gloves', 'furryline'].includes(s.beat) && s.room !== 'hall') problems.push(fails(RULE.room + ' ' + label + ' room', 'the sneak is not in the hall'));
  if ((s.beat === 'sneak' || s.beat === 'hidden') && s.cones.length > 3) problems.push(fails(RULE.cone + ' ' + label + ' cones', 'too many cones ' + s.cones.length));
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
  const handled = ['SING ALONG', 'HIDE · plant', 'PEEK', 'desk', 'line', 'card', 'dance', 'wear', 'start', 'pause', 'mute'];
  for (const c of s.controls || []) {
    if (!handled.includes(c.id)) problems.push(fails(RULE.chip + ' ' + label + ' chip', 'nothing handles ' + c.id));
  }
  if (s.chip === 'HIDE · plant' && !(s.beat === 'sneak' && s.close)) problems.push(fails(RULE.chip + ' ' + label + ' chip', 'HIDE before he can hide'));
  if (s.chip === 'SING ALONG' && s.beat !== 'sing') problems.push(fails(RULE.chip + ' ' + label + ' chip', 'SING ALONG at the wrong time'));
  if (s.chip === 'DO \u00b7 homework' && !(s.beat === 'alone' && s.step === 3)) problems.push(fails('R22 ' + label + ' homework', 'homework is offered too early'));
  if (s.bubbles.length && s.chip) problems.push(fails(RULE.chip + ' ' + label + ' chip', 'a chip is up during a line'));
  if (s.mopProp) problems.push(fails(RULE.mop + ' ' + label + ' mop', 'a separate mop was drawn'));
  const speakers = {
    'Morning, Squatch.': 'mops',
    'Good morning, Stormtop! Big party in the hall tonight!': 'speaker',
    'Party?': 'sq',
    "Now here's a classic hit from Dog Zylan!": 'speaker',
    'Stay in here.': 'mops',
    "I'm floating in space!": 'sq',
    'Weeee-eenn-nnttt!': 'mops',
    "Mops's costumes. And my Guardian Box.": 'sq',
    'Not sleepy anymore.': 'sq',
  };
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

async function dragLogical(page, x1, y1, x2, y2) {
  const box = await page.$eval('#game', el => {
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  });
  const pt = (x, y) => ({ x: box.left + (x / 960) * box.width, y: box.top + (y / 640) * box.height });
  const a = pt(x1, y1), b = pt(x2, y2);
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  await page.mouse.move(b.x, b.y, { steps: 12 });
  await page.mouse.up();
  await new Promise(r => setTimeout(r, 60));
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
  await page.goto('http://127.0.0.1:' + page._port + '/?fast=1', { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => window.game && window.game.roomsReady(), { timeout: 8000 });
  await waitFor(page, () => window.game.state.beat === 'title', 4000, 'title');
  let s = await readState(page);
  problems.push(...checkRules(s, label + ' title'));
  if (s.song !== 'off') problems.push(fails(label + ' song', 'music started before the first tap'));
  if (!s.controls.some(c => c.lit)) problems.push(fails(label + ' title', 'nothing is lit'));
  await shot(page, label + '-1-title');

  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'resort' && window.game.state.song === 'joe', 4000, 'resort');
  await shot(page, label + '-1-resort');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' resort'));
  if (!s.words.some(w => w.includes('Stormtop'))) problems.push(fails('R22 ' + label + ' resort', 'missing the Stormtop card'));

  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'intro', 4000, 'intro');
  await shot(page, label + '-2-who-he-is');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' intro'));
  if (!s.words.some(w => w.includes('Sasquatch'))) problems.push(fails(label + ' intro', 'missing the Squatch card'));

  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'asleep', 4000, 'asleep');
  await shot(page, label + '-2-asleep');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' asleep'));
  if (s.sq.x > 250) problems.push(fails('R23 ' + label + ' bed', 'Squatch is not in the bed'));
  await waitFor(page, () => window.game.state.beat === 'wake' && window.game.state.bubbles.some(b => b.who === 'speaker'), 4000, 'speaker');
  await shot(page, label + '-2-speaker');
  s = await readState(page);
  if (!s.bubbles.some(b => b.text.includes('Good morning, Stormtop'))) problems.push(fails('R24 ' + label + ' speaker', 'the morning announcement is missing'));
  await tapLit(page);
  await page.waitForFunction(() => window.game.state.bubbles.some(b => b.text === 'Party?' && b.who === 'sq'), { timeout: 4000 });
  await tapLit(page);
  await page.waitForFunction(() => window.game.state.bubbles.some(b => b.text === 'Morning, Squatch.' && b.who === 'mops'), { timeout: 4000 });
  await shot(page, label + '-2-morning');
  s = await readState(page);
  if (!(s.mo.face < 0 && s.mo.x > 600)) problems.push(fails('R25 ' + label + ' mops', 'Mops is not on the right, facing Squatch'));
  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'wring', 4000, 'wring');
  await shot(page, label + '-2-wring');
  await tapLit(page);
  await page.waitForFunction(() => window.game.state.bubbles.some(b => b.text.includes('Dog Zylan')), { timeout: 4000 });
  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'oursong' && window.game.state.bubbles.some(b => b.text === "That's our song."), 4000, 'our song');
  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'sing' && window.game.state.chip === 'SING ALONG', 4000, 'sing');
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
  await page.waitForFunction(() => window.game.state.bubbles.some(b => b.text === 'I have to go to work now.'), { timeout: 4000 });
  await tapLit(page);
  await page.waitForFunction(() => window.game.state.bubbles.some(b => b.who === 'mops' && b.text === 'Big party in the hall tonight.'), { timeout: 4000 });
  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'stay' && window.game.state.words.includes('Stay in here.'), 4000, 'stay');
  await shot(page, label + '-2-stay');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' stay'));
  if (!s.bubbles.some(b => b.who === 'mops' && b.text === 'Stay in here.')) problems.push(fails('R22 ' + label + ' stay', 'Mops does not say to stay after the song'));
  const facing = await page.evaluate(() => {
    const s = window.game.state;
    return s.mo.face === (s.sq.x < s.mo.x ? -1 : 1);
  });
  if (!facing) problems.push(fails('R22 ' + label + ' stay', 'Mops is not facing Squatch'));

  await tapLit(page);
  let sawLeave = false;
  const leaveStart = Date.now();
  while (Date.now() - leaveStart < 8000) {
    const beat = await page.evaluate(() => window.game.state.beat);
    if (beat === 'leave' && !sawLeave) {
      sawLeave = true;
      await shot(page, label + '-3-goodbye');
    }
    if (beat === 'alone') break;
    await new Promise(r => setTimeout(r, 40));
  }
  await waitFor(page, () => window.game.state.beat === 'alone', 2000, 'alone');
  await shot(page, label + '-4-desk');
  s = await readState(page);
  if (s.controls.some(c => c.id === 'look')) problems.push(fails('R26 ' + label + ' outline', 'an optional look is outlined'));
  if (!s.controls.some(c => c.id === 'desk' && c.lit)) problems.push(fails('R26 ' + label + ' desk', 'the desk is not the outlined step'));
  await clickLogical(page, 150, 250);
  await waitFor(page, () => window.game.state.words.includes('MOONMUNCH'), 4000, 'calendar');
  await shot(page, label + '-4-calendar');
  s = await readState(page);
  if (!s.words.includes('Sponsored by MOON PIES')) problems.push(fails('R27 ' + label + ' calendar', 'the calendar copy is missing'));
  await tapLit(page);
  await waitFor(page, () => window.game.state.look === '', 4000, 'calendar closed');
  await clickLogical(page, 70, 260);
  await waitFor(page, () => window.game.state.closetOpen, 4000, 'closet');
  await shot(page, label + '-4-closet');
  await tapLit(page);
  await waitFor(page, () => window.game.state.look === '' && window.game.state.controls.some(c => c.id === 'desk'), 4000, 'desk again');
  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'homework' && window.game.state.words.includes('SPACE MATH'), 4000, 'homework');
  await shot(page, label + '-4-homework');
  s = await readState(page);
  if (!s.words.includes('Name: Squatch')) problems.push(fails('R28 ' + label + ' homework', 'the name line is missing'));
  if (s.chip === 'DO \u00b7 homework') problems.push(fails('R28 ' + label + ' homework', 'the extra homework chip is still up'));
  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'evening', 4000, 'evening');
  await shot(page, label + '-4-evening');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' evening'));
  if (!s.words.includes('That evening\u2026')) problems.push(fails(label + ' evening', 'missing the evening card'));

  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'peekready' && window.game.state.chip === 'PEEK', 4000, 'peek button');
  s = await readState(page);
  const peek = s.controls.find(c => c.id === 'PEEK');
  if (!peek || peek.x < 700) problems.push(fails('R29 ' + label + ' peek', 'PEEK is not on the door'));
  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'peek' && window.game.state.room === 'hall', 4000, 'peek');
  await shot(page, label + '-5-peek');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' peek'));
  if (!s.bubbles.some(b => b.text === 'Mmf mmf... mm-mmf... mmf!')) problems.push(fails('R22 ' + label + ' peek', 'Isfred is not mumbling'));
  if (!s.words.includes('ROBOTICS DELEGATION!')) problems.push(fails('R22 ' + label + ' peek', 'the banner is missing'));
  await tapLit(page);
  await waitFor(page, () => window.game.state.bubbles.some(b => b.text === 'Robots?'), 4000, 'robots');
  await shot(page, label + '-5-robots');
  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'sneak', 4000, 'sneak');
  const parked = await page.evaluate(() => ({ x: window.game.state.sq.x, y: window.game.state.sq.y }));
  const door = await page.evaluate(() => window.game.DOOR);
  if (Math.hypot(parked.x - door.x, parked.y - door.y) > 8) problems.push(fails('R6 ' + label + ' door', 'he did not start in the doorway'));
  if (parked.x < 430 || parked.x > 525) problems.push(fails('R6 ' + label + ' door', 'the doorway is not the gap in the wall'));
  await new Promise(r => setTimeout(r, 400));
  await shot(page, label + '-5-sneak');
  s = await readState(page);
  if (Math.hypot(s.sq.x - parked.x, s.sq.y - parked.y) > 3) problems.push(fails('R14 ' + label + ' walk', 'he walked without a tap'));
  fs.copyFileSync(path.join(shotDir, label + '-5-sneak.png'), path.join(artDir, label + '-outline.png'));
  s = await readState(page);
  problems.push(...checkRules(s, label + ' sneak'));
  if (s.chip === 'HIDE · plant') problems.push(fails(label + ' sneak', 'HIDE is offered before he is at the plant'));
  if (!s.hint || s.hint.kind !== 'planter') problems.push(fails(label + ' sneak', 'the planter is not outlined'));
  const moved = await page.evaluate(() => window.game.state.walkers.map(w => w.x + w.y));
  await new Promise(r => setTimeout(r, 700));
  const moved2 = await page.evaluate(() => window.game.state.walkers.map(w => w.x + w.y));
  if (moved.every((n, i) => Math.abs(n - moved2[i]) < 2)) problems.push(fails(label + ' mill', 'the strolling guests are standing still'));

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
  if (!s.words.includes('LOCKUP') || !s.words.some(w => w.includes('guest saw'))) problems.push(fails(label + ' jail', 'lockup card is missing the line'));
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
  await clickLogical(page, 470, 560);
  await waitFor(page, () => Math.hypot(window.game.state.sq.x - 470, window.game.state.sq.y - 560) < 30, 5000, 'toward the plant');
  await clickLogical(page, 450, 555);
  await waitFor(page, () => window.game.state.chip === 'HIDE · plant', 6000, 'hide chip');
  await shot(page, label + '-6-hide');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' hide'));
  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'hidden', 4000, 'hidden');
  await shot(page, label + '-6-eyes');
  fs.copyFileSync(path.join(shotDir, label + '-6-eyes.png'), path.join(artDir, label + '-eyes.png'));
  s = await readState(page);
  problems.push(...checkRules(s, label + ' eyes'));
  const leaf = { x: 416, y: 488, w: 56, h: 28 };
  if (s.eyes.length !== 2) problems.push(fails(RULE.eyes + ' ' + label + ' eyes', 'expected two eyes'));
  const gap = Math.hypot(s.eyes[0].x - s.eyes[1].x, s.eyes[0].y - s.eyes[1].y);
  if (Math.abs(gap - 18) > 2) problems.push(fails(RULE.eyes + ' ' + label + ' eyes', 'the pair is ' + gap + ' apart'));
  for (const e of s.eyes) {
    if (e.x < leaf.x || e.x > leaf.x + leaf.w || e.y < leaf.y || e.y > leaf.y + leaf.h) problems.push(fails(RULE.eyes + ' ' + label + ' eyes', 'eyes are not on the front seam'));
    if (!(e.r > 5.5 && e.r < 6.5)) problems.push(fails(RULE.eyes + ' ' + label + ' eyes', 'eye radius ' + e.r));
    if (!e.pupil || e.pupil.dx <= 0 || e.pupil.dy <= 0) problems.push(fails(RULE.eyes + ' ' + label + ' eyes', 'pupil is not down-right'));
  }

  await tapLit(page);
  for (const text of [
    'Welcome, everybody, to the Stormtop Space Party!',
    "Let's give a big hello to our friends from Bleep-Bloop Robotics!",
    'Soon their helper robots will be here, to help with the heavy work.',
  ]) {
    await page.waitForFunction(t => window.game.state.bubbles.some(b => b.text === t), { timeout: 4000 }, text);
    s = await readState(page);
    problems.push(...checkRules(s, label + ' announce'));
    if (text.startsWith('Welcome')) await shot(page, label + '-8-announce');
    await tapLit(page);
  }
  await waitFor(page, () => window.game.state.beat === 'poster' && window.game.state.words.includes('COMING SOON!'), 4000, 'poster');
  await shot(page, label + '-8-poster');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' poster'));
  await tapLit(page);
  await page.waitForFunction(() => window.game.state.bubbles.some(b => b.text.includes('Croc Boys')), { timeout: 4000 });
  await shot(page, label + '-8-croc');
  s = await readState(page);
  if (!s.dim && !(await page.evaluate(() => window.game.state.dim))) problems.push(fails(label + ' croc', 'the lights did not dim'));
  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'groove' && window.game.state.hidden, 4000, 'groove');
  await shot(page, label + '-8-dance');
  await page.waitForFunction(() => window.game.state.bubbles.some(b => b.text === "I've never gotten to dance at a party." && b.who === 'thought'), { timeout: 8000 });
  await shot(page, label + '-10-wish');
  s = await readState(page);
  const thought = s.bubbles.find(b => b.who === 'thought');
  if (!thought || thought.head.y < 450) problems.push(fails(label + ' thought', 'the thought is not coming from the plant'));
  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'sneakback' && window.game.state.room === 'hall', 4000, 'sneak home');
  await clickLogical(page, 478, 596);
  await waitFor(page, () => window.game.state.beat === 'dress' && window.game.state.room === 'home' && window.game.state.closetOpen, 8000, 'dress');
  await shot(page, label + '-10-dress');
  const spots = await page.evaluate(() => window.game.PIECES.map((piece, i) => {
    const home = window.game.pieceHome(i);
    const z = window.game.dressZones()[piece.zone];
    return { x: home.x, y: home.y, tx: z.x, ty: z.y };
  }));
  for (const spot of spots) await dragLogical(page, spot.x, spot.y, spot.tx, spot.ty);
  await waitFor(page, () => window.game.state.beat === 'dance' && window.game.state.room === 'hall' && !window.game.state.hidden, 10000, 'dance circle');
  const worn = await page.evaluate(() => window.game.state.worn.slice());
  if (worn.length < 4) problems.push(fails(label + ' worn', 'the clothes are not on him'));
  await page.waitForFunction(() => window.game.state.beat === 'gloves', { timeout: 8000 });
  await page.waitForFunction(() => window.game.state.bubbles.some(b => b.text === '...Nice gloves.'), { timeout: 4000 });
  await tapLit(page);
  await page.waitForFunction(() => window.game.state.bubbles.some(b => b.text.includes('fur')), { timeout: 4000 });
  await shot(page, label + '-10-fur');
  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'miss', 8000, 'homecoming');
  await shot(page, label + '-9-home');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' homecoming'));
  if (!s.bubbles.some(b => b.text === 'Everyone out there has someone.')) problems.push(fails(label + ' home', 'Squatch did not say the homecoming line'));
  await tapLit(page);
  await page.waitForFunction(() => window.game.state.bubbles.some(b => b.text === 'You have me.'), { timeout: 4000 });
  await shot(page, label + '-9-mops');
  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'tv' && window.game.state.words.some(w => w.includes('Stormtop')), 4000, 'tv');
  await tapLit(page);
  await waitFor(page, () => window.game.state.words.some(w => w.includes('Wookie')), 4000, 'wookie card');
  await shot(page, label + '-9-tv');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' tv'));
  if (s.room !== 'home' && s.beat !== 'tv') problems.push(fails(label + ' tv', 'the show is not full screen at home'));
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
