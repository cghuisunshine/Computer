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
  assert.ok(html.includes(fs.readFileSync(path.join(__dirname, 'tools/dsa_concepts.js'), 'utf8')));
  assert.ok(html.includes(fs.readFileSync(path.join(__dirname, 'tools/dsa_concepts.css'), 'utf8')));
  assert.match(html, /@media\(prefers-reduced-motion:reduce\).*trace-player/);
});

function load({reduced = false, motion = false} = {}) {
  const errors = [], animations = [], timers = new Map(); let timerId = 0;
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
      if (motion) window.Element.prototype.animate = function(frames, options) { animations.push({node: this, frames, options}); };
      window.navigator.clipboard = {writeText: async text => { window.copied = text; }};
    }
  });
  const document = dom.window.document;
  const cards = [...document.querySelectorAll('.trace-enabled')];
  function seek(card, index) {
    const slider = card.querySelector('.trace-timeline');
    slider.value = String(index); slider.dispatchEvent(new dom.window.Event('input', {bubbles: true}));
  }
  return {dom, document, cards, seek, errors, timers, animations};
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

function seekConcept(dom, id, index) {
  const card = dom.window.document.getElementById('concept-' + id);
  const story = dom.window.dsaConceptLessons.find(story => story.id === id);
  const mode = story.modes?.find(mode => mode.id === story.steps[index].mode);
  if (mode) {
    const button = card.querySelector(`[data-concept-mode="${mode.id}"]`);
    if (button.getAttribute('aria-pressed') !== 'true') button.click();
  }
  const slider = card.querySelector('.concept-slider');
  slider.value = String(index - (mode?.start || 0)); slider.dispatchEvent(new dom.window.Event('input', {bubbles: true}));
  return card;
}

test('all eight chapters have definition stories, with unique anchors and complete controls', () => {
  const {dom, document, errors} = load();
  const stories = dom.window.dsaConceptLessons;
  assert.equal(stories.length, 32);
  assert.equal(new Set(stories.map(story => story.id)).size, stories.length);
  for (const chapter of document.querySelectorAll('details.section')) {
    assert.ok(chapter.querySelector('.concept-demo'), chapter.id);
  }
  for (const story of stories) {
    const card = document.getElementById('concept-' + story.id);
    assert.equal(card.closest('details.section').id, story.chapter);
    assert.equal(card.querySelector('.concept-definition').textContent, story.definition);
    assert.ok(story.steps.length >= 3);
    assert.equal(card.querySelectorAll('.concept-controls button').length, 4);
    assert.equal(card.querySelector('select').options.length, 3);
    assert.ok(card.querySelector('.concept-slider').getAttribute('aria-label').includes(story.title));
    assert.ok(card.querySelector('.concept-caption[role="status"]'));
  }
  assert.deepEqual(errors, []); dom.window.close();
});

test('every concept step renders its visual model and explanation, then rewinds', () => {
  const {dom, errors} = load();
  for (const story of dom.window.dsaConceptLessons) {
    story.steps.forEach((frame, i) => {
      const card = seekConcept(dom, story.id, i);
      const mode = story.modes?.find(mode => mode.id === frame.mode);
      assert.equal(card.querySelector('.concept-counter').textContent, `${i - (mode?.start || 0) + 1} / ${mode ? mode.end - mode.start + 1 : story.steps.length}`);
      assert.equal(card.querySelector('.concept-caption strong').textContent, frame.title);
      assert.equal(card.querySelector('.concept-caption p').textContent, frame.explain);
      const keys = [...card.querySelectorAll('[data-motion-key]')].map(node => node.getAttribute('data-motion-key'));
      assert.equal(new Set(keys).size, keys.length, story.id + ': unique identities within each scene');
      assert.equal(card.querySelectorAll('.concept-lane').length, frame.lanes.length);
      if (frame.diagram) {
        assert.equal(card.querySelectorAll('.concept-node').length, frame.diagram.nodes.length);
        const ids = new Set(frame.diagram.nodes.map(n => n.id));
        frame.diagram.edges.forEach(e => { assert.ok(ids.has(e.from)); assert.ok(ids.has(e.to)); });
        for (const line of card.querySelectorAll('.concept-edge')) {
          for (const attr of ['x1', 'y1', 'x2', 'y2']) assert.ok(Number.isFinite(Number(line.getAttribute(attr))));
        }
      }
      if (frame.grid) assert.equal(card.querySelectorAll('.concept-work-grid span').length, frame.grid.size ** 2);
    });
    const card = dom.window.document.getElementById('concept-' + story.id);
    assert.equal(card.querySelector('[data-concept-action="next"]').disabled, true);
    card.querySelector('[data-concept-action="reset"]').click();
    assert.equal(card.querySelector('.concept-slider').value, '0');
    assert.equal(card.querySelector('[data-concept-action="back"]').disabled, true);
    card.querySelector('[data-concept-action="next"]').click();
    assert.equal(card.querySelector('.concept-slider').value, '1');
    card.querySelector('[data-concept-action="back"]').click();
    assert.equal(card.querySelector('.concept-slider').value, '0');
  }
  assert.deepEqual(errors, []); dom.window.close();
});

