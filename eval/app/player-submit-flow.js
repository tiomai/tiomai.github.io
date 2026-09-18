(function(){
  const mount=()=>{
    const submitButton=document.querySelector('.submit-paper');
    if(!submitButton)return;
    submitButton.onclick=()=>openSubmit('paper',async()=>{
      submitButton.disabled=true;submitButton.textContent='Submitting…';
      try{await window.EXAI_ATTEMPT_UI.submit('manual');location.href='/eval/results/'}
      catch(error){submitButton.disabled=false;submitButton.textContent='Submit assessment';alert(error?.message||'The assessment could not be submitted. Try again.')}
    });
  };
  if(document.readyState==='loading')addEventListener('DOMContentLoaded',mount);else mount();
})();
