import {loadPyodide} from 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.mjs';
let runtimePromise;
self.onmessage = async event => {
  if (event.data?.type !== 'run') return;
  const {id, code, tests = []} = event.data;
  let globals;
  const lines = [];
  let length = 0, truncated = false;
  const capture = line => {
    if (length < 20000) {
      const part = line.slice(0, 20000 - length);
      lines.push(part); length += part.length + 1;
    } else if (!truncated) { lines.push('[Further output truncated]'); truncated = true; }
  };
  const errorText = error => error?.message || String(error);
  try {
    if (!runtimePromise) runtimePromise = loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});
    const pyodide = await runtimePromise;
    self.postMessage({type:'ready', id});
    pyodide.setStdout({batched:capture});
    pyodide.setStderr({batched:capture});
    const makeDict = pyodide.globals.get('dict');
    globals = makeDict(); makeDict.destroy();
    globals.set('__name__', '__main__');
    const result = await pyodide.runPythonAsync(code, {globals});
    if (result !== undefined && result !== null) { capture(String(result)); if (typeof result.destroy === 'function') result.destroy(); }
    const checks = [];
    for (const test of tests) {
      try {
        const value = await pyodide.runPythonAsync(test.code, {globals});
        if (value && typeof value.destroy === 'function') value.destroy();
        checks.push({name:test.name, passed:true});
      } catch (error) {
        const detail = errorText(error).trim().split('\n').slice(-2).join('\n');
        checks.push({name:test.name, passed:false, detail});
      }
    }
    self.postMessage({type:'result', id, output:lines.join('\n'), checks, error:false});
  } catch (error) {
    capture(errorText(error));
    self.postMessage({type:'result', id, output:lines.join('\n'), checks:[], error:true});
    if (!globals) runtimePromise = null;
  } finally {
    if (globals) globals.destroy();
  }
};
