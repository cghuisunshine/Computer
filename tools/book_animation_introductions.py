"""Plain-language introductions in the same section order as the source contents."""

SECTION_INTROS = {
0: '''
Data structures organize information, and algorithms describe what to do with it. This book connects those two ideas through definitions, examples, and problem-solving techniques.
A useful study resource should match what you already know and what you want to learn. Previewing its topics helps you choose a starting point and recognize material to revisit later.
The chapters build from basic ways to store data toward methods for solving larger problems. Knowing this progression helps you connect a new technique with the ideas it depends on.
You will use values, variables, comparisons, loops, and functions throughout the book. Reviewing these building blocks makes it easier to focus on an algorithm's behavior rather than its notation.
''',
1: '''
A variable is a name used to refer to a value. In Python, assignment connects a name to an object; assigning a different value changes that connection.
A data type describes a kind of value and the operations it supports. For example, adding two integers computes a sum, while adding two strings joins their characters.
A data structure arranges values so that particular operations are convenient. An ordered sequence, a chain of linked nodes, and a key–value mapping organize information in different ways.
An abstract data type, or ADT, describes the behavior users can rely on. A stack, for example, promises that the most recently added remaining item is removed first, regardless of its internal storage.
An algorithm is a precise, finite procedure for transforming an input into a result. A search algorithm makes this concrete: inspect candidates until a matching item is found or none remain.
Two correct algorithms can need very different amounts of work. Analysis helps explain that difference by counting well-defined operations instead of relying only on how fast one computer happens to run.
The aim of algorithm analysis is to understand how resource use changes as problems grow. This lets you compare approaches and anticipate when an otherwise correct solution will become impractical.
Running-time analysis models how many operations an algorithm performs for an input of size n. The result depends on what counts as one operation and which input conditions are being considered.
To compare algorithms fairly, give them the same task and state their assumptions. Looking at a consistent kind of work makes the comparison easier to explain than comparing unrelated timing measurements.
The rate of growth describes how quickly an algorithm's work increases with input size. A small increase in input can cause a modest, large, or enormous increase in work depending on that rate.
Common growth models include constant, logarithmic, linear, quadratic, and exponential work. These categories help you recognize the scaling patterns behind different algorithms.
Best-case, worst-case, and average-case analysis ask different questions about inputs of the same size. Average-case claims also need a probability model describing which inputs are likely.
Asymptotic notation describes the large-input behavior of functions using simpler comparison functions. It focuses on an eventual relationship rather than exact counts for every small input.
Big-O notation gives an eventual upper bound on growth, up to a constant multiplier. Saying a function is O(n) means that a suitable constant times n bounds it beyond some fixed starting point.
Omega notation gives an eventual lower bound on growth. It shows that, beyond a fixed point, a function stays at least as large as a constant multiple of the comparison function.
Theta notation gives a tight growth classification: matching upper and lower bounds. A function is Θ(n) when constant multiples of n bound it on both sides for sufficiently large n.
Asymptotic analysis looks beyond a finite starting range of inputs. This is useful because setup costs and small-input irregularities can hide the growth pattern that dominates larger problems.
Analyzing an algorithm starts with identifying its input size and counting its repeated work. Only after finding that count should you simplify it into a growth-rate description.
Asymptotic expressions can often be simplified by ignoring constant factors and lower-order terms. The justification is that suitable fixed constants still bound the original function for large enough inputs.
Logarithms often arise when an algorithm repeatedly halves a problem, while summations count work accumulated over many steps. Understanding these patterns turns repeated operations into a manageable mathematical expression.
A recurrence describes a problem's cost in terms of smaller problems of the same kind. The divide-and-conquer Master Theorem applies to a standard family of such recurrences; a recursion-level picture helps explain the result.
To analyze a divide-and-conquer recurrence, identify how many subproblems are created, how much smaller they are, and how much additional work is done. This example works through those ingredients together.
Subtract-and-conquer reduces a problem by a fixed amount, such as one item per call. Its recursive structure is a chain, whose total cost comes from adding the work along that chain.
Small changes to a subtractive recurrence can change how work accumulates. Expanding several calls makes the reduction in problem size and the cost paid at each step visible.
Guessing and confirming means proposing a growth bound, then checking it with a valid argument. Expanding a few recursion levels can suggest a candidate answer and reveal what a proof must establish.
Amortized analysis spreads total cost over a sequence of operations. It explains how a data structure can offer cheap operations on average across a sequence even when an occasional individual operation is expensive.
Operation-count exercises turn source code or a procedure into a mathematical cost model. Start with a small example, count what actually happens, and then describe how the count depends on input size.
''',
2: '''
Recursion solves a problem by calling the same procedure on a smaller instance. Backtracking adds a way to explore alternative choices and undo choices that do not lead to a solution.
A recursive function calls itself with a smaller or simpler problem. It needs a base case that can be answered directly so that the chain of calls eventually stops.
Recursion is useful when a problem naturally contains smaller copies of itself. Towers of Hanoi is a classic example: moving a large stack can be organized around moving a smaller stack first.
A recursive function combines a stopping rule with a reduction rule. The stopping rule answers a simple case; the reduction rule turns a larger case into one or more smaller calls.
Each active recursive call needs to remember its local information and where to resume. These waiting calls form a call stack, which grows during descent and shrinks as results return.
Recursion and iteration are two ways to organize repeated computation. An iterative version can store explicit state instead of relying on a chain of waiting function calls.
Recursive algorithms have both a total work cost and a maximum active depth. These are different quantities: many calls may be made over time without all remaining active at once.
The Towers of Hanoi puzzle moves disks between three pegs while keeping larger disks below smaller ones. Its recursive solution separates the task into smaller moves around one legal move of the largest remaining disk.
A recursive worked example becomes easier when you track what each caller is waiting for. The factorial example shows how a small base-case answer is combined into larger returned answers.
Backtracking searches for a solution by making a choice, exploring its consequences, and undoing it when necessary. A partial choice can be rejected as soon as it violates a required constraint.
The queens puzzle asks you to place queens so that none attack each other. Placing one queen per row turns the puzzle into a sequence of choices that can be checked and reversed.
Backtracking exercises test whether choices are checked, explored, and undone correctly. A failed branch is useful information: it tells the search which alternative to try next.
''',
3: '''
A linked list stores items in separate nodes connected by references. Starting at the head, you reach later items by following links rather than calculating an array index.
The linked-list interface describes operations such as visiting, inserting, and removing items. Understanding the interface separately from the links helps explain what a correct implementation must preserve.
Linked lists and arrays pay for different operations in different ways. Inserting after an already known list node needs little relinking, while locating that node may still require a full traversal.
An array gives each stored position an index. Access by index is direct, but inserting inside the sequence generally requires shifting later items to create a gap.
Arrays, dynamic arrays, and linked lists differ in indexing, insertion, and storage growth. A dynamic array adds spare capacity, allowing many appends to happen before another allocation and copy is needed.
A singly linked node stores a value and a reference to its successor. Insertion and deletion work by carefully changing those successor references without losing the rest of the chain.
A doubly linked list stores references in both directions. This supports moving backward as well as forward, while requiring updates to keep neighboring next and previous links consistent.
In a circular linked list, the last node links back to the first. This is useful for repeated cycling, but traversal must recognize a completed loop instead of waiting to reach an empty link.
An XOR linked list combines two neighboring addresses into one stored value using exclusive-or. Knowing one neighbor lets you recover the other; the idea concerns low-level addresses rather than ordinary Python object references.
An unrolled linked list stores several items inside each linked block. This combines a chain of blocks with local positions inside a block and reduces the number of separate links needed.
A skip list adds higher-level links above an ordered base list. Those links allow a search to jump past groups of keys, then descend when a jump would overshoot the target.
Linked-list exercises are often about preserving a reachable chain while changing a few links. A small insertion-and-removal trace helps you see which references need updating and which should stay unchanged.
''',
4: '''
A stack stores items in last-in, first-out order. Think of a pile of plates: the most recently added remaining plate is the first one you can remove.
Stacks remember work that must be handled in reverse order. Their one-end access pattern appears in function calls, expression processing, and algorithms that need to return to a recent state.
The stack ADT defines push, pop, and top operations. An array or a linked chain can implement those operations as long as both give the same last-in, first-out behavior.
Balanced brackets must close in the reverse order of their matching openings. A stack records unmatched opening brackets so that each closing bracket can be checked against the right one.
Implementing a stack means deciding how to store its items and how to detect an empty stack. A correct push or pop changes the top while preserving the order of all remaining items.
Different stack implementations can have different allocation and memory costs. An array-backed stack may occasionally resize, so the cost of one expensive push differs from the average over many pushes.
A stack can turn a nesting problem into a sequence of local checks. In this worked example, each closing bracket is matched with the latest opening bracket that has not yet been closed.
''',
5: '''
A queue stores items in first-in, first-out order. New items join the rear, while removal serves the item that has been waiting at the front the longest.
Queues model work that should be processed in arrival order. A service line makes the rule visible: later arrivals wait behind people who are already in the line.
The queue ADT promises enqueue and dequeue operations with first-in, first-out behavior. Its physical storage can vary while its logical arrival order stays the same.
An empty queue has no front item to return. Implementations need a defined response to invalid removal, such as reporting failure or raising an exception.
Breadth-first search uses a queue to process a graph in outward layers. Vertices discovered earlier are handled first, which produces shortest edge-count distances in an unweighted graph.
A circular-array queue reuses slots by wrapping its indices around the array. The logical front-to-rear order can cross the physical boundary between the last slot and slot zero.
Ring-buffer exercises ask you to track both logical order and physical indices. Watching several arrivals and departures shows why a separate count or another full/empty rule is needed.
''',
6: '''
A tree represents a hierarchy: one root leads to children and their descendants. Each non-root node has one parent, and following child links does not create a cycle.
Tree vocabulary describes both relationships and positions. A node's depth is its distance from the root, a leaf has no children, and height describes the longest downward path.
A binary tree allows at most two children per node, conventionally called left and right. The two positions are distinct even if one position is empty.
Terms such as full, complete, and perfect describe different shapes of binary trees. They are related conditions, but satisfying one does not automatically mean every other condition holds.
Binary-tree properties connect the shape of a tree with counts of nodes, levels, and leaves. For example, a level at depth d can contain no more than 2ᵈ nodes.
A traversal visits every node of a tree in a defined order. Preorder, inorder, postorder, and level order differ in when a parent is visited relative to its children.
A general, or N-ary, tree allows a node to have more than two children. Its traversal can visit an ordered list of child subtrees instead of assuming just left and right positions.
A threaded binary tree uses some otherwise empty links to record traversal successors or predecessors. Tags identify these special links so that traversal can distinguish them from actual children.
An expression tree stores operands as leaves and operators above the expressions they combine. Building one from postfix notation shows why a stack must preserve operand order.
The XOR-tree representation combines a parent address with each child address. Remembering one endpoint lets traversal decode the other, allowing low-level navigation with encoded references.
A binary search tree organizes keys by comparisons: smaller keys go left and larger keys go right. This ordering can reduce a lookup to one root-to-leaf path.
A balanced search tree controls its height so that operations do not degrade into walking a long chain. Rotations rearrange local links while keeping the keys in the same sorted order.
An AVL tree is a binary search tree whose two child subtrees differ in height by at most one at every node. Insertions can require a rotation to restore that height rule.
Tree families use different shape and ordering rules to support different workloads. Comparing their structural promises helps explain why one representation may be preferable for a particular operation.
Traversal questions ask you to apply a visit rule consistently through a tree. Postorder provides a useful example because each parent must wait until both child subtrees have been processed.
''',
7: '''
A priority queue serves the item with the most urgent priority rather than the earliest arrival. A min-priority queue treats the smallest key as the next item to return.
The priority-queue interface includes adding items and retrieving an extreme-priority item. A heap is one way to provide that behavior without keeping every stored item fully sorted.
Scheduling and best-first exploration often need the next most important item. A priority queue keeps that choice accessible even while new items continue to arrive.
A priority queue can use several internal representations with different costs. A binary heap balances a compact array layout with local repairs during insertion and removal.
A heap is a partially ordered tree, often stored in an array. In a min-heap, every parent is no larger than its children, so the minimum is available at the root.
A binary heap combines a complete binary-tree shape with a parent–child ordering rule. Insertion and extraction restore that ordering by moving one item along a tree path.
Heapsort repeatedly removes an extreme value from the active heap and places it in its final sorted position. A max-heap makes the sorted suffix grow from the right end of the array.
Priority-queue exercises combine additions with requests for the next minimum or maximum. Tracking the heap after each change shows why local repairs are enough to prepare the next extraction.
''',
8: '''
Disjoint sets organize elements into nonoverlapping groups. The main operations create a group, find an element's group representative, and merge two groups.
An equivalence relation groups elements that are considered related in a consistent way. Each equivalence class can be represented as one of the disjoint sets maintained by union–find.
The disjoint-set ADT provides MAKESET, FIND, and UNION. Many implementations use a representative to answer whether two elements currently belong to the same group.
Union–find is useful when connectivity changes through a sequence of merges. In spanning-tree construction, it quickly answers whether a candidate edge joins separate components or closes a cycle.
Union–find implementations trade work between finding a group and merging groups. Direct component labels make lookup simple, while parent-pointer trees make a merge change fewer stored entries.
Quick-find stores a component label for each element. Finding a component reads one label, but joining components may require changing the labels of many elements.
Quick-union represents each component as a tree of parent pointers. A union attaches one representative to another; a find follows links until it reaches the root.
Changing one root pointer can merge two entire components, making union structurally simple. Without a balancing rule, however, repeated unions can leave long paths for future finds.
Weighted union attaches a smaller tree beneath a larger tree, or uses a related rank rule. The goal is to prevent unnecessary height growth and keep future representative searches short.
Path compression shortens a find path by pointing visited elements directly at the representative. It preserves component membership while making later searches through those elements cheaper.
A union–find worked example combines merging with repeated representative searches. Watching parent pointers change helps distinguish changes in storage from changes in actual group membership.
''',
9: '''
A graph models entities as vertices and relationships as edges. It can represent networks, routes, dependencies, and many other problems where connections matter more than a simple sequence.
Graph vocabulary describes connections and routes: adjacent vertices share an edge, a path follows edges, and a cycle returns to its starting point. Direction and weights add information to those relationships.
Graphs turn real relationships into a structure that algorithms can explore. For a routing example, vertices can represent locations and edge weights can represent the cost of traveling between them.
An edge list, an adjacency list, and an adjacency matrix store the same graph in different forms. The choice changes memory requirements and which questions are cheap to answer.
A graph traversal systematically explores reachable vertices. Keeping track of discovery prevents cycles and repeated connections from causing the algorithm to revisit the same work indefinitely.
A topological ordering places every prerequisite before the task that depends on it. Such an ordering exists for a directed graph precisely when the graph has no directed cycle.
A shortest-path algorithm finds routes of minimum total cost. Different methods support different edge-weight assumptions and may solve routes from one start or between every pair of vertices.
A minimum spanning tree connects all vertices of a connected undirected graph with the smallest possible total edge weight. Its objective concerns the whole connection network rather than just one route.
Graph exercises often combine a frontier, a visited set, and saved discovery edges. A depth-first trace shows how a complete branch is explored before earlier choices are resumed.
''',
10: '''
Sorting rearranges a sequence so that its keys follow an order, such as smallest to largest. A correct sort changes positions while preserving the input's values and their multiplicities.
Sorted data makes some operations much easier, including finding ranges and searching by repeatedly discarding half the candidates. The benefit must be weighed against the cost of first creating or maintaining that order.
Sorting algorithms can be classified by the operations they use, their storage needs, and whether equal-key items keep their original order. These properties help explain which workloads an algorithm suits.
A single sorting algorithm can belong to several classifications at once. For example, merge sort is both comparison-based and divide-and-conquer, while its usual implementation also uses additional storage.
Bubble sort repeatedly compares neighboring items and exchanges an out-of-order pair. Large items move toward the end through successive local swaps.
Selection sort builds a sorted prefix by repeatedly choosing the smallest remaining item. Each pass scans the unsorted suffix before placing its minimum at the next output position.
Insertion sort grows a sorted prefix one item at a time. It holds the next key aside, shifts larger prefix items to the right, and puts the key into the resulting gap.
Shell sort performs insertion-like passes over positions separated by a gap. Large gaps move badly misplaced items farther, and the final gap of one finishes the sorting process.
Merge sort splits a sequence into smaller pieces, sorts those pieces, and merges their results. Two already sorted runs can be combined by repeatedly choosing the smaller available head.
Quick sort chooses a pivot and partitions the sequence around it. The pivot reaches its final sorted rank, after which the two remaining sides can be sorted separately.
Tree sort inserts the keys into a binary search tree and reads them back with inorder traversal. Its performance depends on the shape of the constructed search tree.
Sorting methods differ in comparisons, movements, storage, and behavior on particular inputs. A useful comparison specifies the same task and cost model before drawing conclusions about efficiency.
Some sorting methods use properties of the keys rather than relying solely on pairwise comparisons. Integer keys in a modest range, for example, can be organized by counting their occurrences.
Counting sort records how many times each possible integer key occurs. Reading those counts in key order reconstructs the sorted sequence without repeatedly comparing pairs of input items.
Bucket sort divides a key range into ordered groups, then sorts within each group. Concatenating the sorted buckets works because every earlier bucket contains smaller keys than every later bucket.
Radix sort handles keys one digit or position at a time. A stable pass preserves the order established by earlier passes, allowing several simple digit groupings to produce a full numeric order.
Topological sorting orders tasks according to dependencies instead of comparing numeric key values. Every directed edge must lead from an earlier task in the output to a later one.
External sorting is used when all the data cannot fit in working memory. A common strategy creates manageable sorted runs and then merges them while controlling data movement between memory and storage.
Sorting exercises ask you to follow both rearrangements and the rule that makes progress possible. A partition example shows how one pivot can settle into place while smaller unresolved problems remain.
''',
11: '''
Searching asks whether a target key occurs in a collection and, often, where it occurs. A search ends with either a verified match or a reason every possible candidate has been ruled out.
Lookup is a basic operation behind retrieval, membership checks, and matching records to requests. The storage order and available operations determine which search methods are suitable.
Search methods use different information about their inputs. A sequential scan can work on arbitrary order, while binary or interpolation search relies on sorted keys.
Unordered linear search checks items one at a time without assuming anything about their arrangement. If no item matches, it must reach the end before declaring failure.
An ordered linear search still scans sequentially, but sorted input gives it an extra stopping rule. Once the current key exceeds the target, later keys cannot match that smaller target.
Binary search works on sorted data by keeping an interval of possible positions. Each comparison either finds the target or eliminates the half that cannot contain it.
Interpolation search estimates a target's position using its value relative to the endpoint values. It uses sorted numeric keys and can benefit when those keys are spread fairly uniformly.
Comparing search methods means comparing both their work and their assumptions. Sorting, key distribution, successful versus unsuccessful searches, and the chosen cost model can all affect the conclusion.
A symbol table associates keys with values, and hashing helps locate a key by computing a table position. Collisions still require checking actual stored keys.
String searching looks for a smaller character sequence inside a larger one. The pattern may begin at different alignments, so a method must check or safely eliminate those possibilities.
Search exercises often expose boundary mistakes: missing first or last items, repeated keys, or absent targets. A careful interval trace shows how each update preserves valid candidates and makes progress.
''',
12: '''
Selection finds an item of a requested rank, such as the median, without necessarily ordering every other item. A rank specifies how many sorted positions precede the desired answer.
Sorting first is a straightforward way to select an item: create the complete order, then read the requested position. It is simple but does more ordering work than selection alone requires.
Partition-based selection uses a pivot's sorted rank to narrow the problem. Only the side containing the requested rank needs further processing; the other side can stay unsorted.
Median-of-medians is a deterministic way to choose pivots for selection. It groups keys into small sets and uses their medians to guarantee useful partition balance in the worst case.
Finding several smallest items in sorted order combines selection with ordered output. A min-heap provides one approach by exposing the smallest remaining key at each extraction.
An order-statistic exercise asks for a rank rather than a complete sort. Following partition boundaries makes it clear why only part of the input remains relevant after each pivot is placed.
''',
13: '''
A symbol table keeps associations between keys and their current values. It is the general idea behind a dictionary used to look up a score, a name's meaning, or another stored record.
Symbol-table operations typically include storing a binding, retrieving a value, updating a key, and deleting a key. A key identifies one current binding rather than a separate entry for every update.
Several data structures can implement a symbol table. A hash-table example shows one way to turn a key into a smaller set of possible storage locations.
Symbol-table implementations make different tradeoffs between lookup, updates, storage, and ordered operations. A binary search tree adds a key-order structure that can support sorted output and range-based tasks.
''',
14: '''
Hashing computes a storage location from a key. It helps narrow a lookup to one slot or bucket, while leaving a collision policy to handle different keys that select the same location.
Hashing can make exact-key lookup convenient without maintaining a sorted sequence. Its efficiency depends on how keys are distributed and how full the table becomes.
The hash-table interface behaves like a key–value map. Its users need correct insertion, lookup, update, and deletion behavior even though the implementation uses computed storage locations.
A hash-table operation combines a key, a hash function, a table, and a rule for collisions. Following these pieces in order explains both where an item goes and how it can be found later.
The hash function chooses a location, the table provides storage, and the collision policy resolves competition for that location. These components must work together consistently.
A hash table has indexed storage locations, but those indices are not the user's keys. Several keys can map to the same index, and a bucket can hold more than one entry.
A hash function transforms a key into a hash value or table index. The simple modulo example makes the calculation visible and deliberately produces collisions that need handling.
The load factor measures how full a hash table is: the number of entries divided by the number of storage locations. Controlling this ratio helps keep the expected amount of collision work manageable.
A collision happens when different keys select the same hash-table location. The keys are still distinct and must remain distinguishable during insertion and lookup.
Collision resolution specifies what to do when a preferred location is already in use. Chaining stores a group at that location, while open addressing looks for another slot in the table.
Separate chaining gives each table location a container of entries. Keys that hash to the same location share that container and are distinguished by comparing their full keys.
Open addressing stores entries directly in table slots. When a collision occurs, a probe sequence specifies other slots to inspect for storage or lookup.
Collision strategies change both memory layout and the work needed after a collision. Comparing a chain with a cluster of probed slots makes that tradeoff easier to picture.
Expected constant-time hashing relies on assumptions about distribution and table fullness. It does not mean that every possible operation on every possible input has constant worst-case cost.
Hashing techniques include different ways to compute locations and resolve collisions. Linear probing is one concrete policy: inspect successive slots and wrap around the table when necessary.
Hashing is designed for exact-key access and does not inherently maintain sorted order. Tasks such as ordered iteration or range queries can benefit from a search tree instead.
A Bloom filter is a compact, approximate membership structure using several hash-selected bits. It can prove absence, but a positive result means only that the item might be present.
Hashing exercises often place several keys into a deliberately small table. Tracking repeated collisions helps verify that the collision policy still stores and retrieves each distinct key correctly.
''',
15: '''
String algorithms process ordered character sequences. Many tasks involve finding a pattern, sharing common prefixes, or organizing words so that particular lookups become easier.
String matching asks where a pattern occurs inside a text. Different algorithms reduce repeated checking by using hashes, previously matched prefixes, or information about mismatched characters.
Brute-force matching tries each possible pattern alignment and compares characters from the beginning. A failed comparison moves the candidate alignment one position forward.
Rabin–Karp matching compares hash values for the pattern and each text window. Matching hashes identify candidates, but actual characters must still be checked because different strings can share a hash.
A string-matching automaton summarizes progress using a state, often the length of the matched pattern prefix. Reading a character changes the state while preserving any useful partial match.
Knuth–Morris–Pratt, or KMP, remembers which prefixes are also suffixes of earlier matches. On a mismatch, that information changes the pattern position without moving the text pointer backward.
Boyer–Moore-style matching compares from the right end of an alignment and can skip several candidate positions. This example focuses on its bad-character rule for choosing a safe shift.
Strings can be stored as whole keys or organized through shared character paths. The storage structure determines how much prefix information a lookup can reuse.
A hash table can store strings as keys by computing a numeric hash from their characters. Anagrams or unrelated strings can collide, so exact lookup still compares the complete strings.
A binary search tree can compare whole strings in lexicographic order. At each node, the target follows the branch determined by its ordering relative to the stored word.
A trie stores words along paths of character edges. Words with the same prefix share the beginning of their paths, and terminal markers distinguish complete words from prefixes.
A ternary search tree compares one character at a time using three branches. Left and right compare alternative characters at the same position; the middle branch advances to the next character after an equal match.
BSTs, tries, and ternary search trees organize string comparisons differently. Looking at prefix sharing helps explain how they divide the work of locating a word.
A suffix tree organizes the suffixes of a string using compressed edge labels. The expanded suffix trie shown here makes the underlying idea visible before nonbranching paths are compressed.
String-matching exercises often include repeated and overlapping prefixes. A KMP example shows how saved prefix information prevents a mismatch from discarding all previously useful work.
''',
16: '''
Algorithm design techniques provide reusable ways to organize a solution. Greedy choice, divide and conquer, and dynamic programming handle decisions and subproblems in different ways.
Algorithms can be classified along several independent dimensions, including how they execute and how their solutions are designed. A useful classification explains a particular property rather than replacing the algorithm itself.
An implementation method describes how computation is carried out, such as using recursive calls or explicit iteration. The same problem-solving strategy can sometimes be implemented in either form.
A design method describes how a problem is broken down or how choices are made. Recognizing the structure of subproblems helps you choose an appropriate technique and its correctness argument.
An algorithm can carry several valid labels at once. Merge sort, for example, uses comparisons to order keys and a divide-and-conquer strategy to organize its work.
''',
17: '''
A greedy algorithm repeatedly makes a locally preferred choice and commits to it. This can give an optimal answer for some problems, but only when the choice rule has a suitable correctness argument.
A greedy strategy needs a precise rule for choosing the next candidate. For maximum-count interval scheduling, choosing the earliest finishing compatible activity leaves room for future activities.
The ingredients of a greedy method include candidates, a feasibility test, a choice rule, and an objective. A choice can be allowed by the constraints without being best for the final objective.
A greedy rule does not automatically work for every input or problem. A small counterexample can show that an appealing local decision leads to a worse overall answer.
Greedy methods often have simple, efficient decision rules. Their limitation is that committing early can lose an optimal solution when the problem does not support that choice rule.
Interval scheduling is a practical greedy application: choose as many nonoverlapping activities as possible on one resource. Ordering by finishing time provides a safe next-choice rule for that objective.
Understanding a greedy algorithm means explaining why each accepted local choice is safe. A step-by-step schedule makes both accepted intervals and overlap-based rejections visible.
Counterexamples are a useful tool in greedy exercises. For coins 1, 3, and 4, making amount 6 shows why repeatedly taking the largest usable coin can fail to minimize the number of coins.
''',
18: '''
Divide and conquer solves a problem by splitting it into smaller instances, solving those instances, and combining their answers. Merge sort provides a concrete example of this three-part pattern.
The divide-and-conquer strategy needs both a meaningful split and a correct way to combine answers. Smaller subproblems alone are not enough unless their results can solve the original task.
Dividing a task does not guarantee a good or correct solution. You must show that the smaller tasks contain the required information and that their combination produces the desired final answer.
A recursion-level picture shows how a large problem produces many smaller problems. Counting work across those levels helps explain the time cost of a divide-and-conquer algorithm.
Following an actual split and merge makes divide and conquer less abstract. The work alternates between creating smaller problems and combining completed answers.
Independent subproblems can make a solution easier to reason about and, in suitable settings, easier to parallelize. Those benefits depend on the problem's structure and the cost of combining its results.
Divide and conquer introduces calls, levels, and sometimes extra storage or copying. These costs need to be counted along with the work done inside each subproblem.
The Master Theorem analyzes a standard family of divide-and-conquer recurrences. Its ingredients are the number of recursive calls, their size reduction, and the work performed outside them.
Sorting is a common application of divide and conquer. Once two halves are individually sorted, a merge can combine them into a sorted answer for the whole input.
A one-dimensional peak is a value at least as large as its existing neighbors. By comparing a middle value with a neighbor, an algorithm can discard half the candidates while keeping a peak on the remaining side.
A two-dimensional peak is at least as large as its orthogonal neighbors. Choosing a column maximum first handles the vertical comparisons, leaving horizontal neighbors to guide the next search region.
Peak-finding exercises show how an algorithm can preserve the existence of a valid answer without keeping every candidate. The required answer is a local peak, so it need not be the largest value in the entire array.
''',
19: '''
Dynamic programming solves related subproblems and stores their results for reuse. Its main benefit appears when the same states would otherwise be recomputed many times.
A dynamic-programming strategy defines states, base cases, and a recurrence connecting them. Evaluating states in a suitable order turns those dependencies into a computation.
Useful DP states capture enough information for later decisions, and optimal solutions must be expressible through the chosen smaller states. The 0/1 knapsack example makes these requirements concrete.
Greedy methods commit to a local choice, divide and conquer solves smaller pieces, and DP reuses results for overlapping states. Recognizing which structure a problem has helps avoid applying the wrong strategy.
Dynamic programming is not a universal solution method. It requires a useful state representation and a correct recurrence, and the resulting number of states must still be manageable.
DP can be evaluated from the top down with saved results or from the bottom up in dependency order. The bottom-up example starts from base cases and fills only states whose inputs are already known.
A small coin-change problem shows how to turn a goal into reusable smaller goals. For each amount, try every allowed final coin and use the best already solved remaining amount.
DP examples differ in what a table entry means, but each needs that meaning to stay consistent. The 0/1 knapsack table records the best achievable value for a prefix of items and a capacity limit.
A longest common subsequence preserves character order in two strings while allowing gaps. DP compares prefixes of the strings to build the best possible common-subsequence length.
A DP worked solution requires more than filling numbers: you must explain what each state means and how dependencies justify it. LCS also shows how a completed table can be used to recover an actual answer.
''',
20: '''
Complexity classes organize decision problems by the computational resources needed to solve or verify them. Distinguishing the task from one proposed solution is important before comparing classes.
Polynomial and exponential models grow very differently as input size increases. A fixed power such as n² scales much more gently than a quantity such as 2ⁿ whose exponent grows with n.
A decision problem asks a yes-or-no question about an input. For example, a graph-coloring question asks whether a coloring meeting the stated constraints exists.
A decision procedure is an algorithm that always terminates with the correct yes-or-no answer. Checking a proposed witness illustrates a smaller verification task associated with some decision problems.
A complexity class is a collection of problems defined by a resource bound and a model of computation. P and NP concern polynomial-time solution and polynomial-time verification of YES certificates, respectively.
P, NP, co-NP, NP-hard, and NP-complete describe different relationships between solving, verification, complements, and reductions. In particular, NP membership alone does not mean a problem is known to be difficult.
A reduction transforms instances of one problem into instances of another while preserving the relevant answer. The direction matters: a solver for the destination problem can then help solve the original problem.
Certificate exercises ask whether a proposed answer satisfies all the required constraints. Efficiently checking a supplied witness is different from searching through possible witnesses to find one.
''',
21: '''
Binary representations give another way to inspect and manipulate integer values. The chapter's bitwise examples operate directly on individual bit positions rather than treating an integer only as a decimal quantity.
Bitwise AND, OR, XOR, and shifts combine or move binary digits according to simple rules. A small binary example helps connect each operator with the numerical result it produces.
'''
}

