// Main functionality for WebSecure

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Initialize UI components
  initUI();
  
  // Setup analyze form
  setupAnalyzeForm();
  
  // Setup scroll animations
  setupScrollAnimations();
  
  // Initialize chatbot
  initChatbot();
});

// Initialize UI components
function initUI() {
  // Initialize tooltips
  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltips.forEach(tooltip => {
    new bootstrap.Tooltip(tooltip);
  });
  
  // Initialize popovers
  const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
  popovers.forEach(popover => {
    new bootstrap.Popover(popover);
  });
  
  // Handle navbar transparency on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    });
  }
  
  // Add custom logos to the page if on index
  if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    addTechLogos();
  }
}

// Setup the analysis form
function setupAnalyzeForm() {
  const form = document.getElementById('analyzeForm');
  if (!form) return;
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const urlInput = document.getElementById('websiteUrl');
    const url = urlInput.value.trim();
    
    if (!url) {
      showAlert('Veuillez entrer une URL valide', 'danger');
      return;
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      showAlert('Format d\'URL invalide. Assurez-vous d\'inclure http:// ou https://', 'danger');
      return;
    }
    
    // Get selected scan type
    const scanType = document.querySelector('input[name="scanType"]:checked').value;
    
    // Show progress container
    const progressContainer = document.getElementById('scanProgress');
    progressContainer.classList.remove('d-none');
    
    // Reset progress bar
    const progressBar = progressContainer.querySelector('.progress-bar');
    progressBar.style.width = '0%';
    progressBar.classList.remove('bg-danger');
    progressBar.classList.add('progress-bar-animated', 'progress-bar-striped');
    
    // Update status text
    const statusText = document.getElementById('statusText');
    const percentageText = document.getElementById('percentageText');
    statusText.textContent = 'Initialisation de l\'analyse...';
    percentageText.textContent = '0%';
    
    try {
      // Simulate progress updates while analysis runs
      const progressInterval = simulateProgressUpdates(progressBar, statusText, percentageText, scanType);
      
      // Call the API to analyze the website
      const result = await analyzeWebsite(url, scanType);
      
      // Clear progress interval
      clearInterval(progressInterval);
      
      // Complete the progress bar
      progressBar.style.width = '100%';
      percentageText.textContent = '100%';
      statusText.textContent = 'Analyse terminée avec succès!';
      
      // Wait a moment then redirect to the report
      setTimeout(() => {
        window.location.href = `reports.html?id=${result.result_id}`;
      }, 1500);
      
    } catch (error) {
      // Stop progress updates
      clearInterval(progressInterval);
      
      // Show error in progress container
      progressBar.classList.remove('progress-bar-animated', 'progress-bar-striped');
      progressBar.classList.add('bg-danger');
      progressBar.style.width = '100%';
      statusText.textContent = `Erreur: ${error.message || 'Échec de l\'analyse du site web'}`;
      
      // Add a retry button
      if (!document.getElementById('retryButton')) {
        const retryButton = document.createElement('button');
        retryButton.id = 'retryButton';
        retryButton.className = 'btn btn-primary mt-3 me-2';
        retryButton.innerHTML = '<i class="fas fa-redo"></i> Réessayer';
        retryButton.addEventListener('click', () => {
          progressContainer.classList.add('d-none');
          progressBar.classList.add('progress-bar-animated', 'progress-bar-striped');
          progressBar.classList.remove('bg-danger');
          
          // Remove added buttons
          const buttons = progressContainer.querySelectorAll('button:not(#cancelScan)');
          buttons.forEach(btn => btn.remove());
        });
        
        progressContainer.appendChild(retryButton);
      }
      
      console.error('Analysis error:', error);
    }
  });
  
  // Cancel scan button
  const cancelButton = document.getElementById('cancelScan');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      const progressContainer = document.getElementById('scanProgress');
      progressContainer.classList.add('d-none');
      
      // Reset any added buttons
      const buttons = progressContainer.querySelectorAll('button:not(#cancelScan)');
      buttons.forEach(btn => btn.remove());
      
      showAlert('Analyse annulée', 'info');
    });
  }
}

