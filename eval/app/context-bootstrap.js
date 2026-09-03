(function(){
  if(window.EXAI_CONTEXT_READY)return;
  const base=location.pathname.includes('/eval/')?'/eval/app/':'app/';
  const version='20260903-1';
  const load=src=>new Promise((resolve,reject)=>{const existing=document.querySelector(`script[data-context-src="${src}"]`);if(existing){existing.addEventListener('load',resolve,{once:true});return}const script=document.createElement('script');script.src=`${base}${src}?v=${version}`;script.dataset.contextSrc=src;script.onload=resolve;script.onerror=reject;document.head.append(script)});
  window.EXAI_CONTEXT_READY=(async()=>{if(!window.EXAI_ADAPTERS)await load('frontend-adapters.js');if(!window.EXAI_ACCOUNT_CONTEXT)await load('account-context.js');if(!window.EXAI_PERFORMANCE_TEACHER_RENDERERS)await load('performance-teacher-renderers.js');if(!window.EXAI_SCREEN_BINDINGS)await load('screen-data-bindings.js');if(!window.EXAI_LEARNING_RESET_ACTIONS)await load('learning-reset-actions.js');if(!window.EXAI_STUDENT_ENTRY_FIXES)await load('student-entry-fixes.js');return window.EXAI_ACCOUNT_CONTEXT})();
})();
