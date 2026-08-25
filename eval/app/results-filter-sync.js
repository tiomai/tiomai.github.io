window.addEventListener('DOMContentLoaded',()=>{
  const originalRenderArchive=window.renderArchive;
  if(typeof originalRenderArchive!=='function'||!window.search||!window.subject)return;
  window.renderArchive=function(){
    const query=search.value.trim().toLowerCase();
    const selectedSubject=subject.value;
    const filtered=expiredItems.filter(item=>
      (selectedSubject==='all'||item.subject.toLowerCase()===selectedSubject)&&
      `${item.title} ${item.subject}`.toLowerCase().includes(query)
    );
    const pages=Math.max(1,Math.ceil(filtered.length/archivePageSize));
    archivePage=Math.min(archivePage,pages);
    const shown=filtered.slice((archivePage-1)*archivePageSize,archivePage*archivePageSize);
    archiveList.innerHTML=shown.map(item=>`<article class="archive-row"><div><h3>${item.title}</h3><p>${item.subject} · Not submitted</p></div><time>Closed 24 Aug</time><button class="paper-view" data-paper="${item.id}">View paper</button></article>`).join('')||'<div class="empty"><b>No expired papers found</b><span>Try another subject or search.</span></div>';
    document.querySelector('.archive-toggle span').textContent=query||selectedSubject!=='all'?`${filtered.length} matching papers · Show list ↓`:`${filtered.length} papers hidden · Show list ↓`;
    renderPager(archivePagination,archivePage,filtered.length,archivePageSize,page=>{archivePage=page;renderArchive()});
  };
  search.addEventListener('input',()=>{archivePage=1;renderArchive()});
  subject.addEventListener('change',()=>{archivePage=1;renderArchive()});
  renderArchive();

  const polishResults=()=>{
    document.querySelectorAll('.awaiting-note').forEach(el=>{if(el.textContent!=='Being reviewed')el.textContent='Being reviewed'});
    document.querySelectorAll('.review-gate:not([data-ready])').forEach(gate=>{
      const closed=gate.closest('.drawer')?.querySelector('.drawer-head .eyebrow')?.textContent.includes('CLOSED');
      gate.dataset.ready='true';
      gate.querySelector('b').textContent=closed?'View released paper and answers':'Review questions and explanations';
      gate.querySelector('p').textContent=closed?'Open the released paper without a personal submission or score.':'Compare your submitted answers with correct answers and explanations.';
      const button=gate.querySelector('button');
      button.disabled=false;
      button.textContent=closed?'View paper':'Review answers';
      button.onclick=()=>location.href=`student-assessment-taking-mockup.html?flow=paper&review=${closed?'paper':'result'}`;
    });
  };
  polishResults();
  new MutationObserver(polishResults).observe(document.body,{childList:true,subtree:true});
});
