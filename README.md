# Saga Merk

Draw clearer feedback directly on a web page. Saga Merk is a self-contained bookmarklet with guides, arrows, editable text, and an adjustable grid. Annotate a page, hide the toolbar, and take a screenshot to share your feedback.

No install dependencies, account, server, or external requests.

## Install

1. Visit https://saga-merk.bjornar.dev, or download this repository and open `index.html` in your regular browser.
2. Drag **✎ Saga Merk** to your bookmarks bar.
3. Visit a page and click the bookmark.

Alternatively, create a bookmark and paste the contents of `dist/saga-merk-bookmarklet.txt` into its URL field. To update, replace your existing bookmark with a newly built one.

The installer includes a demo. GitHub's file preview does not execute the installer; open the downloaded HTML file in your browser.

## Tools

| Key | Tool | Use |
| --- | --- | --- |
| 1 | Select | Select and move existing marks |
| 2 | Vertical | Click or drag a full-height guide |
| 3 | Horizontal | Click or drag a full-width guide |
| 4 | Circle | Drag an ellipse; hold Shift for a circle |
| 5 | Arrow | Drag an arrow; hold Shift to snap its direction |
| 6 | Text | Click to type; drag a box to move, double-click to edit |
| 7 | Browse | Interact with the underlying page |
| 8 | Counter | Click or drag to place the next number |
| 9 | Edit page | Click existing page text to edit its content, color, and size |

- Drag the **SAGA MERK** header to move the frosted-glass toolbar.
- **Counter** starts at 1 and continues after the highest remaining number. Undo reuses the removed number; Clear restarts at 1.
- **Text size** sets the size for new text and counters and resizes a selected text or counter annotation.
- Pick red, green, blue, or a custom color. A selected mark adopts color changes.
- **Edit page** makes clicked page text editable. The style controls apply to that text while editing, including when you focus the toolbar. Click elsewhere to finish. Existing form fields and editors keep their normal behavior; use Browse to follow links.
- Page edits are a temporary local preview. Switching tools or hiding the toolbar keeps them visible. **Undo** reverts edits; **Clear** or closing Saga Merk restores the original page text and styles. Refreshing also discards edits.
- **H** hides the toolbar and enters Browse mode. Press H again to restore your previous tool.
- **Escape** asks before closing and discarding annotations. The close button and reopening the bookmark also ask.
- **Delete/Backspace** removes a selected mark. **Cmd/Ctrl+Z** undoes annotation changes outside Browse mode. While typing in an annotation or page text, the browser handles text undo; the toolbar’s Undo button reverts the completed edit.
- Tool and hide shortcuts do not interrupt typing in input fields.

### Grid

Default spacing: **32 px**. Options: 8, 16, 24, 32, 64, and 128 px.

Horizontal and vertical margins both start at **32 px**. Adjustments show live grid width and height, which fade after a pause.

- Arrow keys: 8 px steps.
- Shift + arrow keys: 1 px steps.
- Cmd + arrow keys: next/previous preset in 8, 16, 32, 64, 128, 256, 512, 1024.

The grid is a visual reference; it does not snap annotations.

## Develop

Requires Node.js 18 or newer. No package installation is needed.

```sh
npm run check
```

Edit `src/saga-merk.js` for the overlay and `src/installer.html` for installation instructions. Run `npm run build` to regenerate `index.html` and `dist/`. Commit generated files so the download works immediately.

Tests exercise interaction logic using a small DOM substitute: drawing, movement, editable text, page editing and restoration, history, grid settings, shortcuts, toolbar positioning, and cleanup. They do not verify browser rendering or native number-input behavior. Use the installer demo for visual testing.

## Limitations

Page editing works on regular HTML text in the current document; text inside iframes, closed shadow roots, and canvas is not supported. Sites that redraw their content may overwrite local edits.

Annotations are temporary and fixed to the viewport. Refreshing or closing clears them. Browser-internal pages, some PDF viewers, and sites with restrictive security policies may block bookmarklets. Browser bookmark storage and synchronization limits vary.

Saga Merk does not capture screenshots or send page content anywhere; use your normal screenshot tool.

## Website design

The installer shares the blackletter typography, terminal-inspired layout and floral ASCII header artwork of [bjornar.dev](https://bjornar.dev), reused with the owner’s permission. Fonts and header images are served locally from `assets/`. The website supports dark/light themes and respects reduced motion. Website assets are separate from the self-contained bookmarklet.
