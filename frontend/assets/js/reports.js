// Reports functionality for WebSecure

// Initialize the reports page
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the reports page
  const reportsContainer = document.getElementById('reports-container');
  if (!reportsContainer) return;
  
  // Check if there's a report ID in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const reportId = urlParams.get('id');
  
  if (reportId) {
    // Show a specific report
    displayReportDetail(reportId);
  } else {
    // List all reports
    listReports();
  }
  
  // Initialize chatbot if function exists
  if (typeof initChatbot === 'function') {
    initChatbot();
  }
});

// List all reports
async function listReports() {
  const container = document.getElementById('reports-container');
  if (!container) return;
  
  try {
    console.log('Fetching all reports...');
    
    const reports = await getReports();
    
    if (!reports || reports.length === 0) {
      container.innerHTML = `
        <div class="text-center py-5">
          <div class="empty-state">
            <i class="fas fa-file-alt empty-state-icon"></i>
            <h3>Aucun rapport disponible</h3>
            <p>Vous n'avez pas encore effectué d'analyse de sécurité.</p>
            <a href="index.html#analyze" class="btn btn-primary mt-3">
              <i class="fas fa-search me-2"></i>Analyser un site
            </a>
          </div>
        </div>
      `;
      return;
    }
    
    console.log(`Found ${reports.length} reports`);
    
    // Sort reports by date (most recent first)
    reports.sort((a, b) => {
      return new Date(b.scan_date) - new Date(a.scan_date);
    });
    
    let reportsList = `
      <div class="row mb-4">
        <div class="col-md-6">
          <h4>${reports.length} rapport(s) trouvé(s)</h4>
        </div>
        <div class="col-md-6">
          <div class="d-flex justify-content-md-end mb-3">
            <div class="input-group" style="max-width: 300px;">
              <input type="text" id="reportSearch" class="form-control" placeholder="Rechercher un rapport...">
              <button class="btn btn-outline-secondary" type="button">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="report-cards">
    `;
    
    // Add each report card
    reports.forEach(report => {
      const riskLevelClass = getRiskLevelClass(report.risk_level);
      const dateFormatted = formatDate(report.scan_date);
      
      reportsList += `
        <div class="card report-card mb-3">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-6">
                <h5 class="mb-1">
                  <a href="reports.html?id=${report.id}" class="report-title">
                    ${report.url}
                  </a>
                </h5>
                <p class="text-muted mb-2">
                  <i class="fas fa-calendar-alt me-1"></i> ${dateFormatted}
                </p>
              </div>
              <div class="col-md-4">
                <div class="risk-indicator ${riskLevelClass}">
                  <span class="risk-level">${report.risk_level}</span>
                  <div class="progress">
                    <div class="progress-bar bg-${riskLevelClass}" 
                         role="progressbar" 
                         style="width: ${report.risk_score}%" 
                         aria-valuenow="${report.risk_score}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                      ${report.risk_score}%
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-2 text-md-end mt-3 mt-md-0">
                <a href="reports.html?id=${report.id}" class="btn btn-primary btn-sm">
                  <i class="fas fa-eye me-1"></i> Voir
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    
    reportsList += '</div>';
    container.innerHTML = reportsList;
    
    // Add search functionality
    const searchInput = document.getElementById('reportSearch');
    if (searchInput) {
      searchInput.addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        const reportCards = document.querySelectorAll('.report-card');
        
        reportCards.forEach(card => {
          const url = card.querySelector('.report-title').textContent.toLowerCase();
          if (url.includes(searchTerm)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }
    
  } catch (error) {
    console.error('Error listing reports:', error);
    container.innerHTML = `
      <div class="alert alert-danger">
        <h4 class="alert-heading">Erreur lors du chargement des rapports</h4>
        <p>${error.message || 'Une erreur est survenue lors de la récupération des rapports.'}</p>
        <hr>
        <p class="mb-0">Veuillez réessayer ultérieurement ou contacter le support technique.</p>
      </div>
    `;
  }
}

// Display a specific report
async function displayReportDetail(reportId) {
  try {
    console.log(`Loading report details for ID: ${reportId}`);
    const container = document.getElementById('reports-container');
    
    // Show loading state
    container.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-3">Chargement du rapport...</p>
      </div>
    `;
    
    // Get the report data
    const report = await getReportById(reportId);
    
    console.log("Retrieved report data:", report);
    
    // Verify essential data is present
    if (!report.url || !report.scan_date) {
      throw new Error("Données du rapport incomplètes");
    }
    
    // Build the report HTML
    let reportHtml = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Rapport de sécurité</h2>
        <div class="report-actions">
          <button class="btn btn-outline-secondary me-2" onclick="window.history.back()">
            <i class="fas fa-arrow-left"></i> Retour
          </button>
          <div class="dropdown d-inline-block">
            <button class="btn btn-primary dropdown-toggle" type="button" id="exportDropdown" data-bs-toggle="dropdown">
              Exporter
            </button>
            <ul class="dropdown-menu" aria-labelledby="exportDropdown">
  <li><a class="dropdown-item" href="#" onclick="exportReportToPDF('${reportId}')">Rapport PDF</a></li>
  <li><a class="dropdown-item" href="#" onclick="downloadJSON('${reportId}')">Données JSON</a></li>
</ul>

          </div>
        </div>
      </div>
    `;
    
    // Add website info section
    if (report.website_info) {
      reportHtml += `
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="d-flex align-items-center mb-3">
      `;
      
      if (report.website_info.logo_url) {
        reportHtml += `
          <div class="me-3">
            <img src="${report.website_info.logo_url}" alt="Logo du site" style="max-height: 80px; max-width: 150px;"
                onerror="this.onerror=null; this.src='assets/img/cnss.png'; this.alt='Logo non disponible';">
          </div>
        `;
      }
      
      reportHtml += `
                  <div>
                    <h4>${report.website_info.name || report.url}</h4>
                    <p class="text-muted mb-0">${report.url}</p>
                  </div>
                </div>
                
                <div class="mb-3">
                  <h5><i class="fas fa-calendar"></i> Date d'analyse</h5>
                  <p>${formatDate(report.scan_date)}</p>
                </div>
      `;
      
      // Show domain creation date if available
      if (report.website_info.domain_info && report.website_info.domain_info.registration_date) {
        reportHtml += `
                <div class="mb-3">
                  <h5><i class="fas fa-history"></i> Date de création du domaine</h5>
                  <p>${report.website_info.domain_info.registration_date}</p>
                </div>
        `;
      }
      
      reportHtml += `
              </div>
              <div class="col-md-6">
                <div class="risk-indicator ${getRiskLevelClass(report.risk_level)}">
                  <h5><i class="fas fa-shield-alt"></i> Évaluation des risques</h5>
                  <span class="risk-level">${report.risk_level}</span>
                  <div class="progress">
                    <div class="progress-bar bg-${getRiskLevelClass(report.risk_level)}"
                         role="progressbar" style="width: ${report.risk_score}%"
                         aria-valuenow="${report.risk_score}" aria-valuemin="0" aria-valuemax="100">
                      ${report.risk_score}%
                    </div>
                  </div>
                </div>
                
                <div class="mt-3">
                  <h5><i class="fas fa-bug"></i> Vulnérabilités détectées</h5>
                  <span class="badge bg-${getBadgeClass(report.vulnerability_count)}">
                    ${report.vulnerability_count} vulnérabilités
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Technologies used section
      if (report.website_info.technologies && report.website_info.technologies.length > 0) {
        reportHtml += `
          <div class="card mb-4">
            <div class="card-header">
              <h4><i class="fas fa-laptop-code"></i> Technologies détectées</h4>
            </div>
            <div class="card-body">
              <div class="tech-tags">
        `;
        
        report.website_info.technologies.forEach(tech => {
          reportHtml += `<span class="badge bg-secondary me-2 mb-2">${tech}</span>`;
        });
        
        reportHtml += `
              </div>
            </div>
          </div>
        `;
      }
      
      // Description section if available
      if (report.website_info.description) {
        reportHtml += `
          <div class="card mb-4">
            <div class="card-header">
              <h4><i class="fas fa-info-circle"></i> Description du site</h4>
            </div>
            <div class="card-body">
              <p>${report.website_info.description}</p>
            </div>
          </div>
        `;
      }
    } else {
      // Basic info if website_info is not available
      reportHtml += `
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h4><i class="fas fa-globe"></i> URL</h4>
                <p class="report-url">${report.url}</p>
                <h4><i class="fas fa-calendar"></i> Date d'analyse</h4>
                <p>${formatDate(report.scan_date)}</p>
              </div>
              <div class="col-md-6">
                <h4><i class="fas fa-shield-alt"></i> Évaluation des risques</h4>
                <div class="risk-indicator ${getRiskLevelClass(report.risk_level)}">
                  <span class="risk-level">${report.risk_level}</span>
                  <div class="progress">
                    <div class="progress-bar bg-${getRiskLevelClass(report.risk_level)}"
                         role="progressbar" style="width: ${report.risk_score}%"
                         aria-valuenow="${report.risk_score}" aria-valuemin="0" aria-valuemax="100">
                      ${report.risk_score}%
                    </div>
                  </div>
                </div>
                <div class="mt-3">
                  <h4><i class="fas fa-bug"></i> Vulnérabilités détectées</h4>
                  <span class="badge bg-${getBadgeClass(report.vulnerability_count)}">
                    ${report.vulnerability_count} vulnérabilités
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    // Risk prediction section
    if (report.probability) {
      reportHtml += `
        <div class="card mb-4">
          <div class="card-header">
            <h4><i class="fas fa-chart-line"></i> Prédiction de risque</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h5>Probabilité par niveau de risque</h5>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Niveau</th>
                        <th>Probabilité</th>
                      </tr>
                    </thead>
                    <tbody>
      `;
      
      for (const [level, probability] of Object.entries(report.probability)) {
        reportHtml += `
          <tr>
            <td><span class="badge bg-${getRiskLevelClass(level)}">${level}</span></td>
            <td>${Math.round(probability * 100)}%</td>
          </tr>
        `;
      }
      
      reportHtml += `
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="col-md-6">
                <h5>Risque futur estimé</h5>
                <div class="display-4 text-center">${report.future_risk ? report.future_risk.toFixed(1) : 'N/A'}/10</div>
                <div class="text-muted text-center">Score estimé sur les 6 prochains mois</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    // Vulnerabilities section
    if (report.vulnerabilities && report.vulnerabilities.length > 0) {
      reportHtml += `
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h4><i class="fas fa-bug"></i> Vulnérabilités détectées (${report.vulnerability_count})</h4>
            <button class="btn btn-sm btn-outline-primary" id="toggleVulnerabilities">
              <i class="fas fa-expand-alt"></i> Tout afficher
            </button>
          </div>
          <div class="card-body">
            <div class="vulnerability-list">
      `;
      
      // Add each vulnerability
      report.vulnerabilities.forEach((vuln, index) => {
        const isCollapsed = index > 0 ? 'collapsed' : '';
        const isShow = index > 0 ? '' : 'show';
        
        reportHtml += `
          <div class="card mb-3 vulnerability-card ${getSeverityCardClass(vuln.severity)}">
            <div class="card-header d-flex justify-content-between align-items-center" 
                 data-bs-toggle="collapse" data-bs-target="#vuln-${index}" aria-expanded="${index === 0 ? 'true' : 'false'}">
              <h5 class="mb-0">${vuln.name}</h5>
              <div>
                <span class="badge bg-${getSeverityClass(vuln.severity)}">${vuln.severity}</span>
                <i class="fas fa-chevron-down ms-2 collapse-icon"></i>
              </div>
            </div>
            <div id="vuln-${index}" class="collapse ${isShow}">
              <div class="card-body">
                <p>${vuln.description}</p>
              </div>
            </div>
          </div>
        `;
      });
      
      reportHtml += `
            </div>
          </div>
        </div>
      `;
    }
    

        // Attack history section
    if (report.attack_history && report.attack_history.length > 0) {
        reportHtml += renderAttackHistory(report.attack_history);
    }
    // Recommendations section
    if (report.recommendations && report.recommendations.length > 0) {
      reportHtml += `
        <div class="card mb-4">
          <div class="card-header">
            <h4><i class="fas fa-clipboard-check"></i> Recommandations</h4>
          </div>
          <div class="card-body">
            <div class="recommendation-list accordion" id="recommendationsAccordion">
      `;
      
      // Add each recommendation
      report.recommendations.forEach((rec, index) => {
        reportHtml += `
          <div class="card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center" 
                 data-bs-toggle="collapse" data-bs-target="#rec-${index}" aria-expanded="${index === 0 ? 'true' : 'false'}">
              <h5 class="mb-0">${rec.title}</h5>
              <div>
                <span class="badge bg-${getPriorityClass(rec.priority)}">Priorité: ${rec.priority}</span>
                <i class="fas fa-chevron-down ms-2 collapse-icon"></i>
              </div>
            </div>
            <div id="rec-${index}" class="collapse ${index === 0 ? 'show' : ''}">
              <div class="card-body">
                <p>${rec.description}</p>
                <div class="text-end">
                  <button class="btn btn-sm btn-outline-primary copy-recommendation" data-recommendation="${encodeURIComponent(rec.title + ': ' + rec.description)}">
                    <i class="fas fa-copy me-1"></i> Copier
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      });
      
      reportHtml += `
            </div>
          </div>
        </div>
      `;
    }
    
    // Security headers section
    if (report.security_headers) {
      reportHtml += `
        <div class="card mb-4">
          <div class="card-header">
            <h4><i class="fas fa-shield-alt"></i> En-têtes de sécurité</h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>En-tête</th>
                    <th>Statut</th>
                    <th>Importance</th>
                  </tr>
                </thead>
                <tbody>
      `;
      
      // Define header importance
      const headerImportance = {
        'Content-Security-Policy': 'Haute',
        'X-Frame-Options': 'Moyenne',
        'X-XSS-Protection': 'Moyenne',
        'X-Content-Type-Options': 'Moyenne',
        'Strict-Transport-Security': 'Haute',
        'Referrer-Policy': 'Basse'
      };
      
      // Add each security header
      for (const [header, value] of Object.entries(report.security_headers)) {
        if (header !== 'score') {
          const importance = headerImportance[header] || 'Moyenne';
          const importanceClass = importance === 'Haute' ? 'danger' : (importance === 'Moyenne' ? 'warning' : 'info');
          
          reportHtml += `
            <tr>
              <td>${header}</td>
              <td>
                ${value
                  ? `<span class="badge bg-success">Présent</span>`
                  : `<span class="badge bg-danger">Manquant</span>`}
              </td>
              <td>
                <span class="badge bg-${importanceClass}">${importance}</span>
              </td>
            </tr>
          `;
        }
      }
      
      reportHtml += `
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }
    
    // SSL/TLS section
    if (report.ssl_info) {
      reportHtml += `
        <div class="card mb-4">
          <div class="card-header">
            <h4><i class="fas fa-lock"></i> Configuration SSL/TLS</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <p><strong>SSL/TLS activé:</strong>
                  <span class="badge bg-${report.ssl_info.has_ssl ? 'success' : 'danger'}">
                    ${report.ssl_info.has_ssl ? 'Oui' : 'Non'}
                  </span>
                </p>
                <p><strong>Certificat valide:</strong>
                  <span class="badge bg-${report.ssl_info.certificate_valid ? 'success' : 'danger'}">
                    ${report.ssl_info.certificate_valid ? 'Oui' : 'Non'}
                  </span>
                </p>
              </div>
              <div class="col-md-6">
                <p><strong>Date d'expiration:</strong> ${report.ssl_info.certificate_expiry || 'N/A'}</p>
                <p><strong>Protocole:</strong> ${report.ssl_info.protocol_version || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Add the Export to PDF functionality
    reportHtml += `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Rapport de sécurité</h2>
        <div class="report-actions">
          <button class="btn btn-outline-secondary me-2" onclick="window.history.back()">
            <i class="fas fa-arrow-left"></i> Retour
          </button>
          <div class="dropdown d-inline-block">
            <button class="btn btn-primary dropdown-toggle" type="button" id="exportDropdown" data-bs-toggle="dropdown">
              Exporter
            </button>
            <ul class="dropdown-menu" aria-labelledby="exportDropdown">
              <li><a class="dropdown-item" href="#" onclick="exportReportToPDF('${reportId}')">Rapport PDF</a></li>
            </ul>
          </div>
        </div>
      </div>
    `;

    // Display the complete report
    container.innerHTML = reportHtml;

    // Add event listener for 'Toggle All Vulnerabilities' button
    const toggleButton = document.getElementById('toggleVulnerabilities');
    if (toggleButton) {
      toggleButton.addEventListener('click', function() {
        const vulnerabilityCards = document.querySelectorAll('.vulnerability-card .collapse');
        const isAllShown = Array.from(vulnerabilityCards).every(card => card.classList.contains('show'));
        
        vulnerabilityCards.forEach(card => {
          if (isAllShown) {
            card.classList.remove('show');
          } else {
            card.classList.add('show');
          }
        });
        
        // Update button text
        this.innerHTML = isAllShown 
          ? '<i class="fas fa-expand-alt"></i> Tout afficher' 
          : '<i class="fas fa-compress-alt"></i> Tout réduire';
      });
    }
    



    // Add event listeners for copy recommendation buttons
    const copyButtons = document.querySelectorAll('.copy-recommendation');
    copyButtons.forEach(button => {
      button.addEventListener('click', function() {
        const recommendation = decodeURIComponent(this.getAttribute('data-recommendation'));
        
        // Copy to clipboard
        navigator.clipboard.writeText(recommendation)
          .then(() => {
            // Change button text temporarily
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check me-1"></i> Copié!';
            
            // Reset button text after 2 seconds
            setTimeout(() => {
              this.innerHTML = originalText;
            }, 2000);
          })
          .catch(err => {
            console.error('Error copying text: ', err);
            showAlert('Erreur lors de la copie du texte', 'danger');
          });
      });
    });

  } catch (error) {
    console.error('Error in displayReportDetail:', error);
    const container = document.getElementById('reports-container');
    container.innerHTML = `
      <div class="alert alert-danger">
        <h4 class="alert-heading">Erreur lors du chargement du rapport</h4>
        <p>${error.message}</p>
        <hr>
        <p class="mb-0">Veuillez réessayer ou contacter le support technique.</p>
        <button class="btn btn-outline-secondary mt-3" onclick="window.history.back()">
          <i class="fas fa-arrow-left"></i> Retour aux rapports
        </button>
      </div>
    `;
  }
}

function exportReportToPDF(reportId) {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Retrieved report data
    const report = {
      id: 'rep001',
      url: 'https://www.cnss.ma',
      scan_date: '2025-04-25T14:30:00',
      risk_level: 'Important',
      risk_score: 68,
      vulnerability_count: 6,
      vulnerabilities: [
        { name: 'Cross-Site Scripting (XSS)', severity: 'Important', description: 'Plusieurs points d\'entrée XSS détectés...' },
        { name: 'En-têtes de sécurité insuffisants', severity: 'Modéré', description: 'Absence de Content-Security-Policy...' },
        { name: 'Version PHP obsolète', severity: 'Important', description: 'Le serveur utilise PHP 5.6, obsolète...' },
        { name: 'Exposition d\'informations sensibles', severity: 'Modéré', description: 'Les messages d\'erreur exposent des informations...' },
        { name: 'Politique de cookies non sécurisée', severity: 'Modéré', description: 'Cookies de session non sécurisés...' },
        { name: 'Point de faiblesse CSRF', severity: 'Important', description: 'Absence de protection CSRF sur les formulaires...' }
      ],
      attack_history: [
        { date: '2024-11-15', type: 'Tentative d\'injection XSS', severity: 'Modéré', description: 'Tentative d\'injection de JavaScript...' },
        { date: '2023-07-22', type: 'Attaque par force brute', severity: 'Important', description: 'Tentative d\'accès par force brute...' },
        { date: '2022-05-10', type: 'Exploit de vulnérabilité PHP', severity: 'Critique', description: 'Exploit réussi d\'une vulnérabilité PHP...' }
      ],
      website_info: {
        name: 'Caisse Nationale de Sécurité Sociale',
        logo_url: 'assets/img/cnss.png', // Website logo path
        description: 'Site officiel de la CNSS du Maroc...',
        domain_info: { registration_date: '2004-07-12' },
        technologies: ['PHP', 'jQuery', 'Bootstrap', 'MySQL', 'Apache', 'WordPress']
      },
      security_headers: {
        'Content-Security-Policy': false,
        'X-Frame-Options': true,
        'X-XSS-Protection': true,
        'X-Content-Type-Options': true,
        'Strict-Transport-Security': false,
        'Referrer-Policy': false,
        score: 3
      },
      ssl_info: {
        has_ssl: true,
        certificate_valid: true,
        certificate_expiry: '2025-09-15',
        protocol_version: 'TLSv1.2'
      },
      recommendations: [
        { title: 'Mettre à jour PHP vers la dernière version stable', priority: 'Haute', description: 'Mettre à jour PHP vers une version supportée...' },
        { title: 'Implémenter une protection XSS complète', priority: 'Haute', description: 'Mettre en place un filtrage des entrées utilisateur...' },
        { title: 'Ajouter les en-têtes de sécurité manquants', priority: 'Moyenne', description: 'Configurer le serveur web pour inclure tous les en-têtes...' },
        { title: 'Configurer correctement les cookies de session', priority: 'Moyenne', description: 'Ajouter les attributs HttpOnly et Secure...' },
        { title: 'Implémenter des jetons CSRF', priority: 'Haute', description: 'Ajouter des jetons CSRF à tous les formulaires...' },
        { title: 'Configurer un traitement d\'erreur sécurisé', priority: 'Moyenne', description: 'Mettre en place un système de gestion des erreurs sécurisé...' }
      ],
      probability: { 'Faible': 0.10, 'Modéré': 0.35, 'Important': 0.45, 'Critique': 0.10 },
      future_risk: 7.2
    };

    // Add WebSecure Logo (company logo)
    const webSecureLogo = 'assets/img/logo.png'; // Path to your company logo
    doc.addImage(webSecureLogo, 'SVG', 10, 10, 40, 20); // Position it at the top left

    // Add Title
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102); // Dark blue color for title
    doc.text('Rapport de Sécurité', 60, 20); // Adjust position after the logo

    // Add Website Info and Logo with containers
    const websiteLogo = report.website_info.logo_url; // Website logo path
    doc.addImage(websiteLogo, 'PNG', 10, 40, 40, 20); // Website logo

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color for text
    doc.text('Site Web: ' + report.website_info.name, 60, 40);
    doc.text('URL: ' + report.url, 60, 50);
    doc.text('Date d\'analyse: ' + formatDate(report.scan_date), 60, 60);
    doc.text('Technologies utilisées: ' + report.website_info.technologies.join(', '), 60, 70);
    doc.text('Date d\'enregistrement du domaine: ' + report.website_info.domain_info.registration_date, 60, 80);

    // Draw box around Website Info Section
    doc.setDrawColor(0, 0, 0); // Black color for border
    doc.setLineWidth(0.5);
    doc.rect(5, 35, 200, 60); // Draw a box around the Website Info section

    // Risk Section with Box
    doc.setFontSize(14);
    doc.setTextColor(255, 69, 0); // Orange color for risk section
    doc.text('Niveau de risque: ' + report.risk_level, 10, 90);
    doc.text('Score de risque: ' + report.risk_score + '%', 10, 100);

    // Draw box around Risk Section
    doc.setDrawColor(255, 69, 0); // Orange color for border
    doc.setLineWidth(0.5);
    doc.rect(5, 85, 200, 30); // Draw a box around the Risk Section

    // Vulnerabilities Section with Box
    doc.setFontSize(12);
    doc.setTextColor(0, 102, 204); // Blue color for vulnerabilities section
    doc.text('Vulnérabilités détectées:', 10, 110);
    let yOffset = 120;
    report.vulnerabilities.forEach(vuln => {
      doc.text(vuln.name + ' (' + vuln.severity + ')', 10, yOffset);
      doc.text(vuln.description, 20, yOffset + 5);
      yOffset += 10;
    });

    // Draw box around Vulnerabilities Section
    doc.setDrawColor(0, 102, 204); // Blue color for border
    doc.setLineWidth(0.5);
    doc.rect(5, 105, 200, yOffset - 105); // Draw a box around the Vulnerabilities Section

    // Attack History Section with Box
    doc.setFontSize(12);
    doc.setTextColor(0, 128, 0); // Green color for attack history
    doc.text('Historique des attaques:', 10, yOffset + 10);
    yOffset += 15;
    report.attack_history.forEach(attack => {
      doc.text(attack.type + ' (' + attack.severity + ') - ' + attack.date, 10, yOffset);
      doc.text(attack.description, 20, yOffset + 5);
      yOffset += 10;
    });

    // Draw box around Attack History Section
    doc.setDrawColor(0, 128, 0); // Green color for border
    doc.setLineWidth(0.5);
    doc.rect(5, yOffset - 10, 200, 40); // Draw a box around the Attack History Section

    // Recommendations Section with Box
    doc.setFontSize(12);
    doc.setTextColor(255, 0, 0); // Red color for recommendations section
    doc.text('Recommandations:', 10, yOffset + 10);
    yOffset += 15;
    report.recommendations.forEach(rec => {
      doc.text(rec.title + ' (' + rec.priority + ')', 10, yOffset);
      doc.text(rec.description, 20, yOffset + 5);
      yOffset += 10;
    });

    // Draw box around Recommendations Section
    doc.setDrawColor(255, 0, 0); // Red color for border
    doc.setLineWidth(0.5);
    doc.rect(5, yOffset - 10, 200, 40); // Draw a box around the Recommendations Section

    // Signature Section with Box
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color for signature
    doc.text('Signé par:', 10, yOffset + 10);
    yOffset += 10;
    doc.text('Youssef ELGARCH et Nisrine IBNOU-KADY', 10, yOffset);

    // Draw box around Signature Section
    doc.setDrawColor(0, 0, 0); // Black color for border
    doc.setLineWidth(0.5);
    doc.rect(5, yOffset - 10, 200, 30); // Draw a box around the Signature Section

    // Footer Section
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128); // Gray color for footer
    doc.text('© 2025 WebSecure. Tous droits réservés.', 10, yOffset + 20);

    // Save PDF
    doc.save(`rapport_securite_${reportId}.pdf`);
    
  } catch (error) {
    console.error('Error exporting report to PDF:', error);
    showAlert(`Erreur lors de l'exportation du PDF: ${error.message}`, 'danger');
  }
}


// Helper function to format date
function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (e) {
    return dateStr;
  }
}





async function downloadJSON(reportId) {
  try {
    const report = await getReportById(reportId);
    
    if (!report) {
      console.error('No report data found for this ID');
      showAlert('Aucun rapport trouvé', 'danger');
      return;
    }

    // Log the report to check the structure
    console.log('Report Data:', report);
    
    // Create a Blob from the JSON data
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });

    // Create a link to download the Blob
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `report_${reportId}.json`;

    // Trigger the download
    link.click();

  } catch (error) {
    console.error('Error downloading JSON:', error);
    showAlert(`Erreur lors du téléchargement du JSON: ${error.message}`, 'danger');
  }
}




// Helper function to get risk level class
function getRiskLevelClass(level) {
  level = level?.toLowerCase();
  switch(level) {
    case 'critique':
    case 'critical':
      return 'danger';
    case 'important':
    case 'high':
      return 'warning';
    case 'modéré':
    case 'moderate':
    case 'medium':
      return 'info';
    case 'faible':
    case 'low':
      return 'success';
    default:
      return 'secondary';
  }
}

// Helper function to get badge class for vulnerability count
function getBadgeClass(count) {
  if (count === 0) return 'success';
  if (count <= 2) return 'info';
  if (count <= 5) return 'warning';
  return 'danger';
}

// Helper function to get severity class
function getSeverityClass(severity) {
  severity = severity?.toLowerCase();
  switch(severity) {
    case 'critique':
    case 'critical':
      return 'danger';
    case 'important':
    case 'high':
      return 'warning';
    case 'modéré':
    case 'moderate':
    case 'medium':
      return 'info';
    case 'faible':
    case 'low':
      return 'success';
    default:
      return 'secondary';
  }
}

// Helper function to get severity card class
function getSeverityCardClass(severity) {
  severity = severity?.toLowerCase();
  switch(severity) {
    case 'critique':
    case 'critical':
      return 'border-danger';
    case 'important':
    case 'high':
      return 'border-warning';
    case 'modéré':
    case 'moderate':
    case 'medium':
      return 'border-info';
    case 'faible':
    case 'low':
      return 'border-success';
    default:
      return '';
  }
}

// Helper function to get priority class
function getPriorityClass(priority) {
  priority = priority?.toLowerCase();
  switch(priority) {
    case 'critique':
    case 'critical':
    case 'haute':
    case 'high':
      return 'danger';
    case 'moyenne':
    case 'medium':
      return 'warning';
    case 'basse':
    case 'low':
      return 'info';
    default:
      return 'secondary';
  }
}

// Format date
function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (e) {
    return dateStr;
  }
}

// Show alert message
function showAlert(message, type = 'info') {
  const alertContainer = document.getElementById('report-alerts');
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
      if (alertContainer.contains(alert)) {
        alertContainer.removeChild(alert);
      }
    }, 150);
  }, 5000);
}


// Function to render attack history section
function renderAttackHistory(attackHistory) {
  if (!attackHistory || attackHistory.length === 0) {
    return '';
  }
  
  // Sort attacks by date (most recent first)
  const sortedAttacks = [...attackHistory].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  let html = `
    <div class="card mb-4">
      <div class="card-header">
        <h4><i class="fas fa-history"></i> Historique des attaques</h4>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Sévérité</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
  `;
  
  sortedAttacks.forEach(attack => {
    const severityClass = getSeverityClass(attack.severity);
    const dateFormatted = formatDate(attack.date);
    
    html += `
      <tr>
        <td>${dateFormatted}</td>
        <td><strong>${attack.type}</strong></td>
        <td><span class="badge bg-${severityClass}">${attack.severity}</span></td>
        <td>${attack.description}</td>
      </tr>
    `;
  });
  
  html += `
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  return html;
}