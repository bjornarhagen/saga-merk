# Saga Merk

Draw clearer feedback directly on a web page. Saga Merk is a self-contained bookmarklet with guides, arrows, editable text, and an adjustable grid. Annotate a page, hide the toolbar, and take a screenshot to share your feedback.

No install dependencies, account, server, or external requests.

## Install

1. Download this repository and open `index.html` in your regular browser.
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

- Drag the **SAGA MERK** header to move the frosted-glass toolbar.
- Pick red, green, blue, or a custom color. A selected mark adopts color changes.
- **H** hides the toolbar and enters Browse mode. Press H again to restore your previous tool.
- **Escape** asks before closing and discarding annotations. The close button and reopening the bookmark also ask.
- **Delete/Backspace** removes a selected mark. **Cmd/Ctrl+Z** undoes annotation changes outside Browse mode. While editing text, the browser handles text undo.
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

Tests exercise interaction logic using a small DOM substitute: drawing, movement, editable text, history, grid settings, shortcuts, toolbar positioning, and cleanup. They do not verify browser rendering or native number-input behavior. Use the installer demo for visual testing.

## Limitations

Annotations are temporary and fixed to the viewport. Refreshing or closing clears them. Browser-internal pages, some PDF viewers, and sites with restrictive security policies may block bookmarklets. Browser bookmark storage and synchronization limits vary.

Saga Merk does not capture screenshots or send page content anywhere; use your normal screenshot tool.
