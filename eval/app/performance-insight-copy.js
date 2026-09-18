(function(){
  if(!location.pathname.includes('student-performance-mockup'))return;
  const refresh=()=>{
    const insight=document.querySelector('#insight'),completed=document.querySelector('#completed');
    if(!insight||!completed)return;
    const count=Number.parseInt(completed.textContent,10)||0;
    if(!count)return;
    const challenge=document.querySelector('.source-tabs [data-source="challenge"]')?.classList.contains('active');
    insight.textContent=`${count} completed ${challenge?'Challenge practice pack':'school assessment'}${count===1?'':'s'} contribute to this performance view. Review the lowest-scoring skill first.`;
  };
  addEventListener('DOMContentLoaded',()=>{
    const host=document.querySelector('#completed');
    if(host)new MutationObserver(refresh).observe(host,{childList:true,subtree:true});
    document.querySelectorAll('.source-tabs button').forEach(button=>button.addEventListener('click',()=>setTimeout(refresh)));
    refresh();
  });
})();
