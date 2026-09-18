(function(){
  const superscripts={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻'};
  const script=value=>String(value).split('').map(char=>superscripts[char]||char).join('');
  const readable=value=>String(value||'').replace(/^\$|\$$/g,'').replace(/\\sqrt\{([^{}]+)\}/g,'√($1)').replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g,'$1⁄$2').replace(/\^\{([^{}]+)\}/g,(_,power)=>script(power)).replace(/\^(\-?\d+)/g,(_,power)=>script(power)).replace(/\\times/g,'×').replace(/\\div/g,'÷').replace(/\\leq/g,'≤').replace(/\\geq/g,'≥').replace(/\\neq/g,'≠').replace(/\\pm/g,'±').replace(/\\left|\\right/g,'').replace(/\\,/g,' ').replace(/\{([^{}]+)\}/g,'$1');
  const render=()=>document.querySelectorAll('#prompt,#options .option span:last-child').forEach(node=>{if(node.textContent.includes('\\')||/^\$.*\$$/.test(node.textContent))node.textContent=readable(node.textContent)});
  new MutationObserver(render).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('exai:questions-loaded',render);render();
  window.EXAI_MATH_CONTENT={readable};
})();
