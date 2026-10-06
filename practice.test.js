const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, 'practice.html'), 'utf8');
const embedded = html.match(/<script type="application\/json" id="dsa-question-bank">\s*([\s\S]*?)\s*<\/script>/);
assert.ok(embedded, 'The question bank must be embedded for direct-file use.');
const bank = JSON.parse(embedded[1]);

test('500 unique algorithm practices include the complete core study lists', () => {
  assert.equal(bank.length, 500);
  assert.equal(new Set(bank.map(problem => problem.id)).size, bank.length);
  assert.equal(new Set(bank.map(problem => problem.url)).size, bank.length);
  assert.equal(bank.filter(problem => problem.lists.includes('blind75')).length, 75);
  assert.equal(bank.filter(problem => problem.lists.includes('neetcode150')).length, 150);
  assert.ok(bank.filter(problem => problem.lists.includes('blind75')).every(problem => problem.lists.includes('neetcode150')));
  assert.equal(bank.filter(problem => problem.source === 'CSES').length, 80);
  assert.equal(bank.filter(problem => problem.source === 'LeetCode').length, 420);
  assert.ok(bank.every(problem => problem.topic !== 'JavaScript'));
});

test('the default sequence progresses by difficulty and prioritizes core questions', () => {
  const levels = { Easy: 0, Medium: 1, Hard: 2 };
  const rank = problem => problem.lists.includes('blind75') ? 0
    : problem.lists.includes('neetcode150') ? 1 : problem.source === 'LeetCode' ? 2 : 3;
  bank.forEach((problem, index) => {
    assert.equal(problem.sequence, index + 1);
    assert.ok(Object.hasOwn(levels, problem.difficulty));
    if (!index) return;
    const previous = bank[index - 1];
    assert.ok(levels[previous.difficulty] <= levels[problem.difficulty]);
    if (previous.difficulty === problem.difficulty) assert.ok(rank(previous) <= rank(problem));
  });
});

test('every question has usable content and direct source attribution', () => {
  for (const problem of bank) {
    assert.ok(problem.title.trim(), problem.id);
    assert.ok(problem.summary.trim().length > 15, problem.id);
    assert.ok(problem.hint.trim().length > 30, problem.id);
    assert.ok(problem.topic.trim(), problem.id);
    assert.ok(Number.isInteger(problem.number) && problem.number > 0, problem.id);
    const url = new URL(problem.url);
    assert.equal(url.protocol, 'https:');
    if (problem.source === 'CSES') {
      assert.equal(url.hostname, 'cses.fi');
      assert.equal(url.pathname, `/problemset/task/${problem.number}/`);
    } else {
      assert.equal(url.hostname, 'leetcode.com');
      assert.ok(url.pathname.startsWith('/problems/'));
    }
    if (problem.solution) assert.ok(problem.solution.startsWith('https://github.com/neetcode-gh/leetcode/blob/main/python/'));
    if (problem.video) assert.equal(new URL(problem.video).hostname, 'www.youtube.com');
  }
  assert.equal(bank.find(problem => problem.title === 'Maximum Alternating Subsequence Sum').number, 1911);
  assert.ok(bank.find(problem => problem.title === 'Text Justification').solution.endsWith('0068-text-justification.py'));
});

test('inline application JavaScript compiles alongside the original exercises', () => {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.ok(scripts.length);
  scripts.forEach(script => new vm.Script(script[1]));
  for (let number = 1; number <= 27; number++) {
    assert.equal([...html.matchAll(new RegExp(`data-qid="q${number}"`, 'g'))].length, 1);
  }
  assert.ok(html.includes('Permission is hereby granted, free of charge'));
});
