"""Section-specific teaching briefs, in the source book's exact contents order.

Each entry is engine | variant | learning focus | invariant / check.
The builder checks every chapter's count against the extracted reader.
"""

BRIEFS = {
0: '''
roadmap||Connect organized data with algorithms that transform it.|State the input, allowed operations, and required output.
roadmap||Preview the book's progression before choosing a chapter.|Match the material to your current learning goals.
paradigms||Follow the progression from representations to design strategies.|Different techniques require different assumptions.
types||Check values, basic Python operations, and control-flow prerequisites.|An operation must be defined for its operand types.
''',
1: '''
variables||Watch assignment and rebinding change names without mutating integers.|A name refers to an object; rebinding changes that reference.
types||Compare integer addition, string concatenation, and list mutation.|The type determines the meaning of an operation.
adt||Separate organized storage from the operations it supports.|A representation must preserve the promised behavior.
adt||Use a stack contract with two possible internal representations.|The ADT specifies what operations do, not how storage is arranged.
search|linear|Trace a finite search from an input to a returned answer.|Every iteration either advances or terminates.
analysis||Count comparisons while the input size stays fixed.|Count a defined primitive operation rather than guessing elapsed seconds.
growth||Compare growth models instead of hardware-dependent timings.|The same cost model must be used across inputs.
analysis||Distinguish input size, case assumptions, and counted operations.|A running-time claim needs a defined input size and case.
analysis||Compare best, average, and worst successful-search cases.|Average-case analysis requires an input probability model.
growth||Double the input and observe how operation counts respond.|Growth rate describes scaling, not an absolute duration.
growth||Contrast constant, logarithmic, linear, quadratic, and exponential models.|Asymptotic notation hides constants, not the underlying growth family.
analysis||Hold n fixed while moving the successful target's position.|Best, average, and worst cases refer to different input conditions.
bounds|theta|Compare a function with constant multiples of a simpler function.|The bound must hold beyond one fixed threshold.
bounds|bigO|Show a concrete eventual upper bound for 3n + 2.|For n ≥ 2, 3n + 2 ≤ 4n.
bounds|omega|Show a concrete lower bound for 3n + 2.|For positive n, 3n + 2 ≥ 3n.
bounds|theta|Sandwich 3n + 2 between matching linear bounds.|Matching lower and upper bounds establish Θ(n).
bounds|theta|See why a finite initial prefix does not determine asymptotic growth.|Constants and a threshold are fixed independently of n.
analysis||Count a loop's work before simplifying its asymptotic description.|Define the counted operation and justify how often it executes.
bounds|theta|Drop lower-order terms only after finding valid bounding constants.|Asymptotic equivalence does not assert exact equality of functions.
summation||Build a triangular sum and compare it with its closed form.|1 + 2 + ⋯ + n = n(n + 1)/2.
master||Expand a divide-and-conquer recurrence by recursion levels.|For T(n)=2T(n/2)+n, each full level has Θ(n) work.
master||Work through a representative Master Theorem recurrence.|Check the branching, shrink factor, and nonrecursive work separately.
master|subtract|Expand T(n)=T(n−1)+n into a chain of decreasing sizes.|Reducing by a constant produces a different recurrence from halving.
master|subtract|Inspect the accumulated nonrecursive work in a subtractive recurrence.|The chain length and per-level work must both be counted.
master||Check a proposed Θ(n log n) answer against a recursion-level expansion.|A plausible guess still needs a valid argument or induction.
amortized||Observe cheap appends and occasional expensive geometric resizes.|The cost averaged over an operation sequence differs from a worst single operation.
analysis||Solve a representative operation-count exercise using linear search.|Each comparison corresponds to one inspected array position.
''',
2: '''
recursion||Preview recursive calls, a base case, and returning results.|Each recursive branch must move toward a terminating case.
recursion||Trace factorial calls down to the base case and back up.|A call retains its own local state while waiting for its subcall.
hanoi||Use smaller copies of a problem to organize a solution.|Each Hanoi subproblem moves fewer disks than its caller.
recursion||Locate the base case and the recursive reduction in a function.|The base case must be reached for every valid input.
recursion||Watch call frames accumulate and then disappear on return.|Space usage depends on the maximum number of simultaneously active frames.
fibonacci||Contrast recursive dependencies with a left-to-right table.|Iteration can explicitly store the state that recursion would retain in frames.
recursion||Distinguish the recursion depth from the total number of operations.|Finishing one call resumes only its direct caller.
hanoi||Animate a complete three-disk Towers of Hanoi solution.|A larger disk never rests on a smaller disk.
recursion||Work through a representative factorial call-stack exercise.|Returned values combine in the reverse order of the recursive calls.
backtrack||Explore choices, reject conflicts, and undo failed branches.|Undo restores the state needed before trying the next candidate.
backtrack||Solve four queens by placing one queen per row.|Earlier queens must not attack a newly placed queen.
backtrack||Follow a representative backtracking search including a failed branch.|A rejected partial placement cannot be extended into a valid solution.
''',
3: '''
linked|singly|Traverse nodes by following references from head.|The next reference determines which node is reached next.
linked|singly|Connect traversal, insertion, and deletion to the linked-list interface.|Relinking after a known predecessor takes constant pointer work.
array||Compare insertion by shifting with insertion by relinking.|Finding a linked-list position can still require linear traversal.
array||Insert inside an indexed array by shifting its suffix.|Shift right to left so unread values are not overwritten.
amortized||Compare random access, shifting, relinking, and dynamic-array growth.|An O(1) insertion claim must specify whether a node location is already known.
linked|singly|Insert a node after a known predecessor, then unlink it.|Set the new node's successor before redirecting its predecessor.
linked|doubly|Follow both next and prev relationships through a doubly linked chain.|Adjacent nodes must agree about their forward and backward links.
linked|circular|Follow a tail link back to head rather than to None.|Traversal needs a stopping condition that recognizes a completed cycle.
linked|xor|Decode a neighboring address using XOR and a known previous address.|p XOR (p XOR q) = q; the traversal must retain decoding context.
unrolled||Store multiple logical items in each linked block.|A block's local offset and its position in the chain are distinct.
skip||Search through a reproducible skip-list tower.|Move right only when the next key does not overshoot the target.
linked|singly|Work a representative insertion-and-deletion pointer exercise.|All unaffected nodes retain their original traversal order.
''',
4: '''
stack||Push and pop values from the one exposed end of a stack.|The last value pushed is the first value popped.
stack||See a stack remember unfinished work in reverse order.|Only the current top can be removed through the stack interface.
adt||Separate push/pop semantics from array or linked storage.|Both implementations must produce the same observable return values.
brackets||Use a stack to recognize properly nested brackets.|The next closing bracket must match the latest unmatched opening bracket.
stack||Trace the push, top, pop, and underflow cases of an implementation.|An empty pop must report failure rather than fabricate a valid value.
amortized||Examine the occasional resize behind an array-backed stack.|Amortized append cost and a single worst-case resize are different claims.
brackets||Work a representative balanced-bracket problem.|Acceptance requires both correct matches and an empty final stack.
''',
5: '''
queue||Enqueue at the rear and dequeue from the front.|The first remaining arrival leaves first.
queue||Model a service line using first-in, first-out order.|New arrivals do not jump ahead of existing requests.
queue||Observe the queue ADT through enqueue and dequeue operations.|The representation must preserve logical arrival order.
queue||Handle dequeue after the final item has left.|An empty queue has no valid front element to return.
graphwalk|bfs|Use a queue as the frontier of breadth-first traversal.|First discovery in an unweighted graph gives a shortest edge-count distance.
circularqueue||Wrap front and rear around a fixed-size array.|Use count or a reserved slot to distinguish empty from full.
circularqueue||Work a representative ring-buffer wraparound exercise.|Logical queue order is independent of physical index zero.
''',
6: '''
tree||Identify a root, children, and leaves in a small tree.|Every non-root node in a rooted tree has exactly one parent.
tree||Relate depth, height, parent, child, and leaf labels.|Depth counts edges from the root; this demo measures height in edges.
tree||Follow the left and right child positions of a binary tree.|A binary node has at most two children.
treevariants||Compare general, binary, full, perfect, and complete trees.|These classifications describe different structural conditions.
tree||Count nodes by level and identify the deepest leaves.|A binary level at depth d contains at most 2ᵈ nodes.
traversal|inorder|Walk left subtree, node, then right subtree.|The visit rule determines the output sequence.
nary||Traverse the children of a generic rooted tree in stored order.|A general tree does not inherit the two-child restriction.
threaded||Follow tagged successor threads during inorder traversal.|A thread must be distinguished from a genuine child reference.
expression||Build an expression tree from postfix tokens.|Pop the right operand subtree before the left operand subtree.
xortree||Recover child and parent addresses from parent-XOR-child links.|A stored XOR link needs one known address to recover the other.
bst||Insert keys by comparing against the nodes on a root-to-leaf path.|Every left descendant is smaller; equal keys go right in this example.
avl||Repair a height imbalance without changing inorder key order.|A rotation changes links but preserves the BST ordering.
avl||Perform the left-left case's right rotation and update balance.|An AVL node's two subtree heights differ by at most one.
treevariants||Compare structural restrictions across common tree families.|Choose a tree variation by its operations and required invariants.
traversal|postorder|Work a traversal exercise that emits children before their parent.|A parent is output only after both child subtrees are processed.
''',
7: '''
heap||Keep the smallest-priority key at the root of a min-heap.|The minimum is at the root, but the entire array is not sorted.
heap||Trace insert and extract-min as priority-queue operations.|Each operation must preserve the parent–child heap ordering.
heap||Serve the next smallest-priority item after several arrivals.|Priority order can differ from arrival order.
heap||Compare the heap's complete-tree shape with its array representation.|The children of index i are 2i+1 and 2i+2 when present.
heap||Restore a min-heap by sifting an inserted key upward.|A min-heap parent is no larger than either child.
heap||Replace an extracted root and restore order by sifting downward.|Choose the smaller child during min-heap repair.
sort|heap|Use a max-heap to place successive maximum values at the right end.|The shrinking live heap and growing sorted suffix do not overlap.
heap||Work a representative priority-queue update-and-extraction exercise.|The next extraction returns the minimum among the remaining keys.
''',
8: '''
union|weighted|Start with singleton components and join related elements.|The sets form a disjoint partition of the elements.
union|weighted|Interpret connected components as equivalence classes.|Elements share a representative exactly when they are in the same class.
union|weighted|Trace MAKESET, FIND, and UNION.|UNION never separates elements that were already connected.
mst|kruskal|Use component representatives to detect a cycle in a candidate edge.|Accept an edge only when it connects different components.
union|quickfind|Compare direct component labels with parent-pointer forests.|Fast direct FIND requires more work when labels change on UNION.
union|quickfind|Perform constant-time label reads and linear relabeling unions.|All members of a merged component receive the same component label.
union|quickunion|Attach one representative under another.|FIND follows parent links until a self-parented root.
union|quickunion|Observe how unweighted unions can produce longer find paths.|Changing one root link can merge an entire tree.
union|weighted|Attach smaller components beneath larger components.|A node's depth increases only when its containing tree joins a larger one.
union|compress|Shorten a long FIND path without changing set membership.|Path compression and union by size/rank are compatible optimizations.
union|compress|Work a representative union–find and path-compression exercise.|Every compressed pointer still leads to the same representative.
''',
9: '''
graph||Model relationships using vertices and edges.|A graph can contain cycles and multiple alternative paths.
graph||Identify adjacency, incident edges, paths, cycles, and weights.|State whether the graph is directed and what its weights mean.
graph||Interpret a small weighted network as a practical routing model.|The meaning of the edge cost determines the optimization objective.
representation||Compare edge lists, adjacency lists, and adjacency matrices.|Undirected adjacency must be represented at both endpoints.
graphwalk|bfs|Trace a discovered set and a queue-based graph frontier.|Mark on discovery to avoid repeatedly adding the same vertex.
topological||Release vertices whose prerequisite indegrees have reached zero.|A vertex is eligible only after all its predecessors are output.
shortest||Run Dijkstra on a graph with nonnegative edge weights.|Only the least tentative unsettled distance is finalized at each step.
mst|kruskal|Build a minimum spanning tree by accepting safe low-weight edges.|The accepted edges stay acyclic and eventually connect every vertex.
graphwalk|dfs|Work a representative depth-first traversal exercise.|The stack chooses the most recently discovered pending branch.
''',
10: '''
sort|insertion|Transform an unsorted sequence into nondecreasing order.|The output must contain the same multiset of keys as the input.
search|binary|See how sorted data supports discarding half a search interval.|Binary search relies on a sorted order it did not create itself.
sort|insertion|Inspect comparison, movement, stability, and auxiliary storage as classification axes.|An algorithm name alone does not specify every implementation tradeoff.
sort|merge|Contrast run-based merging with local in-place movements.|Stable merging chooses the left equal key first.
sort|bubble|Move a large key rightward through adjacent swaps.|After a complete pass, the largest remaining key reaches the pass boundary.
sort|selection|Find the next minimum in the unsorted suffix.|The prefix contains the smallest keys in their final positions.
sort|insertion|Insert each next key into an already sorted prefix.|Shifting larger values opens a gap without reordering equal keys.
sort|shell|Use decreasing gaps to reduce long-distance disorder.|The final gap-one pass completes the sorting process.
sort|merge|Split, recursively sort, and merge smaller runs.|Only the current heads of sorted runs need comparison during merging.
sort|quick|Partition around a pivot, then recursively sort the two sides.|After partitioning, the pivot occupies a final sorted position.
sort|tree|Insert into a BST and emit its inorder sequence.|Inorder traversal of a BST produces nondecreasing keys.
sort|insertion|Inspect operations in a representative comparison sort.|Compare algorithms under the same input and operation-count model.
sort|counting|Use a bounded integer key range to avoid pairwise comparisons.|Linear counting-sort time includes both n and the key-range size.
sort|counting|Count occurrences and emit keys in increasing order.|The sum of the counts equals the number of input keys.
sort|bucket|Scatter keys into ordered ranges before sorting each bucket.|Every key in an earlier bucket precedes every key in a later bucket.
sort|radix|Process integer digits stably from least to most significant.|Each digit pass preserves ordering established by earlier passes.
topological||Order a directed acyclic dependency graph.|A topological ordering is defined by edges, not by numeric key comparisons.
sort|external|Model run formation and merging for data larger than memory.|The illustrated merge is the core operation; disk buffering is not simulated.
sort|quick|Work a representative partition-and-sort exercise.|Recursive work is restricted to intervals that still need sorting.
''',
11: '''
search|linear|Find a target by inspecting candidate positions.|Returning not found requires eliminating every allowed candidate.
search|linear|Connect a lookup request with a returned position or failure.|A successful search returns evidence that the key is present.
search|binary|Compare the assumptions behind sequential and interval search.|A faster method can require a stronger input invariant.
search|linear|Scan an unsorted array in its current order.|No ordering information is assumed.
search|ordered|Stop a sorted scan when a key larger than the target is reached.|Later sorted keys cannot equal a smaller missing target.
search|binary|Repeatedly halve a sorted candidate interval.|A present target always stays inside the remaining interval.
search|interpolation|Estimate a probe from the target's relative key value.|Interpolation assumes sorted numeric data; uniform distributions improve its expected behavior.
analysis||Compare operation counts while keeping the input assumptions explicit.|Do not include sorting for one method and silently omit it for another.
hash|chaining|Translate a search key into a hash bucket.|A matching hash location is not sufficient; compare the stored key too.
string|naive|Find a pattern inside a larger character sequence.|A complete pattern match requires matching every pattern position.
search|binary|Work a representative sorted-search exercise.|Boundary updates must make progress even when a target is absent.
''',
12: '''
sort|quickselect|Find a key of a requested sorted rank without fully sorting everything.|Only the partition containing the desired rank remains relevant.
sort|insertion|Select a median after sorting all keys.|This straightforward selection method pays the cost of a full sort.
sort|quickselect|Use partition positions to keep only the desired side.|The pivot's final rank tells which side can contain the answer.
median||Choose a deterministic median-of-medians pivot.|Constant-size groups supply a pivot with a worst-case partition-balance guarantee.
kSmallest||Extract the three smallest keys from a min-heap in sorted order.|Each extraction exposes the smallest key that has not yet been returned.
sort|quickselect|Work a representative order-statistic selection exercise.|The selected rank is zero-based in this animation.
''',
13: '''
symbol||Introduce a mapping from names to associated values.|Each distinct key has one current binding.
symbol||Get, update, and delete key–value pairs.|An update replaces an existing value instead of creating a duplicate key.
hash|chaining|Implement key lookup through buckets.|Actual keys must be checked when more than one key shares a bucket.
bst||Contrast ordered-tree lookup with direct bucket selection.|A BST preserves order; its running time depends on height.
''',
14: '''
hash|chaining|Map keys into a table of bucket locations.|Hash collisions are possible even for different keys.
hash|chaining|Use a key-derived location to narrow a lookup.|Expected O(1) behavior needs assumptions about hashing and load.
symbol||Specify the map interface before choosing a hash-table representation.|The contract is about key–value behavior, not a particular hash function.
hash|chaining|Trace hashing, collision detection, and key storage.|The same key must follow the same lookup rule while table parameters stay fixed.
hash|chaining|Separate the hash function, table, and collision policy.|All three components participate in a successful lookup.
hash|chaining|Inspect the indexed bucket array as entries arrive.|The number of buckets differs from the number of stored keys.
hash|chaining|Evaluate the illustrative division hash h(k)=k mod 7.|This toy hash exposes collisions rather than claiming production-quality distribution.
hash|chaining|Compute the load factor after several insertions.|Load factor α is the number of entries divided by the table capacity.
hash|chaining|Observe 10, 17, and 24 selecting the same bucket.|A collision is a shared hash location, not equality of keys.
hash|probing|Resolve a collision by looking for another slot.|Insertion and lookup must use consistent collision rules.
hash|chaining|Store colliding keys together in a bucket chain.|A lookup in a chain compares actual keys along that chain.
hash|probing|Follow a linear probing sequence with wraparound.|A full table and deletion tombstones need explicit handling in a complete implementation.
hash|probing|Compare a probe cluster with a chained bucket.|Collision strategies change memory layout and lookup behavior.
hash|chaining|Relate a controlled load factor to expected bucket size.|Expected constant time is not an unconditional worst-case guarantee.
hash|probing|Inspect a concrete open-addressing collision policy.|This example illustrates linear probing; other policies use different probe sequences.
bst||Use ordered-tree operations when order or range queries matter.|Hashing does not inherently maintain sorted key order.
bloom||Observe insertions, definite absences, and a false positive.|A Bloom filter can answer maybe present, but an unset required bit proves absence.
hash|chaining|Work a representative repeated-collision insertion exercise.|The table still distinguishes colliding keys by their actual values.
''',
15: '''
string|naive|Connect character sequences with a pattern-search task.|The text and pattern are different inputs with separate indices.
string|naive|Preview alignments and complete-match detection.|A candidate alignment is accepted only when all pattern characters match.
string|naive|Shift the pattern one position after a mismatch.|Overlapping candidate windows must not be skipped without justification.
string|rabin|Roll a window hash and verify candidate equal-hash matches.|Hash equality can collide, so verify characters before declaring a match.
string|automaton|Interpret matched-prefix length as an automaton state.|A state transition retains the longest useful prefix after reading a character.
string|kmp|Build a prefix table and reuse it after mismatches.|The text pointer never needs to move backward.
string|boyer|Compare right to left and apply the bad-character shift.|This animation isolates the bad-character rule, not the full good-suffix optimization.
trie||Organize strings by shared prefixes.|A path spells a prefix; a terminal flag identifies a complete stored word.
stringhash||Hash character sequences and keep colliding strings in a bucket chain.|A string hash must still be followed by equality checks when needed.
stringbst||Insert and compare whole string keys in lexicographic order.|The left subtree has lexicographically smaller keys than its parent.
trie||Insert CAT, CAR, and DOG while sharing the CA prefix.|Shared prefixes reuse nodes; complete words require terminal markers.
tst||Compare left, middle, and right character branches.|Only an equal middle transition consumes the next character.
trie||Inspect prefix sharing as a contrast to whole-key tree comparison.|A trie branches by characters rather than comparing entire keys at each node.
trie|suffix|Insert all suffixes of BANANA into an expanded suffix trie.|A suffix tree compresses nonbranching paths; the animation deliberately shows the underlying expanded trie.
string|kmp|Work a representative overlapping-pattern matching exercise.|Prefix fallback preserves useful earlier matches without rescanning the text.
''',
16: '''
paradigms||Preview greedy, divide-and-conquer, and dynamic programming.|A design strategy must match the structure of the problem.
paradigms||Classify algorithms by the way decisions and subproblems are organized.|Different classifications can apply to the same algorithm.
recursion||Inspect recursion as an implementation method.|Recursive and iterative implementations can realize the same mathematical strategy.
paradigms||Compare committing choices, independent splits, and reused states.|These design choices require different correctness arguments.
sort|merge|Use merge sort as an example with multiple classification labels.|Merge sort is comparison-based and divide-and-conquer; those labels describe different axes.
''',
17: '''
greedy||Preview a selection problem where a greedy rule is safe.|A greedy choice requires a correctness argument for the stated objective.
greedy||Commit to the earliest finishing compatible activity.|The chosen interval leaves as much remaining time as this greedy rule permits.
greedy||Identify candidates, feasibility, choice rule, and objective.|Feasibility alone does not establish optimality.
greedy|counterexample|Watch largest-coin greedy fail for denominations 1, 3, 4.|A single counterexample disproves a universal greedy optimality claim.
greedy|counterexample|Contrast an inexpensive local rule with the risk of a wrong global answer.|Use a proof or a known applicable theorem before relying on greedy optimality.
greedy||Apply greedy selection to interval scheduling.|The objective here is maximum activity count on one resource.
greedy||Trace acceptance and rejection in finish-time order.|The accepted intervals never overlap.
greedy|counterexample|Work a representative greedy counterexample.|For amount 6, two 3-coins beat the greedy choice 4 + 1 + 1.
''',
18: '''
sort|merge|Preview dividing a sequence into independently sortable runs.|Each recursive problem is strictly smaller than its parent.
sort|merge|Split, solve smaller instances, and combine their answers.|The combination step must preserve the required output property.
paradigms||Identify when splitting alone does not solve the original problem.|Independent subproblems and a correct combine step must both be established.
master||Draw the work at successive levels of a halving recurrence.|The number of subproblems grows as each individual problem shrinks.
sort|merge|Trace a concrete divide–solve–combine process.|Merging two sorted runs produces one sorted run with the same keys.
sort|merge|Observe how independent subproblems simplify local reasoning.|The final result still depends on a correct combining operation.
master||Count recursion levels as well as work within each level.|Splitting can introduce call overhead and extra storage.
master||Analyze T(n)=2T(n/2)+n using work per level.|The Master Theorem has specific applicability conditions; this trace uses a regular halving recurrence.
sort|merge|Apply divide and conquer to sorting.|A complete sort needs both recursively sorted halves and a merge.
peak||Discard half the candidate interval while preserving a local peak.|The answer is a local maximum, not necessarily the global maximum.
peak2d||Use a middle-column maximum to choose a promising half.|A column maximum already dominates its vertical neighbors.
peak||Work a representative one-dimensional peak-finding exercise.|Boundary comparisons must consider only existing neighbors.
''',
19: '''
fibonacci||Preview a table that stores solved subproblems.|Each stored state has a precise meaning.
fibonacci||Replace repeated recursive dependencies with reusable results.|A state is computed only after the states it depends on are available.
knapsack||Relate state meaning, optimal substructure, and a recurrence.|The previous row enforces that an item is selected at most once.
paradigms||Compare committed choices, independent splits, and overlapping states.|Dynamic programming is useful when equivalent subproblems recur.
coin||Check a concrete state space and recurrence before choosing DP.|DP is not a universal recipe; the state representation must capture the information needed by later decisions.
fibonacci||Watch a bottom-up evaluation of recursive dependencies.|The table order must respect dependency direction.
coin||Build a minimum-coin table from smaller solved amounts.|Each candidate final coin refers to an already solved smaller amount.
knapsack||Work through a 0/1 knapsack table.|Taking an item reads the preceding item row, preventing reuse.
lcs||Fill prefix states and reconstruct one longest common subsequence.|A subsequence preserves order but need not occupy consecutive positions.
lcs||Work a representative LCS dynamic-programming exercise.|Different backtracking tie choices can yield different equally long subsequences.
''',
20: '''
certificate||Separate solving a decision problem from verifying a proposed witness.|A certificate must be checked against every required constraint.
growth||Contrast polynomial and exponential operation-count models.|A fixed polynomial degree differs from an exponent that grows with n.
certificate||Turn a concrete coloring question into a YES/NO decision.|Decision problems have a binary answer for each valid input instance.
certificate||Inspect a finite procedure that checks a proposed answer.|A decision procedure must terminate on every valid input.
classes||Organize decision problems by formal resource bounds.|A complexity class contains problems, not particular input examples.
classes||Distinguish P, NP, co-NP, NP-hard, and NP-complete.|NP-complete means both NP membership and NP-hardness.
reduction||Transform Independent Set into Vertex Cover and translate the answer.|A polynomial reduction transfers a solver in the correct direction.
certificate||Work a representative certificate-verification exercise.|Polynomial verification alone does not imply that search is known to be hard.
''',
21: '''
bits||Preview binary representations and common bitwise operations.|Bitwise operators work on corresponding bit positions.
bits||Test AND, OR, XOR, and a left shift on explicit binary values.|Fixed-width overflow rules differ from Python's arbitrary-precision integer model.
'''
}

CHAPTER_DEMOS = {
    0: ('roadmap', ''), 1: ('growth', ''), 2: ('recursion', ''),
    3: ('linked', 'singly'), 4: ('stack', ''), 5: ('queue', ''),
    6: ('traversal', 'inorder'), 7: ('heap', ''), 8: ('union', 'weighted'),
    9: ('graphwalk', 'bfs'), 10: ('sort', 'insertion'), 11: ('search', 'binary'),
    12: ('sort', 'quickselect'), 13: ('symbol', ''), 14: ('hash', 'chaining'),
    15: ('string', 'kmp'), 16: ('paradigms', ''), 17: ('greedy', ''),
    18: ('sort', 'merge'), 19: ('fibonacci', ''), 20: ('classes', ''), 21: ('bits', '')
}
