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
      w.HTMLElement.prototype.scrollIntoView = function () {};
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
  assert.equal(doc.querySelectorAll('script[src],link[rel="stylesheet"]').length,0);
  const images=[...doc.querySelectorAll('img')];
  assert.equal(images.length,5,'all five chapter figures are included');
  for(const image of images) {
    assert.match(image.src,/^data:image\/svg\+xml;base64,/);
    assert.ok(image.alt.length>20);
    const svg=Buffer.from(image.src.split(',')[1],'base64').toString();
    assert.match(svg,/<svg/);
    assert.doesNotMatch(svg,/<script\b/);
    assert.doesNotMatch(svg,/(?:xlink:)?href="(?!#|data:)/);
  }
  assert.doesNotMatch(html,/\{\{[A-Z_]+\}\}/);
  assert.match(doc.getElementById('source').textContent,/krahets/);
  assert.match(doc.getElementById('source').textContent,/CC BY-NC-SA 4.0/);
  dom.window.close();
});

test('route explorer enumerates every valid route once and backtracking counts the same complete routes', () => {
  const {dom,api}=load();
  function choose(n,k){let value=1;for(let i=1;i<=k;i++)value=value*(n-i+1)/i;return Math.round(value);}
  for(let n=1;n<=9;n++) {
    const expected=Array.from({length:Math.floor(n/2)+1},(_,k)=>choose(n-k,k)).reduce((a,b)=>a+b,0);
    const found=api.routesFor(n),keys=found.map(r=>r.join(','));
    assert.equal(found.length,expected);assert.equal(new Set(keys).size,expected);
    for(const route of found){assert.ok(route.every(move=>move===1||move===2));assert.equal(route.reduce((a,b)=>a+b,0),n);}
    const frames=api.backtrackFrames(n),successes=frames.filter(f=>f.kind==='Count route');
    assert.equal(successes.length,expected);assert.equal(frames.at(-1).count,expected);
    assert.deepEqual(Array.from(successes,f=>f.moves.join(',')).sort(),Array.from(keys).sort());
    for(const [i,f] of frames.entries()) {
      assert.equal(f.positions[0],0);assert.ok(f.positions.every(p=>p>=0&&p<=n));
      assert.equal(f.positions.length,f.moves.length+1);
      for(let j=1;j<f.positions.length;j++)assert.equal(f.positions[j]-f.positions[j-1],f.moves[j-1]);
      if(f.kind==='Skip move')assert.ok(f.attempt>n);
      if(i>0)assert.equal(f.count-frames[i-1].count,f.kind==='Count route'?1:0);
    }
  }
  dom.window.close();
});

test('students can explore routes, step successful paths, rewind, and launch the n=9 comparison', () => {
  const {dom,doc,api,errors}=load();
  assert.equal(doc.querySelectorAll('[data-route]').length,3);
  doc.querySelector('[data-route="2"]').click();
  assert.match(doc.getElementById('route-status').textContent,/Landings: 0 → 2 → 3/);
  for(let count=1;count<=3;count++){doc.getElementById('bt-found').click();assert.equal(doc.getElementById('bt-count').textContent,String(count));}
  assert.equal(doc.getElementById('bt-found').disabled,true);
  doc.getElementById('bt-back').click();assert.equal(doc.getElementById('bt-count').textContent,'2');
  doc.getElementById('bt-reset').click();assert.equal(doc.getElementById('bt-count').textContent,'0');
  const select=doc.getElementById('route-stairs');select.value='9';select.dispatchEvent(new dom.window.Event('change'));
  assert.equal(doc.querySelectorAll('[data-route]').length,55);
  doc.getElementById('bt-finish').click();assert.equal(doc.getElementById('bt-count').textContent,'55');
  select.value='5';select.dispatchEvent(new dom.window.Event('change'));
  assert.equal(doc.querySelectorAll('[data-route]').length,8);assert.equal(doc.getElementById('bt-count').textContent,'0');
  for(const button of doc.querySelectorAll('[data-open-method]')) {
    button.click();assert.equal(api.getState().method,button.dataset.openMethod);assert.equal(api.getState().n,Number(button.dataset.openN));assert.equal(api.getState().index,0);
  }
  assert.deepEqual(errors,[]);dom.window.close();
});

test('all five complete Python examples remain visible and runnable independently', () => {
  const {dom,doc,api}=load();
  const examples=[...doc.querySelectorAll('[data-python-example]')];assert.equal(examples.length,5);
  for(const example of examples) {
    const source=example.textContent;
    const result=spawnSync('python3',['-c',source+'\nassert [climb(n) for n in range(1, 13)] == '+JSON.stringify(Array.from({length:12},(_,i)=>routes(i+1).length))],{encoding:'utf8'});
    assert.equal(result.status,0,result.stderr);assert.equal(result.stdout.trim(),'55');
    const method=example.dataset.pythonExample;
    const original=fs.readFileSync(path.join(__dirname,'tools/dynamic_programming_examples',method+'.py'),'utf8').trim();
    assert.equal(source,original);
    if(method!=='backtracking')assert.equal(api.methods[method].code,source.split('\n\n\nif __name__')[0]);
  }
  assert.deepEqual([...doc.querySelectorAll('#worked-dp-table tbody td:last-child')].map(c=>Number(c.textContent)),[1,2,3,5,8,13,21,34,55]);
  assert.equal(doc.querySelectorAll('#worked-rolling-table tbody tr').length,7);
  dom.window.close();
});
