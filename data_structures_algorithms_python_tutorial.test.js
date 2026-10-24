const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM, VirtualConsole} = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'data_structures_algorithms_python_tutorial.html'), 'utf8');
const traces = JSON.parse(html.match(/id="dsa-execution-traces">([\s\S]*?)<\/script>/)[1]);
const expected = [
  'intro\nchapter 1\n', '12\n9\n', '95\n91\n[95, 88]\n11\n0\n1\nTrue\n',
  "{'red': 2, 'blue': 1}\n", '[1, 2, 3]\n[1, 2, 3]\n[[1, 9], [2]]\n',
  "type hello\nAda\n['Lin', 'Sam']\n", '[10, 20, 30]\n', 'True\n[1, 3, 6, 8, 10, 14]\n',
  "(0, 'urgent')\n(0, 'urgent')\n(1, 'fix outage')\n", "['A', 'B', 'C', 'D', 'E']\n['A', 'B', 'D', 'C', 'E']\n",
  '2\n-1\n', '4\n-1\n', '[2, 3, 5, 7]\n', '[2, 3, 5, 7]\n',
  "[('Ada', 95), ('Sam', 91), ('Lin', 88)]\n", '24\n', '[(1, 2), (2, 4)]\n',
  '[1, 1, 2, 3, 5, 8]\n', '[[], [2], [1], [1, 2]]\n', 'True\nFalse\nFalse\n',
  '(0, 1)\n(0, 1)\nNone\n', '9\n-7\n', "['A', 'C', 'E']\n['A']\n", 'All checks passed\n'
];

test('standalone HTML includes the current animation sources and reduced-motion styles', () => {
  assert.ok(html.includes(fs.readFileSync(path.join(__dirname, 'tools/dsa_animations.js'), 'utf8')));
  assert.ok(html.includes(fs.readFileSync(path.join(__dirname, 'tools/dsa_animations.css'), 'utf8')));
  assert.match(html, /@media\(prefers-reduced-motion:reduce\).*trace-player/);
});

function load({reduced = false} = {}) {
  const errors = [], timers = new Map(); let timerId = 0;
  const console = new VirtualConsole(); console.on('jsdomError', e => errors.push(e));
  const dom = new JSDOM(html, {
    url: 'https://tutorial.test/', runScripts: 'dangerously', virtualConsole: console,
    beforeParse(window) {
      // This workspace's older jsdom predates the standard DOM replaceChildren API.
      window.Element.prototype.replaceChildren = function(...nodes) {
        while (this.firstChild) this.removeChild(this.firstChild);
        this.append(...nodes);
      };
      window.matchMedia = query => ({matches: reduced && query.includes('reduced-motion'), addEventListener() {}});
      window.setTimeout = callback => { const id = ++timerId; timers.set(id, callback); return id; };
      window.clearTimeout = id => timers.delete(id);
      window.HTMLElement.prototype.scrollIntoView = function() {};
      window.navigator.clipboard = {writeText: async text => { window.copied = text; }};
    }
  });
  const document = dom.window.document;
  const cards = [...document.querySelectorAll('.trace-enabled')];
  function seek(card, index) {
    const slider = card.querySelector('.trace-timeline');
    slider.value = String(index); slider.dispatchEvent(new dom.window.Event('input', {bubbles: true}));
  }
  return {dom, document, cards, seek, errors, timers};
}

test('every code example has a matching animation and correct recorded output', () => {
  const {dom, cards, errors} = load();
  assert.equal(cards.length, 24);
  cards.forEach((card, i) => {
    assert.equal(card.querySelector('pre[data-copy]').dataset.source.trim(), traces[i].code.trim());
    assert.equal(traces[i].output, expected[i], traces[i].title);
    assert.equal(traces[i].frames.at(-1).event, 'done');
    for (const frame of traces[i].frames) {
      assert.ok(frame.line >= 1 && frame.line <= traces[i].code.split('\n').length);
      assert.ok(frame.output === '' || traces[i].output.startsWith(frame.output));
    }
  });
  assert.deepEqual(errors, []); dom.window.close();
});

test('every recorded step renders, highlights its next line, and can rewind exactly', () => {
  const {dom, cards, seek, errors} = load();
  cards.forEach((card, i) => {
    traces[i].frames.forEach((frame, index) => {
      seek(card, index);
      assert.equal(card.querySelector('.trace-count').textContent, `${index + 1} / ${traces[i].frames.length}`);
      assert.equal(card.querySelector('.trace-output').textContent, frame.output || '(no output yet)');
      assert.equal(card.querySelectorAll('.trace-active').length, frame.event === 'line' ? 1 : 0);
      if (frame.event === 'line') assert.equal(Number(card.querySelector('.trace-active').dataset.line), frame.line);
    });
    assert.equal(card.querySelector('[data-action="next"]').disabled, true);
    assert.equal(card.querySelector('[data-action="play"]').textContent, '↻ Replay');
    card.querySelector('[data-action="reset"]').click();
    assert.equal(card.querySelector('.trace-timeline').value, '0');
    assert.equal(card.querySelector('[data-action="back"]').disabled, true);
    card.querySelector('[data-action="next"]').click();
    assert.equal(card.querySelector('.trace-timeline').value, '1');
    card.querySelector('[data-action="back"]').click();
    assert.equal(card.querySelector('.trace-timeline').value, '0');
  });
  assert.deepEqual(errors, []); dom.window.close();
});

