/* Account access is resolved through EXAI_ACCOUNT_CONTEXT. This guard does not
   query membership, role, preference, or capability tables. */
window.addEventListener('DOMContentLoaded',async()=>{
  const config=window.EXAI_SUPABASE_CONFIG||{},compiled=location.pathname.includes('/eval/'),login=compiled?'/eval/login/':'login/';
  if(window.supabase?.createClient&&config.url&&config.publishableKey){
    const client=window.supabase.createClient(config.url,config.publishableKey),{data:{session}}=await client.auth.getSession();
    if(!session){location.replace(login);return}
  }
  if(!window.EXAI_CONTEXT_READY){const script=document.createElement('script');script.src=compiled?'/eval/app/context-bootstrap.js':'app/context-bootstrap.js';document.head.append(script);await new Promise((resolve,reject)=>{script.onload=resolve;script.onerror=reject})}
  const provider=await window.EXAI_CONTEXT_READY,snapshot=provider.getSnapshot().status==='ready'?provider.getSnapshot():await provider.load();
  if(snapshot.status!=='ready')return;
  const context=snapshot.activeContext,params=new URLSearchParams(location.search),routeKey=provider.currentRoute(),route=provider.routes[routeKey];
  const teacherReview=Boolean(route?.teacherReview&&context.capabilities?.canReview&&['teacher','administrator'].includes(context.role)&&params.get('viewer')==='teacher'&&['result','paper'].includes(params.get('review')));
  if(!teacherReview&&(!routeKey||!provider.canAccess(routeKey,context))){provider.showDenied();location.replace(provider.defaultHref(context))}
});
