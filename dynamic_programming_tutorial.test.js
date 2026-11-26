const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const {JSDOM, VirtualConsole} = require('jsdom');
const html = fs.readFileSync(path.join(__dirname, 'dynamic_programming_tutorial.html'), 'utf8');

function load() {
  const errors = [], timers = new Map();
  let serial = 0;
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e));
  const dom = new JSDOM(html, {runScripts:'dangerously', url:'https://example.test/', virtualConsole:vc,
    beforeParse(w) {
      w.setTimeout = fn => {timers.set(++serial, fn); return serial;};
      w.clearTimeout = id => timers.delete(id);
    }});
  const doc = dom.window.document, api = dom.window.DPTutorial;
  const choose = method => doc.querySelector(`[data-method="${method}"]`).click();
  const stairs = n => {const el=doc.getElementById('stairs');el.value=n;el.dispatchEvent(new dom.window.Event('input'));};
  return {dom,doc,api,errors,timers,choose,stairs};
}

// Independent oracle: enumerate move sequences, rather than compute the recurrence.
function routes(n) {
  const found=[];
  function walk(position,moves) {
    if(position===n){found.push(moves);return;}
    for(const step of [1,2]) if(position+step<=n) walk(position+step,[...moves,step]);
  }
  walk(0,[]);
  return found;
}

test('all methods count exactly the independently enumerated routes for 1–12 stairs', () => {
  const {dom,api,errors}=load();
  for(let n=1;n<=12;n++) {
    const expected=routes(n).length;
    for(const method of Object.keys(api.methods)) {
      const frames=api.framesFor(method,n),last=frames.at(-1);
      assert.equal(method==='rolling'?last.b:last.values[n],expected,`${method}, n=${n}`);
      assert.equal(last.stack.length,0);
      for(const f of frames) {
        assert.ok(f.line>=0 && f.line<api.methods[method].code.split('\n').length);
        for(let i=1;i<=n;i++) if(f.values[i]!==null) assert.equal(f.values[i],routes(i).length);
      }
    }
  }
  assert.deepEqual(errors,[]); dom.window.close();
});

test('memoization expands each non-base state once and cache hits do not branch', () => {
  const {dom,api}=load();
  for(let n=3;n<=12;n++) {
    const frames=api.framesFor('memo',n),last=frames.at(-1);
    assert.equal(last.adds,n-2);
    for(let i=3;i<=n;i++) assert.equal(frames.filter(f=>f.kind==='Store answer' && f.current===i).length,1);
    for(let i=0;i<frames.length;i++) if(frames[i].kind==='Cache hit') {
      assert.equal(frames[i+1].kind,'Return');
      assert.equal(frames[i].calls,frames[i+1].calls);
    }
    assert.ok(last.calls<=api.framesFor('brute',n).at(-1).calls);
  }
  assert.equal(api.framesFor('brute',5).at(-1).calls,9);
  assert.equal(api.framesFor('memo',5).at(-1).calls,7);
  assert.ok(api.framesFor('memo',9).at(-1).hits>0);
  dom.window.close();
});

test('tabulation only reads computed dependencies; rolling values preserve the window', () => {
  const {dom,api}=load();
  for(let n=3;n<=12;n++) {
    for(const f of api.framesFor('table',n)) for(const i of f.deps) assert.notEqual(f.values[i],null);
    const rolling=api.framesFor('rolling',n);
    for(const f of rolling) if(f.kind==='Roll forward') {
      assert.equal(f.a,routes(f.current-1).length);
      assert.equal(f.b,routes(f.current).length);
      assert.equal(f.values.filter(v=>v!==null).length,0,'rolling trace retains no algorithm DP table');
    }
    assert.equal(rolling.at(-1).adds,n-2);
  }
  dom.window.close();
});

