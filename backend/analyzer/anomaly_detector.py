import json
import os
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor  # Attention: c'est dans sklearn.neighbors, pas sklearn.ensemble
from sklearn.decomposition import PCA
import pandas as pd
from DataDriven_WebSecure.backend.analyzer.data_preprocessor import DataPreprocessor
from DataDriven_WebSecure.backend.analyzer.deep_learning_classifier import DeepLearningClassifier
from DataDriven_WebSecure.backend.analyzer.model_trainer import MultiModelTrainer
from DataDriven_WebSecure.backend.analyzer.website_analyzer import WebsiteAnalyzer
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
    
    
class AnomalyDetector:
    """Classe pour la détection d'anomalies et l'identification de vulnérabilités rares"""

    def __init__(self, config=None):
        self.config = config or {
            'isolation_forest': {
                'enabled': True,
                'params': {
                    'n_estimators': 100,
                    'contamination': 0.05,
                    'random_state': 42
                }
            },
            'local_outlier_factor': {
                'enabled': True,
                'params': {
                    'n_neighbors': 20,
                    'contamination': 0.05
                }
            },
            'one_class_svm': {
                'enabled': False,
                'params': {
                    'kernel': 'rbf',
                    'nu': 0.05,
                    'gamma': 'scale'
                }
            }
        }

        self.models = {}
        self.best_model = None
        self.best_model_name = None

    def train_anomaly_models(self, X):
        """Entraîne les modèles de détection d'anomalies"""
        print("\n🔍 Entraînement des modèles de détection d'anomalies...")

    # Isolation Forest
        if 'isolation_forest' in self.config and self.config['isolation_forest']['enabled']:
            print("   - Entraînement d'Isolation Forest...")
            iso_forest = IsolationForest(**self.config['isolation_forest']['params'])
            iso_forest.fit(X)
            self.models['isolation_forest'] = iso_forest
            joblib.dump(iso_forest, 'models/isolation_forest_model.pkl')
            print("   ✓ Modèle Isolation Forest enregistré")

        # Définir comme meilleur modèle par défaut si c'est le premier
        if self.best_model is None:
            self.best_model = iso_forest
            self.best_model_name = 'isolation_forest'

    # Local Outlier Factor
        if 'local_outlier_factor' in self.config and self.config['local_outlier_factor']['enabled']:
            print("   - Entraînement de Local Outlier Factor...")
            lof = LocalOutlierFactor(**self.config['local_outlier_factor']['params'])
        # LOF a besoin d'être ajusté et ne peut pas être utilisé directement pour prédire de nouvelles données
        # Nous allons donc l'entraîner sur les données d'entraînement et sauvegarder le modèle
            lof.fit_predict(X)
            self.models['local_outlier_factor'] = lof
            joblib.dump(lof, 'models/local_outlier_factor_model.pkl')
            print("   ✓ Modèle Local Outlier Factor enregistré")

    # One-Class SVM - vérifier si la clé existe
        if 'one_class_svm' in self.config and self.config['one_class_svm']['enabled']:
            try:
               from sklearn.svm import OneClassSVM
               print("   - Entraînement de One-Class SVM...")
               ocsvm = OneClassSVM(**self.config['one_class_svm']['params'])
               ocsvm.fit(X)
               self.models['one_class_svm'] = ocsvm
               joblib.dump(ocsvm, 'models/one_class_svm_model.pkl')
               print("   ✓ Modèle One-Class SVM enregistré")
            except Exception as e:
               print(f"   ⚠️ Erreur lors de l'entraînement de One-Class SVM: {e}")

    # Enregistrement du meilleur modèle (par défaut, Isolation Forest)
        if self.best_model is not None:
          joblib.dump(self.best_model, 'models/best_anomaly_model.pkl')
          with open('models/best_anomaly_model_name.txt', 'w') as f:
               f.write(self.best_model_name)

        return self.models

    def visualize_anomaly_detection(self, X, model_name='isolation_forest'):
        """Visualise les résultats de la détection d'anomalies"""
        if model_name not in self.models:
            print(f"⚠️ Modèle {model_name} non trouvé.")
            return

        print(f"\n📊 Visualisation des anomalies détectées par {model_name}...")

        # Réduire la dimensionnalité pour visualisation
        pca = PCA(n_components=2)
        X_2d = pca.fit_transform(X)

        # Prédiction des anomalies
        if model_name == 'isolation_forest':
            y_pred = self.models[model_name].predict(X)
        elif model_name == 'local_outlier_factor':
            # Pour LOF, nous utilisons les scores de nouveauté
            y_pred = self.models[model_name].fit_predict(X)
        else:
            y_pred = self.models[model_name].predict(X)

        # Conversion des valeurs prédites (-1 pour anomalie, 1 pour normal)
        anomalies = y_pred == -1

        # Création d'un dataframe pour visualisation
        df_viz = pd.DataFrame({
            'PC1': X_2d[:, 0],
            'PC2': X_2d[:, 1],
            'Anomalie': anomalies
        })

        # Calcul du pourcentage d'anomalies
        anomaly_percentage = (anomalies.sum() / len(anomalies)) * 100

        # Visualisation
        plt.figure(figsize=(10, 8))
        sns.scatterplot(x='PC1', y='PC2', hue='Anomalie', data=df_viz, palette={False: 'blue', True: 'red'})
        plt.title(f'Détection d\'anomalies - {model_name}\n{anomalies.sum()} anomalies détectées ({anomaly_percentage:.2f}%)')
        plt.legend(['Normal', 'Anomalie'])
        plt.savefig(f'models/anomaly_detection_{model_name}.png')
        plt.close()

        print(f"   ✓ {anomalies.sum()} anomalies détectées ({anomaly_percentage:.2f}%)")
        return df_viz



