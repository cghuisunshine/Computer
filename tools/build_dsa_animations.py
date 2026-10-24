#!/usr/bin/env python3
"""Rebuild the tutorial's offline animations from real Python execution.

Run from any directory: python3 tools/build_dsa_animations.py
Only the trusted, checked-in tutorial examples are executed. No packages needed.
"""
import ast
import contextlib
import io
import json
import math
from pathlib import Path
import re
import sys
import types
from collections import deque

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / 'data_structures_algorithms_python_tutorial.html'


def trace_example(code, definitions, number):
    filename = f'<dsa-example-{number}>'
    namespace = {'__name__': '__tutorial__'}
    for definition in definitions:
        exec(compile(definition, '<dsa-setup>', 'exec'), namespace)
    output = io.StringIO()
    frames = []
    identities = {}  # Retain objects so Python cannot reuse their ids mid-trace.

    def visible(value):
        return not isinstance(value, (types.FunctionType, types.ModuleType, type,
                                      types.BuiltinFunctionType))

    def snapshot(frame, event, result=None):
        objects = {}

        def encode(value):
            if value is None or isinstance(value, (str, bool, int)):
                return value
            if isinstance(value, float):
                return value if math.isfinite(value) else {'literal': repr(value)}
            address = id(value)
            if address not in identities:
                identities[address] = (f'o{len(identities) + 1}', value)
            key = identities[address][0]
            if key not in objects:
                item = {'id': key, 'type': type(value).__name__}
                objects[key] = item
                if isinstance(value, dict):
                    item['entries'] = [[encode(k), encode(v)] for k, v in value.items()]
                elif isinstance(value, (list, tuple, deque, set)):
                    values = sorted(value, key=repr) if isinstance(value, set) else value
                    item['items'] = [encode(v) for v in values]
                elif hasattr(value, '__dict__'):
                    item['fields'] = {k: encode(v) for k, v in vars(value).items() if visible(v)}
                else:
                    item['text'] = repr(value)
            return {'ref': key}

        def variables(mapping):
            return {k: encode(v) for k, v in mapping.items()
                    if not k.startswith('__') and visible(v)}

        stack = []
        current = frame
        while current:
            if current.f_code.co_filename == filename:
                stack.append({'name': current.f_code.co_name,
                              'line': current.f_lineno,
                              'vars': variables(current.f_locals)})
            current = current.f_back
        entry = {'line': frame.f_lineno, 'event': event,
                 'stack': stack[::-1], 'globals': variables(namespace),
                 'objects': objects, 'output': output.getvalue()}
        if event == 'return':
            entry['result'] = encode(result)
        frames.append(entry)

    def tracer(frame, event, arg):
        if frame.f_code.co_filename == filename:
            if event in ('line', 'return'):
                snapshot(frame, event, arg)
            return tracer
        return None

    with contextlib.redirect_stdout(output):
        try:
            sys.settrace(tracer)
            exec(compile(code, filename, 'exec'), namespace)
        finally:
            sys.settrace(None)
    frames[-1]['event'] = 'done'
    frames[-1]['output'] = output.getvalue()
    return {'code': code, 'frames': frames, 'output': output.getvalue()}


def replace_generated(html, name, content):
    start, end = f'<!-- DSA {name} START -->', f'<!-- DSA {name} END -->'
    block = f'{start}\n{content}\n{end}'
    if start in html:
        return re.sub(re.escape(start) + r'[\s\S]*?' + re.escape(end), lambda _: block, html)
    return html.replace('</body>', block + '\n</body>')


def main():
    html = PAGE.read_text()
    structure = json.loads(re.search(r'id="studyPageStructure">(.*?)</script>', html, re.S)[1])
    hero = '# A structure for every problem\nplaylist = ["intro", "chapter 1"]\nscores = {"Ada": 95, "Lin": 88}\nvisited = {"A", "B", "C"}\n\n# A strategy for every next step\nfor topic in playlist:\n    print(topic)'
    snippets = [{'title': 'A structure for every problem', 'code': hero}] + structure['snippets']
    definitions = []
    traces = []
    for i, snippet in enumerate(snippets):
        traces.append({'title': snippet['title'], **trace_example(snippet['code'], definitions, i)})
        tree = ast.parse(snippet['code'])
        for node in tree.body:
            if isinstance(node, (ast.FunctionDef, ast.ClassDef, ast.Import, ast.ImportFrom)):
                definitions.append(ast.Module(body=[node], type_ignores=[]))
    payload = json.dumps(traces, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')
    html = replace_generated(html, 'ANIMATIONS',
        '<style>\n' + (ROOT / 'tools/dsa_animations.css').read_text() + '\n</style>\n'
        '<script type="application/json" id="dsa-execution-traces">' + payload + '</script>\n'
        '<script>\n' + (ROOT / 'tools/dsa_animations.js').read_text() + '\n</script>')
    PAGE.write_text(html)
    print(f'Built {len(traces)} animations, {sum(len(t["frames"]) for t in traces)} execution steps; {PAGE.stat().st_size:,} bytes.')


if __name__ == '__main__':
    main()
