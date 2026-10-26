/* Definition-first stories. Embedded by build_dsa_animations.py for offline use. */
(() => {
  'use strict';
  const tile = (id, value, caption = '', tone = '') => ({id, value: String(value), caption, tone});
  const lane = (label, items, extra = {}) => ({label, items, ...extra});
  const step = (title, explain, lanes = [], extra = {}) => ({title, explain, lanes, ...extra});
  const numbers = (values, prefix = 'v', active = -1, captions = {}) => values.map((v, i) => tile(prefix + i, v, captions[i] || `index ${i}`, i === active ? 'focus' : ''));
  const node = (id, value, x, y, tone = '', caption = '') => ({id, value: String(value), x, y, tone, caption});
  const edge = (from, to, label = '', arrow = false, tone = '') => ({from, to, label, arrow, tone});
  const lesson = (id, chapter, anchor, title, definition, notice, steps) => ({id, chapter, anchor, title, definition, notice, steps});
  const lessons = [];
  const add = (...args) => lessons.push(lesson(...args));

  add('structure-algorithm', 'foundations', {definition: true}, 'Data structure + algorithm',
    'A data structure organizes values and the operations on them. An algorithm is a finite sequence of precise steps that transforms an input into an answer.',
    'The boxes are the organized data. The moving inspection marker is the algorithm acting on it.', [
      step('Give the data a structure', 'Store the songs in an ordered playlist. Each position has an index.', [lane('Playlist · ordered data', numbers(['Intro', 'Lesson', 'Review'], 'song'))]),
      step('State the task', 'Input: this playlist and the title Review. Desired output: its position.', [lane('Playlist', numbers(['Intro', 'Lesson', 'Review'], 'song')), lane('Target', [tile('target', 'Review')])]),
      step('Follow a precise rule', 'Start at index 0. Compare Intro with Review: different, so move one position right.', [lane('Playlist', numbers(['Intro', 'Lesson', 'Review'], 'song', 0)), lane('Target', [tile('target', 'Review')])]),
      step('Repeat the rule', 'Index 1 contains Lesson, so keep going. The same rule applies without guessing.', [lane('Playlist', numbers(['Intro', 'Lesson', 'Review'], 'song', 1)), lane('Target', [tile('target', 'Review')])]),
      step('Produce an answer and stop', 'Index 2 contains Review. Return 2 and stop. If the end were reached first, return not found.', [lane('Playlist', numbers(['Intro', 'Lesson', 'Review'], 'song', 2)), lane('Output', [tile('answer', 2, 'matching index', 'done')])])
    ]);
  add('growth', 'foundations', {heading: 'Big O:'}, 'Big O · watch work grow',
    'Big O describes an asymptotic upper bound on how work grows with input size. State the case and cost model; it is not a stopwatch reading.',
    'These are illustrative operation-count models. Doubling n affects different growth rates very differently.',
    [2, 4, 8].map(n => step(`Input size n = ${n}`, `Compare the counts, then double the input. A full scan has n visits; a full pair grid has n × n cells.`, [
      lane('Input items', numbers(Array.from({length: n}, (_, i) => i + 1), 'input')),
      lane('Illustrative work counts', [['O(1)', 1], ['O(log n)', Math.ceil(Math.log2(n))], ['O(n)', n], ['O(n log n)', Math.ceil(n * Math.log2(n))], ['O(n²)', n * n], ['O(2ⁿ)', 2 ** n]].map(([label, count], i) => tile('cost' + i, count, label, i === 4 ? 'focus' : '')))
    ], {equation: `${n} × ${n} = ${n * n} pairs`, grid: {size: n}})));

  const coreAnchor = {heading: 'Lists, tuples, dictionaries, and sets'};
  add('list-definition', 'collections', coreAnchor, 'List · an ordered row of references',
    'A Python list is a mutable sequence: positions have indices, order matters, and duplicates are allowed.',
    'The index labels stay attached to positions. Appending extends the row; assignment changes one position.', [
      step('Order gives each item a position', 'Indexing starts at zero: items[1] is 7.', [lane('items', numbers([4, 7, 4], 'list', 1))]),
      step('Append at the right', 'append(9) adds a new final position. The repeated 4 is allowed.', [lane('items', numbers([4, 7, 4, 9], 'list', 3))]),
      step('Change an existing position', 'items[1] = 2 replaces the reference in index 1. The list is mutable.', [lane('items', numbers([4, 2, 4, 9], 'list', 1))]),
      step('Insert at the front', 'insert(0, 8) shifts every existing reference one position right. That shifting costs O(n).', [lane('items', [tile('inserted', 8, 'index 0', 'focus'), ...[4, 2, 4, 9].map((v, i) => tile('list' + i, v, `index ${i + 1}`))])])
    ]);
  add('tuple-definition', 'collections', coreAnchor, 'Tuple · a fixed record',
    'A tuple is an immutable sequence. Its positions cannot be reassigned after creation; objects referenced inside it may still be mutable.',
    'Unpacking copies the references into names. It does not edit the tuple.', [
      step('Group related fields', 'A point is one record containing the ordered coordinates 3 and 8.', [lane('point · tuple (3, 8)', [tile('tx', 3, 'position 0 · fixed'), tile('ty', 8, 'position 1 · fixed')])]),
      step('Read by position', 'point[0] reads 3. Reading does not change either slot.', [lane('point', [tile('tx', 3, 'read position 0', 'focus'), tile('ty', 8, 'position 1 · fixed')])]),
      step('Unpack into names', 'x, y = point binds x to 3 and y to 8. The original tuple stays the same.', [lane('point', [tile('tx', 3, 'fixed'), tile('ty', 8, 'fixed')]), lane('Names', [tile('x', 'x = 3'), tile('y', 'y = 8')])]),
      step('Slots stay fixed', 'Trying point[0] = 9 raises TypeError. Immutability protects these slots, rather than freezing every possible nested object.', [lane('point · unchanged', [tile('tx', 3, 'assignment blocked', 'reject'), tile('ty', 8, 'fixed')])])
    ]);
  add('dict-definition', 'collections', coreAnchor, 'Dictionary · look up by a key',
    'A dictionary maps each unique hashable key to a value. Assigning an existing key replaces its value.',
    'Think of labeled drawers: use the label Ada, rather than scanning positions to find Ada’s score.', [
      step('Create labeled entries', 'Ada maps to 95 and Lin maps to 88. The keys are the lookup labels.', [lane('grades', [tile('ada', 'Ada → 95', 'key → value'), tile('lin', 'Lin → 88', 'key → value')])]),
      step('Add a new key', 'grades["Sam"] = 91 creates one new entry.', [lane('grades', [tile('ada', 'Ada → 95'), tile('lin', 'Lin → 88'), tile('sam', 'Sam → 91', 'new entry', 'focus')])]),
      step('Retrieve by key', 'grades["Ada"] returns 95. Dictionary lookup is O(1) on average under the constant-cost hashing model.', [lane('grades', [tile('ada', 'Ada → 95', 'lookup Ada', 'focus'), tile('lin', 'Lin → 88'), tile('sam', 'Sam → 91')]), lane('Answer', [tile('lookup', 95, 'returned value', 'done')])]),
      step('Update the same key', 'grades["Ada"] = 97 replaces Ada’s value. There is still only one Ada entry.', [lane('grades', [tile('ada', 'Ada → 97', 'updated', 'focus'), tile('lin', 'Lin → 88'), tile('sam', 'Sam → 91')])])
    ]);
  add('set-definition', 'collections', coreAnchor, 'Set · membership without duplicates',
    'A set stores distinct hashable values. Membership matters; there is no positional ordering or integer indexing.',
    'The screen positions are just a drawing. A set does not give its members index numbers.', [
      step('Start empty', 'set() creates an empty set. {} would create a dictionary.', [lane('visited', [])]),
      step('Add A', 'After add("A"), A is a member.', [lane('visited', [tile('setA', 'A', 'member', 'focus')])]),
      step('Add A again', 'A is already present. Adding it again leaves the set unchanged.', [lane('visited', [tile('setA', 'A', 'still just one A', 'done')])]),
      step('Add a different member', 'Add B. Now there are two distinct members, without a defined first or last member.', [lane('visited', [tile('setB', 'B', 'member', 'focus'), tile('setA', 'A', 'member')])]),
      step('Ask a membership question', '"A" in visited is True. "C" in visited is False.', [lane('visited', [tile('setB', 'B', 'member'), tile('setA', 'A', 'present', 'focus')]), lane('Answers', [tile('hasA', 'A? True', '', 'done'), tile('hasC', 'C? False')])])
    ]);
  add('frequency-definition', 'collections', {code: 'Worked example · count words'}, 'Frequency counting · remember how many',
    'A frequency map associates each distinct item with the number of times it has appeared.',
    'The same word updates the same dictionary entry, so the dictionary summarizes all earlier words.', [
      step('Before reading', 'No words have been counted yet.', [lane('Input', numbers(['red', 'blue', 'red'], 'word')), lane('counts', [])]),
      step('Read red', 'A missing count starts at zero; add one.', [lane('Input', numbers(['red', 'blue', 'red'], 'word', 0)), lane('counts', [tile('countRed', 'red → 1', '', 'focus')])]),
      step('Read blue', 'Create a separate entry for the new word.', [lane('Input', numbers(['red', 'blue', 'red'], 'word', 1)), lane('counts', [tile('countRed', 'red → 1'), tile('countBlue', 'blue → 1', '', 'focus')])]),
      step('Read red again', 'Reuse the red entry: 1 + 1 = 2.', [lane('Input', numbers(['red', 'blue', 'red'], 'word', 2)), lane('counts', [tile('countRed', 'red → 2', '', 'done'), tile('countBlue', 'blue → 1')])])
    ]);
  const memoryDiagram = (copied, changed) => ({
    nodes: [node('a', 'a', 50, 35), node('b', 'b', 50, 110), node('outer1', 'outer list #1', 220, 70), node('inner1', changed ? '[1, 9]' : '[1]', 430, 55, changed ? 'focus' : ''), node('inner2', '[2]', 430, 145), ...(copied ? [node('c', 'copy', 50, 200), node('outer2', 'outer list #2', 220, 190)] : [])],
    edges: [edge('a', 'outer1', '', true), edge('b', 'outer1', '', true), edge('outer1', 'inner1', 'slot 0', true), edge('outer1', 'inner2', 'slot 1', true), ...(copied ? [edge('c', 'outer2', '', true), edge('outer2', 'inner1', 'slot 0', true), edge('outer2', 'inner2', 'slot 1', true)] : [])]
  });
  add('references-definition', 'collections', {heading: 'References and shallow copies'}, 'References · names point to objects',
    'Assignment binds a name to an object. Aliases share one object; a shallow copy creates a new outer container and shares its nested objects.',
    'Follow the arrows: changing a shared inner list is visible through both outer lists.', [
      step('Two names, one outer list', 'a = [[1], [2]]; b = a. Both names point at outer list #1.', [], {diagram: memoryDiagram(false, false)}),
      step('Copy just the outside', 'copy = a.copy() creates outer list #2. Its slots still point to the original inner lists.', [], {diagram: memoryDiagram(true, false)}),
      step('Mutate a shared inner object', 'copy[0].append(9) changes the same inner list reached by a[0] and b[0]. All those paths now see [1, 9].', [], {diagram: memoryDiagram(true, true)})
    ]);

  const arrivals = ['Ada', 'Lin', 'Sam'];
  const customer = (name, prefix, caption = '', tone = '') => tile(prefix + name, name, caption, tone);
  const containers = (count, popped = false, dequeued = false) => [
    lane('Stack · bottom → top', arrivals.slice(0, count - (popped ? 1 : 0)).map((n, j, a) => customer(n, 's', j === a.length - 1 ? 'top' : 'earlier arrival')), {layout: 'stack', area: 'stack'}),
    lane('Stack · removed', popped ? [customer('Sam', 's', 'last in → first out', 'done')] : [], {layout: 'tray', area: 'stack-out'}),
    lane('Queue · front → back', arrivals.slice(dequeued ? 1 : 0, count).map((n, j) => customer(n, 'q', j === 0 ? 'front · next to leave' : 'waiting')), {layout: 'queue', area: 'queue'}),
    lane('Queue · removed', dequeued ? [customer('Ada', 'q', 'first in → first out', 'done')] : [], {layout: 'tray', area: 'queue-out'})
  ];
  add('stack-queue-definition', 'linear-structures', {definition: true}, 'Stack vs queue · same arrivals, different exits',
    'A stack removes the most recently added item (LIFO). A queue removes the earliest added item (FIFO). These are rules for behavior, regardless of implementation.',
    'The stack behaves like plates: add and remove at the top. The queue behaves like a checkout line: join at the back, leave at the front.', [
      step('Two different shapes, two different rules', 'Ada, Lin, then Sam will arrive at both containers in the same order.', containers(0), {summary: 'Stack: empty. Queue: empty.'}),
      ...arrivals.map((name, i) => step(`Arrival ${i + 1}: ${name}`, `Place ${name} on top of the stack. In the queue, ${name} joins the back of the line.`, containers(i + 1), {action: `push(${name}) · enqueue(${name})`, summary: `Stack top: ${name}. Queue front: Ada; back: ${name}.`})),
      step('Pop from the top of the stack', 'Sam was added last and is removed first. Ada and Lin stay in their original stack positions.', containers(3, true), {action: 'stack.pop() → Sam', summary: 'Stack: Ada, Lin (top). Removed: Sam. Queue unchanged.'}),
      step('Dequeue from the front of the line', 'Ada arrived first and leaves first. Lin is now at the front; Sam still waits behind Lin.', containers(3, true, true), {action: 'queue.popleft() → Ada', summary: 'Stack removed Sam. Queue removed Ada. Same arrivals, different exits.'})
    ]);
  const linkedDiagram = (phase, current) => ({
    kind: 'linked',
    nodes: [node('head', 'head', 55, 160), ...(phase ? [{...node('n10', 10, 175, 65, current === 10 || current === undefined ? 'focus' : '', 'new node'), kind: 'link'}] : []), {...node('n20', 20, 310, 160, current === 20 ? 'focus' : '', 'value | next'), kind: 'link'}, {...node('n30', 30, 440, 160, current === 30 ? 'focus' : '', 'value | next'), kind: 'link'}, node('null', 'None', 550, 160, current === null ? 'done' : '')],
    edges: [edge('head', phase >= 3 ? 'n10' : 'n20', '', true), ...(phase >= 2 ? [edge('n10', 'n20', 'next', true, phase === 2 ? 'done' : '')] : []), edge('n20', 'n30', 'next', true), edge('n30', 'null', 'next', true)],
    pointers: current !== undefined ? [{id: 'current', label: 'current', target: current === null ? 'null' : 'n' + current}] : []
  });
  add('linked-definition', 'linear-structures', {heading: 'Linked lists:'}, 'Linked list · follow the arrows',
    'A singly linked list is a chain of nodes. Each node stores a value and a next reference; head identifies the first node, and None ends the chain.',
    'The drawing has no array indices. To reach 30, follow next links; prepending changes only the new node and head.', [
      step('Start with the existing chain', 'head points to 20, which points to 30. Each node has a value compartment and a next compartment.', [], {diagram: linkedDiagram(0), summary: 'head → 20 → 30 → None'}),
      step('Allocate a separate node', 'Create node 10 in a free location. The existing head and links have not changed. The blank next compartment has not been connected yet.', [], {diagram: linkedDiagram(1), action: 'new = Node(10)', summary: 'New node: 10. Existing chain unchanged.'}),
      step('Connect the new node to the old head', 'Set new.next to the node holding 20. Keep head pointing to 20 until the new link is ready.', [], {diagram: linkedDiagram(2), action: 'new.next = head', summary: '10.next → 20; head still → 20.'}),
      step('Redirect head', 'Change only the head reference to point at 10. None of the allocated nodes moves.', [], {diagram: linkedDiagram(3), action: 'head = new', summary: 'head → 10 → 20 → 30 → None'}),
      step('Start a traversal', 'Bind current to the same node as head. The current arrow is a reference, not a node moving through memory.', [], {diagram: linkedDiagram(3, 10), action: 'current = head', summary: 'current → 10'}),
      step('Follow one link', 'current.next refers to 20. Move the current arrow to that node.', [], {diagram: linkedDiagram(3, 20), action: 'current = current.next', summary: 'current: 10 → 20'}),
      step('Follow the next link', 'Advance the current reference to 30. The chain remains intact.', [], {diagram: linkedDiagram(3, 30), action: 'current = current.next', summary: 'current: 20 → 30'}),
      step('Reach the end', '30.next is None. The current reference becomes None, so traversal stops.', [], {diagram: linkedDiagram(3, null), action: 'current = current.next', summary: 'current → None; stop.'})
    ]);

  const treeNodes = [[8, 300, 35], [3, 160, 115], [10, 440, 115], [1, 80, 200], [6, 235, 200], [14, 515, 200]];
  const treeEdges = [[8, 3], [8, 10], [3, 1], [3, 6], [10, 14]];
  const treeDiagram = (focus, visited = []) => ({nodes: treeNodes.map(([v, x, y]) => node('t' + v, v, x, y, v === focus ? 'focus' : visited.includes(v) ? 'done' : '', v === 8 ? 'root' : '')), edges: treeEdges.map(([a, b]) => edge('t' + a, 't' + b))});
  add('tree-definition', 'trees-graphs', {heading: 'Trees and binary search trees'}, 'Tree + BST · hierarchy with a search rule',
    'A rooted tree has parent–child links without cycles. A binary tree allows at most two children per node. A BST additionally orders every left subtree below its node and every right subtree above it.',
    'Being a binary tree alone does not imply sorted values. The BST rule is what makes branch elimination valid.', [
      step('See the hierarchy', '8 is the root. 3 and 10 are its children. 1, 6, and 14 are leaves; no link leads back to an ancestor.', [], {diagram: treeDiagram(8)}),
      step('Find target 6: compare with 8', '6 < 8. Every value in the right subtree is too large, so go left.', [], {diagram: treeDiagram(8), equation: '6 < 8 → left subtree'}),
      step('Compare with 3', '6 > 3. Move right inside this subtree.', [], {diagram: treeDiagram(3, [8]), equation: '6 > 3 → right child'}),
      step('Find 6', '6 equals the current node. Stop after visiting just one path.', [], {diagram: treeDiagram(6, [8, 3]), equation: '8 → 3 → 6 · found'}),
      step('Read in sorted order', 'Inorder means left subtree, node, right subtree. On a BST this produces increasing values.', [lane('Inorder output', numbers([1, 3, 6, 8, 10, 14], 'inorder'))], {diagram: treeDiagram(null, [1, 3, 6, 8, 10, 14])})
    ]);
  const heapDiagram = (values, focus = -1) => ({nodes: values.map((v, i) => { const [x, y] = [[300, 35], [160, 115], [440, 115], [90, 205], [230, 205]][i]; return node('job' + v, v, x, y, i === focus ? 'focus' : '', `array index ${i}`); }), edges: values.slice(1).map((v, i) => edge('job' + values[Math.floor(i / 2)], 'job' + v))});
  add('heap-definition', 'trees-graphs', {heading: 'Heaps:'}, 'Min-heap · the smallest priority stays on top',
    'A binary min-heap is a complete binary tree with each parent no greater than its children. It supports retrieving the minimum without keeping the whole array sorted.',
    'Nodes fill levels from left to right. Only parent–child comparisons matter; sibling order is unrestricted.', [
      step('A valid min-heap', 'The array [1, 3, 2, 7] is a valid heap: 1 ≤ 3 and 2, and 3 ≤ 7. The array itself is not sorted.', [lane('Array', numbers([1, 3, 2, 7], 'heap-array'))], {diagram: heapDiagram([1, 3, 2, 7], 0)}),
      step('Add a new priority 0', 'Append at the next free leaf. The tree stays complete, but 0 is smaller than its parent 3.', [], {diagram: heapDiagram([1, 3, 2, 7, 0], 4)}),
      step('Sift upward once', 'Swap 0 with parent 3. Now compare 0 with its new parent 1.', [], {diagram: heapDiagram([1, 0, 2, 7, 3], 1)}),
      step('Restore heap order', 'Swap 0 with 1. Every parent is again no greater than its children. The minimum is at array index 0.', [lane('Array', numbers([0, 1, 2, 7, 3], 'heap-array', 0))], {diagram: heapDiagram([0, 1, 2, 7, 3], 0)})
    ]);
  const graphPositions = {A: [95, 110], B: [250, 40], C: [250, 190], D: [440, 40], E: [440, 190]};
  const graphPairs = [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D'], ['C', 'E']];
  const graphDiagram = (focus = '', visited = [], path = [], pairs = graphPairs, frontier = [], distances = {}) => ({nodes: Object.entries(graphPositions).map(([v, [x, y]]) => node('g' + v, v, x, y, v === focus ? 'focus' : frontier.includes(v) ? 'frontier' : visited.includes(v) ? 'done' : '', distances[v] !== undefined ? `distance ${distances[v]}` : '')), edges: pairs.map(([a, b]) => edge('g' + a, 'g' + b, '', false, path.some((v, i) => i && ((v === a && path[i - 1] === b) || (v === b && path[i - 1] === a))) ? 'done' : ''))});
  add('graph-definition', 'trees-graphs', {heading: 'Graphs:'}, 'Graph · vertices connected by edges',
    'A graph models entities as vertices and relationships as edges. It can contain cycles and multiple routes; edges may have directions or weights.',
    'A graph can express several routes between the same places. An adjacency list records each vertex’s neighbors.', [
      step('Start with vertices', 'These five locations are the vertices. With no edges yet, none is connected to another.', [], {diagram: graphDiagram('', [], [], [])}),
      step('Connect neighboring places', 'Draw undirected edges for roads that can be traveled both ways.', [], {diagram: graphDiagram()}),
      step('Read an adjacency list', 'A connects to B and C, so graph["A"] is ["B", "C"].', [lane('Neighbors of A', [tile('neighborB', 'B'), tile('neighborC', 'C')])], {diagram: graphDiagram('A', ['B', 'C'])}),
      step('Notice a cycle', 'A → B → D → C → A is a cycle. A visited set prevents repeatedly exploring those vertices.', [], {diagram: graphDiagram('A', ['B', 'C', 'D'], ['A', 'B', 'D', 'C', 'A']), equation: 'A → B → D → C → A'})
    ]);
  const neighbors = {A: ['B', 'C'], B: ['A', 'D'], C: ['A', 'D', 'E'], D: ['B', 'C'], E: ['C']};
  const traversalSteps = [];
  for (const mode of ['BFS', 'DFS']) {
    const frontier = ['A'], seen = new Set(['A']), order = [], distances = {A: 0};
    const snapshot = (title, explain, focus, action, codeFocus) => step(title, explain, [lane(mode === 'BFS' ? 'Queue · front → back' : 'Stack · bottom → top', frontier.map(v => tile('frontier' + v, v, mode === 'BFS' ? `distance ${distances[v]}` : 'waiting')), {layout: mode === 'BFS' ? 'queue' : 'stack'}), lane('Visit order', order.map(v => tile('order' + v, v, '', 'done')))], {mode, codeFocus: codeFocus || (title.includes('start at') ? ['seen =', mode === 'BFS' ? 'queue =' : 'stack =', 'order ='] : title.includes('discover') ? ['seen.add(', mode === 'BFS' ? 'queue.append(' : 'stack.append('] : ['node =', 'order.append(']), diagram: graphDiagram(focus, order, [], graphPairs, frontier, mode === 'BFS' ? distances : {}), action, summary: `${mode} frontier: ${frontier.join(', ') || 'empty'}. Visited: ${order.join(' → ') || 'none'}.`});
    traversalSteps.push(snapshot(`${mode}: start at A`, mode === 'BFS' ? 'BFS uses a FIFO queue. Blue nodes are discovered and waiting; green nodes have been visited. Distance counts edges from A.' : 'DFS uses a LIFO stack. The next node to visit is at the top.', '', `${mode === 'BFS' ? 'enqueue' : 'push'}(A)`));
    while (frontier.length) {
      const current = mode === 'BFS' ? frontier.shift() : frontier.pop(); order.push(current);
      traversalSteps.push(snapshot(`${mode}: visit ${current}`, `Remove ${current} from the ${mode === 'BFS' ? 'queue front' : 'stack top'}. Inspect its neighbors next, one at a time.`, current, `${mode === 'BFS' ? 'dequeue' : 'pop'}() → ${current}`));
      const next = mode === 'BFS' ? neighbors[current] : [...neighbors[current]].reverse();
      next.forEach(v => { if (!seen.has(v)) {
        seen.add(v); frontier.push(v); distances[v] = distances[current] + 1;
        traversalSteps.push(snapshot(`${mode}: discover ${v} from ${current}`, `Mark ${v} as discovered immediately and add it at the ${mode === 'BFS' ? 'back of the queue' : 'top of the stack'}. Already discovered neighbors will be skipped.`, current, `${mode === 'BFS' ? 'enqueue' : 'push'}(${v})`));
      } });
    }
    traversalSteps.push(snapshot(`${mode}: traversal complete`, `The ${mode === 'BFS' ? 'queue' : 'stack'} is empty. Return the visit order: ${order.join(' → ')}.`, '', 'return order', ['return order']));
  }
  add('traversal-definition', 'trees-graphs', {code: 'Breadth-first search and iterative depth-first search'}, 'BFS vs DFS · choose how to explore',
    'Breadth-first search explores by increasing edge distance using a queue. Depth-first search follows a branch using a stack or recursive calls.',
    'Compare the visit orders on this graph. BFS guarantees shortest edge counts in an unweighted graph; DFS generally does not.', traversalSteps);
  lessons.at(-1).modes = ['BFS', 'DFS'].map(id => ({id, label: id === 'BFS' ? 'BFS · Queue' : 'DFS · Stack', start: traversalSteps.findIndex(frame => frame.mode === id), end: traversalSteps.findLastIndex(frame => frame.mode === id)}));

  add('linear-definition', 'search-sort', {heading: 'Linear search:'}, 'Linear search · inspect one item at a time',
    'Linear search compares successive items with a target until it finds a match or reaches the end. The input does not need to be sorted.',
    'One unsuccessful comparison removes only one candidate. Finding the last item can require n comparisons.', [
      ...[0, 1, 2].map(i => step(i === 2 ? 'Match: return index 2' : `Inspect index ${i}`, `${[9, 2, 7][i]} ${i === 2 ? '=' : '≠'} 7. ${i === 2 ? 'Stop with a valid matching index.' : 'Advance to the next position.'}`, [lane('Unsorted input · target 7', numbers([9, 2, 7], 'linear', i))])),
      step('What if it is absent?', 'For target 5, every item differs. Reaching the end proves absence; return -1.', [lane('Input · all inspected', [9, 2, 7].map((v, i) => tile('linear' + i, v, 'not 5', 'dim'))), lane('Answer', [tile('absent', -1, 'not found')])])
    ]);
  const binaryValues = [2, 4, 7, 9, 12, 15, 18];
  const binaryRow = (low, high, mid = -1, found = false) => lane('Sorted input · target 12', binaryValues.map((v, i) => tile('binary' + i, v, '', i < low || i > high ? 'dim' : i === mid ? found ? 'done' : 'focus' : '')), {layout: 'indexed', pointers: {low, high, ...(mid >= 0 ? {mid} : {})}, range: [low, high]});
  add('binary-definition', 'search-sort', {heading: 'Binary search:'}, 'Binary search · discard a whole half',
    'Binary search finds a target in sorted data by comparing the middle candidate, then keeping only the half that can still contain the target.',
    'The array stays still. Only the low, high, and mid markers move. The blue bracket encloses the remaining candidates.', [
      step('Begin with all candidates', 'Target: 12. Sorted order lets us eliminate a whole range after each comparison.', [binaryRow(0, 6)], {action: 'low = 0; high = 6', summary: 'Candidates: indices 0–6.'}),
      step('Inspect index 3', 'mid = (0 + 6) // 2 = 3. The value 9 is smaller than 12.', [binaryRow(0, 6, 3)], {action: 'compare 9 < 12', summary: '9 is too small; everything to its left is also too small.'}),
      step('Move low past the midpoint', 'Discard indices 0 through 3. The values stay in their slots so you can see exactly which half was eliminated.', [binaryRow(4, 6)], {action: 'low = mid + 1 = 4', summary: 'Candidates: indices 4–6.'}),
      step('Inspect index 5', 'mid = (4 + 6) // 2 = 5. The value 15 is larger than 12.', [binaryRow(4, 6, 5)], {action: 'compare 15 > 12', summary: '15 is too large; everything to its right is also too large.'}),
      step('Move high before the midpoint', 'Discard indices 5 and 6. Only index 4 remains.', [binaryRow(4, 4)], {action: 'high = mid - 1 = 4', summary: 'Candidate: index 4.'}),
      step('Find the target', 'low, mid, and high now all identify index 4. Its value is 12, so return 4.', [binaryRow(4, 4, 4, true)], {action: 'return 4', summary: 'Found 12 at index 4.'})
    ]);
  const insertionRow = (items) => lane('Row · fixed index slots', items, {layout: 'cards'});
  const held = (value) => lane('Held card · outside the row', value ? [tile('i' + value, value, 'key', 'focus')] : [tile('held-empty', '—', 'no card held', 'dim')], {layout: 'held'});
  const card = (v, caption = '', tone = '') => tile('i' + v, v, caption, tone);
  const gap = () => tile('hole', '□', 'gap to fill', 'gap');
  add('insertion-definition', 'search-sort', {heading: 'Insertion sort:'}, 'Insertion sort · lift a card, make room, insert',
    'Insertion sort grows a sorted prefix by taking the next item, shifting larger items right, and inserting the item into the gap.',
    'The held card has its own space. A dashed gap shows where to insert it; index labels stay attached to slots.', [
      step('Start with one sorted card', '7 is a sorted prefix of length one. The next card to insert is 3.', [insertionRow([card(7, 'sorted prefix', 'done'), card(3, 'next card', 'focus'), card(5, 'unprocessed')]), held()], {action: 'i = 1', summary: 'Row: [7, 3, 5]. Held: none.'}),
      step('Lift 3 out of the row', 'Keep key = 3 safely aside. Treat its old slot as a gap while making room.', [insertionRow([card(7, 'sorted prefix', 'done'), gap(), card(5)]), held(3)], {action: 'key = 3', summary: 'Row: [7, □, 5]. Held: 3.'}),
      step('Compare the card on the left', '7 > 3, so 7 must move right before we can insert 3.', [insertionRow([card(7, '7 > key 3', 'focus'), gap(), card(5)]), held(3)], {action: 'compare 7 > 3', summary: '7 blocks the insertion position.'}),
      step('Shift 7 one slot right', 'The held 3 stays aside. Moving 7 opens a gap at index 0.', [insertionRow([gap(), card(7, 'shifted right', 'focus'), card(5)]), held(3)], {action: 'shift 7: index 0 → 1', summary: 'Row: [□, 7, 5]. Held: 3.'}),
      step('Insert 3 into the gap', 'There is no earlier card to compare. Place 3 at index 0. The sorted prefix is now [3, 7].', [insertionRow([card(3, 'sorted', 'done'), card(7, 'sorted', 'done'), card(5, 'next card', 'focus')]), held()], {action: 'insert key at index 0', summary: 'Row: [3, 7, 5]. Held: none.'}),
      step('Lift the next card, 5', 'Keep 5 aside. Now find its place within the sorted prefix [3, 7].', [insertionRow([card(3, 'sorted', 'done'), card(7, 'sorted', 'done'), gap()]), held(5)], {action: 'key = 5', summary: 'Row: [3, 7, □]. Held: 5.'}),
      step('Compare 7 with 5', '7 > 5, so shift 7 one slot right.', [insertionRow([card(3, 'sorted', 'done'), card(7, '7 > key 5', 'focus'), gap()]), held(5)], {action: 'compare 7 > 5', summary: '7 must move right.'}),
      step('Move the gap left', '7 moves from index 1 to index 2. The gap is now between 3 and 7.', [insertionRow([card(3, 'sorted', 'done'), gap(), card(7, 'shifted right', 'focus')]), held(5)], {action: 'shift 7: index 1 → 2', summary: 'Row: [3, □, 7]. Held: 5.'}),
      step('Compare 3 with 5', '3 ≤ 5, so stop shifting. The gap immediately after 3 is the correct insertion position.', [insertionRow([card(3, '3 ≤ key 5', 'focus'), gap(), card(7)]), held(5)], {action: 'compare 3 ≤ 5; stop shifting', summary: 'Insert 5 between 3 and 7.'}),
      step('Insert 5; sorting is complete', 'Fill the gap with the held card. Every card is now in the sorted prefix.', [insertionRow([card(3, 'sorted', 'done'), card(5, 'sorted', 'done'), card(7, 'sorted', 'done')]), held()], {action: 'insert key at index 1', summary: 'Row: [3, 5, 7]. Held: none.'})
    ]);
  const mergeTree = phase => ({
    nodes: [node('merge-root', phase === 'done' ? '[2, 3, 5, 7]' : '[7, 3, 5, 2]', 300, 35, ['root', 'merge'].includes(phase) ? 'focus' : phase === 'done' ? 'done' : '', 'whole problem'), node('merge-left', ['left-done', 'right', 'right-done', 'merge', 'done'].includes(phase) ? '[3, 7]' : '[7, 3]', 155, 125, phase === 'left' || phase === 'halves' ? 'focus' : ['left-done', 'right', 'right-done', 'merge', 'done'].includes(phase) ? 'done' : phase === 'root' ? 'dim' : '', 'left half'), node('merge-right', ['right-done', 'merge', 'done'].includes(phase) ? '[2, 5]' : '[5, 2]', 445, 125, phase === 'right' || phase === 'halves' ? 'focus' : ['right-done', 'merge', 'done'].includes(phase) ? 'done' : phase === 'root' ? 'dim' : '', 'right half'), ...[7, 3, 5, 2].map((v, i) => node('merge-leaf' + i, '[' + v + ']', [85, 225, 375, 515][i], 215, phase === 'leaves' ? 'focus' : ['root', 'halves'].includes(phase) ? 'dim' : 'done'))],
    edges: [['merge-root', 'merge-left'], ['merge-root', 'merge-right'], ['merge-left', 'merge-leaf0'], ['merge-left', 'merge-leaf1'], ['merge-right', 'merge-leaf2'], ['merge-right', 'merge-leaf3']].map(([a, b]) => ['root', 'halves', 'leaves'].includes(phase) ? edge(a, b, '', true) : edge(b, a, '', true)),
    label: ['root', 'halves', 'leaves'].includes(phase) ? 'Divide ↓ into smaller problems' : 'Combine ↑ sorted answers'
  });
  const mergeRuns = (left, right, output, active = []) => [
    lane('Combined output', output.map(v => tile('merge' + v, v, 'placed', 'done')), {layout: 'run', capacity: 4}),
    lane('Left · sorted run', left.map(v => tile('merge' + v, v, 'next candidate', active.includes(v) ? 'focus' : '')), {layout: 'run', capacity: 2}),
    lane('Right · sorted run', right.map(v => tile('merge' + v, v, 'next candidate', active.includes(v) ? 'focus' : '')), {layout: 'run', capacity: 2})
  ];
  const mergeSteps = [
    step('Begin with the whole problem', 'Keep this split diagram visible throughout the algorithm. Arrows first point down while dividing, then up while combining.', [], {diagram: mergeTree('root'), action: 'sort([7, 3, 5, 2])', summary: 'Unsorted input: [7, 3, 5, 2].'}),
    step('Split into two halves', 'Create left [7, 3] and right [5, 2]. Neither half is sorted yet.', [], {diagram: mergeTree('halves'), action: 'divide into left and right halves', summary: '[7, 3] | [5, 2]'}),
    step('Reach one-card base cases', 'Split each half again. Every singleton is already sorted.', [], {diagram: mergeTree('leaves'), action: 'divide until each group has one item', summary: '[7] | [3] | [5] | [2]'}),
    step('Compare the left singletons', 'Compare 7 and 3. The smaller front card is 3.', mergeRuns([7], [3], [], [7, 3]), {diagram: mergeTree('left'), action: 'compare 7 and 3', summary: 'Merging [7] and [3]. Output: [].'}),
    step('Place 3 first', 'Take 3 from the right run and put it in the output. The right run is now empty.', mergeRuns([7], [], [3]), {diagram: mergeTree('left'), action: 'take 3 → output', summary: 'Left: [7]. Right: []. Output: [3].'}),
    step('Copy the remaining 7', 'Only the left run has an item left. Copy its tail without another comparison.', mergeRuns([], [], [3, 7]), {diagram: mergeTree('left-done'), action: 'append remaining 7', summary: 'Sorted left half: [3, 7].'}),
    step('Compare the right singletons', 'Now merge [5] and [2]. The smaller front card is 2.', mergeRuns([5], [2], [], [5, 2]), {diagram: mergeTree('right'), action: 'compare 5 and 2', summary: 'Merging [5] and [2]. Output: [].'}),
    step('Place 2 first', 'Take 2 into the output. The right singleton run becomes empty.', mergeRuns([5], [], [2]), {diagram: mergeTree('right'), action: 'take 2 → output', summary: 'Left: [5]. Right: []. Output: [2].'}),
    step('Copy the remaining 5', 'The second sorted half is [2, 5]. Both halves are ready for the final merge.', mergeRuns([], [], [2, 5]), {diagram: mergeTree('right-done'), action: 'append remaining 5', summary: 'Sorted halves: [3, 7] | [2, 5].'}),
    step('Compare the two sorted fronts', 'Compare 3 from the left with 2 from the right. Only the front card of each run is a candidate.', mergeRuns([3, 7], [2, 5], [], [3, 2]), {diagram: mergeTree('merge'), action: 'compare 3 and 2', summary: 'Left: [3, 7]. Right: [2, 5]. Output: [].'}),
    step('Take 2', 'Move the smaller card, 2, into the output. The next right candidate is 5.', mergeRuns([3, 7], [5], [2]), {diagram: mergeTree('merge'), action: 'take 2 → output', summary: 'Left: [3, 7]. Right: [5]. Output: [2].'}),
    step('Compare 3 and 5', 'The left front is now smaller.', mergeRuns([3, 7], [5], [2], [3, 5]), {diagram: mergeTree('merge'), action: 'compare 3 and 5', summary: '3 ≤ 5; take from the left.'}),
    step('Take 3', 'Move 3 to the next output slot. The next left candidate is 7.', mergeRuns([7], [5], [2, 3]), {diagram: mergeTree('merge'), action: 'take 3 → output', summary: 'Left: [7]. Right: [5]. Output: [2, 3].'}),
    step('Compare 7 and 5', 'The right front is smaller.', mergeRuns([7], [5], [2, 3], [7, 5]), {diagram: mergeTree('merge'), action: 'compare 7 and 5', summary: '5 < 7; take from the right.'}),
    step('Take 5', 'The right run is now empty. The left tail can be copied.', mergeRuns([7], [], [2, 3, 5]), {diagram: mergeTree('merge'), action: 'take 5 → output', summary: 'Left: [7]. Right: []. Output: [2, 3, 5].'}),
    step('Append the remaining tail', 'Copy 7. All four values are now in sorted order, and the root problem is solved.', mergeRuns([], [], [2, 3, 5, 7]), {diagram: mergeTree('done'), action: 'append remaining 7', summary: 'Sorted result: [2, 3, 5, 7].'})
  ];
  add('merge-definition', 'search-sort', {heading: 'Merge sort:'}, 'Merge sort · split downward, combine upward',
    'Merge sort recursively sorts halves, then combines the sorted halves by repeatedly taking the smaller next item.',
    'The split tree stays in place. During a merge, compare the front cards, move just one, then compare again.', mergeSteps);
  add('quicksort-definition', 'search-sort', {heading: 'Merge sort:', afterTable: true}, 'Quicksort · partition around a pivot',
    'Quicksort chooses a pivot, partitions values into smaller and larger groups, and recursively sorts those groups. Equal values need a consistent partition rule.',
    'This conceptual three-way partition uses extra groups. In-place implementations use different partition mechanics; poor pivots can cause O(n²) time.', [
      step('Choose a pivot', 'Choose 5 from the unsorted values [7, 3, 5, 2, 5].', [lane('Input', [tile('q7', 7), tile('q3', 3), tile('q5a', 5, 'pivot', 'focus'), tile('q2', 2), tile('q5b', 5)])]),
      step('Partition', 'Put values below 5 on the left, equal values in the middle, and larger values on the right.', [lane('Less than 5', [tile('q3', 3), tile('q2', 2)]), lane('Equal to 5', [tile('q5a', 5, '', 'done'), tile('q5b', 5, '', 'done')]), lane('Greater than 5', [tile('q7', 7)])]),
      step('Recursively sort the outer groups', 'Sort [3, 2] into [2, 3]. The one-item group [7] is already sorted.', [lane('Less than 5 · sorted', [tile('q2', 2, '', 'done'), tile('q3', 3, '', 'done')]), lane('Equal to 5', [tile('q5a', 5), tile('q5b', 5)]), lane('Greater than 5', [tile('q7', 7)])]),
      step('Combine the groups', 'Every left value is below every equal value, and every right value is above them.', [lane('Sorted result', [tile('q2', 2), tile('q3', 3), tile('q5a', 5), tile('q5b', 5), tile('q7', 7)])])
    ]);
  add('key-sort-definition', 'search-sort', {code: 'Sort real records with a key'}, 'Sorting records · choose what “in order” means',
    'A sorting key extracts the value used for comparison. Python’s sorted returns a new list and is stable: equal keys retain their original order.',
    'The whole record moves with its key. Sorting by score does not detach the student from the score.', [
      step('Start with records', 'Each record pairs a name with a score.', [lane('students', [tile('rAda', 'Ada · 95'), tile('rLin', 'Lin · 88'), tile('rSam', 'Sam · 91')])]),
      step('Select the comparison key', 'key=lambda student: student[1] selects the score, and reverse=True requests descending order.', [lane('Keys attached to records', [tile('rAda', 'Ada · 95', 'key 95', 'focus'), tile('rLin', 'Lin · 88', 'key 88', 'focus'), tile('rSam', 'Sam · 91', 'key 91', 'focus')])]),
      step('Return a new ordered list', 'The result ranks 95, 91, then 88. The original students list is preserved.', [lane('ranked · new list', [tile('rAda', 'Ada · 95', '', 'done'), tile('rSam', 'Sam · 91', '', 'done'), tile('rLin', 'Lin · 88', '', 'done')])])
    ]);

  const factorialSteps = [];
  const callFrames = (active, returning = false) => lane('Call stack · newest call on top', Array.from({length: 5 - active}, (_, i) => {
    const n = 4 - i;
    return tile('f' + n, `factorial(${n})`, n === active ? returning ? 'returning to caller' : 'active call' : `waiting: ${n} × factorial(${n - 1})`, n === active ? returning ? 'done' : 'focus' : '');
  }), {layout: 'call-stack'});
  for (let n = 4; n >= 1; n--) factorialSteps.push(step(`Call factorial(${n})`, n === 1 ? 'The new top frame has n = 1. This is the base case, so no further call is needed.' : `Keep this frame on the stack, remembering ${n} × factorial(${n - 1}). The smaller call goes above it.`, [callFrames(n), lane('Returned answer', [], {layout: 'tray'})], {action: `call factorial(${n})`, summary: `Active: factorial(${n}). ${4 - n} caller(s) waiting.`}));
  factorialSteps.push(step('Return 1 from the base case', 'factorial(1) returns 1. On the next step its caller, factorial(2), can resume.', [callFrames(1, true), lane('Returned answer', [tile('return-value', 1, 'base case', 'done')], {layout: 'tray'})], {action: 'return 1', summary: 'factorial(1) → 1; return to factorial(2).'}));
  let factorialResult = 1;
  for (let n = 2; n <= 4; n++) {
    const old = factorialResult; factorialResult *= n;
    factorialSteps.push(step(`Resume factorial(${n})`, `The smaller call has returned ${old}. The waiting frame now computes ${n} × ${old} = ${factorialResult}.`, [callFrames(n), lane('Returned answer', [tile('return-value', old, 'from the smaller call', 'done')], {layout: 'tray'})], {action: `${n} × ${old} = ${factorialResult}`, summary: `factorial(${n}) resumes with ${old}.`, equation: `${n} × ${old} = ${factorialResult}`}));
    factorialSteps.push(step(`Return ${factorialResult} from factorial(${n})`, n === 4 ? 'The last frame returns 24. No recursive callers remain.' : `Return ${factorialResult} to the waiting factorial(${n + 1}) frame.`, [n === 4 ? lane('Call stack · newest call on top', [], {layout: 'call-stack'}) : callFrames(n, true), lane('Returned answer', [tile('return-value', factorialResult, n === 4 ? 'final answer' : 'back to caller', 'done')], {layout: 'tray'})], {action: `return ${factorialResult}`, summary: `factorial(${n}) → ${factorialResult}${n === 4 ? '; finished.' : '.'}`}));
  }
  add('recursion-definition', 'patterns', {heading: 'Recursion:'}, 'Recursion · stack calls, then return answers',
    'Recursion solves a problem using calls to the same function on smaller instances. A base case stops the calls; each return completes a waiting computation.',
    'New calls appear on top. Older frames keep their unfinished multiplication. Returning an answer lets the caller resume.', factorialSteps);
  add('two-pointers-definition', 'patterns', {heading: 'Choose an algorithmic pattern', afterTable: true}, 'Two pointers · move positions using a reason',
    'A two-pointer algorithm maintains two positions and moves them according to an invariant. For pair sums in sorted data, each comparison can rule out one endpoint.',
    'This rule relies on sorted order. The two indices must stay distinct.', [
      step('Start at the endpoints', 'Target is 10 in [1, 2, 4, 7, 9]. Use left = 0 and right = 4.', [lane('Sorted values', numbers([1, 2, 4, 7, 9], 'pointer', -1, {0: 'left', 4: 'right'}))], {equation: '1 + 9 = 10'}),
      step('Found a pair', 'The sum equals 10, so these two distinct positions give an answer.', [lane('Sorted values', [1, 2, 4, 7, 9].map((v, i) => tile('pointer' + i, v, i === 0 ? 'left' : i === 4 ? 'right' : '', [0, 4].includes(i) ? 'done' : 'dim')))]),
      step('Try target 11', 'Restart. 1 + 9 = 10 is too small. Even the largest partner is not enough for 1, so discard the left endpoint.', [lane('Sorted values · target 11', numbers([1, 2, 4, 7, 9], 'pointer', 0, {0: 'left → move right', 4: 'right'}))], {equation: '10 < 11 → left += 1'}),
      step('Move only the justified endpoint', 'Now 2 + 9 = 11, so return indices 1 and 4. If the sum were too large, moving right leftward would reduce it.', [lane('Sorted values', [1, 2, 4, 7, 9].map((v, i) => tile('pointer' + i, v, i === 1 ? 'left' : i === 4 ? 'right' : '', [1, 4].includes(i) ? 'done' : 'dim')))], {equation: '2 + 9 = 11'})
    ]);
  const windowValues = [2, 1, 5, 1, 3, 2];
  const windowSteps = [0, 1, 2, 3].map((left, i) => {
    const sum = windowValues.slice(left, left + 3).reduce((a, b) => a + b, 0);
    const sums = [8, 7, 9, 6], best = Math.max(...sums.slice(0, i + 1));
    return step(i ? `Slide to indices ${left}–${left + 2}` : 'Build the first window', i ? `Remove ${windowValues[left - 1]} from the old sum and add ${windowValues[left + 2]}. Keep the largest sum seen so far.` : 'A fixed window contains exactly k = 3 consecutive items. Add the first three once.', [lane('Window · highlighted items belong to the current range', windowValues.map((v, j) => tile('window' + j, v, `index ${j}`, j >= left && j < left + 3 ? 'focus' : 'dim'))), lane('Remembered state', [tile('sum', `sum = ${sum}`), tile('best', `best = ${best}`, '', 'done')])], {equation: i ? `${sums[i - 1]} − ${windowValues[left - 1]} + ${windowValues[left + 2]} = ${sum}` : '2 + 1 + 5 = 8'});
  });
  add('window-pattern-definition', 'patterns', {heading: 'Choose an algorithmic pattern', afterTable: true}, 'Sliding window · keep a moving contiguous range',
    'A sliding window maintains information about a contiguous range and updates it as the range moves, reusing work from the previous position.',
    'For a fixed sum window, only the leaving and entering values change the sum.', windowSteps);
  add('divide-definition', 'patterns', {heading: 'Choose an algorithmic pattern', afterTable: true}, 'Divide and conquer · independent smaller problems',
    'Divide and conquer splits a problem into smaller independent problems, solves them, and combines their answers. Base cases make the recursion terminate.',
    'Merge sort is one concrete instance: the two halves can be sorted independently before merging.', [mergeSteps[0], mergeSteps[1], mergeSteps[2], mergeSteps[8], mergeSteps[9], mergeSteps[10], mergeSteps[11], mergeSteps[12], mergeSteps[13], mergeSteps[14], mergeSteps[15]]);
  const intervals = [[0, 3], [1, 2], [2, 4], [3, 5]];
  const intervalTiles = (chosen = [], rejected = [], focus = -1, order = [1, 0, 2, 3]) => order.map(i => tile('interval' + i, `[${intervals[i][0]}, ${intervals[i][1]})`, `finish ${intervals[i][1]}`, i === focus ? 'focus' : chosen.includes(i) ? 'done' : rejected.includes(i) ? 'reject' : ''));
  add('greedy-definition', 'patterns', {heading: 'Greedy choices'}, 'Greedy · commit to a justified local choice',
    'A greedy algorithm commits to a locally preferred feasible choice. Correctness requires a reason that this choice can be part of an optimal solution.',
    'For maximizing the count of non-overlapping intervals, earliest finish leaves the most room. That reasoning does not make every greedy rule correct.', [
      step('Order by finishing time', 'We want as many compatible half-open intervals as possible. Sort by finish, rather than start or length.', [lane('Candidates · earliest finish first', intervalTiles())]),
      step('Choose [1, 2)', 'It finishes earliest, at time 2. Record end = 2.', [lane('Candidates', intervalTiles([1], [], 1)), lane('Chosen', [tile('chosen1', '[1, 2)', '', 'done')])]),
      step('Reject [0, 3)', 'Its start 0 is before end 2, so it overlaps the chosen interval.', [lane('Candidates', intervalTiles([1], [0])), lane('Chosen', [tile('chosen1', '[1, 2)', '', 'done')])]),
      step('Choose [2, 4)', 'Its start equals end 2. Half-open intervals can meet at an endpoint without overlapping; update end = 4.', [lane('Candidates', intervalTiles([1, 2], [0], 2)), lane('Chosen', [tile('chosen1', '[1, 2)', '', 'done'), tile('chosen2', '[2, 4)', '', 'done')])]),
      step('Reject [3, 5) and finish', 'Start 3 is before end 4. Two intervals have been selected.', [lane('Candidates', intervalTiles([1, 2], [0, 3])), lane('Chosen · count 2', [tile('chosen1', '[1, 2)', '', 'done'), tile('chosen2', '[2, 4)', '', 'done')])])
    ]);
  const ways = [1, 1, 2, 3, 5, 8];
  add('dp-definition', 'patterns', {heading: 'Dynamic programming:'}, 'Dynamic programming · reuse earlier answers',
    'Dynamic programming solves overlapping subproblems once and reuses their answers. Define the state, recurrence, base cases, and evaluation order.',
    'ways(i) counts routes to stair i. The last move comes from i−1 or i−2, so add their counts rather than solving them again.', [
      step('Name the state and its bases', 'There is one way to stand at stair 0: do nothing. There is one way to reach stair 1.', [lane('ways · table for this explanation', [tile('dp0', 1, 'ways(0)', 'done'), tile('dp1', 1, 'ways(1)', 'done')])]),
      ...[2, 3, 4, 5].map(i => step(`Reuse answers for stair ${i}`, `Every route to stair ${i} ends with a 1-step move from ${i - 1} or a 2-step move from ${i - 2}. These possibilities are disjoint.`, [lane('ways', ways.slice(0, i + 1).map((v, j) => tile('dp' + j, v, `ways(${j})`, j === i ? 'done' : j >= i - 2 ? 'focus' : 'dim')))], {equation: `ways(${i}) = ${ways[i - 1]} + ${ways[i - 2]} = ${ways[i]}`})),
      step('Keep only the needed states', 'The tutorial’s implementation stores only the last two answers. The full table above is a teaching view, not extra storage required by that code.', [lane('Two stored values after reaching stair 5', [tile('previous', 5, 'previous = ways(4)'), tile('current', 8, 'current = ways(5)', 'done')])])
    ]);
  add('backtracking-definition', 'patterns', {heading: 'Backtracking:'}, 'Backtracking · choose, explore, undo',
    'Backtracking explores a choice, recursively explores its consequences, then undoes that choice to try another branch. Save a copy when an answer is found.',
    'Undo restores the same path object. Saved answer copies stay unchanged when the path is edited.', [
      step('Begin with an empty path', 'Generate subsets of [1, 2]. First take the exclude branch for each value.', [lane('Current path', []), lane('Saved answer copies', [])]),
      step('Save the empty subset', 'Exclude 1 and exclude 2. At the leaf, copy the empty path into answers.', [lane('Current path', []), lane('Saved answer copies', [tile('answer0', '[]', 'copy', 'done')])]),
      step('Choose 2', 'Still excluding 1, include 2 and save [2].', [lane('Current path', [tile('choice2', 2, 'chosen', 'focus')]), lane('Saved answer copies', [tile('answer0', '[]'), tile('answer1', '[2]', 'copy', 'done')])]),
      step('Undo 2', 'pop removes 2 from the path. The saved [2] copy is unaffected.', [lane('Current path · restored', []), lane('Saved answer copies', [tile('answer0', '[]'), tile('answer1', '[2]', 'unchanged', 'done')])]),
      step('Explore the other branch', 'Include 1. Excluding 2 gives [1]; including 2 gives [1, 2]. Copy both leaves.', [lane('Current path', [tile('choice1', 1), tile('choice2', 2, '', 'focus')]), lane('Saved answer copies', [tile('answer0', '[]'), tile('answer1', '[2]'), tile('answer2', '[1]'), tile('answer3', '[1, 2]', 'copy', 'done')])]),
      step('Undo back to the start', 'Pop 2, then 1, as the calls return. The path is empty again; all four saved subsets remain.', [lane('Current path · restored', []), lane('Saved answer copies', [tile('answer0', '[]'), tile('answer1', '[2]'), tile('answer2', '[1]'), tile('answer3', '[1, 2]')])])
    ]);

  add('brackets-definition', 'worked-examples', {heading: 'Example 1'}, 'Balanced brackets · newest opening closes first',
    'Correct nesting requires each closing bracket to match the most recent unmatched opening bracket. A stack stores those unmatched openings.',
    'Matching types alone is not enough: order matters. The top of the stack is the only opening that may close next.', [
      step('Read (', 'Push the opening parenthesis.', [lane('Text · ([])', [tile('text', '([])')]), lane('Unmatched openings · bottom → top', [tile('openRound', '(', 'top', 'focus')])]),
      step('Read [', 'Push [. It must close before the earlier parenthesis.', [lane('Unmatched openings', [tile('openRound', '('), tile('openSquare', '[', 'top', 'focus')])]),
      step('Read ]', 'The top is [, which matches ]. Pop it.', [lane('Unmatched openings', [tile('openRound', '(', 'top', 'focus')]), lane('Matched pair', [tile('openSquare', '[ ]', '', 'done')])]),
      step('Read )', 'The top is (, which matches ). Pop it. The text ends with an empty stack, so return True.', [lane('Unmatched openings', []), lane('Result', [tile('balanced', 'True', 'all openings closed', 'done')])]),
      step('Contrast: ([)]', 'After pushing ( and [, the next character is ). The top [ does not match (, so reject immediately.', [lane('Unmatched openings before checking )', [tile('openRound', '('), tile('openSquare', '[', 'wrong type for )', 'reject')]), lane('Result', [tile('balanced', 'False', 'mismatched nesting', 'reject')])])
    ]);
  add('two-sum-definition', 'worked-examples', {heading: 'Example 2'}, 'Two sum · remember earlier partners',
    'For each value, a dictionary records earlier values and their indices. Look up the needed complement before inserting the current value.',
    'Every dictionary index belongs to an earlier item. This is the invariant that prevents reusing one position.', [
      step('Target is 9', 'Input [2, 7, 11, 15] is unsorted. Start with no remembered values.', [lane('Input', numbers([2, 7, 11, 15], 'sum')), lane('seen · value → earlier index', [])]),
      step('Inspect index 0: value 2', 'Need 9 − 2 = 7. It is absent, so store 2 → 0.', [lane('Input', numbers([2, 7, 11, 15], 'sum', 0)), lane('seen', [tile('seen2', '2 → 0', 'stored after lookup', 'focus')])], {equation: '9 − 2 = 7 · not seen'}),
      step('Inspect index 1: value 7', 'Need 9 − 7 = 2. The dictionary already maps 2 to index 0; return (0, 1).', [lane('Input', numbers([2, 7, 11, 15], 'sum', 1)), lane('seen', [tile('seen2', '2 → 0', 'partner found', 'done')]), lane('Answer', [tile('pair', '(0, 1)', 'distinct indices', 'done')])], {equation: 'values[0] + values[1] = 2 + 7 = 9'}),
      step('Why insert after looking up?', 'For [3, 3] and target 6, the first 3 stores index 0. The second 3 finds it. One isolated 3 cannot pair with itself.', [lane('Duplicate values, different positions', [tile('dup0', 3, 'index 0', 'done'), tile('dup1', 3, 'index 1', 'done')])])
    ]);
  add('window-definition', 'worked-examples', {heading: 'Example 3'}, 'Maximum window sum · reuse the overlap',
    'The maximum fixed-window sum is the largest sum among all contiguous ranges of exactly k items. Move the window one position at a time.',
    'The largest sum here is 9 at indices 2–4. Initializing best from the first sum also handles all-negative arrays.', windowSteps);
  add('shortest-path-definition', 'worked-examples', {heading: 'Example 4'}, 'Shortest path · distance layers and parent arrows',
    'In an unweighted graph, BFS discovers a vertex by a shortest route in edge count. Record its first parent so that route can be reconstructed.',
    'Parent arrows point backward toward the start. Reverse the backward sequence to return a route from start to goal.', [
      step('Distance 0', 'Start at A, with parent[A] = None. The goal is E.', [lane('Queue', [tile('routeA', 'A')]), lane('Parents', [tile('parentA', 'A ← None')])], {diagram: graphDiagram('A', ['A'])}),
      step('Discover distance 1', 'Processing A discovers B and C. Set both parents to A and enqueue both.', [lane('Queue', [tile('routeB', 'B'), tile('routeC', 'C')]), lane('Parents', [tile('parentB', 'B ← A'), tile('parentC', 'C ← A')])], {diagram: graphDiagram('A', ['A', 'B', 'C'])}),
      step('Discover distance 2', 'B discovers D; C discovers E. D already has a parent, so C does not overwrite it. E’s first parent is C.', [lane('Queue', [tile('routeD', 'D'), tile('routeE', 'E')]), lane('New parents', [tile('parentD', 'D ← B'), tile('parentE', 'E ← C', '', 'focus')])], {diagram: graphDiagram('C', ['A', 'B', 'C', 'D', 'E'])}),
      step('Follow parents backward', 'After D, E is removed from the queue. From the goal, follow E → C → A → None.', [lane('Backward path', [tile('pathE', 'E'), tile('pathC', 'C'), tile('pathA', 'A')])], {diagram: graphDiagram('E', ['A', 'B', 'C', 'D', 'E'], ['E', 'C', 'A'])}),
      step('Reverse into the answer', 'Return A → C → E. It has 2 edges, the minimum possible for this goal.', [lane('Shortest route · start → goal', [tile('pathA', 'A', '', 'done'), tile('pathC', 'C', '', 'done'), tile('pathE', 'E', '', 'done')])], {diagram: graphDiagram('', ['A', 'B', 'C', 'D', 'E'], ['A', 'C', 'E']), equation: 'distance(E) = 2 edges'})
    ]);
  add('practice-definition', 'practice', {heading: 'Check your understanding'}, 'From definition to a design choice',
    'Choose a structure by the operations the problem needs. Then specify an algorithm, an invariant that stays true, and a condition that makes it stop.',
    'Ask which operation must be efficient, then explain why the chosen structure supports that operation.', [
      step('Need to undo the latest action?', 'Use a stack: undo must remove the newest action first.', [lane('Required behavior', [tile('task', 'Undo latest edit')]), lane('Choose', [tile('choice', 'Stack', 'LIFO', 'done')])]),
      step('Need fair arrival order?', 'Use a queue: serve the earliest arrival before later ones.', [lane('Required behavior', [tile('task', 'Serve customers in arrival order')]), lane('Choose', [tile('choice', 'Queue', 'FIFO', 'done')])]),
      step('Need to avoid repeated visits?', 'Use a set to remember discovered vertices. The membership invariant prevents adding them repeatedly.', [lane('Required behavior', [tile('task', 'Remember discovered vertices')]), lane('Choose', [tile('choice', 'Set', 'unique membership', 'done')])]),
      step('Need a fewest-edge route?', 'Use BFS with a queue and a parent dictionary. Stop when the goal is processed or the queue is empty.', [lane('Required behavior', [tile('task', 'Fewest-edge route in an unweighted graph')]), lane('Structure + algorithm', [tile('queue', 'Queue'), tile('parents', 'Parent dictionary'), tile('choice', 'BFS', 'distance layers', 'done')])])
    ]);

  // Expose the declarative stories for local checks and future lesson maintenance.
  window.dsaConceptLessons = lessons;
  const make = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let activePlayer = null;
  const SVG = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs, text) { const n = document.createElementNS(SVG, tag); Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v)); if (text !== undefined) n.textContent = text; return n; }
  function drawDiagram(model, title, id) {
    const picture = svg('svg', {class: 'concept-diagram', viewBox: '0 0 600 260', role: 'img', 'aria-label': title});
    picture.append(svg('title', {}, title));
    const defs = svg('defs', {}), marker = svg('marker', {id: id + '-arrow', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse'});
    marker.append(svg('path', {d: 'M 0 0 L 10 5 L 0 10 z', fill: '#6c8b7a'})); defs.append(marker); picture.append(defs);
    const byId = new Map(model.nodes.map(n => [n.id, n]));
    model.edges.forEach(e => {
      const a = byId.get(e.from), b = byId.get(e.to); if (!a || !b) throw new Error('Missing concept edge endpoint');
      const dx = b.x - a.x, dy = b.y - a.y;
      const boundary = n => Math.min((n.kind === 'link' ? 40 : n.value.length > 5 ? 70 : 31) / (Math.abs(dx) || 1e-9), 28 / (Math.abs(dy) || 1e-9));
      const start = boundary(a), end = boundary(b);
      const ax = a.x + dx * start, ay = a.y + dy * start;
      const bx = b.x - dx * end, by = b.y - dy * end;
      const line = svg('line', {x1: ax, y1: ay, x2: bx, y2: by, class: 'concept-edge ' + (e.tone || ''), 'data-motion-key': `edge-${e.from}-${e.to}`});
      if (e.arrow) line.setAttribute('marker-end', `url(#${id}-arrow)`);
      picture.append(line);
      if (e.label) picture.append(svg('text', {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - 9, class: 'concept-edge-label'}, e.label));
    });
    model.nodes.forEach(n => {
      const group = svg('g', {class: 'concept-node ' + (n.tone || ''), 'data-motion-key': n.id, 'data-x': n.x, 'data-y': n.y, transform: `translate(${n.x} ${n.y})`});
      const wide = n.value.length > 5, linked = n.kind === 'link';
      group.append(svg('rect', {x: linked ? -38 : wide ? -65 : -26, y: -22, width: linked ? 76 : wide ? 130 : 52, height: 44, rx: linked ? 5 : wide ? 8 : 21}));
      group.append(svg('text', {x: linked ? -11 : 0, y: 1}, n.value));
      if (linked) {
        group.append(svg('line', {x1: 15, y1: -22, x2: 15, y2: 22, class: 'concept-node-divider'}));
        group.append(svg('circle', {cx: 26, cy: 0, r: 3, fill: '#557261'}));
      }
      if (n.caption) group.append(svg('text', {x: 0, y: 36, class: 'concept-node-caption'}, n.caption));
      picture.append(group);
    });
    (model.pointers || []).forEach(p => {
      const target = byId.get(p.target);
      const fromLeft = target.y < 100, x = fromLeft ? target.x - 100 : target.x, y = fromLeft ? target.y : target.y - 75;
      const group = svg('g', {class: 'concept-pointer', 'data-motion-key': 'pointer-' + p.id, 'data-x': x, 'data-y': y, transform: `translate(${x} ${y})`});
      group.append(svg('line', {x1: fromLeft ? 35 : 0, y1: fromLeft ? 0 : 13, x2: fromLeft ? 58 : 0, y2: fromLeft ? 0 : 46, 'marker-end': `url(#${id}-arrow)`}));
      group.append(svg('text', {x: 0, y: 0}, p.label)); picture.append(group);
    });
    return picture;
  }
  function laneLayout(row, story) {
    if (row.layout) return row.layout;
    if (/^Queue/.test(row.label) && !/removed/.test(row.label)) return 'queue';
    if (/^Stack/.test(row.label) && !/removed/.test(row.label)) return 'stack';
    if (story.id === 'set-definition' && row.label === 'visited') return 'set';
    if (['dict-definition', 'frequency-definition'].includes(story.id) && ['grades', 'counts'].includes(row.label)) return 'map';
    if (story.id === 'tuple-definition' && row.label.startsWith('point')) return 'tuple';
    if (row.items.some(item => /^index \d+$/.test(item.caption))) return 'indexed';
    return 'row';
  }
  function drawLane(row, story) {
    const layout = laneLayout(row, story);
    const line = make('div', 'concept-lane concept-layout-' + layout); line.dataset.layout = layout;
    if (row.area) line.style.gridArea = row.area;
    line.append(make('h5', '', row.label));
    if (layout === 'stack' || layout === 'call-stack') line.append(make('div', 'concept-ports', layout === 'stack' ? '↓ push · ↑ pop · same top opening' : '↓ call · ↑ return · active frame on top'));
    if (layout === 'queue') {
      const ports = make('div', 'concept-ports'); ports.append(make('span', '', '← exit · front'), make('span', '', 'back · join ←')); line.append(ports);
    }
    const items = make('div', 'concept-items');
    const indexed = ['indexed', 'cards', 'tuple'].includes(layout);
    if (layout === 'indexed') line.dataset.currentIndex = row.pointers?.mid ?? row.pointers?.low ?? row.items.findIndex(item => item.tone === 'focus');
    row.items.forEach((item, i) => {
      const box = make('div', 'concept-tile ' + item.tone); box.dataset.motionKey = item.id;
      if (layout === 'map' && item.value.includes('→')) {
        const [key, ...value] = item.value.split('→'); box.append(make('span', 'concept-map-key', key.trim()), make('span', 'concept-map-value', value.join('→').trim()));
      } else box.append(make('span', 'concept-value', item.value));
      if (item.caption && !(indexed && /^index \d+$/.test(item.caption))) box.append(make('small', '', item.caption));
      if (indexed) {
        const slot = make('div', 'concept-slot');
        const markers = Object.entries(row.pointers || {}).filter(([, position]) => position === i).map(([name]) => name);
        if (row.pointers) {
          const pointers = make('span', 'concept-slot-pointer');
          markers.forEach(name => { const marker = make('span', '', '↓ ' + name); marker.dataset.motionKey = 'bound-' + name; pointers.append(marker); }); slot.append(pointers);
        }
        slot.append(box, make('span', 'concept-index', layout === 'tuple' ? `▣ slot ${i}` : `index ${i}`)); items.append(slot);
      } else items.append(box);
    });
    if (row.capacity) for (let i = row.items.length; i < row.capacity; i++) items.append(make('div', 'concept-vacant', '·'));
    if (!row.items.length && !row.capacity) items.append(make('span', 'concept-empty', '(empty)'));
    line.append(items);
    if (row.range) {
      const bracket = make('div', 'concept-range');
      bracket.style.marginLeft = `calc(${row.range[0]} * (var(--slot-width) + 9px))`;
      bracket.style.width = `calc(${row.range[1] - row.range[0] + 1} * (var(--slot-width) + 9px) - 9px)`;
      bracket.append(make('span', '', 'remaining candidates')); line.append(bracket);
    }
    return line;
  }
  function stateSummary(frame) {
    if (frame.summary) return frame.summary;
    if (!frame.lanes.length) return frame.title;
    return frame.lanes.slice(0, 2).map(row => `${row.label}: ${row.items.length ? row.items.slice(0, 6).map(item => item.value).join(', ') + (row.items.length > 6 ? ', …' : '') : 'empty'}`).join(' · ');
  }
  function traversalProgram(mode) {
    const traces = JSON.parse(document.getElementById('dsa-execution-traces').textContent);
    const source = traces.find(trace => trace.title === 'Breadth-first search and iterative depth-first search').code.split('\n');
    const name = mode.toLowerCase(), start = source.findIndex(line => line.startsWith(`def ${name}(`));
    let end = start + 1;
    while (end < source.length && (!source[end].trim() || /^\s/.test(source[end]))) end++;
    const fn = source.slice(start, end).join('\n').trimEnd();
    const graphStart = source.findIndex(line => line.startsWith('graph ='));
    const graphEnd = source.findIndex((line, i) => i > graphStart && line === '}');
    const prefix = mode === 'BFS' ? 'from collections import deque\n\n' : '';
    const call = `print(${name}(graph, "A"))`;
    return {lines: (prefix + fn + '\n\n' + call).split('\n'), copy: prefix + source.slice(graphStart, graphEnd + 1).join('\n') + '\n\n' + fn + '\n\n' + call};
  }
  function drawTraversalCode(frame, program) {
    const panel = make('section', 'concept-code-card'); panel.setAttribute('aria-label', frame.mode + ' Python code');
    const top = make('div', 'concept-code-top'), copy = make('button', '', 'Copy Python'); copy.type = 'button';
    top.append(make('strong', '', frame.mode + ' · Python'), copy); panel.append(top);
    panel.append(make('p', 'concept-code-note', 'Uses the graph shown here, starting at A. Highlighted lines explain this step.'));
    const pre = make('pre'), code = make('code'); pre.append(code);
    program.lines.forEach((text, i) => {
      const line = make('span', 'concept-code-line', text || ' '); line.dataset.line = i + 1;
      if (frame.codeFocus.some(prefix => text.trim().startsWith(prefix))) line.classList.add('is-active');
      code.append(line);
    });
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(program.copy); copy.textContent = 'Copied'; }
      catch { const range = document.createRange(); range.selectNodeContents(code); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); copy.textContent = 'Code selected'; }
    });
    panel.append(pre); return panel;
  }
  const references = {
    'stack-queue-definition': ['VisuAlgo · stack, queue, and linked list', 'https://visualgo.net/en/list'],
    'linked-definition': ['VisuAlgo · linked-list operations', 'https://visualgo.net/en/list'],
    'insertion-definition': ['VisuAlgo · sorting operations', 'https://visualgo.net/en/sorting'],
    'merge-definition': ['VisuAlgo · sorting operations', 'https://visualgo.net/en/sorting'],
    'binary-definition': ['University of San Francisco · search visualization', 'https://www.cs.usfca.edu/~galles/visualization/Search.html'],
    'recursion-definition': ['Python Tutor · objects and call frames', 'https://pythontutor.com/'],
    'references-definition': ['Python Tutor · objects and references', 'https://pythontutor.com/'],
    'traversal-definition': ['Red Blob Games · frontier expansion and graph search', 'https://www.redblobgames.com/pathfinding/a-star/introduction.html']
  };
  const insertions = new Map();
  function findAnchor(story) {
    const body = document.querySelector('#' + story.chapter + ' .section-body');
    if (!body) throw new Error('Missing concept chapter: ' + story.chapter);
    if (story.anchor.definition) return {node: body.querySelector('.definition'), before: false};
    if (story.anchor.code) {
      const card = [...body.querySelectorAll('.code-card')].find(n => n.querySelector('.code-top span')?.textContent === story.anchor.code);
      return {node: card, before: true};
    }
    const heading = [...body.querySelectorAll('h3')].find(n => n.textContent.startsWith(story.anchor.heading));
    if (!heading) throw new Error('Missing concept heading: ' + story.title);
    if (story.anchor.afterTable) {
      let next = heading.nextElementSibling;
      while (next && !next.classList.contains('table-wrap') && next.tagName !== 'H3') next = next.nextElementSibling;
      if (!next?.classList.contains('table-wrap')) throw new Error('Missing concept table: ' + story.title);
      return {node: next, before: false};
    }
    return {node: heading.nextElementSibling?.tagName === 'P' ? heading.nextElementSibling : heading, before: false};
  }
  function mount(story) {
    const {node: anchor, before} = findAnchor(story);
    if (!anchor) throw new Error('Missing concept anchor: ' + story.title);
    const card = make('section', 'concept-demo'); card.id = 'concept-' + story.id; card.dataset.concept = story.id;
    const headingId = card.id + '-title'; card.setAttribute('aria-labelledby', headingId);
    const kicker = make('div', 'concept-kicker', 'See the definition');
    const count = make('span', 'concept-counter'); kicker.append(count); card.append(kicker);
    const heading = make('h4', '', story.title); heading.id = headingId; card.append(heading);
    card.append(make('p', 'concept-definition', story.definition));
    const modeButtons = [], programs = new Map();
    let segment = {start: 0, end: story.steps.length - 1};
    if (story.modes) {
      segment = story.modes[0];
      const choices = make('div', 'concept-mode-choices'); choices.setAttribute('role', 'group'); choices.setAttribute('aria-label', 'Choose BFS or DFS');
      story.modes.forEach(mode => {
        const choice = make('button', '', mode.label); choice.type = 'button'; choice.dataset.conceptMode = mode.id;
        choice.addEventListener('click', () => { pause(); segment = mode; index = mode.start; render(); });
        modeButtons.push(choice); choices.append(choice); programs.set(mode.id, traversalProgram(mode.id));
      });
      card.append(choices, make('p', 'concept-mode-hint', 'Choose an algorithm above. Each has its own animation, Python code, and playback steps.'));
    }
    const controls = make('div', 'concept-controls');
    const button = (text, action, cls = '') => { const n = make('button', cls, text); n.type = 'button'; n.dataset.conceptAction = action; controls.append(n); return n; };
    const play = button('▶ Play', 'play', 'primary'), back = button('← Back', 'back'), next = button('Next →', 'next'), reset = button('↺ Reset', 'reset');
    const label = make('label', '', 'Speed'), speed = make('select'); speed.setAttribute('aria-label', 'Animation speed for ' + story.title);
    [['0.5', '0.5×'], ['1', '1×'], ['2', '2×']].forEach(([value, text]) => { const option = make('option', '', text); option.value = value; speed.append(option); }); speed.value = '1'; label.append(speed); controls.append(label); card.append(controls);
    const slider = make('input', 'concept-slider'); slider.type = 'range'; slider.min = '0'; slider.max = String(story.steps.length - 1); slider.step = '1'; slider.value = '0'; slider.setAttribute('aria-label', 'Animation step for ' + story.title); card.append(slider);
    const stage = make('div', 'concept-stage'); stage.setAttribute('aria-label', 'Visual model for ' + story.title); card.append(stage);
    const caption = make('div', 'concept-caption'); caption.setAttribute('role', 'status');
    const captionTitle = make('strong'), explanation = make('p'); caption.append(captionTitle, explanation); card.append(caption);
    const history = make('details', 'concept-history'); history.append(make('summary', '', 'Compare before → action → after'));
    const comparison = make('div', 'concept-comparison'); history.append(comparison); card.append(history);
    const notice = make('p', 'concept-notice'); notice.append(make('b', '', 'What to notice: '), document.createTextNode(story.notice)); card.append(notice);
    if (references[story.id]) {
      const [title, url] = references[story.id], reference = make('p', 'concept-reference', 'Explore another visual explanation: '), link = make('a', '', title);
      link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; reference.append(link); card.append(reference);
    }
    card.append(make('p', 'concept-legend', 'Amber = current focus · blue = discovered and waiting · green = accepted or completed · red = rejected · dim = excluded. Use Next for one operation; Back revisits the previous state.'));
    if (before) anchor.before(card);
    else { const previous = insertions.get(anchor) || anchor; previous.after(card); insertions.set(anchor, card); }
    let index = segment.start, timer = null, running = false;
    function pause() { clearTimeout(timer); timer = null; running = false; play.textContent = index === segment.end ? '↻ Replay' : '▶ Play'; play.setAttribute('aria-pressed', 'false'); if (story.modes) play.setAttribute('aria-label', 'Play ' + segment.id + ' animation'); if (activePlayer === pause) activePlayer = null; }
    function render() {
      const frame = story.steps[index];
      const positions = new Map([...stage.querySelectorAll('[data-motion-key]')].map(n => [n.dataset.motionKey, {rect: n.getBoundingClientRect(), layout: n.closest('.concept-lane')?.dataset.layout}]));
      stage.replaceChildren();
      let visual = stage;
      if (story.modes) {
        const workspace = make('div', 'concept-traversal-workspace'); visual = make('div', 'concept-traversal-visual');
        workspace.append(visual, drawTraversalCode(frame, programs.get(frame.mode))); stage.append(workspace);
        modeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.conceptMode === frame.mode)));
        slider.max = segment.end - segment.start;
        play.setAttribute('aria-label', (running ? 'Pause ' : 'Play ') + frame.mode + ' animation');
      }
      stage.classList.toggle('concept-containers', story.id === 'stack-queue-definition');
      if (frame.diagram) {
        if (frame.diagram.label) visual.append(make('p', 'concept-diagram-direction', frame.diagram.label));
        visual.append(drawDiagram(frame.diagram, frame.title, story.id));
      }
      if (frame.grid) {
        const work = make('div', 'concept-work'); work.append(make('h5', '', 'Quadratic work · one mark per ordered pair'));
        const grid = make('div', 'concept-work-grid'); grid.style.gridTemplateColumns = `repeat(${frame.grid.size}, 16px)`;
        grid.setAttribute('role', 'img'); grid.setAttribute('aria-label', `${frame.grid.size} by ${frame.grid.size} grid: ${frame.grid.size ** 2} ordered pairs`);
        for (let r = 0; r < frame.grid.size; r++) for (let c = 0; c < frame.grid.size; c++) {
          const mark = make('span'); mark.dataset.motionKey = `pair-${r}-${c}`; mark.setAttribute('aria-hidden', 'true'); grid.append(mark);
        }
        work.append(grid); stage.append(work);
      }
      if (frame.lanes.length === 3 && frame.lanes.every(row => row.layout === 'run')) {
        const runs = make('div', 'concept-run-flow');
        [frame.lanes[1], frame.lanes[2], frame.lanes[0]].forEach(row => runs.append(drawLane(row, story))); stage.append(runs);
      } else frame.lanes.forEach(row => visual.append(drawLane(row, story)));
      if (frame.equation) stage.append(make('div', 'concept-equation', frame.equation));
      stage.querySelectorAll('.concept-layout-indexed').forEach(row => {
        const slot = row.querySelectorAll('.concept-slot')[Number(row.dataset.currentIndex)];
        // Follow the active bounds on narrow screens without scrolling the page.
        if (slot && row.scrollWidth > row.clientWidth) row.scrollLeft = slot.getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft - (row.clientWidth - slot.getBoundingClientRect().width) / 2;
      });
      captionTitle.textContent = frame.title; explanation.textContent = frame.explain;
      comparison.replaceChildren();
      [['Before', index > segment.start ? stateSummary(story.steps[index - 1]) : 'Starting state'], ['Action', frame.action || frame.title], ['After', stateSummary(frame)]].forEach(([label, value]) => {
        const part = make('div'); part.append(make('b', '', label), make('p', '', value)); comparison.append(part);
      });
      count.textContent = `${index - segment.start + 1} / ${segment.end - segment.start + 1}`; slider.value = String(index - segment.start);
      slider.setAttribute('aria-valuetext', `Step ${index - segment.start + 1} of ${segment.end - segment.start + 1}: ${frame.title}`);
      back.disabled = index === segment.start; next.disabled = index === segment.end;
      if (!running) play.textContent = index === segment.end ? '↻ Replay' : '▶ Play';
      if (!reduced.matches) stage.querySelectorAll('[data-motion-key]').forEach(n => {
        if (typeof n.animate !== 'function') return;
        const old = positions.get(n.dataset.motionKey), previous = old?.rect, rect = n.getBoundingClientRect();
        if (n.namespaceURI === SVG) {
          // SVG coordinates scale with the diagram; convert screen deltas back.
          if (!n.hasAttribute('data-x')) { if (!previous) n.animate([{opacity: 0}, {opacity: 1}], {duration: 450 / Number(speed.value)}); return; }
          const scale = n.ownerSVGElement.getBoundingClientRect().width / 600 || 1;
          const x = Number(n.getAttribute('data-x')), y = Number(n.getAttribute('data-y'));
          if (previous && (previous.left !== rect.left || previous.top !== rect.top)) n.animate([{transform: `translate(${x + (previous.left - rect.left) / scale}px,${y + (previous.top - rect.top) / scale}px)`}, {transform: `translate(${x}px,${y}px)`}], {duration: 650 / Number(speed.value), easing: 'ease-in-out'});
          else if (n.classList.contains('focus')) n.animate([{opacity: 0.45}, {opacity: 1}], {duration: 500, easing: 'ease-out'});
        } else if (previous && (previous.left !== rect.left || previous.top !== rect.top)) {
          const dx = previous.left - rect.left, dy = previous.top - rect.top;
          let path = [{transform: `translate(${dx}px,${dy}px)`}, {transform: 'translate(0,0)'}];
          if (n.closest('.concept-layout-tray') && old.layout === 'stack') {
            const side = Math.min(dx + previous.width + 20, stage.getBoundingClientRect().right - rect.right - 6);
            path = [[dx, dy], [dx, dy - 35], [side, dy - 35], [side, 0], [0, 0]].map(([x, y]) => ({transform: `translate(${x}px,${y}px)`}));
          } else if (n.closest('.concept-layout-tray') && old.layout === 'queue') {
            path = [[dx, dy], [dx - 24, dy], [dx - 24, 0], [0, 0]].map(([x, y]) => ({transform: `translate(${x}px,${y}px)`}));
          }
          n.animate(path, {duration: (path.length > 2 ? 950 : 650) / Number(speed.value), easing: 'ease-in-out'});
        }
        else if (!previous) n.animate([{opacity: 0, transform: n.closest('.concept-layout-queue') ? 'translateX(35px)' : 'translateY(-25px)'}, {opacity: 1, transform: 'translate(0,0)'}], {duration: 400 / Number(speed.value), easing: 'ease-out'});
      });
    }
    function tick() { if (!running) return; index++; render(); if (index === segment.end) pause(); else timer = setTimeout(tick, 2600 / Number(speed.value)); }
    function seek(value) { pause(); index = Math.max(segment.start, Math.min(segment.end, value)); render(); }
    play.addEventListener('click', () => {
      if (running) { pause(); return; }
      window.dispatchEvent(new Event('dsa-playback-start'));
      if (index === segment.end) { index = segment.start; render(); }
      running = true; activePlayer = pause; play.textContent = 'Ⅱ Pause'; play.setAttribute('aria-pressed', 'true'); timer = setTimeout(tick, 2600 / Number(speed.value));
      if (story.modes) play.setAttribute('aria-label', 'Pause ' + segment.id + ' animation');
    });
    back.addEventListener('click', () => seek(index - 1)); next.addEventListener('click', () => seek(index + 1)); reset.addEventListener('click', () => seek(segment.start)); slider.addEventListener('input', () => seek(segment.start + Number(slider.value)));
    speed.addEventListener('change', () => { if (running) { clearTimeout(timer); timer = setTimeout(tick, 2600 / Number(speed.value)); } });
    card.closest('details.section').addEventListener('toggle', e => { if (!e.target.open) pause(); });
    play.setAttribute('aria-pressed', 'false'); render();
  }
  window.addEventListener('dsa-playback-start', () => { if (activePlayer) activePlayer(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && activePlayer) activePlayer(); });
  window.addEventListener('beforeprint', () => { if (activePlayer) activePlayer(); });
  lessons.forEach(mount);
})();