test('aliasing, shallow copy, recursion, and specialized diagrams reflect actual state', () => {
  const {dom, cards, seek, errors} = load();
  const finalAlias = traces[4].frames.at(-1);
  assert.equal(finalAlias.globals.a.ref, finalAlias.globals.b.ref);
  assert.notEqual(finalAlias.globals.a.ref, finalAlias.globals.c.ref);
  const rows = finalAlias.objects[finalAlias.globals.rows.ref];
  const copied = finalAlias.objects[finalAlias.globals.copied.ref];
  assert.equal(rows.items[0].ref, copied.items[0].ref);
  assert.deepEqual(finalAlias.objects[rows.items[0].ref].items, [1, 9]);
  for (const [number, word] of [[6, 'Linked list'], [7, 'Binary search tree'], [8, 'Priority queue'], [9, 'Graph'], [22, 'Graph']]) {
    let found = false;
    traces[number].frames.some((frame, i) => {
      seek(cards[number], i);
      found = !!cards[number].querySelector(`svg[aria-label^="${word}"]`);
      return found;
    });
    assert.ok(found, `${word} diagram`);
  }
  const recursive = traces[15].frames.findIndex(f => f.stack.filter(c => c.name === 'factorial').length === 4);
  assert.ok(recursive >= 0); seek(cards[15], recursive);
  assert.match(cards[15].querySelector('.trace-scene').textContent, /4 × 3 × 2 × 1/);
  const interval = traces[16].frames.findIndex(f => f.stack.at(-1).vars.start === 1);
  seek(cards[16], interval); assert.equal(cards[16].querySelectorAll('.trace-interval').length, 4);
  assert.deepEqual(errors, []); dom.window.close();
});

test('play, pause, speed, replay, single-player playback, and closing a chapter', () => {
  const {dom, cards, document, timers, seek, errors} = load();
  const play = card => card.querySelector('[data-action="play"]');
  play(cards[1]).click(); assert.equal(play(cards[1]).getAttribute('aria-pressed'), 'true');
  const [id, tick] = [...timers.entries()].at(-1); timers.delete(id); tick();
  assert.equal(cards[1].querySelector('.trace-timeline').value, '1');
  play(cards[2]).click(); assert.equal(play(cards[1]).getAttribute('aria-pressed'), 'false');
  assert.equal(play(cards[2]).getAttribute('aria-pressed'), 'true');
  const speed = cards[2].querySelector('select'); speed.value = '2'; speed.dispatchEvent(new dom.window.Event('change'));
  assert.equal(timers.size, 1);
  play(cards[2]).click(); assert.equal(timers.size, 0);
  seek(cards[1], traces[1].frames.length - 1); play(cards[1]).click();
  assert.equal(cards[1].querySelector('.trace-timeline').value, '0');
  const section = cards[1].closest('details'); section.open = false; section.dispatchEvent(new dom.window.Event('toggle'));
  assert.equal(play(cards[1]).getAttribute('aria-pressed'), 'false');
  assert.equal(timers.size, 0);
  document.querySelector('.trace-hero-launch').click(); assert.equal(document.querySelector('.trace-hero-example').open, true);
  assert.deepEqual(errors, []); dom.window.close();
});

test('copy preserves runnable Python; original labs, search, and quiz still work', async () => {
  const {dom, cards, document, errors} = load({reduced: true});
  cards[12].querySelector('.copy').click(); await new Promise(resolve => setImmediate(resolve));
  assert.equal(dom.window.copied, traces[12].code);
  document.querySelector('#q').value = 'binary search'; document.querySelector('#q').dispatchEvent(new dom.window.Event('input'));
  assert.match(document.querySelector('#search-count').textContent, /matching chapter/);
  document.querySelector('#clear-search').click();
  document.querySelector('#bfs-next').click(); assert.match(document.querySelector('#bfs-message').textContent, /Processed A/);
  document.querySelector('#search-next').click(); assert.match(document.querySelector('#search-message').textContent, /mid=/);
  document.querySelector('#sort-next').click(); assert.match(document.querySelector('#sort-message').textContent, /Inserted/);
  document.querySelector('#q1 input[value="1"]').checked = true; document.querySelector('#q1 .check-answer').click();
  assert.match(document.querySelector('#quiz-score').textContent, /1 \/ 6/);
  assert.deepEqual(errors, []); dom.window.close();
});
