const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const {minify_sync}=require('terser');
const source = minify_sync(fs.readFileSync(path.join(root, 'src/saga-merk.js'), 'utf8'), {ecma:2020}).code;
const evergreenSource=minify_sync(fs.readFileSync(path.join(root,'src/evergreen.js'),'utf8').replace('/*__BUNDLED__*/',()=>source),{ecma:2020}).code;
const evergreen='javascript:'+encodeURI(evergreenSource).replace(/#/g,'%23');
const template = fs.readFileSync(path.join(root, 'src/installer.html'), 'utf8');
// Keep URL-safe punctuation literal; encoding every punctuation mark needlessly
// exceeded Firefox Places' 65,536-character bookmark URL limit.
// Encode # explicitly so CSS colors cannot become a URL fragment.
const bookmarklet = 'javascript:' + encodeURI(source).replace(/#/g, '%23');
if (evergreen.length > 65536) throw new Error(`Evergreen bookmarklet exceeds Firefox’s URL limit: ${evergreen.length}`);
if (bookmarklet.length > 65536) throw new Error(`Bookmarklet is ${bookmarklet.length} characters; Firefox supports at most 65,536. Reduce the payload before publishing.`);
if (decodeURIComponent(bookmarklet.slice(11)) !== source || new URL(bookmarklet).href !== bookmarklet) throw new Error('Bookmarklet URL does not round-trip safely');
const escape = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const html = template.replaceAll('{{BOOKMARKLET}}', () => escape(bookmarklet)).replaceAll('{{EVERGREEN}}', () => escape(evergreen)).replace('{{SOURCE}}', () => source).replace('{{SITE_SCRIPT}}', () => fs.readFileSync(path.join(root, 'src/site.js'), 'utf8'));
if (html.includes('{{BOOKMARKLET}}') || html.includes('{{EVERGREEN}}') || html.includes('{{SOURCE}}') || html.includes('{{SITE_SCRIPT}}')) throw new Error('Unresolved installer placeholder');
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, 'saga-merk.js'), source);
fs.writeFileSync(path.join(dist,'saga-merk-evergreen.txt'),evergreen);
fs.writeFileSync(path.join(dist, 'saga-merk-bookmarklet.txt'), bookmarklet);
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log(`Built standalone index.html and bookmarklet (${Buffer.byteLength(bookmarklet).toLocaleString()} bytes).`);
