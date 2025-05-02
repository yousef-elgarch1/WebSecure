from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from analyzer.website_analyzer import WebsiteAnalyzer
from utils.report_generator import generate_security_report

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests

# Initialize analyzer
analyzer = WebsiteAnalyzer()

@app.route('/api/analyze', methods=['POST'])
def analyze_website():
    data = request.get_json()
    url = data.get('url')
    scan_type = data.get('scan_type', 'quick')
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    try:
        # Call the existing function from your notebook
        result = analyzer.analyze_website(url)
        
        # Save result for later retrieval
        timestamp = result['scan_date'].replace(':', '-').replace(' ', '_')
        result_id = f"{url.replace('://', '_').replace('/', '_').replace('.', '_')}_{timestamp}"
        
        os.makedirs('reports', exist_ok=True)
        with open(f'reports/{result_id}.json', 'w') as f:
            json.dump(result, f)
            
        return jsonify({
            'status': 'success',
            'result_id': result_id,
            'summary': {
                'url': result['url'],
                'risk_level': result['risk_level_text'],
                'risk_score': result['risk_score'],
                'vulnerability_count': result['vulnerability_count']
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reports/<result_id>', methods=['GET'])
def get_report(result_id):
    try:
        with open(f'reports/{result_id}.json', 'r') as f:
            report = json.load(f)
        return jsonify(report)
    except FileNotFoundError:
        return jsonify({'error': 'Report not found'}), 404

@app.route('/api/reports', methods=['GET'])
def list_reports():
    try:
        reports = []
        for filename in os.listdir('reports'):
            if filename.endswith('.json'):
                with open(f'reports/{filename}', 'r') as f:
                    report = json.load(f)
                    reports.append({
                        'id': filename.replace('.json', ''),
                        'url': report['url'],
                        'scan_date': report['scan_date'],
                        'risk_level': report['risk_level_text'],
                        'risk_score': report['risk_score']
                    })
        return jsonify(reports)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-report/<result_id>/<format>', methods=['GET'])
def generate_report(result_id, format):
    try:
        with open(f'reports/{result_id}.json', 'r') as f:
            result = json.load(f)
        
        # Call the existing report generator from your notebook
        report_file = generate_security_report(result, format)
        
        # Extract just the filename from the path
        filename = os.path.basename(report_file)
        
        return jsonify({
            'status': 'success',
            'report_file': filename
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download-report/<filename>', methods=['GET'])
def download_report(filename):
    return send_from_directory('reports', filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)