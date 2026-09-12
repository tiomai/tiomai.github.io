window.addEventListener('DOMContentLoaded',async()=>{
  const select=document.querySelector('.select-wrap select'),catalog=document.querySelector('.practice-catalog'),heading=document.querySelector('.catalog-head h2');
  if(!select||!catalog)return;
  const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const currentMode=()=>document.querySelector('.mode-card.active')?.dataset.mode||'challenge';
  const showState=(title,copy)=>{catalog.dataset.viewModel='student-practice-entitlements';catalog.innerHTML=`<section class="resource-state"><h3>${escape(title)}</h3><p>${escape(copy)}</p></section>`};
  const render=items=>{
    const subjects=[...new Set(items.map(item=>item.subject).filter(Boolean))];
    select.innerHTML='<option value="all">All subjects</option>'+subjects.map(subject=>`<option value="${escape(subject)}">${escape(subject)}</option>`).join('');
    const draw=()=>{const selected=select.value,visible=items.filter(item=>selected==='all'||item.subject===selected);heading.textContent=selected==='all'?'Practice packs':`${selected} practice packs`;if(!visible.length){showState('No practice packs available','Packs granted to this account will appear here.');return}catalog.dataset.viewModel='student-practice-entitlements';catalog.innerHTML=visible.map(item=>`<article class="pack" data-practice-pack-id="${escape(item.packId)}" data-subject="${escape(item.subject)}" data-entitlement-state="${escape(item.state)}"><div class="pack-icon" aria-hidden="true">${escape((item.subject||'P').slice(0,2))}</div><div><h3>${escape(item.title)}</h3><p data-challenge="${escape(item.questionCount==null?'Question count pending':`${item.questionCount} questions${item.estimatedMinutes?` · approximately ${item.estimatedMinutes} minutes`:''}`)}" data-leisure="${escape(item.questionCount==null?'Question count pending':`${item.questionCount} questions · untimed`)}"></p></div><button>${escape(item.action?.label||'Open')}</button></article>`).join('');document.dispatchEvent(new CustomEvent('exai:practice-catalog-rendered'))};
    select.onchange=draw;draw();
  };
  showState('Loading practice packs…','Checking this account’s active subscriptions.');
  try{await window.EXAI_CONTEXT_READY;const result=await window.EXAI_ADAPTERS.studentPractice.listEntitled({mode:currentMode()});render(result.items||[])}catch(error){showState('Practice packs unavailable',error.message||'Check your connection and try again.')}
});
