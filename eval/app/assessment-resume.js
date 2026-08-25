window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('button').forEach(button=>{
    if(/^Continue(?: assessment)?/.test(button.textContent.trim()))button.onclick=()=>location.href='student-assessment-taking-mockup.html?flow=paper&resume=1';
  });
});
