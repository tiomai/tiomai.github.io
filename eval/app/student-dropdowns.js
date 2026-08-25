window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.profile>span,.user>span').forEach(name=>name.textContent='Raymond');
  const closeAll=except=>document.querySelectorAll('.ds-select.open').forEach(root=>{if(root!==except){root.classList.remove('open');root.querySelector('button')?.setAttribute('aria-expanded','false')}});
  const build=(select,labels)=>{
    const host=select.parentElement;
    if(!host||host.querySelector('.ds-select'))return;
    const root=document.createElement('div');root.className='ds-select';
    const button=document.createElement('button');button.type='button';button.className='ds-select-button';button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');
    const value=document.createElement('span'),chevron=document.createElement('span');chevron.className='ds-select-chevron';button.append(value,chevron);
    const menu=document.createElement('div');menu.className='ds-select-menu';menu.setAttribute('role','listbox');
    const sync=()=>{const selected=select.options[select.selectedIndex];value.textContent=selected?.textContent||labels?.[0]||'';menu.querySelectorAll('.ds-select-option').forEach((option,i)=>option.setAttribute('aria-selected',String(i===select.selectedIndex)))};
    [...select.options].forEach((native,i)=>{const option=document.createElement('button');option.type='button';option.className='ds-select-option';option.setAttribute('role','option');option.textContent=native.textContent;option.onclick=()=>{select.selectedIndex=i;select.dispatchEvent(new Event('change',{bubbles:true}));sync();closeAll()};menu.append(option)});
    button.onclick=()=>{const open=!root.classList.contains('open');closeAll(root);root.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open))};
    select.addEventListener('change',sync);root.append(button,menu);host.append(root);sync();
  };
  document.querySelectorAll('.select-wrap>select,.subject-select>select').forEach(select=>build(select));
  const language=document.querySelector('.language,.lang');
  if(language){const root=document.createElement('div');root.className='ds-select ds-language';const button=document.createElement('button');button.type='button';button.className='ds-select-button';button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');button.innerHTML='<span>English</span><span class="ds-select-chevron"></span>';const menu=document.createElement('div');menu.className='ds-select-menu';menu.setAttribute('role','listbox');['English','繁體中文','简体中文'].forEach((label,i)=>{const option=document.createElement('button');option.type='button';option.className='ds-select-option';option.setAttribute('role','option');option.setAttribute('aria-selected',String(i===0));option.textContent=label;option.onclick=()=>{button.querySelector('span').textContent=label;menu.querySelectorAll('.ds-select-option').forEach(x=>x.setAttribute('aria-selected',String(x===option)));closeAll()};menu.append(option)});button.onclick=()=>{const open=!root.classList.contains('open');closeAll(root);root.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open))};root.append(button,menu);language.replaceWith(root)}
  document.addEventListener('click',event=>{if(!event.target.closest('.ds-select'))closeAll()});document.addEventListener('keydown',event=>{if(event.key==='Escape')closeAll()});
});