// Simulate progress updates for the analysis
function simulateProgressUpdates(progressBar, statusText, percentageText, scanType) {
  let progress = 0;
  
  // Define different message sets based on scan type
  const quickMessages = [
    { percent: 10, text: 'Connexion au site web...' },
    { percent: 25, text: 'Vérification de la configuration SSL/TLS...' },
    { percent: 40, text: 'Analyse des en-têtes HTTP...' },
    { percent: 55, text: 'Détection des vulnérabilités courantes...' },
    { percent: 70, text: 'Analyse du contenu du site...' },
    { percent: 85, text: 'Génération de l\'évaluation des risques...' },
    { percent: 95, text: 'Finalisation du rapport...' }
  ];
  
  const deepMessages = [
    { percent: 5, text: 'Connexion au site web...' },
    { percent: 15, text: 'Vérification de la configuration SSL/TLS...' },
    { percent: 25, text: 'Analyse des en-têtes HTTP...' },
    { percent: 35, text: 'Détection des vulnérabilités XSS...' },
    { percent: 45, text: 'Recherche de points d\'injection SQL...' },
    { percent: 50, text: 'Analyse des mécanismes d\'authentification...' },
    { percent: 55, text: 'Inspection des protections CSRF...' },
    { percent: 60, text: 'Vérification des politiques de sécurité du contenu...' },
    { percent: 65, text: 'Analyse du code JavaScript...' },
    { percent: 70, text: 'Détection des bibliothèques obsolètes...' },
    { percent: 75, text: 'Exécution des algorithmes de détection d\'anomalies...' },
    { percent: 80, text: 'Analyse approfondie par IA...' },
    { percent: 85, text: 'Modélisation prédictive des risques...' },
    { percent: 90, text: 'Génération des recommandations de sécurité...' },
    { percent: 95, text: 'Finalisation du rapport détaillé...' }
  ];
  
  // Choose the appropriate message set based on scan type
  const messages = scanType === 'deep' ? deepMessages : quickMessages;
  
  let currentMessageIndex = 0;
  
  // Update speed based on scan type (slower for deep scan)
  const updateInterval = scanType === 'deep' ? 150 : 100;
  
  return setInterval(() => {
    // Update progress based on current message threshold
    if (currentMessageIndex < messages.length) {
      const targetPercent = messages[currentMessageIndex].percent;
      
      if (progress < targetPercent) {
        progress++;
        progressBar.style.width = `${progress}%`;
        percentageText.textContent = `${progress}%`;
        
        // Update message when reaching a threshold
        if (progress === targetPercent) {
          statusText.textContent = messages[currentMessageIndex].text;
          currentMessageIndex++;
        }
      }
    }
  }, updateInterval);
}

// Setup scroll animations
function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Add technology logos to the page
function addTechLogos() {
  const techLogosContainer = document.createElement('div');
  techLogosContainer.className = 'tech-logos-section py-4 bg-light';
  techLogosContainer.innerHTML = `
    <div class="container">
      <div class="text-center mb-4">
        <h4 class="fw-bold">Propulsé par les technologies de pointe</h4>
      </div>
      <div class="tech-logos">
        <div class="tech-logo">
          <img src="assets/img/tech/ai-logo.svg" alt="Intelligence Artificielle" />
          <span>IA Avancée</span>
        </div>
        <div class="tech-logo">
          <img src="assets/img/tech/ml-logo.svg" alt="Machine Learning" />
          <span>Machine Learning</span>
        </div>
        <div class="tech-logo">
          <img src="assets/img/tech/cloud-logo.svg" alt="Cloud Computing" />
          <span>Cloud Computing</span>
        </div>
        <div class="tech-logo">
          <img src="assets/img/tech/security-logo.svg" alt="Security" />
          <span>Cybersécurité</span>
        </div>
        <div class="tech-logo">
          <img src="assets/img/tech/data-logo.svg" alt="Big Data" />
          <span>Analyse de Données</span>
        </div>
      </div>
    </div>
  `;
  
  // Insert after the analyze section
  const analyzeSection = document.getElementById('analyze');
  if (analyzeSection && analyzeSection.nextElementSibling) {
    analyzeSection.parentNode.insertBefore(techLogosContainer, analyzeSection.nextElementSibling);
  }
}

