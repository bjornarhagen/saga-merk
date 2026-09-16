(() => {
  const key = '__pageMarkerOverlay';
  if (window[key]) { if(window[key].requestClose)window[key].requestClose();else window[key].remove();return; }
  const host = document.createElement('div');
  host.style.cssText = 'all:initial!important;position:fixed!important;inset:0!important;z-index:2147483647!important;pointer-events:none!important;';
  const root = host.attachShadow({mode:'open'});
  root.innerHTML = `<style>
    :host{all:initial}*{box-sizing:border-box}svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:auto;touch-action:none;cursor:crosshair}
    .grid{background-origin:border-box;position:absolute;pointer-events:none;border:1px solid #2563eb80;background-image:linear-gradient(to right,#2563eb30 1px,transparent 1px),linear-gradient(to bottom,#2563eb30 1px,transparent 1px);box-sizing:border-box}.grid[hidden]{display:none}
    .dimensions{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .35s ease}.dimensions.visible{opacity:1}.dimension{position:absolute;padding:5px 9px;border:1px solid #ffffff55;border-radius:6px;background:#172438ed;color:#fff;box-shadow:0 2px 8px #0003;font:600 12px/1.4 system-ui;white-space:nowrap}.dimension-width{transform:translateX(-50%)}.dimension-height{transform:translateY(-50%)}
    .bar{position:absolute;top:16px;left:50%;transform:translateX(-50%);width:660px;max-width:calc(100vw - 24px);max-height:calc(100vh - 24px);overflow:auto;display:block;padding:14px;background:linear-gradient(135deg,#27354ae6,#101b2bd9);color:#edf5ff;border:1px solid #ffffff38;border-radius:20px;box-shadow:0 16px 48px #07122450,inset 0 1px 0 #ffffff24;backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%);pointer-events:auto;font:13px system-ui;-webkit-font-smoothing:antialiased}
    button,input,select{font:inherit}button{border:1px solid #ffffff12;border-radius:9px;background:#ffffff0d;color:inherit;padding:8px 10px;cursor:pointer;white-space:nowrap;transition:background .15s,border-color .15s}button:hover{background:#ffffff20;border-color:#ffffff35}button[aria-pressed=true]{background:#c6e4ff;color:#132941;border-color:#e8f5ff;box-shadow:0 2px 8px #0002}button:disabled{opacity:.35;cursor:default}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #a6d9ff;outline-offset:2px}
    .drag-handle{flex:1;min-width:0;display:flex;align-items:center;gap:9px;padding:4px 0;margin:0;border:0;border-radius:0;background:transparent!important;cursor:grab;touch-action:none;user-select:none;text-align:left}.drag-handle:active,.bar.moving .drag-handle{cursor:grabbing}.grip{font-size:22px;line-height:1;color:#a9c6df}.brand{font-size:12px;font-weight:650;letter-spacing:.5px}.drag-note{margin-left:auto;font-size:11px;color:#aec1d8}
    .grid-label{display:flex;align-items:center;gap:6px;font-size:11px;color:#bdcde0}.margin{width:62px}input[type=number],select{padding:7px;border:1px solid #ffffff18;border-radius:8px;background:#08132250;color:#edf5ff;color-scheme:dark}select option{background:#172438;color:white}input[type=color]{width:28px;height:30px;padding:1px;border:0;background:none;cursor:pointer}.hint{flex-basis:100%;text-align:center;font-size:10px;line-height:1.5;color:#aec1d8;padding:5px 2px 0}.bar.hidden{display:none}
    .swatch{width:24px;height:24px;padding:0;border:2px solid #ffffff80;border-radius:50%;background:var(--color);box-shadow:0 2px 5px #0003}.swatch:hover{background:var(--color);border-color:white}.swatch[aria-pressed=true]{background:var(--color);outline:2px solid #e6f2ff;outline-offset:2px}
    .toolbar-head{display:flex;align-items:center;gap:8px;padding-bottom:12px}.toolbar-head>button:not(.drag-handle){font-size:11px;padding:6px 9px}.tools{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;padding-bottom:12px}.tools button{padding:9px 3px;font-size:12px}.settings-row{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:12px 0;border-top:1px solid #ffffff14}.row-title{width:42px;flex-shrink:0;color:#8fa9c5;font-size:10px;font-weight:650;text-transform:uppercase;letter-spacing:1px}.color-group{display:flex;align-items:center;gap:9px}.setting{display:flex;align-items:center;gap:8px;color:#bdcde0;font-size:11px}.grid-label{gap:5px}.toolbar-foot{display:flex;align-items:center;gap:6px;padding-top:10px;border-top:1px solid #ffffff14}.toolbar-foot button{font-size:11px;padding:6px 10px}.shortcuts{margin-left:auto;color:#91abc6;font-size:10px}.hint{text-align:left;padding:10px 0 0;font-size:10px;color:#91abc6}@media(max-width:560px){.tools{grid-template-columns:repeat(4,minmax(0,1fr))}.settings-row{gap:9px}.row-title{width:100%}.drag-note{display:none}.shortcuts{font-size:9px}}
    .bar.page-mode .line-setting{display:none}
    .tools kbd{display:block;margin-top:4px;font:10px system-ui;opacity:.55}
    .texts{position:absolute;inset:0;pointer-events:none}.textbox{position:absolute;width:240px;max-width:calc(100vw - 24px);padding:3px;border:1px solid transparent;border-radius:4px;background:transparent;pointer-events:auto;cursor:grab;touch-action:none}.textbox:active{cursor:grabbing}.textbox.selected{border-color:#60a5fa}.textbox textarea{display:block;box-sizing:border-box;width:100%;min-height:32px;padding:3px;border:0;outline:none;background:transparent;color:inherit;font:500 16px/1.4 system-ui;resize:none;overflow:hidden;white-space:pre-wrap;overflow-wrap:anywhere;pointer-events:none}.textbox.editing{cursor:text}.textbox.editing textarea{pointer-events:auto;cursor:text;touch-action:auto}.texts.pass,.texts.pass *{pointer-events:none!important}.texts.clean .textbox{border-color:transparent}.texts.clean textarea{outline:none}
    .hit{pointer-events:stroke;cursor:grab}.ink,.selection{pointer-events:none}.selection{stroke:#fff;stroke-dasharray:4 4;filter:drop-shadow(0 0 1px #000)}svg.pass,svg.pass *{pointer-events:none!important}svg.select{cursor:default}svg.dragging,svg.dragging .hit{cursor:grabbing}svg.clean .selection{display:none}
    </style><div class="grid" hidden aria-hidden="true"></div><svg xmlns="http://www.w3.org/2000/svg"></svg><div class="texts"></div><div class="dimensions" aria-hidden="true"><span class="dimension dimension-width"></span><span class="dimension dimension-height"></span></div><div class="bar" role="toolbar" aria-label="Page drawing tools">
    <div class="toolbar-head"><button class="drag-handle" title="Drag to move the toolbar; arrow keys also move it" aria-label="Move toolbar"><span class="grip" aria-hidden="true">⠿</span><span class="brand">SAGA MERK</span><span class="drag-note">Drag to move</span></button><button data-action="hide">Hide toolbar</button><button data-action="close" aria-label="Close drawing tools">✕</button></div>
    <div class="tools" role="group" aria-label="Drawing tools"><button data-mode="select" title="Click an existing mark to select it; drag to move (1)" aria-keyshortcuts="1">↖ Select<kbd aria-hidden="true">1</kbd></button><button data-mode="v" title="Click or drag to place a vertical guide (2)" aria-keyshortcuts="2">│ Vertical<kbd aria-hidden="true">2</kbd></button><button data-mode="h" title="Click or drag to place a horizontal guide (3)" aria-keyshortcuts="3">─ Horizontal<kbd aria-hidden="true">3</kbd></button><button data-mode="circle" title="Drag an oval; Shift for a circle (4)" aria-keyshortcuts="4">○ Circle<kbd aria-hidden="true">4</kbd></button><button data-mode="arrow" title="Drag an arrow; Shift to snap direction (5)" aria-keyshortcuts="5">↗ Arrow<kbd aria-hidden="true">5</kbd></button><button data-mode="text" title="Click the page to add editable text (6)" aria-keyshortcuts="6">T Text<kbd aria-hidden="true">6</kbd></button><button data-mode="browse" title="Interact with the underlying page (7)" aria-keyshortcuts="7">Browse<kbd aria-hidden="true">7</kbd></button><button data-mode="counter" title="Click or drag to place the next number (8)" aria-keyshortcuts="8"># Counter<kbd aria-hidden="true">8</kbd></button><button data-mode="page" title="Click page text to edit its content and style (9)" aria-keyshortcuts="9">✎ Edit page<kbd aria-hidden="true">9</kbd></button></div>
    <div class="settings-row"><span class="row-title">Style</span><div class="color-group"><button class="swatch" style="--color:#ff263f" data-color="#ff263f" aria-label="Red" title="Red"></button><button class="swatch" style="--color:#16a34a" data-color="#16a34a" aria-label="Green" title="Green"></button><button class="swatch" style="--color:#2563eb" data-color="#2563eb" aria-label="Blue" title="Blue"></button><input type="color" value="#ff263f" aria-label="Drawing color"></div><label class="setting line-setting">Line width <select aria-label="Stroke width"><option value="1">1 px</option><option value="2" selected>2 px</option><option value="4">4 px</option><option value="6">6 px</option></select></label><label class="setting">Text size <select data-text-size aria-label="Text size"><option value="12">12 px</option><option value="16" selected>16 px</option><option value="20">20 px</option><option value="24">24 px</option><option value="32">32 px</option><option value="48">48 px</option><option value="64">64 px</option></select></label></div>
    <div class="settings-row"><span class="row-title">Grid</span><button data-action="grid" aria-pressed="false" title="Show or hide the alignment grid">Grid</button><label class="grid-label">Spacing <select data-grid-spacing aria-label="Grid spacing"><option value="8">8 px</option><option value="16">16 px</option><option value="24">24 px</option><option value="32" selected>32 px</option><option value="64">64 px</option><option value="128">128 px</option></select></label><label class="grid-label" title="Inset from the left and right edges">Left/right <input class="margin" data-grid-margin-x type="number" min="0" step="8" value="32" aria-label="Horizontal grid margin in pixels"> px</label><label class="grid-label" title="Inset from the top and bottom edges">Top/bottom <input class="margin" data-grid-margin-y type="number" min="0" step="8" value="32" aria-label="Vertical grid margin in pixels"> px</label></div>
    <div class="toolbar-foot"><button data-action="undo">Undo</button><button data-action="delete">Delete</button><button data-action="clear">Clear</button><span class="shortcuts">1–9 tools · H hide / show · Esc close</span></div><div class="hint">Drag marks to move · Double-click text to edit · Shift for fine adjustments</div></div>`;
  const svg = root.querySelector('svg'), bar = root.querySelector('.bar');
  const textLayer = root.querySelector('.texts'), textNodes = new Map();
  let textEdit = null;
  const textSizeInput = root.querySelector('[data-text-size]');
  const isText = s => s.kind==='text'||s.kind==='counter';
  const colorInput = root.querySelector('input'), widthInput = root.querySelector('select');
  let activeCapture = null, toolBeforeHide = 'v';
  let mode = 'v', active = null, shapes = [], selected = null, nextId = 1;
  const history = [];
  let pageEdit = null;
  const pageOriginals = new Map();
  const hint = root.querySelector('.hint');
  const defaultHint = hint.textContent;
  const currentSizeOption = document.createElement('option');
  currentSizeOption.hidden=true;textSizeInput.append(currentSizeOption);
  function pushHistory(entry){history.push(entry);if(history.length>100)history.shift();}
  function readStyle(el,name){return [el.style.getPropertyValue(name),el.style.getPropertyPriority(name)];}
  function restoreStyle(el,name,[value,priority]){if(value)el.style.setProperty(name,value,priority);else el.style.removeProperty(name);}
  // Keep the original nodes so undo preserves descendant identity and event listeners.
  function captureTree(el){return {el,data:el.nodeType===3||el.nodeType===8?el.data:null,children:[...el.childNodes].map(captureTree)};}
  function restoreTree(tree){if(tree.data!==null)tree.el.data=tree.data;else{const children=tree.children.map(child=>child.el);if(children.length!==tree.el.childNodes.length||children.some((child,i)=>child!==tree.el.childNodes[i]))tree.el.replaceChildren(...children);tree.children.forEach(restoreTree);}}
  function capturePage(el){return {tree:captureTree(el),html:el.innerHTML,color:readStyle(el,'color'),fontSize:readStyle(el,'font-size')};}
  function restorePage(el,state){restoreTree(state.tree);restoreStyle(el,'color',state.color);restoreStyle(el,'font-size',state.fontSize);}
  function commitPage(){
    if(!pageEdit)return;
    const {el,before}=pageEdit,after=capturePage(el);
    if(before.html!==after.html||JSON.stringify([before.color,before.fontSize])!==JSON.stringify([after.color,after.fontSize]))pushHistory(()=>restorePage(el,before));
    pageEdit.before=after;
  }
  function endPageEdit(){
    if(!pageEdit)return;commitPage();
    const edit=pageEdit;pageEdit=null;
    if(edit.editable===null)edit.el.removeAttribute('contenteditable');else edit.el.setAttribute('contenteditable',edit.editable);
    restoreStyle(edit.el,'outline',edit.outline);restoreStyle(edit.el,'outline-offset',edit.outlineOffset);
    edit.el.blur();colorInput.value=edit.color;textSizeInput.value=edit.size;currentSizeOption.hidden=true;syncColors();
    hint.textContent=mode==='page'?'Click page text to edit · Choose a color or text size · Changes are temporary':defaultHint;
  }
  function syncPageStyle(){
    const computed=window.getComputedStyle(pageEdit.el),rgb=computed.color.match(/[\d.]+/g);
    if(rgb&&rgb.length>=3)colorInput.value='#'+rgb.slice(0,3).map(n=>Math.round(Number(n)).toString(16).padStart(2,'0')).join('');
    const size=String(parseFloat(computed.fontSize));
    currentSizeOption.value=size;currentSizeOption.textContent=`${size} px (page)`;currentSizeOption.hidden=false;textSizeInput.value=size;syncColors();
  }
  function pageTarget(e){
    const path=e.composedPath();if(path.includes(host))return null;
    const el=path[0];
    if(!(el instanceof Element)||el.namespaceURI!=='http://www.w3.org/1999/xhtml'||el.closest('input,textarea,select,option,script,style,noscript,iframe,svg,[contenteditable]'))return null;
    if(['HTML','BODY'].includes(el.tagName)||!el.textContent.trim())return null;
    // Avoid turning layout containers (and their controls) into one large editor.
    if(el.querySelector('input,textarea,select,button,[contenteditable],h1,h2,h3,h4,h5,h6,p,div,section,article,ul,ol,table'))return null;
    return el;
  }
  function onPagePointer(e){
    if(mode!=='page'||e.button!==0||e.composedPath().includes(host))return;
    if(pageEdit&&pageEdit.el.contains(e.composedPath()[0])){e.stopImmediatePropagation();return;}
    const el=pageTarget(e);endPageEdit();
    if(!el){render();return;}
    e.stopImmediatePropagation();
    const before=capturePage(el);if(!pageOriginals.has(el))pageOriginals.set(el,before);
    pageEdit={el,before,editable:el.getAttribute('contenteditable'),outline:readStyle(el,'outline'),outlineOffset:readStyle(el,'outline-offset'),color:colorInput.value,size:textSizeInput.value};
    selected=null;el.setAttribute('contenteditable','plaintext-only');el.style.setProperty('outline','2px solid #60a5fa','important');el.style.setProperty('outline-offset','3px','important');
    el.focus({preventScroll:true});syncPageStyle();hint.textContent='Editing page text · Color and text size apply here · Click elsewhere to finish';render();
  }
  function onPageClick(e){if(mode==='page'&&!e.composedPath().includes(host)){e.preventDefault();e.stopImmediatePropagation();}}
  function onPageFocus(e){if(pageEdit&&!e.composedPath().includes(host)&&!pageEdit.el.contains(e.composedPath()[0])){endPageEdit();render();}}
  function onPageInput(e){if(pageEdit&&pageEdit.el.contains(e.composedPath()[0])){e.stopImmediatePropagation();render();}}
  function onPageTyping(e){if(pageEdit&&pageEdit.el.contains(e.composedPath()[0]))e.stopImmediatePropagation();}
  const pageListeners=[['pointerdown',onPagePointer],['click',onPageClick],['auxclick',onPageClick],['focusin',onPageFocus],['input',onPageInput],['beforeinput',onPageTyping],['keyup',onPageTyping]];
  for(const [event,handler] of pageListeners)document.addEventListener(event,handler,true);
  function clearAll(){
    commitText(true);endPageEdit();cancel();
    const before=snapshot(),pages=[...pageOriginals].map(([el])=>[el,capturePage(el)]);
    for(const [el,state] of [...pageOriginals].reverse())restorePage(el,state);
    shapes=[];selected=null;
    if(before.length||pages.length)pushHistory(()=>{shapes=before;for(const [el,state] of pages.reverse())restorePage(el,state);});
    render();
  }

  const grid = root.querySelector('.grid'), gridSpacing = root.querySelector('[data-grid-spacing]'), gridMarginX = root.querySelector('[data-grid-margin-x]'), gridMarginY = root.querySelector('[data-grid-margin-y]');
  const dimensions=root.querySelector('.dimensions'),dimensionWidth=root.querySelector('.dimension-width'),dimensionHeight=root.querySelector('.dimension-height');
  let dimensionTimer=null;
  function showDimensions(){
    window.clearTimeout(dimensionTimer);
    dimensions.classList.toggle('visible',gridVisible);
    dimensionTimer=window.setTimeout(()=>dimensions.classList.remove('visible'),900);
  }
  let gridVisible = false;
  function updateGrid() {
    const spacing = Number(gridSpacing.value), x = Number(gridMarginX.value), y = Number(gridMarginY.value);
    if(![8,16,24,32,64,128].includes(spacing)||![gridMarginX,gridMarginY].every(input=>Number.isFinite(Number(input.value))&&Number(input.value)>=0&&input.value.trim()!==''))return;
    grid.hidden=!gridVisible;
    grid.style.inset=`${y}px ${x}px`;
    grid.style.backgroundSize=`${spacing}px ${spacing}px`;
    const width=Math.max(0,window.innerWidth-2*x),height=Math.max(0,window.innerHeight-2*y);
    dimensionWidth.textContent=`Width ${width} px`;dimensionHeight.textContent=`Height ${height} px`;
    dimensionWidth.style.left=`${window.innerWidth/2}px`;dimensionWidth.style.top=`${Math.min(y+8,Math.max(0,window.innerHeight-32))}px`;
    dimensionHeight.style.left=`${Math.min(x+8,Math.max(0,window.innerWidth-120))}px`;dimensionHeight.style.top=`${window.innerHeight/2}px`;
    if(!gridVisible)dimensions.classList.remove('visible');
    root.querySelector('[data-action="grid"]').setAttribute('aria-pressed',String(gridVisible));
  }
  window.addEventListener('resize',updateGrid);
  gridSpacing.addEventListener('change',updateGrid);
  const marginInputs=[gridMarginX,gridMarginY];
  const marginSizes=[8,16,32,64,128,256,512,1024];
  function setMarginStep(e){const step=e.shiftKey?'1':'8';for(const input of marginInputs)input.step=step;}
  function resetMarginStep(){for(const input of marginInputs)input.step='8';}
  document.addEventListener('keydown',setMarginStep,true);
  document.addEventListener('keyup',setMarginStep,true);
  window.addEventListener('blur',resetMarginStep);
  for(const input of marginInputs){
    input.title='Step 8 px; Shift for 1 px; Cmd + Up/Down jumps 8, 16, 32, 64, 128, 256, 512, 1024';
    input.addEventListener('pointerdown',setMarginStep);
    input.addEventListener('keydown',e=>{
      if(e.key!=='ArrowUp'&&e.key!=='ArrowDown')return;
      e.preventDefault();e.stopPropagation();
      const value=Number(input.value),base=input.value.trim()!==''&&Number.isFinite(value)?Math.round(value):32;
      const up=e.key==='ArrowUp';
      const next=e.metaKey?(up?(marginSizes.find(size=>size>base)??1024):([...marginSizes].reverse().find(size=>size<base)??8)):Math.max(0,base+(up?1:-1)*(e.shiftKey?1:8));
      input.value=String(next);updateGrid();showDimensions();
    });
    input.addEventListener('input',()=>{updateGrid();showDimensions();});
    input.addEventListener('change',()=>{const value=Number(input.value);input.value=String(Number.isFinite(value)&&input.value.trim()!==''?Math.max(0,Math.round(value)):32);updateGrid();showDimensions();});
  }
  const handle = root.querySelector('.drag-handle');
  let toolbarDrag = null, toolbarPosition = null;
  function placeToolbar(x,y) {
    const rect=bar.getBoundingClientRect(), gap=12;
    toolbarPosition={x:Math.max(gap,Math.min(x,window.innerWidth-rect.width-gap)),y:Math.max(gap,Math.min(y,window.innerHeight-rect.height-gap))};
    bar.style.transform='none';bar.style.left=`${toolbarPosition.x}px`;bar.style.top=`${toolbarPosition.y}px`;
  }
  function keepToolbarVisible(){if(toolbarPosition&&!bar.classList.contains('hidden'))placeToolbar(toolbarPosition.x,toolbarPosition.y);}
  handle.addEventListener('pointerdown',e=>{
    if(e.button!==0||toolbarDrag)return;e.preventDefault();const rect=bar.getBoundingClientRect();
    toolbarDrag={pointer:e.pointerId,dx:e.clientX-rect.left,dy:e.clientY-rect.top};
    placeToolbar(rect.left,rect.top);handle.setPointerCapture(e.pointerId);bar.classList.add('moving');
  });
  function moveToolbar(e){if(toolbarDrag&&e.pointerId===toolbarDrag.pointer){e.preventDefault();placeToolbar(e.clientX-toolbarDrag.dx,e.clientY-toolbarDrag.dy);}}
  function stopToolbarDrag(){const pointer=toolbarDrag?.pointer;toolbarDrag=null;bar.classList.remove('moving');if(pointer!==undefined&&handle.hasPointerCapture(pointer))handle.releasePointerCapture(pointer);}
  handle.addEventListener('pointermove',moveToolbar);
  handle.addEventListener('pointerup',e=>{if(toolbarDrag&&e.pointerId===toolbarDrag.pointer){moveToolbar(e);stopToolbarDrag();}});
  handle.addEventListener('pointercancel',stopToolbarDrag);
  handle.addEventListener('lostpointercapture',stopToolbarDrag);
  handle.addEventListener('keydown',e=>{const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!delta)return;e.preventDefault();e.stopPropagation();const rect=bar.getBoundingClientRect(),step=e.shiftKey?1:10;placeToolbar(rect.left+delta[0]*step,rect.top+delta[1]*step);});
  window.addEventListener('resize',keepToolbarVisible);
  const snapshot = () => shapes.map(s => ({...s}));
  function remember(before) { if(JSON.stringify(before)!==JSON.stringify(shapes)) { pushHistory(before); } }
  function setMode(value) { commitText(true);endPageEdit();mode=value;bar.classList.toggle('page-mode',value==='page');hint.textContent=value==='page'?'Click page text to edit · Choose a color or text size · Changes are temporary':defaultHint;textLayer.classList.toggle('pass',value==='browse'||value==='page'); svg.classList.toggle('pass',value==='browse'||value==='page'); svg.classList.toggle('select',value==='select'); if(value==='browse'||value==='page')selected=null; root.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===value))); render(); }
  host.remove = remove;
  host.requestClose = requestClose;
  function requestClose() { if(window.confirm('Close Saga Merk and discard all your annotations and page edits?\n\nTip: press H to hide the toolbar and switch to Browse mode while keeping your content.'))remove(); }
  function remove() { endPageEdit();for(const [el,state] of [...pageOriginals].reverse())restorePage(el,state);for(const [event,handler] of pageListeners)document.removeEventListener(event,handler,true);window.clearTimeout(dimensionTimer);window.removeEventListener('resize',updateGrid); document.removeEventListener('keydown',setMarginStep,true);document.removeEventListener('keyup',setMarginStep,true);window.removeEventListener('blur',resetMarginStep);stopToolbarDrag();window.removeEventListener('resize',keepToolbarVisible);document.removeEventListener('keydown',keyboard,true); Element.prototype.remove.call(host); if(window[key]===host) delete window[key]; }
  function finishCapture() { const pointer=active?.pointer;active=null;const capture=activeCapture;activeCapture=null;if(pointer!==undefined&&capture?.hasPointerCapture(pointer))capture.releasePointerCapture(pointer);svg.classList.remove('dragging'); }
  function cancel() { if(!active)return;shapes=active.before;finishCapture();if(!shapes.some(s=>s.id===selected))selected=null;render(); }
  function undo() { commitText(true);endPageEdit();if(active){cancel();return;}if(history.length){const entry=history.pop();if(typeof entry==='function')entry();else shapes=entry;selected=null;render();} }
  function deleteSelected() { commitText(true);if(active)cancel();const before=snapshot();shapes=shapes.filter(s=>s.id!==selected);selected=null;remember(before);render(); }
  function hideToolbar() { commitText(true);const hiding=!bar.classList.contains('hidden');if(hiding){toolBeforeHide=mode;cancel();stopToolbarDrag();setMode('browse');}else setMode(toolBeforeHide);bar.classList.toggle('hidden');svg.classList.toggle('clean',bar.classList.contains('hidden'));textLayer.classList.toggle('clean',bar.classList.contains('hidden'));keepToolbarVisible(); }
  const toolKeys={'1':'select','2':'v','3':'h','4':'circle','5':'arrow','6':'text','7':'browse','8':'counter','9':'page'};
  function keyboard(e) {
    if(pageEdit&&pageEdit.el.contains(e.composedPath()[0])&&e.key!=='Escape'){e.stopImmediatePropagation();return;}
    if(e.isComposing)return;
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();if(!e.repeat)requestClose();return;}
    const target=e.composedPath()[0]; if(target && (['INPUT','TEXTAREA','SELECT'].includes(target.tagName)||target.isContentEditable)) return;
    let handled=true;
    if(toolKeys[e.key]&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey){cancel();if(bar.classList.contains('hidden'))hideToolbar();setMode(toolKeys[e.key]);}
    else if(e.key.toLowerCase()==='h'&&!e.metaKey&&!e.ctrlKey&&!e.altKey)hideToolbar();
    else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&mode!=='browse')undo();
    else if((e.key==='Delete'||e.key==='Backspace')&&selected!==null&&mode!=='browse')deleteSelected();
    else handled=false;
    if(handled){e.preventDefault();e.stopPropagation();}
  }
  function syncColors() { root.querySelectorAll('[data-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color===colorInput.value))); }
  function changeStyle(field,value) { if(pageEdit){if(field==='color'||field==='fontSize'){commitPage();pageEdit.el.style.setProperty(field==='color'?'color':'font-size',field==='color'?value:`${value}px`,'important');commitPage();syncColors();render();}return;}commitText(true);const before=snapshot(), s=shapes.find(s=>s.id===selected);if(s&&(field!=='fontSize'||isText(s)))s[field]=value;remember(before);syncColors();render(); }
  colorInput.addEventListener('change',()=>changeStyle('color',colorInput.value));
  widthInput.addEventListener('change',()=>changeStyle('width',Number(widthInput.value)));
  textSizeInput.addEventListener('change',()=>changeStyle('fontSize',Number(textSizeInput.value)));
  bar.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.mode)setMode(b.dataset.mode);
    else if(b.dataset.color){colorInput.value=b.dataset.color;changeStyle('color',b.dataset.color);}
    else switch(b.dataset.action){case 'grid':gridVisible=!gridVisible;updateGrid();break;case 'undo':undo();break;case 'delete':deleteSelected();break;case 'clear':clearAll();break;case 'hide':hideToolbar();break;case 'close':requestClose();}
  });
  function node(tag,attrs) { const el=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el; }
  function geometry(s) {
    if(s.kind==='v')return ['line',{x1:s.x,x2:s.x,y1:0,y2:'100%'}];
    if(s.kind==='h')return ['line',{x1:0,x2:'100%',y1:s.y,y2:s.y}];
    if(s.kind==='circle')return ['ellipse',{cx:(s.x+s.x2)/2,cy:(s.y+s.y2)/2,rx:Math.abs(s.x2-s.x)/2,ry:Math.abs(s.y2-s.y)/2}];
    const angle=Math.atan2(s.y2-s.y,s.x2-s.x),len=Math.hypot(s.x2-s.x,s.y2-s.y),h=Math.min(len*.4,12+s.width*2),spread=.48;
    return ['path',{d:`M ${s.x} ${s.y} L ${s.x2} ${s.y2} M ${s.x2-h*Math.cos(angle-spread)} ${s.y2-h*Math.sin(angle-spread)} L ${s.x2} ${s.y2} L ${s.x2-h*Math.cos(angle+spread)} ${s.y2-h*Math.sin(angle+spread)}`}];
  }
  function commitText(blur=false){
    const edit=textEdit;textEdit=null;if(edit)remember(edit.before);
    if(blur&&edit)textNodes.get(edit.id)?.input.blur();
  }
  function sizeText(input){input.style.height='auto';input.style.height=`${Math.max(32,input.scrollHeight)}px`;}
  function renderText(){
    const live=new Set(shapes.filter(isText).map(s=>s.id));
    for(const [id,parts] of textNodes){if(!live.has(id)){parts.box.remove();textNodes.delete(id);}}
    for(const s of shapes.filter(isText)){
      let parts=textNodes.get(s.id);
      if(!parts){
        const box=document.createElement('div'),input=document.createElement('textarea');
        box.className='textbox';box.title=s.kind==='counter'?'Drag to move':'Drag to move; double-click to edit';input.readOnly=true;input.setAttribute('aria-label',s.kind==='counter'?'Counter number':'Annotation text');if(s.kind==='counter')input.tabIndex=-1;input.placeholder='Type your note…';input.rows=1;input.spellcheck=false;
        box.append(input);textLayer.append(box);parts={box,input};textNodes.set(s.id,parts);
        input.addEventListener('focus',()=>{if(mode==='browse'||s.kind==='counter'){input.blur();return;}commitText();input.readOnly=false;box.classList.add('editing');selected=s.id;const mark=shapes.find(m=>m.id===s.id);colorInput.value=mark.color;textSizeInput.value=String(mark.fontSize);syncColors();textEdit={id:s.id,before:snapshot()};render();});
        input.addEventListener('input',()=>{const mark=shapes.find(m=>m.id===s.id);if(mark)mark.text=input.value;sizeText(input);});
        input.addEventListener('blur',()=>{commitText();input.readOnly=true;box.classList.remove('editing');render();});
        box.addEventListener('lostpointercapture',()=>{if(active&&activeCapture===box)cancel();});
        box.addEventListener('dblclick',e=>{if(mode==='browse'||s.kind==='counter')return;e.preventDefault();e.stopPropagation();input.readOnly=false;input.focus();});
        input.addEventListener('keydown',e=>{e.stopPropagation();});
        box.addEventListener('pointerdown',e=>{
          if(textEdit?.id===s.id&&e.target===input)return;
          if(e.button!==0||mode==='browse'||mode==='page'||active)return;e.preventDefault();e.stopPropagation();commitText(true);
          const mark=shapes.find(m=>m.id===s.id);selected=mark.id;colorInput.value=mark.color;textSizeInput.value=String(mark.fontSize);syncColors();
          active={type:'move',id:mark.id,original:{...mark},x:e.clientX,y:e.clientY,pointer:e.pointerId,before:snapshot()};activeCapture=box;box.setPointerCapture(e.pointerId);render();
        });
      }
      parts.box.style.left=`${s.x}px`;parts.box.style.top=`${s.y}px`;parts.box.style.color=s.color;parts.box.classList.toggle('selected',s.id===selected);
      parts.input.style.fontSize=`${s.fontSize}px`;
      if(s.kind==='counter'){parts.box.style.font=`500 ${s.fontSize}px/1.4 system-ui`;parts.box.style.width=`calc(${s.text.length+0.5}ch + 14px)`;}
      if(parts.input.value!==s.text)parts.input.value=s.text;
      sizeText(parts.input);
    }
  }
  function render() {
    svg.replaceChildren();
    renderText();
    for(const s of shapes){
      if(isText(s))continue;
      const [tag,attrs]=geometry(s),g=node('g',{'data-id':s.id}), common={...attrs,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'};
      g.append(node(tag,{...common,class:'ink',stroke:s.color,'stroke-width':s.width}));
      if(s.id===selected)g.append(node(tag,{...common,class:'selection',stroke:'#fff','stroke-width':Math.max(1,s.width/2)}));
      g.append(node(tag,{...common,class:'hit',stroke:'transparent','stroke-width':Math.max(16,s.width+10)}));svg.append(g);
    }
    root.querySelector('[data-action="delete"]').disabled=selected===null;
    root.querySelector('[data-action="undo"]').disabled=!history.length&&!active&&!pageEdit;
  }
  svg.addEventListener('pointerdown',e=>{
    if(e.button!==0||mode==='browse'||mode==='page'||active)return;e.preventDefault();commitText(true);
    const hit=e.target.closest('[data-id]'),s=hit&&shapes.find(s=>s.id===Number(hit.dataset.id));
    const before=snapshot();
    if(s){selected=s.id;colorInput.value=s.color;widthInput.value=String(s.width);syncColors();active={type:'move',id:s.id,original:{...s},x:e.clientX,y:e.clientY,pointer:e.pointerId,before};}
    else {
      selected=null;
      if(mode==='select'){render();return;}
      const mark={id:nextId++,kind:mode,x:e.clientX,y:e.clientY,x2:e.clientX,y2:e.clientY,color:colorInput.value,width:Number(widthInput.value)};
      if(isText(mark))mark.fontSize=Number(textSizeInput.value);
      if(mode==='counter'){mark.text=String(shapes.reduce((max,s)=>s.kind==='counter'?Math.max(max,Number(s.text)):max,0)+1);selected=mark.id;}
      if(mode==='text'){mark.text='';shapes.push(mark);selected=mark.id;remember(before);render();textNodes.get(mark.id).input.focus();return;}
      shapes.push(mark);active={type:'draw',id:mark.id,x:e.clientX,y:e.clientY,pointer:e.pointerId,before};
    }
    activeCapture=svg;svg.setPointerCapture(e.pointerId);svg.classList.add('dragging');render();
  });
  function draw(e) {
    if(!active||e.pointerId!==active.pointer)return;
    const a=active,s=shapes.find(s=>s.id===a.id);let dx=e.clientX-a.x,dy=e.clientY-a.y;
    if(a.type==='move'){
      const o=a.original;if(s.kind==='v')dx=e.clientX-a.x,dy=0;else if(s.kind==='h')dx=0;
      s.x=o.x+dx;s.y=o.y+dy;s.x2=o.x2+dx;s.y2=o.y2+dy;
    } else if(s.kind==='v')s.x=e.clientX;
    else if(s.kind==='h')s.y=e.clientY;
    else if(s.kind==='counter'){s.x=e.clientX;s.y=e.clientY;}
    else {
      if(e.shiftKey){if(s.kind==='circle'){const side=Math.max(Math.abs(dx),Math.abs(dy));dx=(dx<0?-1:1)*side;dy=(dy<0?-1:1)*side;}else{const angle=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*Math.PI/4,len=Math.hypot(dx,dy);dx=Math.cos(angle)*len;dy=Math.sin(angle)*len;}}
      s.x2=a.x+dx;s.y2=a.y+dy;
    }
    render();
  }
  svg.addEventListener('pointermove',draw);
  function finishShape(e){
    if(!active||e.pointerId!==active.pointer)return;draw(e);const a=active,s=shapes.find(s=>s.id===a.id);
    if(a.type==='draw'&&s.kind!=='v'&&s.kind!=='h'&&s.kind!=='counter'&&Math.hypot(s.x2-s.x,s.y2-s.y)<=3)shapes=shapes.filter(mark=>mark.id!==a.id);
    remember(a.before);finishCapture();render();
  }
  svg.addEventListener('pointerup',finishShape);
  textLayer.addEventListener('pointermove',draw);
  textLayer.addEventListener('pointerup',finishShape);
  textLayer.addEventListener('pointercancel',cancel);
  textLayer.addEventListener('lostpointercapture',()=>{if(active&&activeCapture===textLayer)cancel();});
  svg.addEventListener('pointercancel',cancel);
  svg.addEventListener('lostpointercapture',()=>{if(active)cancel();});
  document.addEventListener('keydown',keyboard,true);document.documentElement.append(host);window[key]=host;updateGrid();syncColors();setMode(mode);
})();
