// Dashboard functionality for WebSecure

// Initialize the dashboard
async function initDashboard() {
  try {
    // Fetch reports for dashboard statistics
    const reports = await getReports();
    
    if (reports && reports.length > 0) {
      // Render key metrics
      renderSecurityMetrics(reports);
      
      // Create vulnerability distribution chart
      renderVulnerabilityDistributionChart(reports);
      
      // Render risk level distribution
      renderRiskLevelDistribution(reports);
      
      // Render recent scans
      renderRecentScans(reports.slice(0, 5));
    } else {
      document.getElementById('dashboard-metrics').innerHTML = 
        '<div class="empty-state">No scan data available. <a href="#analyze">Start a scan</a></div>';
    }
  } catch (error) {
    console.error('Error initializing dashboard:', error);
    showErrorMessage('Failed to load dashboard data');
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
  
  // Convert to arrays for Chart.js
  const labels = Object.keys(vulnerabilityTypes);
  const data = Object.values(vulnerabilityTypes);
  
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
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Frequency'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Vulnerability Type'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Distribution of Vulnerability Types'
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
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Distribution by Risk Level'
        }
      }
    }
  });
}

// Render list of recent scans
function renderRecentScans(recentReports) {
  const container = document.getElementById('recent-scans');
  container.innerHTML = '';
  
  recentReports.forEach(report => {
    const reportCard = document.createElement('div');
    reportCard.className = `scan-card risk-level-${report.risk_level.toLowerCase()}`;
    
    reportCard.innerHTML = `
      <div class="scan-date">${report.scan_date}</div>
      <div class="scan-url">${report.url}</div>
      <div class="scan-metrics">
        <span class="risk-badge ${report.risk_level.toLowerCase()}">${report.risk_level}</span>
        <span class="risk-score">${report.risk_score}%</span>
      </div>
      <div class="scan-actions">
        <a href="reports.html?id=${report.id}" class="btn btn-sm btn-primary">View Details</a>
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

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);