(function(){
  if(typeof render!=='function'||typeof current==='undefined'||typeof questions==='undefined')return;
  const originalRender=render;
  render=function(){originalRender();const q=questions[current];if(flow==='practice'&&q?.submitted&&Array.isArray(q.options)){document.querySelectorAll('#options .option').forEach((option,index)=>{option.classList.toggle('answer-correct',index===q.correct);option.classList.toggle('answer-wrong',index===q.answer&&index!==q.correct)})}};
  render();
})();
