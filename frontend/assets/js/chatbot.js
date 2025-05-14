// Simplified Chatbot functionality for WebSecure - FIXED BUBBLES VERSION

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  
  // Check if all elements exist
  if (!chatbotToggle || !chatbotContainer || !chatbotClose || 
      !chatbotMessages || !chatbotInput || !chatbotSend) {
    console.error('Chatbot: Some elements not found');
    return;
  }
  
  // Variables
  let isOpen = false;
  let isTyping = false;
  
  // Toggle chatbot visibility
  chatbotToggle.addEventListener('click', () => {
    isOpen = !isOpen;
    chatbotContainer.classList.toggle('open', isOpen);
    
    // Add welcome message when first opened
    if (isOpen && chatbotMessages.children.length === 0) {
      addBotMessage('Bonjour! 👋 Je suis l\'assistant WebSecure. Comment puis-je vous aider aujourd\'hui?');
      
      // Show suggestions
      setTimeout(() => {
        showSuggestions([
          "Qu'est-ce que XSS?",
          "Comment prévenir les injections SQL?",
          "En-têtes de sécurité"
        ]);
      }, 500);
    }
  });
  
  // Close chatbot
  chatbotClose.addEventListener('click', () => {
    isOpen = false;
    chatbotContainer.classList.remove('open');
  });
  
  // Send message
  chatbotSend.addEventListener('click', handleUserInput);
  
  // Send message on Enter
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  });
  
  // Process user input
  function handleUserInput() {
    const userInput = chatbotInput.value.trim();
    
    if (userInput.length === 0 || isTyping) return;
    
    // Add user message
    addUserMessage(userInput);
    
    // Clear input
    chatbotInput.value = '';
    
    // Process and respond
    processUserMessage(userInput);
  }
  
  // Add user message bubble
  function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chatbot-message user-message';
    messageElement.innerHTML = `
      <div class="message-content">
        <p>${escapeHtml(message)}</p>
        <div class="message-time">${getCurrentTime()}</div>
      </div>
    `;
    chatbotMessages.appendChild(messageElement);
    scrollToBottom();
  }
  
  // Add bot message bubble
  function addBotMessage(message, withSuggestions = false) {
    // Set typing indicator
    isTyping = true;
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chatbot-message bot-message typing';
    typingIndicator.innerHTML = `
      <div class="avatar">
        <img src="assets/img/logo-icon.svg" alt="WebSecure">
      </div>
      <div class="message-content">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    
    chatbotMessages.appendChild(typingIndicator);
    scrollToBottom();
    
    // After delay, remove typing and add actual message
    setTimeout(() => {
      chatbotMessages.removeChild(typingIndicator);
      
      const messageElement = document.createElement('div');
      messageElement.className = 'chatbot-message bot-message';
      messageElement.innerHTML = `
        <div class="avatar">
          <img src="assets/img/logo-icon.svg" alt="WebSecure">
        </div>
        <div class="message-content">
          <p>${message}</p>
          <div class="message-time">${getCurrentTime()}</div>
        </div>
      `;
      
      chatbotMessages.appendChild(messageElement);
      
      // Add suggestions if needed
      if (withSuggestions) {
        showSuggestions();
      }
      
      scrollToBottom();
      isTyping = false;
    }, 1000);
  }
  
  // Process user message
  function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Simple response logic
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      addBotMessage('Bonjour! Je suis là pour répondre à vos questions sur la sécurité web. Comment puis-je vous aider?', true);
    }
    else if (lowerMessage.includes('xss')) {
      addBotMessage('Le XSS (Cross-Site Scripting) est une vulnérabilité qui permet à un attaquant d\'injecter du code malveillant dans une page web. Pour vous protéger, validez toutes les entrées utilisateur et encodez correctement les sorties.', true);
    }
    else if (lowerMessage.includes('sql')) {
      addBotMessage('L\'injection SQL est une technique d\'attaque qui exploite une vulnérabilité dans la gestion des requêtes SQL. Pour vous protéger, utilisez des requêtes paramétrées et validez toutes les entrées utilisateur.', true);
    }
    else {
      addBotMessage('Je ne suis pas sûr de comprendre votre question. Pouvez-vous reformuler ou choisir parmi les suggestions ci-dessous?', true);
    }
  }
  
  // Show clickable suggestions
  function showSuggestions(suggestions = ['Vulnérabilités XSS', 'Injection SQL', 'En-têtes de sécurité']) {
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'chatbot-suggestions';
    
    suggestions.forEach(suggestion => {
      const button = document.createElement('button');
      button.className = 'chatbot-suggestion';
      button.textContent = suggestion;
      button.addEventListener('click', () => {
        chatbotInput.value = suggestion;
        handleUserInput();
      });
      suggestionsContainer.appendChild(button);
    });
    
    chatbotMessages.appendChild(suggestionsContainer);
    scrollToBottom();
  }
  
  // Helper: Scroll chat to bottom
  function scrollToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }
  
  // Helper: Escape HTML to prevent XSS
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  // Helper: Get current time
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Debug info
  console.log('Chatbot initialized successfully');
});