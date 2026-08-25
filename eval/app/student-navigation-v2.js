window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.nav,.sidebar nav').forEach(nav=>{
    const links=[...nav.querySelectorAll('a')];
    if(links[0])links[0].href='student-assessment-mockup.html';
    if(links[1])links[1].href='student-practice-mockup.html';
    if(links[2])links[2].href='student-results-mockup.html';
    if(!nav.querySelector('[href="student-performance-mockup.html"]'))nav.insertAdjacentHTML('beforeend','<a class="nav-link" href="student-performance-mockup.html"><span style="font-size:20px">↗</span>Performance</a>');
  });
});
