const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const app = fs.readFileSync(path.join(__dirname, '..', 'dist', 'app.js'), 'utf8');
const helpers = app.slice(app.indexOf('function el('), app.indexOf('function orderProjects('));
const stopping = app.slice(app.indexOf('function stopFilmMedia('), app.indexOf("$('#close-film')"));
const showing = app.slice(app.indexOf('function show(p)'), app.indexOf("dialog.addEventListener('close'"));
const embed = 'https://drive.google.com/file/d/1pj9SpiN8NAlknU0TA8qjKg6fMqhXC4x8/preview';
const view = embed.replace('/preview', '/view');

function element(tag) {
  return {
    tagName: tag.toUpperCase(), style: {}, attributes: {}, events: {}, children: [],
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, handler) { this.events[name] = handler; },
    append(...children) { this.children.push(...children); },
    replaceChildren(...children) { this.children = children; },
    remove() { this.removed = true; },
    pause() { this.paused = true; },
  };
}

function setup() {
  const content = element('div');
  const dialog = element('dialog');
  dialog.querySelectorAll = tag => content.children.filter(child => child.tagName === tag.toUpperCase());
  dialog.close = () => { dialog.open = false; };
  dialog.showModal = () => { dialog.open = true; };
  const context = vm.createContext({
    document: { createElement: element, querySelectorAll: () => [] },
    location: { origin: 'https://vanshxrastogi.github.io' }, URL,
    dialog, history: { replaceState() {} }, $: selector => selector === '#film-content' ? content : null,
  });
  vm.runInContext(helpers + stopping + showing, context);
  return { context, content, dialog };
}

test('Drive player retains actual ratio and grants fullscreen without autoplay', () => {
  const { context } = setup();
  const frame = context.player({ title: 'Room 4', aspectRatio: '4:3', embedUrl: embed, video: view });
  assert.equal(frame.tagName, 'IFRAME');
  assert.equal(frame.src, embed);
  assert.equal(frame.style.aspectRatio, String(4 / 3));
  assert.match(frame.title, /Room 4/);
  assert.equal(frame.allowFullscreen, true);
  assert.equal(frame.allow, 'encrypted-media; fullscreen');
  assert.ok(!frame.allow.includes('autoplay'));
});

test('only exact HTTPS Google Drive preview URLs can create an iframe', () => {
  const { context } = setup();
  for (const url of [
    embed.replace('https:', 'http:'), embed.replace('drive.google.com', 'drive.google.com.evil.test'),
    embed.replace('drive.google.com', 'user@drive.google.com'), embed.replace('drive.google.com', 'drive.google.com:443'),
    view, embed + '?autoplay=1', embed + '#fragment', embed + '/', embed + '\n',
    'javascript:alert(1)', 'https://drive.google.com/file/d/a/b/preview', '', null,
  ]) {
    assert.equal(context.safeEmbedUrl(url), null, String(url));
    assert.notEqual(context.player({ title: 'Test', embedUrl: url, video: view }).tagName, 'IFRAME');
  }
});

test('panoramic films retain usable embedded controls on narrow screens', () => {
  const { context } = setup();
  const frame = context.player({ title: 'Buddha', aspectRatio: '304:45', embedUrl: embed, video: view });
  assert.equal(frame.style.aspectRatio, String(16 / 9));
});

test('an unavailable embed keeps the direct Drive fallback and skips native video error handling', () => {
  const { context, content, dialog } = setup();
  context.show({ id: 'room-4', title: 'Room 4', embedUrl: 'https://evil.test/preview', video: view });
  assert.equal(content.children[0].tagName, 'P');
  assert.equal(content.children[0].events.error, undefined);
  const fallback = content.children.find(child => child.textContent === 'Open film in Google Drive ↗');
  assert.equal(fallback.href, view);
  assert.equal(fallback.rel, 'noopener noreferrer');
  assert.equal(dialog.attributes['aria-labelledby'], 'film-title');
  assert.equal(dialog.open, true);
  assert.equal(context.driveFilmUrl({ embedUrl: embed, video: 'https://evil.test/' }), view);
  assert.equal(context.driveFilmUrl({ video: 'javascript:alert(1)' }), null);
});

test('native films retain video controls and native-only error handling', () => {
  const { context, content } = setup();
  context.show({ id: 'native', title: 'Native film', video: '/media/native.mp4', poster: '/media/native.jpg' });
  const video = content.children[0];
  assert.equal(video.tagName, 'VIDEO');
  assert.equal(video.controls, true);
  assert.equal(video.src, 'https://vanshxrastogi.github.io/media/native.mp4');
  assert.equal(typeof video.events.error, 'function');
});

test('closing removes the embedded browsing context and pauses native video', () => {
  const { context, content, dialog } = setup();
  const video = element('video');
  const frame = element('iframe');
  content.children = [video, frame];
  dialog.open = true;
  context.closeFilm();
  assert.equal(video.paused, true);
  assert.equal(frame.removed, true);
  assert.equal(dialog.open, false);
  assert.ok(app.includes("dialog.addEventListener('cancel',stopFilmMedia)"));
  assert.ok(app.includes("dialog.addEventListener('close',()=>{stopFilmMedia();"));
});
