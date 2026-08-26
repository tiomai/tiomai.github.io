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
  const params=new URLSearchParams(location.search);
  const review=params.get('review');
  const teacherReview=teacher&&params.get('viewer')==='teacher'&&['result','paper'].includes(review)&&(
    location.pathname.includes('assessment-player')||
    location.pathname.includes('practice-player')||
    location.pathname.includes('student-assessment-taking')||
    location.pathname.includes('student-math-practice-taking')
  );
  const allowedRoles=(document.body.dataset.allowRoles||'').split(/\s+/).filter(Boolean);
  const explicitlyAllowed=allowedRoles.includes(teacher?'teacher':'student');
  if(teacher&&!requestedTeacher&&!teacherReview&&!explicitlyAllowed)location.replace(compiled?'/eval/teacher/results/':'teacher/results/');
  if(!teacher&&requestedTeacher&&!explicitlyAllowed)location.replace(compiled?'/eval/assessments/':'assessments/');
});