test('concept models preserve structure and algorithm invariants', () => {
  const {dom, errors} = load();
  const byId = id => dom.window.dsaConceptLessons.find(story => story.id === id);
  const values = (frame, label) => Array.from(frame.lanes.find(row => row.label.startsWith(label)).items, item => item.value);
  assert.deepEqual(values(byId('set-definition').steps[1], 'visited'), values(byId('set-definition').steps[2], 'visited'));
  assert.deepEqual(values(byId('stack-queue-definition').steps.at(-1), 'Stack · removed'), ['Sam']);
  assert.deepEqual(values(byId('stack-queue-definition').steps.at(-1), 'Queue · removed'), ['Ada']);
  const referenceEdges = byId('references-definition').steps[1].diagram.edges;
  for (const outer of ['outer1', 'outer2']) for (const inner of ['inner1', 'inner2']) assert.ok(referenceEdges.some(e => e.from === outer && e.to === inner));
  const heap = byId('heap-definition').steps.at(-1).diagram.nodes.map(n => Number(n.value));
  for (let i = 1; i < heap.length; i++) assert.ok(heap[Math.floor((i - 1) / 2)] <= heap[i]);
  const bfsFinal = byId('traversal-definition').steps.filter(frame => frame.title.startsWith('BFS:')).at(-1);
  assert.deepEqual(values(bfsFinal, 'Visit order'), ['A', 'B', 'C', 'D', 'E']);
  assert.deepEqual(values(byId('traversal-definition').steps.at(-1), 'Visit order'), ['A', 'B', 'D', 'C', 'E']);
  for (const id of ['insertion-definition', 'merge-definition', 'divide-definition']) {
    const finalValues = byId(id).steps.at(-1).lanes[0].items.map(item => Number(item.value));
    assert.deepEqual(Array.from(finalValues), id.startsWith('insertion') ? [3, 5, 7] : [2, 3, 5, 7]);
  }
  assert.deepEqual(values(byId('quicksort-definition').steps.at(-1), 'Sorted result'), ['2', '3', '5', '5', '7']);
  for (const id of ['window-pattern-definition', 'window-definition']) {
    const sums = byId(id).steps.map(frame => values(frame, 'Remembered state')[0]);
    const best = byId(id).steps.map(frame => values(frame, 'Remembered state')[1]);
    assert.deepEqual(Array.from(sums), ['sum = 8', 'sum = 7', 'sum = 9', 'sum = 6']);
    assert.deepEqual(Array.from(best), ['best = 8', 'best = 8', 'best = 9', 'best = 9']);
  }
  assert.equal(values(byId('recursion-definition').steps.at(-1), 'Returned answer')[0], '24');
  assert.equal(byId('dp-definition').steps.at(-1).lanes[0].items[1].value, '8');
  assert.deepEqual(values(byId('backtracking-definition').steps.at(-1), 'Saved answer copies'), ['[]', '[2]', '[1]', '[1, 2]']);
  assert.deepEqual(values(byId('shortest-path-definition').steps.at(-1), 'Shortest route'), ['A', 'C', 'E']);
  assert.deepEqual(errors, []); dom.window.close();
});

test('linked-list insertion connects next before redirecting head and never moves an allocated node', () => {
  const {dom, cards, seek, errors} = load();
  const story = dom.window.dsaConceptLessons.find(s => s.id === 'linked-definition');
  const connected = story.steps.find(frame => frame.action === 'new.next = head');
  assert.ok(connected.diagram.edges.some(e => e.from === 'head' && e.to === 'n20'));
  assert.ok(connected.diagram.edges.some(e => e.from === 'n10' && e.to === 'n20'));
  const redirected = story.steps.find(frame => frame.action === 'head = new');
  assert.ok(redirected.diagram.edges.some(e => e.from === 'head' && e.to === 'n10'));
  const positions = new Map();
  for (const frame of story.steps) for (const node of frame.diagram.nodes) {
    const location = [node.x, node.y];
    if (positions.has(node.id)) assert.deepEqual(location, positions.get(node.id));
    positions.set(node.id, location);
  }
  const tracePositions = new Map();
  traces[6].frames.forEach((_, i) => {
    seek(cards[6], i);
    cards[6].querySelectorAll('[data-object-id]').forEach(node => {
      const id = node.dataset.objectId, x = node.dataset.x;
      if (tracePositions.has(id)) assert.equal(x, tracePositions.get(id), id + ' stays in place');
      tracePositions.set(id, x);
    });
  });
  assert.equal(tracePositions.size, 3);
  assert.deepEqual(errors, []); dom.window.close();
});

