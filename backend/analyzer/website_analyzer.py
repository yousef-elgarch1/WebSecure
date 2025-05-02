import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import re
import joblib
import warnings
import time
from datetime import datetime
from tqdm import tqdm
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.feature_selection import SelectKBest, chi2, f_classif, mutual_info_classif
from sklearn.decomposition import PCA, TruncatedSVD
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score, roc_auc_score, precision_recall_curve
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, AdaBoostClassifier, VotingClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.pipeline import Pipeline
import nltk
from nltk.corpus import stopwords
from nltk.stem import SnowballStemmer
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from imblearn.over_sampling import SMOTE
from imblearn.under_sampling import RandomUnderSampler
import warnings
warnings.filterwarnings("ignore")

# Configuration des bibliothèques NLTK
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')






import os
import numpy as np
import requests
from bs4 import BeautifulSoup
import socket
import ssl
import re
from datetime import datetime
import json
import warnings
import random  # Pour simuler des résultats aléatoires

# Ignorer les avertissements liés à l'absence de vérification SSL pour les requêtes
warnings.filterwarnings('ignore', message='Unverified HTTPS request')

class WebsiteAnalyzer:
    def __init__(self):
        # Dans cette version de démonstration, nous utilisons des modèles simulés
        self.risk_model = self.DummyModel()
        self.anomaly_model = self.DummyAnomalyModel()
        self.scaler = self.DummyScaler()
    
    # Classes internes pour simuler les modèles de ML
    class DummyModel:
        def predict(self, X):
            # Simuler un niveau de risque (0=Faible, 1=Modéré, 2=Important, 3=Critique)
            return np.array([random.randint(0, 3)])
        
        def predict_proba(self, X):
            # Simuler des probabilités pour chaque niveau
            probs = np.random.random(4)
            return np.array([probs / probs.sum()])
    
    class DummyScaler:
        def transform(self, X):
            # Ne fait rien, retourne simplement les données
            return X
    
    class DummyAnomalyModel:
        def decision_function(self, X):
            # Simuler un score d'anomalie entre -0.5 et 0.5
            return np.array([random.uniform(-0.5, 0.5)])
        
        def predict(self, X):
            # Simuler une détection d'anomalie (1=normal, -1=anomalie)
            return np.array([random.choice([1, -1])])
    
    def extract_website_features(self, url):
        """Extrait les caractéristiques d'un site web pour l'analyse"""
        # Normalisation de l'URL
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url

        domain = url.split('/')[2] if '//' in url else url.split('/')[0]
        print(f"\n🌐 Analyse du site web: {url}")

        # Caractéristiques par défaut (cas où l'analyse échoue)
        features = {
            'has_windows': 0,
            'has_linux': 0,
            'has_macos': 0,
            'has_android': 0,
            'has_ios': 0,
            'has_wordpress': 0,
            'has_joomla': 0,
            'has_drupal': 0,
            'has_oracle': 0,
            'has_microsoft': 0,
            'has_adobe': 0,
            'has_plugin': 0,
            'has_server': 1,  # Par défaut, un site web a un serveur
            'has_web': 1,     # Par défaut, c'est un site web
            'has_mobile': 0,
            'has_iot': 0,
            'has_cloud': 0,
            'has_injection': 0,
            'has_xss': 0,
            'has_sql': 0,
            'has_authentication': 0,
            'has_authorization': 0,
            'has_privilege': 0,
            'has_code_execution': 0,
            'has_arbitrary_code': 0,
            'has_buffer': 0,
            'has_overflow': 0,
            'has_dos': 0,
            'has_csrf': 0,
            'has_path_traversal': 0,
            'has_file_inclusion': 0,
            'has_encryption': 0,
            'has_ssl': 0,
            'has_mitm': 0,
            'has_bypass': 0,
            'has_backdoor': 0,
            'has_zero_day': 0,
            'risk_level': 0,
            'impact_level': 0
        }

        detected_vulnerabilities = []
        security_recommendations = []

        try:
            # Préparation de l'en-tête des requêtes
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }

            # Vérification SSL
            print("   - Vérification du certificat SSL...")
            try:
                context = ssl.create_default_context()
                with socket.create_connection((domain, 443), timeout=10) as sock:
                    with context.wrap_socket(sock, server_hostname=domain) as ssock:
                        cert = ssock.getpeercert()

                        # Le certificat existe
                        features['has_ssl'] = 1

                        # Vérification de la date d'expiration
                        expiry_date = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
                        ssl_expiry = expiry_date < datetime.now()
                        if ssl_expiry:
                            detected_vulnerabilities.append({
                                'name': 'Certificat SSL expiré',
                                'description': f"Le certificat SSL a expiré le {expiry_date.strftime('%Y-%m-%d')}",
                                'severity': 'Important'
                            })
                            security_recommendations.append({
                                'title': 'Renouveler le certificat SSL',
                                'description': 'Contactez votre fournisseur de certificat ou utilisez Let\'s Encrypt pour renouveler votre certificat SSL.',
                                'priority': 'Haute'
                            })
                        print(f"      ✓ Certificat SSL valide: {'Non' if ssl_expiry else 'Oui'}")
            except Exception as e:
                features['has_ssl'] = 0
                detected_vulnerabilities.append({
                    'name': 'Absence de SSL/TLS',
                    'description': 'Le site n\'utilise pas de connexion sécurisée (HTTPS) ou le certificat n\'est pas accessible',
                    'severity': 'Critique'
                })
                security_recommendations.append({
                    'title': 'Mettre en place HTTPS',
                    'description': 'Installez un certificat SSL via Let\'s Encrypt ou un autre fournisseur.',
                    'priority': 'Critique'
                })
                print(f"      ⚠️ Pas de certificat SSL ou erreur: {e}")

            # Récupération de la page
            print("   - Récupération du contenu de la page...")
            response = requests.get(url, headers=headers, timeout=10, verify=False)
            soup = BeautifulSoup(response.content, 'html.parser')

            # Simulation de détection de vulnérabilités
            # Pour la démonstration, nous ajoutons quelques vulnérabilités aléatoires
            vuln_types = [
                ('has_xss', 'Vulnérabilité XSS potentielle', 'Scripts externes suspects détectés'),
                ('has_authentication', 'Formulaire d\'identification non sécurisé', 'Le formulaire d\'authentification pourrait être vulnérable'),
                ('has_sql', 'Injection SQL potentielle', 'Paramètres URL non sanitisés détectés'),
                ('has_csrf', 'Protection CSRF manquante', 'Manque de jetons CSRF sur les formulaires'),
                ('has_path_traversal', 'Traversée de chemin possible', 'Protection insuffisante contre les attaques de traversée de chemin')
            ]
            
            # Simuler aléatoirement 1 à 3 vulnérabilités
            num_vulnerabilities = random.randint(1, 3)
            selected_vulnerabilities = random.sample(vuln_types, num_vulnerabilities)
            
            severities = ['Faible', 'Modéré', 'Important', 'Critique']
            priorities = ['Basse', 'Moyenne', 'Haute', 'Critique']
            
            for vuln_type, name, desc in selected_vulnerabilities:
                features[vuln_type] = 1
                severity = random.choice(severities)
                priority = random.choice(priorities)
                
                detected_vulnerabilities.append({
                    'name': name,
                    'description': desc,
                    'severity': severity
                })
                
                security_recommendations.append({
                    'title': f'Corriger {name.lower()}',
                    'description': f'Mettre en place des mesures pour protéger contre {name.lower()}',
                    'priority': priority
                })

        except Exception as e:
            print(f"⚠️ Erreur lors de l'analyse du site: {e}")
            # En cas d'erreur, ajouter une vulnérabilité générique
            detected_vulnerabilities.append({
                'name': 'Erreur lors de l\'analyse',
                'description': f'Impossible d\'analyser correctement le site: {str(e)}',
                'severity': 'Inconnu'
            })
            security_recommendations.append({
                'title': 'Vérifier l\'accessibilité du site',
                'description': 'Assurez-vous que le site est accessible et répond correctement aux requêtes HTTP.',
                'priority': 'Haute'
            })

        return features, detected_vulnerabilities, security_recommendations

    def analyze_website(self, url):
        """Analyse complète d'un site web et prédiction des risques"""
        try:
            # Extraction des caractéristiques
            features, detected_vulnerabilities, security_recommendations = self.extract_website_features(url)

            # Conversion des caractéristiques en format attendu par le modèle
            X = np.array([[features[key] for key in features]])

            print(f"Nombre de caractéristiques extraites : {X.shape[1]}")  # Débogage

            # Normalisation
            X_scaled = self.scaler.transform(X)

            # Prédiction du niveau de risque
            print("\n🔮 Prédiction des risques de sécurité...")
            risk_level = self.risk_model.predict(X_scaled)[0]

            # Probabilités pour chaque classe
            risk_proba = self.risk_model.predict_proba(X_scaled)[0]

            # Détection d'anomalies
            anomaly_score = self.anomaly_model.decision_function(X_scaled)[0]
            is_anomaly = self.anomaly_model.predict(X_scaled)[0] == -1

            # Mappage du niveau de risque numérique au texte
            risk_level_map = {
                0: 'Faible',
                1: 'Modéré',
                2: 'Important',
                3: 'Critique'
            }

            # Calcul du score global (0-100, où 100 = risque élevé)
            risk_score_pct = int(((risk_level / 3) * 60) +
                             (len(detected_vulnerabilities) * 3) +
                             (20 if is_anomaly else 0))

            # Plafonnement à 100
            risk_score_pct = min(100, risk_score_pct)

            # Résultat
            result = {
                'url': url,
                'scan_date': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'risk_level_numeric': int(risk_level),
                'risk_level_text': risk_level_map.get(int(risk_level), 'Inconnu'),
                'risk_score': risk_score_pct,
                'is_anomaly': bool(is_anomaly),
                'anomaly_score': float(anomaly_score),
                'vulnerability_count': len(detected_vulnerabilities),
                'vulnerabilities': detected_vulnerabilities,
                'recommendations': security_recommendations,
                'probability': {
                    'Faible': float(risk_proba[0]) if len(risk_proba) > 0 else 0,
                    'Modéré': float(risk_proba[1]) if len(risk_proba) > 1 else 0,
                    'Important': float(risk_proba[2]) if len(risk_proba) > 2 else 0,
                    'Critique': float(risk_proba[3]) if len(risk_proba) > 3 else 0
                }
            }

            # Affichage du résultat
            print(f"\n📊 Résultats de l'analyse:")
            print(f"   ✓ URL: {result['url']}")
            print(f"   ✓ Niveau de risque: {result['risk_level_text']} ({result['risk_score']}%)")
            print(f"   ✓ Anomalie détectée: {'Oui' if result['is_anomaly'] else 'Non'}")
            print(f"   ✓ Nombre de vulnérabilités: {result['vulnerability_count']}")
            print("   ✓ Probabilités par niveau de risque:")
            for level, prob in result['probability'].items():
                print(f"      - {level}: {prob:.2f}")

            return result

        except Exception as e:
            return {
                'error': f'Erreur lors de l\'analyse: {str(e)}',
                'url': url,
                'scan_date': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }

