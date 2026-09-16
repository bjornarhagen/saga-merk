const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('src/evergreen.js','utf8').replace('/*__BUNDLED__*/', 'window.fallbacks=(window.fallbacks||0)+1;');
function setup(){const window={},scripts=[],alerts=[];let timeout,cleared=false;
 const document={createElement:()=>({dataset:{},remove(){this.removed=true;}}),documentElement:{append(s){scripts.push(s);}}};
 const context={window,document,setTimeout(fn){timeout=fn;return 1;},clearTimeout(){cleared=true;},alert(msg){alerts.push(msg);}};
 return {window,scripts,alerts,run:()=>vm.runInNewContext(source,context),timeout:()=>timeout(),cleared:()=>cleared};}
let t=setup();t.run();t.run();assert.equal(t.scripts.length,1);assert.equal(t.scripts[0].src,'https://saga-merk.bjornar.dev/dist/saga-merk.js');assert.equal(t.scripts[0].referrerPolicy,'no-referrer');
t.window.__pageMarkerOverlay={requestClose(){t.closed=true;}};t.scripts[0].onload();assert(t.cleared());assert(t.scripts[0].removed);assert(!t.window.__sagaMerkLoading);t.run();assert(t.closed);
for(const event of ['onerror','timeout','onload']){t=setup();t.run();event==='timeout'?t.timeout():t.scripts[0][event]();assert.equal(t.window.fallbacks,1);assert(!t.window.__sagaMerkLoading);t.timeout();assert.equal(t.window.fallbacks,1);t.run();assert.equal(t.scripts.length,2);}
console.log('PASS: Evergreen load, duplicate prevention, close, failure, timeout and retry.');
// A response arriving after fallback must not close or replace the active session.
let touched=false;
vm.runInNewContext(fs.readFileSync('src/saga-merk.js','utf8'),{document:{currentScript:{dataset:{sagaMerkRequest:'expired'}},createElement(){touched=true;}},window:{__pageMarkerOverlay:{requestClose(){touched=true;}}}});
assert.equal(touched,false);
