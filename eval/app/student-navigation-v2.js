(function(){if(!window.EXAI_CONTEXT_READY&&!document.querySelector('script[src$="app/context-bootstrap.js"]')){const script=document.createElement('script');script.src=location.pathname.includes('/eval/')?'/eval/app/context-bootstrap.js':'app/context-bootstrap.js';document.head.append(script)}})();
window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.nav,.sidebar nav').forEach(nav=>{
    const links=[...nav.querySelectorAll('a')];
    const byLabel=label=>links.find(link=>link.textContent.trim().toLowerCase().includes(label));
    const assessment=byLabel('assessment'),practice=byLabel('practice'),results=byLabel('result');
    if(assessment)assessment.href='/eval/assessments/';
    if(practice)practice.href='/eval/practices/';
    if(results)results.href='/eval/results/';
    if(!nav.querySelector('[href="/eval/performance/"]'))nav.insertAdjacentHTML('beforeend','<a class="nav-link" href="/eval/performance/"><svg class="performance-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16"/><path d="M7 15l4-4 3 2 5-7"/></svg>Performance</a>');
  });
});
