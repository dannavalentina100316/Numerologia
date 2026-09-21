const API_BASE_URL = 'http://localhost:3200/api';

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 2. LÓGICA PARA LOGIN (login.html)
  // -------------------------------------------------------------
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const credentials = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      };

      try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (response.ok) {
          // Guardar token JWT y datos del usuario en el navegador
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          alert('¡Inicio de sesión exitoso!');
          window.location.href = 'dashboard.html';
        } else {
          alert(`Error: ${data.message || 'Credenciales incorrectas'}`);
        }
      } catch (error) {
        console.warn('Servidor no disponible en localhost:3200. Comprobando credenciales locales:', error);

        // Fallback local: verificar si el usuario se registró en localStorage
        const savedUsers = JSON.parse(localStorage.getItem('numerology_users') || '[]');
        const matched = savedUsers.find(
          (u) => u.email
            && u.email.toLowerCase() === credentials.email.toLowerCase()
            && u.password === credentials.password
        );

        if (!matched) {
          alert('Debes registrarte antes de iniciar sesión.');
          return;
        }

        localStorage.setItem('token', 'local-demo-token-12345');
        localStorage.setItem('user', JSON.stringify(matched));

        alert('¡Inicio de sesión exitoso! (Modo local)');
        window.location.href = 'dashboard.html';
      }
    });
  }
});
