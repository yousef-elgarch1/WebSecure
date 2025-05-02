import os
import json
import pandas as pd
import numpy as np
import joblib
from datetime import datetime

def save_report(report_data, report_id=None, output_dir='reports'):
    """Save report data to a JSON file."""
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate report ID if not provided
    if not report_id:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        url_safe = report_data['url'].replace('://', '_').replace('/', '_').replace('.', '_')
        report_id = f"{url_safe}_{timestamp}"
    
    # Save report
    filename = f"{output_dir}/{report_id}.json"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(report_data, f, ensure_ascii=False, indent=4)
    
    return report_id, filename

def load_report(report_id, input_dir='reports'):
    """Load report data from a JSON file."""
    filename = f"{input_dir}/{report_id}.json"
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        raise FileNotFoundError(f"Report {report_id} not found")
    except json.JSONDecodeError:
        raise ValueError(f"Invalid JSON format in report {report_id}")

def get_all_reports(input_dir='reports'):
    """Get all available reports."""
    # Create directory if it doesn't exist
    os.makedirs(input_dir, exist_ok=True)
    
    reports = []
    for filename in os.listdir(input_dir):
        if filename.endswith('.json'):
            try:
                with open(f"{input_dir}/{filename}", 'r', encoding='utf-8') as f:
                    report = json.load(f)
                    reports.append({
                        'id': filename.replace('.json', ''),
                        'url': report.get('url', 'Unknown URL'),
                        'scan_date': report.get('scan_date', 'Unknown date'),
                        'risk_level': report.get('risk_level_text', 'Unknown'),
                        'risk_score': report.get('risk_score', 0)
                    })
            except:
                # Skip invalid files
                continue
    
    # Sort by scan date (newest first)
    reports.sort(key=lambda x: x['scan_date'], reverse=True)
    return reports

def load_model(model_name, models_dir='models'):
    """Load a machine learning model."""
    try:
        model_path = f"{models_dir}/{model_name}.pkl"
        return joblib.load(model_path)
    except FileNotFoundError:
        raise FileNotFoundError(f"Model {model_name} not found in {models_dir}")
    except Exception as e:
        raise Exception(f"Error loading model {model_name}: {str(e)}")

def save_model(model, model_name, models_dir='models'):
    """Save a machine learning model."""
    os.makedirs(models_dir, exist_ok=True)
    model_path = f"{models_dir}/{model_name}.pkl"
    joblib.dump(model, model_path)
    return model_path