(function(){
  if(window.EXAI_CONTEXT_READY)return;
  const localStaging=['localhost','127.0.0.1'].includes(location.hostname);
  const localBuild='20260914-9';
  window.EXAI_FRESH_LOCAL_URL=href=>{
    if(!localStaging)return href;
    const url=new URL(href,location.href);
    if(url.origin===location.origin&&/\.html$/.test(url.pathname))url.searchParams.set('_build',localBuild);
    return `${url.pathname.replace(/^\//,'')}${url.search}${url.hash}`;
  };
  if(localStaging){
    addEventListener('pageshow',event=>{if(event.persisted)location.reload()});
    document.addEventListener('click',event=>{
      const link=event.target.closest('a[href]');
      if(!link||link.target==='_blank'||event.defaultPrevented)return;
      const fresh=window.EXAI_FRESH_LOCAL_URL(link.getAttribute('href'));
      if(fresh!==link.getAttribute('href'))link.setAttribute('href',fresh);
    },true);
  }
  const base=location.pathname.includes('/eval/')?'/eval/app/':'app/';
  const version=localBuild;
  const load=src=>new Promise((resolve,reject)=>{const existing=document.querySelector(`script[data-context-src="${src}"]`);if(existing){existing.addEventListener('load',resolve,{once:true});return}const script=document.createElement('script');script.src=`${base}${src}${src.includes('?')?'&':'?'}v=${version}`;script.dataset.contextSrc=src;script.onload=resolve;script.onerror=reject;document.head.append(script)});
  window.EXAI_CONTEXT_READY=(async()=>{if(!window.supabase)await load('supabase.js');if(!window.EXAI_SUPABASE_CONFIG)await load('supabase-config.js');if(!window.EXAI_ADAPTERS)await load('frontend-adapters.js?v=20260914-2');if(!window.EXAI_ACCOUNT_CONTEXT)await load('account-context.js?v=20260914-2');if(!window.EXAI_PERFORMANCE_TEACHER_RENDERERS)await load('performance-teacher-renderers.js');if(!window.EXAI_SCREEN_BINDINGS)await load('screen-data-bindings.js?v=20260914-1');if(!window.EXAI_LEARNING_RESET_ACTIONS)await load('learning-reset-actions.js');if(!window.EXAI_STUDENT_ENTRY_FIXES)await load('student-entry-fixes.js');if(!window.EXAI_PRACTICE_LAUNCH_METADATA)await load('practice-launch-metadata.js');await load('performance-insight-copy.js');return window.EXAI_ACCOUNT_CONTEXT})();
})();
if(location.pathname.includes('/eval/revision/')||location.pathname.includes('/eval/revision/')){const script=document.createElement('script');script.src=(location.pathname.includes('/eval/')?'/eval/app/':'app/')+'saved-revision-data.js?v=20260914-2';document.head.append(script)}
if(location.pathname.includes('/eval/practices/')||location.pathname.includes('/eval/practice/')){const script=document.createElement('script');script.src=(location.pathname.includes('/eval/')?'/eval/app/':'app/')+'practice-expiry-ui.js?v=20260914-2';document.head.append(script)}
if(location.pathname.includes('/eval/assessment-player/')||location.pathname.includes('/eval/assessment-player/')){const script=document.createElement('script');script.src=(location.pathname.includes('/eval/')?'/eval/app/':'app/')+'practice-feedback-state.js?v=20260914-3';document.head.append(script)}
