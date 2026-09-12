
window.addEventListener('DOMContentLoaded',()=>{
  const params=new URLSearchParams(location.search);
  if(params.has('review'))return;
  const timer=document.querySelector('.timer'),progress=document.querySelector('.progress');
  const source=flow==='practice'?'/eval/practices/':'/eval/assessments/',returnToSource=()=>location.href=source;
  const activate=()=>{
    timer.style.visibility='visible';progress.style.visibility='visible';quit.textContent='Leave';
    quit.onclick=()=>leaveBackdrop.classList.add('open');showPlayer();
  };
  if(params.get('resume')==='1'||params.get('autostart')==='1'){activate();return}
  timer.style.visibility='hidden';progress.style.visibility='hidden';quit.textContent='Back';
  quit.onclick=returnToSource;
  start.onclick=activate;
  confirmLeave.onclick=returnToSource;
});

const syncPlayerLaunchState=()=>{
  if(new URLSearchParams(location.search).has('review'))return;
  const params=new URLSearchParams(location.search),items=typeof questions!=='undefined'?questions:[];
  const count=items.length||Number(params.get('questionCount'))||0,minutes=Number(params.get('durationMinutes'))||null,kinds=new Set(items.map(item=>item.kind)),isPractice=flow==='practice';
  const displayTitle=params.get('title')||'Assessment',displaySubject=params.get('subject')||'English';
  const answerInstruction=kinds.has('listening')?'Play each recording within its play limit, then answer the related question.':kinds.has('short')?'Complete the multiple-choice and short-answer questions using the passage evidence.':'Choose the best answer for each question.';
  coverTitle.textContent=displayTitle;
  const headerTitle=document.querySelector('.title strong'),headerMeta=document.querySelector('.title span');
  if(headerTitle)headerTitle.textContent=displayTitle;
  if(headerMeta)headerMeta.textContent=`${displaySubject} · ${isPractice?'Practice':'School assessment'}`;
  document.title=`${displayTitle} · EXAI`;
  coverIntro.textContent=isPractice?'Review the pack details before starting. Feedback appears as you work.':'Review the paper details and plan your time before starting.';
  ruleGrid.className='rule-grid';
  ruleGrid.innerHTML=`<div class="rule final-rule"><small>${isPractice?'PACE':'TIME LIMIT'}</small><b>${isPractice?'No time limit':minutes?`${minutes} minutes`:'Set by assignment'}</b><span>${isPractice?'Work through the complete pack at your own pace.':'The paper submits automatically when time ends.'}</span></div><div class="rule final-rule"><small>TOTAL QUESTIONS</small><b>${count||'Loading'}${count?' questions':''}</b><span>${isPractice?'Feedback is shown after each submitted answer.':'You can move between questions and revisit answers.'}</span></div><div class="rule final-rule important"><small>HOW TO ANSWER</small><b>${kinds.has('listening')?'Use the supplied audio':kinds.has('short')?'Follow each response format':'Follow each question'}</b><span>${answerInstruction}</span></div>`;
  coverFoot.textContent=isPractice?'Complete the pack to save your practice activity.':'Check blanks and bookmarks before final submission.';
  start.textContent=isPractice?'Start practice':'Start assessment';
  const timer=document.querySelector('.timer');if(timer){if(isPractice||!minutes)timer.style.display='none';else timer.textContent=`◷ ${minutes}:00`}
};
window.addEventListener('load',syncPlayerLaunchState);
document.addEventListener('exai:questions-loaded',syncPlayerLaunchState);
