const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const dist = path.join(__dirname, '..', 'dist');
const app = fs.readFileSync(path.join(dist, 'app.js'), 'utf8');
const helper = app.match(/function matchesFormat\(project,format\)\{[^}]+\}/);
assert.ok(helper, 'The gallery format matcher must be available');
const matchesFormat = vm.runInNewContext(`(${helper[0]})`);

test('4:3 joins landscape while 4:5 remains portrait without changing metadata', () => {
  for (const [aspectRatio, expected] of [
    ['16:9', '16:9'], ['304:45', '16:9'], ['1:1', '16:9'], ['4:3', '16:9'], ['9:16', '9:16'], ['4:5', '9:16'],
  ]) {
    const project = { aspectRatio };
    const groups = ['16:9', '9:16'].filter(format => matchesFormat(project, format));
    assert.deepEqual(groups, [expected], aspectRatio);
    assert.equal(project.aspectRatio, aspectRatio, 'Original ratio must remain truthful');
  }
});

test('every published portfolio film appears in exactly one orientation group', () => {
  const { projects } = JSON.parse(fs.readFileSync(path.join(dist, 'content.json'), 'utf8'));
  const published = projects.filter(project => project.status === 'published');
  assert.ok(published.some(project => project.id === 'room-4-ai-voice-experiment'));
  for (const project of published) {
    const groups = ['16:9', '9:16'].filter(format => matchesFormat(project, format));
    assert.equal(groups.length, 1, `${project.id} must not disappear or be duplicated`);
  }
});

test('original films occupy the dedicated cinema shelf exactly once', () => {
 const collection = app.match(/function matchesCollection\(project,collection\)\{[^}]+\}/)[0];
 const match = vm.runInNewContext(helper[0] + ';(' + collection + ')');
 const {projects} = JSON.parse(fs.readFileSync(path.join(dist,'content.json'),'utf8'));
 for(const p of projects.filter(p=>p.status==='published')){
  const shelves=['cinema','16:9','9:16'].filter(s=>match(p,s));
  assert.equal(shelves.length,1,p.id);
  if(p.category==='ORIGINAL FILMS') assert.deepEqual(shelves,['cinema']);
 }
});
