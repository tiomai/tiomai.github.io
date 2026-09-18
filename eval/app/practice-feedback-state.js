(function(){
  if(window.EXAI_PRACTICE_FEEDBACK_STATE)return;
  window.EXAI_PRACTICE_FEEDBACK_STATE=true;
  const install=()=>{
    if(typeof window.render!=='function'||window.render.practiceFeedbackState)return;
    document.addEventListener('click',event=>{
      const submitButton=event.target?.closest?.('#next');
      if(!submitButton||typeof flow==='undefined'||flow!=='practice')return;
      const question=typeof questions!=='undefined'&&typeof current!=='undefined'?questions[current]:null;
      if(!question||question.submitted||question.answer===null||question.answer===undefined||question.answer==='')return;
      // Resumed responses can be submitted without a new input event. Refresh
      // their feedback before the base handler marks the question submitted.
      window.EXAI_ATTEMPT_UI?.save?.(question.answer);
    },true);
    const baseRender=window.render;
    const renderWithFeedbackState=function(){
      baseRender();
      if(typeof flow==='undefined'||flow!=='practice'||typeof questions==='undefined'||!Array.isArray(questions))return;
      const question=questions[current];
      if(!question?.submitted||question.correct!==null&&question.correct!==undefined)return;
      const panel=document.querySelector('.feedback-panel');
      if(!panel)return;
      panel.className='feedback-panel open feedback-loading';
      panel.innerHTML=question.feedbackError
        ? `<b>Answer feedback unavailable</b><p>${String(question.feedbackError).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}</p>`
        : '<span class="state-spinner" aria-hidden="true"></span><b>Checking your answer…</b><p>Loading the approved answer and explanation.</p>';
      const next=document.querySelector('#next');
      if(next&&!question.feedbackError)next.disabled=true;
    };
    renderWithFeedbackState.practiceFeedbackState=true;
    window.render=renderWithFeedbackState;
  };
  if(document.readyState==='loading')addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