test('sorting keeps every card accounted for while exposing one comparison or transfer at a time', () => {
  const {dom, errors} = load();
  const story = id => dom.window.dsaConceptLessons.find(s => s.id === id);
  for (const frame of story('insertion-definition').steps) {
    const row = frame.lanes[0].items, held = frame.lanes[1].items.filter(item => item.value !== '—');
    const gaps = row.filter(item => item.value === '□');
    const values = [...row.filter(item => item.value !== '□'), ...held].map(item => Number(item.value)).sort((a, b) => a - b);
    assert.deepEqual(Array.from(values), [3, 5, 7]);
    assert.equal(gaps.length, held.length);
  }
  const merge = story('merge-definition').steps;
  const finalMergeStart = merge.findIndex(frame => frame.title === 'Compare the two sorted fronts');
  let previousOutput = 0;
  for (const frame of merge.slice(finalMergeStart)) {
    const values = frame.lanes.flatMap(row => row.items).map(item => Number(item.value)).sort((a, b) => a - b);
    assert.deepEqual(Array.from(values), [2, 3, 5, 7]);
    const output = frame.lanes[0].items.map(item => Number(item.value));
    assert.deepEqual(Array.from(output), Array.from(output).sort((a, b) => a - b));
    assert.ok(output.length - previousOutput >= 0 && output.length - previousOutput <= 1);
    previousOutput = output.length;
  }
  assert.equal(previousOutput, 4);
  const card = seekConcept(dom, 'merge-definition', finalMergeStart + 1);
  const comparison = card.querySelector('.concept-comparison');
  assert.match(comparison.textContent, /Before.*Action.*After/);
  assert.ok(comparison.textContent.includes(merge[finalMergeStart].summary));
  assert.ok(comparison.textContent.includes(merge[finalMergeStart + 1].summary));
  assert.deepEqual(errors, []); dom.window.close();
});

test('binary-search bounds preserve the target and recursion retains unfinished caller frames', () => {
  const {dom, errors} = load();
  const story = id => dom.window.dsaConceptLessons.find(s => s.id === id);
  let low = 0, high = 6;
  for (const frame of story('binary-definition').steps) {
    const bounds = frame.lanes[0].pointers;
    assert.ok(bounds.low >= low && bounds.high <= high);
    assert.ok(bounds.low <= 4 && bounds.high >= 4);
    low = bounds.low; high = bounds.high;
  }
  const frames = story('recursion-definition').steps;
  let depth = 0;
  for (const frame of frames) {
    const calls = frame.lanes[0].items;
    assert.ok(Math.abs(calls.length - depth) <= 1);
    calls.slice(0, -1).forEach(item => assert.match(item.caption, /waiting: \d × factorial/));
    depth = calls.length;
  }
  assert.equal(depth, 0);
  const stack = seekConcept(dom, 'stack-queue-definition', 3);
  assert.ok(stack.querySelector('.concept-layout-stack'));
  assert.ok(stack.querySelector('.concept-layout-queue'));
  const graph = story('traversal-definition').steps.find(frame => frame.title === 'BFS: discover B from A');
  assert.equal(graph.diagram.nodes.find(n => n.id === 'gB').tone, 'frontier');
  assert.deepEqual(errors, []); dom.window.close();
});

