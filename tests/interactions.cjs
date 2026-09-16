const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class Style {
  constructor(){this.values={};this.priorities={};}
  getPropertyValue(name){return this.values[name]||'';}
  getPropertyPriority(name){return this.priorities[name]||'';}
  setProperty(name,value,priority=''){this.values[name]=value;this.priorities[name]=priority;}
  removeProperty(name){delete this.values[name];delete this.priorities[name];}
}
class TextNode {
  constructor(data){this.nodeType=3;this.data=data;this.childNodes=[];}
  get textContent(){return this.data;}
}
class El {
  constructor(tag='div'){this.tagName=tag;this.nodeType=1;this.namespaceURI='http://www.w3.org/1999/xhtml';this.dataset={};this.style=new Style();this.attrs={};this.children=[];this.handlers={};this.value='';this.classes=new Set();this.classList={toggle:(k,on)=>{on=on??!this.classes.has(k);on?this.classes.add(k):this.classes.delete(k);return on;},add:k=>this.classes.add(k),remove:k=>this.classes.delete(k),contains:k=>this.classes.has(k)};}
  setCustomValidity(value){this.validation=value;}reportValidity(){return !this.validation;}
  get parentNode(){return this.parent;}
  get nextSibling(){return this.parent?.children[this.parent.children.indexOf(this)+1]||null;}
  get isConnected(){return this===document.documentElement||!!this.parent?.isConnected;}
  get childNodes(){return this.children;}
  get textContent(){return this.children.map(child=>child.textContent).join('');}
  set textContent(value){this.replaceChildren(new TextNode(value));}
  get innerHTML(){return this.children.map(child=>child.nodeType===3?child.data:`<${child.tagName}>${child.innerHTML}</${child.tagName}>`).join('');}
  getAttribute(name){if(name==='style')return Object.entries(this.style.values).map(([k,v])=>`${k}:${v}${this.style.priorities[k]?' !important':''}`).join(';')||null;return this.attrs[name]??null;}
  removeAttribute(name){delete this.attrs[name];if(name==='style')this.style=new Style();}
  contains(el){return el===this||this.children.some(child=>child===el||child.contains?.(el));}
  focus(){this.focused=true;this.emit('focus');}blur(){if(this.focused){this.focused=false;this.emit('blur');}}
  get scrollHeight(){return Math.max(32,(this.value||'').split('\n').length*24);}
  getBoundingClientRect(){const r=this.rect||{left:parseFloat(this.style.left)||120,top:parseFloat(this.style.top)||16,width:760,height:200};return {...r,right:r.left+r.width,bottom:r.top+r.height};}
  setAttribute(k,v){if(k==='style'){this.style=new Style();for(const pair of v.split(';')){const [key,...rest]=pair.split(':');if(key)this.style.setProperty(key,rest.join(':').replace(' !important',''),pair.includes(' !important')?'important':'');}}this.attrs[k]=String(v);if(k==='data-id')this.dataset.id=String(v);if(k==='data-mirror')this.dataset.mirror=String(v);}
  append(...els){for(const el of els){if(el.parent)el.parent.children=el.parent.children.filter(child=>child!==el);this.children.push(el);el.parent=this;}}
  replaceChild(newEl,oldEl){const i=this.children.indexOf(oldEl);if(newEl.parent)newEl.parent.children=newEl.parent.children.filter(child=>child!==newEl);this.children[i]=newEl;newEl.parent=this;oldEl.parent=null;return oldEl;}
  insertBefore(el,next){el.remove();const i=next?this.children.indexOf(next):this.children.length;this.children.splice(i,0,el);el.parent=this;}
  cloneNode(deep){const clone=new El(this.tagName);for(const [k,v] of Object.entries(this.attrs))clone.setAttribute(k,v);if(this.getAttribute('style'))clone.setAttribute('style',this.getAttribute('style'));if(deep)clone.append(...this.children.map(child=>child.nodeType===3?new TextNode(child.data):child.cloneNode(true)));return clone;}
  replaceChildren(...els){this.children=[];this.append(...els);}
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);this.parent=null;}
  addEventListener(k,fn){(this.handlers[k]??=[]).push(fn);}
  removeEventListener(k,fn){this.handlers[k]=(this.handlers[k]||[]).filter(f=>f!==fn);}
  emit(k,event={}){for(const f of this.handlers[k]||[])f({preventDefault(){},stopPropagation(){},stopImmediatePropagation(){},...event});}
  closest(q){if(q==='[contenteditable]')return this.getAttribute('contenteditable')!==null?this:this.parent?.closest(q)||null;if(q.includes(','))return q.split(',').some(selector=>selector==='[contenteditable]'?this.getAttribute('contenteditable')!==null:selector==='[aria-hidden="true"]'?this.getAttribute('aria-hidden')==='true':selector==='[role="img"]'?this.getAttribute('role')==='img':this.tagName.toLowerCase()===selector)?this:this.parent?.closest(q)||null;return q==='button'&&this.tagName==='button'?this:q==='[data-id]'?(this.dataset.id?this:this.parent?.closest(q)):null;}
  setPointerCapture(id){this.capture=id;}hasPointerCapture(id){return this.capture===id;}releasePointerCapture(){this.capture=null;}
  attachShadow(){root=new El();root.inspector=new El();root.elementName=new El();root.cssInputs=['background-color','color','border-color','text-align','padding','z-index'].map(name=>{const input=new El('INPUT');input.dataset.css=name;return input;});root.pageOutline=new El();root.pageControls=new El();root.pageControls.rect={left:0,top:0,width:140,height:36};root.pageGrip=new El('button');root.pageDelete=new El('button');root.pageEditButton=new El('button');root.pageFloats=new El();root.pageFloats.parent=this;root.hint=new El();root.hint.textContent='Default hint';root.svg=new El('svg');root.texts=new El();root.grid=new El();root.spacing=new El('select');root.spacing.value='32';root.dimensions=new El();root.dimensionWidth=new El();root.dimensionHeight=new El();root.marginX=new El('input');root.marginX.value='16';root.marginY=new El('input');root.marginY.value='16';root.handle=new El('button');root.bar=new El();root.color=new El('input');root.color.value='#ff263f';root.width=new El('select');root.width.value='2';root.textSize=new El('select');root.textSize.value='24';root.buttons=[];for(const mode of ['select','counter','text','h','v','arrow','rect','circle','browse']){let b=new El('button');b.dataset.mode=mode;root.buttons.push(b);}for(const color of ['#ff263f','#16a34a','#2563eb']){let b=new El('button');b.dataset.color=color;root.buttons.push(b);}for(const action of ['grid','undo','delete','clear','hide','close']){let b=new El('button');b.dataset.action=action;root.buttons.push(b);}return root;}
  querySelector(q){if(q==='.inspector')return this.inspector;if(q==='.element-name')return this.elementName;if(q.includes(','))return this.children.find(child=>child.nodeType===1&&child.closest(q)===child)||null;return q==='.page-outline'?this.pageOutline:q==='.page-controls'?this.pageControls:q==='[data-page-drag]'?this.pageGrip:q==='[data-page-delete]'?this.pageDelete:q==='[data-page-edit]'?this.pageEditButton:q==='.page-floats'?this.pageFloats:q==='.hint'?this.hint: q==='[data-text-size]'?this.textSize:q==='.dimensions'?this.dimensions:q==='.dimension-width'?this.dimensionWidth:q==='.dimension-height'?this.dimensionHeight:q==='.texts'?this.texts:q==='.grid'?this.grid:q==='[data-grid-spacing]'?this.spacing:q==='[data-grid-margin-x]'?this.marginX:q==='[data-grid-margin-y]'?this.marginY:q==='.drag-handle'?this.handle:q==='svg'?this.svg:q==='.bar'?this.bar:q==='input'?this.color:q==='select'?this.width:this.buttons.find(b=>q===`[data-action="${b.dataset.action}"]`);}
  querySelectorAll(q){if(q==='[data-css]')return this.cssInputs;if(q==='*')return this.children.filter(child=>child.nodeType===1).flatMap(child=>[child,...child.querySelectorAll('*')]);return this.buttons.filter(b=>q==='[data-mode]'?b.dataset.mode:b.dataset.color);}
}
let root;const document=new El();document.documentElement=new El();document.createElement=t=>new El(t);document.createElementNS=(_,t)=>new El(t);const window=new El();let confirmResult=false;const prompts=[];window.confirm=message=>{prompts.push(message);return confirmResult;};let timerId=0;const timers=new Map();window.setTimeout=fn=>{timers.set(++timerId,fn);return timerId;};window.clearTimeout=id=>timers.delete(id);window.getComputedStyle=el=>({*[Symbol.iterator](){yield* ['display','color','font-size','-webkit-user-modify','-moz-user-modify'];},getPropertyValue(name){return name==='display'?'block':name.endsWith('user-modify')?'read-only':el.style.getPropertyValue(name);},display:'block',color:el.style.getPropertyValue('color')||'rgb(20, 30, 40)',zIndex:el.style.getPropertyValue('z-index')||'auto',position:el.style.getPropertyValue('position')||'static',fontSize:el.style.getPropertyValue('font-size')||'18px'});window.innerWidth=1200;window.innerHeight=800;var inputSource=fs.readFileSync(process.env.MERK_SOURCE||'src/saga-merk.js','utf8');vm.runInNewContext(inputSource.startsWith('javascript:')?decodeURIComponent(inputSource.slice(11)):inputSource,{window,document,Element:El,setTimeout:window.setTimeout,clearTimeout:window.clearTimeout,CSS:{supports:(_,v)=>v!=='invalid'}});if(!root)document.documentElement.children.find(el=>el.tagName==='script').onerror();
const svg=root.svg,click=(type,v)=>root.bar.emit('click',{target:root.buttons.find(b=>b.dataset[type]===v)});
const pointer=(event,x,y,target=svg,extra={})=>svg.emit(event,{clientX:x,clientY:y,pointerId:1,button:0,target,...extra});
const ink=i=>svg.children[i].children[0].attrs;
const hit=i=>svg.children[i].children.at(-1);
// Grid defaults, spacing choices, margins, validation and toolbar independence.
assert.equal(root.grid.hidden,true);assert.equal(root.grid.style.inset,'16px 16px');assert.equal(root.grid.style.backgroundSize,'32px 32px');
click('action','grid');assert.equal(root.grid.hidden,false);
for(const spacing of [8,16,24,32,64,128]){root.spacing.value=String(spacing);root.spacing.emit('change');assert.equal(root.grid.style.backgroundSize,`${spacing}px ${spacing}px`);}
root.marginX.value='64';root.marginX.emit('input');assert.equal(root.grid.style.inset,'16px 64px');
assert.equal(root.dimensionWidth.textContent,'Width 1072 px');assert.equal(root.dimensionHeight.textContent,'Height 768 px');assert(root.dimensions.classes.has('visible'));assert.equal(timers.size,1);
root.marginX.value='72';root.marginX.emit('input');assert.equal(timers.size,1);assert.equal(root.dimensionWidth.textContent,'Width 1056 px');
for(const fn of timers.values())fn();assert(!root.dimensions.classes.has('visible'));timers.clear();
root.marginX.value='-10';root.marginX.emit('change');assert.equal(root.grid.style.inset,'16px 0px');
root.marginX.value='';root.marginX.emit('change');assert.equal(root.grid.style.inset,'16px 16px');
click('action','hide');assert.equal(root.grid.hidden,false);click('action','hide');click('action','grid');assert.equal(root.grid.hidden,true);
root.marginY.value='48';root.marginY.emit('input');assert.equal(root.grid.style.inset,'48px 16px');
root.marginY.value='-1';root.marginY.emit('change');assert.equal(root.grid.style.inset,'0px 16px');
// Margin arrow keys use exact 8 px deltas, Shift gives 1 px, and zero is the floor.
for(const input of [root.marginX,root.marginY]){
  input.value='32';input.emit('keydown',{key:'ArrowUp'});assert.equal(input.value,'40');
  input.emit('keydown',{key:'ArrowUp',shiftKey:true});assert.equal(input.value,'41');
  input.emit('keydown',{key:'ArrowDown'});assert.equal(input.value,'33');
  input.emit('keydown',{key:'ArrowDown',shiftKey:true});assert.equal(input.value,'32');
  input.value='8';for(const expected of [16,32,64,128,256,512,1024,1024]){input.emit('keydown',{key:'ArrowUp',altKey:true});assert.equal(input.value,String(expected));}
  for(const expected of [512,256,128,64,32,16,8,8]){input.emit('keydown',{key:'ArrowDown',altKey:true});assert.equal(input.value,String(expected));}
  input.value='40';input.emit('keydown',{key:'ArrowUp',altKey:true});assert.equal(input.value,'64');
  input.value='40';input.emit('keydown',{key:'ArrowDown',altKey:true});assert.equal(input.value,'32');
  input.value='32';input.emit('keydown',{key:'ArrowUp',altKey:true,shiftKey:true});assert.equal(input.value,'64');
  input.value='32';input.emit('keydown',{key:'ArrowUp',metaKey:true});assert.equal(input.value,'40');
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
// Rectangle geometry normalizes all drag directions; Shift produces a square.
click('mode','rect');
for(const [x,y] of [[580,560],[420,560],[580,440],[420,440]]){
  pointer('pointerdown',500,500);pointer('pointerup',x,y);
  assert.equal(svg.children[4].children[0].tagName,'rect');assert.equal(ink(4).x,String(Math.min(500,x)));assert.equal(ink(4).y,String(Math.min(500,y)));assert.equal(ink(4).width,'80');assert.equal(ink(4).height,'60');
  click('action','undo');assert.equal(svg.children.length,4);
}
pointer('pointerdown',500,500);pointer('pointerup',420,460,svg,{shiftKey:true});assert.equal(ink(4).width,'80');assert.equal(ink(4).height,'80');assert.equal(ink(4).x,'420');assert.equal(ink(4).y,'420');
pointer('pointerdown',420,440,hit(4));pointer('pointerup',450,480);assert.equal(ink(4).x,'450');assert.equal(ink(4).y,'460');assert.equal(ink(4).width,'80');
click('color','#16a34a');assert.equal(ink(4).stroke,'#16a34a');root.width.value='4';root.width.emit('change');assert.equal(ink(4)['stroke-width'],'4');
click('action','delete');assert.equal(svg.children.length,4);click('action','undo');assert.equal(ink(4).height,'80');pointer('pointerdown',450,480,hit(4));pointer('pointerup',450,480);click('action','delete');
pointer('pointerdown',500,500);pointer('pointermove',600,540);svg.emit('pointercancel');assert.equal(svg.children.length,4);
pointer('pointerdown',500,500);pointer('pointerup',500,500);assert.equal(svg.children.length,4);
click('mode','text');pointer('pointerdown',300,320);pointer('pointerup',300,320);
assert.equal(root.texts.children.length,1);let box=root.texts.children[0],editor=box.children[0],grip=box;assert(editor.focused);assert.equal(editor.style.fontSize,'24px');
editor.value='First line\nSecond line';editor.emit('input');assert.equal(editor.style.height,'48px');editor.blur();assert.equal(editor.readOnly,true);assert.equal(box.children.length,1);box.emit('dblclick');assert.equal(editor.readOnly,false);assert(box.classes.has('editing'));editor.blur();
grip.emit('pointerdown',{button:0,pointerId:9,clientX:310,clientY:325});root.texts.emit('pointermove',{pointerId:9,clientX:360,clientY:365});root.texts.emit('pointerup',{pointerId:9,clientX:360,clientY:365});assert.equal(box.style.left,'350px');assert.equal(box.style.top,'360px');assert.equal(box.capture,null);
click('action','undo');assert.equal(box.style.left,'300px');assert.equal(editor.value,'First line\nSecond line');
editor.focus();editor.value='Updated note';editor.emit('input');editor.blur();click('action','undo');assert.equal(editor.value,'First line\nSecond line');
editor.focus();editor.blur();click('color','#16a34a');assert.equal(box.style.color,'#16a34a');
click('action','hide');assert(root.texts.classes.has('clean'));click('action','hide');
click('mode','select');editor.focus();editor.blur();click('action','delete');assert.equal(root.texts.children.length,0);click('action','undo');assert.equal(root.texts.children.length,1);assert.equal(root.texts.children[0].children[0].value,'First line\nSecond line');
click('mode','browse');assert(root.texts.classes.has('pass'));click('action','clear');assert.equal(root.texts.children.length,0);click('action','undo');assert.equal(root.texts.children.length,1);
// Counters place on click or drag, share text styling, and restore numbering on undo/cancel.
click('action','clear');click('mode','counter');
root.textSize.value='24';root.textSize.emit('change');
pointer('pointerdown',100,300);pointer('pointerup',100,300);
let counter=root.texts.children[0];
assert.equal(counter.children[0].value,'1');assert.equal(counter.children[0].style.fontSize,'24px');assert(!counter.children[0].focused);
pointer('pointerdown',200,300);pointer('pointermove',220,350);pointer('pointerup',240,360);
assert.equal(root.texts.children[1].children[0].value,'2');assert.equal(root.texts.children[1].style.left,'240px');assert.equal(root.texts.children[1].style.top,'360px');
pointer('pointerdown',300,300);svg.emit('pointercancel');assert.equal(root.texts.children.length,2);
pointer('pointerdown',300,300);pointer('pointerup',300,300);assert.equal(root.texts.children[2].children[0].value,'3');
click('action','undo');pointer('pointerdown',310,310);pointer('pointerup',310,310);assert.equal(root.texts.children[2].children[0].value,'3');
root.textSize.value='48';root.textSize.emit('change');assert.equal(root.texts.children[2].children[0].style.fontSize,'48px');assert.equal(counter.children[0].style.fontSize,'24px');
click('action','undo');assert.equal(root.texts.children[2].children[0].style.fontSize,'24px');
counter.emit('dblclick');assert.equal(counter.children[0].readOnly,true);
counter.emit('pointerdown',{button:0,pointerId:9,clientX:100,clientY:300});root.texts.emit('pointerup',{pointerId:9,clientX:150,clientY:340});assert.equal(counter.style.left,'150px');assert.equal(root.textSize.value,'24');
click('color','#2563eb');assert.equal(counter.style.color,'#2563eb');click('action','delete');assert.equal(root.texts.children.length,2);click('action','undo');assert.equal(root.texts.children.length,3);
click('mode','text');pointer('pointerdown',400,400);let sizedText=root.texts.children[3].children[0];assert.equal(sizedText.style.fontSize,'24px');sizedText.value='Sized note';sizedText.emit('input');sizedText.blur();
root.textSize.value='32';root.textSize.emit('change');assert.equal(sizedText.style.fontSize,'32px');click('action','undo');assert.equal(sizedText.style.fontSize,'24px');
click('action','clear');click('mode','counter');pointer('pointerdown',100,300);pointer('pointerup',100,300);assert.equal(root.texts.children[0].children[0].value,'1');
// Alt/Option draws centered geometry in every direction, with optional Shift constraints.
click('action','clear');
for(const kind of ['circle','rect'])for(const shiftKey of [false,true])for(const [dx,dy] of [[80,30],[-80,30],[80,-30],[-80,-30]]){
  click('mode',kind);pointer('pointerdown',400,300,svg,{altKey:true,shiftKey});pointer('pointerup',400+dx,300+dy,svg,{altKey:true,shiftKey});
  const shape=ink(0),halfHeight=shiftKey?80:30;
  if(kind==='circle'){assert.equal(shape.cx,'400');assert.equal(shape.cy,'300');assert.equal(shape.rx,'80');assert.equal(shape.ry,String(halfHeight));}
  else{assert.equal(shape.x,'320');assert.equal(shape.y,String(300-halfHeight));assert.equal(shape.width,'160');assert.equal(shape.height,String(halfHeight*2));}
  click('action','undo');assert.equal(svg.children.length,0);
}
// Changing Alt during a drag recomputes from the original press, without accumulating offsets.
click('mode','rect');pointer('pointerdown',400,300);pointer('pointermove',480,330,svg,{altKey:true});assert.equal(ink(0).x,'320');pointer('pointerup',480,330);assert.equal(ink(0).x,'400');assert.equal(ink(0).width,'80');click('action','undo');
// Mirrored guides remain linked across moves, styling, viewport changes, delete, and undo.
const originalViewport=[window.innerWidth,window.innerHeight];window.innerWidth=1000;window.innerHeight=600;
for(const kind of ['v','h']){
  click('mode',kind);pointer('pointerdown',100,80,svg,{altKey:true});assert.equal(svg.children.length,2);pointer('pointerup',120,90,svg,{altKey:true});
  const axis=kind==='v'?'x1':'y1';assert.equal(ink(0)[axis],kind==='v'?'120':'90');assert.equal(ink(1)[axis],kind==='v'?'880':'510');
  pointer('pointerdown',880,510,hit(1));pointer('pointerup',860,490);assert.equal(ink(0)[axis],kind==='v'?'140':'110');assert.equal(ink(1)[axis],kind==='v'?'860':'490');
  click('color','#16a34a');assert.equal(ink(0).stroke,'#16a34a');assert.equal(ink(1).stroke,'#16a34a');
  window.innerWidth=1200;window.innerHeight=800;window.emit('resize');assert.equal(ink(1)[axis],kind==='v'?'1060':'690');
  click('action','delete');assert.equal(svg.children.length,0);click('action','undo');assert.equal(svg.children.length,2);click('action','clear');
  pointer('pointerdown',100,80,svg,{altKey:true});svg.emit('pointercancel');assert.equal(svg.children.length,0);
  window.innerWidth=1000;window.innerHeight=600;
}
[window.innerWidth,window.innerHeight]=originalViewport;window.emit('resize');
// Sub-counters use integer groups (including 1.10), and compose with Shift badges.
click('mode','counter');
const placeCounter=(extra={})=>{pointer('pointerdown',500,400,svg,extra);pointer('pointerup',500,400,svg,extra);return root.texts.children.at(-1);};
assert.equal(placeCounter().children[0].value,'1');
for(let minor=1;minor<=12;minor++)assert.equal(placeCounter({altKey:true}).children[0].value,`1.${minor}`);
assert.equal(placeCounter().children[0].value,'2');
let badge=placeCounter({altKey:true,shiftKey:true});assert.equal(badge.children[0].value,'2.1');assert(badge.classes.has('badge'));assert.equal(badge.style.color,'#fff');assert.equal(badge.style.background,root.color.value);
click('color','#ff263f');assert.equal(badge.style.background,'#ff263f');assert.equal(badge.style.color,'#fff');
root.textSize.value='48';root.textSize.emit('change');assert.equal(badge.children[0].style.fontSize,'48px');assert(Math.abs(parseFloat(badge.children[0].style.height)-67.2)<0.001);
badge.emit('pointerdown',{button:0,pointerId:9,clientX:500,clientY:400});root.texts.emit('pointerup',{pointerId:9,clientX:550,clientY:430});assert.equal(badge.style.left,'550px');assert.equal(badge.children[0].value,'2.1');
click('action','delete');assert.equal(placeCounter({altKey:true}).children[0].value,'2.1');click('action','undo');assert.equal(placeCounter({altKey:true,shiftKey:true}).children[0].value,'2.1');
pointer('pointerdown',500,400,svg,{altKey:true});svg.emit('pointercancel');assert.equal(placeCounter({altKey:true}).children[0].value,'2.2');
click('action','clear');assert.equal(placeCounter({altKey:true}).children[0].value,'1.1');assert.equal(placeCounter({shiftKey:true}).children[0].value,'2');assert(root.texts.children.at(-1).classes.has('badge'));
click('action','clear');click('color','#2563eb');root.textSize.value='24';root.textSize.emit('change');assert.equal(placeCounter().children[0].value,'1');assert(!root.texts.children[0].classes.has('badge'));
// Cancelled close keeps content, including when Escape comes from an editor.
const escape=(target=svg,repeat=false)=>document.emit('keydown',{key:'Escape',repeat,composedPath:()=>[target]});
escape(root.texts.children[0].children[0]);assert.equal(document.documentElement.children.length,1);assert.equal(root.texts.children.length,1);assert.match(prompts.at(-1),/discard/);assert.match(prompts.at(-1),/press H/);
const promptCount=prompts.length;escape(svg,true);assert.equal(prompts.length,promptCount);
click('action','close');assert.equal(document.documentElement.children.length,1);
var inputSource=fs.readFileSync(process.env.MERK_SOURCE||'src/saga-merk.js','utf8');vm.runInNewContext(inputSource.startsWith('javascript:')?decodeURIComponent(inputSource.slice(11)):inputSource,{window,document,Element:El,setTimeout:window.setTimeout,clearTimeout:window.clearTimeout,CSS:{supports:(_,v)=>v!=='invalid'}});if(!root)document.documentElement.children.find(el=>el.tagName==='script').onerror();assert.equal(document.documentElement.children.length,1);
// H hides and passes pointer input through; showing again restores the previous tool.
click('mode','arrow');document.emit('keydown',{key:'h',composedPath:()=>[svg]});assert(root.bar.classes.has('hidden'));assert(svg.classes.has('pass'));assert(root.texts.classes.has('pass'));assert.equal(root.buttons.find(b=>b.dataset.mode==='browse').attrs['aria-pressed'],'true');
document.emit('keydown',{key:'h',composedPath:()=>[svg]});assert(!root.bar.classes.has('hidden'));assert(!svg.classes.has('pass'));assert.equal(root.buttons.find(b=>b.dataset.mode==='arrow').attrs['aria-pressed'],'true');assert.equal(root.texts.children.length,1);
for(const tool of ['text','select','v','h','circle','browse']){click('mode',tool);click('action','hide');assert(svg.classes.has('pass'));click('action','hide');assert.equal(root.buttons.find(b=>b.dataset.mode===tool).attrs['aria-pressed'],'true');assert.equal(svg.classes.has('pass'),tool==='browse');}
// Number keys select each tool and leave typing, composition, and browser chords alone.
for(const [index,tool] of ['select','counter','text','h','v','arrow','rect','circle','browse'].entries()){
  document.emit('keydown',{key:String(index+1),composedPath:()=>[svg]});assert.equal(root.buttons.find(b=>b.dataset.mode===tool).attrs['aria-pressed'],'true');
}
click('mode','browse');
for(const target of [{tagName:'INPUT'},{tagName:'TEXTAREA'},{tagName:'SELECT'},{isContentEditable:true}]){document.emit('keydown',{key:'1',composedPath:()=>[target]});assert(svg.classes.has('pass'));}
for(const modifier of ['metaKey','ctrlKey','altKey','shiftKey','isComposing']){document.emit('keydown',{key:'1',[modifier]:true,composedPath:()=>[svg]});assert(svg.classes.has('pass'));}
click('action','hide');document.emit('keydown',{key:'3',composedPath:()=>[svg]});assert(!root.bar.classes.has('hidden'));assert.equal(root.buttons.find(b=>b.dataset.mode==='text').attrs['aria-pressed'],'true');
// Edit page targets real text, preserves nested nodes, and keeps toolbar styling scoped.
const heading=new El('H1'),emphasis=new El('EM');emphasis.textContent='world';heading.append(new TextNode('Hello '),emphasis);
heading.style.setProperty('color','rgb(20, 30, 40)','important');heading.style.setProperty('outline','1px dashed black');
document.documentElement.append(heading);
const originalHeading=heading.innerHTML,annotationColor=root.color.value,annotationSize=root.textSize.value;
const pageEvent=(type,target,extra={})=>document.emit(type,{button:0,target,composedPath:()=>[target],...extra});
click('mode','select');assert(svg.classes.has('select'));assert(!root.texts.classes.has('pass'));
const editSelected=el=>{pageEvent('pointerdown',el);root.pageEditButton.emit('click');};
editSelected(heading);assert.equal(heading.getAttribute('contenteditable'),'plaintext-only');assert.equal(root.color.value,'#141e28');assert.equal(root.textSize.value,'18');assert.equal(root.hint.textContent.includes('Editing text'),true);
// Toolbar focus doesn't lose the page target; changing style never recolors an annotation.
pageEvent('focusin',root.color,{composedPath:()=>[root.color,window.__pageMarkerOverlay]});
click('color','#16a34a');assert.equal(heading.style.getPropertyValue('color'),'#16a34a');assert.equal(root.texts.children[0].style.color,'#2563eb');
root.textSize.value='32';root.textSize.emit('change');assert.equal(heading.style.getPropertyValue('font-size'),'32px');
heading.textContent='New heading';pageEvent('input',heading);
let pageKeyStopped=false;pageEvent('keydown',heading,{key:'8',stopImmediatePropagation(){pageKeyStopped=true;}});assert(pageKeyStopped);assert.equal(root.buttons.find(b=>b.dataset.mode==='select').attrs['aria-pressed'],'true');
let navigationBlocked=false;pageEvent('click',heading,{preventDefault(){navigationBlocked=true;}});assert(navigationBlocked);
click('action','undo');assert.equal(heading.innerHTML,originalHeading);assert.equal(heading.children[1],emphasis);assert.equal(heading.getAttribute('contenteditable'),null);assert.equal(heading.style.getPropertyValue('font-size'),'32px');assert.equal(heading.style.getPropertyValue('outline'),'1px dashed black');
click('action','undo');assert.equal(heading.style.getPropertyValue('font-size'),'');click('action','undo');assert.equal(heading.style.getPropertyValue('color'),'rgb(20, 30, 40)');assert.equal(heading.style.getPropertyPriority('color'),'important');
assert.equal(root.color.value,annotationColor);assert.equal(root.textSize.value,annotationSize);
// Blur commits; hide and tool switches end editing while preserving the visible result.
editSelected(heading);heading.textContent='Local preview';pageEvent('input',heading);pageEvent('focusin',new El('INPUT'));assert.equal(heading.getAttribute('contenteditable'),null);assert.equal(heading.textContent,'Local preview');
editSelected(heading);click('action','hide');assert.equal(heading.getAttribute('contenteditable'),null);assert.equal(heading.textContent,'Local preview');click('action','hide');assert.equal(root.buttons.find(b=>b.dataset.mode==='select').attrs['aria-pressed'],'true');
// Existing form fields, editors and layout containers are not turned into page editors.
for(const tag of ['INPUT','TEXTAREA','SELECT','BODY','SCRIPT','SVG']){const excluded=new El(tag);excluded.textContent='Keep me';pageEvent('pointerdown',excluded);assert.equal(excluded.getAttribute('contenteditable'),null);}
const existingEditor=new El('DIV');existingEditor.textContent='Existing editor';existingEditor.setAttribute('contenteditable','true');pageEvent('pointerdown',existingEditor);assert.equal(existingEditor.getAttribute('contenteditable'),'true');
const layout=new El('DIV');layout.append(new El('P'));layout.children[0].textContent='Paragraph';pageEvent('pointerdown',layout);assert.equal(layout.getAttribute('contenteditable'),null);
// Clear restores the page and annotations together, and undo restores that complete preview.
const marksBeforeClear=root.texts.children.length;click('action','clear');assert.equal(heading.innerHTML,originalHeading);assert.equal(root.texts.children.length,0);click('action','undo');assert.equal(heading.textContent,'Local preview');assert.equal(root.texts.children.length,marksBeforeClear);
editSelected(heading);click('color','#ff263f');click('mode','select');assert.equal(heading.getAttribute('contenteditable'),null);assert.equal(heading.style.getPropertyValue('color'),'#ff263f');
// Editing resolves wrappers to real text while retaining icons, parents, and sibling controls.
const textCard=new El('ARTICLE'),wrapper=new El('DIV'),label=new El('SPAN'),icon=new El('SVG'),secondBlock=new El('P');
label.textContent='Wrapped label';secondBlock.textContent='Second block';wrapper.append(icon,label);textCard.append(wrapper,secondBlock);document.documentElement.append(textCard);
editSelected(textCard);assert.equal(label.getAttribute('contenteditable'),'plaintext-only');assert.equal(wrapper.getAttribute('contenteditable'),null);assert.equal(textCard.getAttribute('contenteditable'),null);assert.equal(secondBlock.getAttribute('contenteditable'),null);assert.equal(root.pageEditButton.textContent,'Done');
label.textContent='Changed label';pageEvent('input',label);let caretPrevented=false;pageEvent('pointerdown',label,{preventDefault(){caretPrevented=true;}});assert.equal(caretPrevented,false);
root.pageEditButton.emit('click');assert.equal(label.getAttribute('contenteditable'),null);assert.equal(wrapper.children[0],icon);assert.equal(wrapper.children[1],label);assert.equal(root.pageEditButton.textContent,'Edit text');
click('action','undo');assert.equal(label.textContent,'Wrapped label');assert.equal(wrapper.children[1],label);
pageEvent('pointerdown',icon);assert.equal(root.pageEditButton.hidden,true);textCard.remove();
// Bare button/link labels beside decorative icons stay editable without consuming the icon.
for(const tag of ['BUTTON','A']){
  const button=new El(tag),decoration=new El('SPAN'),bare=new TextNode('Try it here ');
  decoration.setAttribute('aria-hidden','true');decoration.textContent='→';button.append(bare,decoration);document.documentElement.append(button);
  pageEvent('pointerdown',button,{shiftKey:true});
  const editor=button.children[0];assert.equal(editor.getAttribute('contenteditable'),'plaintext-only');assert.equal(button.children[1],decoration);
  editor.textContent='Updated label';pageEvent('input',editor);root.pageEditButton.emit('click');
  assert.equal(decoration.textContent,'→');click('action','clear');assert.equal(button.children[0],bare);assert.equal(button.children[1],decoration);
  click('action','undo');assert.equal(button.children[0],editor);assert.equal(editor.textContent,'Updated label');click('action','clear');button.remove();
}
// Option starts the same captured drag as the Move handle; click alone leaves layout intact.
const quickMove=new El('P');quickMove.textContent='Quick move';document.documentElement.append(quickMove);
pageEvent('pointerdown',quickMove,{altKey:true,pointerId:42,clientX:120,clientY:16});
assert.equal(root.pageGrip.capture,42);assert.equal(root.pageFloats.children.length,0);
root.pageGrip.emit('pointerup',{pointerId:42,clientX:120,clientY:16});assert.equal(root.pageFloats.children.length,0);
pageEvent('pointerdown',quickMove,{altKey:true,shiftKey:true,pointerId:43,clientX:120,clientY:16});
assert.equal(quickMove.getAttribute('contenteditable'),null);
root.pageGrip.emit('pointerup',{pointerId:43,clientX:150,clientY:36});assert.equal(root.pageFloats.children[0].style.left,'150px');
click('action','undo');assert.equal(quickMove.parent,document.documentElement);quickMove.remove();
// A lifted element remains editable, but closing/clearing must restore its source styles.
const editMoveFixture=new El('SECTION'),editMoveTarget=new El('P');editMoveTarget.textContent='Movable text';editMoveTarget.style.setProperty('color','purple');editMoveFixture.append(editMoveTarget);document.documentElement.append(editMoveFixture);
editSelected(editMoveTarget);editMoveTarget.textContent='First edit';pageEvent('input',editMoveTarget);root.pageEditButton.emit('click');
pageEvent('pointerdown',editMoveTarget);root.pageGrip.emit('keydown',{altKey:true,key:'ArrowRight'});root.pageEditButton.emit('click');assert.equal(editMoveTarget.getAttribute('contenteditable'),'plaintext-only');assert.equal(editMoveTarget.style.getPropertyValue('-webkit-user-modify'),'');assert.equal(editMoveTarget.style.getPropertyValue('-moz-user-modify'),'');
editMoveTarget.textContent='Edited after moving';pageEvent('input',editMoveTarget);click('color','#16a34a');root.pageEditButton.emit('click');
click('action','clear');assert.equal(editMoveFixture.children[0],editMoveTarget);assert.equal(editMoveTarget.textContent,'Movable text');assert.equal(editMoveTarget.style.getPropertyValue('color'),'purple');assert.equal(editMoveTarget.style.getPropertyValue('position'),'');
click('action','undo');assert.equal(editMoveTarget.textContent,'Edited after moving');assert.equal(editMoveTarget.style.getPropertyValue('color'),'#16a34a');assert.notEqual(editMoveFixture.children[0],editMoveTarget);
click('action','clear');assert.equal(editMoveTarget.style.getPropertyValue('position'),'');editMoveFixture.remove();
// Navigate sibling -> parent -> first child -> next sibling -> next outer sibling.
const navSection=new El('SECTION'),navWrapper=new El('DIV'),navFirst=new El('A'),navSecond=new El('BUTTON'),navAfter=new El('P');
navFirst.textContent='Standalone';navSecond.textContent='Try it here';navAfter.textContent='Help';navWrapper.append(navFirst,navSecond);navSection.append(navWrapper,navAfter);document.documentElement.append(navSection);
const arrow=key=>document.emit('keydown',{key,composedPath:()=>[document.documentElement]});
pageEvent('pointerdown',navSecond);
for(const [key,el] of [['ArrowLeft',navFirst],['ArrowLeft',navWrapper],['ArrowRight',navFirst],['ArrowRight',navSecond],['ArrowRight',navAfter]]){arrow(key);assert.equal(root.elementName.textContent,el.tagName.toLowerCase());}
pageEvent('pointerdown',navSecond);arrow('ArrowUp');assert.equal(navSecond.style.getPropertyValue('z-index'),'1');assert.equal(navSecond.style.getPropertyValue('position'),'relative');arrow('ArrowDown');assert.equal(navSecond.style.getPropertyValue('z-index'),'0');
const paddingField=root.cssInputs.find(el=>el.dataset.css==='padding');paddingField.value='8px 16px';paddingField.emit('change');assert.equal(navSecond.style.getPropertyValue('padding'),'8px 16px');
paddingField.value='invalid';paddingField.emit('change');assert.equal(navSecond.style.getPropertyValue('padding'),'8px 16px');assert(paddingField.validation);
click('action','undo');assert.equal(navSecond.style.getPropertyValue('padding'),'');
pageEvent('pointerdown',navSecond);root.pageGrip.emit('keydown',{key:'ArrowRight',altKey:true});arrow('ArrowUp');assert.equal(root.pageFloats.children[0].style.zIndex,'1');
arrow('ArrowLeft');assert.equal(root.elementName.textContent,'a');arrow('ArrowRight');assert.equal(root.elementName.textContent,'button');
click('action','clear');assert.equal(navSecond.style.getPropertyValue('z-index'),'');assert.equal(navSecond.style.getPropertyValue('position'),'');assert.equal(navWrapper.children[1],navSecond);navSection.remove();
// Page selection is an overlay only; lifting preserves a placeholder and the original nodes.
const fixture=new El('SECTION'),movable=new El('ARTICLE'),neighbor=new El('P'),inner=new El('SPAN');
movable.rect={left:100,top:180,width:240,height:90};inner.textContent='Move this card';movable.append(inner);neighbor.textContent='Stay here';fixture.append(movable,neighbor);document.documentElement.append(fixture);
movable.style.setProperty('color','blue');const originalMoveStyle=movable.getAttribute('style');let originalClicks=0;inner.addEventListener('click',()=>originalClicks++);
click('mode','select');pageEvent('pointerdown',movable);assert.equal(root.pageOutline.hidden,false);assert.equal(root.pageControls.hidden,false);assert.equal(fixture.children[0],movable);assert.equal(movable.getAttribute('style'),originalMoveStyle);assert.equal(root.pageFloats.children.length,0);assert.equal(root.pageControls.style.top,'136px');
movable.rect.top=2;window.emit('scroll');assert.equal(root.pageControls.style.top,'100px');movable.rect.top=180;
const moveElement=(type,x,y)=>root.pageGrip.emit(type,{button:0,pointerId:21,clientX:x,clientY:y});
moveElement('pointerdown',110,150);assert.equal(fixture.children[0],movable);moveElement('pointerup',110,150);assert.equal(fixture.children[0],movable);
moveElement('pointerdown',110,150);moveElement('pointermove',150,180);let slot=fixture.children[0];assert.notEqual(slot,movable);assert.equal(slot.tagName,'ARTICLE');assert.equal(slot.style.getPropertyValue('visibility'),'hidden');assert.equal(slot.style.getPropertyValue('opacity'),'0');assert.equal(slot.getAttribute('inert'),'');assert.equal(slot.getAttribute('aria-hidden'),'true');assert.equal(fixture.children[1],neighbor);assert.equal(movable.parentNode,root.pageFloats.children[0]);assert.equal(inner.parentNode,movable);
root.pageGrip.emit('pointercancel');assert.equal(fixture.children[0],movable);assert.equal(root.pageFloats.children.length,0);assert.equal(movable.getAttribute('style'),originalMoveStyle);
moveElement('pointerdown',110,150);moveElement('pointerup',180,190);assert.equal(root.pageFloats.children[0].style.left,'170px');assert.equal(root.pageFloats.children[0].style.top,'220px');assert.equal(root.pageGrip.capture,null);
click('action','undo');assert.equal(fixture.children[0],movable);assert.equal(movable.getAttribute('style'),originalMoveStyle);assert.equal(root.pageControls.hidden,true);
pageEvent('pointerdown',movable);root.pageDelete.emit('click');assert.notEqual(fixture.children[0],movable);assert.equal(root.pageFloats.children[0].hidden,true);assert.equal(root.pageControls.hidden,true);click('action','undo');assert.equal(fixture.children[0],movable);assert.equal(root.pageFloats.children.length,0);
pageEvent('pointerdown',movable);root.pageGrip.emit('keydown',{altKey:true,key:'ArrowRight',shiftKey:true});assert.equal(root.pageFloats.children[0].style.left,'101px');
click('action','hide');assert.equal(root.pageControls.hidden,true);assert.equal(root.pageFloats.children[0].hidden,false);click('action','hide');
click('action','clear');assert.equal(fixture.children[0],movable);assert.equal(root.pageFloats.children.length,0);click('action','undo');assert.equal(root.pageFloats.children[0].style.left,'101px');assert.notEqual(fixture.children[0],movable);
inner.emit('click');assert.equal(originalClicks,1);fixture.remove();heading.remove();
confirmResult=true;escape();assert.equal(document.documentElement.children.length,0);assert.equal(fixture.children[0],movable);assert.equal(movable.children[0],inner);assert.equal(movable.getAttribute('style'),originalMoveStyle);assert.equal(document.handlers.keydown.length,0);assert.equal(window.handlers.resize.length,0);assert.equal(heading.innerHTML,originalHeading);assert.equal(heading.children[1],emphasis);assert.equal(heading.getAttribute('contenteditable'),null);assert.equal(heading.style.getPropertyValue('outline'),'1px dashed black');assert.equal(heading.style.getPropertyValue('color'),'rgb(20, 30, 40)');for(const event of ['pointerdown','click','auxclick','focusin','input','beforeinput','keyup'])assert.equal(document.handlers[event].length,0);
console.log('PASS: page editing/styling/focus/undo/clear/restoration/cleanup, text creation/editing/moving/colors/undo/delete, independent grid margins, toolbar dragging/clamping/resize/keyboard, guide placement, shape selection/movement, constrained guides/circles/rectangles, arrows, colors, cancellation, undo/delete/clear, browse, hiding, cleanup.');