CHAPTER_INTROS = {
0: 'This opening chapter explains the book’s scope, progression, and prerequisites. Use it to connect the topics you will study and decide which foundations to review first.',
1: 'The introduction builds the vocabulary for discussing algorithms: values, data structures, running time, growth bounds, and recurrences. Counting and comparing work is the central theme of this chapter.',
2: 'This chapter studies algorithms that solve smaller versions of a problem and searches that undo choices. Call stacks and backtracking states make the flow of control visible.',
3: 'Linked lists organize values as nodes joined by references. This chapter examines how different link layouts affect traversal, insertion, deletion, and storage.',
4: 'Stacks expose the most recently added remaining item. This chapter connects that access rule with implementations and applications such as remembering nested or unfinished work.',
5: 'Queues preserve arrival order while adding at one end and removing at the other. This chapter follows that logical order through several implementation choices.',
6: 'Trees organize data hierarchically. This chapter introduces tree vocabulary, traversal orders, search ordering, and variations that maintain additional structural rules.',
7: 'Priority queues choose the next item by priority. Binary heaps implement that choice with a complete-tree layout and local repairs that avoid fully sorting every stored key.',
8: 'Union–find maintains groups that only merge. Component labels, parent pointers, balancing rules, and path compression provide different ways to keep representative searches efficient.',
9: 'Graph algorithms work with networks of vertices and edges. This chapter explores discovery, dependencies, routes, and low-cost ways to connect an entire network.',
10: 'Sorting creates an ordered sequence while preserving its input keys. The chapter compares different ways to build that order and the assumptions each approach uses.',
11: 'Searching identifies a matching item or proves that no match exists. The storage order and information available about the keys determine which candidates can be discarded safely.',
12: 'Selection finds a requested rank without necessarily sorting the whole input. This chapter uses pivots, groups, and ordered extraction to narrow the work to the desired answer.',
13: 'Symbol tables associate keys with values. This chapter studies the mapping operations and the tradeoffs between storage structures that can implement them.',
14: 'Hashing narrows a lookup by calculating a key-derived location. The chapter connects hash functions, load, and collision rules with correct storage and retrieval.',
15: 'String algorithms find patterns and organize words by character information. This chapter shows how saved matches, hashes, and shared prefixes reduce or reorganize search work.',
16: 'Design techniques describe reusable patterns for constructing algorithms. This chapter compares ways to make decisions, split problems, and reuse smaller results.',
17: 'Greedy algorithms commit to locally preferred choices. The chapter explores when that can be justified and how a small counterexample can expose an unsafe choice rule.',
18: 'Divide and conquer combines a split, smaller solutions, and a combining operation. The chapter follows that structure through algorithms and their recurrence-based cost analysis.',
19: 'Dynamic programming stores useful subproblem results instead of recomputing them. The chapter focuses on choosing states, writing recurrences, and evaluating dependencies in a valid order.',
20: 'Complexity classes describe families of decision problems rather than individual examples. The chapter distinguishes finding answers, verifying certificates, and translating between problems.',
21: 'The final chapter introduces additional tools for algorithmic thinking. Its bitwise examples show how integer representations support operations on individual binary digits.'
}

