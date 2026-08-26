window.addEventListener('DOMContentLoaded',async()=>{
  const password=document.querySelector('#passwordInput'),toggle=document.querySelector('#passwordToggle');
  if(password&&toggle)toggle.addEventListener('click',()=>{const showing=password.type==='text';password.type=showing?'password':'text';toggle.classList.toggle('showing',!showing);toggle.setAttribute('aria-label',showing?'Show password':'Hide password');toggle.title=showing?'Show password':'Hide password'});
  const form=document.querySelector('#loginForm'),message=document.querySelector('#loginMessage');
  if(!form||!message)return;
  const config=window.EXAI_SUPABASE_CONFIG||{};
  const ready=Boolean(window.supabase?.createClient&&config.url&&config.publishableKey);
  const client=ready?window.supabase.createClient(config.url,config.publishableKey):null;
  if(!client){message.textContent='Sign-in connection is being configured for staging.';form.querySelectorAll('input,button').forEach(item=>item.disabled=true);return}
  const {data:{session}}=await client.auth.getSession();
  if(session)location.replace('assessments/');
  form.addEventListener('submit',async event=>{
    event.preventDefault();const submit=form.querySelector('button[type="submit"]'),passwordField=form.querySelector('.password-field');submit.disabled=true;passwordField?.classList.add('is-loading');toggle.disabled=true;message.textContent='';
    const values=new FormData(form);const result=await client.auth.signInWithPassword({email:String(values.get('email')||'').trim(),password:String(values.get('password')||'')});
    if(result.error){message.textContent='The email or password is incorrect.';submit.disabled=false;toggle.disabled=false;passwordField?.classList.remove('is-loading');return}
    location.replace('assessments/');
  });
});
