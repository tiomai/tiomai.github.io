window.addEventListener('DOMContentLoaded',async()=>{
  const select=document.querySelector('.select-wrap select'),catalog=document.querySelector('.practice-catalog'),heading=document.querySelector('.catalog-head h2');
  if(!select||!catalog)return;
  if(window.EXAI_CONTEXT_READY){await window.EXAI_CONTEXT_READY;await new Promise(resolve=>setTimeout(resolve));if(catalog.dataset.viewModel==='student-practice-entitlements')return}
  const packs={
    Math:[['∑','Equations of straight lines','straight-lines'],['△','Trigonometry I','trigonometry-1'],['○','Basic properties of circles','circles-basic'],['%','Measures of dispersion','dispersion']],
    English:[['Aa','Vocabulary','english-vocabulary'],['Aa','Grammar','english-grammar'],['Aa','Reading','english-reading'],['♫','Listening','english-listening']],
    'Japanese JLPT':[['日','N5の文法','jlpt-n5-grammar'],['日','N5の語彙と文法','jlpt-n5-vocab-grammar'],['日','N4の文法','jlpt-n4-grammar'],['日','N3の語彙と文法','jlpt-n3-vocab-grammar'],['日','N2の文法','jlpt-n2-grammar'],['日','N1の文法','jlpt-n1-grammar']]
  };
  const getMode=()=>document.querySelector('.mode-card.active')?.dataset.mode||'challenge';
  const render=()=>{
    if(catalog.dataset.viewModel==='student-practice-entitlements')return;
    const selected=select.options[select.selectedIndex]?.textContent||select.value,subjects=selected==='All subjects'?Object.keys(packs):[selected],activeMode=getMode();
    heading.textContent=selected==='All subjects'?'Practice packs':`${selected} practice packs`;
    catalog.innerHTML=subjects.map(subject=>`<section class="practice-subject-group"><header><h3>${subject}</h3><span>${(packs[subject]||[]).length} packs</span></header><div class="practice-subject-grid">${(packs[subject]||[]).map(([icon,title,slug])=>`<article class="pack" data-pack="${slug}"><div class="pack-icon">${icon}</div><div><h3 ${slug.startsWith('jlpt-')?'data-no-translate':''}>${title}</h3><p>${activeMode==='challenge'?'Timed · score after completion':'Untimed · feedback after each answer'}</p></div><button>${activeMode==='challenge'?'Start Challenge':'Start Leisure'}</button></article>`).join('')}</div></section>`).join('');
  };
  select.addEventListener('change',render);document.querySelectorAll('.mode-card').forEach(card=>card.addEventListener('click',()=>setTimeout(render)));
  catalog.addEventListener('click',event=>{const button=event.target.closest('.pack button:not(.learning-reset-trigger)');if(!button)return;const card=button.closest('.pack'),pack=card.dataset.pack||card.dataset.practicePackId;if(!pack)return;event.preventDefault();event.stopImmediatePropagation();const activeMode=getMode(),subject=String(card.dataset.subject||'').toLowerCase(),title=card.querySelector('h3')?.textContent?.trim().toLowerCase()||'',key=pack.replace(/^pack-/,'');if(subject==='japanese'||key.startsWith('jlpt-')){location.href=`practice-player/?mode=${activeMode}&pack=${encodeURIComponent(key)}`;return}const english=subject==='english'||key.startsWith('english-')||['vocabulary','grammar','reading','listening challenge'].includes(title);if(english){const slug=key.startsWith('english-')?key:`english-${key}`;location.href=`assessment-player/?flow=${activeMode==='leisure'?'practice':'paper'}&pack=${encodeURIComponent(slug)}`;return}const mathAliases={trigonometry:'trigonometry-1'};location.href=`practice-player/?mode=${activeMode}&pack=${encodeURIComponent(mathAliases[key]||key)}`},true);
  render();
});
