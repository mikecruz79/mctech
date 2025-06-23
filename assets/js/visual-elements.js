/**
 * Elementos visuais interativos para MCTech Learning
 */

// Easter egg ao clicar no logo
(function() {
  let logoClickCount = 0;
  const logo = document.querySelector('.logo');
  const easterEgg = document.querySelector('.easter-egg');
  
  if (logo && easterEgg) {
    logo.addEventListener('click', () => {
      logoClickCount++;
      
      // Adicionar classe de animação ao logo
      logo.classList.add('pulse-animation');
      setTimeout(() => {
        logo.classList.remove('pulse-animation');
      }, 1000);
      
      // Mostrar easter egg após 3 cliques
      if (logoClickCount === 3) {
        easterEgg.classList.add('visible');
        
        // Esconder após 5 segundos
        setTimeout(() => {
          easterEgg.classList.remove('visible');
          logoClickCount = 0;
        }, 5000);
      }
    });
  }
})();

// Easter egg ao clicar no ano do copyright
(function() {
  const yearElement = document.querySelector('.copyright-year');
  const themeToggle = document.querySelector('.theme-toggle');
  
  if (yearElement && themeToggle) {
    yearElement.addEventListener('click', () => {
      themeToggle.classList.toggle('visible');
    });
    
    // Alternar tema claro/escuro
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      
      // Salvar preferência no localStorage
      const isDarkTheme = document.body.classList.contains('dark-theme');
      localStorage.setItem('darkTheme', isDarkTheme);
      
      // Atualizar ícone do botão
      themeToggle.innerHTML = isDarkTheme ? '☀️' : '🌙';
    });
    
    // Verificar preferência salva
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
      document.body.classList.add('dark-theme');
      themeToggle.innerHTML = '☀️';
    } else {
      themeToggle.innerHTML = '🌙';
    }
  }
})();

// Animação de brilho em elementos destacados
(function() {
  const elements = document.querySelectorAll('.shine-effect');
  
  // Adicionar atraso diferente para cada elemento
  elements.forEach((element, index) => {
    element.style.animationDelay = `${index * 2}s`;
  });
})();

// Efeito de hover nos links sociais
(function() {
  const socialLinks = document.querySelectorAll('.social-link');
  
  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.classList.add('pulse-animation');
    });
    
    link.addEventListener('mouseleave', () => {
      link.classList.remove('pulse-animation');
    });
  });
})();

// Animação de digitação para o título
(function() {
  const title = document.querySelector('h1');
  
  if (title && window.innerWidth > 768) {  // Apenas em telas maiores
    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '2px solid var(--color-primary)';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        title.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        title.style.borderRight = 'none';
      }
    };
    
    // Iniciar animação após um pequeno atraso
    setTimeout(typeWriter, 1000);
  }
})();

// Detectar código Konami para easter egg adicional
(function() {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  
  document.addEventListener('keydown', (e) => {
    // Verificar se a tecla pressionada corresponde à próxima tecla do código
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      
      // Se completou o código
      if (konamiIndex === konamiCode.length) {
        activateKonamiEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
  
  function activateKonamiEasterEgg() {
    // Criar elemento para o easter egg
    const eggElement = document.createElement('div');
    eggElement.textContent = '🎮 Modo desenvolvedor ativado!';
    eggElement.style.position = 'fixed';
    eggElement.style.top = '50%';
    eggElement.style.left = '50%';
    eggElement.style.transform = 'translate(-50%, -50%)';
    eggElement.style.background = 'var(--color-accent)';
    eggElement.style.color = '#333';
    eggElement.style.padding = '20px';
    eggElement.style.borderRadius = '10px';
    eggElement.style.zIndex = '1000';
    eggElement.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
    
    document.body.appendChild(eggElement);
    
    // Remover após alguns segundos
    setTimeout(() => {
      eggElement.style.transition = 'all 0.5s ease';
      eggElement.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(eggElement);
      }, 500);
    }, 3000);
  }
})();

// Inicializar elementos visuais após o carregamento da página
window.addEventListener('load', () => {
  // Adicionar classe para iniciar animações
  setTimeout(() => {
    document.querySelectorAll('.animate').forEach(el => {
      el.classList.add('visible');
    });
  }, 300);
});