test('DFS is directly selectable with its own code, animation, reset, replay, and completion', async () => {
  const {dom, document, cards, timers, errors} = load();
  const card = document.getElementById('concept-traversal-definition');
  const bfs = card.querySelector('[data-concept-mode="BFS"]'), dfs = card.querySelector('[data-concept-mode="DFS"]');
  const play = card.querySelector('[data-concept-action="play"]');
  assert.equal(bfs.getAttribute('aria-pressed'), 'true');
  assert.match(card.querySelector('.concept-code-card code').textContent, /def bfs\(/);
  dfs.click();
  assert.equal(dfs.getAttribute('aria-pressed'), 'true');
  assert.equal(bfs.getAttribute('aria-pressed'), 'false');
  assert.equal(card.querySelector('.concept-counter').textContent, '1 / 11');
  assert.equal(card.querySelector('.concept-caption strong').textContent, 'DFS: start at A');
  const code = card.querySelector('.concept-code-card code').textContent;
  assert.match(code, /def dfs\(graph, start\)/); assert.match(code, /stack.pop\(\)/);
  assert.doesNotMatch(code, /def bfs\(|queue.popleft/);
  card.querySelector('[data-concept-action="next"]').click();
  assert.match(card.querySelector('.concept-code-line.is-active').textContent, /node = stack.pop/);
  card.querySelector('.concept-code-top button').click(); await new Promise(resolve => setImmediate(resolve));
  assert.match(dom.window.copied, /graph = \{/);
  assert.match(dom.window.copied, /def dfs\(/); assert.match(dom.window.copied, /print\(dfs\(graph, "A"\)\)/);
  card.querySelector('[data-concept-action="reset"]').click();
  assert.equal(card.querySelector('.concept-caption strong').textContent, 'DFS: start at A');
  play.click();
  let limit = 30;
  while (timers.size && limit--) { const [id, tick] = timers.entries().next().value; timers.delete(id); tick(); }
  assert.ok(limit > 0); assert.equal(card.querySelector('.concept-counter').textContent, '11 / 11');
  assert.equal(card.querySelector('.concept-caption strong').textContent, 'DFS: traversal complete');
  assert.equal(play.textContent, '↻ Replay');
  assert.match(card.querySelector('.concept-code-line.is-active').textContent, /return order/);
  const order = [...card.querySelectorAll('.concept-lane:last-child .concept-value')].map(n => n.textContent);
  assert.deepEqual(order, ['A', 'B', 'D', 'C', 'E']);
  play.click(); assert.equal(card.querySelector('.concept-caption strong').textContent, 'DFS: start at A');
  bfs.click(); assert.equal(timers.size, 0);
  assert.equal(card.querySelector('.concept-caption strong').textContent, 'BFS: start at A');
  play.click(); limit = 30;
  while (timers.size && limit--) { const [id, tick] = timers.entries().next().value; timers.delete(id); tick(); }
  assert.ok(limit > 0); assert.equal(card.querySelector('.concept-caption strong').textContent, 'BFS: traversal complete');
  assert.equal(dfs.getAttribute('aria-pressed'), 'false');
  const trace = cards[9], jump = trace.querySelector('[data-trace-function="dfs"]');
  jump.click();
  const frame = traces[9].frames[Number(trace.querySelector('.trace-timeline').value)];
  assert.equal(frame.stack.at(-1).name, 'dfs');
  assert.equal(jump.getAttribute('aria-pressed'), 'true');
  assert.deepEqual(errors, []); dom.window.close();
});

test('definition playback pauses code playback and handles speed, completion, replay, and chapter collapse', () => {
  const {dom, document, cards, timers, errors} = load();
  const card = document.getElementById('concept-structure-algorithm');
  const play = card.querySelector('[data-concept-action="play"]');
  cards[1].querySelector('[data-action="play"]').click();
  play.click();
  assert.equal(cards[1].querySelector('[data-action="play"]').getAttribute('aria-pressed'), 'false');
  assert.equal(play.getAttribute('aria-pressed'), 'true');
  assert.equal(timers.size, 1);
  const speed = card.querySelector('select'); speed.value = '2'; speed.dispatchEvent(new dom.window.Event('change'));
  assert.equal(timers.size, 1);
  let limit = 100;
  while (timers.size && limit--) { const [id, tick] = timers.entries().next().value; timers.delete(id); tick(); }
  assert.ok(limit > 0); assert.equal(card.querySelector('.concept-slider').value, '4');
  assert.equal(play.textContent, '↻ Replay'); assert.equal(play.getAttribute('aria-pressed'), 'false');
  play.click(); assert.equal(card.querySelector('.concept-slider').value, '0');
  cards[1].querySelector('[data-action="play"]').click(); assert.equal(play.getAttribute('aria-pressed'), 'false');
  play.click();
  const second = document.getElementById('concept-growth').querySelector('[data-concept-action="play"]'); second.click();
  assert.equal(play.getAttribute('aria-pressed'), 'false'); assert.equal(second.getAttribute('aria-pressed'), 'true');
  const chapter = card.closest('details.section'); chapter.open = false; chapter.dispatchEvent(new dom.window.Event('toggle'));
  assert.equal(second.getAttribute('aria-pressed'), 'false'); assert.equal(timers.size, 0);
  assert.deepEqual(errors, []); dom.window.close();
});

test('concept motion uses valid transforms and respects reduced motion', () => {
  for (const reduced of [false, true]) {
    const {dom, errors, animations} = load({reduced, motion: true});
    for (const story of dom.window.dsaConceptLessons) story.steps.forEach((_, i) => seekConcept(dom, story.id, i));
    if (reduced) assert.equal(animations.length, 0);
    else {
      assert.ok(animations.length > 100);
      for (const animation of animations) for (const frame of animation.frames) {
        if (frame.transform) assert.doesNotMatch(frame.transform, /NaN|undefined|Infinity/);
      }
    }
    assert.deepEqual(errors, []); dom.window.close();
  }
});
