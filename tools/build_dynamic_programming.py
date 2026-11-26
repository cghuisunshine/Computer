"""Build the offline lesson with the chapter tutorial skill and embedded assets."""
from pathlib import Path
import argparse
import base64
import html
import json
import runpy

ROOT = Path(__file__).resolve().parent.parent
TOOLS = ROOT / "tools"


def build(generator):
    chapter = runpy.run_path(str(generator))
    meta, sections = chapter["parse_outline"]((ROOT / "docs/dynamic_programming_outline.md").read_text())
    template = (TOOLS / "dynamic_programming_template.html").read_text()
    for method in ("backtracking", "brute", "memo", "table", "rolling"):
        source = (TOOLS / f"dynamic_programming_examples/{method}.py").read_text().rstrip()
        template = template.replace("{{PYTHON_" + method.upper() + "}}", html.escape(source))
        # Keep the highlighted lab and the complete examples on the same source.
        implementation = source.split('\n\n\nif __name__')[0]
        template = template.replace("{{CODE_" + method.upper() + "_JSON}}", json.dumps(implementation))
    for asset in (TOOLS / "dynamic_programming_assets").glob("*.svg"):
        encoded = base64.b64encode(asset.read_bytes()).decode("ascii")
        template = template.replace("{{FIGURE_" + asset.stem.upper() + "}}", "data:image/svg+xml;base64," + encoded)
    page = chapter["render_html"](meta, sections, template)
    if "{{" in page:
        raise ValueError("Unresolved template token")
    output = ROOT / "dynamic_programming_tutorial.html"
    output.write_text(page)
    print(f"Built {output.name}: {len(page.encode()):,} bytes")


if __name__ == "__main__":
    locations = [Path.home() / f"{folder}/skills/chapter-tutorial-html/scripts/generate_chapter_html.py" for folder in (".agents", ".codex")]
    default = next((p for p in locations if p.exists()), locations[0])
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--generator", type=Path, default=default, help="Path to the chapter-tutorial-html generator")
    build(parser.parse_args().generator)
