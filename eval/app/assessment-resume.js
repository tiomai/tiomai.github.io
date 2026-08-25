window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('button').forEach(button=>{
    if(/^Continue(?: assessment)?/.test(button.textContent.trim()))button.onclick=()=>location.href=button.closest('.next-card')?'student-math-practice-taking-mockup.html?mode=assessment&pack=math-s4&resume=1':'student-assessment-taking-mockup.html?flow=paper&resume=1';
  });
});
