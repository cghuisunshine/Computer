#!/usr/bin/env python3
"""Build the separate, offline animation companion to the extracted reader."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
from book_animation_curriculum import BRIEFS, CHAPTER_DEMOS
from book_animation_introductions import SECTION_INTROS, CHAPTER_INTROS, FRONT_INTROS, animation_guide

ROOT = Path(__file__).resolve().parent.parent


class Contents(HTMLParser):
    def __init__(self):
        super().__init__()
        self.entries = []
        self.nav = False
        self.summary = False
        self.anchor = None
        self.chapter = ''
        self.small = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'nav' and attrs.get('aria-label') == 'Chapters and sections':
            self.nav = True
        if not self.nav:
            return
        if tag == 'summary':
            self.summary = True
            self.chapter = ''
        if tag == 'small':
            self.small = True
        if tag == 'a' and re.match(r'#page-\d+$', attrs.get('href', '')):
            self.anchor = {'page': int(attrs['href'][6:]), 'title': '',
                           'overview': attrs.get('class') == 'chapter-start',
                           'chapter': self.chapter}

    def handle_data(self, data):
        if self.summary:
            self.chapter += data
        if self.anchor is not None and not self.small:
            self.anchor['title'] += data

    def handle_endtag(self, tag):
        if tag == 'small':
            self.small = False
        if tag == 'summary':
            self.summary = False
        if tag == 'a' and self.anchor is not None:
            if self.anchor['overview']:
                self.anchor['title'] = self.chapter
            self.entries.append(self.anchor)
            self.anchor = None
        if tag == 'nav':
            self.nav = False


def main():
    source_reader = ROOT / 'data_structure_extracted.html'
    contents_manifest = ROOT / 'tools/book_animation_contents.json'
    if source_reader.exists():
        # The full reader contains large image payloads; its contents finish early.
        with source_reader.open() as source:
            prefix = ''
            while '</nav>' not in prefix:
                chunk = source.read(65536)
                if not chunk:
                    raise ValueError('Source reader has no chapter navigation')
                prefix += chunk
        toc = Contents()
        toc.feed(prefix.split('</nav>', 1)[0] + '</nav>')
        entries = toc.entries
        contents_manifest.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + '\n')
    else:
        # A fresh checkout can rebuild the standalone companion independently.
        entries = json.loads(contents_manifest.read_text())
    briefs = {chapter: [line.split('|') for line in text.strip().splitlines()]
              for chapter, text in BRIEFS.items()}
    cursors = {chapter: 0 for chapter in briefs}
    introductions = {chapter: text.strip().splitlines() for chapter, text in SECTION_INTROS.items()}
    assert set(introductions) == set(briefs)
    assert all(len(introductions[k]) == len(briefs[k]) for k in briefs), 'Introduction counts must match section counts'
    for index, entry in enumerate(entries):
        entry['id'] = f'section-{index + 1}'
        match = re.match(r'^(\d+)\.', entry['chapter'])
        chapter = int(match[1]) if match else None
        entry['chapterNumber'] = chapter
        if chapter is not None and not entry['overview']:
            position = cursors[chapter]
            assert position < len(briefs[chapter]), f'Too few animation briefs for chapter {chapter}'
            demo, kind, focus, invariant = briefs[chapter][position]
            concept = introductions[chapter][position]
            cursors[chapter] += 1
        elif chapter is not None:
            demo, kind = CHAPTER_DEMOS[chapter]
            focus = 'Preview this chapter through a representative animated model, then explore its individual sections.'
            invariant = 'Follow the changing state and explain the rule that each operation preserves.'
            concept = CHAPTER_INTROS[chapter]
        else:
            demo, kind = ('growth', '') if 'cheat' in entry['title'].lower() else ('roadmap', '')
            focus = {
                'Front matter': 'Orient yourself before tracing the algorithms in the numbered chapters.',
                'Title page': 'Explore the relationship between data structures, algorithms, and design techniques.',
                'Acknowledgements': 'See how explanation, implementation, review, and revision support a learning resource.',
                'Preface': 'Use a read–predict–trace–explain cycle when studying an algorithm.',
                'Complexity cheat sheets': 'Compare common operation-count growth models as input size increases.',
                'Printed table of contents': 'Navigate from a chapter overview to a focused section and its source page.',
                'References': 'Follow a technical claim back to its source and check its assumptions and context.'
            }[entry['title']]
            invariant = 'A conceptual guide is used here because this source entry does not define a single executable algorithm.'
            concept = FRONT_INTROS[entry['title']]
        entry.update(demo=demo, options={'kind': kind} if kind else {}, focus=focus, invariant=invariant)
        example, watch = animation_guide(demo, entry['options'])
        entry['introduction'] = {'concept': concept, 'example': example, 'watch': watch}
        entry['exercise'] = bool(re.search(r'Problems|Supplementary Questions', entry['title']))
        variants = []
        if entry['title'].startswith('6.6 '):
            variants = [('Inorder', 'traversal', 'inorder'), ('Preorder', 'traversal', 'preorder'),
                        ('Postorder', 'traversal', 'postorder'), ('Level order', 'traversal', 'level')]
        elif entry['title'].startswith('9.5 '):
            variants = [('Breadth-first search', 'graphwalk', 'bfs'), ('Depth-first search', 'graphwalk', 'dfs')]
        elif entry['title'].startswith('9.7 '):
            variants = [('Dijkstra', 'shortest', ''), ('Bellman–Ford', 'bellman', ''), ('Floyd–Warshall', 'floyd', '')]
        elif entry['title'].startswith('9.8 '):
            variants = [('Kruskal', 'mst', 'kruskal'), ('Prim', 'mst', 'prim')]
        elif entry['title'].startswith('19.8 '):
            variants = [('0/1 knapsack', 'knapsack', ''), ('Fibonacci', 'fibonacci', ''),
                        ('Minimum coins', 'coin', ''), ('Longest common subsequence', 'lcs', '')]
        elif entry['title'].startswith('14.10 '):
            variants = [('Linear probing', 'hash', 'probing'), ('Separate chaining', 'hash', 'chaining')]
        if variants:
            entry['variants'] = [{'label': label, 'demo': key, 'options': {'kind': kind} if kind else {}}
                                 for label, key, kind in variants]
            guidance = {
                ('traversal', 'inorder'): ('Visit the left subtree, then the node, then the right subtree.', 'Every node is emitted between the outputs of its left and right subtrees.'),
                ('traversal', 'preorder'): ('Emit a node before recursively visiting its children.', 'The parent appears before every node in its subtrees.'),
                ('traversal', 'postorder'): ('Emit a node only after recursively visiting its children.', 'Both child subtrees are emitted before the parent.'),
                ('traversal', 'level'): ('Visit nodes in breadth-first order using a queue.', 'Every node at a shallower depth is emitted before nodes at deeper levels.'),
                ('graphwalk', 'bfs'): ('Discover vertices in breadth-first layers with a queue.', 'Mark on discovery so each vertex is enqueued only once.'),
                ('graphwalk', 'dfs'): ('Explore one undiscovered branch fully before resuming its caller.', 'The active call stack is a root-to-current path through discovery edges.'),
                ('shortest', ''): ('Run Dijkstra on a graph with nonnegative edge weights.', 'The least tentative unsettled distance can be finalized because edge weights are nonnegative.'),
                ('bellman', ''): ('Relax directed edges in passes, including a negative-weight edge.', 'After i full passes, all shortest routes using at most i edges have been accounted for.'),
                ('floyd', ''): ('Allow one more intermediate vertex at each stage of an all-pairs calculation.', 'Each stage considers paths whose intermediate vertices come from the allowed prefix.'),
                ('mst', 'kruskal'): ('Process edges by weight and join separate components.', 'The accepted edges form a forest; reject an edge if it would create a cycle.'),
                ('mst', 'prim'): ('Grow one connected tree using its cheapest outgoing edge.', 'Choose the least-weight edge crossing from reached to unreached vertices.'),
                ('knapsack', ''): ('Compare taking or skipping each item in a 0/1 knapsack table.', 'The previous item row prevents selecting the same item more than once.'),
                ('fibonacci', ''): ('Compute Fibonacci values once in dependency order.', 'Each new state reads two earlier solved states.'),
                ('coin', ''): ('Build the minimum number of coins for each amount.', 'Each candidate last coin refers to an already solved smaller amount.'),
                ('lcs', ''): ('Fill prefix states and reconstruct one longest common subsequence.', 'A subsequence preserves order without requiring adjacent positions.'),
                ('hash', 'probing'): ('Resolve collisions by probing successive physical slots.', 'Insertion and lookup follow the same probe sequence.'),
                ('hash', 'chaining'): ('Keep colliding keys together in a bucket chain.', 'Compare the actual stored keys; equal hash values do not imply equal keys.')
            }
            for variant in entry['variants']:
                variant['focus'], variant['invariant'] = guidance[(variant['demo'], variant['options'].get('kind', ''))]
                example, watch = animation_guide(variant['demo'], variant['options'])
                variant['introduction'] = {'concept': concept, 'example': example, 'watch': watch}
        if demo == 'roadmap':
            entry['options']['labels'] = {
                'Acknowledgements': ['Explain', 'Implement', 'Review', 'Revise'],
                'Preface': ['Read', 'Predict', 'Trace', 'Explain'],
                'References': ['Locate a claim', 'Open its source', 'Check assumptions', 'Apply with context'],
                'Printed table of contents': ['Choose a chapter', 'Choose a section', 'Trace an example', 'Read its source']
            }.get(entry['title'], ['Represent the data', 'Define the operations', 'Trace the algorithm', 'Check the result'])
            entry['options']['notes'] = [focus] * 4
        if chapter == 20:
            entry['reference'] = {'title': 'Clay Mathematics Institute: P vs NP',
                                  'url': 'https://www.claymath.org/millennium/p-vs-np/'}
    assert all(cursors[k] == len(briefs[k]) for k in briefs), (cursors, {k: len(v) for k, v in briefs.items()})
    assert len(entries) == 259 and sum(not e['overview'] and e['chapterNumber'] is not None for e in entries) == 230
    payload = json.dumps(entries, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')
    template = (ROOT / 'tools/book_animations_shell.html').read_text()
    output = template.replace('/* BOOK_LESSONS */null', payload)
    for marker, name in [('/* BOOK_ENGINE */', 'book_animation_engine.js'),
                         ('/* BOOK_PLAYER */', 'book_animation_player.js'),
                         ('/* BOOK_STYLE */', 'book_animations.css')]:
        output = output.replace(marker, (ROOT / 'tools' / name).read_text())
    destination = ROOT / 'data_structure_animations.html'
    destination.write_text(output)
    print(f'Built {destination.name}: {len(entries)} animated entries, 230 numbered sections, 22 chapters; {len(output):,} characters')


if __name__ == '__main__':
    main()
