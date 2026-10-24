/* Real execution snapshots are embedded at build time; playback needs no network. */
(() => {
  'use strict';
  const traces = JSON.parse(document.getElementById('dsa-execution-traces').textContent);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const players = [];
  let playing = null;
  const concepts = [
    'A list keeps playlist order; a dictionary maps names to scores; a set keeps unique members. The loop visits the list in order.',
    'Compare the two calls: total performs 3 additions; all_pairs appends 3 × 3 = 9 pairs. Watch the result grow.',
    'Lists use positions, tuples group fixed records, dictionaries use keys, and sets keep unique members. Adding A twice still leaves one member.',
    'The dictionary stores work already done. Each red increments the same entry; a new word starts at zero.',
    'Names pointing to the same object number share mutations. A shallow copy creates a new outer list and keeps references to the same inner lists.',
    'Stack: remove from the right (last in, first out). Queue: add at the right and remove at the left (first in, first out).',
    'Each node stores a value and a next reference. Prepending changes head; traversal follows current.next until None.',
    'BST search follows one branch per comparison. Inorder recursion visits left subtree, node, then right subtree; watch the calls return.',
    'The smallest priority belongs at the root. The array describes a complete binary tree; children of index i are 2i+1 and 2i+2. A heap is not a sorted list.',
    'BFS removes the queue front; DFS removes the stack top. Nodes are marked when added, so each is added only once. Watch the different visit orders.',
    'Linear search inspects one value at a time. The empty input skips the loop and returns -1.',
    'The target, if present, stays between low and high. A comparison removes a whole half. An empty interval returns -1.',
    'Keep key aside, shift each larger item right, then fill the gap. The prefix before i is sorted; watch j move left.',
    'Each recursive call sorts a smaller slice. Compare the next left and right items, append the smaller, then copy the remaining tail.',
    'The key selects the score in each record; reverse=True puts larger scores first. sorted creates a new list and preserves students.',
    'Each call waits for the smaller call. The base case returns 1; returning calls multiply their answers on the way back up.',
    'Sort by finishing time. Accept an interval only when its start is at least the end of the last chosen interval.',
    'previous and current hold adjacent answers. Both right-hand values are calculated before either name changes: new current = old previous + old current.',
    'For each value, explore exclude, then include. Copy path at a leaf; pop undoes the last choice before exploring another branch.',
    'Only unmatched opening brackets stay on the stack. A closing bracket must match the top; a nonempty stack at the end is also a failure.',
    'Look up target − value before storing the current index. This prevents using the same element twice and supports duplicate values.',
    'Move the window by subtracting the leaving value and adding the entering one. Start best with the first sum so negative inputs work.',
    'BFS discovers vertices by distance. Save the first parent, follow parents backward from the goal, then reverse that path.',
    'Each assertion checks a boundary case using the earlier function definitions. Reaching the next assertion means the previous one passed.'
  ];
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const shortId = id => '#' + id.slice(1);
  function format(value, objects, depth = 0) {
    if (value === null) return 'None';
    if (value === true) return 'True';
    if (value === false) return 'False';
    if (typeof value === 'string') return JSON.stringify(value);
    if (value && value.literal) return value.literal;
    if (value && value.ref) {
      const object = objects[value.ref];
      if (!object) return shortId(value.ref);
      if (depth > 2 || object.fields) return `${object.type} ${shortId(value.ref)}`;
      if (object.items) {
        if (object.type === 'set' && !object.items.length) return 'set()';
        const brackets = object.type === 'tuple' ? ['(', ')'] : object.type === 'set' ? ['{', '}'] : ['[', ']'];
        return brackets[0] + object.items.map(v => format(v, objects, depth + 1)).join(', ') + brackets[1];
      }
      if (object.entries) return '{' + object.entries.map(([k, v]) => format(k, objects, depth + 1) + ': ' + format(v, objects, depth + 1)).join(', ') + '}';
      return object.text || object.type;
    }
    return String(value);
  }
  function brief(value, objects) {
    const text = format(value, objects);
    return text.length > 95 ? text.slice(0, 92) + '…' : text;
  }
  function objectAt(value, frame) { return value && value.ref ? frame.objects[value.ref] : null; }
  function variables(frame) { return {...frame.globals, ...(frame.stack.at(-1)?.vars || {})}; }
  function svgElement(tag, attrs, text) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function svgScene(title, width, height) {
    const svg = svgElement('svg', {viewBox: `0 0 ${width} ${height}`, class: 'trace-svg', role: 'img', 'aria-label': title});
    svg.append(svgElement('title', {}, title));
    return svg;
  }
  function drawNode(svg, x, y, value, state = '', label = '') {
    svg.append(svgElement('circle', {cx: x, cy: y, r: 19, class: state}));
    svg.append(svgElement('text', {x, y}, value));
    if (label) svg.append(svgElement('text', {x, y: y + 32, class: 'trace-node-label'}, label));
  }
  function drawGraph(frame, vars) {
    const graph = objectAt(vars.graph, frame);
    if (!graph?.entries || !graph.entries.some(([key]) => key === 'A')) return null;
    const positions = {A: [55, 95], B: [170, 40], C: [170, 155], D: [285, 40], E: [285, 155]};
    const svg = svgScene('Graph: amber is current, green is discovered or visited; bold edges show the reconstructed path.', 340, 205);
    const seen = objectAt(vars.seen, frame)?.items || objectAt(vars.parent, frame)?.entries?.map(([key]) => key) || [];
    const path = objectAt(vars.path, frame)?.items || [];
    const edges = new Set();
    graph.entries.forEach(([from, ref]) => {
      (objectAt(ref, frame)?.items || []).forEach(to => {
        const key = [from, to].sort().join('-');
        if (edges.has(key) || !positions[from] || !positions[to]) return;
        edges.add(key);
        const [x1, y1] = positions[from], [x2, y2] = positions[to];
        const active = path.some((v, i) => i && ((v === from && path[i - 1] === to) || (v === to && path[i - 1] === from)));
        svg.append(svgElement('line', {x1, y1, x2, y2, class: active ? 'trace-edge-active' : ''}));
      });
    });
    Object.entries(positions).forEach(([name, [x, y]]) => drawNode(svg, x, y, name, vars.node === name ? 'trace-current' : seen.includes(name) ? 'trace-visited' : '', vars.neighbor === name ? 'neighbor' : ''));
    return svg;
  }
  function drawNodes(frame, vars) {
    const objects = Object.values(frame.objects);
    const treeRoot = vars.tree || vars.root;
    if (objectAt(treeRoot, frame)?.type === 'TreeNode') {
      const nodes = [], edges = [];
      function walk(ref, x, y, gap) {
        const node = objectAt(ref, frame);
        if (!node?.fields) return;
        nodes.push({ref, x, y, value: node.fields.value ?? '?'});
        [['left', -1], ['right', 1]].forEach(([key, direction]) => {
          const child = node.fields[key];
          if (child?.ref) { edges.push([x, y, x + direction * gap, y + 68]); walk(child, x + direction * gap, y + 68, gap / 2); }
        });
      }
      walk(treeRoot, 190, 27, 92);
      const svg = svgScene('Binary search tree. Amber marks current or the active recursive root.', 380, 215);
      edges.forEach(([x1, y1, x2, y2]) => svg.append(svgElement('line', {x1, y1, x2, y2})));
      nodes.forEach(({ref, x, y, value}) => drawNode(svg, x, y, value, (vars.current || vars.root)?.ref === ref.ref ? 'trace-current' : '', shortId(ref.ref)));
      return svg;
    }
    if (objects.some(o => o.type === 'Node') && vars.head?.ref) {
      const nodes = []; let ref = vars.head;
      while (ref?.ref && nodes.length < 8) {
        const node = objectAt(ref, frame);
        if (!node?.fields || nodes.some(n => n.ref.ref === ref.ref)) break;
        nodes.push({ref, value: node.fields.value ?? '?'}); ref = node.fields.next;
      }
      const svg = svgScene('Linked list from head. Arrows follow next references; amber marks current.', Math.max(340, nodes.length * 95 + 60), 105);
      nodes.forEach(({ref, value}, i) => {
        const x = 42 + i * 95;
        svg.append(svgElement('path', {d: `M ${x + 20} 42 h 50 l -7 -5 m 7 5 l -7 5`}));
        drawNode(svg, x, 42, value, vars.current?.ref === ref.ref ? 'trace-current' : '', (i ? '' : 'head · ') + shortId(ref.ref));
      });
      svg.append(svgElement('text', {x: nodes.length * 95 + 25, y: 42}, 'None'));
      return svg;
    }
    const jobs = objectAt(vars.jobs, frame);
    if (jobs?.items) {
      const svg = svgScene('Priority queue array as a binary tree; each node shows its priority. Heap order holds after heapify.', 360, 220);
      const positions = [[180, 30], [90, 103], [270, 103], [45, 177]];
      jobs.items.forEach((item, i) => {
        if (i) { const [x1, y1] = positions[Math.floor((i - 1) / 2)], [x2, y2] = positions[i]; svg.append(svgElement('line', {x1, y1, x2, y2})); }
      });
      jobs.items.forEach((item, i) => {
        const [x, y] = positions[i]; const record = objectAt(item, frame)?.items || [];
        drawNode(svg, x, y, record[0], i === 0 ? 'trace-current' : '', `i=${i} · ${record[1] || ''}`);
      });
      return svg;
    }
    return null;
  }
  function describe(trace, frame) {
    const source = trace.code.split('\n')[frame.line - 1]?.trim() || '';
    const vars = variables(frame);
    if (frame.event === 'done') return ['Finished', 'The example has completed. Check its printed output below, or replay to follow each change.'];
    if (frame.event === 'return') return [`Returned from ${frame.stack.at(-1).name}`, `Return ${brief(frame.result, frame.objects)} to the waiting caller. The next step resumes that caller.`];
    let message = 'Run this statement, then use Next to inspect the resulting state.';
    if (/^def |^class /.test(source)) message = 'Define this function or class. Its body runs later when it is called.';
    else if (/^from |^import /.test(source)) message = 'Load the standard library tool used by this example.';
    else if (/^assert /.test(source)) message = 'Check this condition using the earlier function definitions. A successful assertion prints nothing; reaching the next line means it passed.';
    else if (/^print\(/.test(source)) message = 'Evaluate the expression, including any function call, and print its result. Watch the call stack before output appears.';
    else if (/^return /.test(source)) message = 'Evaluate this return expression. Recursive calls must finish first; then pass the result to the caller.';
    else if (/^if |^elif |^while /.test(source)) message = 'Evaluate this condition using the variables shown. Its truth value decides which line runs next.';
    else if (/^for /.test(source)) message = 'Request the next item for this loop. When there are no more items, execution continues after the loop.';
    else if (/\.append\(/.test(source)) message = 'Append a value at the right end. Watch the collection gain a cell on the next step.';
    else if (/\.pop\(|\.popleft\(/.test(source)) message = source.includes('popleft') ? 'Remove the oldest queued item from the left end.' : 'Remove the item at the right end; the remaining cells stay in order.';
    else if (/\.copy\(/.test(source)) message = 'Create a new outer collection. Object numbers reveal which nested values are still shared.';
    else if (source.includes('previous, current = current')) message = `Compute both values from the old state: new previous = ${vars.current}; new current = ${vars.previous} + ${vars.current}. Then assign both together.`;
    else if (source.includes('current += values[right]')) message = `Slide right: add the entering value and subtract the value k positions behind. The next step shows the updated sum.`;
    else if (source.includes('=') && !source.includes('==')) message = 'Calculate the right-hand side, then update the name or collection entry on the left. Compare the variable badges on the next step.';
    return [`Next: line ${frame.line}`, message];
  }
  function makePlayer(card, trace, number) {
    card.classList.add('trace-enabled');
    card.dataset.trace = String(number);
    const pre = card.querySelector('pre');
    const original = pre.textContent;
    // Copy always uses the unmodified source: line numbers and controls stay out.
    pre.dataset.source = original;
    const code = el('code');
    const lines = original.split('\n').map((text, i) => {
      const row = el('span', 'trace-line', text || ' '); row.dataset.line = String(i + 1); return row;
    });
    lines.forEach(line => code.append(line));
    pre.replaceChildren(code);
    const workspace = el('div', 'trace-workspace'); pre.replaceWith(workspace); workspace.append(pre);
    const panel = el('section', 'trace-player'); panel.setAttribute('aria-label', `${trace.title} animation`);
    const kicker = el('div', 'trace-kicker', 'Watch the code');
    const count = el('span', 'trace-count'); kicker.append(count); panel.append(kicker);
    const controls = el('div', 'trace-controls');
    const button = (label, action, cls = '') => { const b = el('button', cls, label); b.type = 'button'; b.dataset.action = action; controls.append(b); return b; };
    const play = button('▶ Play', 'play', 'primary');
    const back = button('← Back', 'back');
    const next = button('Next →', 'next');
    const reset = button('↺ Reset', 'reset');
    const speedLabel = el('label', '', 'Speed');
    const speed = el('select'); speed.setAttribute('aria-label', `Playback speed for ${trace.title}`);
    [['0.5', '0.5×'], ['1', '1×'], ['2', '2×']].forEach(([value, label]) => { const option = el('option', '', label); option.value = value; speed.append(option); }); speed.value = '1';
    speedLabel.append(speed); controls.append(speedLabel); panel.append(controls);
    const timeline = el('input', 'trace-timeline'); timeline.type = 'range'; timeline.min = '0'; timeline.max = String(trace.frames.length - 1); timeline.value = '0'; timeline.step = '1'; timeline.setAttribute('aria-label', `Execution step for ${trace.title}`); panel.append(timeline);
    const explain = el('div', 'trace-explain'); explain.setAttribute('role', 'status');
    const explainTitle = el('strong'), explainText = el('p'); explain.append(explainTitle, explainText); panel.append(explain);
    panel.append(el('p', 'trace-concept', concepts[number]));
    const scene = el('div', 'trace-scene'); scene.setAttribute('aria-label', 'Data structure visualization'); panel.append(scene);
    const variableArea = el('div', 'trace-variables'); panel.append(variableArea);
    panel.append(el('span', 'trace-stack-label', 'Call stack · caller → active call'));
    const stack = el('div', 'trace-stack'); panel.append(stack);
    panel.append(el('span', 'trace-output-label', 'Printed output so far'));
    const output = el('pre', 'trace-output'); panel.append(output);
    const memory = el('details', 'trace-memory'); memory.append(el('summary', '', 'Inspect objects & shared references'));
    const memoryBody = el('div', 'trace-memory-body'); memory.append(memoryBody); panel.append(memory);
    panel.append(el('p', 'trace-hint', 'Recorded Python execution · the highlighted line runs NEXT. Data shows the state before it runs. Gold marks changed values; object numbers identify shared references.'));
    workspace.append(panel);
    let index = 0, timer = null, active = false;
    const api = {pause, get index() { return index; }};
    players.push(api);
    function pause() {
      clearTimeout(timer); timer = null; active = false; play.textContent = index === trace.frames.length - 1 ? '↻ Replay' : '▶ Play'; play.setAttribute('aria-pressed', 'false');
      if (playing === api) playing = null;
    }
    function tick() {
      if (!active) return;
      if (index >= trace.frames.length - 1) { pause(); return; }
      index++; render();
      if (index >= trace.frames.length - 1) pause();
      else timer = setTimeout(tick, 1200 / Number(speed.value));
    }
    function seek(value) { pause(); index = Math.max(0, Math.min(trace.frames.length - 1, value)); render(); }
    play.addEventListener('click', () => {
      if (active) { pause(); return; }
      window.dispatchEvent(new Event('dsa-playback-start'));
      if (playing) playing.pause();
      if (index >= trace.frames.length - 1) { index = 0; render(); }
      active = true; playing = api; play.textContent = 'Ⅱ Pause'; play.setAttribute('aria-pressed', 'true'); timer = setTimeout(tick, 1200 / Number(speed.value));
    });
    back.addEventListener('click', () => seek(index - 1));
    next.addEventListener('click', () => seek(index + 1));
    reset.addEventListener('click', () => seek(0));
    timeline.addEventListener('input', () => seek(Number(timeline.value)));
    speed.addEventListener('change', () => { if (active) { clearTimeout(timer); timer = setTimeout(tick, 1200 / Number(speed.value)); } });
    const chapter = card.closest('details');
    if (chapter) chapter.addEventListener('toggle', () => { if (!chapter.open) pause(); });
    function renderObject(object, frame, vars, names, previous, compact = false) {
      const group = el('div', 'trace-object');
      const alias = names[object.id] || [];
      group.append(el('h4', '', `${alias.length ? alias.join(' = ') + ' → ' : ''}${object.type} ${shortId(object.id)}`));
      if (object.items) {
        const row = el('div', 'trace-array');
        const occurrences = {};
        const max = Math.max(1, ...object.items.filter(v => typeof v === 'number').map(Math.abs));
        object.items.forEach((value, i) => {
          const cell = el('div', 'trace-cell');
          const valueKey = JSON.stringify(value); occurrences[valueKey] = (occurrences[valueKey] || 0) + 1;
          cell.dataset.key = `${object.id}:${valueKey}:${occurrences[valueKey]}`;
          const pointers = [];
          if (['values', 'result', 'left', 'right'].some(name => alias.includes(name))) {
            const pointerNames = alias.includes('left') ? ['i'] : alias.includes('right') ? ['j'] : ['i', 'j', 'index', 'mid', 'low', 'high', 'right'];
            pointerNames.forEach(name => { if (vars[name] === i) pointers.push(name); });
            if (alias.includes('values') && Number.isInteger(vars.low) && Number.isInteger(vars.high)) cell.classList.toggle('is-outside', i < vars.low || i > vars.high);
            if (alias.includes('values') && Number.isInteger(vars.k) && vars.current !== undefined) {
              const right = Number.isInteger(vars.right) ? vars.right - (trace.code.split('\n')[frame.line - 1]?.includes('current +=') ? 1 : 0) : vars.k - 1;
              cell.classList.toggle('is-window', i > right - vars.k && i <= right);
            }
            if (number === 12 && alias.includes('result')) cell.classList.toggle('is-sorted', i < vars.i);
          }
          if (alias.includes('stack') && i === object.items.length - 1) pointers.push('top');
          if (alias.includes('queue')) { if (i === 0) pointers.push('front'); if (i === object.items.length - 1) pointers.push('back'); }
          cell.classList.toggle('is-pointer', pointers.length > 0);
          if (previous && !same(previous.items?.[i], value)) cell.classList.add('is-new');
          if (!compact && typeof value === 'number' && ['values', 'result'].some(name => alias.includes(name)) && [1, 10, 11, 12, 13, 21].includes(number)) {
            const bar = el('span', 'trace-bar'); bar.style.height = (8 + Math.abs(value) / max * 45) + 'px'; cell.append(bar);
          }
          const valueNode = el('span', value?.ref ? 'trace-ref' : '', brief(value, frame.objects));
          if (value?.ref) valueNode.append(document.createTextNode(` ↗${shortId(value.ref)}`));
          cell.append(valueNode);
          cell.append(el('small', '', (object.type === 'set' ? 'member' : `i=${i}`) + (pointers.length ? ' · ' + pointers.join(', ') : '')));
          row.append(cell);
        });
        if (!object.items.length) row.append(el('span', 'trace-empty', '(empty)'));
        group.append(row);
      } else if (object.entries || object.fields) {
        const map = el('div', 'trace-map');
        const entries = object.entries || Object.entries(object.fields);
        entries.forEach(([key, value]) => {
          map.append(el('span', '', (object.fields ? key : format(key, frame.objects)) + ' →'));
          map.append(el('span', value?.ref ? 'trace-ref' : '', brief(value, frame.objects) + (value?.ref ? ` ↗${shortId(value.ref)}` : '')));
        });
        if (!entries.length) map.append(el('span', 'trace-empty', '(empty)'));
        group.append(map);
      }
      return group;
    }
    function render() {
      const frame = trace.frames[index], previous = index ? trace.frames[index - 1] : null;
      const vars = variables(frame), previousVars = previous ? variables(previous) : {};
      const names = {};
      Object.entries(vars).forEach(([name, value]) => { if (value?.ref) (names[value.ref] ||= []).push(name); });
      count.textContent = `${index + 1} / ${trace.frames.length}`;
      timeline.value = String(index); timeline.setAttribute('aria-valuetext', `Step ${index + 1} of ${trace.frames.length}, ${frame.event === 'done' ? 'finished' : 'line ' + frame.line}`);
      back.disabled = index === 0; next.disabled = index === trace.frames.length - 1;
      if (!active) play.textContent = index === trace.frames.length - 1 ? '↻ Replay' : '▶ Play';
      lines.forEach((line, i) => { line.classList.toggle('trace-active', frame.event === 'line' && i + 1 === frame.line); line.classList.toggle('trace-return', frame.event === 'return' && i + 1 === frame.line); });
      const currentLine = lines[frame.line - 1];
      if (currentLine && frame.event !== 'done') {
        const top = currentLine.offsetTop - pre.offsetTop;
        if (top < pre.scrollTop || top + currentLine.offsetHeight > pre.scrollTop + pre.clientHeight) pre.scrollTop = Math.max(0, top - pre.clientHeight / 3);
      }
      const [title, text] = describe(trace, frame); explainTitle.textContent = title; explainText.textContent = text;
      variableArea.replaceChildren();
      Object.entries(vars).forEach(([name, value]) => {
        const badge = el('span', 'trace-variable');
        badge.append(el('b', '', name + ' = '));
        badge.append(document.createTextNode(value?.ref ? `${frame.objects[value.ref].type} ${shortId(value.ref)}` : format(value, frame.objects)));
        badge.classList.toggle('is-new', previous !== null && !same(previousVars[name], value)); variableArea.append(badge);
      });
      stack.replaceChildren(...frame.stack.map(call => {
        const args = Object.entries(call.vars).filter(([, value]) => !value?.ref).slice(0, 3).map(([key, value]) => key + '=' + brief(value, frame.objects)).join(', ');
        return el('span', '', call.name === '<module>' ? 'example' : `${call.name}(${args})`);
      }));
      output.textContent = frame.output || '(no output yet)';
      const oldPositions = new Map([...scene.querySelectorAll('[data-key]')].map(node => [node.dataset.key, node.getBoundingClientRect()]));
      scene.replaceChildren();
      const diagram = drawGraph(frame, vars) || drawNodes(frame, vars);
      if (diagram) scene.append(diagram);
      if (number === 15 && vars.n !== undefined) {
        const calls = frame.stack.filter(call => call.name === 'factorial');
        scene.append(el('h4', '', 'Recursion · waiting multiplications'));
        scene.append(el('p', '', calls.map(call => call.vars.n).join(' × ') + (frame.event === 'return' ? ' → returning ' + format(frame.result, frame.objects) : ' → solve the smallest call first')));
      }
      if (number === 16) {
        const intervals = objectAt(vars.intervals, frame)?.items || [];
        const chosen = objectAt(vars.chosen, frame)?.items || [];
        scene.append(el('h4', '', 'Intervals · position shows time (0 → 5); green = chosen'));
        intervals.forEach(ref => {
          const [start, finish] = objectAt(ref, frame)?.items || [];
          const row = el('div', 'trace-interval'); row.append(el('span', '', `[${start},${finish})`));
          const track = el('div', 'trace-interval-track'), bar = el('div', 'trace-interval-bar', `${start}–${finish}`);
          bar.style.left = (start / 5 * 100) + '%'; bar.style.width = ((finish - start) / 5 * 100) + '%';
          bar.classList.toggle('is-chosen', chosen.some(item => same(objectAt(item, frame)?.items, [start, finish])));
          bar.classList.toggle('is-testing', vars.start === start && vars.finish === finish);
          track.append(bar); row.append(track); scene.append(row);
        });
      }
      const directObjects = [...new Set(Object.values(vars).filter(v => v?.ref).map(v => v.ref))];
      directObjects.forEach(id => {
        const object = frame.objects[id];
        if (object.fields || (diagram && names[id]?.includes('graph'))) return;
        // The large parent graph is drawn above; show its working containers here.
        scene.append(renderObject(object, frame, vars, names, previous?.objects[id]));
      });
      if (!scene.childNodes.length) scene.append(el('span', 'trace-empty', 'Step into the example to see data appear here. Function definitions do not create their working data yet.'));
      memoryBody.replaceChildren(...Object.values(frame.objects).map(object => renderObject(object, frame, vars, names, previous?.objects[object.id], true)));
      if (!reducedMotion.matches) {
        scene.querySelectorAll('[data-key]').forEach(node => {
          if (typeof node.animate !== 'function') return;
          const old = oldPositions.get(node.dataset.key), rect = node.getBoundingClientRect();
          if (old && (old.left !== rect.left || old.top !== rect.top)) node.animate([{transform: `translate(${old.left - rect.left}px,${old.top - rect.top}px)`}, {transform: 'translate(0,0)'}], {duration: 400, easing: 'ease-out'});
          else if (!old) node.animate([{opacity: 0, transform: 'translateY(-7px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 320, easing: 'ease-out'});
        });
      }
    }
    play.setAttribute('aria-pressed', 'false'); render();
  }
  // The decorative terminal has a compact launcher into its own complete trace.
  const hero = document.querySelector('.hero');
  const heroDetails = el('details', 'trace-hero-example');
  heroDetails.id = 'intro-code-animation';
  heroDetails.append(el('summary', '', '▶ Animate the introductory Python example'));
  const heroCard = el('div', 'code-card');
  const heroTop = el('div', 'code-top', traces[0].title);
  const heroPre = el('pre'); heroPre.dataset.copy = ''; heroPre.append(el('code', '', traces[0].code));
  heroCard.append(heroTop, heroPre); heroDetails.append(heroCard); hero.after(heroDetails);
  const launch = el('button', 'trace-hero-launch', '▶ Animate this code'); launch.type = 'button'; launch.setAttribute('aria-controls', heroDetails.id); launch.setAttribute('aria-expanded', 'false');
  launch.addEventListener('click', () => { heroDetails.open = true; heroDetails.scrollIntoView({behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start'}); });
  heroDetails.addEventListener('toggle', () => launch.setAttribute('aria-expanded', String(heroDetails.open)));
  document.querySelector('.hero-terminal').append(launch);
  const cards = [heroCard, ...document.querySelectorAll('.section .code-card')];
  if (cards.length !== traces.length) throw new Error('Code animation coverage mismatch. Rebuild the tutorial traces.');
  cards.forEach((card, number) => {
    if (card.querySelector('pre').textContent.trim() !== traces[number].code.trim()) throw new Error(`Animation source mismatch: ${traces[number].title}`);
    makePlayer(card, traces[number], number);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && playing) playing.pause(); });
  window.addEventListener('dsa-playback-start', () => { if (playing) playing.pause(); });
  window.addEventListener('beforeprint', () => { if (playing) playing.pause(); });
})();
