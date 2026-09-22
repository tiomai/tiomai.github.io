const search=document.querySelector('#search');
let selected='All';const pins=[...document.querySelectorAll('.pin')];
function filter(){let count=0;const q=search.value.trim().toLowerCase();for(const p of pins){const show=(selected==='All'||p.dataset.category===selected)&&p.textContent.toLowerCase().includes(q);p.hidden=!show;if(show)count++;}document.querySelector('#count').textContent=`${count} items in this collection`;document.querySelector('.empty').hidden=count!==0;}
search.addEventListener('input',filter);
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});filter();}));
const modal=document.querySelector('dialog');
document.querySelectorAll('.pin-media').forEach(b=>b.addEventListener('click',()=>{modal.querySelector('img').src=b.dataset.src;modal.querySelector('img').alt=b.dataset.title;modal.querySelector('h2').textContent=b.dataset.title;modal.querySelector('a').href=b.dataset.src;modal.showModal();}));
modal.querySelector('button').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();}});
filter();

// Preserve masonry packing while allowing guideline cards to span two columns.
const grid=document.querySelector('.masonry');
function layoutCards(){const gap=parseFloat(getComputedStyle(grid).rowGap);const row=parseFloat(getComputedStyle(grid).gridAutoRows);for(const pin of pins){if(!pin.hidden)pin.style.gridRowEnd='span '+Math.ceil((pin.getBoundingClientRect().height+gap)/(row+gap));}}
const observer=new ResizeObserver(()=>requestAnimationFrame(layoutCards));pins.forEach(p=>observer.observe(p));window.addEventListener('resize',layoutCards);search.addEventListener('input',()=>requestAnimationFrame(layoutCards));document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(layoutCards)));document.querySelectorAll('img').forEach(i=>i.addEventListener('load',layoutCards));layoutCards();
