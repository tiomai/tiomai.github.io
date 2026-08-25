window.EXAI_LANDING_URL=location.protocol==='file:'||['localhost','127.0.0.1'].includes(location.hostname)?'landing/index.html':'/';
window.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-landing-link]').forEach(link=>link.href=window.EXAI_LANDING_URL));
