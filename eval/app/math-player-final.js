window.addEventListener('DOMContentLoaded',()=>{
  const leisure=mode==='leisure';
  document.querySelector('.player-title>span:last-child').textContent=leisure?'Leisure practice · Straight lines':'Challenge practice · Straight lines';
  document.querySelector('.question-meta span').textContent='Straight lines · Multiple choice';
  modeBadge.textContent=leisure?'LEISURE':'CHALLENGE';
  const original=mathNext.onclick;
  mathNext.onclick=()=>{if(leisure&&!mathFeedback.classList.contains('open')&&selected){const correct=selected.dataset.correct==='true';mathFeedback.classList.add('open');mathFeedback.classList.toggle('incorrect',!correct);mathFeedback.querySelector('h3').textContent=correct?'Correct':'Incorrect';selected.classList.add(correct?'answer-correct':'answer-wrong');document.querySelector('[data-correct=true]').classList.add('answer-correct');mathNext.textContent='Next question';document.querySelectorAll('.math-option').forEach(x=>x.disabled=true);mathRail.firstElementChild.classList.add('answered');return}original?.()};
});
