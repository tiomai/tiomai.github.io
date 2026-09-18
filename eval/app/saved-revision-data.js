(function(){
  const mount=()=>{
    const host=document.querySelector('.content');if(!host)return;
    host.querySelectorAll('.detail-panel,.context-page-state').forEach(node=>node.remove());
    const toolbar=host.querySelector('.subject-toolbar');
    if(toolbar)toolbar.querySelector('p').textContent='Saved revision is not connected yet';
    const state=document.createElement('section');
    state.className='context-page-state resource-state resource-state-empty';
    state.dataset.resourceState='empty';
    state.innerHTML='<h2>Saved revision is unavailable</h2><p>Questions will appear here after account-scoped bookmark persistence is available. Nothing is stored in this browser.</p><a class="primary-action" href="/eval/practices/">Return to Practices</a>';
    host.append(state);
  };
  if(document.readyState==='loading')addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