// Initialize chatbot
function initChatbot() {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  
  if (!chatbotToggle || !chatbotContainer) return;
  
  // Toggle chatbot visibility
  chatbotToggle.addEventListener('click', () => {
    chatbotContainer.classList.toggle('chatbot-visible');
    
    // Add welcome message if first time opening
    if (chatbotMessages.children.length === 0) {
      addBotMessage('Bonjour 👋 Je suis l\'assistant WebSecure. Comment puis-je vous aider avec la sécurité de votre site web aujourd\'hui?');
      
      // Add quick suggestion buttons
      const suggestionsDiv = document.createElement('div');
      suggestionsDiv.className = 'chatbot-suggestions';
      
      const suggestions = [
        'Comment fonctionne l\'analyse?',
        'Que signifie un niveau de risque critique?',
        'Comment corriger les vulnérabilités XSS?'
      ];
      
      suggestions.forEach(text => {
        const button = document.createElement('button');
        button.className = 'chatbot-suggestion';
        button.textContent = text;
        button.addEventListener('click', () => {
          addUserMessage(text);
          handleUserInput(text);
        });
        suggestionsDiv.appendChild(button);
      });
      
      chatbotMessages.appendChild(suggestionsDiv);
    }
  });
  
  // Close chatbot
  chatbotClose.addEventListener('click', () => {
    chatbotContainer.classList.remove('chatbot-visible');
  });
  
  // Send message on button click
  chatbotSend.addEventListener('click', () => {
    const message = chatbotInput.value.trim();
    if (message) {
      addUserMessage(message);
      handleUserInput(message);
      chatbotInput.value = '';
    }
  });
  
  // Send message on Enter key
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const message = chatbotInput.value.trim();
      if (message) {
        addUserMessage(message);
        handleUserInput(message);
        chatbotInput.value = '';
      }
    }
  });
  
  // Handle user input
  function handleUserInput(message) {
    // Simple pattern matching for responses
    const lowerMessage = message.toLowerCase();
    
    // Add typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chatbot-message bot typing';
    typingIndicator.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    chatbotMessages.appendChild(typingIndicator);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    // Simulate thinking time
    setTimeout(() => {
      // Remove typing indicator
      chatbotMessages.removeChild(typingIndicator);
      
      let response = '';
      
      if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
        response = 'Bonjour! Comment puis-je vous aider aujourd\'hui?';
      }
      else if (lowerMessage.includes('fonctionne') && lowerMessage.includes('analyse')) {
        response = 'Notre analyse de sécurité fonctionne en 3 étapes: 1) Nous scannons votre site web pour détecter les vulnérabilités connues, 2) Notre IA analyse les patterns de sécurité et identifie les risques potentiels, 3) Nous générons un rapport détaillé avec des recommandations précises pour améliorer la sécurité de votre site.';
      }
      else if (lowerMessage.includes('niveau') && lowerMessage.includes('risque')) {
        response = 'Nous classons les niveaux de risque en 4 catégories:<br><strong>Faible</strong>: Problèmes mineurs avec peu d\'impact<br><strong>Modéré</strong>: Vulnérabilités qui nécessitent attention<br><strong>Important</strong>: Risques sérieux nécessitant une action rapide<br><strong>Critique</strong>: Vulnérabilités graves qui peuvent être exploitées immédiatement et causer des dommages significatifs';
      }
      else if (lowerMessage.includes('xss') || lowerMessage.includes('cross-site')) {
        response = 'Pour corriger les vulnérabilités XSS (Cross-Site Scripting), vous devriez:<br>1. Valider toutes les entrées utilisateur<br>2. Encoder correctement les sorties HTML<br>3. Utiliser une politique de sécurité du contenu (CSP)<br>4. Implémenter l\'attribut HttpOnly sur les cookies<br>5. Utiliser des frameworks modernes qui échappent automatiquement le contenu';
      }
      else if (lowerMessage.includes('sql') && lowerMessage.includes('injection')) {
        response = 'Pour prévenir les injections SQL:<br>1. Utilisez des requêtes paramétrées ou préparées<br>2. Implémentez un ORM (Object-Relational Mapping)<br>3. Validez et nettoyez toutes les entrées utilisateur<br>4. Appliquez le principe du moindre privilège pour les comptes de base de données<br>5. Utilisez des procédures stockées';
      }
      else if (lowerMessage.includes('différence') && (lowerMessage.includes('rapide') || lowerMessage.includes('approfondie'))) {
        response = 'L\'analyse <strong>Rapide</strong> (2-3 min) détecte les vulnérabilités de base et vérifie les configurations essentielles de sécurité. C\'est idéal pour des vérifications régulières.<br><br>L\'analyse <strong>Approfondie</strong> (5-10 min) utilise notre IA avancée pour une inspection complète, incluant la modélisation prédictive des risques, l\'analyse comportementale et des recommandations détaillées. Recommandée pour les sites critiques ou avant une mise en production.';
      }
      else if (lowerMessage.includes('prix') || lowerMessage.includes('coût') || lowerMessage.includes('tarif')) {
        response = 'WebSecure propose plusieurs forfaits:<br><strong>Gratuit</strong>: 3 analyses rapides par mois<br><strong>Standard</strong>: 59€/mois - analyses illimitées et rapports détaillés<br><strong>Premium</strong>: 129€/mois - tout inclus + monitoring continu et support prioritaire<br><br>Vous pouvez consulter nos tarifs complets sur la page <a href="#">Tarifs</a>.';
      }
      else if (lowerMessage.includes('contact') || lowerMessage.includes('aide') || lowerMessage.includes('support')) {
        response = 'Notre équipe de support est disponible par email à <a href="mailto:support@websecure.ai">support@websecure.ai</a> ou par téléphone au +212 5XX-XXX-XXX du lundi au vendredi, de 9h à 18h.<br><br>Vous pouvez également consulter notre <a href="#">Centre d\'aide</a> pour des réponses aux questions fréquentes.';
      }
      else {
        response = 'Je ne suis pas sûr de comprendre votre question. Pouvez-vous reformuler ou choisir parmi ces sujets:<br>- Comment fonctionne l\'analyse<br>- Les niveaux de risque<br>- Corriger des vulnérabilités spécifiques<br>- Nos forfaits<br>- Contacter le support';
      }
      
      addBotMessage(response);
    }, 1000);
  }
  
  // Add user message to chat
  function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message user';
    messageDiv.textContent = message;
    chatbotMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }
  
  // Add bot message to chat
  function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message bot';
    messageDiv.innerHTML = message;
    chatbotMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }
}

// Show alert message
function showAlert(message, type = 'info') {
  const alertContainer = document.getElementById('alerts');
  if (!alertContainer) return;
  
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  alertContainer.appendChild(alert);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => {
      alert.removeChild(alert);
    }, 150);
  }, 5000);
}