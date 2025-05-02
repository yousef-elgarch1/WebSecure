from flask import Blueprint, request, jsonify, send_from_directory
import os
from analyzer.website_analyzer import generate_security_report
from utils.data_handlers import load_report, get_all_reports

# Create Blueprint
reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/reports', methods=['GET'])
def list_reports():
    try:
        reports = get_all_reports()
        return jsonify(reports)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    try:
        report = load_report(report_id)
        return jsonify(report)
    except FileNotFoundError:
        return jsonify({'error': 'Report not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/generate-report/<report_id>/<format>', methods=['GET'])
def generate_report(report_id, format):
    try:
        result = load_report(report_id)
        
        # Call the report generator function
        report_file = generate_security_report(result, format)
        
        # Extract just the filename from the path
        filename = os.path.basename(report_file)
        
        return jsonify({
            'status': 'success',
            'report_file': filename
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/download-report/<filename>', methods=['GET'])
def download_report(filename):
    return send_from_directory('reports', filename)

@reports_bp.route('/reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    try:
        report_path = f"reports/{report_id}.json"
        if os.path.exists(report_path):
            os.remove(report_path)
            return jsonify({'status': 'success', 'message': 'Report deleted successfully'})
        else:
            return jsonify({'error': 'Report not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/compare-reports', methods=['POST'])
def compare_reports():
    try:
        data = request.get_json()
        report_ids = data.get('report_ids', [])
        
        if len(report_ids) < 2:
            return jsonify({'error': 'At least two report IDs are required for comparison'}), 400
        
        comparison_results = []
        for report_id in report_ids:
            try:
                report = load_report(report_id)
                comparison_results.append({
                    'id': report_id,
                    'url': report.get('url', 'Unknown'),
                    'scan_date': report.get('scan_date', 'Unknown'),
                    'risk_level': report.get('risk_level_text', 'Unknown'),
                    'risk_score': report.get('risk_score', 0),
                    'vulnerability_count': report.get('vulnerability_count', 0)
                })
            except:
                return jsonify({'error': f'Report {report_id} not found or invalid'}), 404
        
        return jsonify({
            'status': 'success',
            'comparison': comparison_results
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500