def create_directory_structure():
    """Crée la structure de répertoires nécessaire pour le projet"""
    print("\n📂 Création de la structure de répertoires...")

    # Liste des répertoires à créer
    directories = [
        'models',
        'data',
        'reports',
        'logs',
        'static',
        'static/img',
        'templates'
    ]

    # Création des répertoires
    for directory in directories:
        os.makedirs(directory, exist_ok=True)

    print("   ✓ Structure de répertoires créée")

def generate_security_report(result, output_format='json'):
    """Génère un rapport de sécurité dans le format spécifié"""
    print("\n📝 Génération du rapport de sécurité...")

    if output_format == 'json':
        # Enregistrement du rapport au format JSON
        report_file = f"reports/security_report_{result['url'].replace('://', '_').replace('/', '_').replace('.', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, 'w') as f:
            json.dump(result, f, indent=4)
        print(f"   ✓ Rapport JSON enregistré: {report_file}")
        return report_file
    elif output_format == 'html':
        # Création d'un rapport HTML simple
        report_file = f"reports/security_report_{result['url'].replace('://', '_').replace('/', '_').replace('.', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"

        # Template HTML basique
        html_template = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Rapport de sécurité - {result['url']}</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; }}
                h1, h2, h3 {{ color: #333; }}
                .header {{ background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }}
                .risk-score {{ font-size: 24px; font-weight: bold; }}
                .risk-critical {{ color: #dc3545; }}
                .risk-important {{ color: #fd7e14; }}
                .risk-moderate {{ color: #ffc107; }}
                .risk-low {{ color: #28a745; }}
                .vulnerability {{ margin: 10px 0; padding: 15px; border-radius: 5px; }}
                .vulnerability-critical {{ background-color: #f8d7da; border-left: 5px solid #dc3545; }}
                .vulnerability-important {{ background-color: #fff3cd; border-left: 5px solid #fd7e14; }}
                .vulnerability-moderate {{ background-color: #fff3cd; border-left: 5px solid #ffc107; }}
                .recommendation {{ margin: 10px 0; padding: 15px; background-color: #e9ecef; border-radius: 5px; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Rapport de sécurité web</h1>
                <p><strong>URL analysée:</strong> {result['url']}</p>
                <p><strong>Date d'analyse:</strong> {result['scan_date']}</p>
                <p class="risk-score {
                    'risk-critical' if result['risk_level_text'] == 'Critique' else
                    'risk-important' if result['risk_level_text'] == 'Important' else
                    'risk-moderate' if result['risk_level_text'] == 'Modéré' else
                    'risk-low'
                }">
                    Niveau de risque: {result['risk_level_text']} ({result['risk_score']}%)
                </p>
                <p><strong>Anomalie détectée:</strong> {'Oui' if result['is_anomaly'] else 'Non'}</p>
            </div>

            <h2>Vulnérabilités détectées ({result['vulnerability_count']})</h2>
        """

        # Ajout des vulnérabilités
        if result['vulnerability_count'] > 0:
            for vuln in result['vulnerabilities']:
                severity_class = 'vulnerability-critical' if vuln['severity'] == 'Critique' else \
                                'vulnerability-important' if vuln['severity'] == 'Important' else \
                                'vulnerability-moderate'
                html_template += f"""
                <div class="vulnerability {severity_class}">
                    <h3>{vuln['name']}</h3>
                    <p>{vuln['description']}</p>
                    <p><strong>Sévérité:</strong> {vuln['severity']}</p>
                </div>
                """
        else:
            html_template += "<p>Aucune vulnérabilité détectée.</p>"

        # Ajout des recommandations
        html_template += "<h2>Recommandations de sécurité</h2>"

        if result['recommendations']:
            for rec in result['recommendations']:
                html_template += f"""
                <div class="recommendation">
                    <h3>{rec['title']}</h3>
                    <p>{rec['description']}</p>
                    <p><strong>Priorité:</strong> {rec['priority']}</p>
                </div>
                """
        else:
            html_template += "<p>Aucune recommandation spécifique.</p>"

        # Ajout des probabilités
        html_template += """
            <h2>Probabilités par niveau de risque</h2>
            <table border="1" cellpadding="5" cellspacing="0">
                <tr>
                    <th>Niveau</th>
                    <th>Probabilité</th>
                </tr>
        """

        for level, prob in result['probability'].items():
            html_template += f"""
                <tr>
                    <td>{level}</td>
                    <td>{prob:.2f}</td>
                </tr>
            """

        html_template += """
            </table>

            <div style="margin-top: 30px; text-align: center; color: #6c757d;">
                <p>Rapport généré par le système de prédiction de vulnérabilités web.</p>
                <p>© 2025 Direction Générale de la Sécurité des Systèmes d'Information</p>
            </div>
        </body>
        </html>
        """

        # Enregistrement du rapport HTML
        with open(report_file, 'w') as f:
            f.write(html_template)

        print(f"   ✓ Rapport HTML enregistré: {report_file}")
        return report_file
    else:
        print(f"⚠️ Format de rapport non pris en charge: {output_format}")
        return None

def train_complete_pipeline(data_file, config=None):
    """Exécute le pipeline complet d'entraînement des modèles"""
    # Configuration par défaut
    default_config = {
        'preprocessing': {
            'text_cleaning': True,
            'handle_missing': 'fill_empty',
            'scaling_method': 'standard',
            'feature_selection': True,
            'n_features': 20,
            'stemming': True,
            'language': 'french',
            'apply_smote': False
        },
        'models': {
            'random_forest': {
                'enabled': True,
                'params': {'n_estimators': 100, 'random_state': 42},
                'grid_search': False
            },
            'xgboost': {
                'enabled': True,
                'params': {'n_estimators': 100, 'learning_rate': 0.1, 'random_state': 42},
                'grid_search': False
            },
            'gradient_boosting': {
                'enabled': True,
                'params': {'n_estimators': 100, 'learning_rate': 0.1, 'random_state': 42},
                'grid_search': False
            },
            'logistic_regression': {
                'enabled': True,
                'params': {'C': 1.0, 'random_state': 42},
                'grid_search': False
            },
            'voting_ensemble': {
                'enabled': True,
                'estimators': ['random_forest', 'xgboost', 'gradient_boosting'],
                'voting': 'soft'
            }
        },
        'anomaly_detection': {
            'isolation_forest': {
                'enabled': True,
                'params': {'n_estimators': 100, 'contamination': 0.05, 'random_state': 42}
            },
            'local_outlier_factor': {
                'enabled': True,
                'params': {'n_neighbors': 20, 'contamination': 0.05}
            }
        },
        'deep_learning': {
            'enabled': False,
            'model_type': 'mlp',
            'dense_units': [128, 64],
            'dropout_rate': 0.3,
            'learning_rate': 0.001,
            'batch_size': 32,
            'epochs': 50
        }
    }

    # Fusion de la configuration personnalisée avec la configuration par défaut
    if config:
        # Fonction récursive pour fusionner des dictionnaires imbriqués
        def merge_dicts(d1, d2):
            for k, v in d2.items():
                if k in d1 and isinstance(d1[k], dict) and isinstance(v, dict):
                    merge_dicts(d1[k], v)
                else:
                    d1[k] = v
            return d1

        config = merge_dicts(default_config.copy(), config)
    else:
        config = default_config

    # Création de la structure de répertoires
    create_directory_structure()

    # Prétraitement des données
    preprocessor = DataPreprocessor(config['preprocessing'])
    df = preprocessor.load_and_preprocess(data_file)

    # Extraction des caractéristiques
    X_features, X_text, selected_features = preprocessor.extract_features(df)

    # Préparation des données pour l'entraînement
    X = X_features  # Nous utilisons uniquement les caractéristiques basées sur les règles pour simplifier
    y = df['Risk Level Numeric'].values

    # Application de techniques de rééchantillonnage si configuré
    if config['preprocessing']['apply_smote']:
        X, y = preprocessor.apply_sampling(X, y)

    # Entraînement des modèles de classification
    model_trainer = MultiModelTrainer(config['models'])
    model_results = model_trainer.train_and_evaluate(X, y, selected_features)

    # Entraînement des modèles de détection d'anomalies
    anomaly_detector = AnomalyDetector(config['anomaly_detection'])
    anomaly_models = anomaly_detector.train_anomaly_models(X)

    # Visualisation des résultats de détection d'anomalies
    anomaly_viz = anomaly_detector.visualize_anomaly_detection(X)

    # Entraînement du modèle de deep learning si activé
    if config['deep_learning']['enabled']:
        dl_classifier = DeepLearningClassifier(config['deep_learning'])
        dl_history = dl_classifier.train(X, y)

    print("\n✅ Pipeline d'entraînement complet terminé!")
    return {
        'preprocessor': preprocessor,
        'model_trainer': model_trainer,
        'anomaly_detector': anomaly_detector,
        'best_model_name': model_trainer.best_model_name,
        'best_score': model_trainer.best_score
    }

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



def handle_missing_values(self, df):
    """Gère les valeurs manquantes dans le DataFrame"""
    if self.config['handle_missing'] == 'drop':
        df = df.dropna()
    elif self.config['handle_missing'] == 'fill_empty':
        # Fill missing values with empty strings for string columns only
        string_cols = df.select_dtypes(include=['object']).columns
        df[string_cols] = df[string_cols].fillna('')
        # Impute numeric columns with 0
        numeric_cols = df.select_dtypes(include=np.number).columns
        df[numeric_cols] = df[numeric_cols].fillna(0)
    elif self.config['handle_missing'] == 'fill_median':
        for col in df.select_dtypes(include=np.number).columns:
             df[col] = df[col].fillna(df[col].median())
    return df