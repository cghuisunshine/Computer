const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
require('./tools/book_animation_engine.js');
const engine=globalThis.BookAnimationEngine;
const html=fs.readFileSync('data_structure_animations.html','utf8');
const lessons=JSON.parse(html.match(/<script id="book-lessons" type="application\/json">([\s\S]*?)<\/script>/)[1]);

test('every section and algorithm variant introduces the concept, example, and viewing cues',()=>{
  for(const lesson of lessons){
    for(const item of [lesson,...(lesson.variants||[])]){
      assert.deepEqual(Object.keys(item.introduction).sort(),['concept','example','watch']);
      for(const field of ['concept','example','watch'])assert.ok(item.introduction[field].trim(),`${lesson.title}: missing ${field}`);
      assert.notEqual(item.introduction.concept,lesson.focus,`${lesson.title}: introduction must add context beyond the existing focus`);
    }
  }
  const numbered=lessons.filter(l=>!l.overview&&l.chapterNumber!==null);
  assert.equal(new Set(numbered.map(l=>l.introduction.concept)).size,230,'numbered sections need individual introductions');
});

test('all source entries have complete playable traces, including repeated source numbering',()=>{
  assert.equal(lessons.length,259);
  assert.equal(lessons.filter(l=>!l.overview&&l.chapterNumber!==null).length,230);
  assert.equal(new Set(lessons.map(l=>l.id)).size,259);
  assert.equal(lessons.filter(l=>l.title.startsWith('1.21 ')).length,2);
  assert.deepEqual([...new Set(lessons.filter(l=>l.chapterNumber!==null).map(l=>l.chapterNumber))],Array.from({length:22},(_,i)=>i));
  for(const lesson of lessons){
    assert.ok(lesson.focus.length>25,lesson.title);
    assert.ok(lesson.invariant.trim(),lesson.title);
    assert.ok(lesson.page>=1&&lesson.page<=436);
    for(const variant of lesson.variants||[{demo:lesson.demo,options:lesson.options}]){
      const trace=engine.make(variant.demo,variant.options);
      assert.ok(trace.frames.length>=2,lesson.title);
      assert.ok(trace.code.length>0,lesson.title);
      assert.notDeepEqual(trace.frames[0],trace.frames.at(-1),lesson.title);
      for(const frame of trace.frames){
        assert.ok(frame.title&&frame.note,lesson.title);
        assert.ok(frame.line>=0&&frame.line<trace.code.length,`${lesson.title}: outline ${frame.line}`);
        const g=frame.scene.graph;
        if(g){const ids=new Set(g.nodes.map(n=>String(n.id)));for(const edge of g.edges){assert.ok(ids.has(String(edge.a)));assert.ok(ids.has(String(edge.b)));}for(const node of g.nodes)assert.ok(node.y+25<=g.height,`${lesson.title}: clipped node ${node.id}`);}
        if(frame.scene.grid){const widths=frame.scene.grid.values.map(r=>r.length);assert.ok(widths.every(w=>w===widths[0]),lesson.title);}
      }
    }
  }
});

test('every sorting method preserves and correctly orders varied multisets',()=>{
  const inputs=[[8,3,6,1,9,4],[1],[-5,0,3,-2,3],[4,4,4,4],[9,8,7,6,5,4,3,2,1],[1,2,3,4,5],[-99,99,0,-99]];
  const kinds=['bubble','selection','insertion','shell','merge','quick','counting','bucket','radix','heap','tree','external'];
  for(const kind of kinds)for(const values of inputs){const result=engine.make('sort',{kind,values}).result;assert.deepEqual(result,values.slice().sort((a,b)=>a-b),`${kind}: ${values}`);}
});

