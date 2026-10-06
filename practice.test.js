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
  const worker = html.match(/<script type="text\/plain" id="question-runner-worker">([\s\S]*?)<\/script>/);
  assert.ok(worker, 'The background worker must also work when opening the HTML directly.');
  new vm.Script(worker[1]);
});

function loadBackgroundRunner() {
  const application = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
  const runner = application.slice(application.indexOf('    let questionWorker = null;'), application.indexOf('    async function runQuestionInBackground'));
  const workers = [];
  const timers = new Map();
  let nextTimer = 0;
  class FakeWorker {
    constructor() { workers.push(this); this.messages = []; this.terminated = false; }
    postMessage(message) { this.messages.push(message); }
    terminate() { this.terminated = true; }
    send(message) { this.onmessage({ data: { id: this.messages.at(-1).id, ...message } }); }
  }
  const context = vm.createContext({
    Worker: FakeWorker, Blob,
    URL: { createObjectURL: () => 'blob:test', revokeObjectURL() {} },
    document: { getElementById: () => ({ textContent: '// worker source' }) },
    setTimeout(callback, milliseconds) { const id = ++nextTimer; timers.set(id, { callback, milliseconds }); return id; },
    clearTimeout(id) { timers.delete(id); }
  });
  vm.runInContext(runner, context);
  return { run: context.executeQuestionPython, workers, timers };
}

test('background execution routes results and prevents simultaneous runs', async () => {
  const { run, workers } = loadBackgroundRunner();
  let ready = 0;
  const first = run('print(5)', () => ready++);
  assert.equal(workers.length, 1);
  const busy = await run('print(6)');
  assert.match(busy.error, /Another question is running/);
  workers[0].send({ type: 'ready' });
  assert.equal(ready, 1);
  // An unrelated or delayed worker message must not complete this run.
  workers[0].onmessage({ data: { id: -1, type: 'result', stdout: 'wrong run' } });
  workers[0].send({ type: 'result', stdout: '5', stderr: '', error: '' });
  assert.equal((await first).stdout, '5');
  const second = run('print(7)', () => ready++);
  assert.equal(workers.length, 1, 'A successful run reuses the loaded runtime.');
  workers[0].send({ type: 'ready' });
  workers[0].send({ type: 'result', stdout: '7', stderr: '', error: '' });
  assert.equal((await second).stdout, '7');
  assert.equal(ready, 2);
});

test('a timed-out run terminates its worker and allows a fresh run', async () => {
  const { run, workers, timers } = loadBackgroundRunner();
  const first = run('while True: pass');
  assert.equal([...timers.values()][0].milliseconds, 60000, 'Loading has its own deadline.');
  workers[0].send({ type: 'ready' });
  const executionTimer = [...timers.values()][0];
  assert.equal(executionTimer.milliseconds, 20000);
  executionTimer.callback();
  assert.match((await first).error, /20 seconds/);
  assert.equal(workers[0].terminated, true);
  const retry = run('print(8)');
  assert.equal(workers.length, 2);
  workers[1].send({ type: 'ready' });
  workers[1].send({ type: 'result', stdout: '8', stderr: '', error: '' });
  assert.equal((await retry).stdout, '8');
});

test('worker loading errors release the runner for retry', async () => {
  const { run, workers, timers } = loadBackgroundRunner();
  const first = run('print(1)');
  workers[0].onerror({ message: 'CDN unavailable', preventDefault() {} });
  assert.equal((await first).error, 'CDN unavailable');
  assert.equal(workers[0].terminated, true);
  assert.equal(timers.size, 0);
  const retry = run('print(2)');
  workers[1].send({ type: 'error', error: 'Still unavailable' });
  assert.equal((await retry).error, 'Still unavailable');
  assert.equal(workers[1].terminated, true);
});
