window.addEventListener('DOMContentLoaded',async()=>{
  const email=document.querySelector('#emailInput'),password=document.querySelector('#passwordInput'),toggle=document.querySelector('#passwordToggle');
  if(password&&toggle)toggle.addEventListener('click',()=>{const showing=password.type==='text';password.type=showing?'password':'text';toggle.classList.toggle('showing',!showing);toggle.setAttribute('aria-label',showing?'Show password':'Hide password');toggle.title=showing?'Show password':'Hide password'});
  const form=document.querySelector('#loginForm'),message=document.querySelector('#loginMessage');
  if(!form||!message)return;
  if(location.search){history.replaceState(null,'',location.pathname+location.hash)}
  let submitHandler=null;
  form.addEventListener('submit',event=>{event.preventDefault();submitHandler?.()});
  const config=window.EXAI_SUPABASE_CONFIG||{};
  const ready=Boolean(window.supabase?.createClient&&config.url&&config.publishableKey);
  const client=ready?window.supabase.createClient(config.url,config.publishableKey):null;
  if(!client){message.textContent='Sign-in connection is being configured for staging.';form.querySelectorAll('input,button').forEach(item=>item.disabled=true);return}
  const destinationFor=async user=>{
    const email=String(user?.email||'').toLowerCase();
    localStorage.setItem('exai_demo_user',email==='tiom@tiom.ai'?'tiom':email==='t1@tiom.ai'?'t1':'standard');
    if(!window.EXAI_CONTEXT_READY){const script=document.createElement('script');script.src=location.pathname.includes('/eval/')?'/eval/app/context-bootstrap.js?v=20260903-1':'app/context-bootstrap.js?v=20260903-1';document.head.append(script);await new Promise((resolve,reject)=>{script.onload=resolve;script.onerror=reject})}
    const provider=await window.EXAI_CONTEXT_READY,context=await provider.load(true);return provider.defaultHref(context.activeContext);
  };
  submitHandler=async()=>{
    const submit=form.querySelector('button[type="submit"]'),passwordField=form.querySelector('.password-field');submit.disabled=true;passwordField?.classList.add('is-loading');toggle.disabled=true;message.textContent='';
    const result=await client.auth.signInWithPassword({email:String(email?.value||'').trim(),password:String(password?.value||'')});
    if(result.error){message.textContent='The email or password is incorrect.';submit.disabled=false;toggle.disabled=false;passwordField?.classList.remove('is-loading');return}
    try{location.replace(await destinationFor(result.data.user))}catch(error){message.textContent='Your account loaded, but the workspace could not open. Please try again.';submit.disabled=false;toggle.disabled=false;passwordField?.classList.remove('is-loading')}
  };
  try{const {data:{session}}=await client.auth.getSession();if(session)location.replace(await destinationFor(session.user))}catch(error){message.textContent='The sign-in service could not finish loading. Please try again.'}
});
