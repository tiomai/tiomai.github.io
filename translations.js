/**
 * EXAI language configuration.
 * Copy remains colocated with each UI node via data-en / data-zh attributes,
 * while dynamic runtime content is translated by script.js.
 * This keeps language switching instant and fully local/offline.
 */
window.EXAI_LANGUAGE_CONFIG = Object.freeze({
  supported: ['en', 'zh'],
  fallback: 'en',
  storageKey: 'exai_language'
});
