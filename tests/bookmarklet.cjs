const fs = require('node:fs');
const assert = require('node:assert/strict');
const source = fs.readFileSync('dist/saga-merk.js', 'utf8');
const bookmarklet = fs.readFileSync('dist/saga-merk-bookmarklet.txt', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const entities = {amp:'&', quot:'"', '#x27':"'", lt:'<', gt:'>'};
const decodeHTML = text => text.replace(/&(amp|quot|#x27|lt|gt);/g, (_, key) => entities[key]);
const link = html.match(/href="(javascript:[^"]+)"/)[1];
const manual = html.match(/<textarea[^>]*aria-label="Bookmarklet code"[^>]*>(.*?)<\/textarea>/s)[1];
assert.equal(decodeHTML(link), bookmarklet, 'Dragging must save the exact bookmarklet, including dollar sequences');
assert.equal(decodeHTML(manual), bookmarklet, 'Manual install must use the same payload');
assert.equal(decodeURIComponent(bookmarklet.slice(11)), source);
assert.equal(new URL(bookmarklet).hash, '');
assert(bookmarklet.length <= 65536, 'Firefox bookmark URL limit');
console.log(`PASS: installer link/manual URL round-trip and Firefox size limit (${bookmarklet.length}/65536).`);

const evergreen=fs.readFileSync('dist/saga-merk-evergreen.txt','utf8');
assert.equal(decodeHTML(html.match(/<textarea[^>]*aria-label="Evergreen bookmarklet code"[^>]*>(.*?)<\/textarea>/s)[1]),evergreen);
assert(evergreen.length<=65536);
