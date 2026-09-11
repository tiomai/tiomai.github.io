(function(){
  const sourceForPage=()=>location.pathname.includes('/eval/')?'/eval/public/audio/english-listening-demo.wav':'public/audio/english-listening-demo.wav';
  const formatTime=value=>`${Math.floor((value||0)/60)}:${String(Math.floor((value||0)%60)).padStart(2,'0')}`;
  const init=card=>{
    if(card.dataset.audioPlayerReady)return;
    const button=card.querySelector('.play'),wave=card.querySelector('.wave'),elapsed=card.querySelector('#elapsed,.audio-elapsed'),duration=card.querySelector('.audio-time span:last-child'),status=card.querySelector('.replays,.audio-state');
    if(!button||!wave||!elapsed||!status)return;
    card.dataset.audioPlayerReady='true';
    const audio=new Audio(card.dataset.audioSrc||sourceForPage());
    audio.preload='metadata';
    const playsByQuestion=new Map();
    let activeQuestion='',playing=false,error='';
    const questionKey=()=>document.querySelector('#questionCount,.question-count,.question-meta b')?.textContent?.trim()||'listening-question';
    const stateFor=key=>playsByQuestion.get(key)||{remaining:Number(card.dataset.maxPlays||2)};
    const paint=()=>{
      const key=questionKey(),state=stateFor(key),active=playing&&activeQuestion===key;
      button.disabled=(!active&&state.remaining===0)||!!error;
      button.classList.toggle('stop',active);
      button.setAttribute('aria-label',active?'Stop audio':state.remaining?'Play audio':'No plays remaining');
      button.innerHTML=active?'<span aria-hidden="true">■</span>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
      wave.classList.toggle('playing',active);
      elapsed.textContent=formatTime(active?audio.currentTime:0);
      if(duration)duration.textContent=formatTime(audio.duration||18);
      status.className='replays audio-state';
      status.innerHTML=`<b>${state.remaining} play${state.remaining===1?'':'s'} remaining</b><span>${error||'Selecting Play uses one play. You can stop the recording, but it cannot be paused.'}</span>`;
    };
    const stop=()=>{audio.pause();audio.currentTime=0;playing=false;activeQuestion='';paint()};
    button.onclick=async()=>{
      const key=questionKey(),state=stateFor(key);
      if(playing&&activeQuestion===key){stop();return}
      if(!state.remaining||error)return;
      state.remaining-=1;playsByQuestion.set(key,state);activeQuestion=key;playing=true;audio.currentTime=0;paint();
      try{await audio.play()}catch{state.remaining+=1;playsByQuestion.set(key,state);playing=false;activeQuestion='';error='Audio could not start. Check your browser audio settings and try again.';paint()}
    };
    audio.addEventListener('timeupdate',paint);
    audio.addEventListener('loadedmetadata',paint);
    audio.addEventListener('ended',stop);
    audio.addEventListener('error',()=>{playing=false;activeQuestion='';error='The listening recording could not be loaded.';paint()});
    const counter=document.querySelector('#questionCount,.question-count');
    if(counter)new MutationObserver(()=>{if(playing&&activeQuestion!==questionKey())stop();else paint()}).observe(counter,{childList:true,subtree:true,characterData:true});
    addEventListener('pagehide',()=>audio.pause());
    paint();
  };
  const initAll=()=>document.querySelectorAll('.audio-card,[data-audio-player]').forEach(init);
  if(document.readyState==='loading')addEventListener('DOMContentLoaded',initAll);else initAll();
  new MutationObserver(initAll).observe(document.documentElement,{childList:true,subtree:true});
})();
