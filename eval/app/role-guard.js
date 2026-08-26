window.addEventListener('DOMContentLoaded',async()=>{
  const config=window.EXAI_SUPABASE_CONFIG||{};
  if(!window.supabase?.createClient||!config.url||!config.publishableKey)return;
  const client=window.supabase.createClient(config.url,config.publishableKey);
  const {data:{session}}=await client.auth.getSession();
  const compiled=location.pathname.includes('/eval/');
  const login=compiled?'/eval/login/':'login/';
  if(!session){location.replace(login);return}
  const {data}=await client.from('profiles').select('role').eq('id',session.user.id).maybeSingle();
  const teacher=data?.role==='teacher'||data?.role==='school_admin'||data?.role==='platform_admin';
  const requestedTeacher=document.body.dataset.role==='teacher';
  if(teacher&&!requestedTeacher)location.replace(compiled?'/eval/teacher/results/':'teacher/results/');
  if(!teacher&&requestedTeacher)location.replace(compiled?'/eval/assessments/':'assessments/');
});
