const lessons = COURSE.lessons;
const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storageKey = 'python-classes-workshop-v2';
const questions = lessons.flatMap((lesson, li) => lesson.questions.map((question, qi) => ({...question, lesson: li, id: `${li}-${qi}`})));
const tasks = new Map(lessons.flatMap((lesson, li) => lesson.practices.map(task => [task.id, {...task, lesson: li}])));
let completed = [], passed = [], selected = 0, answers = {}, drafts = {}, savedTask = null;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (Array.isArray(saved.completed)) completed = [...new Set(saved.completed.filter(n => Number.isInteger(n) && n >= 0 && n < lessons.length))];
  if (Array.isArray(saved.passed)) passed = [...new Set(saved.passed.filter(id => tasks.has(id)))];
  if (Number.isInteger(saved.selected) && lessons[saved.selected]) selected = saved.selected;
  if (saved.answers && typeof saved.answers === 'object') for (const q of questions) if (Number.isInteger(saved.answers[q.id]) && q.options[saved.answers[q.id]] !== undefined) answers[q.id] = saved.answers[q.id];
  if (saved.drafts && typeof saved.drafts === 'object') for (const [key, value] of Object.entries(saved.drafts)) if (typeof value === 'string' && (key === 'scratch' || tasks.has(key))) drafts[key] = value;
  if (tasks.has(saved.activeTask)) savedTask = saved.activeTask;
} catch (_) {}
let quizFilter = selected, quizPosition = 0;
const defaultCode = $('#code-editor').value;
let workspace = {key: 'scratch', title: 'Scratch space', initial: defaultCode};
let worker = null, runTimer = null, running = false, activeRun = null, requestId = 0;
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify({completed, passed, selected, answers, drafts, activeTask: tasks.has(workspace.key) ? workspace.key : null})); } catch (_) {}
}
function scrollToElement(element) {
  element.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'});
}
function renderProgress() {
  $('#progress-label').textContent = `${completed.length} / ${lessons.length}`;
  $('#progress-fill').style.width = `${completed.length / lessons.length * 100}%`;
  $('#progress-bar').setAttribute('aria-valuenow', completed.length);
  const corePassed = [...tasks.values()].filter(task => !task.optional && passed.includes(task.id)).length;
  $('#task-progress').textContent = `${corePassed} / 8 core tasks checked`;
  $('#quiz-progress').textContent = `${questions.filter(q => answers[q.id] === q.correct).length} / 24 answered correctly`;
}
function renderAgenda() {
  let minute = 0;
  $('#agenda-grid').innerHTML = lessons.map((lesson, i) => {
    const start = minute; minute += lesson.minutes;
    return `<button class="agenda-item" type="button" data-agenda="${i}"><span class="agenda-time">${String(start).padStart(2,'0')}–${minute} MIN</span><strong><small>${String(i+1).padStart(2,'0')}</small>${escapeHtml(lesson.title)}</strong><span>${lesson.minutes} minutes <b aria-hidden="true">↗</b></span></button>`;
  }).join('');
  document.querySelectorAll('[data-agenda]').forEach(button => button.addEventListener('click', () => selectLesson(Number(button.dataset.agenda), true)));
}
function renderLessonList() {
  $('#lesson-list').innerHTML = lessons.map((lesson, i) => `<button class="lesson-item ${i === selected ? 'active' : ''}" type="button" data-lesson="${i}" ${i === selected ? 'aria-current="step"' : ''}><span class="lesson-num">${String(i+1).padStart(2,'0')}</span><span class="lesson-name">${escapeHtml(lesson.title)}<small>${lesson.minutes} minutes</small></span><span class="lesson-check" aria-label="${completed.includes(i) ? 'Reviewed' : ''}">${completed.includes(i) ? '✓' : '›'}</span></button>`).join('');
  document.querySelectorAll('[data-lesson]').forEach(button => button.addEventListener('click', () => selectLesson(Number(button.dataset.lesson), true)));
}
function exampleHtml(example, index) {
  return `<section class="worked-example"><div class="example-title"><span>EXAMPLE ${index+1}</span><h5>${escapeHtml(example.title)}</h5></div><div class="code-card"><div class="code-card-head"><span>EXAMPLE.PY</span><button type="button" data-copy="${index}">Copy code</button></div><pre><code>${escapeHtml(example.code)}</code></pre><div class="code-card-foot"><span>OUTPUT ›</span>${escapeHtml(example.output)}</div></div><ul class="example-notes">${example.notes.map(note => `<li>${escapeHtml(note)}</li>`).join('')}</ul><button class="small-action" type="button" data-example="${index}">Explore example in lab ↗</button></section>`;
}
function taskHtml(task) {
  return `<div class="exercise-card ${task.optional ? 'optional' : ''}"><div class="exercise-meta"><span>${task.optional ? 'OPTIONAL STRETCH · EXTRA TIME' : 'CORE CODING TASK · INCLUDED IN THE PLAN'}</span>${passed.includes(task.id) ? '<strong>✓ Checks passed</strong>' : ''}</div><h5>${escapeHtml(task.title)}</h5><p>${escapeHtml(task.prompt)}</p><ol class="requirements">${task.requirements.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ol><button class="button button-dark task-load" type="button" data-task="${task.id}">${drafts[task.id] !== undefined ? 'Resume task in lab' : 'Load task in lab'} ↗</button><div class="exercise-help">${task.hint.map((hint, i) => `<details><summary>Hint ${i+1}</summary><p>${escapeHtml(hint)}</p></details>`).join('')}<details><summary>What the checks verify</summary><ul>${task.tests.map(test => `<li>${escapeHtml(test.name)}</li>`).join('')}</ul></details><details class="solution-details"><summary>Reference solution — open after trying</summary><pre><code>${escapeHtml(task.solution)}</code></pre><p>${escapeHtml(task.why)}</p><button class="small-action" type="button" data-solution="${task.id}">Explore reference in scratch space ↗</button></details></div></div>`;
}
function renderLesson() {
  const lesson = lessons[selected];
  const labels = ['Concepts','Examples','Core coding','Quick checks'];
  $('#lesson-panel').innerHTML = `<div class="lesson-topline"><span>SECTION ${String(selected+1).padStart(2,'0')} / 08 · ${escapeHtml(lesson.label)}</span><span class="lesson-time">◷ ${lesson.minutes} min</span></div><h3 tabindex="-1" id="active-lesson-title">${escapeHtml(lesson.title)}<span class="accent-period">.</span></h3><p class="lesson-description">${escapeHtml(lesson.description)}</p><div class="lesson-pacing">${lesson.timing.map((n,i) => `<span><strong>${n} min</strong> ${labels[i]}</span>`).join('')}</div><div class="lesson-goals"><strong>BY THE END, YOU CAN</strong><ul>${lesson.goals.map(goal => `<li>${escapeHtml(goal)}</li>`).join('')}</ul></div><h4 class="lesson-subheading">Understand the model</h4>${lesson.concepts.map(([title, text]) => `<section class="concept-section"><h5>${escapeHtml(title)}</h5><p>${escapeHtml(text)}</p></section>`).join('')}<h4 class="lesson-subheading">Trace the examples</h4><p class="reading-prompt">Before running each example, predict its output. Then explain why the object state changes or stays the same.</p>${lesson.examples.map(exampleHtml).join('')}<h4 class="lesson-subheading">Build it yourself</h4>${taskHtml(lesson.practices[0])}<details class="stretch-details"><summary>Stretch challenge: ${escapeHtml(lesson.practices[1].title)} <span>Optional · outside the 120 minutes</span></summary>${taskHtml(lesson.practices[1])}</details>${selected === lessons.length-1 ? '<div class="exit-ticket"><h4>Exit ticket · explain your design</h4><ol><li>Why does every Library need its own books dictionary?</li><li>What state stays unchanged when a borrow operation fails?</li><li>Why does a Library contain Books instead of inheriting from Book?</li></ol><p>A finished core project passes all nine capstone checks, and you can explain these three decisions.</p></div>' : ''}<div class="lesson-actions"><button type="button" class="mark-button ${completed.includes(selected) ? 'done' : ''}" id="mark-complete">${completed.includes(selected) ? '✓ Reviewed · undo' : 'Mark section reviewed'}</button><button type="button" class="small-action" id="open-quick-checks">Answer this section’s 3 questions ↓</button>${selected < lessons.length-1 ? '<button type="button" class="next-button" id="next-lesson">Next section →</button>' : ''}</div>`;
  $('#mark-complete').addEventListener('click', () => { completed = completed.includes(selected) ? completed.filter(n => n !== selected) : [...completed, selected]; save(); renderProgress(); renderLessonList(); renderLesson(); });
  $('#open-quick-checks').addEventListener('click', () => { quizFilter = selected; quizPosition = 0; renderQuiz(); scrollToElement($('#practice')); });
  if ($('#next-lesson')) $('#next-lesson').addEventListener('click', () => selectLesson(selected+1, true));
  $('#lesson-panel').querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => {
    const example = lesson.examples[Number(button.dataset.example)]; loadScratch(example.code, example.title);
  }));
  $('#lesson-panel').querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(lesson.examples[Number(button.dataset.copy)].code); button.textContent = 'Copied!'; } catch (_) { button.textContent = 'Select and copy the code'; }
  }));
  $('#lesson-panel').querySelectorAll('[data-task]').forEach(button => button.addEventListener('click', () => loadTask(button.dataset.task)));
  $('#lesson-panel').querySelectorAll('[data-solution]').forEach(button => button.addEventListener('click', () => {
    const task = tasks.get(button.dataset.solution); loadScratch(task.solution, `Reference: ${task.title}`);
  }));
}
function selectLesson(index, scroll) {
  selected = index; quizFilter = index; quizPosition = 0;
  save(); renderLessonList(); renderLesson(); renderQuiz();
  if (scroll) { scrollToElement($('#lesson-panel')); $('#active-lesson-title').focus({preventScroll: true}); }
}
function quizSet() { return quizFilter === 'all' ? questions : questions.filter(q => q.lesson === quizFilter); }
function renderQuiz() {
  const set = quizSet(); const question = set[quizPosition]; const answer = answers[question.id]; const answered = answer !== undefined;
  $('#quiz-card').innerHTML = `<label class="quiz-filter-label" for="quiz-topic">Practice topic</label><select id="quiz-topic"><option value="all" ${quizFilter === 'all' ? 'selected' : ''}>All sections · 24 questions</option>${lessons.map((lesson,i) => `<option value="${i}" ${quizFilter === i ? 'selected' : ''}>${i+1}. ${escapeHtml(lesson.title)}</option>`).join('')}</select><div class="quiz-top"><span>SECTION ${String(question.lesson+1).padStart(2,'0')}</span><span>QUESTION ${quizPosition+1} / ${set.length}</span></div><h3>${escapeHtml(question.stem)}</h3>${question.code ? `<pre class="quiz-code"><code>${escapeHtml(question.code)}</code></pre>` : ''}<div class="quiz-options">${question.options.map((option,i) => `<button class="quiz-option ${answered && i === question.correct ? 'correct' : ''} ${answered && i === answer && i !== question.correct ? 'incorrect' : ''}" type="button" data-answer="${i}" ${answered ? 'disabled' : ''}><span class="option-letter">${'ABCD'[i]}</span><span>${escapeHtml(option)}</span></button>`).join('')}</div><div class="quiz-feedback ${answered && answer !== question.correct ? 'wrong' : ''}" id="quiz-feedback" role="status">${answered ? escapeHtml((answer === question.correct ? 'Exactly. ' : 'Review this idea. ') + question.explanation) : 'Predict the result before choosing.'}</div><div class="quiz-footer"><button type="button" class="quiz-next" id="quiz-previous" ${quizPosition === 0 ? 'disabled' : ''}>← Previous</button>${answered ? '<button class="quiz-next" id="quiz-retry" type="button">Try again</button>' : '<span></span>'}<button type="button" class="quiz-next" id="quiz-next">${quizPosition === set.length-1 ? 'First question ↻' : 'Next →'}</button></div>`;
  $('#quiz-topic').addEventListener('change', event => { quizFilter = event.target.value === 'all' ? 'all' : Number(event.target.value); quizPosition = 0; renderQuiz(); });
  document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => { if (answers[question.id] !== undefined) return; answers[question.id] = Number(button.dataset.answer); save(); renderProgress(); renderQuiz(); }));
  $('#quiz-next').addEventListener('click', () => { quizPosition = (quizPosition+1) % set.length; renderQuiz(); });
  $('#quiz-previous').addEventListener('click', () => { if (quizPosition > 0) { quizPosition--; renderQuiz(); } });
  if ($('#quiz-retry')) $('#quiz-retry').addEventListener('click', () => { delete answers[question.id]; save(); renderProgress(); renderQuiz(); });
}
function rememberDraft() { drafts[workspace.key] = $('#code-editor').value; save(); }
function renderLabTask() {
  const task = tasks.get(workspace.key);
  $('#lab-task').innerHTML = task ? `<div class="exercise-meta"><span>SECTION ${task.lesson+1} · ${task.optional ? 'OPTIONAL STRETCH' : 'CORE TASK'}</span><strong>${passed.includes(task.id) ? '✓ Last checks passed' : `${task.tests.length} behavior checks`}</strong></div><h3>${escapeHtml(task.title)}</h3><p>${escapeHtml(task.prompt)}</p><details><summary>Task requirements and hints</summary><ol>${task.requirements.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ol>${task.hint.map((hint,i) => `<p><strong>Hint ${i+1}:</strong> ${escapeHtml(hint)}</p>`).join('')}</details><div class="lab-links"><button id="return-to-lesson" class="small-action" type="button">Back to section ${task.lesson+1} ↑</button><button id="free-play" class="small-action" type="button">Open scratch space</button></div>` : `<span class="section-kicker">NO TASK LOADED</span><h3>${escapeHtml(workspace.title)}</h3><p>Experiment freely, or open a core task from a lesson to enable behavior checks.</p>`;
  $('#editor-filename').textContent = task ? `${task.id.replaceAll('-', '_')}.py` : 'scratch.py';
  $('#check-button').disabled = running || !task;
  if ($('#return-to-lesson')) $('#return-to-lesson').addEventListener('click', () => selectLesson(task.lesson, true));
  if ($('#free-play')) $('#free-play').addEventListener('click', () => loadScratch(drafts.scratch ?? defaultCode, 'Scratch space'));
}
function setWorkspace(next, value, scroll = true) {
  if (running) stopRun();
  rememberDraft(); workspace = next; $('#code-editor').value = value;
  $('#check-results').innerHTML = ''; $('#code-output').textContent = 'Ready for a fresh run.'; $('#code-output').style.color = '#d0eda7';
  $('#run-status').textContent = 'Ready · Ctrl/⌘ + Enter to run';
  renderLabTask(); save();
  if (scroll) { scrollToElement($('#playground')); $('#code-editor').focus({preventScroll:true}); }
}
function loadTask(id, scroll = true) {
  const task = tasks.get(id); if (!task) return;
  setWorkspace({key:id, title:task.title, initial:task.starter}, drafts[id] ?? task.starter, scroll);
}
function loadScratch(code, title) { setWorkspace({key:'scratch', title, initial:code}, code); }
function setBusy(busy) {
  running = busy;
  $('#run-button').disabled = busy; $('#check-button').disabled = busy || !tasks.has(workspace.key);
  $('#reset-code').disabled = busy; $('#code-editor').readOnly = busy;
  $('#stop-button').hidden = !busy;
}
function resetWorker() { if (worker) worker.terminate(); worker = null; }
function finishRun(result) {
  if (!activeRun || result.id !== activeRun.id) return;
  clearTimeout(runTimer); setBusy(false);
  $('#code-output').textContent = result.output || (activeRun.checking ? '(No printed output. See the behavior checks below.)' : '(No output. Use print() to display a value.)');
  $('#code-output').style.color = result.error ? '#ffbaa8' : '#d0eda7';
  $('#run-status').textContent = result.error ? 'Python reported an error' : 'Finished';
  if (activeRun.checking) {
    const checks = result.checks || [];
    const allPassed = !result.error && checks.length === activeRun.count && checks.every(check => check.passed);
    if (allPassed && !passed.includes(activeRun.taskId)) passed.push(activeRun.taskId);
    if (!allPassed) passed = passed.filter(id => id !== activeRun.taskId);
    $('#check-results').innerHTML = `<div class="check-summary ${allPassed ? 'pass' : 'fail'}"><strong>${allPassed ? '✓ All checks passed' : result.error ? 'Fix the Python error before checking behavior' : 'Some behavior needs another look'}</strong><span>${checks.filter(c => c.passed).length} / ${activeRun.count} checks passed</span></div>${checks.length ? `<ul class="check-list">${checks.map(check => `<li class="${check.passed ? 'pass' : 'fail'}"><strong>${check.passed ? '✓' : '✕'} ${escapeHtml(check.name)}</strong>${!check.passed ? `<pre>${escapeHtml(check.detail || 'The assertion did not hold.')}</pre>` : ''}</li>`).join('')}</ul>` : ''}<p class="check-note">These checks cover the stated task contract. Also trace your code and explain why it works.</p>`;
    save(); renderProgress(); renderLabTask(); renderLesson();
  }
  activeRun = null;
}
function stopRun(message = 'Run stopped. Your code is still in the editor.') {
  clearTimeout(runTimer); resetWorker(); activeRun = null; setBusy(false);
  $('#run-status').textContent = 'Stopped'; $('#code-output').textContent = message;
}
function runCode(checking = false) {
  if (running) return;
  const task = tasks.get(workspace.key); if (checking && !task) return;
  rememberDraft();
  activeRun = {id:++requestId, checking, taskId:task?.id, count:checking ? task.tests.length : 0};
  setBusy(true); $('#check-results').innerHTML = '';
  $('#run-status').textContent = worker ? 'Running Python…' : 'Downloading Python for the first run…';
  $('#code-output').textContent = 'Working…'; $('#code-output').style.color = '#d0eda7';
  try {
    if (!worker) {
      worker = new Worker('runner.js', {type:'module'});
      worker.onmessage = event => {
        const message = event.data;
        if (!activeRun || message.id !== activeRun.id) return;
        if (message.type === 'ready') {
          clearTimeout(runTimer); $('#run-status').textContent = activeRun.checking ? 'Running code and behavior checks…' : 'Running Python…';
          runTimer = setTimeout(() => stopRun('This run exceeded 10 seconds and was stopped. Check for an endless loop.'), 10000);
        } else if (message.type === 'result') finishRun(message);
      };
      worker.onerror = () => { const id = activeRun?.id; resetWorker(); finishRun({id, error:true, output:'Python could not load. Check your connection and try again.'}); };
    }
    runTimer = setTimeout(() => stopRun('Python did not finish loading within 90 seconds. Check your connection and try again.'), 90000);
    worker.postMessage({type:'run', id:activeRun.id, code:$('#code-editor').value, tests:checking ? task.tests : []});
  } catch (_) {
    const id = activeRun.id; resetWorker(); finishRun({id, error:true, output:'The browser could not start Python. Check the browser settings or try another browser.'});
  }
}
$('#code-editor').addEventListener('input', () => {
  if (passed.includes(workspace.key)) { passed = passed.filter(id => id !== workspace.key); renderProgress(); renderLabTask(); renderLesson(); }
  $('#check-results').innerHTML = ''; rememberDraft();
});
$('#code-editor').addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); runCode(false); } });
$('#run-button').addEventListener('click', () => runCode(false));
$('#check-button').addEventListener('click', () => runCode(true));
$('#stop-button').addEventListener('click', () => stopRun());
$('#reset-code').addEventListener('click', () => {
  $('#code-editor').value = workspace.initial; passed = passed.filter(id => id !== workspace.key);
  $('#check-results').innerHTML = ''; $('#code-output').textContent = 'Starter code restored.'; rememberDraft(); renderProgress(); renderLabTask();
});
$('#clear-output').addEventListener('click', () => { $('#code-output').textContent = 'Output cleared.'; });
renderAgenda(); renderProgress(); renderLessonList(); renderLesson(); renderQuiz();
if (savedTask) {
  const task = tasks.get(savedTask);
  workspace = {key:savedTask, title:task.title, initial:task.starter};
  $('#code-editor').value = drafts[savedTask] ?? task.starter;
  renderLabTask();
} else { $('#code-editor').value = drafts.scratch ?? defaultCode; renderLabTask(); }
