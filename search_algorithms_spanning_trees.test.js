const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM, VirtualConsole} = require('jsdom');
const html = fs.readFileSync(path.join(__dirname, 'search_algorithms_spanning_trees.html'), 'utf8');
function load(reduced=false,url='https://example.test/search_algorithms_spanning_trees.html'){
 const errors=[],timers=new Map();let nextTimer=0;const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e));
 const dom=new JSDOM(html,{url,runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.matchMedia=()=>({matches:reduced});w.setTimeout=fn=>{const id=++nextTimer;timers.set(id,fn);return id};w.clearTimeout=id=>timers.delete(id)}});
 const doc=dom.window.document;
 return {dom,doc,api:dom.window.SearchTreeLab,errors,timers,choose(id,value){const el=doc.getElementById(id);el.value=String(value);el.dispatchEvent(new dom.window.Event('change'))},seek(i){const el=doc.getElementById('timeline');el.value=i;el.dispatchEvent(new dom.window.Event('input'))}};
}
function forest(g,ids){
 const parent=Object.fromEntries(g.nodes.map(n=>[n.id,n.id]));const find=v=>parent[v]===v?v:find(parent[v]);
 for(const id of ids){const e=g.edges.find(e=>e.id===id);assert.ok(e,`edge ${id} exists`);assert.notEqual(find(e.a),find(e.b),`no cycle at ${id}`);parent[find(e.a)]=find(e.b)}
 return new Set(g.nodes.map(n=>find(n.id))).size;
}
test('all PDF traversal examples have expected increasing-neighbor visit orders',()=>{
 const {api,dom,errors}=load();
 const expected={small:['1,2,3,4,5','1,2,4,3,5'],twelve:['1,7,9,12,2,10,3,11,8,4,6,5','1,7,2,8,11,3,12,10,9,4,5,6'],ten:['1,3,4,6,7,9,2,8,5,10','1,3,4,2,5,7,6,9,8,10'],closing:['A,C,D,F,B,H,G,E','A,C,B,D,G,E,H,F']};
 for(const [id,orders] of Object.entries(expected))for(const [i,algorithm]of ['bfs','dfs'].entries()){
  const g=api.graphs[id],frames=api.traversal(g,algorithm,id==='closing'?'A':'1'),last=frames.at(-1);
  assert.equal(last.order.join(','),orders[i]);assert.equal(forest(g,last.tree),1);assert.equal(last.tree.length,g.nodes.length-1);
  for(const f of frames){assert.equal(new Set(f.visited).size,f.visited.length);assert.equal(new Set(f.queue).size,f.queue.length);assert.equal(new Set(f.stack).size,f.stack.length);forest(g,f.tree);assert.ok(f.queue.every(v=>f.visited.includes(v)));assert.ok(f.stack.every(v=>f.visited.includes(v)))}
  if(algorithm==='dfs')for(let j=1;j<frames.length;j++)if(frames[j].tree.length>frames[j-1].tree.length)assert.equal(frames[j].kind,'Add tree edge');
 }
 assert.deepEqual(errors,[]);dom.window.close();
});
test('every start vertex yields a complete traversal and BFS depths are shortest unweighted distances',()=>{
 const {api,dom}=load();for(const id of ['small','twelve','ten','closing']){const g=api.graphs[id];for(const start of g.nodes.map(n=>n.id))for(const algorithm of ['bfs','dfs']){
  const last=api.traversal(g,algorithm,start).at(-1);assert.equal(last.order.length,g.nodes.length);assert.equal(last.order[0],start);assert.equal(forest(g,last.tree),1);
  if(algorithm==='bfs'){
   // Bellman-Ford relaxation provides a separate shortest-distance oracle.
   const distances=Object.fromEntries(g.nodes.map(n=>[n.id,n.id===start?0:Infinity]));for(let i=0;i<g.nodes.length;i++)for(const e of g.edges){distances[e.a]=Math.min(distances[e.a],distances[e.b]+1);distances[e.b]=Math.min(distances[e.b],distances[e.a]+1)}
   const depths={[start]:0};for(const edge of last.tree){const [a,b]=edge.split('-');if(a in depths)depths[b]=depths[a]+1;else depths[a]=depths[b]+1}assert.deepEqual(depths,distances);
  }
 }}dom.window.close();
});
test('MST solutions are globally minimal by exhaustive spanning-tree enumeration',()=>{
 const {api,dom}=load(),g=api.graphs.mst;let minimum=Infinity,solutions=0;
 for(let mask=0;mask<2**g.edges.length;mask++){
  const chosen=g.edges.filter((_,i)=>mask&(1<<i));if(chosen.length!==6)continue;
  const reached=new Set(['A']);for(let k=0;k<7;k++)for(const e of chosen)if(reached.has(e.a)||reached.has(e.b)){reached.add(e.a);reached.add(e.b)}if(reached.size!==7)continue;
  const cost=chosen.reduce((a,e)=>a+e.w,0);if(cost<minimum){minimum=cost;solutions=1}else if(cost===minimum)solutions++;
 }
 assert.equal(minimum,15);assert.equal(solutions,2);
 for(const algorithm of ['kruskal','prim'])for(const tie of ['forward','reverse'])for(const start of g.nodes.map(n=>n.id)){
  const frames=api.minimumTree(g,algorithm,start,tie),last=frames.at(-1);assert.equal(last.weight,minimum);assert.equal(forest(g,last.tree),1);assert.equal(last.tree.length,6);
  for(const f of frames){forest(g,f.tree);assert.equal(f.weight,f.tree.reduce((s,id)=>s+g.edges.find(e=>e.id===id).w,0));if(algorithm==='prim'&&f.kind==='Choose minimum'){const cut=g.edges.filter(e=>f.visited.includes(e.a)!==f.visited.includes(e.b));assert.equal(g.edges.find(e=>e.id===f.edge).w,Math.min(...cut.map(e=>e.w)))}}
 }
 const a=api.minimumTree(g,'kruskal','A','forward').at(-1).tree,b=api.minimumTree(g,'kruskal','A','reverse').at(-1).tree;assert.ok(a.includes('A-D'));assert.ok(b.includes('B-E'));dom.window.close();
});
test('weighted lengths, symmetric matrix, FLOP counts and scan costs match the handout',()=>{
 const {api,dom}=load(),g=api.graphs.weighted;
 for(const [problem,total]of [['edge',7],['path',11],['cycle',17]])assert.equal(api.weightedProblem(g,problem).at(-1).weight,total);
 const matrix=api.weightedProblem(g,'matrix').at(-1).entries;assert.equal(matrix.length,49);assert.equal(new Set(matrix.map(e=>e.slice(0,2).join())).size,49);
 for(const [a,b,value]of matrix){assert.equal(matrix.find(e=>e[0]===b&&e[1]===a)[2],value);const e=g.edges.find(e=>[e.a,e.b].includes(a)&&[e.a,e.b].includes(b)&&a!==b);assert.equal(value,a===b?0:e?e.w:'∞')}
 assert.equal(g.edges.find(e=>e.id==='D-F').w,9);assert.equal(api.graphs.mst.edges.find(e=>e.id==='D-F').w,6);
 for(let n=1;n<=50;n++){const frames=api.flopFrames(n),last=frames.at(-1);assert.equal(last.total,n*n+2*n+204);assert.equal(last.inner,n*n);assert.equal(last.linear,2*n);assert.equal(last.fixed,204);for(const f of frames)assert.equal(f.total,f.inner+f.linear+f.fixed)}
 assert.equal(api.scanFrames(api.graphs.small,'matrix').at(-1).checks,25);assert.equal(api.scanFrames(api.graphs.small,'list').at(-1).checks,14);dom.window.close();
});
test('all lesson types render, seek and rewind with one correctly highlighted code line',()=>{
 const {api,dom,doc,choose,seek,errors}=load();
 const cases=[['search','algorithm-choice','bfs'],['search','algorithm-choice','dfs'],['mst','mst-algorithm','kruskal'],['mst','mst-algorithm','prim'],...['edge','path','cycle','matrix'].map(p=>['weighted','problem-choice',p]),['complexity','complexity-choice','flops'],['complexity','complexity-choice','scan']];
 for(const [mode,id,value]of cases){api.setMode(mode);choose(id,value);const frames=api.getState().frames;for(let i=0;i<frames.length;i++){seek(i);assert.equal(doc.getElementById('explanation').textContent,frames[i].text);assert.equal(doc.querySelectorAll('#code .on').length,1);assert.equal(doc.querySelectorAll('.trace.accepted').length,frames[i].tree?.length||0)}assert.equal(doc.getElementById('next').disabled,true);seek(0);assert.equal(doc.getElementById('back').disabled,true);assert.equal(doc.querySelectorAll('.trace.accepted').length,0)}
 assert.deepEqual(errors,[]);dom.window.close();
});
test('play, pause, speed changes, reset, topic changes and replay have consistent timers',()=>{
 const {api,dom,doc,choose,seek,timers,errors}=load();const play=doc.getElementById('play');play.click();assert.equal(timers.size,1);const [id,tick]=[...timers.entries()][0];timers.delete(id);tick();assert.equal(api.getState().index,1);choose('speed','450');assert.equal(timers.size,1);play.click();assert.equal(timers.size,0);play.click();api.setMode('mst');assert.equal(timers.size,0);seek(api.getState().frames.length-1);play.click();assert.equal(api.getState().index,0);assert.equal(api.getState().playing,true);doc.getElementById('reset').click();assert.equal(timers.size,0);assert.equal(api.getState().index,0);assert.equal(api.getState().playing,false);assert.deepEqual(errors,[]);dom.window.close();
});
test('controls remain operable with reduced motion and n can change while paused or playing',()=>{
 const {api,dom,doc,choose,errors,timers}=load(true);api.setMode('complexity');const slider=doc.getElementById('n-choice');slider.value='50';slider.dispatchEvent(new dom.window.Event('input'));assert.equal(api.getState().config.n,50);assert.equal(api.getState().frames.at(-1).total,2804);doc.getElementById('play').click();slider.value='5';slider.dispatchEvent(new dom.window.Event('input'));assert.equal(timers.size,0);assert.equal(api.getState().frames.at(-1).total,239);choose('complexity-choice','scan');choose('representation-choice','list');assert.equal(api.getState().frames.at(-1).checks,14);assert.deepEqual(errors,[]);dom.window.close();
});

test('published page is self-contained and the companion PDF link is available locally',()=>{
 const remote=load();assert.equal(remote.doc.getElementById('source-pdf').hidden,true);assert.equal(remote.doc.querySelectorAll('script[src],link[rel="stylesheet"],img[src]').length,0);remote.dom.window.close();
 const local=load(false,'file:///workspace/search_algorithms_spanning_trees.html');assert.equal(local.doc.getElementById('source-pdf').hidden,false);assert.deepEqual(local.errors,[]);local.dom.window.close();
});
