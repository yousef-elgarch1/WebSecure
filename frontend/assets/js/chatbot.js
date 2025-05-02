// Chatbot functionality for WebSecure

class SecurityChatbot {
  constructor() {
    this.chatContainer = document.getElementById('chatbot-container');
    this.messagesContainer = document.getElementById('chatbot-messages');
    this.inputField = document.getElementById('chatbot-input');
    this.sendButton = document.getElementById('chatbot-send');
    this.toggleButton = document.getElementById('chatbot-toggle');
    
    this.isOpen = false;
    this.isTyping = false;
    
    // Knowledge base for simple responses
    this.knowledgeBase = {
      'xss': {
        description: 'Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject client-side scripts into web pages viewed by other users.',
        remediation: 'To prevent XSS, always validate and sanitize user input, implement Content Security Policy (CSP), and use proper output encoding.',
        risk: 'High - XSS can lead to session theft, credential theft, and malicious actions performed on behalf of users.'
      },
      'sql injection': {
        description: 'SQL Injection is a code injection technique that exploits vulnerabilities in the interface between web applications and databases.',
        remediation: 'Use parameterized queries or prepared statements, implement input validation, and apply the principle of least privilege for database accounts.',
        risk: 'Critical - SQL Injection can lead to unauthorized data access, data manipulation, and even complete server compromise.'
      },
      'csrf': {
        description: 'Cross-Site Request Forgery (CSRF) tricks users into submitting unwanted requests to websites where they\'re authenticated.',
        remediation: 'Implement anti-CSRF tokens, use SameSite cookie attribute, and verify the Origin/Referer header.',
        risk: 'Medium - CSRF can lead to unauthorized actions performed on behalf of authenticated users.'
      }
    };
    
    this.initEventListeners();
  }
  
  initEventListeners() {
    // Toggle chatbot visibility
    this.toggleButton.addEventListener('click', () => this.toggleChatbot());
    
    // Send message on button click
    this.sendButton.addEventListener('click', () => this.handleUserInput());
    
    // Send message on Enter key
    this.inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleUserInput();
      }
    });
  }
  
  toggleChatbot() {
    this.isOpen = !this.isOpen;
    this.chatContainer.classList.toggle('open', this.isOpen);
    
    if (this.isOpen && this.messagesContainer.children.length === 0) {
      // Add welcome message when first opened
      this.addBotMessage('Bonjour! Je suis l\'assistant de sécurité web WebSecure. Comment puis-je vous aider aujourd\'hui?');
    }
  }
  
  handleUserInput() {
    const userInput = this.inputField.value.trim();
    
    if (userInput.length === 0 || this.isTyping) return;
    
    // Add user message to chat
    this.addUserMessage(userInput);
    
// Clear input field
    this.inputField.value = '';
    
    // Process the message and respond
    this.processUserMessage(userInput);
  }
  
  addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chatbot-message user-message';
    messageElement.innerHTML = `
      <div class="message-content">
        <p>${this.escapeHtml(message)}</p>
      </div>
    `;
    this.messagesContainer.appendChild(messageElement);
    this.scrollToBottom();
  }
  
  addBotMessage(message) {
    // Set typing indicator
    this.isTyping = true;
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chatbot-message bot-message typing';
    typingIndicator.innerHTML = `
      <div class="avatar">
        <img src="/assets/img/logo-icon.svg" alt="WebSecure Bot">
      </div>
      <div class="message-content">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    this.messagesContainer.appendChild(typingIndicator);
    this.scrollToBottom();
    
    // Simulate thinking/typing delay
    setTimeout(() => {
      // Remove typing indicator
      this.messagesContainer.removeChild(typingIndicator);
      
      // Add actual message
      const messageElement = document.createElement('div');
      messageElement.className = 'chatbot-message bot-message';
      messageElement.innerHTML = `
        <div class="avatar">
          <img src="/assets/img/logo-icon.svg" alt="WebSecure Bot">
        </div>
        <div class="message-content">
          <p>${message}</p>
        </div>
      `;
      this.messagesContainer.appendChild(messageElement);
      this.scrollToBottom();
      this.isTyping = false;
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  }
  
  processUserMessage(message) {
    // Convert to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Check if it's a greeting
    if (this.isGreeting(lowerMessage)) {
      this.addBotMessage("Bonjour! Je suis là pour répondre à vos questions sur la sécurité web. Que voulez-vous savoir?");
      return;
    }
    
    // Check if asking for help
    if (this.isAskingForHelp(lowerMessage)) {
      this.showHelpMenu();
      return;
    }
    
    // Check if asking about a known vulnerability
    for (const [key, info] of Object.entries(this.knowledgeBase)) {
      if (lowerMessage.includes(key)) {
        this.addBotMessage(`<strong>${key.toUpperCase()}:</strong> ${info.description}<br><br>
          <strong>Risque:</strong> ${info.risk}<br><br>
          <strong>Remédiation:</strong> ${info.remediation}`);
        return;
      }
    }
    
    // Check if asking about a report
    if (lowerMessage.includes('rapport') || lowerMessage.includes('report')) {
      this.addBotMessage("Vous pouvez générer un rapport complet après l'analyse d'un site web. Les rapports incluent les vulnérabilités détectées, les recommandations de correction, et un score de risque global. Vous pouvez les exporter en HTML ou JSON.");
      return;
    }
    
    // Check if asking about features
    if (lowerMessage.includes('fonctionnalité') || lowerMessage.includes('feature') || lowerMessage.includes('capable')) {
      this.addBotMessage("WebSecure offre plusieurs fonctionnalités:<br>- Analyse des vulnérabilités web<br>- Détection d'anomalies<br>- Génération de rapports détaillés<br>- Recommandations de sécurité<br>- Visualisation des risques<br>- Historique des analyses");
      return;
    }
    
    // Default response for unknown queries
    this.addBotMessage("Je ne suis pas sûr de comprendre votre question. Pourriez-vous reformuler ou choisir parmi ces sujets:<br>- XSS<br>- SQL Injection<br>- CSRF<br>- Rapports<br>- Fonctionnalités");
  }
  
  isGreeting(message) {
    const greetings = ['bonjour', 'salut', 'hello', 'hi', 'hey', 'coucou'];
    return greetings.some(greeting => message.includes(greeting));
  }
  
  isAskingForHelp(message) {
    const helpPhrases = ['aide', 'help', 'comment', 'how', 'que fais-tu', 'what do you do'];
    return helpPhrases.some(phrase => message.includes(phrase));
  }
  
  showHelpMenu() {
    this.addBotMessage(`
      Je peux vous aider avec les sujets suivants:
      <ul>
        <li><strong>Informations sur les vulnérabilités</strong>: Demandez-moi des détails sur XSS, SQL Injection, CSRF, etc.</li>
        <li><strong>Conseils de sécurité</strong>: Comment sécuriser votre site</li>
        <li><strong>Fonctionnalités de WebSecure</strong>: Ce que notre plateforme peut faire</li>
        <li><strong>Utilisation des rapports</strong>: Comment interpréter les résultats</li>
      </ul>
      Que voulez-vous savoir?
    `);
  }
  
  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
  
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Initialize chatbot when page is loaded
document.addEventListener('DOMContentLoaded', () => {
  const chatbot = new SecurityChatbot();
});