FRONT_INTROS = {
    'Front matter': 'The opening pages introduce the book and provide ways to orient your study. This guide connects representations, operations, and algorithms before the numbered chapters begin.',
    'Title page': 'The book brings data structures and algorithmic problem solving together. This short guide previews how organized data, allowed operations, and a sequence of steps contribute to a result.',
    'Acknowledgements': 'A teaching resource grows through explanation, implementation, review, and revision. This conceptual sequence offers a simple way to think about the collaboration behind a resource.',
    'Preface': 'Studying an algorithm is easier when reading is combined with prediction and checking. The guide introduces a repeatable learning cycle you can use throughout the animation companion.',
    'Complexity cheat sheets': 'A complexity cheat sheet summarizes common scaling patterns. The animation supplies a small numerical example so that labels such as logarithmic or quadratic connect with actual changes in modeled work.',
    'Printed table of contents': 'The contents provide a route through chapters and their sections. This guide shows how to move from a broad topic to an example, then back to the book’s original context.',
    'References': 'References provide the sources behind definitions, results, and techniques. Following a claim back to its source helps you check the assumptions under which it is meant to apply.'
}

# The second part of each introduction explains the actual model on screen.
# Guides avoid fixed editable input values so they remain true after Run example.
ANIMATION_GUIDES = {
    'roadmap': ('Four cards represent stages of a reading or problem-solving process. Each step highlights the next stage and explains its role.', 'Read the highlighted card, then connect it with the stage before and after it.'),
    'variables': ('The example starts with x referring to 4, gives y the same reference, and then rebinds x to 9. Arrows show which object each name refers to.', 'Changing x’s arrow does not change the integer 4 or y’s reference to it.'),
    'types': ('The example compares integer addition, string concatenation, and a list operation. Similar-looking values produce different results because their types differ.', 'Ask what each operation means for the displayed type before predicting its result.'),
    'adt': ('An array and a linked chain implement the same small stack. Both receive a push and return the same item when popped.', 'Compare the returned values, not just the different storage pictures.'),
    'growth': ('The bars compare six operation-count models at increasing input sizes. Labels show the actual counts; a logarithmic height scale keeps the fastest-growing bar from hiding the others.', 'Compare how each count changes as n increases. These are modeled operations, not measured seconds.'),
    'bounds': ('The three bars show 3n, the function 3n + 2, and 4n at several input sizes. The example turns the bound into a direct numerical comparison.', 'Read the bar labels to see which constant multiple is a lower or upper bound.'),
    'analysis': ('The example scans a sequence for its final item and counts comparisons. It then contrasts the work needed when a successful target appears at different positions.', 'One visited item contributes one comparison. Keep input size separate from the target’s location.'),
    'summation': ('The example adds 1 through 6, one term at a time. A triangular grid connects the growing total with the formula n(n + 1)/2.', 'Match the new term with the increase in the accumulated sum.'),
    'master': ('Rows show the subproblem sizes for T(n) = 2T(n/2) + n, starting from size 8. Each successive row contains twice as many calls of half the size.', 'Multiply the number of calls by their individual size, then count how many levels contribute work.'),
    'amortized': ('Eight appends fill a small array that doubles its capacity when full. Counters include both writing a new item and copying existing items during growth.', 'Notice the expensive resize steps, then compare total work with the number of completed appends.'),
    'recursion': ('The example computes factorial for the selected size. A row shows waiting calls; returning answers appear as those calls leave the stack.', 'Follow the most recent call down to the base case, then watch answers travel back to earlier callers.'),
    'hanoi': ('Three rows represent pegs A, B, and C, with disk sizes stored from bottom to top. The example moves the full stack from A to C.', 'Only a row’s last disk can move. Check that each peg still keeps larger disks below smaller ones.'),
    'backtrack': ('A 4-by-4 board shows one attempted queen placement at a time. Conflicting candidates are rejected, and failed partial arrangements are undone.', 'After a rejection or return, see which earlier choices remain and which choice is tried next.'),
    'array': ('A row shows indexed array positions. The example creates a gap at index 1 by moving later values to the right, then writes a new value into that gap.', 'Follow the shifts from right to left so that an unread value is not overwritten.'),
    'linked': ('Nodes show stored values and arrows show their traversal links. The example visits the chain, inserts 99 after a known node, then removes that inserted node.', 'Watch the few arrows that change while the unaffected nodes retain their order.'),
    'unrolled': ('Rows represent blocks of several values. Inserting into a full block creates an overflow, followed by redistribution into two linked blocks.', 'Separate a value’s position within its block from the block’s place in the overall list.'),
    'skip': ('Three rows show the same ordered keys at different link levels. A search for 17 uses upper-level jumps before dropping to more detailed lower levels.', 'At each step, decide whether the next jump would overshoot 17 or whether another rightward move is safe.'),
    'stack': ('The example pushes 4, 7, and 9, then pops them. The right end of the row is the stack top; another removal after the row empties illustrates underflow.', 'Predict the next returned value from the rightmost remaining item.'),
    'brackets': ('The input is the nested expression ([{}]). A second row stores opening brackets that have not yet been matched with a closer.', 'Each closing bracket must match the stack’s rightmost opener; the final stack must be empty.'),
    'queue': ('Ada, Lin, and Sam arrive in that order. One row shows those waiting, and another records the order in which they are served.', 'Compare the front of the waiting row with the next name added to the served row.'),
    'circularqueue': ('Five physical slots hold a queue while front, rear, and count are tracked. Arrivals and departures eventually make the rear index wrap back to zero.', 'Read the queue from front using count items; physical slot zero is not always the logical beginning.'),
    'tree': ('A seven-node tree gives a concrete root, two child levels, and four leaves. Highlighting moves between nodes while their depths are explained.', 'Count edges from the root to the highlighted node and distinguish leaves from internal nodes.'),
    'treevariants': ('Small diagrams contrast a four-child general tree with several binary-tree shapes. They show examples of binary, full, perfect, and complete structures.', 'Check the stated shape condition instead of assuming that all the tree labels mean the same thing.'),
    'nary': ('The root R has four children, and child A has two of its own. The example visits each node before recursively visiting its children in stored order.', 'Watch the output grow as one complete child subtree finishes before the next begins.'),
    'traversal': ('A fixed seven-node binary tree keeps the structure unchanged while visited values are appended to an output row. The chosen visit rule determines their order.', 'Compare the moment a parent is emitted with the moments its child subtrees are processed.'),
    'threaded': ('The example walks a seven-node tree in inorder. Extra arrows labeled thread indicate successor links used where a real right child is absent.', 'Distinguish a successor thread from a child link and follow it only when its tag permits that interpretation.'),
    'bst': ('The input keys are inserted into an initially empty search tree. Each comparison chooses a branch; the final inorder output shows the resulting key order.', 'At each highlighted node, predict whether the next key belongs on the left or the right.'),
    'stringbst': ('The example inserts CAT, DOG, CAR, ANT, COW, and BAT into a search tree. Whole words are compared lexicographically when choosing branches.', 'Read the comparison as a word-order decision and check the final sorted word sequence.'),
    'avl': ('The keys 30, 20, and 10 create a left-left imbalance. A right rotation makes 20 the local root while leaving the sorted key order unchanged.', 'Compare the links and heights before and after rotation; the inorder sequence should stay 10, 20, 30.'),
    'expression': ('The postfix tokens 2 3 4 * + are turned into operand subtrees and operator nodes. The final tree represents 2 + (3 × 4).', 'For an operator, the first popped subtree is the right operand and the next is the left operand.'),
    'xortree': ('Illustrative integer addresses encode parent XOR left-child and parent XOR right-child. A known endpoint is then used to recover the other endpoint of a link.', 'Check each XOR calculation and identify which address is already known before decoding another.'),
    'heap': ('Input keys are inserted into a min-heap. The diagram and array show upward repairs; removing the minimum then illustrates downward repair from the root.', 'The root is the minimum. Check parent–child comparisons rather than expecting the whole array to be sorted.'),
    'union': ('Rows show elements and their current parent pointers. Several unions merge components; a find follows pointers until an element points to itself.', 'Trace the whole parent path to identify the representative, rather than treating every stored parent as a root.'),
    'graph': ('Six labeled vertices and their edges form a small network. The example adds connections, interprets weights, and highlights a cycle.', 'Read an edge as a relationship and its label as a cost; a cycle can provide alternative routes.'),
    'representation': ('One network is displayed as edges, neighbor lists, and a matrix. Matrix row and column labels identify the endpoints of each stored weight.', 'Find the same edge in each representation and notice how the required storage is organized.'),
    'graphwalk': ('The graph starts from A and records visited vertices and saved discovery edges. A frontier or active path shows which exploration step will happen next.', 'Separate a vertex that has been discovered from the order in which vertices are actually processed.'),
    'topological': ('A directed graph models tasks and prerequisites. Indegree counts measure unfinished prerequisites, and a ready list holds tasks whose counts have reached zero.', 'A task enters the output only after all of its incoming prerequisites have been released.'),
    'shortest': ('Starting from A, the example keeps one tentative distance for each vertex. It finalizes the least remaining distance and tests routes through that vertex.', 'A better candidate route replaces a stored distance. The graph here has nonnegative edge weights.'),
    'bellman': ('A directed graph includes a negative edge but no negative cycle. The example repeatedly scans edges and updates a distance when a cheaper route is found.', 'Watch improvements propagate across a pass and notice when an entire pass makes no further change.'),
    'floyd': ('Rows and columns identify start and destination vertices. The matrix initially holds direct-edge costs, then allows one additional intermediate vertex at a time.', 'For a highlighted entry, compare the current route with the route through the newly allowed intermediate vertex.'),
    'mst': ('The example selects edges from a weighted, connected graph until five selected edges connect all six vertices. A counter records their combined weight.', 'Check that each accepted edge connects something new without creating a cycle.'),
    'sort': ('Bars and indexed rows represent the numeric input. Each step shows a comparison, movement, partition, or merge needed to produce a nondecreasing output.', 'Use the highlighted positions to identify what changed, and check that no input key is lost or invented.'),
    'search': ('The example searches for the selected target in an array. A highlighted position is the current probe; excluded candidates become dim as the search advances.', 'Before the next step, decide which positions could still contain the target under this method’s input assumptions.'),
    'median': ('Fifteen fixed keys are grouped into sets of at most five. Group medians choose a pivot, and partitioning narrows the work to zero-based rank 7.', 'Keep the requested rank in mind when choosing which partition to retain; the full input need not become sorted.'),
    'kSmallest': ('The input is organized as a min-heap, then the smallest remaining key is extracted up to three times. The output row records those keys in sorted order.', 'After each removal, the heap must be repaired before its next root can be returned.'),
    'symbol': ('A small table stores scores for Ada and Lin. It reads a binding, updates an existing score, and removes one key.', 'An update changes the value for one key rather than adding a second copy of that key.'),
    'hash': ('The keys 10, 17, 24, and 8 are placed in a table with seven locations using key mod 7. Three of those keys compete for the same location.', 'Follow the collision rule after hashing; a shared location does not make the keys equal.'),
    'stringhash': ('CAT, CAR, DOG, and TAC are hashed using a simple character-code sum modulo seven. Bucket chains preserve the complete words when hashes collide.', 'CAT and TAC have the same sum but different character order, so lookup must still compare the words.'),
    'bloom': ('Ten bits and two simple hash functions record the inserted keys 4 and 7. Queries include a stored key, a false positive, and a definitely absent key.', 'One zero bit proves absence. All required bits being one still gives only a maybe-present answer.'),
    'string': ('Character rows show the text and a shorter pattern. The animation tracks comparisons and, where needed, saved prefix information or window hashes.', 'Notice which earlier information survives a mismatch and read the reported starting index of a complete match.'),
    'trie': ('The words CAT, CAR, and DOG build character paths from a root. Shared prefixes reuse nodes, and a terminal marker shows where a complete word ends.', 'Follow one character at a time and distinguish a complete word from a path that is only a prefix.'),
    'tst': ('A character-branching diagram and the target CAR illustrate three-way comparisons. Equal characters advance to the next position; smaller or larger alternatives stay at the same position.', 'Only the middle, equal branch consumes a character from the target.'),
    'greedy': ('Candidate activities are sorted by finishing time. The example accepts a compatible activity or rejects one that overlaps the last accepted interval.', 'Compare each activity’s start with the finish of the last accepted one, not the last one merely inspected.'),
    'peak': ('Bars represent the selected input. The example compares a middle value with its right neighbor and keeps the half that must contain a local peak.', 'Check the final answer against its existing neighbors; a different value elsewhere may still be larger.'),
    'peak2d': ('A fixed numeric grid supplies the two-dimensional input. Each step finds the largest value in a middle column, then checks its horizontal neighbors.', 'The column search already handles vertical neighbors; the horizontal comparisons determine whether to stop or keep a half.'),
    'fibonacci': ('Table positions represent Fibonacci indices. Starting from F(0)=0 and F(1)=1, the example fills later entries using the preceding two results.', 'Each highlighted answer depends only on values that were already available.'),
    'lcs': ('The strings ABCBDAB and BDCABA label a table of prefix pairs. Each cell stores a common-subsequence length; the completed table recovers one answer.', 'A match uses the diagonal plus one; a mismatch chooses the better result from above or the left.'),
    'knapsack': ('Three items have weight/value pairs 2/4, 3/5, and 4/7. Table columns are capacities up to 6, and each row allows one more item.', 'Compare taking and skipping the item. Taking it reads the previous row so the same item cannot be reused.'),
    'coin': ('The allowed unlimited coins are 1, 3, and 4, and the goal is amount 6. Table position a records the fewest coins needed to make amount a.', 'Try each usable final coin and combine it with the already solved remaining amount.'),
    'paradigms': ('Small models compare an interval choice, a split into sorting subproblems, and a table of reused Fibonacci states. Each illustrates a different way to organize a solution.', 'Ask whether a decision is committed, a problem is split independently, or an earlier result is reused.'),
    'certificate': ('A six-vertex cycle comes with a proposed two-coloring. The example checks each edge to confirm that its endpoints have different colors.', 'The proposed coloring is supplied as an input to verification; checking it is different from searching for one.'),
    'classes': ('Cards connect polynomial-time solving, YES/NO certificates, and the definitions of NP-hard and NP-complete. The last step identifies the open P-versus-NP relationship.', 'Read each containment or definition carefully. NP membership does not by itself assert that a problem is hard.'),
    'reduction': ('The path A–B–C–D–E is used for an independent-set question with k=3. The same graph becomes a vertex-cover question with size limit 5−3=2.', 'Complement the independent set and check that its remaining vertices touch every edge.'),
    'bits': ('The binary digits of 10 and 6 are compared using AND, OR, and XOR, followed by a left shift. Decimal and binary labels connect each operation to its result.', 'Apply the operator independently at each bit position before reading the complete resulting number.')
}

