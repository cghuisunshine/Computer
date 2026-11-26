# Dynamic programming tutorial

The standalone `dynamic_programming_tutorial.html` embeds all CSS, JavaScript, five Hello Algo source diagrams, and five complete Python examples. It opens directly from disk and works offline.

## Rebuild

```sh
python3 tools/build_dynamic_programming.py
node --test dynamic_programming_tutorial.test.js
```

The builder uses the installed `chapter-tutorial-html` skill's generator. It searches `~/.agents/skills` and `~/.codex/skills`; pass `--generator /absolute/path/to/generate_chapter_html.py` for another installation.

Edit prose in `docs/dynamic_programming_outline.md`, worked-example layout and explanations in `tools/dynamic_programming_template.html`, and runnable examples in `tools/dynamic_programming_examples/`. The builder embeds the same Python implementations in both the worked examples and highlighted comparison lab.

## Source coverage

| Source example | Tutorial coverage |
| --- | --- |
| Three routes to stair 3 | Original diagram, all routes, selectable route/landing visualizer |
| Backtracking | Complete Python, move/return/count/pruning event trace |
| State transition to stair 5 | Original diagram, all eight routes grouped by final move |
| Recursive search for stair 9 | Original recursion tree, Python, complete interactive call trace |
| Memoization for stair 9 | Original memoized tree, Python, cache/return walkthrough and interactive trace |
| Bottom-up DP for stair 9 | Original diagram, every numerical transition, Python and interactive trace |
| Space optimization | Complete Python, every old/new rolling-variable pair and interactive trace |

## Source and license

Based on Hello Algo §14.1, https://www.hello-algo.com/chapter_dynamic_programming/intro_to_dynamic_programming/, by krahets and contributors. Copyright © 2026 krahets. Source and adaptation: CC BY-NC-SA 4.0, https://creativecommons.org/licenses/by-nc-sa/4.0/; no warranties.

The five unmodified diagram sources in `tools/dynamic_programming_assets/` were retrieved from:

`https://raw.githubusercontent.com/krahets/hello-algo/main/docs/chapter_dynamic_programming/intro_to_dynamic_programming.assets/`

Files: `climbing_stairs_example.svg`, `climbing_stairs_state_transfer.svg`, `climbing_stairs_dfs_tree.svg`, `climbing_stairs_dfs_memo_tree.svg`, and `climbing_stairs_dp.svg`.

Changes include English walkthroughs, independently written Python adaptations, route and backtracking controls, numeric tables, additional diagrams, glossary and exercises. The source images retain their Chinese labels; English captions explain each figure. This is an independent adaptation.
