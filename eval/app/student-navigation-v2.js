window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.nav,.sidebar nav').forEach(nav=>{
    const links=[...nav.querySelectorAll('a')];
    if(links[0])links[0].href='assessments/';
    if(links[1])links[1].href='practice/';
    if(links[2])links[2].href='results/';
    if(!nav.querySelector('[href="performance/"]'))nav.insertAdjacentHTML('beforeend','<a class="nav-link" href="performance/"><span style="font-size:20px">↗</span>Performance</a>');
  });
});
