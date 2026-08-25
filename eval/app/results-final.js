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
    const trigger=event.target.closest('[data-id]');if(!trigger)return;const record=typeof data!=='undefined'?data.find(item=>String(item.id)===trigger.dataset.id):null,title=record?.title||'',target=/Math/.test(title)?'student-math-practice-taking-mockup.html?mode=assessment&pack=math-s4&review=result':`student-assessment-taking-mockup.html?review=result&pack=${/Listening/.test(title)?'english-listening':/DSE/.test(title)?'dse-reading':'english-reading'}`;
    queueMicrotask(()=>{const gate=document.querySelector('.review-gate');if(!gate)return;gate.querySelector('b').textContent='Review questions and feedback';gate.querySelector('p').textContent='See your submitted response, the correct answer and the explanation for each question.';const button=gate.querySelector('button');button.disabled=false;button.textContent='Review answers';button.onclick=()=>location.href=target});
  });
  document.querySelector('#archiveList')?.addEventListener('click',event=>{
    if(!event.target.closest('[data-paper]'))return;
    queueMicrotask(()=>{const gate=document.querySelector('.review-gate');if(!gate)return;gate.querySelector('b').textContent='Review the released paper';gate.querySelector('p').textContent='See the questions and released answers. No personal score is available because no submission was made.';const button=gate.querySelector('button');button.disabled=false;button.textContent='View paper & answers';button.onclick=()=>location.href='student-assessment-taking-mockup.html?review=paper'});
  });
  document.querySelector('.challenge-list')?.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;const title=button.closest('article')?.querySelector('h3')?.textContent||'';location.href=/Straight/.test(title)?'student-math-practice-taking-mockup.html?mode=challenge&pack=straight-lines&review=result':/Trigonometry/.test(title)?'student-math-practice-taking-mockup.html?mode=challenge&pack=trigonometry-1&review=result':'student-assessment-taking-mockup.html?review=result&pack=english-listening'});
});