test('selection returns the requested rank, including duplicates and negative keys',()=>{
  for(const values of [[7],[-8,3,0,3,2,9],[1,1,1],[6,5,4,3,2,1]]){
    const result=engine.make('sort',{kind:'quickselect',values}).result;
    assert.equal(result.value,values.slice().sort((a,b)=>a-b)[result.k]);
    assert.deepEqual(result.array.slice().sort((a,b)=>a-b),values.slice().sort((a,b)=>a-b));
    assert.deepEqual(engine.make('kSmallest',{values}).result,values.slice().sort((a,b)=>a-b).slice(0,3));
  }
  const deterministic=engine.make('median').result;
  assert.equal(deterministic.value,deterministic.source.slice().sort((a,b)=>a-b)[deterministic.k]);
});

test('search variants return a real match or a justified failure',()=>{
  for(const kind of ['linear','ordered','binary','interpolation'])for(const values of [[8,3,6,1,9,4],[4,4,4],[-3,0,8],[7]])for(const target of [-9,0,3,4,7,9,50]){
    const r=engine.make('search',{kind,values,target}).result;
    assert.equal(r.index>=0,values.includes(target),`${kind}: ${values}, target ${target}`);
    if(r.index>=0)assert.equal(r.array[r.index],target);
  }
});

test('string algorithms agree with independent substring lookup on overlapping and absent patterns',()=>{
  for(const kind of ['naive','kmp','automaton','boyer','rabin'])for(const [text,pattern] of [['ABABABCABABABC','ABABC'],['AAAAAA','AAA'],['ABCDEF','ZZ'],['ABCD','ABCD'],['ZZZZ','Z'],['ABCABCD','ABCD'],['ABAB','B']]){
    assert.equal(engine.make('string',{kind,text,pattern}).result.index,text.indexOf(pattern),`${kind}: ${text}/${pattern}`);
  }
});

test('graph algorithms preserve traversal, shortest-path, and spanning-tree results',()=>{
  const edges=[['A','B',4],['A','C',2],['B','C',1],['B','D',5],['C','D',8],['C','E',10],['D','E',2],['D','F',6],['E','F',3]];
  for(const kind of ['bfs','dfs']){const out=engine.make('graphwalk',{kind}).result;assert.equal(out.length,6);assert.equal(new Set(out).size,6);assert.equal(out[0],'A');}
  const dfs=engine.make('graphwalk',{kind:'dfs'}),treeEdges=dfs.frames.at(-1).scene.graph.edges.filter(e=>e.tone==='done'),parents={A:null};
  const pending=['A'];while(pending.length){const u=pending.pop();for(const e of treeEdges){const v=e.a===u?e.b:e.b===u?e.a:null;if(v&&!(v in parents)){parents[v]=u;pending.push(v);}}}
  const ancestor=(a,b)=>{while(b!==null){if(b===a)return true;b=parents[b];}return false;};
  for(const [a,b] of edges)assert.ok(ancestor(a,b)||ancestor(b,a),'undirected DFS has no cross edges');
  const order=engine.make('topological').result;
  for(const [a,b] of [['A','C'],['B','C'],['B','D'],['C','E'],['D','F'],['E','F']])assert.ok(order.indexOf(a)<order.indexOf(b));
  const distances={A:0,B:Infinity,C:Infinity,D:Infinity,E:Infinity,F:Infinity};
  for(let i=0;i<5;i++)for(const [a,b,w] of edges){distances[b]=Math.min(distances[b],distances[a]+w);distances[a]=Math.min(distances[a],distances[b]+w);}
  assert.deepEqual(engine.make('shortest').result,distances);
  assert.deepEqual(engine.make('bellman').result,{A:0,B:4,C:2,D:5,E:6,F:8});
  assert.deepEqual(engine.make('floyd').result,[[0,3,5,6],[5,0,2,3],[3,6,0,1],[2,5,7,0]]);
  let optimum=Infinity;
  for(let mask=0;mask<2**edges.length;mask++){
    const chosen=edges.filter((_,i)=>mask&(1<<i));if(chosen.length!==5)continue;
    const reached=new Set(['A']);for(let i=0;i<6;i++)for(const [a,b] of chosen)if(reached.has(a)||reached.has(b)){reached.add(a);reached.add(b);}
    if(reached.size===6)optimum=Math.min(optimum,chosen.reduce((sum,e)=>sum+e[2],0));
  }
  for(const kind of ['prim','kruskal']){const r=engine.make('mst',{kind}).result;assert.equal(r.weight,optimum);assert.equal(r.edges.length,5);}
});

