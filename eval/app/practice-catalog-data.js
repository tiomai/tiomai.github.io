window.addEventListener('DOMContentLoaded',()=>{
  const select=document.querySelector('.select-wrap select'),catalog=document.querySelector('.practice-catalog'),heading=document.querySelector('.catalog-head h2');
  if(!select||!catalog)return;
  const packs={
    Math:[['∑','Equations of straight lines','straight-lines'],['△','Trigonometry I','trigonometry-1'],['○','Basic properties of circles','circles-basic'],['%','Measures of dispersion','dispersion']],
    English:[['Aa','Vocabulary','english-vocabulary'],['Aa','Grammar','english-grammar'],['Aa','Reading','english-reading'],['♫','Listening','english-listening'],['TW','Taiwan GSAT 115','tw-gsat-115']],
    'Japanese JLPT':[['日','N5の文法','jlpt-n5-grammar'],['日','N5の語彙と文法','jlpt-n5-vocab-grammar'],['日','N4の文法','jlpt-n4-grammar'],['日','N3の語彙と文法','jlpt-n3-vocab-grammar'],['日','N2の文法','jlpt-n2-grammar'],['日','N1の文法','jlpt-n1-grammar']]
  };
  const getMode=()=>document.querySelector('.mode-card.active')?.dataset.mode||'challenge';
  const render=()=>{
    const selected=select.options[select.selectedIndex]?.textContent||select.value,subjects=selected==='All subjects'?Object.keys(packs):[selected],activeMode=getMode();
    heading.textContent=selected==='All subjects'?'Practice packs':`${selected} practice packs`;
    catalog.innerHTML=subjects.map(subject=>`<section class="practice-subject-group"><header><h3>${subject}</h3><span>${(packs[subject]||[]).length} packs</span></header><div class="practice-subject-grid">${(packs[subject]||[]).map(([icon,title,slug])=>`<article class="pack" data-pack="${slug}"><div class="pack-icon">${icon}</div><div><h3 ${slug.startsWith('jlpt-')?'data-no-translate':''}>${title}</h3><p>${activeMode==='challenge'?'Timed · score after completion':'Untimed · feedback after each answer'}</p></div><button>${activeMode==='challenge'?'Start Challenge':'Start Leisure'}</button></article>`).join('')}</div></section>`).join('');
  };
  select.addEventListener('change',render);document.querySelectorAll('.mode-card').forEach(card=>card.addEventListener('click',()=>setTimeout(render)));
  catalog.addEventListener('click',event=>{const button=event.target.closest('.pack button');if(!button)return;event.preventDefault();event.stopImmediatePropagation();const pack=button.closest('.pack').dataset.pack,activeMode=getMode();if(pack==='tw-gsat-115'){location.href=`taiwan-english-player/?year=115&mode=${activeMode}`;return}if(pack.startsWith('english-')){location.href=`assessment-player/?flow=${activeMode==='leisure'?'practice':'paper'}&pack=${pack}`;return}location.href=`practice-player/?mode=${activeMode}&pack=${pack}`},true);
  render();
});
