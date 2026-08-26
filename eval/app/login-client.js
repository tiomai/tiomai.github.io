window.addEventListener('DOMContentLoaded',async()=>{
  const password=document.querySelector('#passwordInput'),toggle=document.querySelector('#passwordToggle');
  if(password&&toggle)toggle.addEventListener('click',()=>{const showing=password.type==='text';password.type=showing?'password':'text';toggle.classList.toggle('showing',!showing);toggle.setAttribute('aria-label',showing?'Show password':'Hide password');toggle.title=showing?'Show password':'Hide password'});
  const form=document.querySelector('#loginForm'),message=document.querySelector('#loginMessage');
  if(!form||!message)return;
  const config=window.EXAI_SUPABASE_CONFIG||{};
  const ready=Boolean(window.supabase?.createClient&&config.url&&config.publishableKey);
  const client=ready?window.supabase.createClient(config.url,config.publishableKey):null;
  if(!client){message.textContent='Sign-in connection is being configured for staging.';form.querySelectorAll('input,button').forEach(item=>item.disabled=true);return}
  const destinationFor=async user=>{
    const {data}=await client.from('profiles').select('role').eq('id',user.id).maybeSingle();
    const teacher=data?.role==='teacher'||data?.role==='school_admin'||data?.role==='platform_admin';
    const compiled=location.pathname.includes('/eval/');
    if(compiled)return teacher?'/eval/teacher/results/':'/eval/assessments/';
    return teacher?'teacher/results/':'assessments/';
  };
  const {data:{session}}=await client.auth.getSession();
  if(session)location.replace(await destinationFor(session.user));
  form.addEventListener('submit',async event=>{
    event.preventDefault();const submit=form.querySelector('button[type="submit"]'),passwordField=form.querySelector('.password-field');submit.disabled=true;passwordField?.classList.add('is-loading');toggle.disabled=true;message.textContent='';
    const values=new FormData(form);const result=await client.auth.signInWithPassword({email:String(values.get('email')||'').trim(),password:String(values.get('password')||'')});
    if(result.error){message.textContent='The email or password is incorrect.';submit.disabled=false;toggle.disabled=false;passwordField?.classList.remove('is-loading');return}
    location.replace(await destinationFor(result.data.user));
  });
});
