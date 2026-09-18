(function(){
  const params=new URLSearchParams(location.search);
  if(params.get('viewer')!=='teacher'||!params.get('review'))return;
  const make=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node};
  const mount=()=>{
    if(typeof render!=='function'||!window.EXAI_ADAPTERS?.teacherReview)return;
    const original=render;
    render=function(){
      original();
      const q=questions[current];
      if(!q?.attemptItemId)return;
      document.querySelector('.teacher-marking-panel')?.remove();
      const panel=make('section','teacher-marking-panel'),head=make('header');
      head.append(make('b','',`Teacher marking · Question ${current+1}`),make('span','teacher-assistance-note',q.assistanceUsed?'Assistance used':'No assistance recorded'));
      panel.append(head);
      (q.parts||[]).forEach((part,index)=>{
        const key=(q.answerKey||[]).find(item=>String(item.blankId)===String(part.blankId)),max=Number(key?.points||1),row=make('div','teacher-marking-part'),label=make('label','',part.label||`Part ${index+1}`),score=make('input'),comment=make('textarea'),save=make('button','','Save mark'),status=make('span','teacher-marking-status');
        score.type='number';score.min='0';score.max=String(max);score.step='0.5';score.placeholder=`0–${max}`;score.setAttribute('aria-label',`${label.textContent} score out of ${max}`);
        comment.rows=2;comment.placeholder='Optional teacher comment';comment.setAttribute('aria-label',`${label.textContent} comment`);save.type='button';
        save.onclick=async()=>{save.disabled=true;status.textContent='Saving…';try{await window.EXAI_ADAPTERS.teacherReview.reviewPart({attemptId:params.get('resultId'),attemptItemId:q.attemptItemId,blankId:part.blankId,awardedScore:score.value===''?null:Number(score.value),comment:comment.value});status.textContent='Saved'}catch(error){status.textContent=error?.message||'Mark could not be saved';save.disabled=false}};
        row.append(label,score,comment,save,status);panel.append(row);
      });
      feedbackPanel.after(panel);
    };
    render();
  };
  if(document.readyState==='loading')addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
