/* Deterministic teaching traces. All algorithms run locally; no network or packages. */
(() => {
  'use strict';
  const copy = x => JSON.parse(JSON.stringify(x));
  const range = n => Array.from({length:n}, (_,i)=>i);
  const cell = (value, id, tone='', label='') => ({id:String(id),value:String(value),tone,label});
  const row = (label,values,active=[],done=[]) => ({label,items:values.map((v,i)=>cell(v,i,active.includes(i)?'focus':done.includes(i)?'done':'',String(i)))});
  const registry = {};
  function trace(code) {
    const frames=[];
    return {frames,code,add(title,note,scene={},line=0,metrics={}) {frames.push(copy({title,note,scene,line,metrics}));},finish(result) {return {frames,code:this.code,result:copy(result??null)};}};
  }
  function story(code,steps) {const t=trace(code);steps.forEach(([title,note,scene],i)=>t.add(title,note,scene,Math.min(i,code.length-1)));return t.finish();}
  const N = (id,value,x,y,tone='',label='') => ({id:String(id),value:String(value),x,y,tone,label});
  const E = (a,b,label='',tone='',arrow=false) => ({a:String(a),b:String(b),label:String(label),tone,arrow});
  function treeGraph(values,active=[],done=[]) {
    const depth=Math.floor(Math.log2(Math.max(1,values.length))),nodes=[],edges=[];
    values.forEach((v,i)=>{if(v===null)return; const d=Math.floor(Math.log2(i+1)),k=i-(2**d-1),width=760/(2**d);nodes.push(N(i,v,30+width*(k+.5),40+d*82,active.includes(i)?'focus':done.includes(i)?'done':'',String(i))); if(i&&values[Math.floor((i-1)/2)]!==null)edges.push(E(Math.floor((i-1)/2),i));});
    return {nodes,edges,height:Math.max(220,90+depth*82)};
  }
  const listGraph = (a,active=-1,doubly=false,circular=false) => ({height:230,nodes:a.map((v,i)=>N(i,v,85+i*125,90,i===active?'focus':'',i===0?'head':i===a.length-1?'tail':'')),edges:a.slice(1).flatMap((_,i)=>[E(i,i+1,'','',true),...(doubly?[E(i+1,i,'prev','',true)]:[])]).concat(circular?[E(a.length-1,0,'back to head','focus',true)]:[])});
  function roadmap(opt) {
    const a=opt.labels||['Understand the model','Trace a small example','Check the invariant','Apply and compare'];
    return story(a, a.map((v,i)=>[v, (opt.notes||[])[i]||['Start with the input and the operations the section defines.','Follow one concrete state change at a time.','Explain why each step preserves the required behavior.','Choose this technique when its assumptions match the problem.'][i%4],{rows:[row('Learning path',a,[i],range(i))]}]));
  }
  registry.roadmap=roadmap;
  registry.variables=()=>story(['x ← 4','y ← x','x ← 9','read y'],[
    ['Bind a name','x refers to the integer 4.',{rows:[row('Names',['x → 4'])]}],
    ['Copy a reference','y = x binds y to the same integer object.',{graph:{height:230,nodes:[N('x','x',120,65),N('y','y',120,165),N('four',4,480,115)],edges:[E('x','four','', '',true),E('y','four','','',true)]}}],
    ['Rebind x','Integers are immutable. x = 9 changes the binding, not the integer 4.',{graph:{height:230,nodes:[N('x','x',120,65),N('y','y',120,165),N('four',4,480,165),N('nine',9,480,65,'focus')],edges:[E('x','nine','','focus',true),E('y','four','','',true)]}}],
    ['Read the independent bindings','x is 9; y still refers to 4.',{rows:[row('Result',['x = 9','y = 4'],[],[0,1])]}]
  ]);
  registry.types=()=>story(['read a value','identify its type','choose a valid operation','check the result'],[
    ['Values have types','The same printed characters can represent different kinds of values.',{rows:[row('Values',['7','"7"','True','[7]'])]}],
    ['Numeric addition','7 + 3 evaluates to the integer 10.',{rows:[row('Integer operation',['7','+','3','=','10'],[4])]}],
    ['String concatenation','"7" + "3" concatenates characters, producing "73".',{rows:[row('String operation',['"7"','+','"3"','=','"73"'],[4])]}],
    ['Operations belong to the type','A list supports append; an integer does not. Check the interface before using an operation.',{rows:[row('List operation',['[7]','append(3)','[7, 3]'],[],[2])]}]
  ]);
  registry.adt=()=>story(['define operations','choose a representation','perform an operation','preserve observable behavior'],[
    ['Specify behavior first','A stack ADT promises push, pop, and top. Its users need not know the storage layout.',{rows:[row('Stack contract',['push(x)','pop()','top()'])]}],
    ['Choose a representation','An array and a linked chain can both implement the same stack behavior.',{rows:[row('Array',[4,7]),row('Linked nodes',['4 → 7 → None'])]}],
    ['Apply the same operation','push(9) places 9 at the top in either implementation.',{rows:[row('Array',[4,7,9],[2]),row('Linked nodes',['4 → 7 → 9 → None'],[0])]}],
    ['Check the contract','Both versions return 9 for pop(). Representation changes do not change the ADT result.',{rows:[row('Return values',['array: 9','linked: 9'],[],[0,1])]}]
  ]);
  registry.growth=(o)=>{
    const t=trace(['choose input size n','count modeled operations','double n','compare the growth factors']);
    const rates=[['1',n=>1],['log₂ n',n=>Math.ceil(Math.log2(n))],['n',n=>n],['n log₂ n',n=>Math.ceil(n*Math.log2(n))],['n²',n=>n*n],['2ⁿ',n=>2**n]];
    const maximum=o.n||8;
    [...new Set([Math.max(1,Math.floor(maximum/4)),Math.max(1,Math.floor(maximum/2)),maximum])].forEach(n=>t.add(`Input size ${n}`,'These are illustrative operation counts, not measured seconds. Increasing input affects each growth rate differently.',{bars:rates.map(([name,f],i)=>({id:i,label:name,value:f(n),tone:i===4?'focus':''})),logScale:true},1,{n}));return t.finish();
  };
  registry.bounds=(o)=>{
    const kind=o.kind||'theta',t=trace(['choose a comparison function g(n)','choose constant multiples','ignore a finite prefix','check the inequality for every n ≥ n₀']);
    [2,4,8,16].forEach(n=>{let f=3*n+2; t.add(`n = ${n}`,kind==='omega'?'3n + 2 ≥ 3n for positive n: a linear lower bound.':kind==='bigO'?'3n + 2 ≤ 4n for n ≥ 2: a linear upper bound.':'For n ≥ 2, 3n ≤ 3n + 2 ≤ 4n: matching linear lower and upper bounds.',{bars:[{id:'lo',label:'3n',value:3*n},{id:'f',label:'f(n)=3n+2',value:f,tone:'focus'},{id:'hi',label:'4n',value:4*n}],equation:kind==='bigO'?'f(n) ∈ O(n)':kind==='omega'?'f(n) ∈ Ω(n)':'f(n) ∈ Θ(n)'},n===2?1:3,{n,'f(n)':f});});return t.finish();
  };
  registry.analysis=(o)=>{
    const a=o.values,t=trace(['scan each item','increment the work counter','stop on a match or at the end']);
    let count=0;for(let i=0;i<a.length;i++){count++;t.add(`Inspect index ${i}`,`One comparison has been performed for each visited item. Searching for ${a.at(-1)} requires ${a.length} comparisons here.`,{rows:[row('Input',a,[i],range(i))]},0,{comparisons:count});}
    t.add('Compare the cases','Best case: first item matches (1). Worst case: scan all n items. With a uniformly located successful target, average comparisons are (n + 1)/2.',{rows:[row('Same input size',[`best: 1`,`average: ${(a.length+1)/2}`,`worst: ${a.length}`])]},2);return t.finish(count);
  };
  registry.summation=()=>{
    const t=trace(['sum ← 0','for k = 1..n: sum ← sum + k','compare with n(n+1)/2']);let sum=0;
    for(let k=0;k<=6;k++){sum+=k;t.add(k?`Add ${k}`:'Start with zero','Adding the integers 1 through n makes a triangular count. Pairing the forward and reverse sequences gives n pairs of n+1.',{rows:[row('Terms',range(6).map(i=>i+1),k?[k-1]:[],range(Math.max(0,k-1)))],grid:{values:range(6).map(r=>range(6).map(c=>c<=r?1:'')),active:k?[k-1,k-1]:null},equation:`1 + ⋯ + ${k} = ${sum}; n(n+1)/2 = ${k*(k+1)/2}`},1,{sum});}return t.finish(sum);
  };
  registry.master=(o)=>{
    const subtract=o.kind==='subtract',t=trace(subtract?['T(n) = T(n−1) + n','expand one recursive call','sum n + (n−1) + ⋯ + 1']:['T(n) = 2T(n/2) + n','draw each recursion level','sum the work over all levels']);
    if(subtract){for(let n=6;n>=1;n--)t.add(`Problem size ${n}`,'Reducing size by one gives a chain. With linear nonrecursive work, the total is a triangular sum: Θ(n²).',{rows:[row('Active calls',range(7-n).map(i=>`T(${6-i})`),[6-n])],bars:range(7-n).map(i=>({id:i,label:`size ${6-i}`,value:6-i})),equation:'T(n) = T(n−1) + n ⇒ Θ(n²)'},1);return t.finish();}
    for(let d=0;d<=3;d++)t.add(`Recursion level ${d}`,`At this level there are ${2**d} subproblems, each of size ${8/2**d}. Their combined nonrecursive work is 8.`,{rows:range(d+1).map(j=>row(`Level ${j}`,range(2**j).map(()=>8/2**j))),equation:'2ᵈ × (n / 2ᵈ) = n; Θ(log n) levels ⇒ Θ(n log n)'},1,{level:d,'work per level':8});return t.finish();
  };
  registry.amortized=()=>{
    const t=trace(['append when space is available','when full: allocate twice the capacity','copy existing elements, then append','charge total work across all appends']);let a=[],cap=1,total=0;
    for(let x=1;x<=8;x++){let cost=1;if(a.length===cap){cost+=a.length;cap*=2;t.add('Grow the backing array',`Copy ${a.length} existing elements into capacity ${cap}. This particular append is expensive.`,{rows:[row('Existing values',a)],equation:`new capacity = ${cap}`},1,{capacity:cap});}a.push(x);total+=cost;t.add(`Append ${x}`,`This append costs ${cost} modeled writes; total so far ${total}. Geometric resizing makes the total linear over a sequence of n appends.`,{rows:[row(`Storage · capacity ${cap}`,a.concat(Array(cap-a.length).fill('·')),[a.length-1])]},0,{writes:total,items:a.length});}return t.finish(a);
  };
  registry.recursion=(o)=>{
    const n=Math.min(6,o.n||4),t=trace(['factorial(n):','  if n ≤ 1: return 1','  return n × factorial(n−1)']);let stack=[];
    for(let k=n;k>=1;k--){stack.push(k);t.add(`Call factorial(${k})`,k===1?'The base case returns 1; recursion stops growing.':`Keep ${k} in this call frame and ask for factorial(${k-1}).`,{rows:[row('Call stack · oldest → newest',stack.map(x=>`fact(${x})`),[stack.length-1])]},k===1?1:2,{depth:stack.length});}
    let result=1;while(stack.length){let k=stack.pop();result*=k;t.add(`Return ${result}`,`factorial(${k}) returns ${result}. Only the caller resumes; finished frames leave the stack.`,{rows:[row('Waiting callers',stack.map(x=>`fact(${x})`)),row('Return',[result],[0])]},2,{depth:stack.length});}return t.finish(result);
  };
  registry.hanoi=()=>{
    const t=trace(['move(n, from, via, to)','move(n−1, from, to, via)','move largest remaining disk','move(n−1, via, from, to)']),pegs=[[3,2,1],[],[]];
    const shot=(title,note)=>t.add(title,note,{rows:pegs.map((p,i)=>row('Peg '+['A','B','C'][i],p))},2);
    shot('Three disks on A','Only the top disk may move; a larger disk must never rest on a smaller disk.');
    function move(n,a,b,c){if(!n)return;move(n-1,a,c,b);let disk=pegs[a].pop();pegs[c].push(disk);shot(`Move disk ${disk}: ${'ABC'[a]} → ${'ABC'[c]}`,'The recursive subproblem exposes one legal disk move; each resulting peg remains ordered.');move(n-1,b,a,c);}move(3,0,1,2);return t.finish(pegs);
  };
  registry.backtrack=()=>{
    const t=trace(['visit(row)','try each column','reject attacked squares','place queen; recurse; undo if needed']),board=Array(4).fill(-1);let solved=false;
    function visit(r){if(r===4){t.add('A complete solution','Every row and column has one queen, and no two queens share a diagonal.',{grid:{values:board.map(c=>range(4).map(j=>j===c?'♛':'·'))}},3);solved=true;return true;}
      for(let c=0;c<4;c++){const safe=range(r).every(i=>board[i]!==c&&Math.abs(board[i]-c)!==r-i);board[r]=c;t.add(`Try row ${r}, column ${c}`,safe?'No earlier queen attacks this square. Recurse to the next row.':'This square conflicts with an earlier queen. Reject it.',{grid:{values:board.map((q,i)=>range(4).map(j=>j===q?'♛':'·')),active:[r,c],reject:!safe}},safe?3:2);if(safe&&visit(r+1))return true;board[r]=-1;}t.add(`Backtrack from row ${r}`,'No column works with the earlier choices. Undo the previous placement and explore another branch.',{grid:{values:board.map(q=>range(4).map(j=>j===q?'♛':'·'))}},3);return false;}
    visit(0);return t.finish({solved,board});
  };
  registry.array=(o)=>{
    const a=o.values.slice(0,5),t=trace(['read by index','choose an insertion position','shift the suffix right','write the new value']);t.add('Contiguous positions','An array provides direct access by index; neighboring positions are stored together.',{rows:[row('Array',a,[2])]});
    const items=a.map((v,i)=>cell(v,'v'+i,'',String(i)));items.push(cell('·','empty'));
    t.add('Reserve a slot at index 1','Inserting inside an array requires moving the suffix.',{rows:[{label:'Array',items}]},1);
    for(let i=a.length-1;i>=1;i--){a[i+1]=a[i];t.add(`Shift index ${i} to ${i+1}`,'Move from right to left so the next value is not overwritten.',{rows:[row('Array',a,[i,i+1])]},2);}a[1]=99;t.add('Write 99 at index 1','The insertion moved a linear number of references; direct indexing remains constant time.',{rows:[row('Array',a,[],[1])]},3);return t.finish(a);
  };
  registry.linked=(o)=>{
    let a=o.values.slice(0,4),t=trace(['current ← head','follow next links','insert after a known node','relink around a removed node']);const mode=o.kind||'singly';
    a.forEach((v,i)=>t.add(`Visit node ${v}`,'Linked nodes are reached by following references; there is no constant-time random indexing.',{graph:listGraph(a,i,mode==='doubly',mode==='circular')},1));
    if(mode==='xor'){const addresses=[16,32,48,64];return story(['link = previous XOR next','next = previous XOR link','advance previous and current'],addresses.map((p,i)=>{let prev=addresses[i-1]||0,next=addresses[i+1]||0;return [`At address ${p}`,`Store ${prev} XOR ${next} = ${prev^next}. With previous=${prev}, recover next as ${prev} XOR ${prev^next} = ${next}. These are illustrative integer addresses, not Python object pointers.`,{graph:listGraph(addresses,i),equation:`next = previous XOR link = ${next}`}];}));}
    const original=a.slice(),at=Math.min(2,a.length);a.splice(at,0,99);t.add('Insert 99 after a known node','Set the new node’s next reference, then redirect its predecessor. Given the predecessor, the relinking is constant work.',{graph:listGraph(a,at,mode==='doubly',mode==='circular')},2);a.splice(at,1);t.add('Unlink the inserted node','The predecessor skips over 99; for a doubly linked list, update the successor’s prev link too.',{graph:listGraph(a,at-1,mode==='doubly',mode==='circular')},3);return t.finish(original);
  };
  registry.unrolled=()=>story(['locate a block','find the offset inside that block','insert into the block','split an overflowing block'],[
    ['Store several items per node','Block nodes reduce the number of pointer links and keep neighboring values together.',{rows:[row('Block A',[3,6,9]),row('Block B',[12,15,18])]}],
    ['Locate an element','To read logical index 4, skip the first block of three and read offset 1 in the second block.',{rows:[row('Block A',[3,6,9]),row('Block B',[12,15,18],[1])]}],
    ['Insert into a full block','Insert 14 in sorted order. This illustrated block has exceeded its capacity of three.',{rows:[row('Block A',[3,6,9]),row('Overflowing block',[12,14,15,18],[1])]}],
    ['Split and relink','Redistribute the values across two blocks and link the new block into the chain.',{rows:[row('Block A',[3,6,9]),row('Block B',[12,14]),row('New block C',[15,18],[],[0,1])]}]
  ]);
  registry.skip=()=>{
    const values=[2,5,8,12,17,23],t=trace(['start at the highest level','move right while next key < target','drop one level when blocked','read the matching base-level node']);
    [[2,0],[2,3],[1,3],[0,3],[0,4]].forEach(([level,i],s)=>t.add(s===4?'Found 17':`Level ${level}, key ${values[i]}`,'Upper levels skip over ranges of keys; descend when the next jump would overshoot. The illustrated tower heights are fixed for reproducibility.',{rows:[row('Level 2',['2','·','·','12','·','·'],level===2?[i]:[]),row('Level 1',['2','·','8','12','·','23'],level===1?[i]:[]),row('Level 0',values,level===0?[i]:[])],equation:'target = 17'},s<2?1:s<4?2:3));return t.finish(17);
  };
  registry.stack=(o)=>{
    const t=trace(['push(x): add at top','top(): read without removing','pop(): remove most recent value','if empty: report underflow']),a=[];
    t.add('An empty stack','The rightmost item will be the top.');[4,7,9].forEach(x=>{a.push(x);t.add(`Push ${x}`,'Last in, first out: only the top is exposed for removal.',{rows:[row('Bottom → top',a,[a.length-1])]},0);});
    while(a.length){const x=a.pop();t.add(`Pop → ${x}`,'The most recently pushed remaining value leaves first.',{rows:[row('Bottom → top',a),row('Returned',[x],[0])]},2);}t.add('Underflow is handled','pop() on an empty stack must report failure or raise an exception; it must not silently return a valid item.',{rows:[row('Stack',[]),row('State',['empty'],[0])]},3);return t.finish([9,7,4]);
  };
  registry.brackets=()=>{
    const text='([{}])',stack=[],t=trace(['for each bracket','push opening brackets','a closer must match the stack top','accept only if the final stack is empty']);
    [...text].forEach((ch,i)=>{let open='([{'.includes(ch);if(open)stack.push(ch);else stack.pop();t.add(`Read ${ch}`,open?'Keep this opener until its matching closer arrives.':'The closer matches the most recent unmatched opener; remove that opener.',{rows:[row('Expression',[...text],[i],range(i)),row('Unmatched openers',stack)]},open?1:2);});t.add('Balanced','Every closer matched the stack top and no opener remains.',{rows:[row('Result',['balanced'],[],[0])]},3);return t.finish(true);
  };
  registry.queue=(o)=>{
    const t=trace(['enqueue(x): add at rear','dequeue(): remove at front','check empty before removing']),a=[];t.add('An empty queue','The front is on the left and the rear is on the right.');
    ['Ada','Lin','Sam'].forEach(x=>{a.push(x);t.add(`Enqueue ${x}`,'First in, first out: new arrivals join behind everyone already waiting.',{rows:[row('Front → rear',a,[a.length-1])]},0);});const out=[];while(a.length){let x=a.shift();out.push(x);t.add(`Dequeue ${x}`,'The earliest remaining arrival leaves from the front.',{rows:[row('Waiting',a),row('Served',out,[],range(out.length))]},1);}t.add('Queue empty','A further dequeue must handle underflow explicitly.',{rows:[row('State',['empty'],[0])]},2);return t.finish(out);
  };
  registry.circularqueue=()=>{
    const t=trace(['write at rear','rear ← (rear + 1) mod capacity','read at front','front ← (front + 1) mod capacity']),a=Array(5).fill('·');let front=0,rear=0,count=0;
    const shot=(title,line)=>t.add(title,'Track count separately so front = rear can represent either empty or full without ambiguity.',{rows:[row('Physical slots',a,[front,rear])],equation:`front=${front}, rear=${rear}, count=${count}`},line);
    shot('Capacity five',0);for(let x of [10,20,30]){a[rear]=x;rear=(rear+1)%5;count++;shot(`Enqueue ${x}`,1);}for(let i=0;i<2;i++){let x=a[front];a[front]='·';front=(front+1)%5;count--;shot(`Dequeue ${x}`,3);}for(let x of [40,50,60]){a[rear]=x;rear=(rear+1)%5;count++;shot(`Enqueue ${x}: wrap when needed`,1);}return t.finish({a,front,rear,count});
  };
  registry.tree=(o)=>{
    const values=[8,4,12,2,6,10,14],t=trace(['start at the root','follow parent–child edges','identify a node’s depth','count leaves and height']);
    [0,1,3,4,2,5,6].forEach(i=>t.add(`Inspect node ${values[i]}`,`Depth is the number of edges from the root. Node ${values[i]} has depth ${Math.floor(Math.log2(i+1))}. A node with no children is a leaf.`,{graph:treeGraph(values,[i]),equation:'height = 2 edges; 4 leaves; 7 nodes'},1));return t.finish(values);
  };
  registry.treevariants=()=>story(['a general tree can have many children','a binary tree allows at most two','a full binary tree has zero or two children','a complete binary tree fills levels left to right'],[
    ['General / N-ary tree','The root may have more than two children.',{graph:{height:240,nodes:[N('r','R',400,40),...['A','B','C','D'].map((v,i)=>N(v,v,120+i*180,150))],edges:['A','B','C','D'].map(v=>E('r',v))}}],
    ['Binary tree','Every node has a left and right position; either position may be empty.',{graph:treeGraph([8,4,12,null,6])}],
    ['Full and perfect example','This tree is full and perfect: every internal node has two children and all leaves have equal depth.',{graph:treeGraph([8,4,12,2,6,10,14])}],
    ['Complete, but not perfect','The final level is filled from the left; the last internal node may have only a left child.',{graph:treeGraph([8,4,12,2,6,10])}]
  ]);
  registry.nary=()=>{
    const nodes=[N('R','R',410,40),N('A','A',120,140),N('B','B',310,140),N('C','C',510,140),N('D','D',700,140),N('E','E',80,240),N('F','F',180,240)],edges=[E('R','A'),E('R','B'),E('R','C'),E('R','D'),E('A','E'),E('A','F')],order=['R','A','E','F','B','C','D'],t=trace(['visit the current node','for each child in stored order','recursively traverse that child']);
    order.forEach((id,i)=>t.add(`Visit ${id}`,'This general tree stores an ordered list of children. The root has four children; traversal visits each child subtree in that stored order.',{graph:{height:310,nodes:nodes.map(n=>({...n,tone:n.id===id?'focus':order.slice(0,i).includes(n.id)?'done':''})),edges},rows:[row('Preorder output',order.slice(0,i+1))]},i?2:0));return t.finish(order);
  };
  registry.traversal=(o)=>{
    const values=[8,4,12,2,6,10,14],mode=o.kind||'inorder',order=[],t=trace(mode==='level'?['queue ← [root]','remove queue front','visit node; enqueue its children']:['walk(left), visit, walk(right) for inorder','visit before children for preorder','visit after children for postorder']);
    const visit=i=>{if(i>=values.length)return;if(mode==='preorder')order.push(i);visit(2*i+1);if(mode==='inorder')order.push(i);visit(2*i+2);if(mode==='postorder')order.push(i);};if(mode==='level')order.push(...range(values.length));else visit(0);
    const done=[];t.add('Start traversal',`Mode: ${mode}. Each node will be visited exactly once.`,{graph:treeGraph(values)});
    order.forEach(i=>{done.push(i);t.add(`Visit ${values[i]}`,`The emitted sequence is ${done.map(j=>values[j]).join(', ')}. Changing when the node is emitted changes the traversal order.`,{graph:treeGraph(values,[i],done),rows:[row('Output',done.map(j=>values[j]),[],range(done.length))]},1);});return t.finish(done.map(i=>values[i]));
  };
  registry.threaded=()=>{
    const vals=[8,4,12,2,6,10,14],order=[3,1,4,0,5,2,6],t=trace(['follow left children to the first inorder node','visit it','if right is a thread: follow successor','otherwise descend the right subtree’s left spine']);
    order.forEach((i,k)=>{const g=treeGraph(vals,[i],order.slice(0,k));for(let j=0;j<order.length-1;j++){let a=order[j],b=order[j+1];if(2*a+2>=vals.length)g.edges.push(E(a,b,'thread',j===k?'focus':'dim',true));}t.add(`Inorder successor after ${vals[i]}`,k===order.length-1?'The final node has no successor.':'A thread reuses an otherwise absent child reference; a tag distinguishes it from a real child link.',{graph:g,rows:[row('Output',order.slice(0,k+1).map(j=>vals[j]))]},2);});return t.finish(order.map(i=>vals[i]));
  };
  registry.bst=(o)=>{
    const input=o.values.slice(),nodes=[],t=trace(['start at root','if key < node: go left','if key > node: go right','insert at the first empty child']);
    function scene(active){const out=[];function walk(i,x,y,gap){if(i==null)return;const n=nodes[i];out.push(N(i,n.v,x,y,i===active?'focus':'',`key ${n.v}`));walk(n.l,x-gap,y+72,gap/2);walk(n.r,x+gap,y+72,gap/2);}if(nodes.length)walk(0,410,35,185);return {graph:{height:Math.max(270,...out.map(n=>n.y+60)),nodes:out,edges:nodes.flatMap((n,i)=>[n.l,n.r].filter(j=>j!=null).map(j=>E(i,j)))}};}
    input.forEach(v=>{if(!nodes.length){nodes.push({v,l:null,r:null});t.add(`Root ${v}`,'The first key becomes the root.',scene(0),0);return;}let i=0;while(true){let side=v<nodes[i].v?'l':'r';t.add(`Compare ${v} with ${nodes[i].v}`,`${v} ${side==='l'?'<':'≥'} ${nodes[i].v}: follow the ${side==='l'?'left':'right'} child. This example places equal keys on the right.`,scene(i),side==='l'?1:2);if(nodes[i][side]==null){let j=nodes.length;nodes[i][side]=j;nodes.push({v,l:null,r:null});t.add(`Insert ${v}`,'The new leaf preserves the search ordering of every ancestor.',scene(j),3);break;}i=nodes[i][side];}});
    const sorted=[];function inorder(i){if(i==null)return;inorder(nodes[i].l);sorted.push(nodes[i].v);inorder(nodes[i].r);}if(nodes.length)inorder(0);t.add('Inorder gives sorted order','BST performance depends on height: a skewed tree can take linear time per operation.',{...scene(-1),rows:[row('Sorted keys',sorted)]},0);return t.finish(sorted);
  };
  registry.stringbst=()=>registry.bst({values:['CAT','DOG','CAR','ANT','COW','BAT']});
  registry.avl=()=>story(['insert using BST order','compute balance = left height − right height','detect the first unbalanced ancestor','rotate and update heights'],[
    ['Insert 30','A one-node tree is balanced.',{graph:treeGraph([30])}],
    ['Insert 20','The root’s left subtree is one level taller than its right subtree.',{graph:treeGraph([30,20])}],
    ['Insert 10: left-left imbalance','At 30, the balance factor is +2. This insertion follows two left edges.',{graph:treeGraph([30,20,null,10],[0]),equation:'balance(30) = +2'}],
    ['Right rotation at 30','20 becomes the subtree root; 10 stays left and 30 becomes right. The inorder order is unchanged.',{graph:treeGraph([20,10,30],[0]),equation:'inorder remains 10, 20, 30'}],
    ['Recheck the invariant','Every node now has balance factor −1, 0, or +1. Other insertion shapes require left or double rotations.',{graph:treeGraph([20,10,30],[],[0,1,2])}]
  ]);
  registry.expression=()=>story(['read postfix tokens','push an operand tree','operator: pop right, then left','push the combined subtree'],[
    ['Read 2 and 3','Postfix expression: 2 3 4 * +. Each operand starts as a leaf.',{rows:[row('Tokens',['2','3','4','*','+'],[1]),row('Subtree stack',['2','3'])]}],
    ['Read 4','There are now three operand subtrees on the stack.',{rows:[row('Subtree stack',['2','3','4'],[2])]}],
    ['Read *','Pop right=4 and left=3, then create a multiplication root.',{graph:treeGraph(['*',3,4]),rows:[row('Subtree stack',['2','(3 × 4)'])]}],
    ['Read +','Pop the multiplication subtree and the leaf 2. Evaluate children before their operator.',{graph:treeGraph(['+',2,'*',null,null,3,4]),equation:'2 + (3 × 4) = 14'}]
  ]);
  registry.xortree=()=>story(['store XOR-combined child references','retain the context needed to decode a link','recover the wanted reference with XOR','compare the space and navigation tradeoff'],[
    ['Encode parent with each child','For illustrative parent address P=16, left child L=32, and right child R=48, store P XOR L and P XOR R in the node’s two link fields.',{rows:[row('Encoded fields',['left: 16 XOR 32 = 48','right: 16 XOR 48 = 32'])]}],
    ['Recover a child','Knowing the parent, decode the left child with P XOR left_field.',{equation:'16 XOR 48 = 32',rows:[row('Recovered',['left child address = 32'],[],[0])]}],
    ['Recover the parent','Knowing the left child, decode the parent with L XOR left_field.',{equation:'32 XOR 48 = 16',rows:[row('Recovered',['parent address = 16'],[],[0])]}],
    ['Keep decoding context','The node stores parent XOR left-child and parent XOR right-child, not left-child XOR right-child. NULL is represented by zero here. These integer addresses illustrate low-level storage rather than Python object pointers.',{rows:[row('Required knowledge',['encoded link','one known address','recover the other'])]}]
  ]);
  registry.heap=(o)=>{
    const a=[],t=trace(['append the new key','while parent > child: swap upward','remove root; replace with last','sift down using the smaller child']);
    o.values.forEach(v=>{a.push(v);let i=a.length-1;t.add(`Append ${v}`,'A min-heap is a complete binary tree. Only the parent–child ordering is required.',{graph:treeGraph(a,[i]),rows:[row('Heap array',a,[i])]},0);while(i>0){let p=Math.floor((i-1)/2);if(a[p]<=a[i])break;[a[p],a[i]]=[a[i],a[p]];t.add('Sift upward','Swap the child with its larger parent to restore the min-heap invariant.',{graph:treeGraph(a,[p,i]),rows:[row('Heap array',a,[p,i])]},1);i=p;}});
    const min=a[0],last=a.pop();if(a.length)a[0]=last;let i=0;while(2*i+1<a.length){let j=2*i+1;if(j+1<a.length&&a[j+1]<a[j])j++;if(a[i]<=a[j])break;[a[i],a[j]]=[a[j],a[i]];t.add('Sift downward','After removing the root, swap with the smaller child until heap order holds.',{graph:treeGraph(a,[i,j]),rows:[row('Heap array',a,[i,j])]},3);i=j;}
    t.add(`Extract minimum → ${min}`,'The root held the smallest key. The rest of a heap is generally not sorted.',{graph:treeGraph(a),rows:[row('Returned',[min],[],[0])]},2);return t.finish({minimum:min,heap:a});
  };
  registry.union=(o)=>{
    const t=trace(['make a singleton set for each element','find the representatives','if different, join the two sets','optionally compress the find path']),p=range(7),sizes=Array(7).fill(1);let id=range(7);const quick=o.kind==='quickfind',compress=o.kind==='compress';
    const scene=(active=[])=>({rows:[row(quick?'Component labels':'Parent pointers',quick?id:p,active),row('Elements',range(7),active)]});
    const find=x=>{while(p[x]!==x)x=p[x];return x;};t.add('Seven disjoint singletons','Different representatives identify different components.',scene());
    for(let [a,b] of [[0,1],[2,3],[1,3],[4,5],[3,5]]){let ra=find(a),rb=find(b);t.add(`Find(${a}) and Find(${b})`,quick?'Quick-find reads a component label directly.':'Follow parent links until a representative points to itself.',scene([a,b]),1);if(ra!==rb){if(quick){let old=id[b],next=id[a];id=id.map(x=>x===old?next:x);p[rb]=ra;}else if(o.kind==='quickunion'){p[ra]=rb;}else{if(sizes[ra]<sizes[rb])[ra,rb]=[rb,ra];p[rb]=ra;sizes[ra]+=sizes[rb];}t.add(`Union(${a}, ${b})`,quick?'Every element in the old component is relabeled; union can scan the whole array.':o.kind==='quickunion'?'Attach one root under the other; unweighted unions can create tall chains.':'Attach the smaller tree under the larger root to limit height.',scene([a,b]),2);}}
    if(compress){p[0]=1;p[1]=3;p[3]=5;p[5]=5;t.add('Before Find(0)','Use a deliberately long path 0 → 1 → 3 → 5 to illustrate compression.',scene([0,1,3,5]),1);for(let x of [0,1,3]){p[x]=5;t.add(`Point ${x} directly to root 5`,'Path compression preserves set membership while shortening future finds. It can be combined with union by rank or size.',scene([x,5]),3);}}
    return t.finish(quick?id:p);
  };
  const baseEdges=[['A','B',4],['A','C',2],['B','C',1],['B','D',5],['C','D',8],['C','E',10],['D','E',2],['D','F',6],['E','F',3]];
  const graphScene=(edges,active='',visited=[],chosen=[],directed=false)=>({nodes:['A','B','C','D','E','F'].map((v,i)=>N(v,v,[90,285,285,495,495,700][i],[150,55,245,55,245,150][i],v===active?'focus':visited.includes(v)?'done':'')),edges:edges.map(([a,b,w])=>E(a,b,w??'',chosen.includes(a+b)||chosen.includes(b+a)?'done':'',directed)),height:310});
  registry.graph=()=>story(['identify vertices','identify edges','assign direction or weight as needed','choose a representation'],[
    ['Vertices describe entities','Each vertex could stand for a city, task, or computer.',{graph:graphScene([], 'A')}],
    ['Edges describe relationships','In an undirected graph, adjacency works both ways.',{graph:graphScene(baseEdges)}],
    ['Weights measure cost','The labels can represent travel time, distance, or another specified cost.',{graph:graphScene(baseEdges,'C')}],
    ['A graph is not necessarily a tree','This graph has cycles and multiple routes between vertices. Traversal must track discovered vertices.',{graph:graphScene(baseEdges,'A',['A','B','C'],['AB','BC','AC'])}]
  ]);
  registry.representation=()=>{
    const adj=Array.from({length:6},()=>Array(6).fill(0));baseEdges.forEach(([a,b,w])=>{adj[a.charCodeAt()-65][b.charCodeAt()-65]=w;adj[b.charCodeAt()-65][a.charCodeAt()-65]=w;});
    return story(['scan an edge list','store each vertex’s neighbors','or allocate an adjacency matrix','compare memory and query costs'],[
      ['Edge list','Store endpoints and, when needed, the weight for each edge.',{graph:graphScene(baseEdges),rows:[row('First three edges',baseEdges.slice(0,3).map(e=>e.join('–')))]}],
      ['Adjacency list','Store each vertex’s neighbors. Undirected edges appear in both endpoint lists.',{rows:['A','B','C'].map(a=>row(a+' neighbors',baseEdges.filter(e=>e.includes(a)).map(([x,y,w])=>`${x===a?y:x}:${w}`)))}],
      ['Adjacency matrix','Entry [u,v] stores the edge weight here; 0 means no edge in this positive-weight example.',{grid:{values:adj,rowLabels:['A','B','C','D','E','F'],colLabels:['A','B','C','D','E','F']}}],
      ['Choose by workload','Lists use Θ(V+E) space and support neighbor iteration. A matrix uses Θ(V²) space and gives direct edge lookup.',{rows:[row('Space',['list: V + E','matrix: V²'])]}]
    ]);
  };
  registry.graphwalk=(o)=>{
    if(o.kind==='dfs'){
      const edges=baseEdges.map(([a,b])=>[a,b,'']),stack=[],seen=new Set(),out=[],chosen=[],t=trace(['enter and mark the current vertex','visit it; inspect its next neighbor','descend into one undiscovered neighbor','on return, resume the previous vertex']);
      function visit(u){seen.add(u);stack.push(u);out.push(u);t.add(`Visit ${u}`,'An explicit call stack retains the path. Explore one new neighbor completely before considering the next neighbor.',{graph:graphScene(edges,u,out,chosen),rows:[row('Active DFS path · top on right',stack,[stack.length-1]),row('Visit order',out)]},1);
        const neighbors=edges.flatMap(([a,b])=>a===u?[b]:b===u?[a]:[]).sort();for(const v of neighbors)if(!seen.has(v)){chosen.push(u+v);t.add(`Descend ${u} → ${v}`,'Take this one discovery edge and suspend the caller until the child subtree is finished.',{graph:graphScene(edges,v,out,chosen),rows:[row('Waiting path',stack),row('Visit order',out)]},2);visit(v);}stack.pop();if(stack.length)t.add(`Return from ${u}`,'This vertex has no remaining undiscovered neighbor. Resume the previous call frame.',{graph:graphScene(edges,stack.at(-1),out,chosen),rows:[row('Active DFS path',stack,[stack.length-1]),row('Visit order',out)]},3);}
      t.add('Start depth-first traversal','The call stack begins empty. Neighbors are considered in alphabetical order.',{graph:graphScene(edges),rows:[row('Active DFS path',stack)]});visit('A');return t.finish(out);
    }
    const dfs=o.kind==='dfs',edges=baseEdges.map(([a,b])=>[a,b,'']),todo=['A'],seen=new Set(['A']),out=[],chosen=[],t=trace(dfs?['stack ← [start]; discovered ← {start}','pop stack','visit; push undiscovered neighbors']:['queue ← [start]; discovered ← {start}','remove queue front','visit; enqueue undiscovered neighbors']);
    t.add('Discover A',`A is marked when added to the ${dfs?'stack':'queue'} so it will not be added repeatedly.`,{graph:graphScene(edges,'A'),rows:[row(dfs?'Stack · top on right':'Queue · front on left',todo)]});
    while(todo.length){let u=dfs?todo.pop():todo.shift();out.push(u);t.add(`Visit ${u}`,dfs?'The stack favors a recently discovered branch.':'The queue processes discovered vertices in breadth-first layers.',{graph:graphScene(edges,u,out,chosen),rows:[row('Frontier',todo),row('Visit order',out)]},1);let ns=edges.flatMap(([a,b])=>a===u?[b]:b===u?[a]:[]).sort();if(dfs)ns.reverse();for(let v of ns)if(!seen.has(v)){seen.add(v);todo.push(v);chosen.push(u+v);t.add(`Discover ${v} from ${u}`,'Save the first-discovery edge and mark the new vertex immediately.',{graph:graphScene(edges,v,out,chosen),rows:[row('Frontier',todo,[todo.length-1]),row('Visit order',out)]},2);}}
    return t.finish(out);
  };
  registry.topological=()=>{
    const edges=[['A','C'],['B','C'],['B','D'],['C','E'],['D','F'],['E','F']],deg=Object.fromEntries('ABCDEF'.split('').map(x=>[x,0])),out=[],t=trace(['compute indegrees','enqueue every zero-indegree vertex','remove one; output it','decrease its neighbors’ indegrees']);edges.forEach(([,v])=>deg[v]++);let q=Object.keys(deg).filter(v=>!deg[v]);t.add('Initial indegrees','Only tasks with no unfinished prerequisite are eligible.',{graph:graphScene(edges,'',[],[],true),rows:[row('Indegrees',Object.entries(deg).map(([v,d])=>v+':'+d)),row('Ready',q)]});
    while(q.length){let u=q.shift();out.push(u);t.add(`Output ${u}`,'All incoming prerequisites of this vertex have already been output.',{graph:graphScene(edges,u,out,[],true),rows:[row('Topological order',out)]},2);for(let [a,b] of edges)if(a===u){deg[b]--;if(!deg[b])q.push(b);}t.add('Release newly ready tasks','A neighbor becomes ready exactly when its remaining indegree reaches zero.',{graph:graphScene(edges,u,out,[],true),rows:[row('Remaining indegrees',Object.entries(deg).map(([v,d])=>v+':'+d)),row('Ready',q)]},3);}return t.finish(out);
  };
  registry.shortest=(o)=>{
    const t=trace(['distance[start] ← 0; others ← ∞','settle the unsettled vertex of least distance','relax each outgoing edge','repeat while a reachable unsettled vertex remains']),dist={A:0,B:Infinity,C:Infinity,D:Infinity,E:Infinity,F:Infinity},settled=[],parent={},chosen=[];
    const scene=u=>({graph:graphScene(baseEdges,u,settled,chosen),rows:[row('Distances',Object.entries(dist).map(([v,d])=>`${v}: ${Number.isFinite(d)?d:'∞'}`))]});
    t.add('Start at A','Dijkstra’s algorithm requires nonnegative edge weights.',scene('A'));
    while(settled.length<6){let u=Object.keys(dist).filter(v=>!settled.includes(v)).sort((a,b)=>dist[a]-dist[b])[0];if(!u||!Number.isFinite(dist[u]))break;settled.push(u);t.add(`Settle ${u} at distance ${dist[u]}`,'With nonnegative weights, the least tentative distance is final.',scene(u),1);for(let [a,b,w] of baseEdges){let v=a===u?b:b===u?a:null;if(!v||settled.includes(v))continue;const cand=dist[u]+w;if(cand<dist[v]){dist[v]=cand;parent[v]=u;chosen.splice(0,chosen.length,...Object.entries(parent).map(([v,p])=>p+v));t.add(`Relax ${u} → ${v}`,`A path through ${u} has cost ${dist[u]} + ${w} = ${cand}; update ${v}.`,scene(v),2);}}}
    return t.finish(dist);
  };
  registry.bellman=()=>{
    const edges=[['A','B',4],['A','C',5],['B','C',-2],['C','D',3],['D','E',1],['E','F',2]],d={A:0,B:Infinity,C:Infinity,D:Infinity,E:Infinity,F:Infinity},t=trace(['distance[start] ← 0','repeat V−1 passes','relax every directed edge','one more improving pass implies a reachable negative cycle']);
    for(let pass=1;pass<=5;pass++){let changed=false;for(let [u,v,w] of edges){if(Number.isFinite(d[u])&&d[u]+w<d[v]){d[v]=d[u]+w;changed=true;t.add(`Pass ${pass}: relax ${u} → ${v}`,'Bellman–Ford permits negative edges. Each pass propagates improvements; a reachable negative cycle prevents finite shortest paths.',{graph:graphScene(edges,v,[],[u+v],true),rows:[row('Distances',Object.entries(d).map(([v,x])=>v+': '+(Number.isFinite(x)?x:'∞')))]},2);}}if(!changed){t.add('No change in this pass','All relaxation inequalities are satisfied; stop early.',{rows:[row('Final distances',Object.entries(d).map(([v,x])=>v+': '+x))]},3);break;}}return t.finish(d);
  };
  registry.floyd=()=>{
    const d=[[0,3,Infinity,7],[8,0,2,Infinity],[5,Infinity,0,1],[2,Infinity,Infinity,0]],names=['A','B','C','D'],t=trace(['initialize direct edge costs and zero diagonal','for each allowed intermediate vertex k','d[i,j] ← min(d[i,j], d[i,k] + d[k,j])','after the last k, every intermediate is allowed']);
    const scene=(active)=>({grid:{values:d.map(r=>r.map(x=>Number.isFinite(x)?x:'∞')),rowLabels:names,colLabels:names,active}});
    t.add('Direct edge distances','Floyd–Warshall solves all-pairs shortest paths. This example has no negative cycles.',scene());
    for(let k=0;k<4;k++){t.add(`Allow intermediate ${names[k]}`,'The invariant allows only the first k intermediate vertices on the paths considered so far.',scene(),1);for(let i=0;i<4;i++)for(let j=0;j<4;j++)if(d[i][k]+d[k][j]<d[i][j]){let old=d[i][j];d[i][j]=d[i][k]+d[k][j];t.add(`Improve ${names[i]} → ${names[j]}`,`Going through ${names[k]} improves the distance from ${Number.isFinite(old)?old:'∞'} to ${d[i][j]}.`,scene([i,j]),2);}}
    t.add('All pairs solved','Each matrix entry is now the minimum route cost between its row and column vertices.',scene(),3);return t.finish(d);
  };
  registry.mst=(o)=>{
    const prim=o.kind==='prim',t=trace(prim?['start from A','choose the cheapest edge crossing the cut','add its outside vertex','repeat until every vertex is reached']:['sort edges by weight','accept an edge only if its endpoints are in different components','union the components','stop after V−1 accepted edges']),chosen=[],visited=new Set(prim?['A']:[]),p=Object.fromEntries('ABCDEF'.split('').map(x=>[x,x]));let total=0;const find=x=>p[x]===x?x:find(p[x]);
    let edges=baseEdges.slice().sort((a,b)=>a[2]-b[2]);t.add('Initial forest','A minimum spanning tree connects all vertices at minimum total edge weight; it is not a shortest-path tree.',{graph:graphScene(baseEdges)});
    while(chosen.length<5){let e=prim?edges.find(([a,b])=>visited.has(a)!==visited.has(b)):edges.shift();if(!e)break;const [a,b,w]=e;let accept=prim||find(a)!==find(b);if(accept){chosen.push(a+b);total+=w;if(prim){visited.add(a);visited.add(b);}else p[find(a)]=find(b);}t.add(`${accept?'Accept':'Reject'} ${a}–${b}, weight ${w}`,accept?'The edge connects different components without creating a cycle.':'Its endpoints are already connected; accepting it would create a cycle.',{graph:graphScene(baseEdges,b,[...visited],chosen),rows:[row('Accepted edges',chosen.map(s=>s[0]+'–'+s[1]))]},accept?1:2,{weight:total,edges:chosen.length});}
    return t.finish({edges:chosen,weight:total});
  };
  function sorting(o) {
    let a=o.values.map((v,i)=>({v,id:'item'+i})),kind=o.kind||'insertion',ops=0,t=trace([]);
    const shot=(title,note,active=[],done=[],line=0,extra={})=>t.add(title,note,{bars:a.map((x,i)=>({id:x.id,label:x.v,value:x.v,tone:active.includes(i)?'focus':done.includes(i)?'done':''})),rows:[{label:'Array',items:a.map((x,i)=>cell(x.v,x.id,active.includes(i)?'focus':done.includes(i)?'done':'',String(i)))}],...extra},line,{operations:ops});
    const swap=(i,j)=>{[a[i],a[j]]=[a[j],a[i]];};shot('Initial order','The stable labels beneath the bars identify array positions. Follow comparisons and moves.');
    if(kind==='bubble'){
      t.code=['for end from n−1 down to 1','compare adjacent entries','swap if out of order','the largest remaining entry reaches end'];
      for(let end=a.length-1;end>0;end--){let changed=false;for(let j=0;j<end;j++){ops++;shot(`Compare ${a[j].v} and ${a[j+1].v}`,'Out-of-order neighbors must exchange positions.',[j,j+1],range(a.length).filter(i=>i>end),1);if(a[j].v>a[j+1].v){swap(j,j+1);changed=true;shot('Swap adjacent entries','The larger entry moves one position right.',[j,j+1],[],2);}}if(!changed)break;}
    }else if(kind==='selection'){
      t.code=['for each output position i','find the minimum in suffix i..n−1','swap that minimum into position i'];
      for(let i=0;i<a.length-1;i++){let m=i;for(let j=i+1;j<a.length;j++){ops++;if(a[j].v<a[m].v)m=j;shot(`Minimum candidate: ${a[m].v}`,'Scan the unsorted suffix before choosing the next output item.',[m,j],range(i),1);}swap(i,m);shot(`Fix position ${i}`,'The next-smallest remaining value is now in its final position.',[i],range(i+1),2);}
    }else if(kind==='quick'||kind==='quickselect'){
      t.code=['choose the final element as pivot','partition values ≤ pivot to the left','place pivot at its final sorted rank','recurse only on the required interval'];
      function quick(lo,hi){if(lo>=hi)return;let pivot=a[hi].v,i=lo;for(let j=lo;j<hi;j++){ops++;shot(`Partition around ${pivot}`,`${a[j].v} ${a[j].v<=pivot?'≤': '>'} ${pivot}; maintain a left region no larger than the pivot.`,[j,hi],[],1);if(a[j].v<=pivot){swap(i,j);i++;}}swap(i,hi);shot(`Pivot rank ${i}`,'The pivot is in its final sorted position.',[i],[],2);if(kind==='quickselect'){let k=Math.floor(a.length/2);if(k<i)quick(lo,i-1);if(k>i)quick(i+1,hi);}else{quick(lo,i-1);quick(i+1,hi);}}quick(0,a.length-1);
      if(kind==='quickselect'){const k=Math.floor(a.length/2);shot(`Selected index ${k}`,'Quickselect needs only the partition containing the desired rank; the rest need not be sorted.',[k]);return t.finish({value:a[k].v,k,array:a.map(x=>x.v)});}
    }else if(kind==='merge'||kind==='external'){
      t.code=['split into smaller runs','sort each run','merge the smallest available heads','copy the merged result back'];
      function merge(lo,hi){if(hi-lo<=1)return;let mid=Math.floor((lo+hi)/2);shot(`Split [${lo}, ${hi})`,'Independent smaller problems will be combined by a linear merge.',range(hi-lo).map(i=>lo+i),[],0);merge(lo,mid);merge(mid,hi);let left=a.slice(lo,mid),right=a.slice(mid,hi),out=[];while(left.length||right.length){ops++;out.push(!right.length||(left.length&&left[0].v<=right[0].v)?left.shift():right.shift());shot('Merge the run heads','Choose the smaller current head; taking the left head on equality preserves stability.',[],[],2,{rows:[row('Left run',left.map(x=>x.v)),row('Right run',right.map(x=>x.v)),row('Merged output',out.map(x=>x.v))]});}a.splice(lo,hi-lo,...out);shot('Write back the merged run','This interval is now sorted.',[],range(hi-lo).map(i=>lo+i),3);}merge(0,a.length);
    }else if(kind==='shell'){
      t.code=['choose decreasing gaps','insertion-sort each gap subsequence','finish with gap = 1'];
      for(let gap=Math.floor(a.length/2);gap>=1;gap=Math.floor(gap/2)){for(let i=gap;i<a.length;i++){let j=i;while(j>=gap){ops++;shot(`Gap ${gap}: compare positions ${j-gap} and ${j}`,'Gap passes move far-out-of-place values quickly; the final gap-one pass completes insertion sort.',[j-gap,j],[],1);if(a[j-gap].v<=a[j].v)break;swap(j-gap,j);j-=gap;}}}
    }else if(kind==='counting'||kind==='bucket'||kind==='radix'){
      if(kind==='counting'){
        t.code=['allocate counts for the key range','count each key','emit keys in increasing order'];let min=Math.min(...a.map(x=>x.v)),max=Math.max(...a.map(x=>x.v)),counts=Array(max-min+1).fill(0);for(let i=0;i<a.length;i++){counts[a[i].v-min]++;ops++;shot(`Count ${a[i].v}`,'Counting sort assumes a manageable integer key range.',[i],[],1,{rows:[row('Key counts',counts.map((c,i)=>`${i+min}: ${c}`))]});}let out=[];counts.forEach((c,i)=>{for(let j=0;j<c;j++)out.push({v:i+min,id:'count'+out.length});});a=out;
      }else if(kind==='bucket'){
        t.code=['scatter keys into ordered buckets','sort each bucket','concatenate buckets in order'];let min=Math.min(...a.map(x=>x.v)),max=Math.max(...a.map(x=>x.v)),width=Math.max(1,Math.ceil((max-min+1)/3)),b=[[],[],[]];a.forEach((x,i)=>{let j=Math.min(2,Math.floor((x.v-min)/width));b[j].push(x);ops++;shot(`Place ${x.v} in bucket ${j}`,'Bucket ranges are ordered and do not overlap. Each bucket still needs its own sorting step.',[],[],0,{rows:b.map((v,j)=>row('Bucket '+j,v.map(x=>x.v)))});});b.forEach(x=>x.sort((a,b)=>a.v-b.v));a=b.flat();
      }else{
        t.code=['process digits from least significant to most','stably distribute by the current digit','concatenate buckets in digit order'];let min=Math.min(0,...a.map(x=>x.v)),shift=-min,maximum=Math.max(...a.map(x=>x.v+shift));
        for(let exp=1;exp<=Math.max(1,maximum);exp*=10){let buckets=Array.from({length:10},()=>[]);for(let x of a){buckets[Math.floor((x.v+shift)/exp)%10].push(x);ops++;}shot(`Distribute by digit place ${exp}`,`Use stable digit buckets. ${shift?`The same offset ${shift} is used for every key so negative inputs keep their numeric ordering.`:'Keys here are nonnegative integers.'}`,[],[],1,{rows:buckets.map((b,i)=>row('Digit '+i,b.map(x=>x.v)))});a=buckets.flat();shot('Collect stable buckets','Earlier digit ordering survives among keys with the same current digit.',[],[],2);}
      }
    }else if(kind==='heap'){
      t.code=['build a max-heap','swap the maximum with the final live position','shrink the heap','sift the new root downward'];
      function down(i,n){while(2*i+1<n){let j=2*i+1;if(j+1<n&&a[j+1].v>a[j].v)j++;ops++;if(a[i].v>=a[j].v)break;swap(i,j);shot('Restore max-heap order','The parent must be at least as large as either child.',[i,j],range(a.length).filter(k=>k>=n),3,{graph:treeGraph(a.slice(0,n).map(x=>x.v),[i,j])});i=j;}}
      for(let i=Math.floor(a.length/2)-1;i>=0;i--)down(i,a.length);for(let end=a.length-1;end>0;end--){swap(0,end);shot(`Place maximum at ${end}`,'The sorted suffix grows from right to left.',[end],range(a.length).filter(i=>i>=end),1);down(0,end);}
    }else if(kind==='tree'){
      const r=registry.bst(o),final=r.frames.pop(),emitted=[],seen=[];r.code=['insert every key into a BST','traverse the BST inorder','emit the sorted sequence'];r.frames.forEach(f=>f.line=0);
      for(const value of r.result){const graph=copy(final.scene.graph),n=graph.nodes.find(n=>Number(n.value)===value&&!seen.includes(n.id));seen.push(n.id);emitted.push(value);graph.nodes.forEach(x=>x.tone=x.id===n.id?'focus':seen.includes(x.id)?'done':'');r.frames.push({title:`Emit ${value} in inorder`,note:'Visit the left subtree, then the node, then the right subtree. This emits BST keys in sorted order.',scene:{graph,rows:[row('Sorted output',emitted)]},line:1,metrics:{emitted:emitted.length}});}r.frames.push({...final,line:2});return r;
    }else{
      t.code=['for each key starting at index 1','shift larger prefix entries right','place the key in its insertion gap'];
      for(let i=1;i<a.length;i++){let key=a[i],j=i-1;shot(`Take key ${key.v}`,'The prefix to the left of the key is already sorted.',[i],range(i),0);while(j>=0&&a[j].v>key.v){ops++;a[j+1]=a[j];shot(`Shift ${a[j].v} right`,'Make room without changing the relative order of equal keys.',[j,j+1],[],1);j--;}a[j+1]=key;shot(`Insert key at ${j+1}`,'The sorted prefix has grown by one item.',[j+1],range(i+1),2);}
    }
    shot('Sorted','The entire array is in nondecreasing order.',[],range(a.length),t.code.length-1);return t.finish(a.map(x=>x.v));
  }
  registry.sort=sorting;
  registry.search=(o)=>{
    const kind=o.kind||'binary',a=o.values.slice();if(kind!=='linear')a.sort((a,b)=>a-b);const target=Number.isFinite(o.target)?o.target:a[Math.floor(a.length*.65)],t=trace(kind==='linear'?['visit the next item','compare it with the target','return its index on a match','return not found after the last item']:['maintain a sorted candidate interval [lo, hi]','choose a probe inside the interval','discard the side that cannot contain the target','stop when found or the interval is empty']);let lo=0,hi=a.length-1,found=-1,count=0;
    t.add(`Find ${target}`,kind==='linear'?'Linear search does not require sorted input.':'The input is sorted first for this demonstration; the search cost excludes that preprocessing.',{rows:[row('Input',a)]});
    while(lo<=hi){let p=kind==='linear'||kind==='ordered'?lo:kind==='interpolation'&&a[hi]!==a[lo]?lo+Math.floor((target-a[lo])*(hi-lo)/(a[hi]-a[lo])):Math.floor((lo+hi)/2);if(p<lo||p>hi)break;count++;t.add(`Probe index ${p}: ${a[p]}`,a[p]===target?'The probe matches the target.':a[p]<target?'The probe is smaller than the target.':'The probe is larger than the target.',{rows:[{label:'Candidates',items:a.map((v,i)=>cell(v,i,i===p?'focus':i<lo||i>hi?'dim':'',String(i)))}],equation:`target ${target}; interval [${lo}, ${hi}]`},1,{comparisons:count});if(a[p]===target){found=p;break;}if(kind==='linear')lo++;else if(kind==='ordered'){if(a[p]>target)break;lo++;}else if(a[p]<target)lo=p+1;else hi=p-1;}
    t.add(found<0?'Not found':`Found at index ${found}`,found<0?'Every possible candidate has been eliminated.':'Return an index in the displayed input array; duplicate values may have other matching indices.',{rows:[row('Displayed input',a,[],found<0?[]:[found])]},3,{comparisons:count});return t.finish({index:found,value:found<0?null:a[found],array:a,target});
  };
  registry.median=()=>{
    const t=trace(['group keys in sets of at most five','sort each small group and select its median','recursively choose the median of the medians','partition and recurse on the required rank']),source=[9,1,5,7,3,15,11,13,19,17,2,4,6,8,10],rank=7;
    function select(a,k){if(a.length<=5){let sorted=a.slice().sort((x,y)=>x-y);t.add(`Small base case: rank ${k}`,`Sort this group of at most five keys and return ${sorted[k]}.`,{rows:[row('Sorted small group',sorted,[k])]},1);return sorted[k];}let groups=[];for(let i=0;i<a.length;i+=5)groups.push(a.slice(i,i+5).sort((x,y)=>x-y));let medians=groups.map(g=>g[Math.floor(g.length/2)]);t.add(`Group ${a.length} candidate keys`,`Select local rank ${k}. Each small group supplies its median.`,{rows:groups.map((g,i)=>row('Group '+(i+1),g,[Math.floor(g.length/2)]))},1);let pivot=select(medians,Math.floor(medians.length/2)),less=a.filter(x=>x<pivot),equal=a.filter(x=>x===pivot),greater=a.filter(x=>x>pivot);t.add(`Partition around ${pivot}`,'The pivot is selected recursively from group medians. Keep only the partition containing the required rank.',{rows:[row('< pivot',less),row('= pivot',equal),row('> pivot',greater)],equation:`desired local rank = ${k}`},3);if(k<less.length)return select(less,k);if(k<less.length+equal.length)return pivot;return select(greater,k-less.length-equal.length);}
    t.add('Select the median by rank','Find zero-based rank 7 among 15 keys without fully sorting the input.',{rows:[row('Input',source)]});let value=select(source,rank);t.add(`Selected median: ${value}`,'Each recursion retained the partition containing the requested rank. The original keys remain unchanged.',{rows:[row('Answer',[value],[],[0])]},3);return t.finish({value,k:rank,source});
  };
  registry.kSmallest=(o)=>{
    const t=trace(['build a min-heap','extract the minimum k times','after each extraction, sift the root down','emit the extracted keys in sorted order']),a=[],out=[],k=Math.min(3,o.values.length);
    for(let v of o.values){a.push(v);let i=a.length-1;while(i){let p=Math.floor((i-1)/2);if(a[p]<=a[i])break;[a[p],a[i]]=[a[i],a[p]];i=p;}}
    t.add('Build the min-heap',`Find the ${k} smallest values in sorted order. A min-heap exposes the smallest remaining key.`,{graph:treeGraph(a),rows:[row('Output',out)]});
    while(out.length<k){let minimum=a[0],last=a.pop();out.push(minimum);if(a.length)a[0]=last;let i=0;while(2*i+1<a.length){let j=2*i+1;if(j+1<a.length&&a[j+1]<a[j])j++;if(a[i]<=a[j])break;[a[i],a[j]]=[a[j],a[i]];i=j;}t.add(`Extract ${minimum}`,'Restore the heap after removal. Extracted minima arrive in nondecreasing order.',{graph:treeGraph(a),rows:[row('Smallest keys',out,[],range(out.length))]},1);}
    return t.finish(out);
  };
  registry.symbol=()=>story(['put(key, value)','get(key)','update an existing binding','delete a key'],[
    ['Start with key–value pairs','A symbol table associates each distinct key with a value.',{rows:[row('Bindings',['Ada → 90','Lin → 82'])]}],
    ['Look up Lin','get("Lin") returns 82 without removing the binding.',{rows:[row('Bindings',['Ada → 90','Lin → 82'],[1]),row('Returned',[82],[0])]}],
    ['Update Ada','put("Ada", 95) replaces Ada’s previous value; it does not add a second Ada key.',{rows:[row('Bindings',['Ada → 95','Lin → 82'],[0])]}],
    ['Delete Lin','Only Ada’s binding remains. Array lists, search trees and hash tables offer different implementation tradeoffs.',{rows:[row('Bindings',['Ada → 95'],[],[0])]}]
  ]);
  registry.hash=(o)=>{
    const mode=o.kind||'chaining',size=7,buckets=Array.from({length:size},()=>[]),slots=Array(size).fill('·'),t=trace(['h(key) ← key mod 7','inspect the selected bucket','resolve a collision','compare the stored key before returning']);
    const keys=[10,17,24,8];for(let key of keys){let h=key%size;t.add(`Hash ${key}: ${key} mod 7 = ${h}`,'A hash function selects a location. Different keys can produce the same location.',{rows:[row('Table',mode==='probing'?slots:buckets.map(b=>b.join(' → ')||'·'),[h])]},0);if(mode==='probing'){let j=h;while(slots[j]!=='·'){t.add(`Collision at slot ${j}`,'Linear probing checks successive slots, wrapping around the array. A real implementation must also handle full tables and tombstones.',{rows:[row('Slots',slots,[j])]},2);j=(j+1)%size;}slots[j]=key;t.add(`Store ${key} in slot ${j}`,'The lookup must follow the same probing sequence.',{rows:[row('Slots',slots,[j])]},2);}else{buckets[h].push(key);t.add(`Append ${key} to bucket ${h}`,'Separate chaining stores colliding keys in a bucket container and compares actual keys during lookup.',{rows:[row('Buckets',buckets.map(b=>b.join(' → ')||'·'),[h])]},2);}}
    t.add('Track the load factor','There are 4 keys and 7 slots: α = 4/7. Expected constant-time operations need suitable hashing and a controlled load factor; worst cases can be linear.',{rows:[row('Table',mode==='probing'?slots:buckets.map(b=>b.join(' → ')||'·'))],equation:'α = number of keys / number of slots = 4/7'},3);return t.finish(mode==='probing'?slots:buckets);
  };
  registry.stringhash=()=>{
    const buckets=Array.from({length:7},()=>[]),keys=['CAT','CAR','DOG','TAC'],t=trace(['sum the character codes of the key','reduce the sum modulo table size','append to the selected collision chain','lookup compares full strings within the chain']);
    for(const word of keys){let sum=[...word].reduce((s,c)=>s+c.charCodeAt(0),0),h=sum%7;t.add(`Hash ${word} → bucket ${h}`,`Character-code sum ${sum}, modulo 7, gives ${h}. This deliberately simple teaching hash gives anagrams the same hash.`,{rows:[row('Characters',[...word]),row('Character codes',[...word].map(c=>c.charCodeAt(0)))],equation:`h("${word}") = ${sum} mod 7 = ${h}`},1);buckets[h].push(word);t.add(`Store ${word}`,'The bucket stores actual strings. CAT and TAC collide but remain distinguishable by full-key comparisons.',{rows:[row('String-key buckets',buckets.map(b=>b.join(' → ')||'·'),[h])]},2);}return t.finish(buckets);
  };
  registry.bloom=()=>{
    const bits=Array(10).fill(0),t=trace(['compute k hash positions','set those bits for insertion','query the same positions','a zero proves absence; all ones mean maybe']);const hashes=x=>[x%10,(3*x+1)%10];
    [4,7].forEach(x=>{let h=hashes(x);h.forEach(i=>bits[i]=1);t.add(`Insert ${x}`,`Set bits ${h.join(' and ')}. Existing set bits stay set.`,{rows:[row('Bit vector',bits,h)]},1);});
    for(let x of [4,14,3]){let h=hashes(x),maybe=h.every(i=>bits[i]);t.add(`Query ${x}: ${maybe?'maybe present':'definitely absent'}`,x===14?'14 was never inserted, but it shares both positions with 4: this is a false positive.':maybe?'All required bits are set. Confirm with the underlying data store if an exact answer is needed.':'At least one required bit is zero, so this value was not inserted.',{rows:[row('Bit vector',bits,h)],equation:`hash positions = ${h.join(', ')}`},3);}return t.finish(bits);
  };
  registry.string=(o)=>{
    const mode=o.kind||'naive',text=o.text||'ABABABCABABABC',pattern=o.pattern||'ABABC',t=trace(mode==='kmp'?['build the prefix-function table','compare text[i] with pattern[j]','on mismatch: j ← prefix[j−1]','do not rewind i']:mode==='boyer'?['align the pattern','compare from right to left','on mismatch: shift using the bad-character rule','continue with the new alignment']:mode==='rabin'?['hash the pattern and first window','compare window and pattern hashes','verify matching hashes character by character','roll to the next window']:['align the pattern','compare consecutive characters','on mismatch shift one position','stop after a complete match']);
    const shot=(i,j,note,line=1,extra={})=>t.add(`Text ${i}, pattern ${j}`,note,{rows:[row('Text',[...text],[i]),{label:'Aligned pattern',items:Array(Math.max(0,i-j)).fill(0).map((_,k)=>cell('·','pad'+k,'dim')).concat([...pattern].map((v,k)=>cell(v,'p'+k,k===j?'focus':''))) }],...extra},line);
    t.add('Search a pattern','Indices refer to characters in the displayed text. Pattern matching must handle overlaps.',{rows:[row('Text',[...text]),row('Pattern',[...pattern])]});let found=-1;
    if(mode==='kmp'||mode==='automaton'){
      const pi=Array(pattern.length).fill(0);for(let i=1,j=0;i<pattern.length;i++){while(j&&pattern[i]!==pattern[j])j=pi[j-1];if(pattern[i]===pattern[j])j++;pi[i]=j;}t.add('Prefix table',mode==='automaton'?'The current state is the length of the matched prefix. A transition reads one character and retains the longest useful prefix.':'Each prefix-table value is the longest proper prefix that is also a suffix of the prefix ending here.',{rows:[row('Pattern',[...pattern]),row('Prefix lengths',pi)]},0);
      for(let i=0,j=0;i<text.length;i++){while(j&&text[i]!==pattern[j]){shot(i,j,`Mismatch: fall back from prefix length ${j} to ${pi[j-1]} without moving the text pointer backward.`,2);j=pi[j-1];}shot(i,j,'Read the next text character. The state records how much of the pattern is currently matched.',1);if(text[i]===pattern[j])j++;if(j===pattern.length){found=i-j+1;break;}}
    }else if(mode==='boyer'){
      const last={};[...pattern].forEach((c,i)=>last[c]=i);let s=0;while(s<=text.length-pattern.length){let j=pattern.length-1;while(j>=0&&pattern[j]===text[s+j]){shot(s+j,j,'Compare this alignment from right to left.');j--;}if(j<0){found=s;break;}let shift=Math.max(1,j-(last[text[s+j]]??-1));shot(s+j,j,`Bad-character mismatch: shift by ${shift}. This demo uses the bad-character rule, not the full good-suffix optimization.`,2);s+=shift;}
    }else if(mode==='rabin'){
      const mod=101,base=31,m=pattern.length;let pow=1;for(let i=1;i<m;i++)pow=pow*base%mod;let ph=0,wh=0;for(let i=0;i<m;i++){ph=(ph*base+pattern.charCodeAt(i))%mod;wh=(wh*base+text.charCodeAt(i))%mod;}for(let s=0;s<=text.length-m;s++){t.add(`Window ${s}: hash ${wh}`,`Pattern hash = ${ph}. ${wh===ph?'Hashes match; verify actual characters.':'Different hashes prove these strings differ.'}`,{rows:[row('Text',[...text],range(m).map(i=>s+i)),row('Window',[...text.slice(s,s+m)]),row('Pattern',[...pattern])],equation:`hash mod ${mod}: window ${wh}, pattern ${ph}`},1);if(wh===ph&&text.slice(s,s+m)===pattern){found=s;break;}if(s<text.length-m)wh=((wh-text.charCodeAt(s)*pow)%mod*base+text.charCodeAt(s+m)+mod*base*mod)%mod;}
    }else{
      for(let s=0;s<=text.length-pattern.length;s++){let j=0;while(j<pattern.length){shot(s+j,j,text[s+j]===pattern[j]?'Characters match; continue at this alignment.':'Mismatch: shift the alignment one position.');if(text[s+j]!==pattern[j])break;j++;}if(j===pattern.length){found=s;break;}}
    }
    t.add(found<0?'Pattern absent':`Match begins at index ${found}`,found<0?'No alignment produced a complete match.':'All pattern characters match the corresponding substring.',{rows:[row('Text',[...text],[],found<0?[]:range(pattern.length).map(i=>found+i)),row('Pattern',[...pattern])]},t.code.length-1);return t.finish({index:found,text,pattern});
  };
  registry.trie=(o)=>{
    const words=o.kind==='suffix'?['BANANA','ANANA','NANA','ANA','NA','A']:['CAT','CAR','DOG'],nodes=[{id:0,c:'root',parent:null,depth:0,terminal:false}],t=trace(['start at root','follow an edge for each character','create missing edges','mark the word’s final node']);
    const g=active=>{const layers={};nodes.forEach(n=>(layers[n.depth]??=[]).push(n));return {height:Math.max(260,80+80*Math.max(...nodes.map(n=>n.depth))),nodes:nodes.map(n=>{let layer=layers[n.depth],k=layer.indexOf(n);return N(n.id,n.c,50+(k+.5)*720/layer.length,35+n.depth*65,n.id===active?'focus':n.terminal?'done':'',n.terminal?'word end':'');}),edges:nodes.filter(n=>n.parent!==null).map(n=>E(n.parent,n.id,'','',true))};};
    words.forEach(word=>{let p=0;for(let c of word){let node=nodes.find(n=>n.parent===p&&n.c===c);if(!node){node={id:nodes.length,c,parent:p,depth:nodes[p].depth+1,terminal:false};nodes.push(node);}p=node.id;t.add(`Insert ${word}: ${c}`,o.kind==='suffix'?'Insert each suffix into a suffix trie. A suffix tree compresses nonbranching paths into labeled edges; this expanded trie shows the underlying substring idea.':'Words with the same prefix share nodes. An end marker distinguishes a complete word from a prefix.',{graph:g(p)},2);}nodes[p].terminal=true;t.add(`Mark ${word} complete`,'The terminal marker is part of the data structure, not an extra character in the word.',{graph:g(p)},3);});return t.finish(words);
  };
  registry.tst=()=>story(['compare with the node character','smaller → left; larger → right','equal → middle and advance the string index','mark the terminal character'],[
    ['Three-way character branching','Each node has less-than, equal-next-character, and greater-than links.',{graph:{height:300,nodes:[N('c','C',400,40),N('a','A',200,145),N('d','D',600,145),N('a2','A',400,145),N('r','R',320,245),N('t','T',500,245)],edges:[E('c','a','<'),E('c','d','>'),E('c','a2','='),E('a2','r','='),E('r','t','>')]}}],
    ['Search CAR: compare C','Equality consumes C and follows the middle link to the next character.',{rows:[row('Target',['C','A','R'],[0]),row('Decision',['C = C','advance to A'])]}],
    ['Then compare A','Another equal branch consumes A and advances to R.',{rows:[row('Target',['C','A','R'],[1]),row('Decision',['A = A','advance to R'])]}],
    ['Finish on R','A terminal flag confirms that CAR is a stored word. Left and right branches compare alternatives at the same string position.',{rows:[row('Target',['C','A','R'],[],[0,1,2]),row('Result',['CAR found'],[],[0])]}]
  ]);
  registry.greedy=(o)=>{
    if(o.kind==='counterexample')return story(['choose the largest usable coin','repeat until the remainder is zero','compare against another feasible solution','a local choice requires a proof of global optimality'],[
      ['Coin system {1, 3, 4}, target 6','This coin system is deliberately chosen so the largest-coin rule fails.',{rows:[row('Coins',[1,3,4]),row('Target',[6])]}],
      ['Greedy takes 4','The remaining amount is 2.',{rows:[row('Chosen',[4],[0]),row('Remaining',[2])]}],
      ['Then 1 and 1','Greedy uses three coins: 4 + 1 + 1.',{rows:[row('Greedy',[4,1,1]),row('Coin count',[3])]}],
      ['A better solution exists','3 + 3 uses only two coins. Feasibility of greedy choices does not imply optimality.',{rows:[row('Optimal',[3,3],[],[0,1]),row('Coin count',[2],[],[0])]}]
    ]);
    const intervals=[[1,4],[3,5],[0,6],[5,7],[3,9],[8,10],[5,9]],sorted=intervals.slice().sort((a,b)=>a[1]-b[1]),chosen=[],t=trace(['sort intervals by finish time','accept the next interval if start ≥ last finish','update the last finish time']);let end=-Infinity;t.add('Candidate activities','Select as many nonoverlapping activities as possible on one resource.',{intervals:sorted.map((x,i)=>({id:i,start:x[0],end:x[1],tone:''}))});sorted.forEach((x,i)=>{let accept=x[0]>=end;if(accept){chosen.push(i);end=x[1];}t.add(`${accept?'Accept':'Reject'} [${x.join(', ')}]`,accept?'This compatible activity finishes earliest among the remaining candidates.':'This activity overlaps the last accepted interval.',{intervals:sorted.map((y,j)=>({id:j,start:y[0],end:y[1],tone:j===i?(accept?'focus':'reject'):chosen.includes(j)?'done':j<i?'dim':''}))},1);});return t.finish(chosen.map(i=>sorted[i]));
  };
  registry.peak=(o)=>{
    const a=o.values.slice(),t=trace(['probe the middle index','if the right neighbor is larger: search right','otherwise: search left including the middle','one remaining index is a peak']),n=a.length;let lo=0,hi=n-1;t.add('A peak is a local maximum','A peak is at least as large as its existing neighbors. It need not be the global maximum.',{bars:a.map((v,i)=>({id:i,value:v,label:v}))});while(lo<hi){let m=Math.floor((lo+hi)/2);t.add(`Compare ${a[m]} and right neighbor ${a[m+1]}`,'An uphill slope guarantees a peak on the right side; otherwise a peak exists in the left interval including mid.',{bars:a.map((v,i)=>({id:i,value:v,label:v,tone:i===m||i===m+1?'focus':i<lo||i>hi?'dim':''})),equation:`interval [${lo}, ${hi}]`},a[m]<a[m+1]?1:2);if(a[m]<a[m+1])lo=m+1;else hi=m;}t.add(`Peak at index ${lo}: ${a[lo]}`,'The remaining item satisfies the neighbor condition.',{rows:[row('Input',a,[],[lo])]},3);return t.finish({index:lo,array:a});
  };
  registry.peak2d=()=>{
    const a=[[10,8,10,10,5],[14,13,12,11,9],[15,9,11,21,13],[16,17,19,20,14]],t=trace(['choose the middle column','find its column maximum','compare its left and right neighbors','keep the half containing a larger neighbor']);let lo=0,hi=4,result=null;
    while(lo<=hi){let c=Math.floor((lo+hi)/2),r=0;for(let i=1;i<a.length;i++)if(a[i][c]>a[r][c])r=i;let left=c>0?a[r][c-1]:-Infinity,right=c<4?a[r][c+1]:-Infinity;t.add(`Column ${c}: maximum ${a[r][c]} at row ${r}`,'A column maximum already dominates its vertical neighbors. Compare horizontal neighbors to decide the remaining half.',{grid:{values:a,active:[r,c]},equation:`left ${left}, current ${a[r][c]}, right ${right}`},1);if(a[r][c]>=left&&a[r][c]>=right){result=[r,c];break;}if(left>a[r][c])hi=c-1;else lo=c+1;}
    t.add('A two-dimensional peak','This cell is at least as large as each existing orthogonal neighbor.',{grid:{values:a,active:result}},3);return t.finish({position:result,array:a});
  };
  registry.fibonacci=(o)=>{
    const n=Math.min(12,o.n||7),a=Array(n+1).fill('·'),t=trace(['dp[0] ← 0; dp[1] ← 1','for i = 2..n','dp[i] ← dp[i−1] + dp[i−2]','return dp[n]']);a[0]=0;if(n)a[1]=1;t.add('Base cases','Store solved subproblems and reuse their answers.',{rows:[row('DP table',a,[],[0,1])]});for(let i=2;i<=n;i++){a[i]=a[i-1]+a[i-2];t.add(`Compute F(${i}) = ${a[i]}`,`Reuse F(${i-1})=${a[i-1]} and F(${i-2})=${a[i-2]} instead of recomputing their recursion trees.`,{rows:[row('DP table',a,[i-2,i-1],[i])],equation:`${a[i-1]} + ${a[i-2]} = ${a[i]}`},2);}return t.finish(a[n]);
  };
  registry.lcs=()=>{
    const a='ABCBDAB',b='BDCABA',d=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0)),t=trace(['initialize the empty-prefix row and column to 0','if characters match: 1 + diagonal','otherwise: max(above, left)','backtrack to recover one LCS']);t.add('Empty-prefix base cases','dp[i,j] is the LCS length of prefixes a[:i] and b[:j].',{grid:{values:d,rowLabels:['∅',...a],colLabels:['∅',...b]}});for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++){let match=a[i-1]===b[j-1];d[i][j]=match?d[i-1][j-1]+1:Math.max(d[i-1][j],d[i][j-1]);t.add(`Prefixes ${i}, ${j}: length ${d[i][j]}`,match?`Both prefixes end in ${a[i-1]}; extend a common subsequence of the shorter prefixes.`:'The final characters differ. At least one can be excluded; choose the better shorter-prefix result.',{grid:{values:d,rowLabels:['∅',...a],colLabels:['∅',...b],active:[i,j]}},match?1:2);}let i=a.length,j=b.length,out=[];while(i&&j){if(a[i-1]===b[j-1]){out.push(a[--i]);j--;}else if(d[i-1][j]>=d[i][j-1])i--;else j--;}out.reverse();t.add(`One LCS: ${out.join('')}`,'An LCS need not be unique. This backtracking tie rule selects one valid optimal answer.',{rows:[row('Recovered subsequence',out,[],range(out.length))],grid:{values:d,rowLabels:['∅',...a],colLabels:['∅',...b]}},3);return t.finish({length:d[a.length][b.length],sequence:out.join(''),a,b});
  };
  registry.knapsack=()=>{
    const weights=[2,3,4],values=[4,5,7],cap=6,d=Array.from({length:4},()=>Array(cap+1).fill(0)),t=trace(['dp[0,w] ← 0','for each item and capacity','take max(exclude, value + previous-row remainder)','use the previous row so each item is used at most once']);t.add('0/1 choices','Each item may be selected once. dp[i,w] is the best value using the first i items with capacity at most w.',{rows:[row('Items',['weight2/value4','weight3/value5','weight4/value7'])],grid:{values:d}});for(let i=1;i<=3;i++)for(let w=0;w<=cap;w++){let take=w>=weights[i-1]?values[i-1]+d[i-1][w-weights[i-1]]:-Infinity;d[i][w]=Math.max(d[i-1][w],take);t.add(`Item ${i}, capacity ${w}: ${d[i][w]}`,'Compare skipping the item with taking it once and using the preceding row for the remaining capacity.',{grid:{values:d,rowLabels:['none','item 1','item 2','item 3'],colLabels:range(cap+1),active:[i,w]}},2);}return t.finish(d[3][cap]);
  };
  registry.coin=()=>{
    const coins=[1,3,4],a=Array(7).fill(Infinity);a[0]=0;const t=trace(['dp[0] ← 0; others ← ∞','for amount = 1..target','dp[amount] ← min(1 + dp[amount−coin])','ignore coins larger than the amount']);t.add('Unlimited coins: 1, 3, 4','Find the fewest coins for amount 6. Unlike largest-coin greedy, this recurrence considers every possible final coin.',{rows:[row('Minimum coin counts',a.map(x=>Number.isFinite(x)?x:'∞'))]});for(let x=1;x<=6;x++){a[x]=Math.min(...coins.filter(c=>c<=x).map(c=>1+a[x-c]));t.add(`Amount ${x}: ${a[x]} coin(s)`,'All smaller amounts are already solved; choose the best final coin.',{rows:[row('DP table',a.map(x=>Number.isFinite(x)?x:'∞'),[x])]},2);}return t.finish(a[6]);
  };
  registry.paradigms=()=>story(['try a locally optimal choice','split independent subproblems','reuse overlapping subproblems','compare the required correctness assumptions'],[
    ['Greedy','Activity selection can choose the earliest finishing compatible interval; an exchange argument justifies the choice.',{rows:[row('Choice path',['choose','commit','continue'],[0])]}],
    ['Divide and conquer','Merge sort solves two disjoint halves and combines their sorted answers.',{graph:treeGraph(['sort 8','sort 4','sort 4','sort 2','sort 2','sort 2','sort 2'])}],
    ['Dynamic programming','Fibonacci subproblems overlap; computing each state once avoids repeated work.',{rows:[row('Stored states',['F(0)','F(1)','F(2)','F(3)','F(4)'],[],[0,1,2,3])]}],
    ['Match the problem’s structure','A design technique is useful only when its assumptions hold. Try a small counterexample before trusting a local rule.',{rows:[row('Proof obligations',['safe greedy choice','correct split + combine','valid states + recurrence'])]}]
  ]);
  registry.certificate=()=>{
    const g=graphScene([['A','B'],['B','C'],['C','D'],['D','E'],['E','F'],['F','A']]),colors={A:0,B:1,C:0,D:1,E:0,F:1},t=trace(['receive a proposed certificate','check its length and format','check every constraint','accept only if all checks pass']);t.add('A proposed two-coloring','The certificate assigns one of two colors to each vertex.',{graph:{...g,nodes:g.nodes.map(n=>({...n,tone:colors[n.id]?'focus':'done'}))},rows:[row('Certificate',Object.entries(colors).map(([v,c])=>v+': '+c))]});g.edges.forEach((e,i)=>t.add(`Verify edge ${e.a}–${e.b}`,'Its endpoints have different colors. Checking a supplied certificate is distinct from searching over candidate certificates.',{graph:{...g,nodes:g.nodes.map(n=>({...n,tone:n.id===e.a||n.id===e.b?'focus':''})),edges:g.edges.map((x,j)=>({...x,tone:j<=i?'done':''}))}},2,{constraints:i+1}));t.add('Certificate accepted','This particular decision problem is also polynomial-time solvable. NP membership means polynomial-time verification of YES certificates; it does not mean a problem is known to be hard.',{rows:[row('Result',['valid two-coloring'],[],[0])]},3);return t.finish(true);
  };
  registry.classes=()=>story(['P: polynomial-time solvable decision problems','NP: YES certificates verifiable in polynomial time','NP-hard: every NP problem reduces to it','NP-complete: both in NP and NP-hard'],[
    ['P sits inside NP','If we can solve a decision problem in polynomial time, we can also verify its YES answer in polynomial time.',{rows:[row('Containment',['P ⊆ NP','P ⊆ co-NP'])]}],
    ['Certificates distinguish the classes','NP concerns YES certificates; co-NP contains complements of NP languages.',{rows:[row('Verification',['NP: YES certificate','co-NP: NO certificate for the original problem'])]}],
    ['NP-hard does not require NP membership','A problem can be NP-hard without belonging to NP. Some NP-hard problems are NP-complete.',{rows:[row('Definition',['NP-complete = NP ∩ NP-hard'])]}],
    ['An unresolved relationship','Whether P equals NP is unresolved. This diagram does not assume that NP-complete problems lie outside P.',{rows:[row('Known',['P ⊆ NP']),row('Open question',['P = NP ?'],[0])]}]
  ]);
  registry.reduction=()=>story(['start with an independent-set instance (G,k)','transform the target size to |V|−k','solve the resulting vertex-cover instance','translate YES/NO back'],[
    ['Input graph','Use the path A–B–C–D–E. Ask whether an independent set of size at least 3 exists.',{graph:{height:220,nodes:'ABCDE'.split('').map((v,i)=>N(v,v,90+i*155,100)),edges:[E('A','B'),E('B','C'),E('C','D'),E('D','E')]},equation:'Independent Set (G, k=3)'}],
    ['Polynomial transformation','Keep the same graph and ask for a vertex cover of size at most |V|−k = 2.',{rows:[row('Transformation',['same G','k = 3','|V| − k = 2'])]}],
    ['Complement the chosen vertices','{A,C,E} is independent. Its complement {B,D} touches every edge, so it is a vertex cover.',{rows:[row('Independent set',['A','C','E'],[],[0,1,2]),row('Complementary cover',['B','D'],[],[0,1])]}],
    ['Respect the direction of reduction','This construction reduces Independent Set to Vertex Cover: a solver for the latter gives a solver for the former, plus polynomial transformation work.',{equation:'Independent Set ≤ₚ Vertex Cover'}]
  ]);
  registry.bits=()=>{
    const t=trace(['choose a bit mask','AND tests or clears selected bits','OR sets bits','XOR toggles bits']),a=10,b=6,bin=x=>x.toString(2).padStart(4,'0');
    [[a,'a = 10'],[b,'b = 6'],[a&b,'a AND b = 2'],[a|b,'a OR b = 14'],[a^b,'a XOR b = 12'],[a<<1,'a << 1 = 20']].forEach(([v,label],i)=>t.add(label,i===5?'A left shift multiplies this nonnegative integer by two. Fixed-width machine integers additionally require overflow rules.':'Each result bit is computed independently from the corresponding input bits.',{rows:[row('a',[...bin(a)]),row('b',[...bin(b)]),row(label,[...bin(v)],range(bin(v).length))],equation:`${label}: ${bin(v)}`},Math.min(3,i)));return t.finish({and:a&b,or:a|b,xor:a^b});
  };
  function make(key, options={}) {
    if(!registry[key])throw new Error('Unknown animation: '+key);
    const opts={values:[8,3,6,1,9,4],n:8,...options};
    if(!Array.isArray(opts.values)||!opts.values.length||opts.values.length>12||opts.values.some(x=>!Number.isInteger(x)||Math.abs(x)>99))throw new Error('Use 1–12 whole numbers between −99 and 99.');
    return registry[key](opts);
  }
  globalThis.BookAnimationEngine={make,keys:Object.keys(registry)};
})();
