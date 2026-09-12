window.addEventListener('DOMContentLoaded',async()=>{
  const select=document.querySelector('.select-wrap select'),catalog=document.querySelector('.practice-catalog'),heading=document.querySelector('.catalog-head h2');
  if(!select||!catalog)return;
  if(window.EXAI_CONTEXT_READY){await window.EXAI_CONTEXT_READY;await new Promise(resolve=>setTimeout(resolve));if(catalog.dataset.viewModel==='student-practice-entitlements')return}
  const packs={
    Math:[['∑','Equations of straight lines','straight-lines'],['△','Trigonometry I','trigonometry-1'],['○','Basic properties of circles','circles-basic'],['%','Measures of dispersion','dispersion']],
    English:[['Aa','Vocabulary','english-vocabulary',10,20],['Aa','Grammar','english-grammar',10,20],['R','Reading','english-reading',10,20],['♫','Listening','english-listening',10,20],['DSE','DSE Reading','dse-reading',33,50]],
    'Japanese JLPT':[['日','N5の文法','jlpt-n5-grammar'],['日','N5の語彙と文法','jlpt-n5-vocab-grammar'],['日','N4の文法','jlpt-n4-grammar'],['日','N3の語彙と文法','jlpt-n3-vocab-grammar'],['日','N2の文法','jlpt-n2-grammar'],['日','N1の文法','jlpt-n1-grammar']]
  };
  const getMode=()=>document.querySelector('.mode-card.active')?.dataset.mode||'challenge';
  const render=()=>{
    if(catalog.dataset.viewModel==='student-practice-entitlements')return;
    const selected=select.options[select.selectedIndex]?.textContent||select.value,subjects=selected==='All subjects'?Object.keys(packs):[selected],activeMode=getMode();
    heading.textContent=selected==='All subjects'?'Practice packs':`${selected} practice packs`;
    catalog.innerHTML=subjects.map(subject=>`<section class="practice-subject-group"><header><h3>${subject}</h3><span>${(packs[subject]||[]).length} packs</span></header><div class="practice-subject-grid">${(packs[subject]||[]).map(([icon,title,slug,questionCount,estimatedMinutes])=>`<article class="pack" data-pack="${slug}"><div class="pack-icon">${icon}</div><div><h3 ${slug.startsWith('jlpt-')?'data-no-translate':''}>${title}</h3><p>${questionCount&&estimatedMinutes?`${questionCount} questions · approximately ${estimatedMinutes} minutes`:activeMode==='challenge'?'Timed · score after completion':'Untimed · feedback after each answer'}</p></div><button>${activeMode==='challenge'?'Start Challenge':'Start Leisure'}</button></article>`).join('')}</div></section>`).join('');
  };
  select.addEventListener('change',render);document.querySelectorAll('.mode-card').forEach(card=>card.addEventListener('click',()=>setTimeout(render)));
  catalog.addEventListener('click',event=>{const button=event.target.closest('.pack button:not(.learning-reset-trigger)');if(!button)return;const card=button.closest('.pack'),pack=card.dataset.pack||card.dataset.practicePackId;if(!pack)return;event.preventDefault();event.stopImmediatePropagation();const activeMode=getMode(),subject=String(card.dataset.subject||'').toLowerCase(),title=card.querySelector('h3')?.textContent?.trim().toLowerCase()||'',key=pack.replace(/^pack-/,'');if(subject==='japanese'||key.startsWith('jlpt-')){location.href=`/eval/practice-player/?mode=${activeMode}&pack=${encodeURIComponent(key)}`;return}const english=subject==='english'||key.startsWith('english-')||key==='dse-reading'||['vocabulary','grammar','reading','listening','dse reading'].includes(title);if(english){const slug=key.startsWith('english-')||key==='dse-reading'?key:`english-${key}`;location.href=`/eval/assessment-player/?flow=${activeMode==='leisure'?'practice':'paper'}&pack=${encodeURIComponent(slug)}`;return}const mathAliases={trigonometry:'trigonometry-1'};location.href=`/eval/practice-player/?mode=${activeMode}&pack=${encodeURIComponent(mathAliases[key]||key)}`},true);
  render();
});
