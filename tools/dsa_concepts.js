/* Definition-first stories. Embedded by build_dsa_animations.py for offline use. */
(() => {
  'use strict';
  const tile = (id, value, caption = '', tone = '') => ({id, value: String(value), caption, tone});
  const lane = (label, items) => ({label, items});
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
  add('stack-queue-definition', 'linear-structures', {definition: true}, 'Stack vs queue · same arrivals, different exits',
    'A stack removes the most recently added item (LIFO). A queue removes the earliest added item (FIFO). These are rules for behavior, regardless of implementation.',
    'Watch Sam leave the stack while Ada leaves the queue. The arrival order was identical.', [
      step('Empty containers', 'Think of the stack as undo history and the queue as a checkout line.', [lane('Stack · bottom → top', []), lane('Queue · front → back', [])]),
      ...arrivals.map((name, i) => step(`Arrival: ${name}`, 'Add at the right end of both containers.', [lane('Stack · bottom → top', arrivals.slice(0, i + 1).map((n, j) => customer(n, 's', j === i ? 'top' : '', j === i ? 'focus' : ''))), lane('Queue · front → back', arrivals.slice(0, i + 1).map((n, j) => customer(n, 'q', j === 0 ? 'front' : '', j === i ? 'focus' : '')))])),
      step('Remove once', 'Stack pop returns Sam, the newest arrival. Queue dequeue returns Ada, the oldest arrival.', [lane('Stack · remaining', [customer('Ada', 's'), customer('Lin', 's', 'top')]), lane('Stack · removed', [customer('Sam', 's', 'last in, first out', 'done')]), lane('Queue · remaining', [customer('Lin', 'q', 'front'), customer('Sam', 'q')]), lane('Queue · removed', [customer('Ada', 'q', 'first in, first out', 'done')])])
    ]);
  const linkedDiagram = (prepend, current) => ({
    nodes: [node('head', 'head', 55, 95), ...(prepend ? [node('n10', 10, 170, 95, current === 10 ? 'focus' : '', 'value | next')] : []), node('n20', 20, 290, 95, current === 20 ? 'focus' : '', 'value | next'), node('n30', 30, 410, 95, current === 30 ? 'focus' : '', 'value | next'), node('null', 'None', 520, 95, current === null ? 'done' : '')],
    edges: [edge('head', prepend ? 'n10' : 'n20', '', true), ...(prepend ? [edge('n10', 'n20', 'next', true)] : []), edge('n20', 'n30', 'next', true), edge('n30', 'null', 'next', true)]
  });
  add('linked-definition', 'linear-structures', {heading: 'Linked lists:'}, 'Linked list · follow the arrows',
    'A singly linked list is a chain of nodes. Each node stores a value and a next reference; head identifies the first node, and None ends the chain.',
    'The drawing has no array indices. To reach 30, follow next links; prepending changes only the new node and head.', [
      step('Start at head', 'head points to the node holding 20. That node points to 30.', [], {diagram: linkedDiagram(false, 20)}),
      step('Prepend 10', 'Create a node whose next points to the old head, then move head to it. The old nodes stay where they are.', [], {diagram: linkedDiagram(true, 10)}),
      step('Follow one link', 'current = current.next moves the reference from 10 to 20. It does not move a node.', [], {diagram: linkedDiagram(true, 20)}),
      step('Follow the next link', 'Advance again to reach 30. Access requires traversal from head.', [], {diagram: linkedDiagram(true, 30)}),
      step('Reach the end', '30.next is None, so the traversal stops.', [], {diagram: linkedDiagram(true, null)})
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
  const graphDiagram = (focus = '', visited = [], path = [], pairs = graphPairs) => ({nodes: Object.entries(graphPositions).map(([v, [x, y]]) => node('g' + v, v, x, y, v === focus ? 'focus' : visited.includes(v) ? 'done' : '')), edges: pairs.map(([a, b]) => edge('g' + a, 'g' + b, '', false, path.some((v, i) => i && ((v === a && path[i - 1] === b) || (v === b && path[i - 1] === a))) ? 'done' : ''))});
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
    const frontier = ['A'], seen = new Set(['A']), order = [];
    traversalSteps.push(step(`${mode}: start at A`, mode === 'BFS' ? 'BFS uses a FIFO queue to expand distance layers.' : 'DFS uses a LIFO stack to follow a branch before returning.', [lane(mode === 'BFS' ? 'Queue · front → back' : 'Stack · bottom → top', [tile('frontierA', 'A')]), lane('Visit order', [])], {diagram: graphDiagram('', ['A'])}));
    while (frontier.length) {
      const current = mode === 'BFS' ? frontier.shift() : frontier.pop(); order.push(current);
      const next = mode === 'BFS' ? neighbors[current] : [...neighbors[current]].reverse();
      next.forEach(v => { if (!seen.has(v)) { seen.add(v); frontier.push(v); } });
      traversalSteps.push(step(`${mode}: visit ${current}`, mode === 'BFS' ? 'Remove the queue front, then add unseen neighbors at the back. Mark them immediately.' : 'Remove the stack top, then push unseen neighbors in reverse listed order. Mark them immediately.', [lane(mode === 'BFS' ? 'Queue · front → back' : 'Stack · bottom → top', frontier.map(v => tile('frontier' + v, v))), lane('Visit order', order.map(v => tile('order' + v, v, '', 'done')))], {diagram: graphDiagram(current, [...seen])}));
    }
  }
  add('traversal-definition', 'trees-graphs', {code: 'Breadth-first search and iterative depth-first search'}, 'BFS vs DFS · choose how to explore',
    'Breadth-first search explores by increasing edge distance using a queue. Depth-first search follows a branch using a stack or recursive calls.',
    'Compare the visit orders on this graph. BFS guarantees shortest edge counts in an unweighted graph; DFS generally does not.', traversalSteps);

  add('linear-definition', 'search-sort', {heading: 'Linear search:'}, 'Linear search · inspect one item at a time',
    'Linear search compares successive items with a target until it finds a match or reaches the end. The input does not need to be sorted.',
    'One unsuccessful comparison removes only one candidate. Finding the last item can require n comparisons.', [
      ...[0, 1, 2].map(i => step(i === 2 ? 'Match: return index 2' : `Inspect index ${i}`, `${[9, 2, 7][i]} ${i === 2 ? '=' : '≠'} 7. ${i === 2 ? 'Stop with a valid matching index.' : 'Advance to the next position.'}`, [lane('Unsorted input · target 7', numbers([9, 2, 7], 'linear', i))])),
      step('What if it is absent?', 'For target 5, every item differs. Reaching the end proves absence; return -1.', [lane('Input · all inspected', [9, 2, 7].map((v, i) => tile('linear' + i, v, 'not 5', 'dim'))), lane('Answer', [tile('absent', -1, 'not found')])])
    ]);
  const binaryValues = [2, 4, 7, 9, 12, 15, 18];
  add('binary-definition', 'search-sort', {heading: 'Binary search:'}, 'Binary search · discard a whole half',
    'Binary search finds a target in sorted data by comparing the middle candidate, then keeping only the half that can still contain the target.',
    'Dim items are ruled out by sorted order. The interval shrinks even when a comparison does not find the answer.', [
      step('Begin with all candidates', 'The target is 12. Sorted order is required before the first comparison.', [lane('Sorted input', numbers(binaryValues, 'binary'))], {equation: 'low = 0 · high = 6'}),
      step('Inspect the middle', 'mid = 3, value = 9. Since 9 < 12, values at indices 0 through 3 are all too small.', [lane('Sorted input', numbers(binaryValues, 'binary', 3))], {equation: '(0 + 6) // 2 = 3'}),
      step('Keep only the right half', 'Now low = 4 and high = 6. Inspect index 5: 15 is too large, so discard indices 5 and 6.', [lane('Candidates', binaryValues.map((v, i) => tile('binary' + i, v, `index ${i}`, i < 4 ? 'dim' : i === 5 ? 'focus' : '')))], {equation: '(4 + 6) // 2 = 5'}),
      step('Find the remaining candidate', 'low = high = 4. Its value is 12, so return index 4.', [lane('Candidates', binaryValues.map((v, i) => tile('binary' + i, v, `index ${i}`, i === 4 ? 'done' : 'dim')))], {equation: 'return 4'})
    ]);
  add('insertion-definition', 'search-sort', {heading: 'Insertion sort:'}, 'Insertion sort · make room in a sorted prefix',
    'Insertion sort grows a sorted prefix by taking the next item, shifting larger items right, and inserting the item into the gap.',
    'Holding the key aside prevents it from being overwritten while references shift.', [
      step('Start with a sorted prefix', 'The first item is a sorted prefix of length one. The next key is 3.', [lane('Row', [tile('i7', 7, 'sorted prefix', 'done'), tile('i3', 3, 'next key', 'focus'), tile('i5', 5, 'unprocessed')])]),
      step('Hold the key aside', 'Remember 3 separately. Its old position is now the gap to fill.', [lane('Row', [tile('i7', 7, 'sorted prefix', 'done'), tile('hole', '□', 'gap'), tile('i5', 5)]), lane('Held key', [tile('i3', 3, '', 'focus')])]),
      step('Shift the larger item', '7 > 3, so move 7 one position right. The gap moves left.', [lane('Row', [tile('hole', '□', 'gap'), tile('i7', 7, 'shifted right', 'focus'), tile('i5', 5)]), lane('Held key', [tile('i3', 3)])]),
      step('Insert into the gap', 'Place 3 before 7. The sorted prefix is now [3, 7].', [lane('Row', [tile('i3', 3, 'sorted', 'done'), tile('i7', 7, 'sorted', 'done'), tile('i5', 5, 'next key', 'focus')])]),
      step('Repeat for 5', 'Hold 5, shift 7 right, then put 5 between 3 and 7. The whole row is sorted.', [lane('Row', [tile('i3', 3, 'sorted', 'done'), tile('i5', 5, 'sorted', 'done'), tile('i7', 7, 'sorted', 'done')])])
    ]);
  const mergeSteps = [
    step('Divide the input', 'Break [7, 3, 5, 2] into two independent halves.', [lane('Input', numbers([7, 3, 5, 2], 'merge'))]),
    step('Split until trivial', 'Split each half again. Each one-item list is already sorted; these are the base cases.', [lane('Left half → singleton [7]', [tile('merge0', 7)]), lane('Left half → singleton [3]', [tile('merge1', 3)]), lane('Right half → singleton [5]', [tile('merge2', 5)]), lane('Right half → singleton [2]', [tile('merge3', 2)])]),
    step('Sort the small halves', 'Merge the singletons into [3, 7] and [2, 5].', [lane('Left · sorted', [tile('merge1', 3), tile('merge0', 7)]), lane('Right · sorted', [tile('merge3', 2), tile('merge2', 5)]), lane('Combined output', [])]),
    step('Take the smaller front', 'Compare 3 and 2. Move 2 into the output.', [lane('Left · sorted', [tile('merge1', 3), tile('merge0', 7)]), lane('Right · sorted', [tile('merge2', 5)]), lane('Combined output', [tile('merge3', 2, '', 'done')])]),
    step('Take 3, then 5', 'Compare the remaining fronts each time; append the smaller one.', [lane('Left · sorted', [tile('merge0', 7)]), lane('Right · sorted', []), lane('Combined output', [tile('merge3', 2, '', 'done'), tile('merge1', 3, '', 'done'), tile('merge2', 5, '', 'done')])]),
    step('Append the remaining tail', 'The right half is empty. Append the remaining 7; no more comparisons are needed.', [lane('Combined output', [tile('merge3', 2, '', 'done'), tile('merge1', 3, '', 'done'), tile('merge2', 5, '', 'done'), tile('merge0', 7, '', 'done')])])
  ];
  add('merge-definition', 'search-sort', {heading: 'Merge sort:'}, 'Merge sort · divide, solve, combine',
    'Merge sort recursively sorts halves, then combines the sorted halves by repeatedly taking the smaller next item.',
    'At each merge, both input halves must already be sorted. Splitting gives logarithmic depth; merging handles all items per level.', mergeSteps);
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
  for (let n = 4; n >= 1; n--) factorialSteps.push(step(n === 1 ? 'Reach the base case' : `Call factorial(${n})`, n === 1 ? 'factorial(1) returns 1 without another recursive call.' : `The call for ${n} waits for factorial(${n - 1}). The argument decreases, so the base case gets closer.`, [lane('Call stack · caller → active call', Array.from({length: 5 - n}, (_, i) => tile('f' + (4 - i), `factorial(${4 - i})`, 4 - i === n ? 'active call' : 'waiting', 4 - i === n ? 'focus' : '')))]));
  let factorialResult = 1;
  for (let n = 2; n <= 4; n++) { const old = factorialResult; factorialResult *= n; factorialSteps.push(step(`Return through factorial(${n})`, `The smaller call returned ${old}. Multiply ${n} × ${old} and return ${factorialResult}.`, [lane('Still waiting', Array.from({length: 4 - n}, (_, i) => tile('f' + (4 - i), `factorial(${4 - i})`, 'waiting'))), lane('Returned answer', [tile('f' + n, factorialResult, `${n} × ${old}`, 'done')])], {equation: `${n} × ${old} = ${factorialResult}`})); }
  add('recursion-definition', 'patterns', {heading: 'Recursion:'}, 'Recursion · smaller calls, then returning answers',
    'Recursion solves a problem using calls to the same function on smaller instances. A base case stops the calls; each return completes a waiting computation.',
    'Calls build up first, then answers flow back. A progress measure must move toward the base case.', factorialSteps);
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
    'Merge sort is one concrete instance: the two halves can be sorted independently before merging.', [mergeSteps[0], mergeSteps[1], mergeSteps[2], step('Combine the independent answers', 'Merge [3, 7] with [2, 5]: repeatedly take the smaller front, producing [2, 3, 5, 7].', mergeSteps[5].lanes)]);
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
      const boundary = n => Math.min((n.value.length > 5 ? 70 : 31) / (Math.abs(dx) || 1e-9), 28 / (Math.abs(dy) || 1e-9));
      const start = boundary(a), end = boundary(b);
      const ax = a.x + dx * start, ay = a.y + dy * start;
      const bx = b.x - dx * end, by = b.y - dy * end;
      const line = svg('line', {x1: ax, y1: ay, x2: bx, y2: by, class: 'concept-edge ' + (e.tone || '')});
      if (e.arrow) line.setAttribute('marker-end', `url(#${id}-arrow)`);
      picture.append(line);
      if (e.label) picture.append(svg('text', {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - 9, class: 'concept-edge-label'}, e.label));
    });
    model.nodes.forEach(n => {
      const group = svg('g', {class: 'concept-node ' + (n.tone || ''), 'data-motion-key': n.id, 'data-x': n.x, 'data-y': n.y, transform: `translate(${n.x} ${n.y})`});
      const wide = n.value.length > 5;
      group.append(svg('rect', {x: wide ? -65 : -26, y: -22, width: wide ? 130 : 52, height: 44, rx: wide ? 8 : 21}));
      group.append(svg('text', {x: 0, y: 1}, n.value));
      if (n.caption) group.append(svg('text', {x: 0, y: 36, class: 'concept-node-caption'}, n.caption));
      picture.append(group);
    });
    return picture;
  }
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
    const controls = make('div', 'concept-controls');
    const button = (text, action, cls = '') => { const n = make('button', cls, text); n.type = 'button'; n.dataset.conceptAction = action; controls.append(n); return n; };
    const play = button('▶ Play', 'play', 'primary'), back = button('← Back', 'back'), next = button('Next →', 'next'), reset = button('↺ Reset', 'reset');
    const label = make('label', '', 'Speed'), speed = make('select'); speed.setAttribute('aria-label', 'Animation speed for ' + story.title);
    [['0.5', '0.5×'], ['1', '1×'], ['2', '2×']].forEach(([value, text]) => { const option = make('option', '', text); option.value = value; speed.append(option); }); speed.value = '1'; label.append(speed); controls.append(label); card.append(controls);
    const slider = make('input', 'concept-slider'); slider.type = 'range'; slider.min = '0'; slider.max = String(story.steps.length - 1); slider.step = '1'; slider.value = '0'; slider.setAttribute('aria-label', 'Animation step for ' + story.title); card.append(slider);
    const stage = make('div', 'concept-stage'); stage.setAttribute('aria-label', 'Visual model for ' + story.title); card.append(stage);
    const caption = make('div', 'concept-caption'); caption.setAttribute('role', 'status');
    const captionTitle = make('strong'), explanation = make('p'); caption.append(captionTitle, explanation); card.append(caption);
    const notice = make('p', 'concept-notice'); notice.append(make('b', '', 'What to notice: '), document.createTextNode(story.notice)); card.append(notice);
    card.append(make('p', 'concept-legend', 'Amber = current focus · green = accepted or completed · red = rejected · dim = excluded. Press Play or use Next to move one idea at a time.'));
    if (before) anchor.before(card);
    else { const previous = insertions.get(anchor) || anchor; previous.after(card); insertions.set(anchor, card); }
    let index = 0, timer = null, running = false;
    function pause() { clearTimeout(timer); timer = null; running = false; play.textContent = index === story.steps.length - 1 ? '↻ Replay' : '▶ Play'; play.setAttribute('aria-pressed', 'false'); if (activePlayer === pause) activePlayer = null; }
    function render() {
      const frame = story.steps[index];
      const positions = new Map([...stage.querySelectorAll('[data-motion-key]')].map(n => [n.dataset.motionKey, n.getBoundingClientRect()]));
      stage.replaceChildren();
      if (frame.diagram) stage.append(drawDiagram(frame.diagram, frame.title, story.id));
      if (frame.grid) {
        const work = make('div', 'concept-work'); work.append(make('h5', '', 'Quadratic work · one mark per ordered pair'));
        const grid = make('div', 'concept-work-grid'); grid.style.gridTemplateColumns = `repeat(${frame.grid.size}, 16px)`;
        grid.setAttribute('role', 'img'); grid.setAttribute('aria-label', `${frame.grid.size} by ${frame.grid.size} grid: ${frame.grid.size ** 2} ordered pairs`);
        for (let r = 0; r < frame.grid.size; r++) for (let c = 0; c < frame.grid.size; c++) {
          const mark = make('span'); mark.dataset.motionKey = `pair-${r}-${c}`; mark.setAttribute('aria-hidden', 'true'); grid.append(mark);
        }
        work.append(grid); stage.append(work);
      }
      frame.lanes.forEach(row => {
        const line = make('div', 'concept-lane'); line.append(make('h5', '', row.label));
        const items = make('div', 'concept-items');
        row.items.forEach(item => { const box = make('div', 'concept-tile ' + item.tone); box.dataset.motionKey = item.id; box.append(make('span', 'concept-value', item.value)); if (item.caption) box.append(make('small', '', item.caption)); items.append(box); });
        if (!row.items.length) items.append(make('span', 'concept-empty', '(empty)'));
        line.append(items); stage.append(line);
      });
      if (frame.equation) stage.append(make('div', 'concept-equation', frame.equation));
      captionTitle.textContent = frame.title; explanation.textContent = frame.explain;
      count.textContent = `${index + 1} / ${story.steps.length}`; slider.value = String(index);
      slider.setAttribute('aria-valuetext', `Step ${index + 1} of ${story.steps.length}: ${frame.title}`);
      back.disabled = index === 0; next.disabled = index === story.steps.length - 1;
      if (!running) play.textContent = index === story.steps.length - 1 ? '↻ Replay' : '▶ Play';
      if (!reduced.matches) stage.querySelectorAll('[data-motion-key]').forEach(n => {
        if (typeof n.animate !== 'function') return;
        const previous = positions.get(n.dataset.motionKey), rect = n.getBoundingClientRect();
        if (n.namespaceURI === SVG) {
          // SVG coordinates scale with the diagram; convert screen deltas back.
          const scale = n.ownerSVGElement.getBoundingClientRect().width / 600 || 1;
          const x = Number(n.getAttribute('data-x')), y = Number(n.getAttribute('data-y'));
          if (previous && (previous.left !== rect.left || previous.top !== rect.top)) n.animate([{transform: `translate(${x + (previous.left - rect.left) / scale}px,${y + (previous.top - rect.top) / scale}px)`}, {transform: `translate(${x}px,${y}px)`}], {duration: 650, easing: 'ease-in-out'});
          else if (n.classList.contains('focus')) n.animate([{opacity: 0.45}, {opacity: 1}], {duration: 500, easing: 'ease-out'});
        } else if (previous && (previous.left !== rect.left || previous.top !== rect.top)) n.animate([{transform: `translate(${previous.left - rect.left}px,${previous.top - rect.top}px)`}, {transform: 'translate(0,0)'}], {duration: 650, easing: 'ease-in-out'});
        else if (!previous) n.animate([{opacity: 0, transform: 'translateY(-10px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 400, easing: 'ease-out'});
        else if (n.classList.contains('focus')) n.animate([{transform: 'scale(0.93)', opacity: 0.55}, {transform: 'scale(1)', opacity: 1}], {duration: 450, easing: 'ease-out'});
      });
    }
    function tick() { if (!running) return; index++; render(); if (index === story.steps.length - 1) pause(); else timer = setTimeout(tick, 2600 / Number(speed.value)); }
    function seek(value) { pause(); index = Math.max(0, Math.min(story.steps.length - 1, value)); render(); }
    play.addEventListener('click', () => {
      if (running) { pause(); return; }
      window.dispatchEvent(new Event('dsa-playback-start'));
      if (index === story.steps.length - 1) { index = 0; render(); }
      running = true; activePlayer = pause; play.textContent = 'Ⅱ Pause'; play.setAttribute('aria-pressed', 'true'); timer = setTimeout(tick, 2600 / Number(speed.value));
    });
    back.addEventListener('click', () => seek(index - 1)); next.addEventListener('click', () => seek(index + 1)); reset.addEventListener('click', () => seek(0)); slider.addEventListener('input', () => seek(Number(slider.value)));
    speed.addEventListener('change', () => { if (running) { clearTimeout(timer); timer = setTimeout(tick, 2600 / Number(speed.value)); } });
    card.closest('details.section').addEventListener('toggle', e => { if (!e.target.open) pause(); });
    play.setAttribute('aria-pressed', 'false'); render();
  }
  window.addEventListener('dsa-playback-start', () => { if (activePlayer) activePlayer(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && activePlayer) activePlayer(); });
  window.addEventListener('beforeprint', () => { if (activePlayer) activePlayer(); });
  lessons.forEach(mount);
})();
