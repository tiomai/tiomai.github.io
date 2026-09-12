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

window.addEventListener('load',()=>{
  if(new URLSearchParams(location.search).has('review'))return;
  const params=new URLSearchParams(location.search),packId=params.get('pack')||(flow==='paper'?'dse-reading':'english-grammar'),pack=window.EXAI_APPROVED_ENGLISH_PACKS?.[packId];
  if(!pack)return;
  const minutesByPack={'english-vocabulary':20,'english-grammar':20,'english-reading':20,'english-listening':20,'dse-reading':50};
  const count=pack.items.length,minutes=minutesByPack[packId],kinds=new Set(pack.items.map(item=>item.kind)),isPractice=flow==='practice';
  const answerInstruction=kinds.has('listening')?'Play each recording within its play limit, then answer the related question.':kinds.has('short')?'Complete the multiple-choice and short-answer questions using the passage evidence.':'Choose the best answer for each question.';
  coverTitle.textContent=pack.title.replace(/^Junior English · /,'');
  coverIntro.textContent=isPractice?'Review the pack details before starting. Feedback appears as you work.':'Review the paper details and plan your time before starting.';
  ruleGrid.className='rule-grid';
  ruleGrid.innerHTML=`<div class="rule final-rule"><small>${isPractice?'PACE':'TIME LIMIT'}</small><b>${isPractice?'No time limit':`${minutes} minutes`}</b><span>${isPractice?'Work through the complete pack at your own pace.':'The paper submits automatically when time ends.'}</span></div><div class="rule final-rule"><small>TOTAL QUESTIONS</small><b>${count} questions</b><span>${isPractice?'Feedback is shown after each submitted answer.':'You can move between questions and revisit answers.'}</span></div><div class="rule final-rule important"><small>HOW TO ANSWER</small><b>${kinds.has('listening')?'Use the supplied audio':kinds.has('short')?'Follow each response format':'Select one answer'}</b><span>${answerInstruction}</span></div>`;
  coverFoot.textContent=isPractice?'Complete the pack to save your practice activity.':'Check blanks and bookmarks before final submission.';
  start.textContent=isPractice?'Start practice':'Start assessment';
  const timer=document.querySelector('.timer');if(timer){if(isPractice)timer.style.display='none';else if(minutes)timer.textContent=`◷ ${minutes}:00`}
});
