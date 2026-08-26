window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('button').forEach(button=>{
    if(/^Continue(?: assessment)?/.test(button.textContent.trim()))button.onclick=()=>location.href=button.closest('.next-card')?'practice-player/?mode=assessment&pack=math-s4&resume=1':'assessment-player/?flow=paper&resume=1';
  });
});
