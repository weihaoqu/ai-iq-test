// ─── Shared Engine (constants, utilities, screen management, timer) ────

const DIMS = [
  {key:'foundations',       label:'AI Foundations',         color:'var(--dim-foundations)'},
  {key:'problemFraming',    label:'Problem Framing',        color:'var(--dim-problem)'},
  {key:'toolSelection',     label:'Tool Selection',         color:'var(--dim-tool)'},
  {key:'promptEngineering', label:'Prompt Engineering',     color:'var(--dim-prompt)'},
  {key:'criticalEvaluation',label:'Critical Evaluation',    color:'var(--dim-critical)'},
  {key:'ethicsSafety',      label:'Ethics & Safety',        color:'var(--dim-ethics)'},
  {key:'humanCollaboration',label:'AI-Human Collaboration', color:'var(--dim-collab)'},
  {key:'vibeCoding',        label:'AI-Assisted Building',   color:'var(--dim-vibe)'}
];

const LEVELS = [
  {min:48, max:110, label:'AI Novice',       lvl:1, cls:'iq-level-1'},
  {min:111,max:140, label:'AI Apprentice',   lvl:2, cls:'iq-level-2'},
  {min:141,max:170, label:'AI Practitioner', lvl:3, cls:'iq-level-3'},
  {min:171,max:192, label:'AI Master',       lvl:4, cls:'iq-level-4'}
];

const QUICK_LEVELS = [
  {min:25,max:56,label:'AI Novice',lvl:1,cls:'iq-level-1'},
  {min:57,max:68,label:'AI Apprentice',lvl:2,cls:'iq-level-2'},
  {min:69,max:81,label:'AI Practitioner',lvl:3,cls:'iq-level-3'},
  {min:82,max:100,label:'AI Master',lvl:4,cls:'iq-level-4'}
];

// HTML-escape user input for safe innerHTML insertion
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}

function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

// ─── Screen Management ──────────────────────────────────────────────────
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el=document.getElementById(id);
  el.classList.add('active');
  window.scrollTo({top:0,behavior:'instant'});
  // Focus first focusable element for accessibility
  const focusable=el.querySelector('button,input,select,[tabindex]');
  if(focusable)setTimeout(()=>focusable.focus({preventScroll:true}),100);
  // Hook for page-specific screen change logic
  if (typeof onScreenChange === 'function') onScreenChange(id);
}

// ─── Toast ──────────────────────────────────────────────────────────────
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}

// ─── Animate Count ──────────────────────────────────────────────────────
function animateCount(el,target,duration){
  const start=performance.now();
  function tick(now){
    const t=Math.min((now-start)/duration,1);
    const ease=1-Math.pow(1-t,3);
    el.textContent=Math.round(ease*target)+(el.dataset.suffix||'');
    if(t<1)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ─── Timer ──────────────────────────────────────────────────────────────
var timerInterval=null;
function startTimer(){
  if(timerInterval)clearInterval(timerInterval);
  timerInterval=setInterval(()=>{
    if(!quizStartTime)return;
    const el=document.getElementById('q-timer');
    if(!el)return;
    const secs=Math.floor((Date.now()-quizStartTime)/1000);
    const m=Math.floor(secs/60);const s=secs%60;
    el.textContent=`${m}:${String(s).padStart(2,'0')}`;
  },1000);
}

function stopTimer(){
  if(timerInterval){clearInterval(timerInterval);timerInterval=null;}
}

// ─── Adaptive Session Management ────────────────────────────────────────
const ADAPTIVE_KEY = 'adaptive_session';

function getAdaptiveSession() {
  try { return JSON.parse(localStorage.getItem(ADAPTIVE_KEY)) || {}; }
  catch { return {}; }
}

function saveAdaptiveSession(data) {
  const session = getAdaptiveSession();
  Object.assign(session, data);
  localStorage.setItem(ADAPTIVE_KEY, JSON.stringify(session));
}

function clearAdaptiveSession() {
  localStorage.removeItem(ADAPTIVE_KEY);
}
