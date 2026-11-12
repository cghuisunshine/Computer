/* UI and playback, kept separate from the independently testable algorithms. */
(() => {
  'use strict';
  const lessons=JSON.parse(document.getElementById('book-lessons').textContent);
  const engine=globalThis.BookAnimationEngine;
  const $=id=>document.getElementById(id);
  const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const SVG='http://www.w3.org/2000/svg';
  const svg=(tag,attrs={},text)=>{const n=document.createElementNS(SVG,tag);for(let [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;return n;};
  const arrayDemos=new Set(['sort','search','array','linked','heap','bst','peak','kSmallest']);
  const sizeDemos=new Set(['growth','recursion','fibonacci']);
  let selected=0,index=0,trace=null,timer=null,playing=false,variantIndex=0;
  let completed=new Set();try{completed=new Set(JSON.parse(localStorage.getItem('book-animation-progress-v1')||'[]'));}catch{}
  const groups=new Map();
  lessons.forEach((lesson,i)=>{if(!groups.has(lesson.chapter))groups.set(lesson.chapter,[]);groups.get(lesson.chapter).push({...lesson,index:i});});
  const navLinks=new Map(),navGroups=new Map();
  for(let [chapter,items] of groups){
    const option=make('option','',chapter);option.value=chapter;$('chapter-filter').append(option);
    const detail=make('details','chapter'),summary=make('summary'),label=make('span','',chapter),count=make('span','chapter-count',items.length);summary.append(label,count);detail.append(summary);const entries=make('div','chapter-items');
    for(let lesson of items){const link=make('a','nav-entry'+(lesson.overview?' overview':'')),text=make('span','',lesson.overview?'Chapter overview':lesson.title),check=make('span','nav-check');link.href='#'+lesson.id;link.dataset.section=lesson.index;link.dataset.search=lesson.title.toLocaleLowerCase();link.append(text,check);entries.append(link);navLinks.set(lesson.id,link);}
    detail.append(entries);$('contents').append(detail);navGroups.set(chapter,detail);
  }
  function refreshProgress(){
    const numbered=lessons.filter(l=>!l.overview&&l.chapterNumber!==null);const count=numbered.filter(l=>completed.has(l.id)).length;
    $('completion-summary').textContent=`${count} / 230 sections explored`;
    for(let [id,link] of navLinks){link.querySelector('.nav-check').textContent=completed.has(id)?'✓':'';}
    const done=completed.has(lessons[selected].id);$('complete').setAttribute('aria-pressed',String(done));$('complete').textContent=done?'✓ Explored':'Mark explored';
  }
  function saveProgress(){try{localStorage.setItem('book-animation-progress-v1',JSON.stringify([...completed]));}catch{}refreshProgress();}
  function search(){const query=$('search').value.trim().toLocaleLowerCase(),chapter=$('chapter-filter').value;let count=0;
    for(let [name,detail] of navGroups){let visible=0;for(let link of detail.querySelectorAll('.nav-entry')){const lesson=lessons[Number(link.dataset.section)],match=(chapter==='all'||chapter===name)&&(!query||(`${lesson.title} ${lesson.chapter} ${lesson.focus} ${lesson.introduction.concept}`).toLocaleLowerCase().includes(query));link.hidden=!match;if(match)visible++;}detail.hidden=!visible;if(visible&&(query||chapter!=='all'))detail.open=true;count+=visible;}
    $('search-status').textContent=query||chapter!=='all'?`${count} matching ${count===1?'entry':'entries'}`:'259 animated entries';
    let empty=$('contents').querySelector('.nav-empty');if(!count&&!empty)$('contents').append(make('p','nav-empty','No sections match. Try another term or choose All chapters.'));else if(count&&empty)empty.remove();
    if((query||chapter!=='all')&&matchMedia('(max-width:760px)').matches){document.querySelector('.sidebar').classList.add('open');$('mobile-contents').setAttribute('aria-expanded','true');}
  }
  function pause(){clearTimeout(timer);timer=null;playing=false;$('play').setAttribute('aria-pressed','false');$('play').textContent=trace&&index===trace.frames.length-1?'↻ Replay':'▶ Play';}
  function optionsFor(){return lessons[selected].variants?.[variantIndex]||{label:'Interactive trace',demo:lessons[selected].demo,options:lessons[selected].options};}
  function readOptions(useInputs=false){
    const variant=optionsFor(),opts={...variant.options};
    if(useInputs&&arrayDemos.has(variant.demo)){
      const parts=$('values').value.trim().split(/[\s,]+/).filter(Boolean),values=parts.map(Number);
      if(!parts.length||values.length>12||values.some(v=>!Number.isInteger(v)||Math.abs(v)>99))throw new Error('Use 1–12 whole numbers between −99 and 99, separated by commas.');opts.values=values;
      if(variant.demo==='search'){const raw=$('target').value;if(raw==='')throw new Error('Enter a search target.');opts.target=Number(raw);if(!Number.isInteger(opts.target)||Math.abs(opts.target)>99)throw new Error('The target must be a whole number from −99 to 99.');}
    }
    if(useInputs&&sizeDemos.has(variant.demo)){opts.n=Number($('size').value);const maximum=variant.demo==='recursion'?6:12;if(!Number.isInteger(opts.n)||opts.n<2||opts.n>maximum)throw new Error(`Choose an input size from 2 through ${maximum}.`);}
    if(useInputs&&variant.demo==='string'){opts.text=$('text-input').value;opts.pattern=$('pattern-input').value;if(!opts.text||!opts.pattern)throw new Error('Enter both a text and a nonempty pattern.');if(opts.text.length>24||opts.pattern.length>8)throw new Error('Use at most 24 text characters and 8 pattern characters.');if(opts.pattern.length>opts.text.length)throw new Error('For this animation, the pattern must not be longer than the text.');}
    return {demo:variant.demo,options:opts};
  }
  function configureInputs(){
    const {demo}=optionsFor(),arrays=arrayDemos.has(demo),sizes=sizeDemos.has(demo),strings=demo==='string';
    $('lesson-focus').textContent=optionsFor().focus||lessons[selected].focus;$('invariant').textContent=optionsFor().invariant||lessons[selected].invariant;
    const introduction=optionsFor().introduction||lessons[selected].introduction;
    $('intro-concept').textContent=introduction.concept;$('intro-example').textContent=introduction.example;$('intro-watch').textContent=introduction.watch;
    $('values-wrap').hidden=!arrays;$('target-wrap').hidden=demo!=='search';$('size-wrap').hidden=!sizes;$('text-wrap').hidden=!strings;$('pattern-wrap').hidden=!strings;$('apply-example').hidden=!(arrays||sizes||strings);$('fixed-example').hidden=arrays||sizes||strings;$('input-hint').hidden=!arrays;
    $('input-error').hidden=true;$('values').value='8, 3, 6, 1, 9, 4';$('target').value='6';$('size').max=demo==='recursion'?'6':'12';$('size').value=demo==='recursion'?'4':'8';$('text-input').value='ABABABCABABABC';$('pattern-input').value='ABABC';
    $('animation-label').textContent=optionsFor().label||'Interactive trace';
  }
  function rebuild(useInputs=true){pause();try{const config=readOptions(useInputs);trace=engine.make(config.demo,config.options);index=0;$('input-error').hidden=true;$('timeline').max=trace.frames.length-1;render(false);return true;}catch(error){$('input-error').textContent=error.message;$('input-error').hidden=false;return false;}}
  function selectLesson(number,updateHash=true){
    if(number<0||number>=lessons.length)return;pause();selected=number;variantIndex=0;const lesson=lessons[number];
    $('lesson-title').textContent=lesson.title;$('lesson-focus').textContent=lesson.focus;$('breadcrumb').textContent=lesson.chapter;$('section-position').textContent=`${number+1} / ${lessons.length}`;$('invariant').textContent=lesson.invariant;
    $('source-link').href=`data_structure_extracted.html#page-${lesson.page}`;$('source-link').textContent=`Read source page ${lesson.page} ↗`;$('pdf-link').href=`data_structure.pdf#page=${lesson.page}`;
    $('entry-kind').textContent=lesson.overview?'Chapter / reading overview':lesson.exercise?'Representative worked example':'Section animation';$('exercise-note').hidden=!lesson.exercise;
    $('reference-link').hidden=!lesson.reference;if(lesson.reference){$('reference-link').textContent=lesson.reference.title+' ↗';$('reference-link').href=lesson.reference.url;}
    $('variant').replaceChildren();$('variant-wrap').hidden=!lesson.variants;for(let [i,v] of (lesson.variants||[]).entries()){const opt=make('option','',v.label);opt.value=i;$('variant').append(opt);}
    for(let [id,link] of navLinks){if(id===lesson.id)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}navGroups.get(lesson.chapter).open=true;
    $('previous-section').disabled=number===0;$('next-section').disabled=number===lessons.length-1;$('previous-title').textContent=number?lessons[number-1].title:'Beginning of the companion';$('next-title').textContent=number<lessons.length-1?lessons[number+1].title:'End of the companion';
    configureInputs();rebuild(true);refreshProgress();scrollCurrentLink();
    if(updateHash){try{history.replaceState(null,'','#'+lesson.id);}catch{location.hash=lesson.id;}}
  }
  function scrollCurrentLink(){const link=navLinks.get(lessons[selected].id),container=$('contents');if(!container.clientHeight||!link.getClientRects().length)return;const box=container.getBoundingClientRect(),rect=link.getBoundingClientRect();if(rect.top<box.top||rect.bottom>box.bottom)container.scrollTop+=rect.top-box.top-(container.clientHeight-rect.height)/2;}
  function drawRow(data,rowIndex){const wrap=make('div','scene-row');wrap.append(make('p','row-label',data.label));const cells=make('div','cells');
    if(!data.items?.length)cells.append(make('span','row-empty','∅ Empty'));
    else data.items.forEach((item,i)=>{const el=make('div','value-cell '+(item.tone||'')+(item.label!==undefined?' has-index':''));el.dataset.motionKey='row'+rowIndex+':'+item.id;el.append(make('span','',item.value));if(item.label)el.append(make('span','cell-caption',item.label));cells.append(el);});wrap.append(cells);return wrap;
  }
  function drawGraph(graph,title){
    const s=svg('svg',{viewBox:`0 0 820 ${graph.height||320}`,class:'scene-svg',role:'img','aria-label':title});s.append(svg('title',{},title));const defs=svg('defs'),marker=svg('marker',{id:'book-arrow',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:5,markerHeight:5,orient:'auto-start-reverse'});marker.append(svg('path',{d:'M 0 0 L 10 5 L 0 10 z'}));defs.append(marker);s.append(defs);
    const nodes=new Map(graph.nodes.map(n=>[String(n.id),n]));
    for(let e of graph.edges){const a=nodes.get(String(e.a)),b=nodes.get(String(e.b));if(!a||!b)continue;let dx=b.x-a.x,dy=b.y-a.y,length=Math.max(1,Math.hypot(dx,dy)),sx=a.x+dx/length*28,sy=a.y+dy/length*28,tx=b.x-dx/length*31,ty=b.y-dy/length*31,d=`M ${sx} ${sy} L ${tx} ${ty}`,lx=(a.x+b.x)/2,ly=(a.y+b.y)/2-8;
      if(Math.abs(dy)<5&&Math.abs(dx)>200&&e.arrow){const y=Math.min((graph.height||320)-26,a.y+100);d=`M ${a.x} ${a.y+26} C ${a.x} ${y}, ${b.x} ${y}, ${b.x} ${b.y+30}`;ly=y-10;}
      else if(Math.abs(dy)<5&&graph.edges.some(x=>String(x.a)===String(e.b)&&String(x.b)===String(e.a))){let off=dx>0?-32:32;d=`M ${sx} ${sy} Q ${lx} ${a.y+off}, ${tx} ${ty}`;ly=a.y+off/2-8;}
      const path=svg('path',{d,class:'graph-edge '+(e.tone||'')});if(e.arrow)path.setAttribute('marker-end','url(#book-arrow)');s.append(path);if(e.label!==undefined&&e.label!=='')s.append(svg('text',{x:lx,y:ly,'text-anchor':'middle',class:'edge-label'},e.label));
    }
    for(let n of graph.nodes){const g=svg('g',{transform:`translate(${n.x},${n.y})`,class:'graph-node '+(n.tone||''),'data-motion-key':'node:'+n.id,'data-x':n.x,'data-y':n.y});const width=Math.max(54,String(n.value).length*9+22);g.append(svg('rect',{x:-width/2,y:-25,width,height:50,rx:17,class:'node-shape'}),svg('text',{x:0,y:1,class:'node-text'},n.value));if(n.label)g.append(svg('text',{x:0,y:44,class:'node-label'},n.label));s.append(g);}return s;
  }
  function drawBars(scene){const wrap=make('div','scene-row'),bars=make('div','bars'),vals=scene.bars.map(x=>x.value),min=Math.min(0,...vals),max=Math.max(...vals),height=x=>scene.logScale?Math.log2(Math.max(0,x)+1)/Math.log2(max+1)*160:((x-min)/Math.max(1,max-min))*150+8;
    scene.bars.forEach(b=>{const bar=make('div','bar '+(b.tone||''));bar.dataset.motionKey='bar:'+b.id;const value=make('span','bar-value',String(b.value)),fill=make('div','bar-fill'),label=make('span','bar-label',String(b.label));fill.style.height=height(b.value)+'px';bar.append(value,fill,label);bars.append(bar);});wrap.append(bars);if(scene.logScale||min<0)wrap.append(make('p','chart-note',scene.logScale?'Bar height uses log₂(count + 1) so all growth rates remain visible; labels show the actual counts.':`Heights are offset by ${-min} to accommodate negative keys; labels show the original values.`));return wrap;
  }
  function drawGrid(grid){const wrap=make('div','grid-wrap'),matrix=make('div','matrix'),values=grid.values,rows=values.length,cols=Math.max(...values.map(x=>x.length)),header=Boolean(grid.rowLabels||grid.colLabels);matrix.style.gridTemplateColumns=`${header?'minmax(34px,auto) ':''}repeat(${cols},minmax(32px,1fr))`;matrix.setAttribute('role','table');matrix.setAttribute('aria-label','Algorithm state table');
    if(header){matrix.append(make('div','matrix-cell head',''));for(let c=0;c<cols;c++)matrix.append(make('div','matrix-cell head',String(grid.colLabels?.[c]??c)));}
    for(let r=0;r<rows;r++){if(header)matrix.append(make('div','matrix-cell head',String(grid.rowLabels?.[r]??r)));for(let c=0;c<cols;c++){const active=grid.active&&grid.active[0]===r&&grid.active[1]===c;const n=make('div','matrix-cell'+(active?' focus':'')+(active&&grid.reject?' reject':''),String(values[r][c]??''));n.dataset.motionKey=`grid:${r}:${c}`;n.setAttribute('aria-label',`Row ${grid.rowLabels?.[r]??r}, column ${grid.colLabels?.[c]??c}: ${values[r][c]??'empty'}`);matrix.append(n);}}wrap.append(matrix);return wrap;
  }
  function drawIntervals(intervals,title){const max=Math.max(...intervals.map(x=>x.end)),height=intervals.length*37+70,s=svg('svg',{viewBox:`0 0 820 ${height}`,class:'scene-svg',role:'img','aria-label':title});s.append(svg('title',{},title));const x=v=>100+v/max*650;for(let i=0;i<=max;i++)s.append(svg('text',{x:x(i),y:20,class:'edge-label','text-anchor':'middle'},i));intervals.forEach((v,i)=>{const y=50+i*37;s.append(svg('text',{x:55,y:y+4,class:'edge-label','text-anchor':'middle'},i+1),svg('line',{x1:x(v.start),x2:x(v.end),y1:y,y2:y,class:'interval '+v.tone}));});return s;}
  function render(animate=true){
    const frame=trace.frames[index],scene=frame.scene,stage=$('scene');
    const old=new Map([...stage.querySelectorAll('[data-motion-key]')].map(n=>[n.dataset.motionKey,n.getBoundingClientRect()]));stage.replaceChildren();
    if(scene.graph)stage.append(drawGraph(scene.graph,frame.title));if(scene.bars)stage.append(drawBars(scene));if(scene.intervals)stage.append(drawIntervals(scene.intervals,frame.title));if(scene.grid)stage.append(drawGrid(scene.grid));(scene.rows||[]).forEach((r,i)=>stage.append(drawRow(r,i)));if(scene.equation)stage.append(make('div','equation',scene.equation));if(!stage.childElementCount)stage.append(make('p','scene-empty','∅ Empty initial state'));
    $('step-title').textContent=frame.title;$('step-note').textContent=frame.note;$('frame-counter').textContent=`Step ${index+1} of ${trace.frames.length}`;$('timeline').value=index;$('timeline').setAttribute('aria-valuetext',`Step ${index+1}: ${frame.title}`);$('back').disabled=index===0;$('next').disabled=index===trace.frames.length-1;
    $('pseudo').replaceChildren();trace.code.forEach((text,i)=>$('pseudo').append(make('li',i===Math.min(frame.line,trace.code.length-1)?'active':'',text)));
    $('metrics').replaceChildren();for(let [label,value] of Object.entries(frame.metrics)){const metric=make('span','metric');metric.append(label+': ',make('b','',value));$('metrics').append(metric);}if(!playing)$('play').textContent=index===trace.frames.length-1?'↻ Replay':'▶ Play';
    if(animate&&!reduced.matches){const duration=450/Number($('speed').value);for(let n of stage.querySelectorAll('[data-motion-key]')){if(typeof n.animate!=='function')continue;const previous=old.get(n.dataset.motionKey),rect=n.getBoundingClientRect();if(n.namespaceURI===SVG){const scale=n.ownerSVGElement.getBoundingClientRect().width/820||1,x=Number(n.dataset.x),y=Number(n.dataset.y);if(previous)n.animate([{transform:`translate(${x+(previous.left-rect.left)/scale}px,${y+(previous.top-rect.top)/scale}px)`},{transform:`translate(${x}px,${y}px)`}],{duration,easing:'ease-in-out'});else n.animate([{opacity:0},{opacity:1}],{duration});}else if(previous)n.animate([{transform:`translate(${previous.left-rect.left}px,${previous.top-rect.top}px)`},{transform:'translate(0,0)'}],{duration,easing:'ease-in-out'});else n.animate([{opacity:0,transform:'translateY(-10px)'},{opacity:1,transform:'translateY(0)'}],{duration});}}
  }
  function seek(value){pause();index=Math.max(0,Math.min(trace.frames.length-1,Number(value)));render();}
  function tick(){if(!playing)return;if(index<trace.frames.length-1){index++;render();}if(index===trace.frames.length-1){pause();return;}timer=setTimeout(tick,1800/Number($('speed').value));}
  function togglePlay(){if(playing){pause();return;}if(index===trace.frames.length-1){index=0;render(false);}playing=true;$('play').setAttribute('aria-pressed','true');$('play').textContent='Ⅱ Pause';timer=setTimeout(tick,1800/Number($('speed').value));}
  $('play').onclick=togglePlay;$('reset').onclick=()=>seek(0);$('back').onclick=()=>seek(index-1);$('next').onclick=()=>seek(index+1);$('timeline').oninput=()=>seek($('timeline').value);$('speed').onchange=()=>{if(playing){clearTimeout(timer);timer=setTimeout(tick,1800/Number($('speed').value));}};
  $('example-form').onsubmit=e=>{e.preventDefault();rebuild(true);};$('variant').onchange=()=>{pause();variantIndex=Number($('variant').value);configureInputs();rebuild(true);};
  $('search').oninput=search;$('chapter-filter').onchange=search;$('clear-search').onclick=()=>{$('search').value='';search();$('search').focus();};$('collapse-all').onclick=()=>navGroups.forEach(d=>d.open=false);
  $('contents').onclick=e=>{const link=e.target.closest('a[data-section]');if(!link||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey)return;e.preventDefault();selectLesson(Number(link.dataset.section));if(matchMedia('(max-width:760px)').matches){document.querySelector('.sidebar').classList.remove('open');$('mobile-contents').setAttribute('aria-expanded','false');$('workspace').scrollIntoView({behavior:'auto',block:'start'});}};
  $('previous-section').onclick=()=>selectLesson(selected-1);$('next-section').onclick=()=>selectLesson(selected+1);$('mobile-contents').onclick=()=>{const open=document.querySelector('.sidebar').classList.toggle('open');$('mobile-contents').setAttribute('aria-expanded',String(open));if(open){scrollCurrentLink();$('contents').scrollIntoView({behavior:'auto',block:'nearest'});}};
  $('complete').onclick=()=>{const id=lessons[selected].id;if(completed.has(id))completed.delete(id);else completed.add(id);saveProgress();};$('clear-progress').onclick=()=>{completed.clear();saveProgress();};
  function readHash(){let i=lessons.findIndex(l=>location.hash==='#'+l.id);if(i<0)i=lessons.findIndex(l=>l.title==='1.1 Variables');selectLesson(i,false);}
  window.addEventListener('hashchange',readHash);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('beforeprint',pause);
  document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select,button')||e.ctrlKey||e.metaKey||e.altKey)return;if(e.code==='Space'){e.preventDefault();togglePlay();}else if(e.key==='ArrowRight'){e.preventDefault();seek(index+1);}else if(e.key==='ArrowLeft'){e.preventDefault();seek(index-1);}else if(e.key==='Home'){e.preventDefault();seek(0);}else if(e.key==='End'){e.preventDefault();seek(trace.frames.length-1);}});
  $('coverage').textContent=`259 animated entries · 230 numbered sections · 22 chapters · ${engine.keys.length} animation models. Original section numbering is preserved, including the two 1.21 entries.`;
  // A small read-only inspection API supports exhaustive coverage and playback QA.
  globalThis.BookAnimationLab={lessons,select:selectLesson,seek,get state(){return {selected,index,playing,variantIndex,frames:trace.frames.length,lesson:lessons[selected].id};}};
  readHash();
})();
