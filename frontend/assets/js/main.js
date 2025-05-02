// Main functionality for WebSecure

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Initialize UI components
  initUI();
  
  // Setup analyze form
  setupAnalyzeForm();
  
  // Setup scroll animations
  setupScrollAnimations();
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
      showAlert('Please enter a valid URL', 'danger');
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
    
    // Update status text
    const statusText = document.getElementById('statusText');
    const percentageText = document.getElementById('percentageText');
    statusText.textContent = 'Initializing scan...';
    percentageText.textContent = '0%';
    
    try {
      // Simulate progress updates while analysis runs
      const progressInterval = simulateProgressUpdates(progressBar, statusText, percentageText);
      
      // Call the API to analyze the website
      const result = await analyzeWebsite(url, scanType);
      
      // Clear progress interval
      clearInterval(progressInterval);
      
      // Complete the progress bar
      progressBar.style.width = '100%';
      percentageText.textContent = '100%';
      statusText.textContent = 'Analysis complete!';
      
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
      statusText.textContent = `Error: ${error.message || 'Failed to analyze website'}`;
      
      // Add a retry button
      const retryButton = document.createElement('button');
      retryButton.className = 'btn btn-primary mt-3 me-2';
      retryButton.innerHTML = '<i class="fas fa-redo"></i> Retry';
      retryButton.addEventListener('click', () => {
        progressContainer.classList.add('d-none');
        progressBar.classList.add('progress-bar-animated', 'progress-bar-striped');
        progressBar.classList.remove('bg-danger');
      });
      
      progressContainer.appendChild(retryButton);
      
      console.error('Analysis error:', error);
    }
  });
  
  // Cancel scan button
  const cancelButton = document.getElementById('cancelScan');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      const progressContainer = document.getElementById('scanProgress');
      progressContainer.classList.add('d-none');
    });
  }
}

// Simulate progress updates for the analysis
function simulateProgressUpdates(progressBar, statusText, percentageText) {
  let progress = 0;
  const messages = [
    { percent: 5, text: 'Connecting to website...' },
    { percent: 15, text: 'Checking SSL/TLS configuration...' },
    { percent: 25, text: 'Analyzing HTTP headers...' },
    { percent: 35, text: 'Scanning for XSS vulnerabilities...' },
    { percent: 45, text: 'Checking for SQL injection points...' },
    { percent: 55, text: 'Analyzing authentication mechanisms...' },
    { percent: 65, text: 'Inspecting CSRF protections...' },
    { percent: 75, text: 'Checking content security policies...' },
    { percent: 85, text: 'Running anomaly detection algorithms...' },
    { percent: 95, text: 'Generating risk assessment...' }
  ];
  
  let currentMessageIndex = 0;
  
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
  }, 100);
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
      alertContainer.removeChild(alert);
    }, 150);
  }, 5000);
}