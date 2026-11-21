// Fails if the game draws or loads something docs/RULEBOOK.md does not list.
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

function pngSizeAndRows(file) {
  const buf = fs.readFileSync(file);
  if (buf.toString('ascii', 1, 4) !== 'PNG') throw new Error(file + ' is not a png');
  let offset = 8;
  let width = 0, height = 0, color = 0, depth = 0;
  const idats = [];
  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    const data = buf.subarray(offset + 8, offset + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      depth = data[8];
      color = data[9];
    } else if (type === 'IDAT') idats.push(data);
    else if (type === 'IEND') break;
    offset += 12 + len;
  }
  if (depth !== 8 || color !== 6) throw new Error(file + ' is not 8-bit RGBA');
  const raw = zlib.inflateSync(Buffer.concat(idats));
  const stride = width * 4;
  const rows = [];
  let i = 0;
  const paeth = (a, b, c) => {
    const p = a + b - c;
    const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < height; y++) {
    const filter = raw[i++];
    const row = Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const v = raw[i++];
      const left = x >= 4 ? row[x - 4] : 0;
      const up = y > 0 ? rows[y - 1][x] : 0;
      const ul = y > 0 && x >= 4 ? rows[y - 1][x - 4] : 0;
      if (filter === 0) row[x] = v;
      else if (filter === 1) row[x] = (v + left) & 255;
      else if (filter === 2) row[x] = (v + up) & 255;
      else if (filter === 3) row[x] = (v + ((left + up) >> 1)) & 255;
      else if (filter === 4) row[x] = (v + paeth(left, up, ul)) & 255;
      else throw new Error(file + ' has an unknown png filter');
    }
    rows.push(row);
  }
  return { width, height, rows };
}

