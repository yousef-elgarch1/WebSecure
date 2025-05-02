// Reports functionality for WebSecure

// Initialize the reports page
async function initReportsPage() {
  // Check if there's a specific report to display
  const urlParams = new URLSearchParams(window.location.search);
  const reportId = urlParams.get('id');
  
  if (reportId) {
    // Display single report view
    await displayReportDetail(reportId);
  } else {
    // Display list of reports
    await displayReportList();
  }
}

// Display list of all reports
async function displayReportList() {
  try {
    const reports = await getReports();
    const container = document.getElementById('reports-container');
    
    if (reports && reports.length > 0) {
      // Sort by date descending
      reports.sort((a, b) => new Date(b.scan_date) - new Date(a.scan_date));
      
      const reportTable = document.createElement('table');
      reportTable.className = 'table reports-table';
      
      reportTable.innerHTML = `
        <thead>
          <tr>
            <th>Date</th>
            <th>URL</th>
            <th>Risk Level</th>
            <th>Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="reports-tbody"></tbody>
      `;
      
      container.appendChild(reportTable);
      
      const tbody = document.getElementById('reports-tbody');
      
      reports.forEach(report => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${report.scan_date}</td>
          <td>${report.url}</td>
          <td><span class="badge bg-${getRiskLevelClass(report.risk_level)}">${report.risk_level}</span></td>
          <td>${report.risk_score}%</td>
          <td>
            <a href="reports.html?id=${report.id}" class="btn btn-sm btn-primary">View</a>
            <button class="btn btn-sm btn-outline-secondary" onclick="exportReport('${report.id}', 'html')">Export HTML</button>
            <button class="btn btn-sm btn-outline-secondary" onclick="exportReport('${report.id}', 'json')">Export JSON</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    } else {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-file-alt fa-3x mb-3"></i>
          <h4>No Reports Available</h4>
          <p>Start by analyzing a website to generate security reports.</p>
          <a href="index.html#analyze" class="btn btn-primary mt-3">Analyze Website</a>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error fetching reports:', error);
    showErrorMessage('Failed to load reports');
  }
}

// Display detailed report
async function displayReportDetail(reportId) {
  try {
    const report = await getReportById(reportId);
    const container = document.getElementById('reports-container');
    
    // Build report header
    const reportHeader = document.createElement('div');
    reportHeader.className = 'report-header';
    reportHeader.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Security Report</h2>
        <div class="report-actions">
          <button class="btn btn-outline-secondary me-2" onclick="window.history.back()">
            <i class="fas fa-arrow-left"></i> Back
          </button>
          <div class="dropdown d-inline-block">
            <button class="btn btn-primary dropdown-toggle" type="button" id="exportDropdown" data-bs-toggle="dropdown">
              Export
            </button>
            <ul class="dropdown-menu" aria-labelledby="exportDropdown">
              <li><a class="dropdown-item" href="#" onclick="exportReport('${reportId}', 'html')">HTML Report</a></li>
              <li><a class="dropdown-item" href="#" onclick="exportReport('${reportId}', 'json')">JSON Data</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h4><i class="fas fa-globe"></i> URL</h4>
              <p class="report-url">${report.url}</p>
              <h4><i class="fas fa-calendar"></i> Scan Date</h4>
              <p>${report.scan_date}</p>
            </div>
            <div class="col-md-6">
              <h4><i class="fas fa-shield-alt"></i> Risk Assessment</h4>
              <div class="risk-indicator ${getRiskLevelClass(report.risk_level_text)}">
                <span class="risk-level">${report.risk_level_text}</span>
                <div class="progress">
                  <div class="progress-bar bg-${getRiskLevelClass(report.risk_level_text)}" 
                       role="progressbar" style="width: ${report.risk_score}%" 
                       aria-valuenow="${report.risk_score}" aria-valuemin="0" aria-valuemax="100">
                    ${report.risk_score}%
                  </div>
                </div>
              </div>
              <div class="anomaly-status mt-3">
                <h4><i class="fas fa-exclamation-triangle"></i> Anomaly Detection</h4>
                <span class="badge ${report.is_anomaly ? 'bg-warning' : 'bg-success'}">
                  ${report.is_anomaly ? 'Anomaly Detected' : 'No Anomalies'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(reportHeader);
    
    // Build vulnerabilities section
    const vulnSection = document.createElement('div');
    vulnSection.className = 'vulnerabilities-section';
    vulnSection.innerHTML = `
      <h3><i class="fas fa-bug"></i> Vulnerabilities Detected (${report.vulnerability_count})</h3>
      <div class="vulnerability-list" id="vulnerability-list"></div>
    `;
    container.appendChild(vulnSection);
    
    const vulnList = document.getElementById('vulnerability-list');
    
    if (report.vulnerabilities && report.vulnerabilities.length > 0) {
      report.vulnerabilities.forEach(vuln => {
        const vulnCard = document.createElement('div');
        vulnCard.className = `card vuln-card mb-3 vuln-${vuln.severity.toLowerCase()}`;
        vulnCard.innerHTML = `
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">${vuln.name}</h5>
            <span class="badge bg-${getSeverityClass(vuln.severity)}">${vuln.severity}</span>
          </div>
          <div class="card-body">
            <p>${vuln.description}</p>
          </div>
        `;
        vulnList.appendChild(vulnCard);
      });
    } else {
      vulnList.innerHTML = '<div class="alert alert-success">No vulnerabilities detected</div>';
    }
    
    // Build recommendations section
    const recsSection = document.createElement('div');
    recsSection.className = 'recommendations-section mt-4';
    recsSection.innerHTML = `
      <h3><i class="fas fa-clipboard-check"></i> Recommendations</h3>
      <div class="recommendation-list" id="recommendation-list"></div>
    `;
    container.appendChild(recsSection);
    
    const recList = document.getElementById('recommendation-list');
    
    if (report.recommendations && report.recommendations.length > 0) {
      report.recommendations.forEach(rec => {
        const recCard = document.createElement('div');
        recCard.className = 'card rec-card mb-3';
        recCard.innerHTML = `
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">${rec.title}</h5>
            <span class="badge bg-${getPriorityClass(rec.priority)}">Priority: ${rec.priority}</span>
          </div>
          <div class="card-body">
            <p>${rec.description}</p>
          </div>
        `;
        recList.appendChild(recCard);
      });
    } else {
      recList.innerHTML = '<div class="alert alert-info">No specific recommendations</div>';
    }
    
    // Build risk probability section
    if (report.probability) {
      const probSection = document.createElement('div');
      probSection.className = 'probability-section mt-4';
      probSection.innerHTML = `
        <h3><i class="fas fa-chart-pie"></i> Risk Probability Distribution</h3>
        <div class="card">
          <div class="card-body">
            <canvas id="risk-probability-chart" height="200"></canvas>
          </div>
        </div>
      `;
      container.appendChild(probSection);
      
      // Render the probability chart
      setTimeout(() => {
        const ctx = document.getElementById('risk-probability-chart').getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(report.probability),
            datasets: [{
              label: 'Probability',
              data: Object.values(report.probability).map(v => parseFloat(v.toFixed(2))),
              backgroundColor: [
                'rgba(75, 192, 192, 0.7)',  // Faible
                'rgba(255, 205, 86, 0.7)',  // Modéré
                'rgba(255, 159, 64, 0.7)',  // Important
                'rgba(255, 99, 132, 0.7)'   // Critique
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
            scales: {
              y: {
                beginAtZero: true,
                max: 1.0
              }
            }
          }
        });
      }, 100);
    }
    
  } catch (error) {
    console.error('Error displaying report:', error);
    const container = document.getElementById('reports-container');
    container.innerHTML = `
      <div class="alert alert-danger">
        Failed to load report: ${error.message}
        <button class="btn btn-outline-secondary ms-3" onclick="window.history.back()">
          <i class="fas fa-arrow-left"></i> Back to Reports
        </button>
      </div>
    `;
  }
}

// Export a report
async function exportReport(reportId, format) {
  try {
    const result = await generateReport(reportId, format);
    
    if (result.status === 'success') {
      downloadReport(result.report_file);
    } else {
      showErrorMessage('Failed to generate report');
    }
  } catch (error) {
    console.error('Error exporting report:', error);
    showErrorMessage('Failed to export report');
  }
}

// Helper functions
function getRiskLevelClass(riskLevel) {
  switch (riskLevel) {
    case 'Critique': return 'danger';
    case 'Important': return 'warning';
    case 'Modéré': return 'info';
    case 'Faible': return 'success';
    default: return 'secondary';
  }
}

function getSeverityClass(severity) {
  switch (severity) {
    case 'Critique': return 'danger';
    case 'Important': return 'warning';
    case 'Modéré': return 'info';
    case 'Faible': return 'success';
    default: return 'secondary';
  }
}

function getPriorityClass(priority) {
  switch (priority) {
    case 'Critique':
    case 'Haute': return 'danger';
    case 'Moyenne': return 'warning';
    case 'Basse': return 'info';
    default: return 'secondary';
  }
}

function showErrorMessage(message) {
  const alertBox = document.createElement('div');
  alertBox.className = 'alert alert-danger';
  alertBox.textContent = message;
  
  document.getElementById('report-alerts').appendChild(alertBox);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    alertBox.remove();
  }, 5000);
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initReportsPage);