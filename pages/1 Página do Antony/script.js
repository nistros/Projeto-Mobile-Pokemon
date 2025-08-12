let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || {};

    function handleLogin() {
      const user = document.getElementById('usuario').value;
      const pass = document.getElementById('senha').value;

      if (!user || !pass) {
        alert('Preencha todos os campos!');
        return false;
      }

      if (registeredUsers[user] === pass) {
        alert('Login realizado com sucesso!');
        localStorage.setItem('currentUser', user); // salva login atual
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
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        alert('Registro realizado com sucesso! Faça login.');
        document.getElementById('login-tab').click();
      }

      return false;
    }

    // Mantém dados preenchidos ao trocar abas
    document.addEventListener('DOMContentLoaded', () => {
      const usuario = document.getElementById('usuario');
      const senha = document.getElementById('senha');

      usuario.value = localStorage.getItem('tempUser') || '';
      senha.value = localStorage.getItem('tempPass') || '';

      usuario.addEventListener('input', () => {
        localStorage.setItem('tempUser', usuario.value);
      });
      senha.addEventListener('input', () => {
        localStorage.setItem('tempPass', senha.value);
      });
    });