test('tree traversals and heap results satisfy their structural contracts',()=>{
  assert.deepEqual(engine.make('traversal',{kind:'inorder'}).result,[2,4,6,8,10,12,14]);
  assert.deepEqual(engine.make('traversal',{kind:'preorder'}).result,[8,4,2,6,12,10,14]);
  assert.deepEqual(engine.make('traversal',{kind:'postorder'}).result,[2,6,4,10,14,12,8]);
  assert.deepEqual(engine.make('traversal',{kind:'level'}).result,[8,4,12,2,6,10,14]);
  for(const values of [[8,3,6,1,9,4],[-4,-4,0,8],[1]]){
    const {minimum,heap}=engine.make('heap',{values}).result;
    assert.equal(minimum,Math.min(...values));
    heap.forEach((v,i)=>{if(i)assert.ok(heap[Math.floor((i-1)/2)]<=v);});
    const all=[minimum,...heap].sort((a,b)=>a-b);assert.deepEqual(all,values.slice().sort((a,b)=>a-b));
  }
});

test('dynamic programming and backtracking produce feasible optimal examples',()=>{
  assert.equal(engine.make('knapsack').result,11);
  assert.equal(engine.make('coin').result,2);
  assert.equal(engine.make('fibonacci',{n:10}).result,55);
  const lcs=engine.make('lcs').result;
  const subsequence=(short,long)=>{let i=0;for(const c of long)if(c===short[i])i++;return i===short.length;};
  assert.equal(lcs.length,4);assert.equal(lcs.sequence.length,4);assert.ok(subsequence(lcs.sequence,lcs.a)&&subsequence(lcs.sequence,lcs.b));
  const {board,solved}=engine.make('backtrack').result;assert.ok(solved);
  for(let i=0;i<board.length;i++)for(let j=i+1;j<board.length;j++){assert.notEqual(board[i],board[j]);assert.notEqual(Math.abs(board[i]-board[j]),j-i);}
  const hanoi=engine.make('hanoi');for(const frame of hanoi.frames)for(const peg of frame.scene.rows)for(let i=1;i<peg.items.length;i++)assert.ok(Number(peg.items[i-1].value)>Number(peg.items[i].value));
});

test('peak finders return genuine local maxima and Bloom filter demonstrates both outcomes',()=>{
  for(const values of [[8,3,6,1,9,4],[1],[2,2,2],[-8,-3,-9],[1,2,3,4],[4,3,2,1]]){const r=engine.make('peak',{values}).result;assert.ok(r.index===0||values[r.index]>=values[r.index-1]);assert.ok(r.index===values.length-1||values[r.index]>=values[r.index+1]);}
  const {position:[r,c],array}=engine.make('peak2d').result;for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]])if(array[r+dr]?.[c+dc]!==undefined)assert.ok(array[r][c]>=array[r+dr][c+dc]);
  const bloom=engine.make('bloom');assert.ok(bloom.frames.some(f=>f.title.includes('definitely absent')));assert.ok(bloom.frames.some(f=>f.note.includes('false positive')));
});

test('the standalone output embeds scripts and styles without remote runtime dependencies',()=>{
  assert.ok(!/<script[^>]+src=|<link[^>]+stylesheet/i.test(html));
  assert.ok(html.includes('prefers-reduced-motion'));
  assert.ok(html.includes('data_structure_extracted.html#page-'));
});
