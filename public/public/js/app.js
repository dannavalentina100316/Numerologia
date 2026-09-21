// app.js - Entrada principal para la App de Numerología
console.log('Numerology Master inicializado correctamente.');

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  // Si ya hay sesión activa y estamos en index.html, podemos ofrecer ir directo al dashboard
  const heroContainer = document.querySelector('.hero-actions');
  if (heroContainer && user) {
    try {
      const parsedUser = JSON.parse(user);
      const directDashboardBtn = document.createElement('a');
      directDashboardBtn.href = 'dashboard.html';
      directDashboardBtn.className = 'btn-primary';
      directDashboardBtn.textContent = `Continuar como ${parsedUser.firstName} →`;
      directDashboardBtn.style.marginRight = '10px';
      heroContainer.prepend(directDashboardBtn);
    } catch (e) {
      console.error(e);
    }
  }
});
