window.addEventListener('DOMContentLoaded',()=>{
  const params=new URLSearchParams(location.search);
  if(params.has('review'))return;
  const timer=document.querySelector('.timer'),progress=document.querySelector('.progress');
  const source=flow==='practice'?'practices/':'assessments/',returnToSource=()=>location.href=source;
  const activate=()=>{
    timer.style.visibility='visible';progress.style.visibility='visible';quit.textContent='Leave';
    quit.onclick=()=>leaveBackdrop.classList.add('open');showPlayer();
  };
  if(params.get('resume')==='1'||params.get('autostart')==='1'){activate();return}
  timer.style.visibility='hidden';progress.style.visibility='hidden';quit.textContent='Back';
  quit.onclick=returnToSource;
  start.onclick=activate;
  confirmLeave.onclick=returnToSource;
});
