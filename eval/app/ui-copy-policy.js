(function(){
  const clean=value=>String(value||'').replace(/\bdemo\s*/gi,'').replace(/\s{2,}/g,' ');
  const scrub=root=>{const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){if(node.parentElement?.closest('script,style,textarea'))continue;const next=clean(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next}};
  const mount=()=>{scrub(document.body);new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===Node.TEXT_NODE){const next=clean(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next}else if(node.nodeType===Node.ELEMENT_NODE)scrub(node)}))).observe(document.body,{childList:true,subtree:true,characterData:false})};
  if(document.readyState==='loading')addEventListener('DOMContentLoaded',mount);else mount();
})();