function cornerAlphas(file) {
  const { width, height, rows } = pngSizeAndRows(file);
  const alpha = (x, y) => rows[y][x * 4 + 3];
  return [alpha(0, 0), alpha(width - 1, 0), alpha(0, height - 1), alpha(width - 1, height - 1)];
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const book = fs.readFileSync(path.join(root, 'docs', 'RULEBOOK.md'), 'utf8');
const html = fs.readFileSync(path.join(root, 'prototypes', 'space-snack-quest', 'index.html'), 'utf8');
const problems = [];
const fail = (rule, detail) => problems.push(rule + ': ' + detail);

if (!book.startsWith('# Space Snack Quest — rulebook')) fail('R20', 'the rulebook header is missing');
if (!book.includes('If it is not in this file, it is not decided.')) fail('R20', 'the header rule is missing');
if (!book.includes('Every correction from Brian replaces the old line')) fail('R20', 'the correction rule is missing');

const names = [...html.matchAll(/loadRoom\([^,]+,\s*'([^']+\.png)'\)/g)].map(m => m[1]);
if (!/assets\/approved\//.test(html)) fail('R13', 'pictures are not loaded from assets/approved');
if (!names.length) fail('R13', 'the game loads no pictures');
for (const name of names) {
  const file = 'assets/approved/' + name;
  if (!book.includes(file)) fail('R20', 'picture is not in the rulebook: ' + file);
  const full = path.join(root, 'prototypes', 'space-snack-quest', file);
  if (!fs.existsSync(full)) fail('R13', 'missing file ' + file);
}
const approvedDir = path.join(root, 'prototypes', 'space-snack-quest', 'assets', 'approved');
function pngs(dir) {
  const found = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) found.push(...pngs(full));
    else if (name.endsWith('.png')) found.push(name);
  }
  return found;
}
for (const name of pngs(approvedDir)) {
  if (!book.includes(name)) fail('R20', 'approved folder has an unlisted picture: ' + name);
}
if (!book.includes('nov8-six-approved-guests.png')) fail('R20', 'the rulebook does not name the guest sheet');
if (!html.includes("'assets/approved/guests/' + kind + '.png'")) fail('R10', 'the game does not load the guest cuts');
if (html.includes('nov8-six-approved-guests.png')) fail('R10', 'the game still paints the sheet, cream background included');
if (/assets\/rooms\//.test(html)) fail('R13', 'the game still points at assets/rooms');

const guests = ['teal', 'camera', 'backpack', 'stilt', 'octopus', 'robot'];
for (const kind of guests) {
  const imPath = path.join(root, 'prototypes', 'space-snack-quest', 'assets', 'approved', 'guests', kind + '.png');
  const alpha = cornerAlphas(imPath);
  if (alpha.some(n => n !== 0)) fail('R10', kind + ' sprite corners are not transparent (' + alpha.join(',') + ')');
}
for (const kind of guests) {
  if (!book.includes(kind)) fail('R10', 'rulebook is missing guest ' + kind);
  if (!html.includes("'" + kind + "'")) fail('R10', 'the game does not place ' + kind);
}
for (const banned of ['antenna', 'croc', 'spots', 'jelly', 'furry']) {
  if (html.includes("'" + banned + "'")) fail('R10', 'the game still uses ' + banned);
}

const lines = [
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
  'That evening',
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
  'COMING SOON!',
  'Croc Boys',
  'Everyone out there has someone.',
  'You have me.',
  'Fur in the scrubber.',
  'Onto the ship.',
  'You came to me in a Moon Pie crate.',
  "You've loved Moon Pies ever since.",
  'The Guardians came!',
  'Rule #1: Brave Sasquatches stay hidden.',
  "Moon Pie day. It's today.",
  'He forgot his lunch!',
  "I'll take Mops his lunch.",
  'Squatch! You should be hiding.',
  "My lunch! You're the best.",
  'hallway-room-empty-v6.png',
  'MY GARDIANS',
  'nick1-wookiee.mp3',
  "I've never gotten to dance at a party.",
  'Wait a second... fur!',
  'FUR! Security!',
  'SPACE MATH',
  'Name: Squatch',
  "That's our song.",
  'I have to go to work now.',
  'speaker-option-4.png',
  'home-room-empty-open-v5.png',
];
const checklist = fs.readFileSync(path.join(root, 'docs', 'STORY-BEATS-CHECKLIST.md'), 'utf8');
for (let n = 1; n <= 61; n++) {
  if (!checklist.includes('| ' + n + ' |')) fail('R20', 'story checklist is missing beat ' + n);
}
for (const word of ['built', 'not yet built', 'dropped', 'milling', 'ga()']) {
  if (!checklist.includes(word)) fail('R20', 'story checklist is missing ' + word);
}
if (html.includes('One snack. That')) fail('R1', 'the one-snack rule is said at the party');
if (html.includes('Nobody can live outside')) fail('R1', 'the cut no-fur speech is back');
if (!book.includes('Day 2')) fail('R20', 'the rulebook does not keep the one-snack rule for later');
for (const line of lines) {
  if (!html.includes(line)) fail('R1', 'the game dropped an approved line: ' + line);
  if (!book.includes(line)) fail('R20', 'approved line is not in the rulebook: ' + line);
}

const playHost = 'onrender' + '.com';
const playLink = 'https://squatch.' + playHost;
if (!book.includes(playLink)) fail('R21', 'the rulebook does not state the play link');
if (!book.includes('commit ee59f4a')) fail('R21', 'the rulebook does not name the early-game quality bar');
if (!book.includes('The latest refined decision is what to build')) fail('R21', 'the rulebook does not say the newest concept wins');
if (!book.includes('Do not put an older idea back just because it is older')) fail('R21', 'the rulebook does not forbid reverting a refined concept');
function walk(dir, found) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, found);
    else found.push(full);
  }
}
const files = [];
walk(root, files);
const skip = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'zip', 'woff', 'woff2', 'ttf', 'ico']);
for (const full of files) {
  const rel = path.relative(root, full).split(path.sep).join('/');
  if (rel === 'docs/RULEBOOK.md') continue;
  const ext = path.extname(full).slice(1).toLowerCase();
  if (skip.has(ext)) continue;
  let text = '';
  try { text = fs.readFileSync(full, 'utf8'); } catch { continue; }
  if (text.includes(playHost)) fail('R21', 'play host is outside the rulebook: ' + rel);
}

if (problems.length) {
  console.log('RULEBOOK CHECK FAILED');
  for (const p of problems) console.log('- ' + p);
  process.exit(1);
}
console.log('RULEBOOK CHECK PASSED');
