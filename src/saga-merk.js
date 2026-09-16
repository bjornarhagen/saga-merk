(() => {
  const key = '__pageMarkerOverlay';
  if (window[key]) { if(window[key].requestClose)window[key].requestClose();else window[key].remove();return; }
  const host = document.createElement('div');
  host.style.cssText = 'all:initial!important;position:fixed!important;inset:0!important;z-index:2147483647!important;pointer-events:none!important;';
  const root = host.attachShadow({mode:'open'});
  root.innerHTML = `<style>
    :host{all:initial}*{box-sizing:border-box}svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:auto;touch-action:none;cursor:crosshair}
    .grid{background-origin:border-box;position:absolute;pointer-events:none;border:1px solid #2563eb80;background-image:linear-gradient(to right,#2563eb30 1px,transparent 1px),linear-gradient(to bottom,#2563eb30 1px,transparent 1px);box-sizing:border-box}.grid[hidden]{display:none}
    .dimensions{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .35s ease}.dimensions.visible{opacity:1}.dimension{position:absolute;padding:5px 9px;border:1px solid #ffffff55;border-radius:0;background:#111;color:#e8e6e1;box-shadow:0 2px 8px #0003;font:12px/1.4 ui-monospace,monospace;white-space:nowrap}.dimension-width{transform:translateX(-50%)}.dimension-height{transform:translateY(-50%)}
    .bar{position:absolute;right:12px;bottom:12px;width:660px;max-width:calc(100% - 24px);max-height:calc(100% - 24px);overflow:auto;display:block;padding:16px;background:#111;color:#e8e6e1;border:1px solid #3b3832;border-top:2px solid #e89a3c;border-radius:0;box-shadow:0 16px 48px #0006;pointer-events:auto;font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;-webkit-font-smoothing:antialiased;color-scheme:dark}
    button,input,select{font:inherit}button{border:1px solid #34322e;border-radius:0;background:#171715;color:inherit;padding:8px 10px;cursor:pointer;white-space:nowrap;transition:background .15s,border-color .15s,color .15s}button:hover{background:#22201b;border-color:#e89a3c;color:#e89a3c}button[aria-pressed=true]{background:#e89a3c;color:#0a0a0a;border-color:#e89a3c;box-shadow:none}button:disabled{opacity:.35;cursor:default}button:disabled:hover{background:#171715;border-color:#34322e;color:inherit}button:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible{outline:2px solid #e89a3c;outline-offset:3px}
    .drag-handle{flex:1;min-width:0;display:flex;align-items:center;gap:10px;padding:4px 0;margin:0;border:0;border-radius:0;background:transparent!important;cursor:grab;touch-action:none;user-select:none;text-align:left}.drag-handle:active,.bar.moving .drag-handle{cursor:grabbing}.grip{font-size:22px;line-height:1;color:#e89a3c}.brand{font-size:13px;font-weight:500;letter-spacing:1.5px;color:#e8e6e1}.brand span{color:#e89a3c}.drag-note{margin-left:auto;font-size:10px;color:#a49e92}
    .grid-label{display:flex;align-items:center;gap:6px;font-size:11px;color:#c5c2bb}.margin{width:62px}input[type=number],select{padding:7px;border:1px solid #34322e;border-radius:0;background:#0a0a0a;color:#e8e6e1;color-scheme:dark}select option{background:#111;color:#e8e6e1}input[type=color]{width:28px;height:28px;padding:1px;border:1px solid #34322e;background:#0a0a0a;cursor:pointer}.bar.hidden{display:none}
    .swatch{width:22px;height:22px;padding:0;border:2px solid #111;border-radius:0;background:var(--color);box-shadow:0 0 0 1px #514d45}.swatch:hover{background:var(--color);border-color:#111}.swatch[aria-pressed=true]{background:var(--color);border-color:#111;outline:1px solid #e8e6e1;outline-offset:3px;box-shadow:none}
    .toolbar-head{display:flex;align-items:center;gap:8px;padding-bottom:16px}.toolbar-head>button:not(.drag-handle){font-size:10px;padding:6px 9px}.tools{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;padding:1px;margin-bottom:16px;background:#34322e}.tools button{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:11px 12px;font-size:12px;border-color:transparent;text-align:left}.tools button:hover{border-color:#e89a3c}.tools kbd{font-family:inherit;font-size:10px;line-height:1;opacity:.65;border:1px solid currentColor;min-width:19px;text-align:center;padding:1px 3px}
    .settings-row{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:14px 0;border-top:1px solid #2c2c2c}.row-title{width:42px;flex-shrink:0;color:#e89a3c;font-size:10px;font-weight:400;text-transform:uppercase;letter-spacing:1px}.color-group{display:flex;align-items:center;gap:10px}.setting{display:flex;align-items:center;gap:8px;color:#c5c2bb;font-size:11px}.grid-label{gap:5px}.toolbar-foot{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding-top:12px;border-top:1px solid #2c2c2c}.toolbar-foot button{font-size:11px;padding:6px 10px}.shortcuts{margin-left:auto;color:#a49e92;font-size:10px}.hint{text-align:left;padding:12px 0 0;font-size:10px;line-height:1.6;color:#a49e92}
    .toolbar-meta{display:flex;flex-wrap:wrap;align-items:baseline;gap:0 12px}.toolbar-meta .hint{flex:1;min-width:180px}.website-link{padding-top:12px;color:#e89a3c;font-size:10px;text-decoration:none;white-space:nowrap}.website-link:hover{color:#e8e6e1;text-decoration:underline;text-underline-offset:3px}
    .bar.page-mode .line-setting{display:none}
    @media(max-width:560px){.bar{padding:12px}.tools button{padding:10px 7px;font-size:11px}.settings-row{gap:10px}.row-title{width:100%}.drag-note{display:none}.shortcuts{width:100%;margin:4px 0 0;font-size:9px}.toolbar-meta .hint{min-width:100%}}
    @media(prefers-reduced-motion:reduce){button,.dimensions{transition:none}}
    .texts{position:absolute;inset:0;pointer-events:none}.textbox{position:absolute;width:240px;max-width:calc(100vw - 24px);padding:3px;border:1px solid transparent;border-radius:4px;background:transparent;pointer-events:auto;cursor:grab;touch-action:none}.textbox:active{cursor:grabbing}.textbox.selected{border-color:#60a5fa}.textbox textarea{display:block;box-sizing:border-box;width:100%;min-height:32px;padding:3px;border:0;outline:none;background:transparent;color:inherit;font:500 24px/1.4 system-ui;resize:none;overflow:hidden;white-space:pre-wrap;overflow-wrap:anywhere;pointer-events:none}.textbox.editing{cursor:text}.textbox.editing textarea{pointer-events:auto;cursor:text;touch-action:auto}.texts.pass,.texts.pass *{pointer-events:none!important}.texts.clean .textbox{border-color:transparent}.texts.clean textarea{outline:none}
    .textbox.badge{display:flex;align-items:center;justify-content:center;aspect-ratio:1;border-radius:50%;max-width:none}.textbox.badge textarea{padding:0;min-height:0;text-align:center;white-space:nowrap;overflow-wrap:normal}
    .page-outline{position:fixed;border:2px solid #60a5fa;pointer-events:none;z-index:1}.page-controls{position:fixed;display:flex;gap:4px;padding:4px;border:1px solid #514d45;border-radius:0;background:#111;color:#e8e6e1;box-shadow:0 3px 12px #0004;pointer-events:auto;font:12px ui-monospace,monospace;z-index:2}.page-controls button{padding:6px 9px}.page-controls [data-page-drag]{cursor:grab;touch-action:none}.page-controls [data-page-drag]:active{cursor:grabbing}.page-floats{position:absolute;inset:0;pointer-events:none}.page-float{position:fixed;pointer-events:auto}.page-outline[hidden],.page-controls[hidden],.page-float[hidden]{display:none}.bar{z-index:3}
    .hit{pointer-events:stroke;cursor:grab}.ink,.selection{pointer-events:none}.selection{stroke:#fff;stroke-dasharray:4 4;filter:drop-shadow(0 0 1px #000)}svg.pass,svg.pass *{pointer-events:none!important}svg.select{cursor:default;pointer-events:none}svg.dragging,svg.dragging .hit{cursor:grabbing}svg.clean .selection{display:none}
    </style><div class="page-floats"></div><div class="page-outline" hidden aria-hidden="true"></div><div class="page-controls" hidden role="group" aria-label="Selected page element"><button data-page-drag aria-label="Move selected page element" title="Drag to move; arrow keys move 10 px, Shift for 1 px">⠿ Move</button><button data-page-edit aria-label="Edit selected element text">Edit text</button><button data-page-delete aria-label="Delete selected page element">Delete</button></div><div class="grid" hidden aria-hidden="true"></div><svg xmlns="http://www.w3.org/2000/svg"></svg><div class="texts"></div><div class="dimensions" aria-hidden="true"><span class="dimension dimension-width"></span><span class="dimension dimension-height"></span></div><div class="bar" role="toolbar" aria-label="Page drawing tools">
    <div class="toolbar-head"><button class="drag-handle" title="Drag to move the toolbar; arrow keys also move it" aria-label="Move toolbar"><span class="grip" aria-hidden="true">⠿</span><span class="brand">SAGA <span>/</span> MERK</span><span class="drag-note">Drag to move</span></button><button data-action="hide">Hide toolbar</button><button data-action="close" aria-label="Close drawing tools">✕</button></div>
    <div class="tools" role="group" aria-label="Drawing tools"><button data-mode="select" title="Select a mark or page element; Alt/Option-drag to move, Shift-click to edit text (1)" aria-keyshortcuts="1">↖ Select<kbd aria-hidden="true">1</kbd></button><button data-mode="v" title="Click or drag a vertical guide; Alt/Option mirrors it (2)" aria-keyshortcuts="2">│ Vertical<kbd aria-hidden="true">2</kbd></button><button data-mode="h" title="Click or drag a horizontal guide; Alt/Option mirrors it (3)" aria-keyshortcuts="3">─ Horizontal<kbd aria-hidden="true">3</kbd></button><button data-mode="circle" title="Drag an oval; Shift for a circle; Alt/Option from center (4)" aria-keyshortcuts="4">○ Circle<kbd aria-hidden="true">4</kbd></button><button data-mode="arrow" title="Drag an arrow; Shift to snap direction (5)" aria-keyshortcuts="5">↗ Arrow<kbd aria-hidden="true">5</kbd></button><button data-mode="text" title="Click the page to add editable text (6)" aria-keyshortcuts="6">T Text<kbd aria-hidden="true">6</kbd></button><button data-mode="browse" title="Interact with the underlying page (7)" aria-keyshortcuts="7">Browse<kbd aria-hidden="true">7</kbd></button><button data-mode="counter" title="Place the next number; Shift for a badge; Alt/Option for sub-counter (8)" aria-keyshortcuts="8"># Counter<kbd aria-hidden="true">8</kbd></button><button data-mode="rect" title="Drag a rectangle; Shift for a square; Alt/Option from center (0)" aria-keyshortcuts="0">▭ Rectangle<kbd aria-hidden="true">0</kbd></button></div>
    <div class="settings-row"><span class="row-title">Style</span><div class="color-group"><button class="swatch" style="--color:#ff263f" data-color="#ff263f" aria-label="Red" title="Red"></button><button class="swatch" style="--color:#16a34a" data-color="#16a34a" aria-label="Green" title="Green"></button><button class="swatch" style="--color:#2563eb" data-color="#2563eb" aria-label="Blue" title="Blue"></button><input type="color" value="#ff263f" aria-label="Drawing color"></div><label class="setting line-setting">Line width <select aria-label="Stroke width"><option value="1">1 px</option><option value="2" selected>2 px</option><option value="4">4 px</option><option value="6">6 px</option></select></label><label class="setting">Text size <select data-text-size aria-label="Text size"><option value="8">8 px</option><option value="10">10 px</option><option value="12">12 px</option><option value="14">14 px</option><option value="16">16 px</option><option value="18">18 px</option><option value="20">20 px</option><option value="24" selected>24 px</option><option value="28">28 px</option><option value="32">32 px</option><option value="40">40 px</option><option value="48">48 px</option><option value="64">64 px</option><option value="72">72 px</option><option value="96">96 px</option></select></label></div>
    <div class="settings-row"><span class="row-title">Grid</span><button data-action="grid" aria-pressed="false" title="Show or hide the alignment grid">Grid</button><label class="grid-label">Spacing <select data-grid-spacing aria-label="Grid spacing"><option value="8">8 px</option><option value="16">16 px</option><option value="24">24 px</option><option value="32" selected>32 px</option><option value="64">64 px</option><option value="128">128 px</option></select></label><label class="grid-label" title="Inset from the left and right edges">Left/right <input class="margin" data-grid-margin-x type="number" min="0" step="8" value="32" aria-label="Horizontal grid margin in pixels"> px</label><label class="grid-label" title="Inset from the top and bottom edges">Top/bottom <input class="margin" data-grid-margin-y type="number" min="0" step="8" value="32" aria-label="Vertical grid margin in pixels"> px</label></div>
    <div class="toolbar-foot"><button data-action="undo">Undo</button><button data-action="delete">Delete</button><button data-action="clear">Clear</button><span class="shortcuts">1–8 / 0 tools · H hide / show · Esc close</span></div><div class="toolbar-meta"><div class="hint">Drag marks to move · Double-click text to edit · Shift for fine adjustments</div><a class="website-link" href="https://saga-merk.bjornar.dev/" target="_blank" rel="noopener noreferrer" aria-label="Saga Merk website (opens in a new tab)">saga-merk.bjornar.dev ↗</a></div></div>`;
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
  const toolHints={select:'Alt/Option + drag: move element · Shift + click: edit text · Delete keeps its layout space',v:'Alt/Option: mirrored guide at the opposite edge',h:'Alt/Option: mirrored guide at the opposite edge',circle:'Shift: circle · Alt/Option: draw from center · Combine both',rect:'Shift: square · Alt/Option: draw from center · Combine both',counter:'Shift: filled circle with white number · Alt/Option: sub-counter · Combine both'};
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
    bar.classList.remove('page-mode');hint.textContent=toolHints[mode]||defaultHint;updatePageSelection();
  }
  function syncPageStyle(){
    const computed=window.getComputedStyle(pageEdit.el),rgb=computed.color.match(/[\d.]+/g);
    if(rgb&&rgb.length>=3)colorInput.value='#'+rgb.slice(0,3).map(n=>Math.round(Number(n)).toString(16).padStart(2,'0')).join('');
    const size=String(parseFloat(computed.fontSize));
    currentSizeOption.value=size;currentSizeOption.textContent=`${size} px (page)`;currentSizeOption.hidden=false;textSizeInput.value=size;syncColors();
  }
  const textObstacles='input,textarea,select,button,svg,img,canvas,video,audio,iframe,[contenteditable],[aria-hidden="true"],[role="img"],h1,h2,h3,h4,h5,h6,p,div,section,article,ul,ol,table';
  function editableTextTarget(el){
    if(!el||el.namespaceURI!=='http://www.w3.org/1999/xhtml'||['HTML','BODY','INPUT','TEXTAREA','SELECT','OPTION','SCRIPT','STYLE','NOSCRIPT','IFRAME','SVG','IMG','CANVAS','VIDEO','AUDIO'].includes(el.tagName))return null;
    if(el.closest('[contenteditable]')&&pageEdit?.el!==el)return null;
    const style=window.getComputedStyle(el);if(style.display==='none'||style.visibility==='hidden')return null;
    if(el.getAttribute('aria-hidden')==='true'||el.getAttribute('role')==='img'||!el.textContent.trim())return null;
    const children=[...el.children].filter(child=>child.nodeType===1);
    // Unwrap text-only wrappers, keeping their layout and event-bearing parents intact.
    if(children.length===1&&!Array.from(el.childNodes).some(n=>n.nodeType===3&&n.data.trim()))return editableTextTarget(children[0]);
    if(!el.querySelector(textObstacles)||Array.from(el.childNodes).some(n=>n.nodeType===3&&n.data.trim()))return el;
    // A selected card can contain several blocks; edit its first text block,
    // never make the entire card (including controls) one editable region.
    for(const child of children){const target=editableTextTarget(child);if(target)return target;}
    return null;
  }
  function rememberPageOriginal(el){
    if(pageOriginals.has(el))return;
    const original=capturePage(el),moved=[...pageMoves.values()].flatMap(m=>m.styles).find(item=>item.node===el);
    if(moved){const source=document.createElement('div');if(moved.original!==null)source.setAttribute('style',moved.original);original.color=readStyle(source,'color');original.fontSize=readStyle(source,'font-size');}
    pageOriginals.set(el,original);
  }
  function startPageEdit(){
    if(pageEdit){endPageEdit();render();return;}
    let el=editableTextTarget(selectedPage);if(!el)return;
    cancelPageDrag();commitText(true);
    // Isolate a bare label next to an icon so select-all cannot delete the icon.
    if(el.querySelector(textObstacles)){
      const parent=el,before=capturePage(parent);
      rememberPageOriginal(parent);
      const text=Array.from(parent.childNodes).find(n=>n.nodeType===3&&n.data.trim());
      el=document.createElement('span');parent.replaceChild(el,text);el.append(text);
      pushHistory(()=>restorePage(parent,before));
    }
    selectPage(el);
    const before=capturePage(el);
    rememberPageOriginal(el);
    pageEdit={el,before,editable:el.getAttribute('contenteditable'),outline:readStyle(el,'outline'),outlineOffset:readStyle(el,'outline-offset'),color:colorInput.value,size:textSizeInput.value};
    el.setAttribute('contenteditable','plaintext-only');el.style.setProperty('outline','2px solid #60a5fa','important');el.style.setProperty('outline-offset','3px','important');
    bar.classList.add('page-mode');el.focus({preventScroll:true});syncPageStyle();hint.textContent='Editing text · Color and text size apply here · Done or click elsewhere to finish';render();
  }
  function onPageFocus(e){if(pageEdit&&!e.composedPath().includes(host)&&!pageEdit.el.contains(e.composedPath()[0])){endPageEdit();render();}}
  function onPageInput(e){if(pageEdit&&pageEdit.el.contains(e.composedPath()[0])){e.stopImmediatePropagation();render();}}
  function onPageTyping(e){if(pageEdit&&pageEdit.el.contains(e.composedPath()[0]))e.stopImmediatePropagation();}
  const pageListeners=[['focusin',onPageFocus],['input',onPageInput],['beforeinput',onPageTyping],['keyup',onPageTyping]];
  for(const [event,handler] of pageListeners)document.addEventListener(event,handler,true);
  function clearAll(){
    commitText(true);endPageEdit();cancel();clearPageSelection();
    const moves=[...pageMoves.keys()].map(el=>[el,pageMoveState(el)]),before=snapshot(),pages=[...pageOriginals].map(([el])=>[el,capturePage(el)]);
    for(const [el] of [...moves].reverse())restorePageElement(el);
    for(const [el,state] of [...pageOriginals].reverse())restorePage(el,state);
    shapes=[];selected=null;
    if(before.length||pages.length||moves.length)pushHistory(()=>{shapes=before;for(const [el,state] of pages.reverse())restorePage(el,state);for(const [el,state] of moves)applyPageMoveState(el,state);});
    render();
  }

  const pageOutline=root.querySelector('.page-outline'),pageControls=root.querySelector('.page-controls'),pageGrip=root.querySelector('[data-page-drag]'),pageDelete=root.querySelector('[data-page-delete]'),pageTextEdit=root.querySelector('[data-page-edit]'),pageFloatLayer=root.querySelector('.page-floats');
  const pageMoves=new Map();
  let selectedPage=null,pageDrag=null;
  const selectionObserver=typeof ResizeObserver==='function'?new ResizeObserver(updatePageSelection):null;
  function selectPage(el){endPageEdit();selectedPage=el;selected=null;selectionObserver?.disconnect();if(el)selectionObserver?.observe(el);render();}
  function clearPageSelection(){endPageEdit();selectedPage=null;selectionObserver?.disconnect();updatePageSelection();}
  function updatePageSelection(){
    if(selectedPage&&!selectedPage.isConnected){selectedPage=null;selectionObserver?.disconnect();}
    const visible=mode==='select'&&selectedPage?.isConnected&&!pageMoves.get(selectedPage)?.deleted;
    pageOutline.hidden=pageControls.hidden=!visible;
    if(!visible)return;
    pageTextEdit.hidden=!pageEdit&&!editableTextTarget(selectedPage);pageTextEdit.textContent=pageEdit?'Done':'Edit text';pageTextEdit.setAttribute('aria-label',pageEdit?'Finish editing text':'Edit selected element text');
    const r=selectedPage.getBoundingClientRect();
    Object.assign(pageOutline.style,{left:`${r.left}px`,top:`${r.top}px`,width:`${r.width}px`,height:`${r.height}px`});
    const c=pageControls.getBoundingClientRect(),gap=8,pad=8,w=window.innerWidth,h=window.innerHeight;
    const alongX=Math.max(pad,Math.min(r.left,w-c.width-pad)),alongY=Math.max(pad,Math.min(r.top,h-c.height-pad));
    const candidates=[[alongX,r.top-c.height-gap],[alongX,r.bottom+gap],[r.right+gap,alongY],[r.left-c.width-gap,alongY]];
    const [x,y]=candidates.find(([x,y])=>x>=pad&&y>=pad&&x+c.width<=w-pad&&y+c.height<=h-pad)||candidates[0];
    pageControls.style.left=`${Math.max(pad,Math.min(x,w-c.width-pad))}px`;pageControls.style.top=`${Math.max(pad,Math.min(y,h-c.height-pad))}px`;
  }
  function pageMoveState(el){const m=pageMoves.get(el);return m?{lifted:true,x:m.x,y:m.y,deleted:m.deleted}:{lifted:false};}
  function floatPageElement(el){
    if(pageMoves.has(el))return pageMoves.get(el);
    const rect=el.getBoundingClientRect(),parent=el.parentNode,next=el.nextSibling;
    const nodes=[el,...el.querySelectorAll('*')];
    // Snapshot before inserting anything: selector-dependent and inherited styling
    // must travel with the real nodes when they enter the isolated overlay.
    const moveId=nextId++;
    const styles=nodes.map((node,index)=>{
      const computed=window.getComputedStyle(node),pseudo=[];
      for(const type of ['::before','::after']){const style=window.getComputedStyle(node,type);if(style.content&&style.content!=='none'&&style.content!=='normal')pseudo.push([type,[...style].map(name=>`${name}:${style.getPropertyValue(name)}!important`).join(';')]);}
      return {node,original:node.getAttribute('style'),marker:node.getAttribute('data-merk-moved-node'),id:`${moveId}-${index}`,pseudo,values:[...computed].map(name=>[name,computed.getPropertyValue(name)])};
    });
    const placeholder=el.cloneNode(true);
    placeholder.setAttribute('aria-hidden','true');placeholder.setAttribute('inert','');
    for(const node of [placeholder,...placeholder.querySelectorAll('*')]){
      node.style.setProperty('visibility','hidden','important');node.style.setProperty('opacity','0','important');node.style.setProperty('pointer-events','none','important');node.style.setProperty('animation','none','important');node.style.setProperty('transition','none','important');
    }
    // Replacement retains the same tag, classes, children and sibling position,
    // preserving inline wrapping, flex/grid placement and collapsed margins.
    parent.replaceChild(placeholder,el);
    const frame=document.createElement('div');frame.className='page-float';pageFloatLayer.append(frame);frame.append(el);
    const pseudoStyle=document.createElement('style');
    pseudoStyle.textContent=styles.flatMap(item=>item.pseudo.map(([type,css])=>`[data-merk-moved-node="${item.id}"]${type}{${css}}`)).join('');frame.append(pseudoStyle);
    for(const item of styles){item.node.setAttribute('data-merk-moved-node',item.id);for(const [name,value] of item.values)item.node.style.setProperty(name,value,'important');}
    const overrides={position:'relative',top:'auto',right:'auto',bottom:'auto',left:'auto',margin:'0',width:`${rect.width}px`,height:`${rect.height}px`,'min-width':'0','max-width':'none','min-height':'0','max-height':'none','box-sizing':'border-box',transform:'none',translate:'none',rotate:'none',scale:'none',animation:'none',transition:'none',float:'none',display:window.getComputedStyle(placeholder).display==='inline'?'inline-block':window.getComputedStyle(placeholder).display};
    for(const [name,value] of Object.entries(overrides))el.style.setProperty(name,value,'important');
    const m={el,placeholder,parent,next,styles,frame,x:rect.left,y:rect.top,deleted:false};pageMoves.set(el,m);applyPageMove(m);return m;
  }
  function applyPageMove(m){m.frame.style.left=`${m.x}px`;m.frame.style.top=`${m.y}px`;m.frame.hidden=m.deleted;updatePageSelection();}
  function restorePageElement(el){
    const m=pageMoves.get(el);if(!m)return;
    if(m.placeholder.parentNode)m.placeholder.parentNode.replaceChild(el,m.placeholder);
    else if(m.parent.isConnected)m.parent.insertBefore(el,m.next?.parentNode===m.parent?m.next:null);
    for(const {node,original,marker} of m.styles){if(original===null)node.removeAttribute('style');else node.setAttribute('style',original);if(marker===null)node.removeAttribute('data-merk-moved-node');else node.setAttribute('data-merk-moved-node',marker);}
    m.frame.remove();pageMoves.delete(el);
  }
  function applyPageMoveState(el,state){if(!state.lifted)restorePageElement(el);else{const m=floatPageElement(el);Object.assign(m,state);applyPageMove(m);}updatePageSelection();}
  function cancelPageDrag(){
    if(!pageDrag)return;const d=pageDrag;pageDrag=null;applyPageMoveState(d.el,d.before);if(pageGrip.hasPointerCapture(d.pointer))pageGrip.releasePointerCapture(d.pointer);render();
  }
  function movePageDrag(e){
    const d=pageDrag;if(!d||d.pointer!==e.pointerId)return;e.preventDefault();
    const dx=e.clientX-d.x,dy=e.clientY-d.y;
    if(!d.moved&&Math.hypot(dx,dy)<2)return;
    d.moved=true;const m=floatPageElement(d.el);m.x=d.left+dx;m.y=d.top+dy;applyPageMove(m);
  }
  function startPageDrag(e){
    if(e.button!==0||!selectedPage||pageDrag)return;e.preventDefault();e.stopPropagation();commitText(true);endPageEdit();
    const rect=selectedPage.getBoundingClientRect();pageDrag={el:selectedPage,pointer:e.pointerId,x:e.clientX,y:e.clientY,left:rect.left,top:rect.top,before:pageMoveState(selectedPage),moved:false};pageGrip.setPointerCapture(e.pointerId);
  }
  pageGrip.addEventListener('pointerdown',startPageDrag);
  pageGrip.addEventListener('pointermove',movePageDrag);
  pageGrip.addEventListener('pointerup',e=>{
    if(!pageDrag||pageDrag.pointer!==e.pointerId)return;movePageDrag(e);const d=pageDrag;pageDrag=null;
    if(d.moved)pushHistory(()=>applyPageMoveState(d.el,d.before));
    if(pageGrip.hasPointerCapture(d.pointer))pageGrip.releasePointerCapture(d.pointer);render();
  });
  pageGrip.addEventListener('pointercancel',cancelPageDrag);
  pageGrip.addEventListener('lostpointercapture',cancelPageDrag);
  pageGrip.addEventListener('keydown',e=>{
    const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!delta||!selectedPage)return;e.preventDefault();e.stopPropagation();
    endPageEdit();const el=selectedPage,before=pageMoveState(el),m=floatPageElement(el),step=e.shiftKey?1:10;m.x+=delta[0]*step;m.y+=delta[1]*step;applyPageMove(m);pushHistory(()=>applyPageMoveState(el,before));render();
  });
  function deletePageSelection(){
    if(!selectedPage)return;endPageEdit();cancelPageDrag();const el=selectedPage,before=pageMoveState(el),m=floatPageElement(el);m.deleted=true;applyPageMove(m);pushHistory(()=>applyPageMoveState(el,before));clearPageSelection();render();
  }
  pageDelete.addEventListener('click',deletePageSelection);
  pageTextEdit.addEventListener('click',startPageEdit);
  function onSelectPage(e){
    if(mode!=='select'||e.button!==0)return;
    const path=e.composedPath(),target=path[0];
    if(pageEdit&&pageEdit.el.contains(target)&&!e.altKey){e.stopImmediatePropagation();return;}
    const moved=[...pageMoves.values()].find(m=>!m.deleted&&path.includes(m.el));
    if(path.includes(host)&&!moved)return;
    endPageEdit();e.preventDefault();e.stopImmediatePropagation();commitText(true);
    let el=moved?.el||target;
    if(!(el instanceof Element)||el.namespaceURI!=='http://www.w3.org/1999/xhtml'||['HTML','BODY','SCRIPT','STYLE','LINK','META','HEAD'].includes(el.tagName))el=null;
    if(el){const r=el.getBoundingClientRect();if(!r.width||!r.height)el=null;}
    selectPage(el);
    if(el&&e.altKey){startPageDrag(e);pageGrip.focus({preventScroll:true});}
    else if(el&&e.shiftKey)startPageEdit();
  }
  function blockSelectionClick(e){
    if(mode!=='select')return;
    const path=e.composedPath();
    if(!path.includes(host)||[...pageMoves.values()].some(m=>path.includes(m.el))){e.preventDefault();e.stopImmediatePropagation();}
  }
  document.addEventListener('pointerdown',onSelectPage,true);
  document.addEventListener('click',blockSelectionClick,true);
  document.addEventListener('auxclick',blockSelectionClick,true);
  window.addEventListener('scroll',updatePageSelection,true);
  window.addEventListener('resize',updatePageSelection);
  function removePageMovement(){
    cancelPageDrag();clearPageSelection();for(const el of [...pageMoves.keys()].reverse())restorePageElement(el);
    document.removeEventListener('pointerdown',onSelectPage,true);document.removeEventListener('click',blockSelectionClick,true);document.removeEventListener('auxclick',blockSelectionClick,true);
    window.removeEventListener('scroll',updatePageSelection,true);window.removeEventListener('resize',updatePageSelection);selectionObserver?.disconnect();
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
    input.title='Step 8 px; Shift for 1 px; Alt/Option + Up/Down jumps 8, 16, 32, 64, 128, 256, 512, 1024';
    input.addEventListener('pointerdown',setMarginStep);
    input.addEventListener('keydown',e=>{
      if(e.key!=='ArrowUp'&&e.key!=='ArrowDown')return;
      e.preventDefault();e.stopPropagation();
      const value=Number(input.value),base=input.value.trim()!==''&&Number.isFinite(value)?Math.round(value):32;
      const up=e.key==='ArrowUp';
      const next=e.altKey?(up?(marginSizes.find(size=>size>base)??1024):([...marginSizes].reverse().find(size=>size<base)??8)):Math.max(0,base+(up?1:-1)*(e.shiftKey?1:8));
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
    bar.style.right='auto';bar.style.bottom='auto';bar.style.left=`${toolbarPosition.x}px`;bar.style.top=`${toolbarPosition.y}px`;
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
  function setMode(value) { cancelPageDrag();clearPageSelection();commitText(true);endPageEdit();mode=value;hint.textContent=toolHints[value]||defaultHint;textLayer.classList.toggle('pass',value==='browse'); svg.classList.toggle('pass',value==='browse'); svg.classList.toggle('select',value==='select'); if(value==='browse')selected=null; root.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===value))); render(); }
  host.remove = remove;
  host.requestClose = requestClose;
  function requestClose() { if(window.confirm('Close Saga Merk and discard all your annotations and page edits?\n\nTip: press H to hide the toolbar and switch to Browse mode while keeping your content.'))remove(); }
  function remove() { endPageEdit();removePageMovement();for(const [el,state] of [...pageOriginals].reverse())restorePage(el,state);for(const [event,handler] of pageListeners)document.removeEventListener(event,handler,true);window.clearTimeout(dimensionTimer);window.removeEventListener('resize',updateGrid);window.removeEventListener('resize',render); document.removeEventListener('keydown',setMarginStep,true);document.removeEventListener('keyup',setMarginStep,true);window.removeEventListener('blur',resetMarginStep);stopToolbarDrag();window.removeEventListener('resize',keepToolbarVisible);document.removeEventListener('keydown',keyboard,true); Element.prototype.remove.call(host); if(window[key]===host) delete window[key]; }
  function finishCapture() { const pointer=active?.pointer;active=null;const capture=activeCapture;activeCapture=null;if(pointer!==undefined&&capture?.hasPointerCapture(pointer))capture.releasePointerCapture(pointer);svg.classList.remove('dragging'); }
  function cancel() { cancelPageDrag();if(!active)return;shapes=active.before;finishCapture();if(!shapes.some(s=>s.id===selected))selected=null;render(); }
  function undo() { commitText(true);endPageEdit();if(pageDrag){cancelPageDrag();return;}clearPageSelection();if(active){cancel();return;}if(history.length){const entry=history.pop();if(typeof entry==='function')entry();else shapes=entry;selected=null;render();} }
  function deleteSelected() { if(selectedPage){deletePageSelection();return;}commitText(true);if(active)cancel();const before=snapshot();shapes=shapes.filter(s=>s.id!==selected);selected=null;remember(before);render(); }
  function hideToolbar() { commitText(true);const hiding=!bar.classList.contains('hidden');if(hiding){toolBeforeHide=mode;cancel();stopToolbarDrag();setMode('browse');}else setMode(toolBeforeHide);bar.classList.toggle('hidden');svg.classList.toggle('clean',bar.classList.contains('hidden'));textLayer.classList.toggle('clean',bar.classList.contains('hidden'));keepToolbarVisible(); }
  const toolKeys={'1':'select','2':'v','3':'h','4':'circle','5':'arrow','6':'text','7':'browse','8':'counter','0':'rect'};
  function keyboard(e) {
    if(pageEdit&&pageEdit.el.contains(e.composedPath()[0])&&e.key!=='Escape'){e.stopImmediatePropagation();return;}
    if(e.isComposing)return;
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();if(!e.repeat)requestClose();return;}
    const target=e.composedPath()[0]; if(target && (['INPUT','TEXTAREA','SELECT'].includes(target.tagName)||target.isContentEditable)) return;
    let handled=true;
    if(toolKeys[e.key]&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey){cancel();if(bar.classList.contains('hidden'))hideToolbar();setMode(toolKeys[e.key]);}
    else if(e.key.toLowerCase()==='h'&&!e.metaKey&&!e.ctrlKey&&!e.altKey)hideToolbar();
    else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&mode!=='browse')undo();
    else if((e.key==='Delete'||e.key==='Backspace')&&(selected!==null||selectedPage)&&mode!=='browse')deleteSelected();
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
    if(s.kind==='rect')return ['rect',{x:Math.min(s.x,s.x2),y:Math.min(s.y,s.y2),width:Math.abs(s.x2-s.x),height:Math.abs(s.y2-s.y)}];
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
          if(e.button!==0||mode==='browse'||active)return;e.preventDefault();e.stopPropagation();commitText(true);
          const mark=shapes.find(m=>m.id===s.id);clearPageSelection();selected=mark.id;colorInput.value=mark.color;textSizeInput.value=String(mark.fontSize);syncColors();
          active={type:'move',id:mark.id,original:{...mark},x:e.clientX,y:e.clientY,pointer:e.pointerId,before:snapshot()};activeCapture=box;box.setPointerCapture(e.pointerId);render();
        });
      }
      parts.box.style.left=`${s.x}px`;parts.box.style.top=`${s.y}px`;parts.box.style.color=s.color;parts.box.classList.toggle('selected',s.id===selected);
      parts.input.style.fontSize=`${s.fontSize}px`;
      if(s.kind==='counter'){parts.box.style.font=`500 ${s.fontSize}px/1.4 system-ui`;parts.box.classList.toggle('badge',!!s.badge);parts.box.style.background=s.badge?s.color:'transparent';parts.box.style.color=s.badge?'#fff':s.color;parts.box.style.width=s.badge?`max(2em, calc(${s.text.length}ch + 1em))`:`calc(${s.text.length+0.5}ch + 14px)`;}
      if(parts.input.value!==s.text)parts.input.value=s.text;
      if(s.badge)parts.input.style.height=`${s.fontSize*1.4}px`;else sizeText(parts.input);
    }
  }
  function render() {
    svg.replaceChildren();
    renderText();
    for(const s of shapes){
      if(isText(s))continue;
      const copies=s.mirrored?[false,true]:[false];
      for(const mirrored of copies){
        const mark=mirrored?{...s,x:window.innerWidth-s.x,y:window.innerHeight-s.y}:s;
        const [tag,attrs]=geometry(mark),g=node('g',{'data-id':s.id,'data-mirror':String(mirrored)}),common={...attrs,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'};
        g.append(node(tag,{...common,class:'ink',stroke:s.color,'stroke-width':s.width}));
        if(s.id===selected)g.append(node(tag,{...common,class:'selection',stroke:'#fff','stroke-width':Math.max(1,s.width/2)}));
        g.append(node(tag,{...common,class:'hit',stroke:'transparent','stroke-width':Math.max(16,s.width+10)}));svg.append(g);
      }
    }
    updatePageSelection();
    root.querySelector('[data-action="delete"]').disabled=selected===null&&!selectedPage;
    root.querySelector('[data-action="undo"]').disabled=!history.length&&!active&&!pageEdit;
  }
  function nextCounter(before,sub){
    const counters=before.filter(s=>s.kind==='counter');
    const major=counters.reduce((max,s)=>Math.max(max,Number(s.text.split('.')[0])),0);
    if(!sub)return String(major+1);
    const parent=Math.max(1,major),minor=counters.reduce((max,s)=>{const [group,number]=s.text.split('.').map(Number);return group===parent&&number?Math.max(max,number):max;},0);
    return `${parent}.${minor+1}`;
  }
  window.addEventListener('resize',render);
  svg.addEventListener('pointerdown',e=>{
    if(e.button!==0||mode==='browse'||active)return;e.preventDefault();commitText(true);
    const hit=e.target.closest('[data-id]'),s=hit&&shapes.find(s=>s.id===Number(hit.dataset.id));
    const before=snapshot();
    if(s){clearPageSelection();selected=s.id;colorInput.value=s.color;widthInput.value=String(s.width);syncColors();active={type:'move',id:s.id,original:{...s},mirror:hit.dataset.mirror==='true',x:e.clientX,y:e.clientY,pointer:e.pointerId,before};}
    else {
      selected=null;
      if(mode==='select'){render();return;}
      const mark={id:nextId++,kind:mode,x:e.clientX,y:e.clientY,x2:e.clientX,y2:e.clientY,color:colorInput.value,width:Number(widthInput.value)};
      if(isText(mark))mark.fontSize=Number(textSizeInput.value);
      if(mode==='counter'){mark.text=nextCounter(before,e.altKey);mark.badge=!!e.shiftKey;selected=mark.id;}
      if(mode==='text'){mark.text='';shapes.push(mark);selected=mark.id;remember(before);render();textNodes.get(mark.id).input.focus();return;}
      shapes.push(mark);active={type:'draw',id:mark.id,x:e.clientX,y:e.clientY,pointer:e.pointerId,before};
    }
    activeCapture=svg;svg.setPointerCapture(e.pointerId);svg.classList.add('dragging');draw(e);
  });
  function draw(e) {
    if(!active||e.pointerId!==active.pointer)return;
    const a=active,s=shapes.find(s=>s.id===a.id);let dx=e.clientX-a.x,dy=e.clientY-a.y;
    if(a.type==='move'){
      const o=a.original;if(s.kind==='v')dx=e.clientX-a.x,dy=0;else if(s.kind==='h')dx=0;
      if(a.mirror){dx=-dx;dy=-dy;}
      s.x=o.x+dx;s.y=o.y+dy;s.x2=o.x2+dx;s.y2=o.y2+dy;
    } else if(s.kind==='v'){s.x=e.clientX;s.mirrored=!!e.altKey;}
    else if(s.kind==='h'){s.y=e.clientY;s.mirrored=!!e.altKey;}
    else if(s.kind==='counter'){s.x=e.clientX;s.y=e.clientY;s.text=nextCounter(a.before,e.altKey);s.badge=!!e.shiftKey;}
    else {
      if(e.shiftKey){if(s.kind==='circle'||s.kind==='rect'){const side=Math.max(Math.abs(dx),Math.abs(dy));dx=(dx<0?-1:1)*side;dy=(dy<0?-1:1)*side;}else{const angle=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*Math.PI/4,len=Math.hypot(dx,dy);dx=Math.cos(angle)*len;dy=Math.sin(angle)*len;}}
      const centered=e.altKey&&(s.kind==='circle'||s.kind==='rect');
      s.x=centered?a.x-dx:a.x;s.y=centered?a.y-dy:a.y;s.x2=a.x+dx;s.y2=a.y+dy;
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
