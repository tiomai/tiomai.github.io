(function(){
  if(typeof render!=='function'||typeof current==='undefined'||typeof questions==='undefined')return;
  const audio=new Audio('public/audio/english-listening-demo.wav');audio.preload='metadata';let renderedQuestion=current;
  const originalRender=render;
  const stopAudio=()=>{audio.pause();audio.currentTime=0;playing=false;clearInterval(tick);wave?.classList.remove('playing');elapsed.textContent='0:00';play.setAttribute('aria-label','Play audio')};
  render=function(){if(current!==renderedQuestion){stopAudio();renderedQuestion=current}originalRender();const q=questions[current];if(flow==='practice'&&q?.submitted&&Array.isArray(q.options)){document.querySelectorAll('#options .option').forEach((option,index)=>{option.classList.toggle('answer-correct',index===q.correct);option.classList.toggle('answer-wrong',index===q.answer&&index!==q.correct)})}};
  play.onclick=()=>{if(audio.paused){audio.play();playing=true;wave.classList.add('playing');play.setAttribute('aria-label','Pause audio')}else{audio.pause();playing=false;wave.classList.remove('playing');play.setAttribute('aria-label','Play audio')}};
  audio.addEventListener('timeupdate',()=>{elapsed.textContent=`${Math.floor(audio.currentTime/60)}:${String(Math.floor(audio.currentTime%60)).padStart(2,'0')}`});
  audio.addEventListener('loadedmetadata',()=>{const duration=document.querySelector('.audio-time span:last-child');if(duration)duration.textContent=`${Math.floor(audio.duration/60)}:${String(Math.floor(audio.duration%60)).padStart(2,'0')}`});
  audio.addEventListener('ended',()=>{playing=false;wave.classList.remove('playing');play.setAttribute('aria-label','Replay audio')});
  addEventListener('pagehide',stopAudio);render();
})();
