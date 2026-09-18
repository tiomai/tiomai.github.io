(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EXAI_LEARNER_QUESTION_RENDERER=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const grouped=q=>['grouped_cloze','shared_audio_grouped_mixed'].includes(q?.questionLayout)&&q.parts?.length;
  const supportingInstruction=(q,fallback)=>{const value=String(q?.instruction||'').trim(),prompt=String(q?.prompt||'').trim();return value?(value===prompt?'':value):fallback};
  const labels=q=>{const matches=String(q.supplementary||'').split(/\n+/).map(row=>row.trim()).filter(row=>/^[①②③④⑤⑥⑦⑧⑨⑩]/.test(row));return q.parts.map((part,index)=>part.label&&!/^Part \d+$/i.test(part.label)?part.label:(matches[index]?.replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/,'')||`Part ${index+1}`))};
  function render({question:q,elements,flow='paper',formatPassage}){
    if(!q||!elements)return {rendered:false};
    const {prompt,passage,options,questionType,instruction,next}=elements,answers=q.answer&&typeof q.answer==='object'&&!Array.isArray(q.answer)?q.answer:{};
    if(prompt)prompt.textContent=q.prompt||'';
    if(passage&&q.passage)passage.innerHTML=typeof formatPassage==='function'?formatPassage(q.passage):escape(q.passage).replace(/\n+/g,'<br>');
    if(q.isShort&&!grouped(q)){
      if(questionType)questionType.textContent='SHORT ANSWER';if(instruction)instruction.textContent=supportingInstruction(q,q.supplementary||'Type your answer.');
      if(options)options.innerHTML=`<textarea class="short-answer" rows="4" aria-label="${escape(q.prompt||'Answer')}" placeholder="Type your answer" ${q.submitted?'disabled':''}>${escape(q.answer||'')}</textarea>`;
      if(next)next.disabled=!(q.answer!==null&&q.answer!=='')&&flow!=='paper';return {rendered:true,parts:1};
    }
    if(grouped(q)){
      const partLabels=labels(q);if(questionType)questionType.textContent=q.questionLayout==='shared_audio_grouped_mixed'?'GROUPED LISTENING':'GROUPED QUESTION';if(instruction)instruction.textContent=supportingInstruction(q,'Answer every part.');
      if(options)options.innerHTML=q.parts.map((part,index)=>{const choice=part.entryType==='single_choice',label=partLabels[index];return `<fieldset class="option-group" data-part="${escape(part.blankId)}"><legend>${escape(label)}</legend>${part.instruction?`<p class="instruction">${escape(part.instruction)}</p>`:''}${choice?part.options.map((item,optionIndex)=>`<button type="button" class="option ${Number(answers[part.blankId])===optionIndex?'selected':''}" data-blank="${escape(part.blankId)}" data-option="${optionIndex}" ${q.submitted?'disabled':''}><span class="radio"></span><span>${escape(item.value)}</span></button>`).join(''):`<textarea class="short-answer" data-blank="${escape(part.blankId)}" rows="4" aria-label="${escape(label)}" placeholder="Type your answer" ${q.submitted?'disabled':''}>${escape(answers[part.blankId]||'')}</textarea>`}</fieldset>`}).join('');
      if(next)next.disabled=q.parts.some(part=>answers[part.blankId]===undefined||answers[part.blankId]==='')&&flow!=='paper';return {rendered:true,parts:q.parts.length};
    }
    if(questionType)questionType.textContent='MULTIPLE CHOICE';if(instruction)instruction.textContent=supportingInstruction(q,'Choose the best answer.');
    if(options)options.innerHTML=(q.optionItems||[]).map((item,index)=>`<button type="button" class="option ${q.answer===index?'selected':''}" data-option="${index}" ${q.submitted?'disabled':''}><span class="radio"></span><span>${escape(item.value)}</span></button>`).join('');
    return {rendered:true,parts:1};
  }
  return Object.freeze({render,grouped});
});