test('every generated frame renders and can be revisited without changing its data', () => {
  const {dom,doc,api,choose,stairs,errors}=load();
  for(const method of Object.keys(api.methods)) for(const n of [1,2,5,12]) {
    choose(method);stairs(n);
    const frames=api.framesFor(method,n),original=JSON.stringify(frames);
    const timeline=doc.getElementById('timeline');
    for(let i=0;i<frames.length;i++) {
      timeline.value=i;timeline.dispatchEvent(new dom.window.Event('input'));
      assert.equal(doc.getElementById('event-text').textContent,frames[i].text);
      assert.equal(doc.querySelectorAll('#python .on').length,1);
      assert.equal(api.getState().index,i);
    }
    assert.equal(doc.getElementById('next').disabled,true);
    assert.equal(doc.getElementById('metric-result').textContent,String(routes(n).length));
    doc.getElementById('reset').click();
    assert.equal(api.getState().index,0);
    assert.equal(doc.getElementById('back').disabled,true);
    assert.equal(JSON.stringify(frames),original);
    if(n<=2)assert.equal(doc.getElementById('play').disabled,method==='table'||method==='rolling');
  }
  assert.deepEqual(errors,[]);dom.window.close();
});

test('playback, seeking, speed changes and changing methods never leave extra timers', () => {
  const {dom,doc,api,timers,choose,stairs}=load();
  const play=doc.getElementById('play');play.click();assert.equal(timers.size,1);
  let [id,tick]=[...timers.entries()][0];timers.delete(id);tick();assert.equal(api.getState().index,1);
  doc.getElementById('speed').value='300';doc.getElementById('speed').dispatchEvent(new dom.window.Event('change'));assert.equal(timers.size,1);
  play.click();assert.equal(timers.size,0);
  play.click();choose('memo');assert.equal(timers.size,0);
  play.click();stairs(9);assert.equal(timers.size,0);
  doc.getElementById('finish').click();assert.equal(api.getState().index,api.getState().length-1);
  play.click();assert.equal(api.getState().index,0);assert.equal(api.getState().playing,true);
  let safety=1000;
  while(timers.size && safety--){[id,tick]=[...timers.entries()][0];timers.delete(id);tick();}
  assert.ok(safety>0);assert.equal(api.getState().playing,false);assert.equal(timers.size,0);
  dom.window.close();
});

test('the displayed Python implementations execute with the same route counts', () => {
  const {dom,api}=load();
  const script=Object.values(api.methods).map(m=>m.code+'\n'+`assert [climb(n) for n in range(1, 13)] == ${JSON.stringify(Array.from({length:12},(_,i)=>routes(i+1).length))}`).join('\n\n');
  const result=spawnSync('python3',['-c',script],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);dom.window.close();
});

test('quiz explains incorrect choices and allows correction', () => {
  const {dom,doc,errors}=load();
  for(const [i,correct] of [1,0,1].entries()) {
    const q=doc.querySelector(`[data-question="${i}"]`);
    q.querySelector(`[data-answer="${correct===0?1:0}"]`).click();
    assert.match(q.querySelector('.feedback').textContent,/Try again/);
    q.querySelector(`[data-answer="${correct}"]`).click();
    assert.match(q.querySelector('.feedback').textContent,/Correct/);
    assert.equal(q.querySelectorAll('[aria-pressed="true"]').length,1);
  }
  assert.deepEqual(errors,[]);dom.window.close();
});

test('page is self-contained, all internal links resolve, and source attribution is retained', () => {
  const {dom,doc}=load();
  const ids=[...doc.querySelectorAll('[id]')].map(el=>el.id);
  assert.equal(new Set(ids).size,ids.length);
  for(const a of doc.querySelectorAll('a[href^="#"]')) assert.ok(doc.getElementById(a.hash.slice(1)),a.href);
  for(const b of doc.querySelectorAll('.section-link')) assert.ok(doc.getElementById(b.dataset.target));
  assert.equal(doc.querySelectorAll('script[src],link[rel="stylesheet"],img[src]').length,0);
  assert.doesNotMatch(html,/\{\{[A-Z_]+\}\}/);
  assert.match(doc.getElementById('source').textContent,/krahets/);
  assert.match(doc.getElementById('source').textContent,/CC BY-NC-SA 4.0/);
  dom.window.close();
});
