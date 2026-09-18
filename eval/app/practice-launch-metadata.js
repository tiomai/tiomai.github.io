(function(){
  if(window.EXAI_PRACTICE_LAUNCH_METADATA)return;
  window.EXAI_PRACTICE_LAUNCH_METADATA=true;
  document.addEventListener('click',event=>{
    const button=event.target.closest('.practice-catalog .pack button');
    if(!button||button.disabled)return;
    const card=button.closest('.pack');
    if(!card?.dataset.practicePackId)return;
    const mode=document.querySelector('.mode-card.active')?.dataset.mode||'challenge';
    const meta=card.querySelector('p')?.dataset.challenge||card.querySelector('p')?.textContent||'';
    const count=meta.match(/(\d+)\s+questions?/i)?.[1]||'';
    const minutes=meta.match(/approximately\s+(\d+)\s+minutes?/i)?.[1]||'';
    const params=new URLSearchParams({
      flow:'practice',mode,packId:card.dataset.practicePackId,
      title:card.dataset.title||card.querySelector('h3')?.textContent||'Practice',
      subject:card.dataset.subject||'English',questionCount:count,durationMinutes:minutes
    });
    if(card.dataset.entitlementState==='in_progress')params.set('resume','1');
    event.preventDefault();event.stopImmediatePropagation();
    const href=`/eval/assessment-player/?${params}`;
    location.href=window.EXAI_FRESH_LOCAL_URL?.(href)||href;
  },true);
})();
