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
];

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
      beat: s.beat, scene: window.game.scene, song: s.song, chip: s.chip,
      words: s.words, bubbles: s.bubbles, cones: s.cones, hint: s.hint,
      eyes: s.eyes, hidden: s.hidden, mopProp: s.mopProp, look: s.look,
      close: s.close, restarted: s.restarted,
      sq: { x: s.sq.x, y: s.sq.y },
      hop: s.hopTrace.map(p => ({ x: p.x, y: p.y })),
      controls: s.controls.map(c => ({ id: c.id, lit: c.lit })),
    };
  });
}

function checkRules(s, label) {
  const problems = [];
  for (const w of s.words) {
    const ok = ALLOWED.includes(w) || ALLOWED.some(a => a.includes(w) && w.length > 2);
    if (!ok) problems.push(fails(label + ' word', w));
  }
  const banned = /sneaky|sasquatch's|security|tourist|holding pen|click |press /i;
  for (const w of s.words) if (banned.test(w) && !/Sasquatch\./.test(w)) problems.push(fails(label + ' banned', w));
  for (const b of s.bubbles) {
    const h = b.head, box = b.box;
    const hit = box.x < h.x + h.w && box.x + box.w > h.x && box.y < h.y + h.h && box.y + box.h > h.y;
    if (hit) problems.push(fails(label + ' bubble covers face', b.who + ' ' + b.text));
    if (b.who === 'mops' && !b.text.includes('Mops') && s.words[0] !== 'x') {
      // the name tag is its own word; the bubble text must be Mops's line
    }
    if (b.who === 'sq' && b.text.startsWith('Morning')) problems.push(fails(label + ' wrong speaker', b.text));
  }
  if (s.beat === 'morning' || s.beat === 'sneak' || s.beat === 'sing' || s.beat === 'hidden') {
    if (!s.cones.length) problems.push(fails(label + ' cones', 'nobody has a cone'));
    if (s.cones.some(c => !c.dashed)) problems.push(fails(label + ' cones', 'a cone is not dashed'));
  }
  if ((s.beat === 'sneak' || s.beat === 'hidden' || s.beat === 'hop' || s.beat === 'jail') && s.hint) {
    if (s.hint.kind !== 'planter' || s.hint.points.length < 8) problems.push(fails(label + ' hint', JSON.stringify(s.hint && s.hint.kind)));
  }
  if (s.chip === 'HIDE' && !(s.beat === 'sneak' && s.close)) problems.push(fails(label + ' chip', 'HIDE before he can hide'));
  if (s.chip === 'SING' && s.beat !== 'sing') problems.push(fails(label + ' chip', 'SING at the wrong time'));
  if (s.bubbles.length && s.chip) problems.push(fails(label + ' chip', 'a chip is up during a line'));
  if (s.mopProp) problems.push(fails(label + ' mop', 'a separate mop was drawn'));
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
  await waitFor(page, () => window.game.state.beat === 'evening', 8000, 'evening');
  await shot(page, label + '-4-evening');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' evening'));
  if (!s.words.includes('That evening\u2026')) problems.push(fails(label + ' evening', 'missing the evening card'));

  await tapLit(page);
  await waitFor(page, () => window.game.state.beat === 'sneak', 4000, 'sneak');
  await new Promise(r => setTimeout(r, 300));
  await shot(page, label + '-5-sneak');
  s = await readState(page);
  problems.push(...checkRules(s, label + ' sneak'));
  if (s.chip === 'HIDE') problems.push(fails(label + ' sneak', 'HIDE is offered before he is at the plant'));
  if (!s.hint || s.hint.kind !== 'planter') problems.push(fails(label + ' sneak', 'the planter is not outlined'));

  // Walk into the look so he is seen.
  await clickLogical(page, 500, 590);
  await waitFor(page, () => window.game.state.beat === 'jail', 14000, 'jail');
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
  s = await readState(page);
  problems.push(...checkRules(s, label + ' eyes'));
  const leaf = { x: 424, y: 498, w: 48, h: 16 };
  if (!s.eyes.length) problems.push(fails(label + ' eyes', 'no eyes in the plant'));
  for (const e of s.eyes) {
    if (e.x < leaf.x || e.x > leaf.x + leaf.w || e.y < leaf.y || e.y > leaf.y + leaf.h) problems.push(fails(label + ' eyes', 'eyes are not low in the front leaves'));
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
