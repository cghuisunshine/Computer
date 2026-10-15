const lessons = [
  {
    title: "Hello, Python", time: "5 min", label: "THE FIRST STEP",
    description: "Python reads your instructions from top to bottom. Start with print() to make the computer say something back.",
    concept: "A function is a named action. The print() function displays text. Put text inside quotation marks so Python treats it as a string.",
    code: 'print("Hello, world!")\nprint("I can code in Python.")',
    output: "Hello, world!\nI can code in Python.",
    takeaway: "Try changing the message between the quotation marks. Keep both quotes and both parentheses.",
    question: 'What does print("Hi!") do?',
    options: ["Stores the word Hi", "Displays Hi! in the output", "Creates a file called Hi", "Asks for input"],
    correct: 1, explanation: "print() displays the value inside its parentheses. The quotation marks tell Python that Hi! is text."
  },
  {
    title: "Variables & types", time: "7 min", label: "SAVE A VALUE",
    description: "A variable gives a value a name, so you can reuse it later. Python figures out whether a value is text, a number, or something else.",
    concept: "Use = to assign a value. Strings use quotes; integers are whole numbers without quotes. You can combine strings with an f-string.",
    code: 'name = "Maya"\nage = 12\nprint(f"{name} is {age} years old.")',
    output: "Maya is 12 years old.",
    takeaway: "name and age are variables. Change either value and the final sentence changes too.",
    question: 'Which line stores the number 12 as an integer?',
    options: ['age = "12"', "age == 12", "age = 12", "print(12)"],
    correct: 2, explanation: "age = 12 assigns the whole number 12. Adding quotes would make it a string instead."
  },
  {
    title: "Make decisions", time: "8 min", label: "CHOOSE A PATH",
    description: "Programs become useful when they can react to different situations. An if statement runs code only when its condition is true.",
    concept: "A condition ends with a colon. Indent the lines that belong to it. Use else for what should happen when the condition is false.",
    code: 'score = 82\nif score >= 70:\n    print("You passed!")\nelse:\n    print("Keep practicing!")',
    output: "You passed!",
    takeaway: "Python uses indentation to group code. The four spaces before print() are part of the syntax.",
    question: "What will this print when score is 60?",
    options: ["You passed!", "Keep practicing!", "60", "Nothing"],
    correct: 1, explanation: "60 is less than 70, so the condition is false and Python runs the else block."
  },
  {
    title: "Loops", time: "8 min", label: "DO IT AGAIN",
    description: "A loop repeats an action. A for loop is perfect when you know what sequence of values you want to work through.",
    concept: "range(1, 4) produces 1, 2, and 3. The ending number is excluded. The indented code runs once for each number.",
    code: 'for number in range(1, 4):\n    print(f"Round {number}")',
    output: "Round 1\nRound 2\nRound 3",
    takeaway: "Change 4 to 6 and see how many rounds appear. The loop stops before the ending number.",
    question: "How many times does range(1, 4) repeat the loop?",
    options: ["2 times", "3 times", "4 times", "Forever"],
    correct: 1, explanation: "The values are 1, 2, and 3. Python stops before 4."
  },
  {
    title: "Functions", time: "9 min", label: "REUSE YOUR IDEA",
    description: "When you need the same action more than once, give it a name. Functions help keep your code organized and easy to change.",
    concept: "Define a function with def. A parameter is an input the function can use. Call the function by writing its name with parentheses.",
    code: 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Ari"))\nprint(greet("Sam"))',
    output: "Hello, Ari!\nHello, Sam!",
    takeaway: "return gives a value back to the caller. print() then displays that returned value.",
    question: "What is name in def greet(name):?",
    options: ["A loop", "A parameter", "A class", "An error"],
    correct: 1, explanation: "name is a parameter: an input that the function receives when it is called."
  },
  {
    title: "Classes & objects", time: "12 min", label: "BUILD YOUR OWN TYPE",
    description: "A class is a blueprint for making related objects. Each object can hold its own data and use the actions defined by the class.",
    concept: "__init__ sets up a new object. self refers to that object. An attribute like self.name belongs to each individual instance.",
    code: 'class Pet:\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        return f"Hi, I am {self.name}!"\n\npet = Pet("Pixel")\nprint(pet.greet())',
    output: "Hi, I am Pixel!",
    takeaway: "Pet is the class; pet is one object created from it. Try making another Pet with a different name.",
    question: 'In pet = Pet("Pixel"), what is pet?',
    options: ["A class definition", "An object made from Pet", "A loop variable", "A Python keyword"],
    correct: 1, explanation: "Calling Pet('Pixel') creates an object (an instance) of the Pet class and stores it in pet."
  }
];

