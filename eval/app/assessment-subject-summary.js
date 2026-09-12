window.addEventListener('DOMContentLoaded',()=>{
  const heading=document.querySelector('.page-heading');
  if(!heading)return;
  // Subject performance belongs on Results/Performance, not the assessment list.
  const nav=document.querySelector('.sidebar nav');
  if(nav&&!nav.querySelector('[href*="performance-v2"]'))nav.insertAdjacentHTML('beforeend','<a class="nav-link" href="/eval/performance/"><svg class="performance-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16"/><path d="M7 15l4-4 3 2 5-7"/></svg>Performance</a>');
});
