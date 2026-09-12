(function(){
  const wait=value=>Promise.resolve(structuredClone(value));
  const previewContext={membershipId:'preview-student',organisationId:'preview-organisation',organisationName:'EXAI Preview',role:'student',classes:[],capabilities:{canViewStudents:false,canViewResults:true,canAssign:false,canReview:false}};
  let backendClient;
  const isUuid=value=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value||'');
  const backend=()=>{
    const config=window.EXAI_SUPABASE_CONFIG||{};
    if(!window.supabase?.createClient||!config.url||!config.publishableKey)return null;
    return backendClient||(backendClient=window.supabase.createClient(config.url,config.publishableKey));
  };
  const previewOnly=()=>!backend();
  const callRpc=async(name,args)=>{
    const client=backend();
    if(!client)return null;
    const {data,error}=await client.rpc(name,args);
    if(error)throw error;
    return data;
  };
  const accountIdentity=async key=>{
    const client=backend();
    if(client){
      const {data:{user}}=await client.auth.getUser();
      if(user){
        const {data:profile}=await client.from('profiles').select('display_name').eq('id',user.id).maybeSingle();
        const displayName=profile?.display_name||user.user_metadata?.display_name||user.user_metadata?.name||user.email?.split('@')[0]||'Account';
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
    const {data,error}=await client.from('organisation_memberships').select('id,organisation_id,role,display_name').eq('user_id',user.id).eq('status','active');
    if(error)throw error;
    const organisationIds=[...new Set((data||[]).map(row=>row.organisation_id))],membershipIds=(data||[]).map(row=>row.id);
    const [{data:organisations,error:organisationError},{data:classLinks,error:classError}]=await Promise.all([organisationIds.length?client.from('organisations').select('id,name,slug').in('id',organisationIds):Promise.resolve({data:[]}),membershipIds.length?client.from('class_memberships').select('organisation_membership_id,class_id').in('organisation_membership_id',membershipIds).eq('status','active'):Promise.resolve({data:[]})]);
    if(organisationError)console.warn('Organisation names could not be loaded.',organisationError);if(classError)console.warn('Class memberships could not be loaded.',classError);
    const usableClassLinks=classError?[]:(classLinks||[]),classIds=[...new Set(usableClassLinks.map(item=>item.class_id))],{data:classes,error:classesError}=classIds.length?await client.from('classes').select('id,name').in('id',classIds):{data:[]};if(classesError)console.warn('Class names could not be loaded.',classesError);const organisationsById=new Map((organisations||[]).map(item=>[item.id,item])),classesById=new Map((classes||[]).map(item=>[item.id,item]));
    return (data||[]).map(row=>{const organisation=organisationsById.get(row.organisation_id),memberClasses=usableClassLinks.filter(item=>item.organisation_membership_id===row.id).map(item=>classesById.get(item.class_id)).filter(Boolean);return {membershipId:row.id,organisationId:row.organisation_id,organisationName:organisation?.name||'Organisation',role:row.role,classes:memberClasses,capabilities:{canViewStudents:['teacher','administrator','school_admin'].includes(row.role),canViewResults:true,canAssign:['teacher','administrator','school_admin'].includes(row.role),canReview:['teacher','administrator','school_admin'].includes(row.role)}}});
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
  const studentPractice={async listEntitled(){const data=await callRpc('list_entitled_packs',{requested_mode:'challenge'});return {items:(data||[]).map(item=>({packId:item.pack_id,title:item.pack_title,subject:item.subject_title,questionCount:item.question_count??null,estimatedMinutes:item.time_limit_seconds?Math.ceil(item.time_limit_seconds/60):null,state:item.access_state,attemptId:item.active_attempt_id,action:{kind:item.access_state==='in_progress'?'continue':'start',label:item.access_state==='in_progress'?'Continue':'Start'}})),subscription:{state:'active'}}}};
  const studentResults={async list({population='released',cursor=null}={}){const data=await callRpc('list_student_results',{requested_population:population,requested_cursor:cursor});return data||{population,items:[],pageInfo:{endCursor:null,hasNextPage:false}}}};
  const studentPerformance={async get(){return (await callRpc('get_student_performance',{}))||{metrics:null,monthlySummary:[],trend:[],englishSkills:[],mathTopics:[],insights:[],dataConfidence:null,assessmentResults:[],viewer:{canViewAssessmentResults:false}}}};
  const teacherClasses={async list(){return (await callRpc('list_teacher_classes',{}))||{items:[]}}};
  const teacherStudents={async list({classId=null}={}){return (await callRpc('list_teacher_students',{requested_class_id:classId}))||{classId,items:[]}}};
  const teacherResults={async list({cursor=null}={}){return (await callRpc('list_teacher_results',{requested_cursor:cursor}))||{items:[],pageInfo:{endCursor:null,hasNextPage:false}}}};
  const teacherPerformance={async getStudent({studentId,classId=null,membershipId=null}={}){return (await callRpc('get_teacher_student_performance',{requested_student_id:studentId,requested_class_id:classId,requested_membership_id:membershipId}))||{studentId,metrics:null,monthlySummary:[],trend:[],englishSkills:[],mathTopics:[],insights:[],dataConfidence:null,assessmentResults:[],viewer:{canViewAssessmentResults:true}}}};
  const assessmentPlayer={
    async createOrResume({studentAssignmentId,packId,mode='assessment'}){
      if(isUuid(studentAssignmentId)||isUuid(packId)){
        return callRpc('start_or_resume_attempt',{requested_pack_id:isUuid(packId)?packId:null,requested_mode:mode,requested_student_assignment_id:isUuid(studentAssignmentId)?studentAssignmentId:null});
      }
      throw new Error('A database-backed pack is required to start an attempt.');
    },
    async getQuestion({attemptId,position}){
      if(isUuid(attemptId))return callRpc('get_attempt_question',{requested_attempt_id:attemptId,requested_position:position});
      return null
    },
    async saveResponse({attemptId,attemptItemId,questionId,response}){
      if(isUuid(attemptId)&&isUuid(attemptItemId))return callRpc('save_attempt_response',{requested_attempt_id:attemptId,requested_attempt_item_id:attemptItemId,requested_response:response});
      throw new Error('The response could not be linked to a database attempt item.');
    },
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
  window.EXAI_ADAPTERS=Object.freeze({auth:{accountContext,accountResetCapabilities},studentAssignments,studentPractice,studentResults,studentPerformance,assessmentPlayer,teacherClasses,teacherStudents,teacherResults,teacherPerformance,demoReset,adminLearningReset});
})();
