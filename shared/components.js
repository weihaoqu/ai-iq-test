// ─── Shared Components (radar, confetti, feedback, level indicator) ────

// ─── Radar Chart (pure canvas) ──────────────────────────────────────────
function drawRadar(dimScores){
  const canvas=document.getElementById('radarChart');
  const ctx=canvas.getContext('2d');
  const dpr=window.devicePixelRatio||1;
  const size=340;
  canvas.width=size*dpr;canvas.height=size*dpr;
  canvas.style.width=size+'px';canvas.style.height=size+'px';
  ctx.scale(dpr,dpr);

  const cx=size/2,cy=size/2,maxR=125;
  const n=DIMS.length;
  const angleStep=(2*Math.PI)/n;
  const startAngle=-Math.PI/2;

  // Grid rings
  [0.25,0.5,0.75,1].forEach(frac=>{
    ctx.beginPath();
    for(let i=0;i<=n;i++){
      const angle=startAngle+i*angleStep;
      const x=cx+Math.cos(angle)*maxR*frac;
      const y=cy+Math.sin(angle)*maxR*frac;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.strokeStyle='rgba(255,255,255,.06)';ctx.lineWidth=1;ctx.stroke();
  });

  // Axes + Labels
  const colors=[
    '#60a5fa','#f472b6','#f59e0b','#34d399',
    '#fb923c','#a78bfa','#38bdf8','#f97316'
  ];
  DIMS.forEach((d,i)=>{
    const angle=startAngle+i*angleStep;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(angle)*maxR,cy+Math.sin(angle)*maxR);
    ctx.strokeStyle='rgba(255,255,255,.06)';ctx.lineWidth=1;ctx.stroke();

    const lx=cx+Math.cos(angle)*(maxR+30);
    const ly=cy+Math.sin(angle)*(maxR+30);
    ctx.font='600 9px Outfit,sans-serif';
    ctx.fillStyle=colors[i];
    ctx.textAlign='center';ctx.textBaseline='middle';
    const words=d.label.split(' ');
    if(words.length<=2){
      ctx.fillText(d.label,lx,ly);
    } else {
      ctx.fillText(words.slice(0,2).join(' '),lx,ly-7);
      ctx.fillText(words.slice(2).join(' '),lx,ly+7);
    }
  });

  // Data polygon with glow
  const values=DIMS.map(d=>dimScores[d.key]/DIM_MAX[d.key]);

  // Glow layer
  ctx.save();
  ctx.beginPath();
  values.forEach((v,i)=>{
    const angle=startAngle+i*angleStep;
    const x=cx+Math.cos(angle)*maxR*v;
    const y=cy+Math.sin(angle)*maxR*v;
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.closePath();
  ctx.shadowColor='rgba(37,99,235,.5)';ctx.shadowBlur=20;
  ctx.fillStyle='rgba(37,99,235,.1)';ctx.fill();
  ctx.restore();

  // Main polygon
  ctx.beginPath();
  values.forEach((v,i)=>{
    const angle=startAngle+i*angleStep;
    const x=cx+Math.cos(angle)*maxR*v;
    const y=cy+Math.sin(angle)*maxR*v;
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.closePath();
  const grad=ctx.createLinearGradient(cx-maxR,cy-maxR,cx+maxR,cy+maxR);
  grad.addColorStop(0,'rgba(37,99,235,.15)');
  grad.addColorStop(1,'rgba(245,158,11,.08)');
  ctx.fillStyle=grad;ctx.fill();
  ctx.strokeStyle='rgba(96,165,250,.6)';ctx.lineWidth=2;ctx.stroke();

  // Data points
  values.forEach((v,i)=>{
    const angle=startAngle+i*angleStep;
    const x=cx+Math.cos(angle)*maxR*v;
    const y=cy+Math.sin(angle)*maxR*v;
    ctx.beginPath();ctx.arc(x,y,4.5,0,2*Math.PI);
    ctx.fillStyle=colors[i];ctx.fill();
    ctx.strokeStyle='rgba(6,8,15,.6)';ctx.lineWidth=2;ctx.stroke();
  });
}

// ─── Confetti Animation ─────────────────────────────────────────────────
function launchConfetti(){
  const canvas=document.getElementById('confetti-canvas');
  const ctx=canvas.getContext('2d');
  canvas.width=window.innerWidth;canvas.height=window.innerHeight;
  const colors=['#2563eb','#60a5fa','#38bdf8','#f59e0b','#fbbf24','#f97316','#34d399','#fb923c'];
  const particles=[];
  for(let i=0;i<120;i++){
    particles.push({
      x:canvas.width*Math.random(),
      y:canvas.height*Math.random()*-1,
      w:4+Math.random()*6,h:6+Math.random()*10,
      color:colors[Math.floor(Math.random()*colors.length)],
      vx:(Math.random()-0.5)*3,
      vy:2+Math.random()*4,
      rot:Math.random()*360,
      rotV:(Math.random()-0.5)*8,
      opacity:1
    });
  }
  let frame=0;const maxFrames=180;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.vy+=0.04;p.rot+=p.rotV;
      if(frame>maxFrames*0.6)p.opacity=Math.max(0,p.opacity-0.015);
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);
      ctx.globalAlpha=p.opacity;ctx.fillStyle=p.color;
      ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();
    });
    frame++;
    if(frame<maxFrames)requestAnimationFrame(draw);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  requestAnimationFrame(draw);
}

// ─── Feedback Modal ─────────────────────────────────────────────────────
const FB_STATES=[
  {bg:'#fc7359',indicator:'#790b02',path:'#fc7359',face:'#790b02',title:'#790b02',
   track:'#fc5b3e',eyeW:28,eyeH:28,eyeR:'50%',mouthRot:180,indRot:180,
   label:'BAD',labelColor:'#e33719',indLeft:'0%'},
  {bg:'#dfa342',indicator:'#482103',path:'#dfa342',face:'#482103',title:'#482103',
   track:'#b07615',eyeW:50,eyeH:12,eyeR:'36px',mouthRot:180,indRot:180,
   label:'NOT BAD',labelColor:'#b37716',indLeft:'50%'},
  {bg:'#9fbe59',indicator:'#0b2b03',path:'#9fbe59',face:'#0b2b03',title:'#0b2b03',
   track:'#698b1b',eyeW:60,eyeH:60,eyeR:'50%',mouthRot:0,indRot:0,
   label:'GOOD',labelColor:'#6e901d',indLeft:'100%'}
];
var fbIndex=1; // default to "Not Bad"

function setFeedback(i){
  fbIndex=i;
  const s=FB_STATES[i];
  const wrap=document.getElementById('feedback-wrap');
  wrap.style.backgroundColor=s.bg;
  document.getElementById('fb-eye-l').style.cssText=`width:${s.eyeW}px;height:${s.eyeH}px;border-radius:${s.eyeR};background:${s.face}`;
  document.getElementById('fb-eye-r').style.cssText=`width:${s.eyeW}px;height:${s.eyeH}px;border-radius:${s.eyeR};background:${s.face}`;
  document.getElementById('fb-mouth').style.transform=`rotate(${s.mouthRot}deg)`;
  document.getElementById('fb-mouth-path').setAttribute('stroke',s.face);
  document.getElementById('fb-label').textContent=s.label;
  document.getElementById('fb-label').style.color=s.labelColor;
  document.getElementById('fb-track-line').style.backgroundColor=s.track;
  document.querySelectorAll('.feedback-dot').forEach(d=>d.style.backgroundColor=s.track);
  const ind=document.getElementById('fb-indicator');
  ind.style.left=s.indLeft;
  ind.style.backgroundColor=s.indicator;
  ind.style.transform=`translate(-50%,-50%) rotate(${s.indRot}deg)`;
  document.getElementById('fb-ind-path').setAttribute('stroke',s.path);
  document.querySelectorAll('.feedback-labels span').forEach((sp,j)=>{
    sp.style.color=s.title;
    sp.style.opacity=j===i?'1':'0.5';
  });
  document.getElementById('fb-submit').style.backgroundColor=s.indicator;
  document.getElementById('fb-comment').style.borderColor=s.track;
}

function showFeedbackModal(){
  setFeedback(1);
  document.getElementById('fb-modal').classList.add('active');
}
function closeFeedbackModal(){
  document.getElementById('fb-modal').classList.remove('active');
}

function submitFeedback(){
  const rating=['bad','not_bad','good'][fbIndex];
  const comment=document.getElementById('fb-comment').value.trim();

  // Submit to Google Sheets
  const payload={
    participant_id:participantId,
    participant_name:participantName,
    timestamp:new Date().toISOString(),
    feedback_type:'post_test',
    feedback_rating:rating,
    feedback_comment:comment,
    test_mode:testMode
  };

  let iframe=document.getElementById('_fb_frame');
  if(!iframe){
    iframe=document.createElement('iframe');
    iframe.id='_fb_frame';iframe.name='_fb_frame';
    iframe.style.display='none';
    document.body.appendChild(iframe);
  }
  const form=document.createElement('form');
  form.method='POST';form.action=GOOGLE_SCRIPT_URL;
  form.target='_fb_frame';form.style.display='none';
  const input=document.createElement('input');
  input.type='hidden';input.name='payload';input.value=JSON.stringify(payload);
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  setTimeout(()=>form.remove(),2000);

  showToast('Thanks for your feedback!');
  closeFeedbackModal();
}

// ─── Level Indicator (for adaptive multi-level flow) ────────────────────
function renderLevelIndicator(container, currentLevel) {
  if (!container) return;
  const levels = [
    { num: 1, label: 'Quick Scan' },
    { num: 2, label: 'Deep Dive' },
    { num: 3, label: 'Boss Challenge' }
  ];
  const session = getAdaptiveSession();
  const dots = levels.map((l, i) => {
    let state = 'empty';
    if (l.num < currentLevel) state = 'completed';
    else if (l.num === currentLevel) state = 'active';
    const dot = state === 'completed' ? '\u2713' : state === 'active' ? '\u25CF' : '\u25CB';
    const cls = 'level-dot' + (state !== 'empty' ? ' ' + state : '');
    const connector = i < 2 ? '<span class="level-line">\u2500\u2500</span>' : '';
    return `<span class="${cls}">${dot}</span>${connector}`;
  }).join('');
  const labels = levels.map(l => `<span class="level-label">${l.label}</span>`).join('');
  container.innerHTML = `<div class="level-dots">${dots}</div><div class="level-labels">${labels}</div>`;
}
