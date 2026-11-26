@page_title: Dynamic Programming · From recursion to reuse
@chapter: Hello Algo · Chapter 14.1
@subtitle: One staircase. Four ways to think. Learn how saving a small answer changes everything.
# Dynamic Programming

## The staircase problem
> A small counting problem makes the whole idea visible.
### What are we counting?
You have n stairs and may climb either one or two stairs per move. How many different sequences of moves reach exactly stair n? Order matters: 1 then 2 and 2 then 1 are different routes.
For three stairs, the routes are 1 + 1 + 1, 1 + 2, and 2 + 1. So the answer is 3. We count routes, rather than finding the fewest moves.
### Define the state
Let **dp[i]** mean the number of routes that end exactly at stair i. A state is the information needed to identify a smaller problem. Here, that information is just the stair number i.
### Look at the last move
Every route to stair i ends with either a one-stair move from i − 1 or a two-stair move from i − 2. These two groups do not overlap, and together they contain every route. Add their counts:
```
dp[i] = dp[i − 1] + dp[i − 2]   for i ≥ 3
dp[1] = 1
dp[2] = 2
```
For five stairs: dp[5] = dp[4] + dp[3] = 5 + 3 = 8. The staircase sequence starts 1, 2, 3, 5, 8, 13. It is shifted by one position compared with Fibonacci starting 0, 1.

## Brute-force search
> First make the recurrence work. Then notice the repeated work.
### Enumerate choices with backtracking
Start at stair 0. Try a move of one stair, then a move of two stairs. If a move would go past n, skip it. When a route reaches exactly n, count it once. This is a depth-first exploration of possible routes.
### Recursively count smaller problems
Instead of carrying every route, recursively ask for the counts at n − 1 and n − 2. Return 1 or 2 when the problem reaches a known base case. The formula is correct, but the recursion recomputes identical states.
For example, solving state 5 asks for states 4 and 3. Solving state 4 asks for states 3 and 2. State 3 is now solved twice. These are **overlapping subproblems**.
### Why does it get slow?
Each non-base call branches into two calls. The conventional upper bound is **O(2ⁿ) time**; the tighter growth rate is Θ(φⁿ), where φ is about 1.618. The deepest active call chain is O(n), so auxiliary space is O(n), even though the complete recursion tree has exponentially many calls.

## Memoization
> Keep the recursive questions. Remember their answers.
### Check, compute, store
Before solving state i, look in a cache. If its answer is there, return it immediately. Otherwise solve its two dependencies, add their answers, and store the result under i.
A cache hit still supplies a value to the parent calculation. It skips repeated exploration; it does not remove a valid group of routes.
### Top down
Begin with the target n and recursively descend to smaller problems. As calls return, their answers build larger answers. Each non-base state is expanded once. The cache and recursion stack together require **O(n) space**, and the work is **O(n) time**.
The examples check base cases before looking in the cache. Base-case calls may repeat; they are already constant-time answers. The repeated branching work is what memoization removes.

## Bottom-up tabulation
> Change the order: answer the small questions first.
### Build the DP table
Set dp[1] = 1 and dp[2] = 2. Compute dp[3], then dp[4], continuing to dp[n]. When a state is reached, both dependencies are ready. Each new state needs one addition.
### The vocabulary
**State:** the stair index i. **DP table:** the array holding answers. **Initial states:** the known values for stairs 1 and 2. **State transition:** the rule dp[i] = dp[i − 1] + dp[i − 2]. **Evaluation order:** increasing i.
Memoization and tabulation are both commonly described as dynamic programming. This chapter uses the bottom-up method as its explicit DP implementation.
### Time and space
There are n states, with constant work per transition: **O(n) time** and **O(n) space**. The loop avoids a recursive call stack. For n = 1 or n = 2, return immediately before creating or indexing the table.

## Rolling variables
> A state needs only its two immediate predecessors.
### Keep the necessary history
Before computing stair i, let a = dp[i − 2] and b = dp[i − 1]. Compute their sum, then move the window forward. Python's simultaneous assignment evaluates both right-hand expressions before replacing either variable.
```
a, b = b, a + b
```
After the update, a holds the old b and b holds dp[i]. For i = 3, (a, b) changes from (1, 2) to (2, 3). For i = 4, it becomes (3, 5).
### What do we gain and lose?
The algorithm still performs O(n) work, but retains only two answer values: **O(1) auxiliary space** under the usual fixed-size arithmetic model. It returns the final count without preserving every earlier answer. Keep a table if later work needs that history.
Python integers grow as the count increases. Strict bit-complexity analysis also charges for bigger integers and additions; the usual introductory bounds here count arithmetic operations and stored values.

## Apply the pattern
> Write the meaning before writing the loop.
### A reusable checklist
1. Define precisely what each state represents.
2. Identify the smallest answers you already know.
3. Derive a transition that covers all valid possibilities without double counting.
4. Choose an order that computes dependencies first, or memoize recursive calls.
5. Return the target state and consider which earlier values must remain in memory.
### Common mistakes
Do not mix this problem with ordinary Fibonacci base values. Do not replace a before calculating a + b unless you saved the old a. Do not add counts for groups that overlap. Do not assume every DP problem minimizes or maximizes something: this one counts routes.
### Input convention
Following the linked chapter, every example here takes a positive integer n. The interactive lab uses 1–12 stairs. An optional extension can define dp[0] = 1 for the empty route, but the displayed implementations use dp[1] = 1 and dp[2] = 2.
