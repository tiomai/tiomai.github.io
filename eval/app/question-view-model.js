(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.EXAI_QUESTION_VIEW_MODEL=Object.freeze(api);
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='question-view-model-v2';
  const layouts=new Set(['passage_single_choice','passage_short_text','grouped_cloze','audio_single_choice','audio_short_text','shared_audio_grouped_mixed','standalone_language_single_choice','standalone_language_short_text']);
  const fail=(position,message)=>{throw new Error(`Question ${position||'—'} ${message}`)};
  const scalar=value=>typeof value==='string'||typeof value==='number'?String(value).trim():'';
  const field=(value,names)=>{if(value==null)return'';if(typeof value==='string'||typeof value==='number')return scalar(value);for(const name of names){const found=scalar(value?.[name]);if(found)return found}return''};
  const content=value=>field(value,['text','value','content','html','title','instruction']);
  const stemFields=stem=>({
    instruction:field(stem,['instruction','instruction_text']),
    primaryText:field(stem,['text','primary_text','prompt','content']),
    supplementaryText:field(stem,['supplementary_text','supplementaryText']),
    paragraphNumber:stem?.paragraph_number??stem?.paragraphNumber??null,
    requiresSupplementary:Boolean(stem?.requires_supplementary_text??stem?.requiresSupplementaryText)
  });
  const normalizeParagraph=(paragraph,index)=>({
    id:paragraph?.id??null,
    position:Number(paragraph?.position??index+1),
    paragraphNumber:paragraph?.paragraph_number??paragraph?.paragraphNumber??index+1,
    content:content(paragraph?.content??paragraph?.text??paragraph),
    transcript:Array.isArray(paragraph?.transcripts)?paragraph.transcripts.map(line=>({speaker:field(line,['name','speaker']),text:field(line,['text','content'])})):[],
    audioUrl:field(paragraph,['audioUrl','audio_url','mediaPath','media_path'])||null
  });
  const blankId=option=>option?.content?.blank_id??option?.content?.blankId??option?.blank_id??option?.blankId??null;
  const normalizeOption=option=>({id:option?.id??null,position:Number(option?.position??0),blankId:blankId(option),value:content(option?.content??option)});
  const normalizeKeys=answerKey=>{
    const blanks=Array.isArray(answerKey?.blanks)?answerKey.blanks:[];
    return blanks.map((blank,index)=>({
      blankId:blank?.id??blank?.blank_id??blank?.blankId??String(index+1),
      correctOptionIds:(blank?.correct_option_ids??blank?.correctOptionIds??[]).filter(Boolean).map(String),
      acceptedAnswers:(blank?.accepted_answers??blank?.acceptedAnswers??[]).map(content).filter(Boolean),
      points:Number(blank?.points??1)
    }));
  };
  const normalizeResponseParts=question=>{
    const schema=question?.responseSchema??question?.response_schema??question?.answerEntry??question?.answer_entry??{};
    const rows=Array.isArray(schema?.parts)?schema.parts:Array.isArray(schema?.blanks)?schema.blanks:[];
    const aliases={choice:'single_choice',single_choice:'single_choice',radio:'single_choice',short_text:'short_text',text:'short_text',text_input:'short_text'};
    return rows.map((part,index)=>({
      blankId:String(part?.id??part?.blankId??part?.blank_id??index+1),
      position:Number(part?.position??index+1),
      label:field(part,['label','prompt','title']),
      instruction:field(part,['instruction','instruction_text']),
      entryType:aliases[field(part,['type','entryType','entry_type','control','response_type']).toLowerCase()]||field(part,['type','entryType','entry_type','control','response_type']).toLowerCase()
    })).sort((a,b)=>a.position-b.position);
  };
  function fromAttemptItem(item,{review=false}={}){
    const position=item?.position,question=item?.question||{},layout=question.questionLayout||question.question_layout||'';
    if(!question.id)fail(position,'has no stable identifier.');
    if(!layouts.has(layout))fail(position,'has no supported English learner layout.');
    const stem=stemFields(question.stem||{});
    if(stem.requiresSupplementary&&!stem.supplementaryText)fail(position,'is missing required supplementary context.');
    const promptParts=[stem.primaryText,stem.supplementaryText].filter(Boolean);
    if(!promptParts.length&&stem.instruction)promptParts.push(stem.instruction);
    if(!promptParts.length)fail(position,'has no learner-facing prompt.');
    const stimulus=question.stimulus||{},rawParagraphs=Array.isArray(stimulus?.body?.paragraphs)?stimulus.body.paragraphs:[],paragraphs=rawParagraphs.map(normalizeParagraph).sort((a,b)=>a.position-b.position);
    const options=(Array.isArray(question.options)?question.options:[]).map(normalizeOption).sort((a,b)=>a.position-b.position);
    if(options.some(option=>!option.id||!option.value))fail(position,'has an option without a stable ID or visible value.');
    const answerEntries=normalizeResponseParts(question);
    const keyParts=normalizeKeys(item?.answerKey??item?.answer_key??{});
    const multi=layout==='grouped_cloze'||layout==='shared_audio_grouped_mixed';
    if(multi&&!answerEntries.length)fail(position,'has no answer-free response schema.');
    const entryIds=answerEntries.map(part=>String(part.blankId));
    if(new Set(entryIds).size!==entryIds.length)fail(position,'has duplicate response-part identifiers.');
    if(answerEntries.some(part=>!['single_choice','short_text'].includes(part.entryType)))fail(position,'has an unsupported response control.');
    const optionBlankIds=[...new Set(options.map(option=>option.blankId).filter(value=>value!==null&&value!==undefined).map(String))];
    const declaredBlankIds=multi?entryIds:[answerEntries[0]?.blankId??optionBlankIds[0]??'1'];
    const parts=(multi?declaredBlankIds:[declaredBlankIds[0]??'1']).map((id,index)=>{
      const entry=answerEntries.find(part=>String(part.blankId)===String(id))||{};
      const partOptions=multi?options.filter(option=>String(option.blankId)===String(id)):options;
      return {blankId:String(id),position:entry.position||index+1,label:entry.label||`Part ${index+1}`,instruction:entry.instruction,entryType:entry.entryType||(partOptions.length?'single_choice':'short_text'),options:partOptions};
    });
    if(layout.endsWith('single_choice')||layout==='standalone_language_single_choice'){
      if(options.length<2||options.length>6)fail(position,`has ${options.length} answer choices; expected 2–6.`);
    }
    if(multi&&parts.length<2)fail(position,'is a grouped layout without multiple declared parts.');
    if(multi&&parts.some(part=>part.entryType==='single_choice'&&part.options.length<2))fail(position,'has an incomplete grouped choice part.');
    if(multi&&parts.some(part=>part.entryType==='short_text'&&part.options.length))fail(position,'has answer choices attached to a short-text part.');
    if(multi&&optionBlankIds.some(id=>!entryIds.includes(id)))fail(position,'has options for an undeclared response part.');
    const passageRequired=layout.startsWith('passage_')||layout==='grouped_cloze';
    if(passageRequired&&!paragraphs.some(paragraph=>paragraph.content))fail(position,'is missing its passage.');
    const audioRequired=layout.startsWith('audio_')||layout==='shared_audio_grouped_mixed';
    let audioSrc=null;
    if(stem.paragraphNumber!==null){const referenced=paragraphs.find(paragraph=>String(paragraph.paragraphNumber)===String(stem.paragraphNumber));audioSrc=referenced?.audioUrl||null}
    else audioSrc=field(stimulus,['mediaPath','media_path'])||null;
    if(audioRequired&&!audioSrc)fail(position,'is missing audio for its explicit stimulus or paragraph reference.');
    if(audioRequired&&!/^https:\/\/[^\s]+$/i.test(audioSrc))fail(position,'does not have a playable HTTPS audio asset.');
    const answerKeyAllowed=review||item?.answerKeyReleased===true||item?.answer_key_released===true;
    return {
      version:VERSION,attemptItemId:item?.attemptItemId??item?.attempt_item_id??null,questionId:question.id,contentRevision:question.contentRevision??question.content_revision??null,
      questionLayout:layout,questionType:question.questionType??question.question_type??'',points:Number(question.points??item?.points??1),
      instruction:stem.instruction,supplementary:stem.supplementaryText,prompt:promptParts.join('\n\n'),paragraphNumber:stem.paragraphNumber,
      stimulus:{id:question.stimulusId??question.stimulus_id??null,type:stimulus.type??stimulus.stimulusType??null,title:field(stimulus,['title']),paragraphs,audioSrc},
      parts,options,answer:item?.response??null,bookmark:Boolean(item?.bookmark??item?.flagged),answerKey:answerKeyAllowed?keyParts:null,
      explanation:answerKeyAllowed?content(question.explanation):'',review:Boolean(review),status:item?.status??null,assistanceUsed:Boolean(item?.assistanceUsed??item?.assistance_used)
    };
  }
  return {VERSION,layouts,fromAttemptItem};
});
