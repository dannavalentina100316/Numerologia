const API_BASE_URL = 'http://localhost:3200/api';

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. VERIFICAR SESIÓN DEL USUARIO
  // -------------------------------------------------------------
  const token = localStorage.getItem('token');
  const rawUser = localStorage.getItem('user');
  let user = null;

  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch (e) {
    console.error('Error al parsear el usuario:', e);
  }

  if (!token || !user || !user.email) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Debes registrarte e iniciar sesión antes de entrar al dashboard.');
    window.location.href = 'login.html';
    return;
  }

  // -------------------------------------------------------------
  // 2. ENCABEZADO Y LOGOUT
  // -------------------------------------------------------------
  const welcomeUser = document.getElementById('welcomeUser');
  if (welcomeUser) {
    welcomeUser.textContent = `¡Hola, ${user.firstName}! 👋`;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      alert('Sesión cerrada con éxito.');
      window.location.href = 'login.html';
    });
  }

  // -------------------------------------------------------------
  // 3. TARJETA 1: PERFIL MÍSTICO Y ZODIACAL
  // -------------------------------------------------------------
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const zodiacSymbol = document.getElementById('zodiacSymbol');
  const zodiacSign = document.getElementById('zodiacSign');
  const zodiacElement = document.getElementById('zodiacElement');
  const zodiacHoroscope = document.getElementById('zodiacHoroscope');

  if (profileName) profileName.textContent = `${user.firstName} ${user.lastName}`;
  if (profileEmail) profileEmail.textContent = user.email;

  const zodiacData = calculateZodiac(user.birthDate);
  if (zodiacSymbol) zodiacSymbol.textContent = zodiacData.symbol;
  if (zodiacSign) zodiacSign.textContent = zodiacData.name;
  if (zodiacElement) zodiacElement.textContent = zodiacData.element;
  if (zodiacHoroscope) zodiacHoroscope.textContent = zodiacData.horoscope;

  // -------------------------------------------------------------
  // 4. TARJETA 2: MI CAMINO DE VIDA (NUMEROLOGÍA)
  // -------------------------------------------------------------
  const btnCalculateProfile = document.getElementById('btnCalculateProfile');
  const profileResultsView = document.getElementById('profileResultsView');
  const numLifePath = document.getElementById('numLifePath');
  const numMeaningText = document.getElementById('numMeaningText');

  if (btnCalculateProfile) {
    btnCalculateProfile.addEventListener('click', async () => {
      btnCalculateProfile.textContent = 'Calculando...';
      btnCalculateProfile.disabled = true;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/numerology/profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ birthDate: user.birthDate })
        });

        if (response.ok) {
          const data = await response.json();
          renderLifePath(data.number, data.meaning);
          return;
        }
      } catch (err) {
        console.warn('API no disponible, calculando localmente:', err);
      } finally {
        btnCalculateProfile.textContent = 'Ver Mi Perfil';
        btnCalculateProfile.disabled = false;
      }

      // Cálculo local si no hay servidor
      const localResult = calculateLifePathLocal(user.birthDate);
      renderLifePath(localResult.number, localResult.meaning);
    });
  }

  function renderLifePath(num, text) {
    if (numLifePath) numLifePath.textContent = num;
    if (numMeaningText) numMeaningText.textContent = text;
    if (profileResultsView) {
      profileResultsView.style.display = 'block';
      profileResultsView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // -------------------------------------------------------------
  // 5. TARJETA 3: LECTURA NUMEROLÓGICA DEL DÍA
  // -------------------------------------------------------------
  const btnGetReading = document.getElementById('btnGetReading');
  const dailyReadingText = document.getElementById('dailyReadingText');

  if (btnGetReading) {
    btnGetReading.addEventListener('click', async () => {
      btnGetReading.textContent = 'Consultando oráculo...';
      btnGetReading.disabled = true;

      try {
        const response = await fetch(`${API_BASE_URL}/numerology/daily`);
        if (response.ok) {
          const data = await response.json();
          if (dailyReadingText) dailyReadingText.textContent = `“${data.message}”`;
          return;
        }
      } catch (err) {
        console.warn('API no disponible, generando lectura local:', err);
      } finally {
        btnGetReading.textContent = 'Obtener Lectura';
        btnGetReading.disabled = false;
      }

      // Lectura local
      const readings = [
        'Hoy las estrellas favorecen la comunicación clara y la expresión honesta. No te guardes tus ideas; tu voz tiene el poder de inspirar.',
        'La energía cósmica de hoy invita a una pausa reflexiva. En la quietud interior encontrarás la respuesta que buscas.',
        'Día propicio para ordenar tus metas y fijar prioridades firmes. Tu disciplina atraerá oportunidades prósperas.',
        'Sientes un impulso renovador. Da el primer paso hacia ese objetivo pendiente; el cosmos premia tu valentía.',
        'La armonía y el cariño en tu círculo cercano son la prioridad de hoy. Un gesto de gratitud transformará el día de alguien.'
      ];
      const todayIndex = new Date().getDate() % readings.length;
      if (dailyReadingText) {
        dailyReadingText.textContent = `“${readings[todayIndex]}”`;
      }
    });
  }
});

