window.addEventListener('DOMContentLoaded',()=>{
  const enhanceCover=()=>{
    if(flow==='paper'){
      coverIntro.textContent='Check the paper details and plan your time before you start.';
      ruleGrid.innerHTML=`<div class="rule final-rule"><small>TIME LIMIT</small><b>42 minutes</b><span>The paper submits when time ends.</span></div><div class="rule final-rule"><small>TOTAL QUESTIONS</small><b>10 questions</b><span>You can move between questions.</span></div><div class="rule final-rule important"><small>IMPORTANT</small><b>Review before submitting</b><span>Check blanks and bookmarks on the final review.</span></div>`;
    }
  };
  enhanceCover();flowMode?.addEventListener('change',()=>setTimeout(enhanceCover));
  const originalNext=next.onclick;
  next.onclick=event=>{if(flow==='adaptive'){if(questions[current].answer===null||questions[current].answer==='')return;advanceAdaptive();return}originalNext?.call(next,event)};
  const originalRender=render;
  render=function(){originalRender();flag?.classList.toggle('bookmarked',!!questions[current]?.flagged)};
  const originalReview=showReview;
  showReview=function(isPractice=false){originalReview(isPractice);answeredSummary.className='answered-count';missingSummary.className='unanswered-count'};
  if(typeof reviewMode!=='undefined'&&reviewMode){
    const reviewRender=render;
    render=function(){reviewRender();const q=questions[current],buttons=[...options.querySelectorAll('.option')];buttons.forEach((button,index)=>{button.classList.remove('review-correct','review-wrong');if(index===q.correct)button.classList.add('review-correct');if(q.answer===index&&q.answer!==q.correct)button.classList.add('review-wrong')});const correct=q.answer===q.correct;if(reviewMode==='result'){feedbackPanel.classList.toggle('result-correct',correct);feedbackPanel.classList.toggle('result-incorrect',!correct);feedbackPanel.querySelector(':scope>b').textContent=correct?'Correct':'Incorrect';if(correct){const grid=feedbackPanel.querySelector('.feedback-grid');if(grid)grid.innerHTML=`<div><small>YOUR ANSWER</small><strong>${q.options?.[q.answer]||q.answer}</strong></div>`}}};render();
  }
});
