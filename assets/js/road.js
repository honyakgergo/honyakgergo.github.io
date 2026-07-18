/* ═══ Equity-road hero — DARK EDITION, section-scroll driven ═══
   window.EquityRoad.init({canvas, section, stage, intro, end})
   Identical geometry/camera to the light road.js; only the colours
   (line, gridlines, value/year labels, skill-gate labels) are tuned
   for the dark theme. */
(function(){
  "use strict";
  let cv, ctx, section, stageEl, introEl, endEl, reduce=false, CX=0, CY=0;
  const lerp=(a,b,t)=>a+(b-a)*t;
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const ss=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};

  /* ---------- equity data (real strategy, 2016-2026, downsampled to 220) ---------- */
  const DATA=[9999.98,10740.21,11134.9,11701.4,11896.81,11640.97,11095.81,11224.88,11076,11243.07,11687.9,12079.05,12441.54,12750.36,13045.34,12497.7,12316.04,13080.31,13348.69,14425.75,14537.71,14604.05,15335.72,14212.29,14972.4,15453.22,15863.96,14871.53,15214.3,15814.14,14947.19,15395.57,15375.39,15665.73,15849.47,15810.65,14746.36,15222.58,14899.97,15175.87,16006.19,15819.14,15307.04,14344.4,14080.93,13171.82,13294.62,12758.67,12839.02,13351.98,13952.97,14165.54,14184.08,15130.32,15709.41,15776.08,15308.08,15294.16,16514.54,16729.44,16937.26,15993.63,16497.47,16832.75,15377.23,15305.57,16922.09,17452.63,18449.19,19375.36,20230.57,20698.83,20462.26,22249.62,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22221.16,22578.19,21843.26,20732.03,21316.96,21031.95,22277.62,21583.03,22695.11,23495.89,23274.48,22431.08,24488.59,24710.21,22856.79,23564.29,24501.76,26034.03,26070.31,26276.21,25473.13,26164.87,24101.71,24101.71,24291.34,24291.34,24291.34,22306.51,22702.2,22702.2,22702.2,22702.2,22702.2,22702.2,22702.2,23769.09,25574.03,25574.03,25574.03,25574.03,25574.03,25574.03,24113.86,23180.56,22858.8,22977.91,22360.27,22333.21,22271.75,22078.12,22725.72,23035.83,24754.97,26419.36,28343.47,29558.99,31756,31087.44,28350.98,30667.69,28813.57,29401.55,28850.13,31397.13,33668.56,34659.73,38058.26,38500.58,39473.56,46028.89,48737.87,54982.67,56159.68,50636.29,53581.11,58095.99,59634.95,61426.83,60571.2,63524.02,56892.26,60363.37,52462.93,64777.09,68636.58,70072.65,70181.19,72859.29,68937.14,68670.33,67124.57,70886.36,82663.7,74771.43,74329.32,73793.03,73793.03,73793.03,76878.07,80622.54,80426.15,84154.03,85292.46,93479.1,94332.13,98265.23,102329.13,102950.57,110676.23,100028.14,104577.59,107404.54,108247.72,116945.16,127997.66,141673.5,135923.28,135923.28,135923.28,146158.26,156379.55,160033.36,153444.24,161407.14,155505.21];
  const YEARTICKS=[[0,"2016"],[2,"2017"],[25,"2018"],[48,"2019"],[71,"2020"],[94,"2021"],[116,"2022"],[139,"2023"],[162,"2024"],[185,"2025"],[207,"2026"]];
  const M=DATA.length, eq=DATA.slice();
  const minV=Math.min(...eq), maxV=Math.max(...eq);
  /* fixed, round value axis so the gridline labels are clean (0 → 200k) */
  const AXIS_LO=0, AXIS_HI=200000, AXIS_TICKS=4;
  const fmtK=v=>v===0?"0":(v/1000)+"k";

  /* ---------- 3D road ---------- */
  const DZ=15, HEIGHT=92, YBASE=12, LAT=36;
  const P=[];
  for(let i=0;i<M;i++) P.push({
    x: LAT*Math.sin(i*0.052)+LAT*0.5*Math.sin(i*0.019+1.2),
    y: YBASE+(eq[i]-minV)/(maxV-minV)*HEIGHT,
    z: i*DZ
  });
  const COL=[]; let pk=eq[0];
  const mixc=(c1,c2,t)=>[lerp(c1[0],c2[0],t),lerp(c1[1],c2[1],t),lerp(c1[2],c2[2],t)];
  const BLUE=[91,147,255],BLUEDK=[59,110,220],SLATE=[100,116,139];
  for(let i=0;i<M;i++){ pk=Math.max(pk,eq[i]); const dd=(pk-eq[i])/pk;
    COL.push(mixc(mixc(BLUE,BLUEDK,i/(M-1)),SLATE,Math.min(1,dd/0.12))); }
  const rgb=(c,a)=>`rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a})`;

  const GATES=[
    {f:0.15,label:"DATA SCIENCE"},{f:0.35,label:"AI"},
    {f:0.55,label:"QUANT RESEARCH"},{f:0.78,label:"STATISTICS"},
  ].map(g=>({...g,i:Math.round(g.f*(M-1))}));

  /* ---------- camera ---------- */
  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const crs=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const nrm=v=>{const l=Math.hypot(v[0],v[1],v[2])||1;return[v[0]/l,v[1]/l,v[2]/l];};
  let W,H,dpr,focal, cam={pos:[0,0,0],fwd:[0,0,1],right:[1,0,0],up:[0,1,0]};
  const NEAR=1.2, FOG_N=60, FOG_F=1500;
  function setCam(pos,tgt){
    const fwd=nrm([tgt[0]-pos[0],tgt[1]-pos[1],tgt[2]-pos[2]]);
    const right=nrm(crs([0,1,0],fwd)); const up=crs(fwd,right);
    cam={pos,fwd,right,up};
  }
  function project(px,py,pz){
    const v=[px-cam.pos[0],py-cam.pos[1],pz-cam.pos[2]];
    const cz=dot(v,cam.fwd); if(cz<=NEAR) return null;
    return {x:CX+dot(v,cam.right)/cz*focal, y:CY-dot(v,cam.up)/cz*focal, z:cz, s:focal/cz};
  }
  const fog=cz=>cz>=FOG_F?0:cz<=FOG_N?cz/FOG_N:1-(cz-FOG_N)/(FOG_F-FOG_N);
  function sample(f){const i=clamp(Math.floor(f),0,M-1),j=Math.min(M-1,i+1),t=f-i;
    return {x:lerp(P[i].x,P[j].x,t),y:lerp(P[i].y,P[j].y,t),z:lerp(P[i].z,P[j].z,t)};}

  /* ---------- 2D plot layout (the "real plot" end state, RIGHT half) ---------- */
  let PX=[],PY=[], plotBottom=0, plotTop=0, ML=0;
  function layoutPlot(){
    let MR, MT, MB;
    if (W < 820) { ML=W*0.09; MR=W*0.06; MT=H*0.50; MB=H*0.09; }   // phone: full-width plot in the lower half
    else { ML=W*0.53; MR=W*0.05; MT=H*0.30; MB=H*0.20; }           // desktop: right-half plot
    const pw=W-ML-MR; plotTop=MT; plotBottom=H-MB;
    const lo=AXIS_LO, hi=AXIS_HI;
    PX=[];PY=[];
    for(let i=0;i<M;i++){ PX.push(ML+(i/(M-1))*pw);
      PY.push(plotBottom-((eq[i]-lo)/(hi-lo))*(plotBottom-plotTop)); }
  }

  function resize(){
    dpr=Math.min(devicePixelRatio||1,2); W=innerWidth; H=innerHeight;
    cv.width=W*dpr; cv.height=H*dpr; cv.style.width=W+"px"; cv.style.height=H+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0); focal=Math.min(W,H)*0.92; CX=W*0.50; CY=H*0.58; layoutPlot();
  }

  /* ---------- progress + stage visibility come from the hero section's scroll ---------- */
  let target=0, disp=0;

  function tangent(f){ const a=sample(clamp(f,0,M-1)), b=sample(clamp(f+1,0,M-1));
    return nrm([b.x-a.x,b.y-a.y,b.z-a.z]); }
  // ride ALONGSIDE the curve from the RIGHT side and above
  const SIDE_OFF=26, EYE_UP=6, BACK=9, LOOK=12;
  function travelPose(f){
    const b=sample(clamp(f,0,M-1)), t=tangent(f), side=nrm(crs([0,1,0], t)); // +x = right side
    const eye=[ b.x+side[0]*SIDE_OFF - t[0]*BACK, b.y+EYE_UP, b.z+side[2]*SIDE_OFF - t[2]*BACK ];
    const la=sample(clamp(f+LOOK,0,M-1));
    return {eye, tgt:[la.x, la.y+2, la.z]};
  }
  const TRAVEL=0.58, REVEAL_END=0.80;   // ride ends at 0.58; plot fully formed by 0.80; 0.80-1.0 holds it
  function positionCamera(s){
    if(s<=TRAVEL){
      const f=(s/TRAVEL)*(M-1), pose=travelPose(f);
      setCam(pose.eye, pose.tgt);
      return {mode:0,f,mFlat:0};
    }
    const u=clamp((s-TRAVEL)/(REVEAL_END-TRAVEL),0,1);
    const p1=ss(0.0,0.5,u);      // phase 1: pull back to a full overview of the road
    const mFlat=ss(0.5,1.0,u);   // phase 2: hold camera, unfold into the flat plot
    const st=travelPose(M-1);
    const EW=[260,360,-520], TW=[0,60,1600];   // overview eye + target (whole road recedes)
    setCam(
      [lerp(st.eye[0],EW[0],p1), lerp(st.eye[1],EW[1],p1), lerp(st.eye[2],EW[2],p1)],
      [lerp(st.tgt[0],TW[0],p1), lerp(st.tgt[1],TW[1],p1), lerp(st.tgt[2],TW[2],p1)]
    );
    return {mode:1,f:M-1,u,mFlat};
  }

  /* ---------- per-point screen position (handles travel + morph to plot) ---------- */
  function pt(i,state){
    if(state.mode===0){
      const p=project(P[i].x,P[i].y,P[i].z);
      if(!p) return {vis:false};
      return {vis:true,x:p.x,y:p.y,a:fog(p.z),s:p.s};
    }
    const mF=state.mFlat, tx=PX[i], ty=PY[i];
    const p=project(P[i].x,P[i].y,P[i].z);
    const fx=p?p.x:tx, fy=p?p.y:ty, a0=p?clamp(1-p.z/6500,0.30,1):0, sc=p?p.s:1;
    return {vis:true, x:lerp(fx,tx,mF), y:lerp(fy,ty,mF), a:lerp(a0,1,mF), s:sc, mF};
  }

  /* ---------- plot chrome (grid/axes/fill), fades in with mFlat ---------- */
  function drawChrome(state, SP){
    const a=state.mFlat; if(a<=0.01) return;
    ctx.save();
    // area fill under morphing curve
    ctx.beginPath(); let open=false;
    for(let i=0;i<M;i++){ const q=SP[i]; if(!q.vis){open=false;continue;}
      if(!open){ctx.moveTo(q.x,plotBottom);ctx.lineTo(q.x,q.y);open=true;} else ctx.lineTo(q.x,q.y); }
    const last=SP[M-1]; if(last.vis) ctx.lineTo(last.x,plotBottom);
    const g=ctx.createLinearGradient(0,plotTop,0,plotBottom);
    g.addColorStop(0,`rgba(91,147,255,${0.16*a})`); g.addColorStop(1,"rgba(91,147,255,0)");
    ctx.fillStyle=g; ctx.fill();
    // gridlines + value labels
    ctx.font="11px JetBrains Mono, monospace"; ctx.textAlign="right";
    ctx.strokeStyle=`rgba(255,255,255,${0.08*a})`; ctx.lineWidth=1;
    const lo=AXIS_LO, hi=AXIS_HI;
    for(let k=0;k<=AXIS_TICKS;k++){ const v=lo+(k/AXIS_TICKS)*(hi-lo);
      const y=plotBottom-((v-lo)/(hi-lo))*(plotBottom-plotTop);
      ctx.beginPath(); ctx.moveTo(ML,y); ctx.lineTo(W-W*0.05,y); ctx.stroke();
      ctx.fillStyle=`rgba(150,153,160,${0.8*a})`; ctx.fillText(fmtK(v), ML-10, y+3); }
    // year labels
    ctx.textAlign="center"; ctx.fillStyle=`rgba(150,153,160,${0.85*a})`;
    YEARTICKS.forEach(([i,t],k)=>{ if(k%2!==0 && k!==YEARTICKS.length-1) return;
      ctx.fillText(t, PX[i], plotBottom+22); });
    ctx.restore();
  }

  /* ---------- the equity curve (single line) ---------- */
  function drawCurve(state, SP){
    ctx.lineJoin="round"; ctx.lineCap="round";
    for(let pass=0;pass<2;pass++){
      for(let i=0;i<M-1;i++){
        const p=SP[i], q=SP[i+1]; if(!p.vis||!q.vis) continue;
        const smax=focal/22;                                 // a point this close to the lens = streak source
        if(p.s>smax||q.s>smax) continue;
        if(Math.hypot(p.x-q.x,p.y-q.y)>650) continue;        // backstop for any residual long segment
        const a=(p.a+q.a)/2; if(a<=0.01) continue;
        const c=COL[i], s=p.s, mF=state.mode===1?state.mFlat:0;
        let w, al;
        if(pass===0){ w=lerp(Math.min(20,3.2*s),5,mF); al=a*0.10; }   // soft body (no glow)
        else { w=lerp(Math.min(7,1.4*s),2.1,mF); al=a; }             // crisp core
        ctx.strokeStyle=rgb(c,al); ctx.lineWidth=w;
        ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
      }
    }
  }

  /* ---------- gates / plot annotations ---------- */
  function drawGates(state, SP){
    if(state.mode!==0) return;               // labels appear only during the ride, never on the final plot
    for(const g of GATES){
      const anchor=SP[g.i]; if(!anchor.vis) continue;
      const prox=Math.max(0,1-Math.abs(state.f-g.i)/26), f=anchor.a*prox;
      if(f>0.02){
        const a=P[g.i], p=project(a.x,a.y+16,a.z);
        const size=clamp(22*anchor.s,16,46);
        ctx.font=`600 ${size}px JetBrains Mono, monospace`; ctx.textAlign="center";
        ctx.fillStyle=`rgba(235,236,240,${f})`;
        ctx.fillText(g.label, p?p.x:anchor.x, p?p.y:anchor.y-14);
      }
    }
  }

  /* ---------- overlay opacity ---------- */
  function ui(s){
    if(introEl) introEl.style.opacity=String(Math.max(0,1-s/0.06));
    if(endEl)   endEl.style.opacity=String(clamp((s-0.9)/0.07,0,1));
  }

  /* ---------- render loop ---------- */
  function frame(){
    if(section){
      const r=section.getBoundingClientRect();
      const total=r.height-innerHeight;
      target=total>0?clamp(-r.top/total,0,1):0;
      // the fixed stage is only visible while the hero section owns the viewport
      const active=r.bottom>1;   // visible until the hero has fully scrolled out; the next section wipes over it
      if(stageEl) stageEl.style.visibility=active?"visible":"hidden";
    }
    disp+=(target-disp)*(reduce?1:0.12);
    const s=disp;
    ctx.clearRect(0,0,W,H);
    const state=positionCamera(s);
    const SP=new Array(M); for(let i=0;i<M;i++) SP[i]=pt(i,state);
    drawChrome(state,SP);
    drawCurve(state,SP);
    drawGates(state,SP);
    ui(s);
    requestAnimationFrame(frame);
  }

  window.EquityRoad={
    init(o){
      cv=document.getElementById(o.canvas); if(!cv) return;
      ctx=cv.getContext("2d");
      section=document.getElementById(o.section);
      stageEl=o.stage?document.getElementById(o.stage):(section?section.firstElementChild:null);
      introEl=o.intro?document.getElementById(o.intro):null;
      endEl=o.end?document.getElementById(o.end):null;
      reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
      resize(); addEventListener("resize",resize);
      requestAnimationFrame(frame);
    },
    resize
  };
})();
