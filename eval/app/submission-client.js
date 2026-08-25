(function(){
  const config=window.EXAI_SUPABASE_CONFIG||{url:'https://txgjkrxrucpuomsddlss.supabase.co',publishableKey:'sb_publishable_EbppflWGikBla7rynVzdAw_XBE34g-o'};
  const session=()=>{const key=Object.keys(localStorage).find(value=>value.startsWith('sb-')&&value.endsWith('-auth-token'));try{return key?JSON.parse(localStorage.getItem(key)):null}catch{return null}};
  const headers=token=>({apikey:config.publishableKey,Authorization:`Bearer ${token}`,'Content-Type':'application/json'});
  async function submit({packSlug,mode,responses,questions}){
    const auth=session(),token=auth?.access_token,userId=auth?.user?.id;if(!token||!userId)return {saved:false,reason:'not_signed_in'};
    const packResponse=await fetch(`${config.url}/rest/v1/packs?slug=eq.${encodeURIComponent(packSlug)}&select=id`,{headers:headers(token)}),packs=packResponse.ok?await packResponse.json():[];
    const packId=packs[0]?.id;if(!packId){localStorage.setItem(`exai_pending_${packSlug}`,JSON.stringify({packSlug,mode,responses,submittedAt:new Date().toISOString()}));return {saved:false,reason:'pack_not_imported'};}
    const score=responses.reduce((total,value,index)=>total+(value===questions[index]?.answer?1:0),0),attemptResponse=await fetch(`${config.url}/rest/v1/attempts`,{method:'POST',headers:{...headers(token),Prefer:'return=representation'},body:JSON.stringify({user_id:userId,pack_id:packId,mode,status:'submitted',submitted_at:new Date().toISOString(),score,max_score:questions.length})});
    return {saved:attemptResponse.ok,attempt:attemptResponse.ok?(await attemptResponse.json())[0]:null};
  }
  window.EXAI_SUBMISSIONS={submit};
})();
