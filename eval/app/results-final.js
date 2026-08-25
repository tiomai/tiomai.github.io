window.addEventListener('DOMContentLoaded',()=>{
  const heading=document.querySelector('.heading h1');if(heading)heading.textContent='Results';
  const sub=document.querySelector('.heading>p:last-child');if(sub)sub.textContent='Review your completed work, scores and feedback in separate School Assessment and Challenge Practice histories.';
  const title=document.querySelector('.section-title');if(title)title.textContent='School assessment history';
  document.querySelector('.summary')?.classList.add('results-summary');
  document.querySelector('.challenge-summary')?.classList.add('results-summary');
  const decorateReviewState=()=>document.querySelectorAll('.awaiting-note').forEach(note=>note.textContent='Being reviewed');
  decorateReviewState();
  if(typeof render==='function'){const baseRender=render;render=function(){baseRender();decorateReviewState()}}
  document.querySelector('#results')?.addEventListener('click',event=>{
    if(!event.target.closest('[data-id]'))return;
    queueMicrotask(()=>{const gate=document.querySelector('.review-gate');if(!gate)return;gate.querySelector('b').textContent='Review questions and feedback';gate.querySelector('p').textContent='See your submitted response, the correct answer and the explanation for each question.';const button=gate.querySelector('button');button.disabled=false;button.textContent='Review answers';button.onclick=()=>location.href='student-assessment-taking-mockup.html?review=result'});
  });
  document.querySelector('#archiveList')?.addEventListener('click',event=>{
    if(!event.target.closest('[data-paper]'))return;
    queueMicrotask(()=>{const gate=document.querySelector('.review-gate');if(!gate)return;gate.querySelector('b').textContent='Review the released paper';gate.querySelector('p').textContent='See the questions and released answers. No personal score is available because no submission was made.';const button=gate.querySelector('button');button.disabled=false;button.textContent='View paper & answers';button.onclick=()=>location.href='student-assessment-taking-mockup.html?review=paper'});
  });
  document.querySelector('.challenge-list')?.addEventListener('click',event=>{if(event.target.closest('button'))location.href='student-assessment-taking-mockup.html?review=result'});
});
