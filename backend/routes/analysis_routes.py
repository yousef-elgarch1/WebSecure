from flask import Blueprint, request, jsonify
import os
import json
from datetime import datetime
from analyzer.website_analyzer import WebsiteAnalyzer
from utils.data_handlers import save_report

# Create Blueprint
analysis_bp = Blueprint('analysis', __name__)

# Initialize analyzer
analyzer = WebsiteAnalyzer(models_dir='models')

@analysis_bp.route('/analyze', methods=['POST'])
def analyze_website():
    data = request.get_json()
    url = data.get('url')
    scan_type = data.get('scan_type', 'quick')
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    try:
        # Call the analyzer function
        result = analyzer.analyze_website(url)
        
        # Save report
        report_id, _ = save_report(result)
            
        return jsonify({
            'status': 'success',
            'result_id': report_id,
            'summary': {
                'url': result['url'],
                'risk_level': result['risk_level_text'],
                'risk_score': result['risk_score'],
                'vulnerability_count': result['vulnerability_count']
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analysis_bp.route('/batch-analyze', methods=['POST'])
def batch_analyze():
    data = request.get_json()
    urls = data.get('urls', [])
    scan_type = data.get('scan_type', 'quick')
    
    if not urls:
        return jsonify({'error': 'URLs list is required'}), 400
    
    results = []
    errors = []
    
    for url in urls:
        try:
            # Call the analyzer function
            result = analyzer.analyze_website(url)
            
            # Save report
            report_id, _ = save_report(result)
            
            results.append({
                'url': url,
                'status': 'success',
                'result_id': report_id,
                'risk_level': result['risk_level_text'],
                'risk_score': result['risk_score']
            })
            
        except Exception as e:
            errors.append({
                'url': url,
                'error': str(e)
            })
    
    return jsonify({
        'status': 'completed',
        'total': len(urls),
        'successful': len(results),
        'failed': len(errors),
        'results': results,
        'errors': errors
    })