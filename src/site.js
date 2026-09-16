(() => {
  const root=document.documentElement,button=document.getElementById('theme');
  const img=document.getElementById('header-image'),canvas=document.getElementById('ascii'),ctx=canvas.getContext('2d');
  const sampler=document.createElement('canvas'),sample=sampler.getContext('2d',{willReadFrequently:true});
  const base=document.createElement('canvas'),paint=base.getContext('2d');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let visible=true,timer=null,cells=[],width=0,height=0,cellW=0,cellH=0;
  const ramp=' .:-=+*#%@';
  function render(){
    if(!ctx||!sample||!paint||!img.complete||!img.naturalWidth)return;
    const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;if(!width||!height)return;
    const dpr=Math.min(devicePixelRatio||1,2),cols=Math.min(220,Math.round(width/6)),rows=Math.round(height/(width/cols/.6));cellW=width/cols;cellH=height/rows;
    canvas.width=base.width=Math.round(width*dpr);canvas.height=base.height=Math.round(height*dpr);sampler.width=cols;sampler.height=rows;
    const scale=Math.max(width/img.naturalWidth,height/img.naturalHeight),sw=width/scale,sh=height/scale;
    sample.drawImage(img,(img.naturalWidth-sw)/2,(img.naturalHeight-sh)*.45,sw,sh,0,0,cols,rows);
    let data;try{data=sample.getImageData(0,0,cols,rows).data;}catch{return;}
    paint.setTransform(dpr,0,0,dpr,0,0);paint.clearRect(0,0,width,height);paint.font=`${cellH*.82}px Mono,monospace`;paint.textAlign='center';paint.textBaseline='middle';
    const dark=root.dataset.theme==='dark';cells=[];
    for(let i=0;i<cols*rows;i++){const r=data[i*4],g=data[i*4+1],b=data[i*4+2],lum=(.299*r+.587*g+.114*b)/255;const index=Math.round((dark?lum:1-lum)*(ramp.length-1));const cell={x:(i%cols+.5)*cellW,y:(Math.floor(i/cols)+.5)*cellH,color:`rgb(${r},${g},${b})`,index};cells.push(cell);paint.fillStyle=cell.color;paint.fillText(ramp[index],cell.x,cell.y);}
    frame();
  }
  function frame(){if(!ctx||!paint)return;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(base,0,0);}
  function tick(){frame();if(reduced.matches||!visible||document.hidden||!cells.length)return;const dpr=Math.min(devicePixelRatio||1,2);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.font=`${cellH*.82}px Mono,monospace`;ctx.textAlign='center';ctx.textBaseline='middle';for(let n=0;n<cells.length*.012;n++){const cell=cells[Math.floor(Math.random()*cells.length)];ctx.clearRect(cell.x-cellW/2,cell.y-cellH/2,cellW,cellH);ctx.fillStyle=cell.color;ctx.fillText(ramp[Math.max(0,Math.min(9,cell.index+(Math.random()<.5?-1:1)))],cell.x,cell.y);}}
  function schedule(){clearInterval(timer);timer=null;if(!reduced.matches&&visible&&!document.hidden)timer=setInterval(tick,350);else frame();}
  function theme(value){root.dataset.theme=value;button.textContent=value==='dark'?'Light ◐':'Dark ◑';button.setAttribute('aria-label',`Switch to ${value==='dark'?'light':'dark'} theme`);img.src=value==='dark'?'assets/header-dark.webp':'assets/header-light.webp';document.querySelector('meta[name="theme-color"]').content=value==='dark'?'#0a0a0a':'#f3f1ec';try{localStorage.setItem('saga-merk-theme',value);}catch{}}
  img.addEventListener('load',render);new ResizeObserver(render).observe(canvas);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();}).observe(canvas);document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',schedule);button.onclick=()=>theme(root.dataset.theme==='dark'?'light':'dark');
  let preferred='dark';try{preferred=localStorage.getItem('saga-merk-theme')||'dark';}catch{}theme(preferred==='light'?'light':'dark');document.fonts.ready.then(render);schedule();
})();
