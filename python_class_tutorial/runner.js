import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.mjs";

let runtimePromise;

self.onmessage = async (event) => {
  if (event.data?.type !== "run") return;
  try {
    if (!runtimePromise) {
      self.postMessage({ type: "loading" });
      runtimePromise = loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/" });
    }
    const pyodide = await runtimePromise;
    const lines = [];
    pyodide.setStdout({ batched: (line) => lines.push(line) });
    pyodide.setStderr({ batched: (line) => lines.push(line) });
    const makeDict = pyodide.globals.get("dict");
    const globals = makeDict();
    try {
      const result = await pyodide.runPythonAsync(event.data.code, { globals });
      if (result !== undefined && result !== null) lines.push(String(result));
      self.postMessage({ type: "result", output: lines.join("\n").slice(0, 20000), error: false });
    } catch (error) {
      lines.push(error?.message || String(error));
      self.postMessage({ type: "result", output: lines.join("\n").slice(0, 20000), error: true });
    } finally {
      globals.destroy();
    }
  } catch (error) {
    runtimePromise = null;
    self.postMessage({ type: "result", output: "Python could not load. Check your connection and try again.\n" + (error?.message || ""), error: true });
  }
};