// -------------------------------------------------------------
// FUNCIONES AUXILIARES DE CÁLCULO
// -------------------------------------------------------------
function calculateZodiac(birthDateStr) {
  if (!birthDateStr) {
    return { name: 'Piscis', symbol: '♓', element: 'Agua', horoscope: 'Confía en tu intuición más profunda.' };
  }
  const parts = birthDateStr.split('-');
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return { name: 'Aries', symbol: '♈', element: 'Fuego', horoscope: 'Marte impulsa tu determinación. Es un gran momento para liderar con valentía.' };
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return { name: 'Tauro', symbol: '♉', element: 'Tierra', horoscope: 'Venus te brinda estabilidad y armonía. Avanza con pasos firmes hacia tus metas.' };
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return { name: 'Géminis', symbol: '♊', element: 'Aire', horoscope: 'Mercurio estimula tu elocuencia. Una charla casual traerá una revelación valiosa.' };
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return { name: 'Cáncer', symbol: '♋', element: 'Agua', horoscope: 'La Luna expande tu intuición y empatía. Fortalece tus lazos más queridos.' };
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return { name: 'Leo', symbol: '♌', element: 'Fuego', horoscope: 'El Sol ilumina tu magnetismo natural. Tu liderazgo sereno inspira a tu entorno.' };
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return { name: 'Virgo', symbol: '♍', element: 'Tierra', horoscope: 'El orden y el discernimiento resolverán con elegancia un enigma pendiente.' };
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return { name: 'Libra', symbol: '♎', element: 'Aire', horoscope: 'Busca el equilibrio. Hoy lograrás consensos donde antes reinaba la discrepancia.' };
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return { name: 'Escorpio', symbol: '♏', element: 'Agua', horoscope: 'Tu perspicacia transformará una dificultad en una ventaja estratégica.' };
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return { name: 'Sagitario', symbol: '♐', element: 'Fuego', horoscope: 'Júpiter expande tus horizontes. Nuevos aprendizajes renuevan tu entusiasmo.' };
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return { name: 'Capricornio', symbol: '♑', element: 'Tierra', horoscope: 'Saturno premia tu paciencia. Una meta de largo plazo muestra sus primeros frutos.' };
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return { name: 'Acuario', symbol: '♒', element: 'Aire', horoscope: 'Urano despierta tu visión vanguardista. Rompe moldes con propuestas creativas.' };
  } else {
    return { name: 'Piscis', symbol: '♓', element: 'Agua', horoscope: 'Neptuno sintoniza tu compasión y creatividad artística. Nutre tu mundo interior.' };
  }
}

function reduceNumber(num, preserveMaster = true) {
  if (preserveMaster && (num === 11 || num === 22 || num === 33)) return num;
  while (num > 9) {
    if (preserveMaster && (num === 11 || num === 22 || num === 33)) return num;
    num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return num;
}

function calculateLifePathLocal(birthDateStr) {
  if (!birthDateStr) return { number: 7, meaning: 'Buscador de la sabiduría interior y la verdad.' };
  const parts = birthDateStr.split('-');
  const y = parseInt(parts[0] || '1990', 10);
  const m = parseInt(parts[1] || '1', 10);
  const d = parseInt(parts[2] || '1', 10);

  const total = reduceNumber(d) + reduceNumber(m) + reduceNumber(y);
  const num = reduceNumber(total);

  const map = {
    1: 'El Líder Pionero: Innovación, autonomía, determinación y coraje para abrir senderos.',
    2: 'El Pacificador: Diplomacia, empatía, cooperación y búsqueda constante de armonía.',
    3: 'El Comunicador Creativo: Expresión artística, optimismo, alegría e ingenio.',
    4: 'El Constructor: Solidez, disciplina, orden y tenacidad para bases firmes.',
    5: 'El Explorador Libre: Versatilidad, aventura, adaptabilidad y curiosidad sin límites.',
    6: 'El Protector Armonizador: Servicio compasivo, amor familiar y embellecimiento del entorno.',
    7: 'El Sabio Introspectivo: Mente analítica, intuición profunda y búsqueda espiritual.',
    8: 'El Manifestador: Autoridad ética, visión estratégica y realización de grandes metas.',
    9: 'El Humanitario Universal: Generosidad desinteresada, sabiduría colectiva y compasión.',
    11: 'Número Maestro 11: Gran intuición espiritual, iluminación e inspiración colectiva.',
    22: 'Número Maestro 22: El Maestro Constructor, capaz de materializar ideales sublimes.',
    33: 'Número Maestro 33: El Maestro Sanador, devoción al servicio y elevación espiritual.'
  };

  return {
    number: num,
    meaning: map[num] || map[7]
  };
}
