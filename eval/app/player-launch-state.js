
window.addEventListener('DOMContentLoaded',()=>{
  const params=new URLSearchParams(location.search);
  if(params.has('review'))return;
  const timer=document.querySelector('.timer'),progress=document.querySelector('.progress');
  const source=flow==='practice'?'/eval/practices/':'/eval/assessments/',returnToSource=()=>location.href=source;
  const loading=document.createElement('div');loading.className='player-loading';loading.hidden=true;loading.innerHTML='<span class="state-spinner" aria-hidden="true"></span><strong>Loading activity…</strong><small>Preparing approved questions and saved progress.</small>';document.body.append(loading);
  const waitForAttemptUi=()=>window.EXAI_ATTEMPT_UI?Promise.resolve(window.EXAI_ATTEMPT_UI):new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('The activity service did not become ready.')),10000);document.addEventListener('exai:attempt-ui-ready',()=>{clearTimeout(timeout);resolve(window.EXAI_ATTEMPT_UI)},{once:true})});
  const activate=()=>{
    loading.hidden=true;
    timer.style.visibility='visible';progress.style.visibility='visible';quit.textContent='Leave';
    quit.onclick=()=>leaveBackdrop.classList.add('open');showPlayer();
  };
  if(params.get('resume')==='1'||params.get('autostart')==='1'){
    loading.hidden=false;
    waitForAttemptUi().then(ui=>ui.init()).then(activate).catch(error=>{
      loading.hidden=true;
      start.disabled=false;
      start.textContent='Try again';
      console.error(error);
    });
    return
  }
  timer.style.visibility='hidden';progress.style.visibility='hidden';quit.textContent='Back';
  quit.onclick=returnToSource;
  start.onclick=async()=>{start.disabled=true;start.textContent='Loading questions…';loading.hidden=false;try{const ui=await waitForAttemptUi();await ui.init();activate()}catch(error){loading.hidden=true;start.disabled=false;start.textContent='Try again';console.error(error)}};
  confirmLeave.onclick=returnToSource;
});

const syncPlayerLaunchState=()=>{
  if(new URLSearchParams(location.search).has('review'))return;
  const params=new URLSearchParams(location.search),items=typeof questions!=='undefined'?questions:[];
  const count=items.length||Number(params.get('questionCount'))||0,minutes=Number(params.get('durationMinutes'))||Number(document.documentElement.dataset.attemptDurationMinutes)||null,isPractice=flow==='practice',practiceMode=params.get('mode')||'challenge';
  const displayTitle=params.get('title')||'Assessment',displaySubject=params.get('subject')||'English';
  coverTitle.textContent=displayTitle;
  const headerTitle=document.querySelector('.title strong'),headerMeta=document.querySelector('.title span');
  if(headerTitle)headerTitle.textContent=displayTitle;
  if(headerMeta)headerMeta.textContent=`${displaySubject} · ${isPractice?'Practice':'School assessment'}`;
  document.title=`${displayTitle} · EXAI`;
  coverEyebrow.textContent=isPractice?'PRACTICE':'ASSESSMENT';
  coverIntro.textContent=isPractice?(practiceMode==='leisure'?'Work at your own pace. Feedback appears after each answer.':'Complete this timed pack. Your score appears after submission.'):'Review the paper details and plan your time before starting.';
  ruleGrid.className='rule-grid';
  const timing=isPractice&&practiceMode==='leisure'?'No time limit':minutes?`${minutes} minutes`:'Loading activity…';
  const timingHelp=isPractice&&practiceMode==='leisure'?'Leave and resume whenever you need to.':minutes?'The activity submits automatically when time ends.':'The timer starts after the activity is ready.';
  ruleGrid.innerHTML=`<div class="rule final-rule"><small>${isPractice?'PACE':'TIME LIMIT'}</small><b>${timing}</b><span>${timingHelp}</span></div><div class="rule final-rule"><small>TOTAL QUESTIONS</small><b>${count?`${count} questions`:'Loading questions…'}</b><span>${count?'You can move between questions and revisit saved answers.':'The question navigator appears when loading completes.'}</span></div>`;
  coverFoot.textContent=isPractice?(practiceMode==='leisure'?'Your progress is saved, but Leisure work is not scored in Results.':'Complete the pack to save its score in Challenge Results.'):'Submitted assessments are marked automatically unless your school requires review.';
  start.textContent=isPractice?'Start practice':'Start assessment';
  start.disabled=!window.EXAI_ATTEMPT_UI;
  const timer=document.querySelector('.timer');if(timer){if(isPractice||!minutes)timer.style.display='none';else timer.textContent=`◷ ${minutes}:00`}
};
window.addEventListener('load',syncPlayerLaunchState);
document.addEventListener('exai:questions-loaded',syncPlayerLaunchState);
document.addEventListener('exai:attempt-ui-ready',syncPlayerLaunchState);
