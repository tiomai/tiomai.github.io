(function(){
  const wait=value=>Promise.resolve(structuredClone(value));
  const previewContext={membershipId:'preview-student',organisationId:'preview-organisation',organisationName:'EXAI Preview',role:'student',classes:[],capabilities:{canViewStudents:false,canViewResults:true,canAssign:false,canReview:false}};
  // Postgres accepts UUID-shaped identifiers regardless of RFC version/variant
  // bits. Staging assignment IDs are deterministic UUID casts, so validating
  // those bits here incorrectly strips a valid student assignment from the
  // attempt request and makes the player fall back to practice entitlement.
  const isUuid=value=>/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value||'');
  const backend=()=>{
    return window.EXAI_GET_SUPABASE_CLIENT?.()||null;
  };
  const previewOnly=()=>!backend();
  const callRpc=async(name,args)=>{
    const client=backend();
    if(!client)return null;
    const request=client.rpc(name,args);
    const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error(`${name} timed out while loading staging data.`)),15000));
    const {data,error}=await Promise.race([request,timeout]);
    if(error)throw error;
    return data;
  };
  const accountIdentity=async key=>{
    const client=backend();
    if(client){
      const {data:{user}}=await client.auth.getUser();
      if(user){
        const {data:profile}=await client.from('profiles').select('display_name').eq('id',user.id).maybeSingle();
        const loadedName=profile?.display_name||user.user_metadata?.display_name||user.user_metadata?.name||user.email?.split('@')[0]||'Account';
        const displayName=/^tiom$/i.test(String(loadedName).trim())?'tiom':loadedName;
        return {displayName,email:user.email||'signed-in account',id:user.id};
      }
    }
    return {displayName:'Account',email:'signed-in account'};
  };
  const requireBackend=()=>{const client=backend();if(!client)throw new Error('The data service is unavailable.');return client};
  const loadContexts=async()=>{
    if(previewOnly())return [previewContext];
    const client=requireBackend(),{data:{user}}=await client.auth.getUser();
    if(!user)throw new Error('Authentication required.');
    const contextResult=await client.rpc('list_account_contexts',{});
    if(contextResult.error)throw new Error(`Account workspace context could not be loaded: ${contextResult.error.message||'context service error'}`);
    if(!Array.isArray(contextResult.data))throw new Error('Account workspace context returned an invalid response.');
    return contextResult.data.map(row=>({...row,capabilities:{canViewStudents:['teacher','administrator','school_admin'].includes(row.role),canViewResults:true,canAssign:['teacher','administrator','school_admin'].includes(row.role),canReview:['teacher','administrator','school_admin'].includes(row.role)}}));
  };
  const accountResetCapabilities={
    rpc:'account_reset_capabilities',
    async get({organisationId}={}){
      const availableContexts=await loadContexts(),administrator=availableContexts.find(item=>item.organisationId===organisationId&&['administrator','school_admin'].includes(item.role));
      if(organisationId===previewContext.organisationId)return wait({canResetDemo:false,canResetLearningItem:false,administratorMembershipId:null});
      const client=backend();
      if(client&&isUuid(organisationId)){const {data,error}=await client.rpc(this.rpc,{requested_organisation_id:organisationId});if(error)throw error;return {...data,administratorMembershipId:administrator?.membershipId||null}}
      throw new Error('Reset capabilities require the data service.');
    }
  };
  const accountContext={
    async get(){
      const availableContexts=await loadContexts(),stored=localStorage.getItem('exai_active_membership'),activeContext=availableContexts.find(item=>item.membershipId===stored)||availableContexts[0];
      if(!activeContext)throw new Error('No active organisation membership is available.');
      let accountCapabilities={canResetDemo:false,canResetLearningItem:false,administratorMembershipId:null};
      try{accountCapabilities=await accountResetCapabilities.get({organisationId:activeContext.organisationId})}catch(error){console.warn('Optional account reset capabilities could not be loaded.',error)}
      const identity=await accountIdentity();
      if(activeContext.membershipId===previewContext.membershipId)return wait({user:{id:'preview-account',...identity},activeContext,availableContexts,accountCapabilities,branding:{mode:'inherited',logoUrl:'public/exai-assets/logo.svg',poweredByExai:false},locale:localStorage.getItem('exai_locale')||'en'});
      const client=requireBackend();let brand=null;
      try{const result=await client.from('organisation_branding').select('logo_url').eq('organisation_id',activeContext.organisationId).maybeSingle();if(result.error)throw result.error;brand=result.data}catch(error){console.warn('Optional organisation branding could not be loaded.',error)}
      const branding=brand?.logo_url?{mode:'custom',logoUrl:brand.logo_url,poweredByExai:true}:{mode:'inherited',logoUrl:'public/exai-assets/logo.svg',poweredByExai:false};
      return wait({user:{id:identity.id,...identity},activeContext,availableContexts,accountCapabilities,branding,locale:localStorage.getItem('exai_locale')||'en'});
    },
    async switchContext(membershipId){
      const current=await this.get(),next=current.availableContexts.find(item=>item.membershipId===membershipId);if(!next)throw new Error('Account context is no longer available.');
      localStorage.setItem('exai_active_membership',membershipId);
      return this.get();
    },
    async retry(){return this.get()},
    defaultLanding(context){return context.role==='student'?'/eval/assessments/':context.role==='administrator'?'/eval/admin/content-library/':'/eval/teacher/results/'},
    canAccessPage(context,pageType){
      if(pageType==='students')return context.capabilities.canViewStudents;
      if(pageType==='results')return context.capabilities.canViewResults;
      if(pageType==='assign')return context.capabilities.canAssign;
      if(pageType==='review')return context.capabilities.canReview;
      return true;
    }
  };
  const studentAssignments={async list(){const data=await callRpc('list_student_assignments',{});if(!data)throw new Error('The assignment catalogue service is unavailable.');return data}};
  const studentPractice={async listEntitled(){const data=await callRpc('list_entitled_packs',{requested_mode:'challenge'});return {items:(data||[]).map(item=>({packId:item.pack_id,title:item.pack_title,subject:item.subject_title,questionCount:item.question_count??null,estimatedMinutes:item.time_limit_seconds?Math.ceil(item.time_limit_seconds/60):null,state:item.access_state,attemptId:item.active_attempt_id,action:item.access_state==='time_up'?{kind:'time_up',label:"Time's up"}:{kind:item.access_state==='in_progress'?'continue':'start',label:item.access_state==='in_progress'?'Continue':'Start'}})),subscription:{state:'active'}}}};
  const studentResults={async list({population='released',cursor=null}={}){const data=await callRpc('list_student_results',{requested_population:population,requested_cursor:cursor});return data||{population,items:[],pageInfo:{endCursor:null,hasNextPage:false}}}};
  const studentPerformance={async get({subject='english'}={}){return (await callRpc('get_student_performance',{requested_subject:subject}))||{metrics:null,monthlySummary:[],trend:[],englishSkills:[],mathTopics:[],insights:[],dataConfidence:null,assessmentResults:[],viewer:{canViewAssessmentResults:false}}}};
  const activeTeacherContext=async()=>{
    const context=await accountContext.get(),active=context?.activeContext,membershipId=active?.membershipId;
    if(active?.role!=='teacher'||!isUuid(membershipId))throw new Error('An active database-backed teacher membership is required.');
    return active;
  };
  const activeTeacherMembershipId=async()=>(await activeTeacherContext()).membershipId;
  const requireVisibleTeacherClass=async classId=>{
    if(!isUuid(classId))throw new Error('A database-backed class is required.');
    const active=await activeTeacherContext(),declared=Array.isArray(active.classes)?active.classes:[];
    if(declared.some(item=>String(item.id??item.classId)===String(classId)))return active;
    const visible=await teacherClasses.list();
    if(!(visible?.items||[]).some(item=>String(item.classId)===String(classId)))throw new Error('The selected class is not visible to this teacher account.');
    return active;
  };
  const teacherClasses={async list(){return (await callRpc('list_teacher_classes',{requested_viewer_membership_id:await activeTeacherMembershipId()}))||{items:[]}}};
  const teacherStudents={async list({classId=null}={}){const viewerMembershipId=await activeTeacherMembershipId();if(classId){return (await callRpc('list_teacher_students',{requested_class_id:classId,requested_viewer_membership_id:viewerMembershipId}))||{classId,items:[]}}const classes=await teacherClasses.list(),byId=new Map();for(const visibleClass of (classes?.items||[])){const result=await callRpc('list_teacher_students',{requested_class_id:visibleClass.classId,requested_viewer_membership_id:viewerMembershipId}),items=Array.isArray(result?.items)?result.items:[];for(const student of items){const key=student.studentId||student.studentMembershipId;if(!key)continue;const existing=byId.get(key);if(existing)existing.classIds=[...new Set([...(existing.classIds||[]),...(student.classIds||[]),visibleClass.classId])];else byId.set(key,{...student,classIds:student.classIds?.length?student.classIds:[visibleClass.classId]});}}return {classId:null,items:[...byId.values()]}}};
  const teacherResults={async list({classId=null,subject=null,state=null,cursor=null}={}){return (await callRpc('list_teacher_results',{requested_class_id:classId,requested_subject:subject,requested_state:state,requested_cursor:cursor,requested_viewer_membership_id:await activeTeacherMembershipId()}))||{items:[],pageInfo:{endCursor:null,hasNextPage:false}}}};
  const teacherPerformance={async getStudent({studentId,classId=null,membershipId=null}={}){return (await callRpc('get_teacher_student_performance',{requested_student_id:studentId,requested_class_id:classId,requested_membership_id:membershipId,requested_viewer_membership_id:await activeTeacherMembershipId()}))||{studentId,metrics:null,monthlySummary:[],trend:[],englishSkills:[],mathTopics:[],insights:[],dataConfidence:null,assessmentResults:[],viewer:{canViewAssessmentResults:true}}}};
  const teacherDemo={
    async listClassPerformance({classId}={}){
      const active=await requireVisibleTeacherClass(classId);
      if(active.isDemo!==true)return null;
      const data=await callRpc('list_demo_class_performance',{cid:classId,viewer:active.membershipId});
      if(!data||String(data.classId)!==String(classId))throw new Error('Demo class performance returned an invalid class projection.');
      return {...data,students:Array.isArray(data.students)?data.students:[]};
    },
    async getHistoryResponses({historyId,classId}={}){
      const active=await requireVisibleTeacherClass(classId);
      if(active.isDemo!==true)return null;
      if(!isUuid(historyId))throw new Error('A database-backed demo history record is required.');
      const data=await callRpc('get_demo_display_history_responses',{hid:historyId,viewer:active.membershipId});
      if(!data||String(data.classId)!==String(classId)||String(data.historyId)!==String(historyId))throw new Error('Demo response history returned an invalid class projection.');
      return {...data,questions:Array.isArray(data.questions)?data.questions:[]};
    }
  };
  const teacherReview={async getQuestion({attemptId,position,classId}={}){
    classId=classId||new URLSearchParams(location.search).get('classId');
    if(!isUuid(attemptId)||!isUuid(classId)||!Number.isInteger(position)||position<1)throw new Error('Teacher review requires a valid attempt, class and question position.');
    return callRpc('get_teacher_attempt_review_question',{requested_attempt_id:attemptId,requested_position:position,requested_class_id:classId,requested_viewer_membership_id:await activeTeacherMembershipId()});
  },async reviewPart({attemptId,attemptItemId,blankId,awardedScore,comment=''}={}){
    if(!isUuid(attemptId)||!isUuid(attemptItemId)||!blankId)throw new Error('The reviewed response part is incomplete.');
    return callRpc('review_attempt_response_part',{requested_attempt_id:attemptId,requested_attempt_item_id:attemptItemId,requested_blank_id:String(blankId),requested_awarded_score:awardedScore,requested_comment:comment,requested_viewer_membership_id:await activeTeacherMembershipId()});
  }};
  const assessmentPlayer={
    async createOrResume({studentAssignmentId,packId,mode='assessment'}){
      if(isUuid(studentAssignmentId)||isUuid(packId)){
        return callRpc('start_or_resume_attempt',{requested_pack_id:isUuid(packId)?packId:null,requested_mode:mode,requested_student_assignment_id:isUuid(studentAssignmentId)?studentAssignmentId:null});
      }
      throw new Error('A database-backed pack is required to start an attempt.');
    },
    async getQuestion({attemptId,position,review=false}){
      if(isUuid(attemptId))return callRpc(review?'get_attempt_review_question':'get_attempt_question',{requested_attempt_id:attemptId,requested_position:position});
      return null
    },
    async saveResponse({attemptId,attemptItemId,questionId,response}){
      if(isUuid(attemptId)&&isUuid(attemptItemId))return callRpc('save_attempt_response',{requested_attempt_id:attemptId,requested_attempt_item_id:attemptItemId,requested_response:response});
      throw new Error('The response could not be linked to a database attempt item.');
    },
    async setBookmark({attemptId,attemptItemId,bookmarked}){
      if(isUuid(attemptId)&&isUuid(attemptItemId))return callRpc('set_attempt_item_bookmark',{requested_attempt_id:attemptId,requested_attempt_item_id:attemptItemId,requested_bookmarked:Boolean(bookmarked)});
      throw new Error('The bookmark could not be linked to a database attempt item.');
    },
    async getPracticeFeedback({attemptId,position}){if(isUuid(attemptId))return callRpc('get_practice_question_feedback',{requested_attempt_id:attemptId,requested_position:position});return null},
    async submit({attemptId,reason='manual',legacyPayload=null}){
      if(isUuid(attemptId))return callRpc('submit_learning_attempt',{requested_attempt_id:attemptId,requested_reason:reason});
      throw new Error('The attempt could not be linked to the database.');
    }
  };
  const demoReset={async preview(){return callRpc('preview_demo_data_reset',{})},async confirm(){return callRpc('reset_demo_data',{})}};
  const adminLearningReset={
    previewRpc:'preview_admin_learning_reset',confirmRpc:'admin_reset_learning_item',
    async preview({attemptId,administratorMembershipId}={}){if(!isUuid(attemptId)||!isUuid(administratorMembershipId))throw new Error('A database-backed attempt and administrator membership are required.');return callRpc(this.previewRpc,{requested_attempt_id:attemptId,requested_administrator_membership_id:administratorMembershipId})},
    async confirm({attemptId,administratorMembershipId,reason}={}){if(!isUuid(attemptId)||!isUuid(administratorMembershipId)||!reason)throw new Error('The secured reset request is incomplete.');return callRpc(this.confirmRpc,{requested_attempt_id:attemptId,requested_administrator_membership_id:administratorMembershipId,requested_reason:reason})}
  };
  window.EXAI_ADAPTERS=Object.freeze({auth:{accountContext,accountResetCapabilities},studentAssignments,studentPractice,studentResults,studentPerformance,assessmentPlayer,teacherClasses,teacherStudents,teacherResults,teacherPerformance,teacherDemo,teacherReview,demoReset,adminLearningReset});
})();
