// Dashboard functionality for WebSecure

// Initialize the dashboard
async function initDashboard() {
  try {
    // Fetch reports for dashboard statistics
    const reports = await getReports();
    
    if (reports && reports.length > 0) {
      // Render key metrics
      renderSecurityMetrics(reports);
      
      // Render attack statistics
      renderAttackStatistics(reports);
      
      // Create vulnerability distribution chart
      renderVulnerabilityDistributionChart(reports);
      
      // Render risk level distribution
      renderRiskLevelDistribution(reports);
      
      // Render recent scans
      renderRecentScans(reports.slice(0, 5));
    } else {
      document.getElementById('dashboard-metrics').innerHTML = 
        '<div class="empty-state">Aucune donnée d\'analyse disponible. <a href="index.html#analyze">Commencer une analyse</a></div>';
    }
  } catch (error) {
    console.error('Error initializing dashboard:', error);
    showErrorMessage('Échec du chargement des données du dashboard');
  }
}

// Render security metrics
function renderSecurityMetrics(reports) {
  const totalScans = reports.length;
  const criticalIssues = reports.filter(r => r.risk_level === 'Critique').length;
  const avgRiskScore = reports.reduce((acc, r) => acc + r.risk_score, 0) / totalScans;
  
  document.getElementById('metric-total-scans').textContent = totalScans;
  document.getElementById('metric-critical-issues').textContent = criticalIssues;
  document.getElementById('metric-avg-risk').textContent = avgRiskScore.toFixed(1) + '%';
}

// Render attack statistics
function renderAttackStatistics(reports) {
  // Get attack history from all reports
  const allAttacks = [];
  reports.forEach(report => {
    if (report.attack_history && report.attack_history.length) {
      report.attack_history.forEach(attack => {
        allAttacks.push({
          date: new Date(attack.date),
          severity: attack.severity,
          type: attack.type,
          website: report.website_info.name
        });
      });
    }
  });
  
  // Sort attacks by date
  allAttacks.sort((a, b) => a.date - b.date);
  
  // Group attacks by month
  const monthlyAttacks = {};
  const criticalByMonth = {};
  const importantByMonth = {};
  const modereByMonth = {};
  const faibleByMonth = {};
  
  allAttacks.forEach(attack => {
    const monthYear = `${attack.date.getMonth() + 1}/${attack.date.getFullYear()}`;
    
    if (!monthlyAttacks[monthYear]) {
      monthlyAttacks[monthYear] = 0;
      criticalByMonth[monthYear] = 0;
      importantByMonth[monthYear] = 0;
      modereByMonth[monthYear] = 0;
      faibleByMonth[monthYear] = 0;
    }
    
    monthlyAttacks[monthYear]++;
    
    // Count by severity
    if (attack.severity === 'Critique') {
      criticalByMonth[monthYear]++;
    } else if (attack.severity === 'Important') {
      importantByMonth[monthYear]++;
    } else if (attack.severity === 'Modéré') {
      modereByMonth[monthYear]++;
    } else if (attack.severity === 'Faible') {
      faibleByMonth[monthYear]++;
    }
  });
  
  // Get last 6 months
  const labels = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(now.getMonth() - i);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    labels.push(monthYear);
    
    // Ensure we have data for each month
    if (!monthlyAttacks[monthYear]) {
      monthlyAttacks[monthYear] = 0;
      criticalByMonth[monthYear] = 0;
      importantByMonth[monthYear] = 0;
      modereByMonth[monthYear] = 0;
      faibleByMonth[monthYear] = 0;
    }
  }
  
  // Prepare data for chart
  const criticalData = labels.map(month => criticalByMonth[month] || 0);
  const importantData = labels.map(month => importantByMonth[month] || 0);
  const modereData = labels.map(month => modereByMonth[month] || 0);
  const faibleData = labels.map(month => faibleByMonth[month] || 0);
  
  // Create chart
  const ctx = document.getElementById('attacks-chart').getContext('2d');
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Critique',
          data: criticalData,
          backgroundColor: 'rgba(220, 53, 69, 0.7)',
          borderColor: 'rgba(220, 53, 69, 1)',
          borderWidth: 1
        },
        {
          label: 'Important',
          data: importantData,
          backgroundColor: 'rgba(255, 193, 7, 0.7)',
          borderColor: 'rgba(255, 193, 7, 1)',
          borderWidth: 1
        },
        {
          label: 'Modéré',
          data: modereData,
          backgroundColor: 'rgba(23, 162, 184, 0.7)',
          borderColor: 'rgba(23, 162, 184, 1)',
          borderWidth: 1
        },
        {
          label: 'Faible',
          data: faibleData,
          backgroundColor: 'rgba(40, 167, 69, 0.7)',
          borderColor: 'rgba(40, 167, 69, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Mois'
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Nombre d\'attaques'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Historique d\'attaques par sévérité'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      }
    }
  });
}

