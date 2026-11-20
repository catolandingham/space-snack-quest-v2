// Fails if the game draws or loads something docs/RULEBOOK.md does not list.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
const { execFileSync } = await import('child_process');
for (const kind of guests) {
  const imPath = path.join(root, 'prototypes', 'space-snack-quest', 'assets', 'approved', 'guests', kind + '.png');
  const alpha = execFileSync('python3', ['-c', `
from PIL import Image
im = Image.open(${JSON.stringify(imPath)}).convert('RGBA')
w, h = im.size
px = im.load()
corners = [px[0, 0][3], px[w - 1, 0][3], px[0, h - 1][3], px[w - 1, h - 1][3]]
print(','.join(str(c) for c in corners))
`], { encoding: 'utf8' }).trim();
  if (alpha.split(',').some(n => n !== '0')) fail('R10', kind + ' sprite corners are not transparent (' + alpha + ')');
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
  "This is Squatch. He's a Sasquatch.",
  'Morning, Squatch.',
  'Big party in the hall tonight.',
  'Party?',
  'Stay in here.',
  "I'm floating in space!",
  'Weeee-eenn-nnttt!',
  'That evening',
  'SING',
  'HIDE',
  'LOCKUP',
  '[line needed]',
];
for (const line of lines) {
  if (!html.includes(line)) fail('R1', 'the game dropped an approved line: ' + line);
  if (!book.includes(line)) fail('R20', 'approved line is not in the rulebook: ' + line);
}

if (problems.length) {
  console.log('RULEBOOK CHECK FAILED');
  for (const p of problems) console.log('- ' + p);
  process.exit(1);
}
console.log('RULEBOOK CHECK PASSED');
