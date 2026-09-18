(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.EXAI_DEMO_TEACHER_VIEW_MODEL=Object.freeze(api)})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const text=value=>value==null?'':String(value);
  const stableHash=value=>{let result=2166136261;for(const char of text(value)){result^=char.charCodeAt(0);result=Math.imul(result,16777619)}return result>>>0};
  const baseScore=value=>48+stableHash(value)%49;
  function studentPerformance(student){
    const histories=Array.isArray(student?.histories)?student.histories:[],completedHistories=histories.filter(item=>['submitted','reviewed'].includes(item.state)),monthsByPeriod=new Map(),studentScore=baseScore(student?.studentMembershipId);
    completedHistories.forEach(item=>{const key=text(item.month).slice(0,7),entry=monthsByPeriod.get(key)||{period:key,completed:0,assigned:null,values:[]};entry.completed+=1;entry.values.push(Math.max(35,Math.min(98,studentScore+(stableHash(`${item.historyId}|month`)%17-8))));monthsByPeriod.set(key,entry)});
    const monthlySummary=[...monthsByPeriod.values()].sort((a,b)=>b.period.localeCompare(a.period)).map(item=>({...item,weightedAverage:item.values.reduce((sum,value)=>sum+value,0)/item.values.length}));
    const skill=(name,offset)=>({name,value:Math.max(35,Math.min(98,studentScore+offset+(stableHash(`${student?.studentMembershipId}|${name}`)%9-4)))});
    return {metrics:{completed:completedHistories.length,assigned:36,weightedAverage:studentScore,activityRate:Math.round(completedHistories.length/36*100)},monthlySummary,trend:[...monthlySummary].reverse().map(item=>({period:item.period,value:item.weightedAverage})),englishSkills:[skill('Reading',5),skill('Grammar',-4),skill('Vocabulary',2),skill('Inference',-7)],mathTopics:[skill('Number',-2),skill('Algebra',4),skill('Geometry',-6),skill('Data',1)],assessmentResults:histories.map(item=>{const mode=text(item.mode);return{historyId:item.historyId,resultId:item.historyId,mode,title:mode==='assessment'?'English Reading Assessment':mode==='challenge'?'English Reading Challenge':'English Reading Practice',subject:'English',submittedAt:item.month,status:['submitted','reviewed'].includes(item.state)?'released':'not_submitted_expired',score:mode==='leisure'?null:Math.max(35,Math.min(98,studentScore+(stableHash(item.historyId)%19-9)))}})};
  }
  return {studentPerformance};
});
