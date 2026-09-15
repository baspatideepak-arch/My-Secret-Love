const $ = id => document.getElementById(id);

if (localStorage.getItem('adminLoggedIn') === 'true') {
  window.location.href = 'dashboard.html';
}

function showMessage(text, good = false) {
  $('loginMessage').textContent = text;
  $('loginMessage').className = 'message ' + (good ? 'success' : 'error');
}

$('showPassword').addEventListener('click', () => {
  const input = $('loginPassword');
  input.type = input.type === 'password' ? 'text' : 'password';
});

$('showCreateBtn').addEventListener('click', () => {
  $('loginSection').classList.add('hidden');
  $('createSection').classList.remove('hidden');
  showMessage('');
});

$('backLoginBtn').addEventListener('click', () => {
  $('createSection').classList.add('hidden');
  $('loginSection').classList.remove('hidden');
  showMessage('');
});

$('createForm').addEventListener('submit', e => {
  e.preventDefault();
  const username = $('createUsername').value.trim();
  const password = $('createPassword').value;
  const confirm = $('confirmPassword').value;
  if (password !== confirm) return showMessage('Passwords do not match.');
  localStorage.setItem('adminAccount', JSON.stringify({ username, password }));
  $('loginUsername').value = username;
  $('loginPassword').value = password;
  $('createForm').reset();
  $('createSection').classList.add('hidden');
  $('loginSection').classList.remove('hidden');
  showMessage('Account created. You can login now.', true);
});

$('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const account = JSON.parse(localStorage.getItem('adminAccount') || 'null');
  if (!account) return showMessage('First create an admin account.');
  if ($('loginUsername').value.trim() === account.username && $('loginPassword').value === account.password) {
    localStorage.setItem('adminLoggedIn', 'true');
    localStorage.setItem('adminName', account.username);
    window.location.href = 'dashboard.html';
  } else {
    showMessage('Wrong username or password.');
  }
});

$('forgotBtn').addEventListener('click', () => {
  const account = JSON.parse(localStorage.getItem('adminAccount') || 'null');
  if (!account) return showMessage('No account found. Create an account first.');
  const username = prompt('Enter your username:');
  if (username === account.username) alert('Demo password: ' + account.password);
  else showMessage('Username not found.');
});
