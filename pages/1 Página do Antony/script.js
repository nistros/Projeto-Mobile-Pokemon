let registeredUsers = {};

function handleLogin() {
  const user = document.getElementById('usuario').value;
  const pass = document.getElementById('senha').value;

  if (!user || !pass) {
    alert('Preencha todos os campos!');
    return false;
  }

  if (registeredUsers[user] === pass) {
    alert('Login realizado com sucesso!');
    document.getElementById('mainNavbar').style.display = 'flex';
    document.querySelector('.form-container').style.display = 'none';
  } else {
    alert('Usuário ou senha incorretos!');
  }

  return false;
}

function handleRegister() {
  const newUser = document.getElementById('newUser').value;
  const newPass = document.getElementById('newPass').value;

  if (!newUser || !newPass) {
    alert('Preencha todos os campos!');
    return false;
  }

  if (registeredUsers[newUser]) {
    alert('Usuário já existe!');
  } else {
    registeredUsers[newUser] = newPass;
    alert('Registro realizado com sucesso! Faça login.');
    document.getElementById('login-tab').click();
  }

  return false;
}
