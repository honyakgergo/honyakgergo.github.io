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

  const DATA=[9999.98,10740.21,11134.9,11701.4,11896.81,11640.97,11095.81,11224.88,11076,11243.07,11687.9,12079.05,12441.54,12750.36,13045.34,12497.7,12316.04,13080.31,13348.69,14425.75,14537.71,14604.05,15335.72,14212.29,14972.4,15453.22,15863.96,14871.53,15214.3,15814.14,14947.19,15395.57,15375.39,15665.73,15849.47,15810.65,14746.36,15222.58,14899.97,15175.87,16006.19,15819.14,15307.04,14344.4,14080.93,13171.82,13294.62,12758.67,12839.02,13351.98,13952.97,14165.54,14184.08,15130.32,15709.41,15776.08,15308.08,15294.16,16514.54,16729.44,16937.26,15993.63,16497.47,16832.75,15377.23,15305.57,16922.09,17452.63,18449.19,19375.36,20230.57,20698.83,20462.26,22249.62,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22578.19,21843.26,20732.03,21316.96,21031.95,22277.62,21583.03,22695.11,23495.89,23274.48,22431.08,24488.59,24710.21,22856.79,23564.29,24501.76,26034.03,26070.31,26276.21,25473.13,26164.87,24101.71,24101.71,24291.34,24291.34,24291.34,22306.51,22702.2,22702.2,22702.2,22702.2,22702.2,22702.2,22702.2,23769.09,25574.03,25574.03,25574.03,25574.03,25574.03,25574.03,24113.86,23180.56,22858.8,22977.91,22360.27,22333.21,22271.75,22078.12,22725.72,23035.83,24754.97,26419.36,28343.47,29558.99,31756,31087.44,28350.98,30667.69,28813.57,29401.55,28850.13,31397.13,33668.56,34659.73,38058.26,38500.58,39473.56,46028.89,48737.87,54982.67,56159.68,50636.29,53581.11,58095.99,59634.95,61426.83,60571.2,63524.02,56892.26,60363.37,52462.93,64777.09,68636.58,70072.65,70181.19,72859.29,68937.14,68670.33,67124.57,70886.36,82663.7,74771.43,74329.32,73793.03,73793.03,73793.03,76878.07,80622.54,80426.15,84154.03,85292.46,93479.1,94332.13,98265.23,102329.13,102950.57,110676.23,100028.14,104577.59,107404.54,108247.72,116945.16,127997.66,141673.5,135923.28,135923.28,135923.28,146158.26,156379.55,160033.36,153444.24,161407.14,155505.21];
  const M=DATA.length;
  const YEARTICKS=[[0,"2016"],[25,"2018"],[71,"2020"],[116,"2022"],[162,"2024"],[207,"2026"]];
  const LIVE_I=207;   // Jan 2026 — where live capital begins
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
