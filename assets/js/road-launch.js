/* ═══ Equity hero — SELF-DRAWING CHART + GLOWING PLAYHEAD (2D) ═══
   A small scroll triggers a self-playing timeline: the equity curve
   draws itself left→right in one crisp stroke, a glowing point rides
   the leading edge, the area fills behind it, and a mono readout counts
   the year/value up — then it settles into the framed chart.
     EquityRoad.init({canvas, intro, end}) · play(to,dur,cb) · reset() · progress()
   Driver is resilient to the preview's soft re-renders: animation state
   lives on window.__eqState, one generation-guarded loop runs, and the
   canvas is re-resolved every frame. */
(function(){
  "use strict";
  const GEN=(window.__eqGen=(window.__eqGen||0)+1);
  const S=(window.__eqState=window.__eqState||{disp:0,tl:null,cfg:null});
  let cv=null, ctx=null, reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lerp=(a,b,t)=>a+(b-a)*t;
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const ss=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
  const easeIO=t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;

  const DATA=[9999.97,10519.77,10776.53,10700.32,10968.64,10731.78,10439.4,10234.58,10480.72,10674.69,10931.78,11048.72,10832.04,11619.26,11554.04,11267.39,11709.46,12983.53,13066.27,12941.4,13653.6,13385.03,13516.58,13880.53,14476.67,13867.85,14382.87,14432.38,13684.81,14101.9,14089.95,14780.05,14675.84,14568.88,13732.38,14488.15,14317.48,14773.6,14878.24,14920.24,13465.54,13248.87,12631.81,12757.67,11798.32,11798.32,12228.84,12829.45,13250.52,13115.25,13988.55,14315.05,14805.38,14308.32,14480.08,15149.15,15528.93,15763.54,15221.32,15464.98,15104.24,13922.88,14770.69,15931.1,16564.62,17362.96,18574.87,18876.69,19175.94,20599.31,20549.51,20549.51,20549.51,20549.51,20549.51,20549.51,20549.51,20549.51,20549.51,20549.51,20549.51,20549.51,20549.51,20549.51,20549.51,20549.51,20549.51,20549.51,20549.51,20549.51,20549.51,20879.21,20199.45,18630.34,19720.67,20148.25,19786.62,20289.56,21412.86,22088.05,19442.81,21034.68,21454.63,21915.65,22109.41,21955.37,23100.74,24298.12,24299.47,23412.04,24266.17,22288.56,22288.56,22463.93,22463.93,22373.33,21447.12,20994.35,20994.35,20994.35,20994.35,20994.35,20994.35,20994.35,23820.15,23820.15,23820.15,23820.15,23820.15,23820.15,23016.19,22132.92,21402.58,21493.35,20994.67,21274.29,20907.05,21404.2,21647.49,22667.63,23647.99,25170.09,26312.35,28284.18,28928.98,28148.17,28888.67,28236.57,26482.03,26779.07,28823.6,31547.01,32924.52,35660.1,35910.67,37687.51,42931.25,49957.58,50464.12,50499.18,44654.85,52338.5,58233.15,55600.8,57721.85,59791.43,56713.02,57254.02,52385.68,58678.93,62719.0,65554.04,66077.99,68268.23,64593.23,63292.72,65175.87,67685.96,77349.57,67534.08,71885.42,69143.14,69143.14,73470.24,72256.78,75575.78,76920.75,80322.47,81178.77,85835.48,91333.62,95953.09,94590.06,102850.61,93871.38,98059.03,96859.46,102820.53,112113.51,116999.62,135249.61,128487.05,128487.05,136025.03,139585.87,145591.91,155558.25,156027.95,146034.15,151395.57,146209.29,180929.8,174470.33];
  const M=DATA.length;
  const YEARTICKS=[[0,"2016"],[23,"2018"],[66,"2020"],[110,"2022"],[153,"2024"],[197,"2026"]];
  const LIVE_I=197;   // Jan 2026 — where live capital begins
  const AXIS_HI=200000, AXIS_TICKS=4;
  const fmtK=v=>v===0?"0":(v/1000)+"k";
  const fmtUSD=v=>"$"+Math.round(v).toLocaleString("en-US");

  // ── viewport (plot geometry morphs per-frame in draw) ──
  let W,H,dpr, phone=false;
  function layout(){ phone = W<820; }
  function resize(){
    if(!cv) return;
    dpr=Math.min(devicePixelRatio||1,2); W=innerWidth; H=innerHeight;
    cv.width=W*dpr; cv.height=H*dpr; cv.style.width=W+"px"; cv.style.height=H+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0); layout();
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    const d=S.disp;
    const bloom=clamp(d/0.15,0,1);           // faint guide curve fades in first (0→15%)
    const sweep=clamp((d-0.15)/0.55,0,1);    // then the bright curve draws itself, done by ~70%
    const morph=ss(0.72,0.92,d);             // shrink completes by 92%
    const chrome=ss(0.82,0.98,d);            // gridlines/axis settle in last
    const headF=sweep*(M-1);
    const rest=d<0.015;

    // geometry morphs from a full-page build box to the right-side final box
    let L,R,T,B;
    if(phone){ L=W*0.07; R=W*0.93; T=lerp(H*0.34,H*0.50,morph); B=H*0.86; }
    else{
      L=lerp(W*0.075,W*0.58,morph); R=lerp(W*0.925,W*0.955,morph);
      T=lerp(H*0.24,H*0.30,morph);  B=lerp(H*0.82,H*0.80,morph);
    }
    const X=i=>L+(i/(M-1))*(R-L);
    const Y=v=>B-(v/AXIS_HI)*(B-T);
    const xF=f=>lerp(X(0),X(M-1),f/(M-1));
    const yF=f=>{const i=clamp(Math.floor(f),0,M-1),j=Math.min(M-1,i+1);return lerp(Y(DATA[i]),Y(DATA[j]),f-i);};

    ctx.lineJoin="round"; ctx.lineCap="round";
    // faint full curve — fades in first (bloom), then dims as the bright stroke draws over it
    ctx.strokeStyle=`rgba(91,147,255,${bloom*lerp(0.16,0.05,sweep)})`; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(X(0),Y(DATA[0])); for(let i=1;i<M;i++) ctx.lineTo(X(i),Y(DATA[i])); ctx.stroke();

    // area fill under the revealed portion
    if(sweep>0.001){
      const last=Math.floor(headF);
      ctx.beginPath(); ctx.moveTo(X(0),B); ctx.lineTo(X(0),Y(DATA[0]));
      for(let i=1;i<=last;i++) ctx.lineTo(X(i),Y(DATA[i]));
      const hasFrac = headF>last && last<M-1;
      if(hasFrac) ctx.lineTo(xF(headF),yF(headF));
      ctx.lineTo(hasFrac?xF(headF):X(Math.min(last,M-1)), B); ctx.closePath();
      const g=ctx.createLinearGradient(0,T,0,B);
      g.addColorStop(0,"rgba(91,147,255,0.22)"); g.addColorStop(1,"rgba(91,147,255,0)");
      ctx.fillStyle=g; ctx.fill();
    }

    // gridlines + axis (only as it settles into the framed chart)
    if(chrome>0.01){
      ctx.save();
      ctx.strokeStyle=`rgba(255,255,255,${0.07*chrome})`; ctx.lineWidth=1;
      ctx.font="11px 'JetBrains Mono', monospace"; ctx.textAlign="right";
      for(let k=0;k<=AXIS_TICKS;k++){ const v=(k/AXIS_TICKS)*AXIS_HI, y=Y(v);
        ctx.beginPath(); ctx.moveTo(L,y); ctx.lineTo(R,y); ctx.stroke();
        ctx.fillStyle=`rgba(150,153,160,${0.8*chrome})`; ctx.fillText(fmtK(v), L-10, y+3.5); }
      ctx.textAlign="center"; ctx.fillStyle=`rgba(150,153,160,${0.85*chrome})`;
      YEARTICKS.forEach(([i,t])=>ctx.fillText(t, X(i), B+22));
      ctx.restore();
    }

    // live-capital marker — Jan 2026 onward (settles in with the framed chart)
    if(chrome>0.01){
      const lx=X(LIVE_I), ly=Y(DATA[LIVE_I]);
      ctx.save();
      ctx.strokeStyle=`rgba(91,147,255,${0.42*chrome})`; ctx.lineWidth=1; ctx.setLineDash([3,4]);
      ctx.beginPath(); ctx.moveTo(lx,T); ctx.lineTo(lx,B); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle=`rgba(226,237,255,${0.95*chrome})`; ctx.beginPath(); ctx.arc(lx,ly,3,0,7); ctx.fill();
      ctx.font="10px 'JetBrains Mono', monospace"; ctx.textAlign="right";
      ctx.fillStyle=`rgba(150,175,235,${0.95*chrome})`;
      ctx.fillText("LIVE · JAN '26", lx-8, B-10);
      ctx.restore();
    }

    // bright revealed stroke
    if(sweep>0.001){
      const last=Math.floor(headF);
      ctx.strokeStyle="rgba(91,147,255,0.95)"; ctx.lineWidth=2.4;
      ctx.beginPath(); ctx.moveTo(X(0),Y(DATA[0]));
      for(let i=1;i<=last;i++) ctx.lineTo(X(i),Y(DATA[i]));
      if(headF>last && last<M-1) ctx.lineTo(xF(headF),yF(headF));
      ctx.stroke();
    }

    // glowing playhead (only while the curve is building)
    if(!rest && sweep>0.001 && sweep<0.999){
      const hx=xF(headF), hy=yF(headF);
      ctx.save(); ctx.globalCompositeOperation="lighter";
      const r=phone?16:24;
      const g=ctx.createRadialGradient(hx,hy,0,hx,hy,r);
      g.addColorStop(0,"rgba(190,212,255,0.9)"); g.addColorStop(0.4,"rgba(91,147,255,0.4)"); g.addColorStop(1,"rgba(91,147,255,0)");
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(hx,hy,r,0,7); ctx.fill();
      ctx.restore();
      ctx.fillStyle="rgba(226,237,255,0.98)"; ctx.beginPath(); ctx.arc(hx,hy,3.2,0,7); ctx.fill();
    }
  }

  function ui(){
    const cfg=S.cfg||{}, s=S.disp;
    const introEl=document.getElementById(cfg.intro||"lhIntro");
    const endEl=document.getElementById(cfg.end||"lhEnd");
    if(introEl) introEl.style.opacity=String(Math.max(0,1-s/0.06));
    if(endEl)   endEl.style.opacity=String(clamp((s-0.90)/0.10,0,1));   // panel appears only after the chart has settled right
  }

  function play(to,dur,cb){ to=clamp(to,0,1); S.tl={t0:performance.now(),from:S.disp,to,dur:(dur||1600),cb:cb||null}; }

  let lastStep=0;
  function step(){
    const cfg=S.cfg||{};
    const el=document.getElementById(cfg.canvas||"lhroad");
    if(!el) return;
    if(el!==cv){ cv=el; ctx=cv.getContext("2d"); resize(); }
    else if(W!==innerWidth||H!==innerHeight){ resize(); }
    const now=performance.now();
    if(S.tl){ const k=clamp((now-S.tl.t0)/S.tl.dur,0,1);
      S.disp=S.tl.from+(S.tl.to-S.tl.from)*(reduce?1:easeIO(k));
      if(k>=1){ S.disp=S.tl.to; const cb=S.tl.cb; S.tl=null; if(cb) cb(); } }
    draw(); ui();
  }
  function tick(){ const now=performance.now(); if(now-lastStep>=12){ lastStep=now; step(); } }
  function rafLoop(){ if(GEN!==window.__eqGen) return; tick(); requestAnimationFrame(rafLoop); }

  window.EquityRoad={
    init(o){ if(o) S.cfg=o; const el=document.getElementById((S.cfg&&S.cfg.canvas)||"lhroad"); if(el){ cv=el; ctx=cv.getContext("2d"); resize(); draw(); ui(); } return true; },
    reset(){ S.disp=0; S.tl=null; if(cv){ draw(); ui(); } },
    play, progress(){ return S.disp; }, running(){ return true; }, resize
  };
  // Hybrid clock: rAF drives smooth animation when visible; a setInterval keeps the
  // timeline advancing even when rAF is throttled (backgrounded tab / automated context).
  requestAnimationFrame(rafLoop);
  const _iv=setInterval(()=>{ if(GEN!==window.__eqGen){ clearInterval(_iv); return; } tick(); }, 16);
})();
