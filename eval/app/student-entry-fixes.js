(function(){
  if(window.EXAI_STUDENT_ENTRY_FIXES)return;
  const reviewHref=button=>{
    const row=button.closest('.result'),resultId=button.dataset.resultOpen||row?.dataset.resultId;
    const fallbackId=button.dataset.id?`legacy-${button.dataset.id}`:null,id=resultId||fallbackId;
    if(!id)return null;
    const params=new URLSearchParams({review:'result',resultId:id});
    const title=row?.querySelector('h2')?.textContent?.trim(),subject=row?.querySelector('.sub')?.textContent?.trim();
    if(title)params.set('title',title);
    if(subject)params.set('subject',subject);
    return `/eval/assessment-player/?${params}`;
  };
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-result-open],.result .view.primary[data-id]');
    if(!button)return;
    if(button.dataset.resultRecord)return;
    const href=reviewHref(button);
    if(!href)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    location.href=href;
  },true);
  const clarifyResetLabels=()=>document.querySelectorAll('.learning-reset-menu button').forEach(button=>{if(button.textContent.trim()==='Undo this activity')button.textContent='Reset to not started'});
  new MutationObserver(clarifyResetLabels).observe(document.body,{childList:true,subtree:true});
  clarifyResetLabels();
  window.EXAI_STUDENT_ENTRY_FIXES={reviewHref};
})();
