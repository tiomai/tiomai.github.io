(function(){
  const wait=value=>Promise.resolve(structuredClone(value));
  const userKey=()=>localStorage.getItem('exai_demo_user')||'tiom';
  let backendClient;
  const isUuid=value=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value||'');
  const backend=()=>{
    if(location.protocol==='file:'||['localhost','127.0.0.1'].includes(location.hostname))return null;
    const config=window.EXAI_SUPABASE_CONFIG||{};
    if(!window.supabase?.createClient||!config.url||!config.publishableKey)return null;
    return backendClient||(backendClient=window.supabase.createClient(config.url,config.publishableKey));
  };
  const accountIdentity=async key=>{
    if(key==='tiom')return {displayName:'Tiom',email:'tiom@tiom.ai'};
    if(key==='t1')return {displayName:'t1',email:'t1@tiom.ai'};
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
  const contexts={
    tiom:[
      {membershipId:'mem-exai-admin',organisationId:'org-exai',organisationName:'EXAI',role:'administrator',classes:[],capabilities:{canViewStudents:true,canViewResults:true,canAssign:true,canReview:true}},
      {membershipId:'mem-exai-teacher',organisationId:'org-exai',organisationName:'EXAI',role:'teacher',classes:[{id:'class-5a',name:'Class 5A'},{id:'class-math-olympiad',name:'Math Olympiad'}],capabilities:{canViewStudents:true,canViewResults:true,canAssign:true,canReview:true}},
      {membershipId:'mem-exai-student',organisationId:'org-exai',organisationName:'EXAI',role:'student',classes:[{id:'class-5a',name:'Class 5A'},{id:'class-math-olympiad',name:'Math Olympiad'}],capabilities:{canViewStudents:false,canViewResults:true,canAssign:false,canReview:false}}
    ],
    t1:[{membershipId:'mem-exai-t1-teacher',organisationId:'org-exai',organisationName:'EXAI',role:'teacher',classes:[],capabilities:{canViewStudents:true,canViewResults:true,canAssign:true,canReview:true}}],
    standard:[{membershipId:'mem-exai-standard-student',organisationId:'org-exai',organisationName:'EXAI',role:'student',classes:[],capabilities:{canViewStudents:false,canViewResults:true,canAssign:false,canReview:false}}]
  };
  const branding={
    'org-exai':{mode:'inherited',logoUrl:'public/exai-assets/logo.svg',poweredByExai:false},
    'org-koko':{mode:'custom',logoUrl:null,poweredByExai:true}
  };
  const accountResetCapabilities={
    rpc:'account_reset_capabilities',
    async get({organisationId}={}){
      const availableContexts=contexts[userKey()]||contexts.t1,administrator=availableContexts.find(item=>item.organisationId===organisationId&&['administrator','school_admin'].includes(item.role));
      const client=backend();
      if(client&&isUuid(organisationId)){const {data,error}=await client.rpc(this.rpc,{requested_organisation_id:organisationId});if(error)throw error;return {...data,administratorMembershipId:administrator?.membershipId||null}}
      return wait({canResetDemo:!!administrator,canResetLearningItem:!!administrator,administratorMembershipId:administrator?.membershipId||null});
    }
  };
  const accountContext={
    async get(){
      const key=userKey(),allContexts=contexts[key]||contexts.t1,availableContexts=allContexts.filter(item=>!['administrator','school_admin'].includes(item.role)),stored=localStorage.getItem(`exai_active_membership_${key}`),activeContext=availableContexts.find(item=>item.membershipId===stored)||availableContexts[0];
      const accountCapabilities=await accountResetCapabilities.get({organisationId:activeContext.organisationId});
      const identity=await accountIdentity(key);
      return wait({user:{id:identity.id||`demo-${key}`,...identity},activeContext,availableContexts,accountCapabilities,branding:branding[activeContext.organisationId]||branding['org-exai'],locale:localStorage.getItem('exai_locale')||'en'});
    },
    async switchContext(membershipId){
      const current=await this.get(),next=current.availableContexts.find(item=>item.membershipId===membershipId);if(!next)throw new Error('Account context is no longer available.');
      localStorage.setItem(`exai_active_membership_${userKey()}`,membershipId);
      return this.get();
    },
    async retry(){return this.get()},
    defaultLanding(context){return context.role==='student'?'assessments/':'teacher/results/'},
    canAccessPage(context,pageType){
      if(pageType==='students')return context.capabilities.canViewStudents;
      if(pageType==='results')return context.capabilities.canViewResults;
      if(pageType==='assign')return context.capabilities.canAssign;
      if(pageType==='review')return context.capabilities.canReview;
      return true;
    }
  };
  const discardedAttempts=new Set(),invalidatedSnapshots=new Set();
  const assignmentFixtures=[
    {studentAssignmentId:'sa-dse-reading-2026',attemptId:null,title:'DSE English Reading',subject:'English',assignedByOrganisationName:'EXAI',organisationClassLabel:'EXAI · Class 5A',availableAt:'2026-08-20T00:00:00Z',deadlineAt:'2026-08-24T15:59:59Z',deadlineLabel:'Fri, 24 Aug',urgencyLabel:'Due in 2 days',durationLabel:'50 min',skillsLabel:'Text-based Reading',attemptStatus:'not_started',remainingSeconds:3000,requirement:'required',state:'available',action:{kind:'start',label:'Start'}},
    {studentAssignmentId:'sa-math-s4-2026',attemptId:'attempt-sa-math-s4-2026',title:'Math S4',subject:'Math',organisationClassLabel:'EXAI · Math Olympiad',availableAt:'2026-08-18T00:00:00Z',deadlineAt:'2026-08-24T15:59:59Z',deadlineLabel:'Fri, 24 Aug',urgencyLabel:'Due in 2 days',durationLabel:'40 min',skillsLabel:'Algebra · Number',progressPercent:35,attemptStatus:'in_progress',remainingSeconds:1560,requirement:'required',state:'available',action:{kind:'continue',label:'Continue'}},
    {studentAssignmentId:'sa-english-listening',attemptId:null,title:'English Listening',subject:'English',organisationClassLabel:'EXAI · Class 5A',availableAt:'2026-08-20T00:00:00Z',deadlineAt:'2026-08-24T15:59:59Z',deadlineLabel:'Fri, 24 Aug',urgencyLabel:'Due in 2 days',durationLabel:'25 min',skillsLabel:'Vocabulary · Listening',attemptStatus:'not_started',remainingSeconds:1500,requirement:'required',state:'available',action:{kind:'start',label:'Start'}},
    {studentAssignmentId:'sa-english-reading-open',attemptId:null,title:'English Reading',subject:'English',organisationClassLabel:'EXAI · Class 5A',availableAt:'2026-08-20T00:00:00Z',deadlineAt:'2026-08-31T15:59:59Z',deadlineLabel:'Sat, 31 Aug',durationLabel:'25 min',skillsLabel:'Vocabulary · Reading · Grammar',attemptStatus:'not_started',remainingSeconds:1500,requirement:'required',state:'available',action:{kind:'start',label:'Start'}},
    {studentAssignmentId:'sa-screening-test',attemptId:null,title:'Screening Test',subject:'English',organisationClassLabel:'EXAI · Class 5A',availableAt:'2026-08-20T00:00:00Z',deadlineAt:null,deadlineLabel:'No deadline',durationLabel:'240 min',skillsLabel:'Vocabulary · Grammar · Reading · Listening',attemptStatus:'not_started',remainingSeconds:14400,requirement:'optional',state:'available',action:{kind:'start',label:'Start'}}
  ];
  const studentAssignments={async list(){const caps=await accountResetCapabilities.get({organisationId:'org-exai'}),items=assignmentFixtures.map(item=>discardedAttempts.has(item.attemptId)?{...item,attemptId:null,attemptStatus:'not_started',state:'available',remainingSeconds:3000,action:{kind:'start',label:'Start'}}:item).map(item=>({...item,resetEligibility:{allowed:Boolean(caps.canResetLearningItem&&item.attemptId&&item.attemptStatus==='in_progress'),reason:item.attemptStatus!=='in_progress'?'Only started, incomplete activity can be reset.':!item.attemptId?'This legacy activity is not linked to an attempt and cannot be reset safely.':caps.canResetLearningItem?null:'An administrator membership is required.'}}));return wait({items,pageInfo:{endCursor:null,hasNextPage:false}})}};
  const studentPractice={async listEntitled(){const expired=localStorage.getItem('exai_demo_subscription')==='expired',all=[
    {packId:'pack-straight-lines',title:'Equations of straight lines',subject:'Math',icon:'∑',questionCount:10,estimatedMinutes:30,state:'available',action:{kind:'start',label:'Start Challenge'}},
    {packId:'pack-trigonometry',title:'Trigonometry I',subject:'Math',icon:'△',questionCount:10,estimatedMinutes:30,state:'in_progress',attemptId:'attempt-practice-trigonometry',practiceSessionId:'practice-trigonometry',action:{kind:'continue',label:'Continue'}},
    {packId:'pack-circles',title:'Basic properties of circles',subject:'Math',icon:'○',questionCount:10,estimatedMinutes:30,state:'available',action:{kind:'start',label:'Start Challenge'}},
    {packId:'pack-dispersion',title:'Measures of dispersion',subject:'Math',icon:'%',questionCount:10,estimatedMinutes:30,state:'available',action:{kind:'start',label:'Start Challenge'}},
    {packId:'pack-vocabulary',title:'Vocabulary',subject:'English',icon:'Aa',questionCount:10,estimatedMinutes:20,state:'available',action:{kind:'start',label:'Start Challenge'}},
    {packId:'pack-grammar',title:'Grammar',subject:'English',icon:'Aa',questionCount:10,estimatedMinutes:20,state:'available',action:{kind:'start',label:'Start Challenge'}},
    {packId:'pack-reading',title:'Reading',subject:'English',icon:'R',questionCount:10,estimatedMinutes:25,state:'available',action:{kind:'start',label:'Start Challenge'}},
    {packId:'pack-listening',title:'Listening Challenge',subject:'English',icon:'♫',questionCount:10,estimatedMinutes:25,state:'completed',attemptId:'attempt-practice-listening',practiceSessionId:'practice-listening',action:{kind:'review',label:'Review'}},
    {packId:'jlpt-n5-grammar',title:'N5の文法',subject:'Japanese',icon:'日',questionCount:8,estimatedMinutes:15,state:'available',action:{kind:'start',label:'Start Challenge'}},
    {packId:'jlpt-n5-vocab-grammar',title:'N5の語彙と文法',subject:'Japanese',icon:'日',questionCount:8,estimatedMinutes:15,state:'available',action:{kind:'start',label:'Start Challenge'}}
  ];const caps=await accountResetCapabilities.get({organisationId:'org-exai'}),visible=expired?all.filter(item=>item.state==='completed'):all;return wait({items:visible.map(raw=>discardedAttempts.has(raw.attemptId)?{...raw,attemptId:null,practiceSessionId:null,state:'available',action:{kind:'start',label:'Start Challenge'}}:raw).map(item=>({...item,resetEligibility:{allowed:Boolean(caps.canResetLearningItem&&item.attemptId&&['in_progress','completed'].includes(item.state)),reason:item.attemptId?(caps.canResetLearningItem?null:'An administrator membership is required.'):'This practice is not linked to an attempt and cannot be reset safely.'}})),subscription:{state:expired?'expired':'active',message:expired?'Existing completed packs remain available for review.':null}})}};
  const resultFixtures={released:[{resultId:'result-reading',attemptId:'attempt-sa-english-reading-complete',studentAssignmentId:'sa-english-reading-complete',title:'DSE English — Reading & Listening',subject:'English',state:'released',score:79,paperReviewAvailable:true,answerReviewAvailable:true},{resultId:'result-legacy',attemptId:null,studentAssignmentId:'sa-legacy-reading',title:'Legacy English Reading',subject:'English',state:'released',score:72,paperReviewAvailable:true,answerReviewAvailable:true}],awaiting_review:[{resultId:'result-listening',attemptId:'attempt-sa-listening-review',studentAssignmentId:'sa-listening-review',title:'English Listening',subject:'English',state:'awaiting_review',score:null,paperReviewAvailable:false,answerReviewAvailable:false}],not_submitted_expired:[{resultId:'result-expired',attemptId:'attempt-sa-listening-expired',studentAssignmentId:'sa-listening-expired',title:'English Listening',subject:'English',state:'not_submitted_expired',score:null,paperReviewAvailable:false,answerReviewAvailable:false}]};
  const studentResults={async list({population='released',cursor=null}={}){const caps=await accountResetCapabilities.get({organisationId:'org-exai'}),items=(resultFixtures[population]||[]).filter(item=>!item.invalidated&&!invalidatedSnapshots.has(item.resultId)&&!discardedAttempts.has(item.attemptId)).map(item=>({...item,resetEligibility:{allowed:Boolean(caps.canResetLearningItem&&item.attemptId),reason:item.attemptId?(caps.canResetLearningItem?null:'An administrator membership is required.'):'This legacy result is not linked to an attempt and cannot be reset safely.'}}));return wait({population,items,pageInfo:{endCursor:cursor,hasNextPage:false},reviewPolicy:{paperAvailable:population==='released',answersAvailable:population==='released'}})}};
  const performanceFixture={metrics:{completed:33,assigned:58,weightedAverage:74,currentLevel:'Level 2',activityRate:91},monthlySummary:[{period:'Jul',level:'Level 3',completed:8,assigned:8,weightedAverage:75},{period:'Jun',level:'Level 3',completed:9,assigned:10,weightedAverage:70},{period:'May',level:'Level 3',completed:6,assigned:8,weightedAverage:67},{period:'Apr',level:'Level 3',completed:8,assigned:8,weightedAverage:76}],trend:[{period:'Apr',value:76},{period:'May',value:67},{period:'Jun',value:70},{period:'Jul',value:75}],englishSkills:[{name:'Vocabulary',value:73,previousValue:68},{name:'Grammar',value:44,previousValue:52},{name:'Reading',value:83,previousValue:78},{name:'Listening',value:86,previousValue:81},{name:'Writing',value:68,previousValue:64}],mathTopics:[{name:'Algebraic expressions',value:81},{name:'Linear equations',value:78},{name:'Percentages',value:74},{name:'Geometry',value:58},{name:'Statistics',value:76},{name:'Probability',value:64},{name:'Trigonometry',value:61}],insights:[{label:'PERFORMANCE SIGNAL',title:'Reading is currently strongest',body:'Grammar has enough scored evidence to recommend focused work on sentence structure and tense.'},{label:'FOCUS NEXT',title:'Grammar',body:'Complete another targeted set to strengthen the evidence.'}],dataConfidence:{level:'Developing',body:'Recommendations improve as more scored questions are completed.'},assessmentResults:[{resultId:'result-listening',title:'Daily Assessment · Listening',subject:'English listening',submittedAt:'27 Jul 2026',status:'released',score:84,reviewHref:'assessment-player/?review=result&pack=english-listening&viewer=teacher'},{resultId:'result-reading',title:'Daily Assessment · Reading',subject:'English reading',submittedAt:'27 Jul 2026',status:'released',score:76,reviewHref:'assessment-player/?review=result&pack=dse-reading&viewer=teacher'}]};
  const studentPerformance={async get(){return wait({...performanceFixture,viewer:{canViewAssessmentResults:false},source:'backend_aggregate'})}};
  const classFixtures=[{classId:'class-5a',membershipId:'membership-class-5a',name:'Class 5A',studentCount:4,currentMonth:90,lastMonth:84,overall:79,open:8,expired:12},{classId:'class-math-olympiad',membershipId:'membership-math-olympiad',name:'Math Olympiad',studentCount:2,currentMonth:75,lastMonth:71,overall:67,open:3,expired:2}];
  const studentFixtures=[{studentId:'student-ava-lau',membershipId:'membership-ava-5a',classId:'class-5a',className:'Class 5A',displayName:'Ava Lau',externalReference:'ST26001',currentMonth:89,lastMonth:82,overall:91,activityRate:94,score:84,completed:54,assigned:58},{studentId:'student-ethan-wong',membershipId:'membership-ethan-5a',classId:'class-5a',className:'Class 5A',displayName:'Ethan Wong',externalReference:'ST26002',currentMonth:83,lastMonth:78,overall:88,activityRate:88,score:78,completed:51,assigned:58},{studentId:'student-mia-chan',membershipId:'membership-mia-5a',classId:'class-5a',className:'Class 5A',displayName:'Mia Chan',externalReference:'ST26003',currentMonth:76,lastMonth:79,overall:84,activityRate:81,score:76,completed:49,assigned:58},{studentId:'student-noah-lee',membershipId:'membership-noah-math',classId:'class-math-olympiad',className:'Math Olympiad',displayName:'Noah Lee',externalReference:'ST26004',currentMonth:61,lastMonth:72,overall:73,activityRate:62,score:68,completed:42,assigned:58}];
  const teacherClasses={async list(){return wait({items:classFixtures})}};
  const teacherStudents={async list({classId}={}){return wait({classId,items:studentFixtures.filter(item=>!classId||item.classId===classId)})}};
  const teacherResults={async list({cursor=null}={}){return wait({items:[],pageInfo:{endCursor:cursor,hasNextPage:false}})}};
  const teacherPerformance={async getStudent({studentId}={}){const result=await studentPerformance.get();return {...result,studentId,viewer:{canViewAssessmentResults:true}}}};
  const attemptStore=new Map();
  const assessmentPlayer={
    async createOrResume({studentAssignmentId,packId}){const id=studentAssignmentId||packId||'fixture-attempt',attempt=attemptStore.get(id)||{attemptId:`attempt-${id}`,status:'in_progress',responses:{},expiresAt:new Date(Date.now()+50*60*1000).toISOString(),reviewAllowed:false};attemptStore.set(id,attempt);return wait(attempt)},
    async saveResponse({attemptId,questionId,response}){const attempt=[...attemptStore.values()].find(item=>item.attemptId===attemptId);if(!attempt)throw new Error('Attempt is unavailable.');attempt.responses[questionId]=response;return wait({state:'saved',savedAt:new Date().toISOString()})},
    async submit({attemptId,reason='manual',legacyPayload=null}){const attempt=[...attemptStore.values()].find(item=>item.attemptId===attemptId);if(!attempt)return wait({status:'already_submitted'});if(legacyPayload&&window.EXAI_SUBMISSIONS?.submit)await window.EXAI_SUBMISSIONS.submit(legacyPayload);attempt.status='submitted';return wait({status:'submitted',reason,reviewAllowed:attempt.reviewAllowed})}
  };
  const demoReset={async preview(){return wait({generatedPapers:4,assignments:8,attempts:14,responses:126,practiceRecords:9,results:11,preserved:{organisations:true,roles:true,memberships:true,classes:true,baselineDummyRoster:true}})},async confirm(){return wait({state:'backend_rpc_pending'})}};
  const adminLearningReset={
    previewRpc:'preview_admin_learning_reset',confirmRpc:'admin_reset_learning_item',
    async preview({attemptId,administratorMembershipId}={}){if(!attemptId||!administratorMembershipId)throw new Error('A linked attempt and administrator membership are required.');const client=backend();if(client&&isUuid(attemptId)&&isUuid(administratorMembershipId)){const {data,error}=await client.rpc(this.previewRpc,{requested_attempt_id:attemptId,requested_administrator_membership_id:administratorMembershipId});if(error)throw error;return data}return wait({attemptId,invalidationCopy:'The saved responses, submission, result, and derived performance contribution for this attempt will be invalidated.',availabilityCopy:'The assignment will remain available as Not started when its availability rules still allow access.'})},
    async confirm({attemptId,administratorMembershipId,reason}={}){if(!attemptId||!administratorMembershipId||!reason)throw new Error('The secured reset request is incomplete.');const client=backend();if(client&&isUuid(attemptId)&&isUuid(administratorMembershipId)){const {data,error}=await client.rpc(this.confirmRpc,{requested_attempt_id:attemptId,requested_administrator_membership_id:administratorMembershipId,requested_reason:reason});if(error)throw error;return data}discardedAttempts.add(attemptId);Object.values(resultFixtures).flat().filter(item=>item.attemptId===attemptId).forEach(item=>invalidatedSnapshots.add(item.resultId));return wait({state:'reset',attemptId})}
  };
  window.EXAI_ADAPTERS=Object.freeze({auth:{accountContext,accountResetCapabilities},studentAssignments,studentPractice,studentResults,studentPerformance,assessmentPlayer,teacherClasses,teacherStudents,teacherResults,teacherPerformance,demoReset,adminLearningReset});
})();
