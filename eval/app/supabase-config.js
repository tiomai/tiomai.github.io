// The project URL and publishable key are safe client configuration, but the
// server secret/service-role key must never be added here.
window.EXAI_SUPABASE_CONFIG = Object.freeze({
  url: 'https://emfvgdnkrylfnaebertn.supabase.co',
  publishableKey: 'sb_publishable_qe9wGZgsDrUUHHKcEI85bQ_JOcAlzbM'
});
window.EXAI_GET_SUPABASE_CLIENT=window.EXAI_GET_SUPABASE_CLIENT||function(){
  const config=window.EXAI_SUPABASE_CONFIG||{};
  if(window.EXAI_SUPABASE_CLIENT)return window.EXAI_SUPABASE_CLIENT;
  if(!window.supabase?.createClient||!config.url||!config.publishableKey)return null;
  window.EXAI_SUPABASE_CLIENT=window.supabase.createClient(config.url,config.publishableKey);
  return window.EXAI_SUPABASE_CLIENT;
};
