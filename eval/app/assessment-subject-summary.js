window.addEventListener('DOMContentLoaded',()=>{
  const heading=document.querySelector('.page-heading');
  if(!heading)return;
  const dueLine=heading.querySelector('div>p:last-child');if(dueLine){dueLine.className='due-message';dueLine.innerHTML='You have <span class="due-emphasis">3 assessments</span> due within the next <span class="due-emphasis due-time">2 days</span>.'}
  heading.insertAdjacentHTML('afterend',`<section class="assessment-performance"><header><div><p class="eyebrow">ENGLISH · SCHOOL ASSESSMENTS</p><h2>Your subject snapshot</h2><p>Last 90 days · official results only</p></div><a href="performance/">View full performance →</a></header><div class="assessment-performance-grid"><div class="performance-score"><b>74%</b><span>Weighted average</span></div><div><small>COMPLETION</small><strong>33 of 58</strong><span>57% completed</span></div><div><small>STRONGEST</small><strong>Reading · 89%</strong><span>Based on scored evidence</span></div><div><small>FOCUS NEXT</small><strong>Grammar · 50%</strong><span>Recommended skill</span></div></div></section>`);
  const nav=document.querySelector('.sidebar nav');
  if(nav&&!nav.querySelector('[href*="performance-v2"]'))nav.insertAdjacentHTML('beforeend','<a class="nav-link" href="performance/"><svg class="performance-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16"/><path d="M7 15l4-4 3 2 5-7"/></svg>Performance</a>');
});