const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const storageKey = "python-studio-progress-v1";
let completed = [];
let selected = 0;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
  if (Array.isArray(saved.completed)) completed = saved.completed.filter(n => Number.isInteger(n) && n >= 0 && n < lessons.length);
  if (Number.isInteger(saved.selected) && saved.selected >= 0 && saved.selected < lessons.length) selected = saved.selected;
} catch (_) {}
let quizIndex = selected;
let answered = false;

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify({ completed, selected })); } catch (_) {}
}
function renderProgress() {
  const count = completed.length;
  $("#progress-label").textContent = count + " / " + lessons.length + " lessons";
  $("#progress-fill").style.width = (count / lessons.length * 100) + "%";
  $("#progress-bar").setAttribute("aria-valuenow", count);
}
function renderLessonList() {
  $("#lesson-list").innerHTML = lessons.map((lesson, index) => `
    <button class="lesson-item ${index === selected ? "active" : ""}" type="button" data-lesson="${index}" ${index === selected ? 'aria-current="step"' : ""}>
      <span class="lesson-num">${String(index + 1).padStart(2, "0")}</span>
      <span class="lesson-name">${escapeHtml(lesson.title)}</span>
      <span class="lesson-check" aria-label="${completed.includes(index) ? "Completed" : ""}">${completed.includes(index) ? "✓" : "›"}</span>
    </button>`).join("");
  document.querySelectorAll("[data-lesson]").forEach(button => button.addEventListener("click", () => selectLesson(Number(button.dataset.lesson), true)));
}
function renderLesson() {
  const lesson = lessons[selected];
  $("#lesson-panel").innerHTML = `
    <div class="lesson-topline"><span>LESSON ${String(selected + 1).padStart(2, "0")} / ${String(lessons.length).padStart(2, "0")} · ${escapeHtml(lesson.label)}</span><span class="lesson-time">◷ ${escapeHtml(lesson.time)}</span></div>
    <h3>${escapeHtml(lesson.title)}<span class="accent-period">.</span></h3>
    <p class="lesson-description">${escapeHtml(lesson.description)}</p>
    <div class="concept-box"><strong>THE IDEA</strong>${escapeHtml(lesson.concept)}</div>
    <div class="code-card"><div class="code-card-head"><span>EXAMPLE.PY</span><button type="button" id="copy-code">Copy code</button></div><pre><code>${escapeHtml(lesson.code)}</code></pre><div class="code-card-foot"><span>OUTPUT ›</span>${escapeHtml(lesson.output)}</div></div>
    <div class="takeaway"><span aria-hidden="true">✦</span><div><strong>Try this</strong>${escapeHtml(lesson.takeaway)}</div></div>
    <div class="lesson-actions"><button type="button" class="mark-button ${completed.includes(selected) ? "done" : ""}" id="mark-complete">${completed.includes(selected) ? "✓ Lesson completed" : "Mark lesson complete"}</button><button type="button" class="next-button" id="try-example">Try example in playground ↗</button></div>`;
  $("#mark-complete").addEventListener("click", () => {
    if (!completed.includes(selected)) completed.push(selected);
    completed.sort((a,b) => a-b);
    save(); renderProgress(); renderLessonList(); renderLesson();
  });
  $("#try-example").addEventListener("click", () => {
    $("#code-editor").value = lesson.code;
    $("#playground").scrollIntoView({ behavior: "smooth" });
    $("#code-editor").focus({ preventScroll: true });
  });
  $("#copy-code").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(lesson.code);
      $("#copy-code").textContent = "Copied!";
      setTimeout(() => { if ($("#copy-code")) $("#copy-code").textContent = "Copy code"; }, 1800);
    } catch (_) { $("#copy-code").textContent = "Copy unavailable"; }
  });
}
function selectLesson(index, scroll) {
  selected = index;
  quizIndex = index;
  answered = false;
  save();
  renderLessonList(); renderLesson(); renderQuiz();
  if (scroll) $("#lesson-panel").scrollIntoView({ behavior: "smooth", block: "start" });
}
function renderQuiz() {
  const lesson = lessons[quizIndex];
  answered = false;
  $("#quiz-card").innerHTML = `
    <div class="quiz-top"><span>QUICK CHECK · LESSON ${String(quizIndex + 1).padStart(2, "0")}</span><span>01 QUESTION</span></div>
    <h3>${escapeHtml(lesson.question)}</h3>
    <div class="quiz-options">${lesson.options.map((option, index) => `<button class="quiz-option" type="button" data-answer="${index}"><span class="option-letter">${"ABCD"[index]}</span><span>${escapeHtml(option)}</span></button>`).join("")}</div>
    <div class="quiz-feedback" id="quiz-feedback" role="status">Choose the answer that makes the most sense to you.</div>
    <div class="quiz-footer"><span class="quiz-dots" aria-label="Question ${quizIndex + 1} of ${lessons.length}">${lessons.map((_, i) => `<i class="${i === quizIndex ? "active" : ""}"></i>`).join("")}</span><button type="button" class="quiz-next" id="quiz-next">${quizIndex === lessons.length - 1 ? "Back to first question" : "Next question"} →</button></div>`;
  document.querySelectorAll("[data-answer]").forEach(button => button.addEventListener("click", () => {
    if (answered) return;
    answered = true;
    const answer = Number(button.dataset.answer);
    const correct = answer === lesson.correct;
    document.querySelectorAll("[data-answer]").forEach(option => {
      option.disabled = true;
      if (Number(option.dataset.answer) === lesson.correct) option.classList.add("correct");
      else if (Number(option.dataset.answer) === answer) option.classList.add("incorrect");
    });
    const feedback = $("#quiz-feedback");
    feedback.className = "quiz-feedback" + (correct ? "" : " wrong");
    feedback.textContent = (correct ? "Exactly. " : "Good try. ") + lesson.explanation;
  }));
  $("#quiz-next").addEventListener("click", () => { quizIndex = (quizIndex + 1) % lessons.length; renderQuiz(); });
}
renderProgress(); renderLessonList(); renderLesson(); renderQuiz();

