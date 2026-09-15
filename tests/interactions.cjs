const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class El {
  constructor(tag='div'){this.tagName=tag;this.dataset={};this.style={};this.attrs={};this.children=[];this.handlers={};this.value='';this.classes=new Set();this.classList={toggle:(k,on)=>{on=on??!this.classes.has(k);on?this.classes.add(k):this.classes.delete(k);return on;},add:k=>this.classes.add(k),remove:k=>this.classes.delete(k),contains:k=>this.classes.has(k)};}
  focus(){this.focused=true;this.emit('focus');}blur(){if(this.focused){this.focused=false;this.emit('blur');}}
  get scrollHeight(){return Math.max(32,(this.value||'').split('\n').length*24);}
  getBoundingClientRect(){return {left:parseFloat(this.style.left)||120,top:parseFloat(this.style.top)||16,width:760,height:200};}
  setAttribute(k,v){this.attrs[k]=String(v);if(k==='data-id')this.dataset.id=String(v);}
  append(...els){this.children.push(...els);els.forEach(el=>el.parent=this);}
  replaceChildren(){this.children=[];}
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);}
  addEventListener(k,fn){(this.handlers[k]??=[]).push(fn);}
  removeEventListener(k,fn){this.handlers[k]=(this.handlers[k]||[]).filter(f=>f!==fn);}
  emit(k,event={}){for(const f of this.handlers[k]||[])f({preventDefault(){},stopPropagation(){},...event});}
  closest(q){return q==='button'&&this.tagName==='button'?this:q==='[data-id]'?(this.dataset.id?this:this.parent?.closest(q)):null;}
  setPointerCapture(id){this.capture=id;}hasPointerCapture(id){return this.capture===id;}releasePointerCapture(){this.capture=null;}
  attachShadow(){root=new El();root.svg=new El('svg');root.texts=new El();root.grid=new El();root.spacing=new El('select');root.spacing.value='32';root.dimensions=new El();root.dimensionWidth=new El();root.dimensionHeight=new El();root.marginX=new El('input');root.marginX.value='32';root.marginY=new El('input');root.marginY.value='32';root.handle=new El('button');root.bar=new El();root.color=new El('input');root.color.value='#ff263f';root.width=new El('select');root.width.value='2';root.buttons=[];for(const mode of ['select','v','h','circle','arrow','text','browse']){let b=new El('button');b.dataset.mode=mode;root.buttons.push(b);}for(const color of ['#ff263f','#16a34a','#2563eb']){let b=new El('button');b.dataset.color=color;root.buttons.push(b);}for(const action of ['grid','undo','delete','clear','hide','close']){let b=new El('button');b.dataset.action=action;root.buttons.push(b);}return root;}
  querySelector(q){return q==='.dimensions'?this.dimensions:q==='.dimension-width'?this.dimensionWidth:q==='.dimension-height'?this.dimensionHeight:q==='.texts'?this.texts:q==='.grid'?this.grid:q==='[data-grid-spacing]'?this.spacing:q==='[data-grid-margin-x]'?this.marginX:q==='[data-grid-margin-y]'?this.marginY:q==='.drag-handle'?this.handle:q==='svg'?this.svg:q==='.bar'?this.bar:q==='input'?this.color:q==='select'?this.width:this.buttons.find(b=>q===`[data-action="${b.dataset.action}"]`);}
  querySelectorAll(q){return this.buttons.filter(b=>q==='[data-mode]'?b.dataset.mode:b.dataset.color);}
}
let root;const document=new El();document.documentElement=new El();document.createElement=t=>new El(t);document.createElementNS=(_,t)=>new El(t);const window=new El();let confirmResult=false;const prompts=[];window.confirm=message=>{prompts.push(message);return confirmResult;};let timerId=0;const timers=new Map();window.setTimeout=fn=>{timers.set(++timerId,fn);return timerId;};window.clearTimeout=id=>timers.delete(id);window.innerWidth=1200;window.innerHeight=800;vm.runInNewContext(fs.readFileSync('src/saga-merk.js','utf8'),{window,document,Element:El});
const svg=root.svg,click=(type,v)=>root.bar.emit('click',{target:root.buttons.find(b=>b.dataset[type]===v)});
const pointer=(event,x,y,target=svg,extra={})=>svg.emit(event,{clientX:x,clientY:y,pointerId:1,button:0,target,...extra});
const ink=i=>svg.children[i].children[0].attrs;
const hit=i=>svg.children[i].children.at(-1);
// Grid defaults, spacing choices, margins, validation and toolbar independence.
assert.equal(root.grid.hidden,true);assert.equal(root.grid.style.inset,'32px 32px');assert.equal(root.grid.style.backgroundSize,'32px 32px');
click('action','grid');assert.equal(root.grid.hidden,false);
for(const spacing of [8,16,24,32,64,128]){root.spacing.value=String(spacing);root.spacing.emit('change');assert.equal(root.grid.style.backgroundSize,`${spacing}px ${spacing}px`);}
root.marginX.value='64';root.marginX.emit('input');assert.equal(root.grid.style.inset,'32px 64px');
assert.equal(root.dimensionWidth.textContent,'Width 1072 px');assert.equal(root.dimensionHeight.textContent,'Height 736 px');assert(root.dimensions.classes.has('visible'));assert.equal(timers.size,1);
root.marginX.value='72';root.marginX.emit('input');assert.equal(timers.size,1);assert.equal(root.dimensionWidth.textContent,'Width 1056 px');
for(const fn of timers.values())fn();assert(!root.dimensions.classes.has('visible'));timers.clear();
root.marginX.value='-10';root.marginX.emit('change');assert.equal(root.grid.style.inset,'32px 0px');
root.marginX.value='';root.marginX.emit('change');assert.equal(root.grid.style.inset,'32px 32px');
click('action','hide');assert.equal(root.grid.hidden,false);click('action','hide');click('action','grid');assert.equal(root.grid.hidden,true);
root.marginY.value='48';root.marginY.emit('input');assert.equal(root.grid.style.inset,'48px 32px');
root.marginY.value='-1';root.marginY.emit('change');assert.equal(root.grid.style.inset,'0px 32px');
// Margin arrow keys use exact 8 px deltas, Shift gives 1 px, and zero is the floor.
for(const input of [root.marginX,root.marginY]){
  input.value='32';input.emit('keydown',{key:'ArrowUp'});assert.equal(input.value,'40');
  input.emit('keydown',{key:'ArrowUp',shiftKey:true});assert.equal(input.value,'41');
  input.emit('keydown',{key:'ArrowDown'});assert.equal(input.value,'33');
  input.emit('keydown',{key:'ArrowDown',shiftKey:true});assert.equal(input.value,'32');
  input.value='8';for(const expected of [16,32,64,128,256,512,1024,1024]){input.emit('keydown',{key:'ArrowUp',metaKey:true});assert.equal(input.value,String(expected));}
  for(const expected of [512,256,128,64,32,16,8,8]){input.emit('keydown',{key:'ArrowDown',metaKey:true});assert.equal(input.value,String(expected));}
  input.value='40';input.emit('keydown',{key:'ArrowUp',metaKey:true});assert.equal(input.value,'64');
  input.value='40';input.emit('keydown',{key:'ArrowDown',metaKey:true});assert.equal(input.value,'32');
  input.value='32';input.emit('keydown',{key:'ArrowUp',metaKey:true,shiftKey:true});assert.equal(input.value,'64');
  input.value='3';input.emit('keydown',{key:'ArrowDown'});assert.equal(input.value,'0');
  input.emit('pointerdown',{shiftKey:true});assert.equal(input.step,'1');
  input.emit('pointerdown',{shiftKey:false});assert.equal(input.step,'8');
}
document.emit('keyup',{key:'Shift',shiftKey:false});assert.equal(root.marginX.step,'8');
window.emit('blur');assert.equal(root.marginY.step,'8');
// Toolbar drags preserve the click offset, clamp to the viewport and clean up.
const dragEvent=(kind,x,y)=>root.handle.emit(kind,{button:0,pointerId:7,clientX:x,clientY:y});
dragEvent('pointerdown',140,30);dragEvent('pointermove',220,100);dragEvent('pointerup',220,100);
assert.equal(root.bar.style.left,'200px');assert.equal(root.bar.style.top,'86px');assert.equal(root.handle.capture,null);
dragEvent('pointerdown',220,100);dragEvent('pointerup',2000,2000);assert.equal(root.bar.style.left,'428px');assert.equal(root.bar.style.top,'588px');
window.innerWidth=1000;window.innerHeight=600;window.emit('resize');assert.equal(root.bar.style.left,'228px');assert.equal(root.bar.style.top,'388px');
dragEvent('pointerdown',240,400);dragEvent('pointerup',-50,-50);assert.equal(root.bar.style.left,'12px');assert.equal(root.bar.style.top,'12px');
root.handle.emit('keydown',{key:'ArrowRight'});assert.equal(root.bar.style.left,'22px');
click('mode','v');
// Place a guide by dragging, then move and undo it.
pointer('pointerdown',100,200);pointer('pointermove',145,270);pointer('pointerup',150,280);assert.equal(ink(0).x1,'150');
pointer('pointerdown',150,250,hit(0));pointer('pointermove',190,400);pointer('pointerup',200,450);assert.equal(ink(0).x1,'200');assert.equal(ink(0).y1,'0');assert.equal(svg.children[0].children.length,3);
click('action','undo');assert.equal(ink(0).x1,'150');
// Selecting without moving doesn't create an undo entry; colors apply to selection.
pointer('pointerdown',150,250,hit(0));pointer('pointerup',150,250);click('color','#16a34a');assert.equal(ink(0).stroke,'#16a34a');click('action','undo');assert.equal(ink(0).stroke,'#ff263f');
// Horizontal guides remain full width when moved.
click('mode','h');pointer('pointerdown',200,300);pointer('pointerup',230,350);assert.equal(ink(1).y1,'350');pointer('pointerdown',200,350,hit(1));pointer('pointerup',250,390);assert.equal(ink(1).y1,'390');assert.equal(ink(1).x1,'0');assert.equal(ink(1).x2,'100%');
// Shift circle, translation, and cancelled movement.
click('mode','circle');pointer('pointerdown',300,300);pointer('pointerup',350,330,svg,{shiftKey:true});assert.equal(ink(2).rx,'25');assert.equal(ink(2).ry,'25');pointer('pointerdown',350,325,hit(2));pointer('pointerup',400,425);assert.equal(ink(2).cx,'375');assert.equal(ink(2).cy,'425');pointer('pointerdown',400,425,hit(2));pointer('pointermove',450,450);svg.emit('pointercancel');assert.equal(ink(2).cx,'375');
// Click-only circle is discarded without deleting other marks.
pointer('pointerdown',500,500);pointer('pointerup',500,500);assert.equal(svg.children.length,3);
click('mode','arrow');pointer('pointerdown',400,400);pointer('pointerup',480,460);assert.match(ink(3).d,/M 400 400 L 480 460/);pointer('pointerdown',440,430,hit(3));pointer('pointerup',450,450);assert.match(ink(3).d,/M 410 420 L 490 480/);
click('color','#2563eb');assert.equal(ink(3).stroke,'#2563eb');click('action','delete');assert.equal(svg.children.length,3);click('action','undo');assert.equal(svg.children.length,4);
click('mode','select');pointer('pointerdown',700,700);pointer('pointerup',700,700);assert.equal(svg.children.length,4);
click('action','hide');assert(svg.classes.has('clean'));click('action','hide');assert(!svg.classes.has('clean'));
click('action','clear');assert.equal(svg.children.length,0);click('action','undo');assert.equal(svg.children.length,4);
click('mode','browse');pointer('pointerdown',800,800);assert.equal(svg.children.length,4);assert(svg.classes.has('pass'));
click('mode','text');pointer('pointerdown',300,320);pointer('pointerup',300,320);
assert.equal(root.texts.children.length,1);let box=root.texts.children[0],editor=box.children[0],grip=box;assert(editor.focused);
editor.value='First line\nSecond line';editor.emit('input');assert.equal(editor.style.height,'48px');editor.blur();assert.equal(editor.readOnly,true);assert.equal(box.children.length,1);box.emit('dblclick');assert.equal(editor.readOnly,false);assert(box.classes.has('editing'));editor.blur();
grip.emit('pointerdown',{button:0,pointerId:9,clientX:310,clientY:325});root.texts.emit('pointermove',{pointerId:9,clientX:360,clientY:365});root.texts.emit('pointerup',{pointerId:9,clientX:360,clientY:365});assert.equal(box.style.left,'350px');assert.equal(box.style.top,'360px');assert.equal(box.capture,null);
click('action','undo');assert.equal(box.style.left,'300px');assert.equal(editor.value,'First line\nSecond line');
editor.focus();editor.value='Updated note';editor.emit('input');editor.blur();click('action','undo');assert.equal(editor.value,'First line\nSecond line');
editor.focus();editor.blur();click('color','#16a34a');assert.equal(box.style.color,'#16a34a');
click('action','hide');assert(root.texts.classes.has('clean'));click('action','hide');
click('mode','select');editor.focus();editor.blur();click('action','delete');assert.equal(root.texts.children.length,0);click('action','undo');assert.equal(root.texts.children.length,1);assert.equal(root.texts.children[0].children[0].value,'First line\nSecond line');
click('mode','browse');assert(root.texts.classes.has('pass'));click('action','clear');assert.equal(root.texts.children.length,0);click('action','undo');assert.equal(root.texts.children.length,1);
// Cancelled close keeps content, including when Escape comes from an editor.
const escape=(target=svg,repeat=false)=>document.emit('keydown',{key:'Escape',repeat,composedPath:()=>[target]});
escape(root.texts.children[0].children[0]);assert.equal(document.documentElement.children.length,1);assert.equal(root.texts.children.length,1);assert.match(prompts.at(-1),/discard/);assert.match(prompts.at(-1),/press H/);
const promptCount=prompts.length;escape(svg,true);assert.equal(prompts.length,promptCount);
click('action','close');assert.equal(document.documentElement.children.length,1);
vm.runInNewContext(fs.readFileSync('src/saga-merk.js','utf8'),{window,document,Element:El});assert.equal(document.documentElement.children.length,1);
// H hides and passes pointer input through; showing again restores the previous tool.
click('mode','arrow');document.emit('keydown',{key:'h',composedPath:()=>[svg]});assert(root.bar.classes.has('hidden'));assert(svg.classes.has('pass'));assert(root.texts.classes.has('pass'));assert.equal(root.buttons.find(b=>b.dataset.mode==='browse').attrs['aria-pressed'],'true');
document.emit('keydown',{key:'h',composedPath:()=>[svg]});assert(!root.bar.classes.has('hidden'));assert(!svg.classes.has('pass'));assert.equal(root.buttons.find(b=>b.dataset.mode==='arrow').attrs['aria-pressed'],'true');assert.equal(root.texts.children.length,1);
for(const tool of ['text','select','v','h','circle','browse']){click('mode',tool);click('action','hide');assert(svg.classes.has('pass'));click('action','hide');assert.equal(root.buttons.find(b=>b.dataset.mode===tool).attrs['aria-pressed'],'true');assert.equal(svg.classes.has('pass'),tool==='browse');}
// Number keys select each tool and leave typing, composition, and browser chords alone.
for(const [index,tool] of ['select','v','h','circle','arrow','text','browse'].entries()){
  document.emit('keydown',{key:String(index+1),composedPath:()=>[svg]});assert.equal(root.buttons.find(b=>b.dataset.mode===tool).attrs['aria-pressed'],'true');
}
for(const target of [{tagName:'INPUT'},{tagName:'TEXTAREA'},{tagName:'SELECT'},{isContentEditable:true}]){document.emit('keydown',{key:'1',composedPath:()=>[target]});assert(svg.classes.has('pass'));}
for(const modifier of ['metaKey','ctrlKey','altKey','shiftKey','isComposing']){document.emit('keydown',{key:'1',[modifier]:true,composedPath:()=>[svg]});assert(svg.classes.has('pass'));}
click('action','hide');document.emit('keydown',{key:'6',composedPath:()=>[svg]});assert(!root.bar.classes.has('hidden'));assert.equal(root.buttons.find(b=>b.dataset.mode==='text').attrs['aria-pressed'],'true');
confirmResult=true;escape();assert.equal(document.documentElement.children.length,0);assert.equal(document.handlers.keydown.length,0);assert.equal(window.handlers.resize.length,0);
console.log('PASS: text creation/editing/moving/colors/undo/delete, independent grid margins, toolbar dragging/clamping/resize/keyboard, guide placement, shape selection/movement, constrained guides/circles, arrows, colors, cancellation, undo/delete/clear, browse, hiding, cleanup.');
