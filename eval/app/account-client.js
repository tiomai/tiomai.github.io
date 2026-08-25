window.addEventListener('DOMContentLoaded', async () => {
  const form = document.querySelector('#passwordForm');
  const emailField = document.querySelector('#accountEmail');
  const message = document.querySelector('#passwordMessage');
  if (!form || !message) return;

  const config = window.EXAI_SUPABASE_CONFIG || {};
  const ready = Boolean(window.supabase?.createClient && config.url && config.publishableKey);
  const client = ready ? window.supabase.createClient(config.url, config.publishableKey) : null;
  let user = null;

  if (client) {
    const { data } = await client.auth.getUser();
    user = data?.user || null;
  }
  if (emailField) emailField.textContent = user?.email || 'Signed-in account';
  if (!client) {
    message.textContent = 'Supabase client configuration is pending. This form is ready for staging integration.';
    message.className = 'account-message info';
  } else if (!user) {
    message.textContent = 'Sign in before changing your password.';
    message.className = 'account-message error';
    form.querySelectorAll('input,button').forEach(control => control.disabled = true);
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!client || !user?.email) return;
    const values = new FormData(form);
    const currentPassword = String(values.get('currentPassword') || '');
    const newPassword = String(values.get('newPassword') || '');
    const confirmPassword = String(values.get('confirmPassword') || '');
    message.className = 'account-message error';
    if (newPassword.length < 8) return void (message.textContent = 'Use at least 8 characters.');
    if (newPassword !== confirmPassword) return void (message.textContent = 'New passwords do not match.');

    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Updating…';
    const verified = await client.auth.signInWithPassword({ email: user.email, password: currentPassword });
    if (verified.error) {
      message.textContent = 'The current password is incorrect.';
    } else {
      const updated = await client.auth.updateUser({ password: newPassword });
      if (updated.error) message.textContent = updated.error.message;
      else {
        form.reset();
        message.textContent = 'Password updated successfully.';
        message.className = 'account-message success';
      }
    }
    submit.disabled = false;
    submit.textContent = 'Update password';
  });
});