GUIDE_VARIANTS = {
    ('linked', 'xor'): ('Four illustrative addresses form a linked chain. Each node stores previous XOR next; knowing the previous address lets the example recover the next one.', 'Track the known previous address as well as the stored XOR value. The numbers are teaching addresses, not Python object pointers.'),
    ('master', 'subtract'): ('The example expands T(n)=T(n−1)+n from size 6 down to size 1. Bars represent the shrinking amount of nonrecursive work paid along that call chain.', 'Add the per-call costs; reducing by one gives a chain rather than the branching levels produced by halving.'),
    ('union', 'quickfind'): ('Each array entry is an element’s component label. Several unions relabel a whole component while finds simply read the stored label.', 'Watch how many entries change on a merge, even though reading one element’s label is immediate.'),
    ('union', 'quickunion'): ('Each element stores a parent pointer. A union links one root under another, while finding a representative follows the resulting pointer chain.', 'The first stored parent is not necessarily the final representative; keep following links to a self-parented root.'),
    ('union', 'compress'): ('After some unions, a long example path 0 → 1 → 3 → 5 is shown. A find then redirects path entries straight to root 5.', 'The route gets shorter, but all elements on it still belong to the same component.'),
    ('trie', 'suffix'): ('All six suffixes of BANANA are inserted as character paths. This is an expanded suffix trie showing what a compressed suffix tree organizes.', 'A suffix begins at a different starting position of the same string; shared beginnings still reuse paths.'),
    ('greedy', 'counterexample'): ('The target is 6 with coins 1, 3, and 4. Largest-coin greedy takes 4 + 1 + 1, while another choice makes 6 using 3 + 3.', 'Compare the total number of coins, not just how large the next chosen coin is.'),
    ('graphwalk', 'dfs'): ('Starting from A, a row records the active DFS call path. One new neighbor is explored completely before the caller resumes its remaining neighbors.', 'A return removes the newest call frame; it does not remove that vertex from the already visited set.'),
    ('graphwalk', 'bfs'): ('Starting from A, a queue holds discovered vertices waiting to be processed. A separate output row records their visit order.', 'The queue front is on the left. Newly discovered vertices join at the right.'),
    ('mst', 'prim'): ('Starting with vertex A, the example grows one connected tree. It repeatedly selects the cheapest edge from that tree to an unreached vertex.', 'Identify which edges cross from reached to unreached vertices before comparing their weights.'),
    ('mst', 'kruskal'): ('The graph’s edges are examined from smallest weight upward. An edge is accepted only if its endpoints are in different components.', 'A low-weight edge is still rejected when accepting it would close a cycle.')
}


def animation_guide(demo, options):
    return GUIDE_VARIANTS.get((demo, options.get('kind', '')), ANIMATION_GUIDES[demo])
