window.addEventListener('DOMContentLoaded',()=>{
  const host=document.querySelector('.assessment-list,.assessments-list,#assessmentList'),recommended=document.querySelector('.next-card'),search=document.querySelector('#search'),subject=document.querySelector('#subject');
  if(host&&!host.dataset.viewModel)host.replaceChildren();
  if(recommended&&!host?.dataset.viewModel)recommended.hidden=true;
  if(search)search.oninput=null;
  if(subject)subject.onchange=null;
  document.querySelectorAll('.filter-tabs [data-filter]').forEach(button=>button.onclick=null);
});
