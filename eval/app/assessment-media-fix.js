(function(){
  if(typeof render!=='function'||typeof current==='undefined'||typeof questions==='undefined')return;
  const audio=new Audio('public/audio/english-listening-demo.wav');audio.preload='metadata';let renderedQuestion=current;const playCounts=new Map();
  const replayLabel=()=>{const used=playCounts.get(current)||0,remaining=Math.max(0,2-used),label=document.querySelector('.replays');if(label)label.textContent=`${remaining} play${remaining===1?'':'s'} remaining`};
  const stopAudio=(reset=true)=>{audio.pause();if(reset)audio.currentTime=0;playing=false;clearInterval(tick);wave?.classList.remove('playing');elapsed.textContent='0:00';play.setAttribute('aria-label','Play audio')};
  const originalRender=render;
  render=function(){if(current!==renderedQuestion){stopAudio();renderedQuestion=current}originalRender();replayLabel();const q=questions[current];if(flow==='practice'&&q?.submitted&&Array.isArray(q.options)){document.querySelectorAll('#options .option').forEach((option,index)=>{option.classList.toggle('answer-correct',index===q.correct);option.classList.toggle('answer-wrong',index===q.answer&&index!==q.correct)})}};
  play.onclick=async()=>{if(!audio.paused){stopAudio(false);return}const used=playCounts.get(current)||0;if(audio.currentTime===0||audio.ended){if(used>=2)return;playCounts.set(current,used+1);replayLabel()}try{await audio.play();playing=true;wave.classList.add('playing');play.setAttribute('aria-label','Pause audio')}catch{playing=false;play.setAttribute('aria-label','Audio unavailable')}};
  audio.addEventListener('timeupdate',()=>{elapsed.textContent=`${Math.floor(audio.currentTime/60)}:${String(Math.floor(audio.currentTime%60)).padStart(2,'0')}`});
  audio.addEventListener('loadedmetadata',()=>{const duration=document.querySelector('.audio-time span:last-child');if(duration)duration.textContent=`${Math.floor(audio.duration/60)}:${String(Math.floor(audio.duration%60)).padStart(2,'0')}`});
  audio.addEventListener('ended',()=>{playing=false;audio.currentTime=0;wave.classList.remove('playing');play.setAttribute('aria-label',(playCounts.get(current)||0)>=2?'No plays remaining':'Replay audio')});
  addEventListener('pagehide',()=>stopAudio());render();
})();