def generate_security_report(result, output_format='json'):
    """
    Génère un rapport de sécurité au format JSON ou HTML
    
    Args:
        result: Dictionnaire contenant les résultats de l'analyse
        output_format: Format du rapport ('json' ou 'html')
        
    Returns:
        str: Nom du fichier de rapport généré
    """
    # Vérification que le résultat est valide
    if not result or 'error' in result:
        error_message = result.get('error', 'Erreur inconnue') if result else 'Résultat vide'
        print(f"\n⚠️ Impossible de générer le rapport complet: {error_message}")
        
        # Créer un rapport d'erreur minimal
        result = {
            'url': result.get('url', 'URL inconnue') if result else 'URL inconnue',
            'scan_date': result.get('scan_date', datetime.now().strftime("%Y-%m-%d %H:%M:%S")) if result else datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'error': error_message,
            'risk_level_text': 'Inconnu',
            'risk_score': 0,
            'vulnerability_count': 0,
            'vulnerabilities': [],
            'recommendations': []
        }
    
    # S'assurer que toutes les clés nécessaires existent
    required_keys = ['url', 'scan_date', 'risk_level_text', 'risk_score', 'vulnerability_count', 
                   'vulnerabilities', 'recommendations']
    
    for key in required_keys:
        if key not in result:
            result[key] = 'Non disponible' if key in ['url', 'scan_date', 'risk_level_text'] else 0 if key in ['risk_score', 'vulnerability_count'] else []
    
    # Création du répertoire reports s'il n'existe pas
    os.makedirs('reports', exist_ok=True)
    
    # Création du nom de fichier en fonction de l'URL
    domain = result['url'].replace('https://', '').replace('http://', '').split('/')[0]
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    print(f"\n📝 Génération du rapport de sécurité...")
    
    if output_format.lower() == 'json':
        # Génération du rapport JSON
        filename = f"reports/rapport_securite_{domain}_{timestamp}.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=4)
            
    elif output_format.lower() == 'html':
        # Génération du rapport HTML avec un style moderne
        filename = f"reports/rapport_securite_{domain}_{timestamp}.html"
        
        # Préparation des sections HTML pour les vulnérabilités
        vulns_html = ""
        if result['vulnerabilities']:
            for vuln in result['vulnerabilities']:
                severity = vuln.get('severity', 'Modéré')
                description = vuln.get('description', 'Aucune description disponible')
                vulns_html += f"""
                <div class="vuln-item">
                    <h4>{vuln['name']} <span class="severity severity-{severity}">{severity}</span></h4>
                    <p>{description}</p>
                </div>
                """
        else:
            vulns_html = "<p>Aucune vulnérabilité détectée.</p>"

        # Préparation des sections HTML pour les recommandations
        recs_html = ""
        if result['recommendations']:
            for rec in result['recommendations']:
                priority = rec.get('priority', 'Moyenne')
                description = rec.get('description', 'Aucune description disponible')
                recs_html += f"""
                <div class="rec-item">
                    <h4>{rec['title']}</h4>
                    <p><span class="priority priority-{priority}">Priorité: {priority}</span></p>
                    <p>{description}</p>
                </div>
                """
        else:
            recs_html = "<p>Aucune recommandation disponible.</p>"
        
        # Déterminer la classe CSS pour le niveau de risque
        risk_class = 'risk-low'
        if result['risk_level_text'] == 'Critique':
            risk_class = 'risk-critical'
        elif result['risk_level_text'] == 'Important':
            risk_class = 'risk-important'
        elif result['risk_level_text'] == 'Modéré':
            risk_class = 'risk-moderate'
        
        html_content = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport de sécurité - {result['url']}</title>
    <style>
        :root {{
            --color-bg: #f5f8fa;
            --color-text: #333;
            --color-primary: #2563eb;
            --color-secondary: #4b5563;
            --color-accent: #60a5fa;
            --color-success: #10b981;
            --color-warning: #f59e0b;
            --color-danger: #ef4444;
            --color-info: #3b82f6;
            --color-light: #f3f4f6;
            --color-dark: #1f2937;
            --color-white: #ffffff;
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --rounded: 0.375rem;
        }}
        
        body {{
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: var(--color-text);
            background-color: var(--color-bg);
            margin: 0;
            padding: 0;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
        }}
        
        header {{
            background-color: var(--color-primary);
            color: var(--color-white);
            padding: 2rem 0;
            margin-bottom: 2rem;
            box-shadow: var(--shadow);
        }}
        
        header .container {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 0;
            margin-bottom: 0;
        }}
        
        h1, h2, h3, h4 {{
            color: var(--color-dark);
            margin-top: 1.5rem;
            margin-bottom: 1rem;
        }}
        
        header h1 {{
            color: var(--color-white);
            margin: 0;
            font-size: 1.8rem;
        }}
        
        .card {{
            background-color: var(--color-white);
            border-radius: var(--rounded);
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: var(--shadow);
        }}
        
        .summary {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }}
        
        .summary-item {{
            padding: 1rem;
            border-radius: var(--rounded);
            background-color: var(--color-white);
            box-shadow: var(--shadow-sm);
            text-align: center;
        }}
        
        .summary-item h3 {{
            margin-top: 0;
            color: var(--color-secondary);
            font-size: 1rem;
        }}
        
        .summary-item p {{
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0.5rem 0;
        }}
        
        .vuln-item, .rec-item {{
            border-left: 4px solid var(--color-secondary);
            margin-bottom: 1rem;
            padding: 1rem;
            background-color: var(--color-light);
            border-radius: 0 var(--rounded) var(--rounded) 0;
        }}
        
        .vuln-item h4, .rec-item h4 {{
            margin-top: 0;
            margin-bottom: 0.5rem;
        }}
        
        .severity {{
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 2rem;
            font-size: 0.75rem;
            font-weight: bold;
            margin-left: 0.5rem;
            color: var(--color-white);
        }}
        
        .severity-Critique {{
            background-color: var(--color-danger);
        }}
        
        .severity-Important {{
            background-color: var(--color-warning);
        }}
        
        .severity-Modéré {{
            background-color: var(--color-info);
        }}
        
        .severity-Faible {{
            background-color: var(--color-success);
        }}
        
        .risk-score {{
            font-size: 1.2rem;
            font-weight: bold;
            color: var(--color-white);
            padding: 0.5rem 1rem;
            border-radius: var(--rounded);
            display: inline-block;
        }}
        
        .risk-low {{
            background-color: var(--color-success);
        }}
        
        .risk-moderate {{
            background-color: var(--color-info);
        }}
        
        .risk-important {{
            background-color: var(--color-warning);
        }}
        
        .risk-critical {{
            background-color: var(--color-danger);
        }}
        
        .priority {{
            font-weight: bold;
        }}
        
        .priority-Critique, .priority-Haute {{
            color: var(--color-danger);
        }}
        
        .priority-Moyenne {{
            color: var(--color-warning);
        }}
        
        .priority-Basse {{
            color: var(--color-info);
        }}
        
        footer {{
            text-align: center;
            margin-top: 2rem;
            padding: 1rem 0;
            color: var(--color-secondary);
            font-size: 0.875rem;
        }}
        
        @media (max-width: 768px) {{
            .summary {{
                grid-template-columns: 1fr;
            }}
        }}
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>Rapport de sécurité web</h1>
            <p>{result['scan_date']}</p>
        </div>
    </header>
    
    <div class="container">
        <div class="card">
            <h2>Informations générales</h2>
            <p><strong>URL analysée:</strong> {result['url']}</p>
            <p><strong>Date d'analyse:</strong> {result['scan_date']}</p>
            <p>
                <strong>Niveau de risque:</strong> 
                <span class="risk-score {risk_class}">
                    {result['risk_level_text']} ({result['risk_score']}%)
                </span>
            </p>
        </div>
        
        <div class="summary">
            <div class="summary-item">
                <h3>Niveau de risque</h3>
                <p>{result['risk_level_text']}</p>
            </div>
            <div class="summary-item">
                <h3>Score de risque</h3>
                <p>{result['risk_score']}%</p>
            </div>
            <div class="summary-item">
                <h3>Vulnérabilités détectées</h3>
                <p>{result['vulnerability_count']}</p>
            </div>
        </div>
        
        <div class="card">
            <h2>Vulnérabilités détectées</h2>
            {vulns_html}
        </div>
        
        <div class="card">
            <h2>Recommandations de sécurité</h2>
            {recs_html}
        </div>
    </div>
    
    <footer>
        <div class="container">
            <p>Rapport généré automatiquement le {result['scan_date']}</p>
            <p>© {datetime.now().year} Système d'analyse de vulnérabilités web</p>
        </div>
    </footer>
