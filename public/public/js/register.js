const API_BASE_URL = 'http://localhost:3200/api';

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. LÓGICA PARA REGISTRO (register.html)
  // -------------------------------------------------------------
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const userData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        birthDate: document.getElementById('birthDate').value
      };

      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
          alert('¡Usuario registrado con éxito!');
          window.location.href = 'login.html';
        } else {
          alert(`Error: ${data.message || 'No se pudo completar el registro'}`);
        }
      } catch (error) {
        console.warn('Servidor no disponible en localhost:3200. Guardando localmente para prueba interactiva:', error);
        
        // Guardado local de respaldo para que la interfaz funcione sin backend activo
        const savedUsers = JSON.parse(localStorage.getItem('numerology_users') || '[]');
        savedUsers.push(userData);
        localStorage.setItem('numerology_users', JSON.stringify(savedUsers));

        alert('¡Usuario registrado con éxito! (Modo local)');
        window.location.href = 'login.html';
      }
    });
  }
});
