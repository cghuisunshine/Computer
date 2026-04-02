const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadTutorHtml() {
  const htmlPath = path.join(__dirname, "python_practice_tutor.html");
  return fs.readFileSync(htmlPath, "utf8");
}

function loadTutorScript() {
  const html = loadTutorHtml();
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  const source = scripts.at(-1)?.[1];
  assert.ok(source, "Expected an inline application script in the tutor HTML.");

  const elements = new Map();
  const storage = new Map();

  function makeElement() {
    const attributes = new Map();
    return {
      textContent: "",
      innerHTML: "",
      value: "",
      disabled: false,
      checked: false,
      hidden: false,
      style: {},
      className: "",
      dataset: {},
      focus() {},
      select() {},
      addEventListener() {},
      setAttribute(name, value) { attributes.set(String(name), String(value)); },
      getAttribute(name) { return attributes.has(String(name)) ? attributes.get(String(name)) : null; },
      contains() { return false; },
      closest() { return null; },
      classList: {
        add() {},
        remove() {},
        toggle() {},
      },
    };
  }

  const context = {
    console,
    setTimeout,
    clearTimeout,
    AbortController,
    URL,
    Math,
    JSON,
    Promise,
    Node: { TEXT_NODE: 3, ELEMENT_NODE: 1 },
    fetch: async () => ({ ok: true, text: async () => "", json: async () => ({}) }),
    loadPyodide: async () => ({
      runPythonAsync: async () => JSON.stringify({ stdout: "", error: null, globals: {} }),
    }),
    localStorage: {
      getItem(key) { return storage.has(key) ? storage.get(key) : null; },
      setItem(key, value) { storage.set(key, String(value)); },
      removeItem(key) { storage.delete(key); },
    },
    navigator: {
      clipboard: {
        writeText: async () => {},
      },
    },
    document: {
      getElementById(id) {
        if (!elements.has(id)) {
          elements.set(id, makeElement());
        }
        return elements.get(id);
      },
      addEventListener() {},
      querySelector() { return null; },
    },
    window: {
      getSelection() {
        return {
          toString() {
            return "";
          },
          anchorNode: null,
        };
      },
    },
    location: {
      href: "https://cghuisunshine.github.io/Computer/python_practice_tutor.html",
      origin: "https://cghuisunshine.github.io",
      hostname: "cghuisunshine.github.io",
      pathname: "/Computer/python_practice_tutor.html",
    },
  };

  context.window.document = context.document;
  context.window.location = context.location;
  context.window.navigator = context.navigator;
  context.window.localStorage = context.localStorage;
  context.window.AbortController = context.AbortController;
  context.window.URL = context.URL;
  context.window.Math = Math;
  context.window.JSON = JSON;
  context.window.Promise = Promise;
  context.window.setTimeout = setTimeout;
  context.window.clearTimeout = clearTimeout;
  context.window.fetch = context.fetch;
  context.window.loadPyodide = context.loadPyodide;
  context.globalThis = context;
  context.__elements = elements;

  vm.createContext(context);
  vm.runInContext(source, context);
  return context;
}

test("tutor page renders an Ask Tutor panel in the sidebar", () => {
  const html = loadTutorHtml();

  assert.match(html, /Ask Tutor/);
  assert.match(html, /id="askInput"/);
  assert.match(html, /id="askBtn"/);
  assert.match(html, /id="askAnswerBox"/);
});

test("buildAskPrompt follows the extension style of page-grounded answers", () => {
  const context = loadTutorScript();
  assert.equal(typeof context.buildAskPrompt, "function");

  const prompt = context.buildAskPrompt("Question title: Build a list", "Why is append used here?");

  assert.match(prompt, /Prefer using the provided Page Context/i);
  assert.match(prompt, /General knowledge \(not from this page\)/i);
  assert.match(prompt, /Page Context:\s*Question title: Build a list/i);
  assert.match(prompt, /Question:\s*Why is append used here\?/i);
});

test("buildTutorAskContext includes the current question, code, output, answer, and grading feedback", () => {
  const context = loadTutorScript();
  assert.equal(typeof context.buildTutorAskContext, "function");

  const result = context.buildTutorAskContext({
    question: {
      title: "Append to a list",
      prompt: "Create pets and append hamster.",
      starter: "pets = ['cat', 'dog']",
      answer: "pets = ['cat', 'dog']\npets.append('hamster')\nprint(pets)",
      hint: "Use append.",
    },
    studentCode: "pets = ['cat', 'dog']\npets.append('hamster')",
    runResult: {
      stdout: "['cat', 'dog', 'hamster']",
      error: null,
    },
    aiFeedbackText: "Why: The code appends hamster.\n\nNext Step: Print the list.",
  });

  assert.match(result, /Question title: Append to a list/);
  assert.match(result, /Task: Create pets and append hamster\./);
  assert.match(result, /Starter code:/);
  assert.match(result, /Student code:/);
  assert.match(result, /Program output:\s*\['cat', 'dog', 'hamster'\]/);
  assert.match(result, /Reference solution:/);
  assert.match(result, /Latest AI feedback:/);
});

test("getAskContext narrows the request when the ask text is the current selection", () => {
  const context = loadTutorScript();
  assert.equal(typeof context.getAskContext, "function");

  const askContext = context.getAskContext({
    question: {
      title: "Loop through a list",
      prompt: "Print each number on its own line.",
      starter: "nums = [2, 4, 6]",
      answer: "for n in nums:\n    print(n)",
      hint: "Use a for loop.",
    },
    studentCode: "nums = [2, 4, 6]\nfor n in nums:\n    print(n)",
    runResult: {
      stdout: "2\n4\n6",
      error: null,
    },
    aiFeedbackText: "Verdict: correct",
    askText: "print each number",
    selectionText: "print each number",
  });

  assert.match(askContext, /Selected focus:/);
  assert.match(askContext, /print each number/i);
});

test("ask tutor uses a launcher plus popup panel that can be opened and closed", () => {
  const html = loadTutorHtml();

  assert.match(html, /id="askLauncherBtn"/);
  assert.match(html, /id="askPopup"/);
  assert.match(html, /id="askPopupCloseBtn"/);
  assert.match(html, /Open Ask Tutor/);

  const context = loadTutorScript();
  assert.equal(typeof context.setAskPopupOpen, "function");

  context.setAskPopupOpen(true);
  assert.equal(context.__elements.get("askPopup").hidden, false);
  assert.equal(context.__elements.get("askLauncherBtn").hidden, true);

  context.setAskPopupOpen(false);
  assert.equal(context.__elements.get("askPopup").hidden, true);
  assert.equal(context.__elements.get("askLauncherBtn").hidden, false);
});

test("ask tutor includes an auto-open toggle that updates its label", () => {
  const html = loadTutorHtml();

  assert.match(html, /id="askAutoOpenToggle"/);
  assert.match(html, /Auto-open:/);

  const context = loadTutorScript();
  assert.equal(typeof context.setSelectionAutoOpenEnabled, "function");
  assert.equal(context.__elements.get("askAutoOpenToggle").textContent, "Auto-open: Off");

  context.setSelectionAutoOpenEnabled(true);
  assert.equal(context.__elements.get("askAutoOpenToggle").textContent, "Auto-open: On");

  context.setSelectionAutoOpenEnabled(false);
  assert.equal(context.__elements.get("askAutoOpenToggle").textContent, "Auto-open: Off");
});