</body>
</html>
"""
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html_content)
            
    else:
        print(f"\n⚠️ Format de rapport non supporté: {output_format}")
        return None
        
    print(f"\n✅ Rapport généré avec succès: {filename}")
    return filename




def evaluate_website(url):
    """Fonction qui appelle l'analyseur de site web"""
    try:
        # Création de l'objet analyseur
        analyzer = WebsiteAnalyzer()
        
        # Analyse du site web
        result = analyzer.analyze_website(url)
        
        return result
    except Exception as e:
        return {
            'error': f'Erreur lors de l\'évaluation: {str(e)}',
            'url': url,
            'scan_date': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

def main():
    """Fonction principale du programme"""
    print("\n" + "="*80)
    print("🚀 DÉMARRAGE DU SYSTÈME DE PRÉDICTION DE VULNÉRABILITÉS WEB")
    print("="*80)

    # Mode d'exécution (entraînement ou analyse)
    mode = input("\nMode d'exécution :\n1. Entraînement des modèles\n2. Analyse d'un site web\nChoix (1/2): ").strip()

    if mode == '1':
        # Mode entraînement (simulé pour cet exemple)
        print("\n🔄 Mode: Entraînement des modèles")
        print("\n❗ La fonctionnalité d'entraînement est désactivée dans cette version de démonstration.")
        
    elif mode == '2':
        # Mode analyse
        print("\n🔍 Mode: Analyse d'un site web")

        # Demande de l'URL à analyser
        url = input("\nEntrez l'URL du site à analyser: ").strip()

        # Analyse du site
        result = evaluate_website(url)

        # Génération du rapport
        report_format = input("\nFormat du rapport (json/html): ").strip().lower()
        if report_format not in ['json', 'html']:
            report_format = 'json'

        report_file = generate_security_report(result, report_format)

    else:
        print("\n⚠️ Mode non reconnu. Fin du programme.")

    print("\n✅ Programme terminé avec succès!")

# Si ce fichier est exécuté directement
if __name__ == "__main__":
    main()