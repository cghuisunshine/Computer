# Data structure animation companion

Open `data_structure_animations.html` in a browser. The file includes its styles,
scripts, section introductions, and animation data; it works offline without a
server or package installation.

The companion covers 230 numbered sections and 22 chapter overviews, along with
front matter and references. Exercise sections contain representative examples.
Playback supports stepping, replay, speed adjustment, editable examples where
applicable, and reduced-motion preferences.

The PDF link uses `data_structure.pdf`, which is included in the repository.
The extracted-text links use the separately generated `data_structure_extracted.html`.

Rebuild from the repository root with Python 3:

```sh
python3 tools/build_book_animations.py
```

The builder uses the extracted reader's contents when that reader is present.
Otherwise it uses `tools/book_animation_contents.json`, so the animation
companion can be rebuilt in a fresh checkout.

Run the checks with Node.js:

```sh
node --test data_structure_animations.test.js
```
