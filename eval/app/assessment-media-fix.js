(function(){
  if(typeof render!=='function'||!window.EXAI_LEARNER_QUESTION_RENDERER)return;
  const originalRender=render;
  const originalOptionsClick=options.onclick;
  const originalOptionsInput=options.oninput;
  options.onclick=function(event){
    const control=event.target.closest('[data-option]');
    const blankId=control&&control.dataset.blank;
    if(!blankId)return originalOptionsClick&&originalOptionsClick.call(this,event);
    const q=questions[current];
    if(q&& !q.submitted){
      q.answer=Object.assign({},q.answer&&typeof q.answer==='object'?q.answer:{}, {[blankId]:Number(control.dataset.option)});
      render();
    }
  };
  options.oninput=function(event){
    const blankId=event.target&&event.target.dataset&&event.target.dataset.blank;
    if(!blankId)return originalOptionsInput&&originalOptionsInput.call(this,event);
    const q=questions[current];
    if(q&& !q.submitted){
      q.answer=Object.assign({},q.answer&&typeof q.answer==='object'?q.answer:{}, {[blankId]:event.target.value});
      next.disabled=false;
    }
  };
  render=function(){
    originalRender();const q=questions[current];
    window.EXAI_LEARNER_QUESTION_RENDERER.render({question:q,flow,formatPassage:typeof formatPassage==='function'?formatPassage:null,elements:{prompt,passage,options,questionType,instruction,next}});
    if(flow==='practice'&&q?.submitted&&Array.isArray(q.options)){document.querySelectorAll('#options .option').forEach((option,index)=>{option.classList.toggle('answer-correct',index===q.correct);option.classList.toggle('answer-wrong',index===q.answer&&index!==q.correct)});const explanation=document.querySelector('#feedbackPanel .explanation p');if(explanation&&q.explanation)explanation.textContent=q.explanation}
  };
  render();
})();
