// API service for WebSecure
const API_BASE_URL = 'http://localhost:5000/api';

// Analyze a website
async function analyzeWebsite(url, scanType = 'quick') {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, scan_type: scanType }),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing website:', error);
    throw error;
  }
}

// Get all reports
async function getReports() {
  try {
    const response = await fetch(`${API_BASE_URL}/reports`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
}

// Get a specific report
async function getReportById(reportId) {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
}

// Generate a report in specified format
async function generateReport(reportId, format) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-report/${reportId}/${format}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}

// Download a report
function downloadReport(filename) {
  window.location.href = `${API_BASE_URL}/download-report/${filename}`;
}