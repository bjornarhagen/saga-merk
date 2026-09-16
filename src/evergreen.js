(() => {
  const key='__pageMarkerOverlay',loading='__sagaMerkLoading';
  if(window[key]){window[key].requestClose();return;}
  if(window[loading])return;
  const script=document.createElement('script'),request=String(Date.now())+Math.random();
  window[loading]=request;
  let finished=false;
  const finish=()=>{if(finished)return false;finished=true;clearTimeout(timer);delete window[loading];script.onload=script.onerror=null;script.remove();return true;};
  const fallback=()=>{if(!finish())return;
    /*__BUNDLED__*/
  };
  const timer=setTimeout(fallback,3000);
  script.src='https://saga-merk.bjornar.dev/dist/saga-merk.js';
  script.dataset.sagaMerkRequest=request;
  script.referrerPolicy='no-referrer';
  script.onload=()=>{if(window[key])finish();else fallback();};
  script.onerror=fallback;
  document.documentElement.append(script);
})();
