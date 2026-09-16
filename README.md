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
| 1 | Select | Select marks or page elements; use floating controls to move, edit text, or delete page elements |
| 2 | Counter | Click or drag to place the next number |
| 3 | Text | Click to type; drag a box to move, double-click to edit |
| 4 | Horizontal | Click or drag a full-width guide; Alt/Option adds a mirrored guide |
| 5 | Vertical | Click or drag a full-height guide; Alt/Option adds a mirrored guide |
| 6 | Arrow | Drag an arrow; hold Shift to snap its direction |
| 7 | Rectangle | Drag a rectangle; Shift for a square; Alt/Option to draw from the center |
| 8 | Circle | Drag an ellipse; Shift for a circle; Alt/Option to draw from the center |
| 9 | Browse | Interact with the underlying page |

- The website link at the bottom of the toolbar opens the installer in a new tab.
- The toolbar opens in the bottom-right corner. Drag the **SAGA MERK** header to move it.
- **Counter** starts at 1. Hold **Shift** for a filled circle in the selected color with a white number. Hold **Option/Alt** for sub-counters (1.1, 1.2, …); a normal click advances to the next main number. Shift and Option/Alt combine. Sub-counters use the highest remaining group; without a previous counter, they start at 1.1. Undo reuses the removed number; Clear restarts at 1.
- **Option/Alt** draws circles and rectangles outward from the initial click. Add **Shift** for a centered circle or square.
- Mirrored guides stay linked at equal offsets from opposite viewport edges. Drag either guide to move the pair; color, width, delete, and undo apply to both.
- **Text size** defaults to **24 px**, with options of 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64, 72, and 96 px. It sets the size for new text and counters and resizes a selected text or counter annotation.
- Pick red, green, blue, or a custom color. A selected mark adopts color changes.
- **Select** outlines page elements without changing their layout. Floating Move/Edit text/Delete controls appear above, below, or beside the selection. Drag the handle (or use its Alt + arrow keys: 10 px, Shift for 1 px). Moving or deleting leaves an invisible, inert copy in the original slot so surrounding content stays in place. The real element moves into the overlay, retaining its DOM identity. Undo, Clear, and closing restore it; hiding the toolbar keeps the preview.
- With **Select**, hold **Option/Alt** and drag an element to move it directly, or **Shift-click** to edit its text. Option/Alt takes precedence when both are held.
- **Edit text** appears when the selected page element contains editable text. Bare labels beside icons are edited separately, preserving the icons. It follows text-only wrappers to the actual text; for a container with several text blocks, it starts with the first eligible block. Click **Done** or elsewhere to finish. The style controls apply to that text while editing, including when you focus the toolbar. Existing form fields and editors keep their normal behavior; use Browse to follow links.
- Page edits are a temporary local preview. Switching tools or hiding the toolbar keeps them visible. **Undo** reverts edits; **Clear** or closing Saga Merk restores the original page text and styles. Refreshing also discards edits.
- **H** hides the toolbar and enters Browse mode. Press H again to restore your previous tool.
- **Escape** asks before closing and discarding annotations. The close button and reopening the bookmark also ask.
- **Delete/Backspace** removes a selected mark. **Cmd/Ctrl+Z** undoes annotation changes outside Browse mode. While typing in an annotation or page text, the browser handles text undo; the toolbar’s Undo button reverts the completed edit.
- Tool and hide shortcuts do not interrupt typing in input fields.

### Grid

Default spacing: **32 px**. Options: 8, 16, 24, 32, 64, and 128 px.

Horizontal and vertical margins both start at **16 px**. Adjustments show live grid width and height, which fade after a pause.

- Arrow keys: 8 px steps.
- Shift + arrow keys: 1 px steps.
- Option/Alt + arrow keys: next/previous preset in 8, 16, 32, 64, 128, 256, 512, 1024.

The grid is a visual reference; it does not snap annotations.

## Develop

Requires Node.js 18 or newer. No package installation is needed.

```sh
npm ci
npm run check
```

Edit `src/saga-merk.js` for the overlay and `src/installer.html` for installation instructions. Run `npm run build` to regenerate `index.html` and `dist/`. Commit generated files so the download works immediately.

Tests exercise interaction logic using a small DOM substitute: drawing, movement, editable text, page editing, element movement and restoration, history, grid settings, shortcuts, toolbar positioning, and cleanup. They do not verify browser rendering or native number-input behavior. Use the installer demo for visual testing. `tests/fixtures/page-elements.html` provides flex, grid, inline, and collapsed-margin cases for checking page-element movement in a browser.

## Limitations

Page editing works on regular HTML text in the current document; text inside iframes, closed shadow roots, and canvas is not supported. Sites that redraw their content may overwrite local edits. Moved elements are a fixed-viewport preview with captured styling. Complex transforms, iframe contents, closed shadow roots, and site scripts that depend on the original DOM location may not behave identically after moving.

Annotations are temporary and fixed to the viewport. Refreshing or closing clears them. Browser-internal pages, some PDF viewers, and sites with restrictive security policies may block bookmarklets. Browser bookmark storage and synchronization limits vary.

Saga Merk does not capture screenshots or send page content anywhere; use your normal screenshot tool.

## Website design

The installer shares the blackletter typography, terminal-inspired layout and floral ASCII header artwork of [bjornar.dev](https://bjornar.dev), reused with the owner’s permission. Fonts and header images are served locally from `assets/`. The website supports dark/light themes and respects reduced motion. Website assets are separate from the self-contained bookmarklet.

The build keeps the self-contained bookmarklet URL below Firefox’s 65,536-character bookmark limit and checks that the installer link and manual-install code decode to the exact shipped runtime. URL-safe punctuation stays literal to avoid unnecessary size growth.

## Element inspection and navigation

With Select active, Left selects the previous visible sibling, or the parent if there is no previous sibling. Right enters a wrapper’s first visible child, then advances through siblings and outward to the next element. Text labels and controls stay single navigation stops. Hidden/decorative elements are skipped; moved elements retain their original place in this navigation order.

Up/Down increases/decreases the selected element’s z-index. Static elements become relatively positioned without leaving layout. Layers operate within CSS stacking contexts; moved elements are layered within the floating overlay. Inputs and active text editing keep normal arrow-key behavior. Alt + arrows on the Move handle moves by 10 px; Shift makes that 1 px.

The Element CSS panel shows computed background, text and border colors, text alignment, padding and z-index. Color fields accept CSS colors (including transparent); padding accepts CSS shorthand with units. Changes apply on Enter or blur and support Undo, Clear and close restoration. Border color only appears when the element has a visible border.

## Standalone and Evergreen

- **Standalone** includes the full tool, works without downloading code, and stays on the installed version. Replace the bookmark to update.
- **Evergreen** downloads the latest release from `https://saga-merk.bjornar.dev/dist/saga-merk.js` each time you open it. If offline, blocked by the page, or unable to load within 3 seconds, it starts its bundled snapshot automatically. It chooses a version before you start editing, and never replaces an active session. Replace the bookmark to refresh its fallback snapshot. Both versions offer the same tools and keep page edits local.

The build uses pinned Terser to minify the runtime; interaction tests run against both source and the shipped code. Install build dependencies with `npm ci`. CI also enforces the Firefox bookmark URL limit.
