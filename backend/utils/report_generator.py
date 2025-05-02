import os
from datetime import datetime
import json
from jinja2 import Template

# This function will call your existing generate_security_report function
# and add additional formatting for web viewing
def generate_security_report(result, output_format):
    # Import the original function from your notebook
    from analyzer.website_analyzer import generate_security_report as original_generate_report
    
    # Call the original function
    report_path = original_generate_report(result, output_format)
    
    # Add web-specific enhancements for HTML reports
    if output_format.lower() == 'html':
        # Add navigation links, WebSecure branding, etc.
        enhance_html_report(report_path)
    
    return report_path

def enhance_html_report(report_path):
    # Read the original HTML
    with open(report_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Add WebSecure branding, navigation, etc.
    enhanced_html = html_content.replace(
        '<title>Rapport de sécurité',
        '<title>WebSecure | Rapport de sécurité'
    )
    
    # Add navigation menu
    nav_bar = '''
    <div class="nav-bar">
        <div class="logo">
            <a href="/"><img src="/assets/img/logo.svg" alt="WebSecure Logo" height="40"></a>
        </div>
        <div class="nav-links">
            <a href="/">Accueil</a>
            <a href="/dashboard.html">Dashboard</a>
            <a href="/reports.html">Rapports</a>
            <a href="/about.html">À Propos</a>
        </div>
    </div>
    '''
    
    enhanced_html = enhanced_html.replace('<body>', f'<body>\n{nav_bar}')
    
    # Add WebSecure footer
    footer = '''
    <footer class="websecure-footer">
        <div class="container">
            <p>Rapport généré par <strong>WebSecure</strong> - Système avancé d'analyse de vulnérabilités web</p>
            <p>© 2025 WebSecure - ELGARCH Youssef et IBNOU-KADY Nisrine</p>
        </div>
    </footer>
    '''
    
    enhanced_html = enhanced_html.replace('</body>', f'{footer}\n</body>')
    
    # Write the enhanced HTML back to the file
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(enhanced_html)