// Render vulnerability distribution chart
function renderVulnerabilityDistributionChart(reports) {
  // Get the canvas element
  const ctx = document.getElementById('vulnerability-chart').getContext('2d');
  
  // Aggregate vulnerability types across reports
  const vulnerabilityTypes = {};
  
  reports.forEach(report => {
    if (report.vulnerabilities) {
      report.vulnerabilities.forEach(vuln => {
        const name = vuln.name;
        if (!vulnerabilityTypes[name]) {
          vulnerabilityTypes[name] = 0;
        }
        vulnerabilityTypes[name]++;
      });
    }
  });
  
  // Sort vulnerabilities by frequency
  const sortedEntries = Object.entries(vulnerabilityTypes).sort((a, b) => b[1] - a[1]);
  
  // Take top 10 vulnerabilities
  const topVulnerabilities = sortedEntries.slice(0, 10);
  
  // Convert to arrays for Chart.js
  const labels = topVulnerabilities.map(entry => entry[0]);
  const data = topVulnerabilities.map(entry => entry[1]);
  
  // Create chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Occurrence',
        data: data,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true, // Change this to true
      aspectRatio: 2, // Add this line to control the aspect ratio
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Fréquence'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Type de Vulnérabilité'
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Distribution des Types de Vulnérabilités'
        },
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            title: function(tooltipItems) {
              // Truncate long vulnerability names in tooltip title
              const title = tooltipItems[0].label;
              return title.length > 50 ? title.substring(0, 47) + '...' : title;
            }
          }
        }
      }
    }
  });
}

// Render risk level distribution
function renderRiskLevelDistribution(reports) {
  const ctx = document.getElementById('risk-distribution-chart').getContext('2d');
  
  // Count reports by risk level
  const riskLevels = {
    'Faible': 0,
    'Modéré': 0,
    'Important': 0,
    'Critique': 0
  };
  
  reports.forEach(report => {
    if (riskLevels.hasOwnProperty(report.risk_level)) {
      riskLevels[report.risk_level]++;
    }
  });
  
  // Create chart
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(riskLevels),
      datasets: [{
        data: Object.values(riskLevels),
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',  // Faible - green
          'rgba(255, 205, 86, 0.7)',  // Modéré - yellow
          'rgba(255, 159, 64, 0.7)',  // Important - orange
          'rgba(255, 99, 132, 0.7)'   // Critique - red
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.5,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Distribution par Niveau de Risque'
        }
      }
    }
  });
}

// Render list of recent scans
function renderRecentScans(recentReports) {
  const container = document.getElementById('recent-scans');
  container.innerHTML = '';
  
  if (recentReports.length === 0) {
    container.innerHTML = '<div class="text-center py-4">Aucune analyse récente à afficher</div>';
    return;
  }
  
  recentReports.forEach(report => {
    // Format date
    const scanDate = new Date(report.scan_date);
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(scanDate);
    
    // Get appropriate risk level class
    const riskLevelClass = getRiskLevelClass(report.risk_level);
    
    // Check if there are recent attacks
    let recentAttack = '';
    if (report.attack_history && report.attack_history.length > 0) {
      // Sort attacks by date (most recent first)
      const sortedAttacks = [...report.attack_history].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      
      // Get most recent attack
      const latestAttack = sortedAttacks[0];
      const attackDate = new Date(latestAttack.date);
      const formattedAttackDate = new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(attackDate);
      
      const severityClass = getSeverityClass(latestAttack.severity);
      
      recentAttack = `
        <div class="recent-attack">
          <span class="attack-label">Dernière attaque:</span>
          <span class="attack-date">${formattedAttackDate}</span>
          <span class="badge bg-${severityClass} ms-2">${latestAttack.severity}</span>
        </div>
      `;
    }
    
    const reportCard = document.createElement('div');
    reportCard.className = `scan-card risk-level-${report.risk_level.toLowerCase()}`;
    
    reportCard.innerHTML = `
      <div class="scan-date">${formattedDate}</div>
      <div class="scan-url">${report.url}</div>
      <div class="scan-metrics">
        <span class="risk-badge ${riskLevelClass}">${report.risk_level}</span>
        <span class="risk-score">${report.risk_score}%</span>
      </div>
      ${recentAttack}
      <div class="scan-actions">
        <a href="reports.html?id=${report.id}" class="btn btn-sm btn-primary">
          <i class="fas fa-eye me-1"></i> Voir Détails
        </a>
      </div>
    `;
    
    container.appendChild(reportCard);
  });
}

// Show error message
function showErrorMessage(message) {
  const alertBox = document.createElement('div');
  alertBox.className = 'alert alert-danger';
  alertBox.textContent = message;
  
  document.getElementById('dashboard-alerts').appendChild(alertBox);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    alertBox.remove();
  }, 5000);
}

// Helper function to get risk level class
function getRiskLevelClass(level) {
  level = level.toLowerCase();
  switch(level) {
    case 'critique':
      return 'danger';
    case 'important':
      return 'warning';
    case 'modéré':
      return 'info';
    case 'faible':
      return 'success';
    default:
      return 'secondary';
  }
}

// Helper function to get severity class
function getSeverityClass(severity) {
  severity = severity?.toLowerCase();
  switch(severity) {
    case 'critique':
      return 'danger';
    case 'important':
      return 'warning';
    case 'modéré':
      return 'info';
    case 'faible':
      return 'success';
    default:
      return 'secondary';
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);

// Initialize chatbot functionality if it exists
document.addEventListener('DOMContentLoaded', function() {
  if (typeof initChatbot === 'function') {
    initChatbot();
  }
});