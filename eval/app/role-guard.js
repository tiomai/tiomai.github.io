/* Account access is resolved through EXAI_ACCOUNT_CONTEXT. This guard does not
   query membership, role, preference, or capability tables. */
window.addEventListener('DOMContentLoaded',async()=>{
  const compiled=location.pathname.includes('/eval/'),login=compiled?'/eval/login/':'/eval/login/',local=location.protocol==='file:'||['localhost','127.0.0.1'].includes(location.hostname);
  if(!local){
    const client=window.EXAI_GET_SUPABASE_CLIENT?.(),{data:{session}={}}=client?await client.auth.getSession():{};
    if(!session){location.replace(login);return}
  }
  if(!window.EXAI_CONTEXT_READY){const script=document.createElement('script');script.src=compiled?'/eval/app/context-bootstrap.js?v=20260918-6':'app/context-bootstrap.js?v=20260918-6';document.head.append(script);await new Promise((resolve,reject)=>{script.onload=resolve;script.onerror=reject})}
  const provider=await window.EXAI_CONTEXT_READY,snapshot=provider.getSnapshot().status==='ready'?provider.getSnapshot():await provider.load();
  if(snapshot.status!=='ready')return;
  let context=snapshot.activeContext;const params=new URLSearchParams(location.search),routeKey=provider.currentRoute(),route=provider.routes[routeKey];
  // Local staging links are shared as a sitemap and are expected to open
  // directly. If the saved membership belongs to a different role, select an
  // accessible membership before enforcing the guard. Production keeps the
  // explicit account-switching behaviour.
  const teacherRoute=routeKey&&(routeKey.startsWith('teacher')||routeKey==='students');
  if(local&&routeKey&&(!provider.canAccess(routeKey,context)||(teacherRoute&&context.role!=='teacher'))){
    const accessible=(snapshot.availableContexts||[]).filter(candidate=>provider.canAccess(routeKey,candidate));
    const preferredRole=teacherRoute?'teacher':null;
    const sameOrganisation=accessible.filter(candidate=>candidate.organisationId===context?.organisationId);
    const matching=(preferredRole&&sameOrganisation.find(candidate=>candidate.role===preferredRole))||sameOrganisation[0]||(preferredRole&&accessible.find(candidate=>candidate.role===preferredRole))||accessible[0];
    if(matching){const next=await provider.switchContext(matching.membershipId);context=next.activeContext}
  }
  const teacherReview=Boolean(route?.teacherReview&&context.capabilities?.canReview&&['teacher','administrator'].includes(context.role)&&params.get('viewer')==='teacher'&&['result','paper'].includes(params.get('review')));
  if(!teacherReview&&(!routeKey||!provider.canAccess(routeKey,context))){provider.showDenied();location.replace(provider.defaultHref(context))}
});
