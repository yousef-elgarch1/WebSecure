// api.js - API connection module for frontend

/**
 * WebSecure API client
 * Handles communication with the backend API
 * Implements fallback to mock data when backend is unavailable
 */
class WebSecureAPI {
  constructor() {
      // API endpoint URL (change based on your deployment)
      this.apiBaseUrl = 'http://localhost:5000/api';
      
      // Default headers for API requests
      this.headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      };
      
      // Mock data for fallback
      this.useMockData = false;
      this.mockReports = []; // Will be populated if needed from mock_data.js
  }

  /**
   * Check API health status
   * @returns {Promise} Promise resolving to API health status
   */
  async checkHealth() {
      try {
          const response = await fetch(`${this.apiBaseUrl}/health`, {
              method: 'GET',
              headers: this.headers
          });
          
          // Set mock data flag to false if server responds
          this.useMockData = false;
          return await response.json();
      } catch (error) {
          console.warn('API health check failed, switching to mock data:', error);
          
          // Switch to mock data mode
          this.useMockData = true;
          await this._loadMockData();
          
          // Return a mock health response
          return {
              status: "ok",
              mode: "mock",
              timestamp: new Date().toISOString()
          };
      }
  }

  /**
   * Analyze a website for vulnerabilities
   * @param {string} url - URL to analyze
   * @param {string} analysisType - 'quick' or 'deep' analysis
   * @returns {Promise} Promise resolving to analysis job result
   */
  async analyzeWebsite(url, analysisType = 'quick') {
      // If in mock mode, use mock analysis
      if (this.useMockData) {
          return await this._mockAnalyzeWebsite(url, analysisType);
      }
      
      try {
          const response = await fetch(`${this.apiBaseUrl}/analyze`, {
              method: 'POST',
              headers: this.headers,
              body: JSON.stringify({ 
                  url, 
                  type: analysisType 
              })
          });
          
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to analyze website');
          }
          
          const data = await response.json();
          return {
              success: true,
              report_id: data.report_id
          };
      } catch (error) {
          console.warn('Website analysis with backend failed, switching to mock data:', error);
          
          // Switch to mock data mode and retry with mock
          this.useMockData = true;
          await this._loadMockData();
          return await this._mockAnalyzeWebsite(url, analysisType);
      }
  }

  /**
   * Get a specific security report
   * @param {string} reportId - ID of the report to retrieve
   * @returns {Promise} Promise resolving to the report data
   */
  async getReport(reportId) {
      // If in mock mode, use mock data
      if (this.useMockData) {
          return await this._mockGetReport(reportId);
      }
      
      try {
          const response = await fetch(`${this.apiBaseUrl}/reports/${reportId}`, {
              method: 'GET',
              headers: this.headers
          });
          
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to retrieve report');
          }
          
          return await response.json();
      } catch (error) {
          console.warn('Failed to get report from backend, switching to mock data:', error);
          
          // Switch to mock data mode and retry with mock
          this.useMockData = true;
          await this._loadMockData();
          return await this._mockGetReport(reportId);
      }
  }

  /**
   * List all available reports
   * @returns {Promise} Promise resolving to array of report summaries
   */
  async listReports() {
      // If in mock mode, use mock data
      if (this.useMockData) {
          return await this._mockListReports();
      }
      
      try {
          const response = await fetch(`${this.apiBaseUrl}/reports`, {
              method: 'GET',
              headers: this.headers
          });
          
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to list reports');
          }
          
          return await response.json();
      } catch (error) {
          console.warn('Failed to list reports from backend, switching to mock data:', error);
          
          // Switch to mock data mode and retry with mock
          this.useMockData = true;
          await this._loadMockData();
          return await this._mockListReports();
      }
  }

  /**
   * Export a report in specified format
   * @param {string} reportId - ID of the report to export
   * @param {string} format - export format ('html' or 'json')
   * @returns {Promise} Promise resolving to the export result
   */
  async exportReport(reportId, format) {
      // If in mock mode, use mock data
      if (this.useMockData) {
          return await this._mockExportReport(reportId, format);
      }
      
      try {
          const response = await fetch(`${this.apiBaseUrl}/reports/${reportId}/export`, {
              method: 'POST',
              headers: this.headers,
              body: JSON.stringify({ format })
          });
          
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to export report');
          }
          
          return await response.json();
      } catch (error) {
          console.warn('Failed to export report from backend, switching to mock data:', error);
          
          // Switch to mock data mode and retry with mock
          this.useMockData = true;
          await this._loadMockData();
          return await this._mockExportReport(reportId, format);
      }
  }

  // ---------- MOCK DATA METHODS ----------

  /**
   * Load mock data if not already loaded
   * @private
   */
  async _loadMockData() {
      if (this.mockReports.length > 0) {
          return; // Already loaded
      }
      
      try {
          // Try to import mock data from external file
          const mockDataModule = await import('./mock_data.js');
          this.mockReports = mockDataModule.default || [];
      } catch (error) {
          console.warn('Failed to load mock data module, using fallback hardcoded data:', error);
          // Using simplified fallback mock data
          this.mockReports = this._getFallbackMockData();
      }
  }

  /**
   * Mock implementation of website analysis
   * @private
   */
  async _mockAnalyzeWebsite(url, analysisType) {
      console.log(`Mock API: Analyzing website: ${url} with scan type: ${analysisType}`);
      
      // Clean up the URL for matching
      const cleanUrl = url.toLowerCase()
          .replace(/^https?:\/\//i, '')
          .replace(/^www\./i, '')
          .replace(/\/+$/, '');
      
      // Find a matching report based on the cleaned URL
      const matchingReport = this.mockReports.find(report => {
          const reportUrl = (report.url || '').toLowerCase()
              .replace(/^https?:\/\//i, '')
              .replace(/^www\./i, '')
              .replace(/\/+$/, '');
          
          return reportUrl.includes(cleanUrl) || cleanUrl.includes(reportUrl);
      });
      
      // Simulate processing time based on scan type
      const processingTime = analysisType === 'deep' ? 5000 : 2000;
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // If matching report found, return its ID, otherwise return a random report ID
      if (matchingReport) {
          return {
              success: true,
              report_id: matchingReport.id
          };
      } else {
          // Return a random report if no match found
          const randomIndex = Math.floor(Math.random() * this.mockReports.length);
          const randomReportId = this.mockReports[randomIndex]?.id || 'rep001';
          
          return {
              success: true,
              report_id: randomReportId
          };
      }
  }

  /**
   * Mock implementation of get report
   * @private
   */
  async _mockGetReport(reportId) {
      console.log(`Mock API: Getting report with ID: ${reportId}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the report by ID
      const report = this.mockReports.find(r => r.id === reportId);
      
      if (!report) {
          throw new Error(`Report with ID ${reportId} not found`);
      }
      
      // Transform mock data to match expected format from real API
      return this._transformMockReport(report);
  }

  /**
   * Mock implementation of list reports
   * @private
   */
  async _mockListReports() {
      console.log('Mock API: Listing all reports');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Transform mock data to match expected format from real API
      return this.mockReports.map(report => ({
          id: report.id,
          url: report.url,
          timestamp: report.scan_date,
          risk_score: {
              score: report.risk_score,
              category: this._getRiskCategory(report.risk_score)
          },
          vulnerabilities: report.vulnerabilities || []
      }));
  }

  /**
   * Mock implementation of export report
   * @private
   */
  async _mockExportReport(reportId, format) {
      console.log(`Mock API: Exporting report ${reportId} in ${format} format`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
          success: true,
          message: `Report exported successfully in ${format} format`,
          filename: `report_${reportId}.${format}`
      };
  }

  /**
   * Transform mock report to match real API format
   * @private
   */
  _transformMockReport(mockReport) {
      // Mapping severity terms
      const severityMap = {
          'Faible': 'LOW',
          'Modéré': 'MEDIUM',
          'Important': 'HIGH',
          'Critique': 'CRITICAL'
      };
      
      // Transform vulnerabilities
      const vulnerabilities = (mockReport.vulnerabilities || []).map(vuln => ({
          type: vuln.name.toUpperCase().replace(/[^\w]/g, '_'),
          severity: severityMap[vuln.severity] || 'MEDIUM',
          description: vuln.description,
          details: vuln.description,
          probability: Math.random() * 0.5 + 0.5  // Random high probability between 0.5 and 1.0
      }));
      
      // Transform recommendations
      const recommendations = (mockReport.recommendations || []).map(rec => ({
          title: rec.title,
          description: rec.description,
          priority: severityMap[rec.priority] || 'MEDIUM',
          implementation: rec.description
      }));
      
      // Format the mock report to match our expected format
      return {
          id: mockReport.id,
          url: mockReport.url,
          timestamp: mockReport.scan_date,
          analysis_type: Math.random() > 0.5 ? 'deep' : 'quick',
          website_info: {
              title: mockReport.website_info?.name || "",
              description: mockReport.website_info?.description || "",
              domain: new URL(mockReport.url).hostname,
              technologies: mockReport.website_info?.technologies || [],
              meta_tags: {},
              server_info: {
                  'Server': 'Apache/2.4.41',
                  'X-Powered-By': 'PHP/7.4.3'
              },
              logo: mockReport.website_info?.logo_url ? {
                  url: mockReport.website_info.logo_url,
                  content_type: 'image/png'
              } : null
          },
          vulnerabilities: vulnerabilities,
          risk_score: {
              score: mockReport.risk_score,
              category: this._getRiskCategory(mockReport.risk_score),
              description: this._getRiskDescription(mockReport.risk_score),
              confidence: 0.85
          },
          recommendations: recommendations
      };
  }

  /**
   * Get risk category based on score
   * @private
   */
  _getRiskCategory(score) {
      if (score < 20) return 'LOW';
      if (score < 50) return 'MEDIUM';
      if (score < 80) return 'HIGH';
      return 'CRITICAL';
  }

  /**
   * Get risk description based on score
   * @private
   */
  _getRiskDescription(score) {
      if (score < 20) {
          return "Le site web présente un niveau de risque faible. Des améliorations mineures pourraient être bénéfiques.";
      } else if (score < 50) {
          return "Le site web présente un niveau de risque modéré. Certaines vulnérabilités devraient être corrigées.";
      } else if (score < 80) {
          return "Le site web présente un niveau de risque élevé. Des mesures correctives importantes sont nécessaires.";
      } else {
          return "Le site web présente un niveau de risque critique. Une action immédiate est requise pour corriger les vulnérabilités.";
      }
  }

  /**
   * Get fallback mock data if external module fails to load
   * @private
   */
  _getFallbackMockData() {
      return [
          {
              id: 'rep001',
              url: 'https://www.example.com',
              scan_date: new Date().toISOString(),
              risk_level: 'Important',
              risk_score: 75,
              vulnerability_count: 5,
              vulnerabilities: [
                  {
                      name: 'Cross-Site Scripting (XSS)',
                      severity: 'Important',
                      description: 'Vulnerabilities that allow injection of client-side scripts.'
                  },
                  {
                      name: 'SQL Injection',
                      severity: 'Critique',
                      description: 'Vulnerabilities that allow injection of SQL commands.'
                  }
              ],
              website_info: {
                  name: 'Example Website',
                  description: 'An example website for demonstration purposes',
                  technologies: ['PHP', 'MySQL', 'jQuery', 'Bootstrap']
              },
              recommendations: [
                  {
                      title: 'Implement Input Validation',
                      priority: 'Haute',
                      description: 'Validate all user inputs to prevent injection attacks.'
                  },
                  {
                      title: 'Update Software Versions',
                      priority: 'Moyenne',
                      description: 'Update all software components to their latest versions.'
                  }
              ]
          }
      ];
  }
}

// Create singleton instance
const apiClient = new WebSecureAPI();

// Export the API client
export default apiClient;