let worker = null;
let runTimer = null;
let running = false;
function resetWorker() { if (worker) worker.terminate(); worker = null; }
function finishRun(output, isError = false) {
  clearTimeout(runTimer);
  running = false;
  $("#run-button").disabled = false;
  $("#run-button").innerHTML = 'Run code <span aria-hidden="true">▶</span>';
  $("#run-status").textContent = isError ? "Check the console for details" : "Finished";
  $("#code-output").textContent = output || "(No output. Add print() to display a value.)";
  $("#code-output").style.color = isError ? "#ffbaa8" : "#d0eda7";
}
$("#run-button").addEventListener("click", () => {
  if (running) return;
  const code = $("#code-editor").value;
  running = true;
  $("#run-button").disabled = true;
  $("#run-button").textContent = "Running…";
  $("#run-status").textContent = worker ? "Running Python…" : "Loading Python for the first time…";
  $("#code-output").textContent = "Working…";
  $("#code-output").style.color = "#d0eda7";
  try {
    if (!worker) {
      worker = new Worker("runner.js", { type: "module" });
      worker.onmessage = event => {
        if (event.data.type === "result") finishRun(event.data.output, event.data.error);
        if (event.data.type === "loading") $("#run-status").textContent = "Loading Python runtime…";
      };
      worker.onerror = () => { resetWorker(); finishRun("Python could not load. Check your connection and try again.", true); };
    }
    worker.postMessage({ type: "run", code });
    runTimer = setTimeout(() => { resetWorker(); finishRun("This run took too long and was stopped. Check for an endless loop, then try again.", true); }, 30000);
  } catch (_) {
    resetWorker(); finishRun("The browser could not start Python here. Try another browser or check its settings.", true);
  }
});
$("#clear-output").addEventListener("click", () => {
  $("#code-output").textContent = "Your result will appear here.";
  $("#code-output").style.color = "#d0eda7";
});
