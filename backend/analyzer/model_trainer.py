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
    


class MultiModelTrainer:
    """Classe pour l'entraînement et l'évaluation de multiples modèles"""

    def __init__(self, models_config=None):
        self.models_config = models_config or {
            'random_forest': {
                'enabled': True,
                'params': {
                    'n_estimators': 100,
                    'max_depth': None,
                    'min_samples_split': 2,
                    'random_state': 42
                },
                'grid_search': False,
                'grid_params': {
                    'n_estimators': [50, 100, 200],
                    'max_depth': [None, 10, 20],
                    'min_samples_split': [2, 5, 10]
                }
            },
            'xgboost': {
                'enabled': True,
                'params': {
                    'n_estimators': 100,
                    'learning_rate': 0.1,
                    'max_depth': 5,
                    'random_state': 42
                },
                'grid_search': False,
                'grid_params': {
                    'n_estimators': [50, 100, 200],
                    'learning_rate': [0.01, 0.1, 0.2],
                    'max_depth': [3, 5, 7]
                }
            },
            'gradient_boosting': {
                'enabled': True,
                'params': {
                    'n_estimators': 100,
                    'learning_rate': 0.1,
                    'max_depth': 3,
                    'random_state': 42
                },
                'grid_search': False,
                'grid_params': {
                    'n_estimators': [50, 100, 200],
                    'learning_rate': [0.01, 0.1, 0.2],
                    'max_depth': [3, 5, 7]
                }
            },
            'logistic_regression': {
                'enabled': True,
                'params': {
                    'C': 1.0,
                    'random_state': 42
                },
                'grid_search': False
            },
            'voting_ensemble': {
                'enabled': True,
                'estimators': ['random_forest', 'xgboost', 'gradient_boosting'],
                'voting': 'soft'
            }
        }

        self.models = {}
        self.best_model_name = None
        self.best_model = None
        self.best_score = 0
        self.feature_importance = None

    def initialize_models(self):
        """Initialise tous les modèles configurés"""
        models = {}

        # Random Forest
        if self.models_config['random_forest']['enabled']:
            models['random_forest'] = RandomForestClassifier(**self.models_config['random_forest']['params'])

        # XGBoost
        if self.models_config['xgboost']['enabled']:
            models['xgboost'] = XGBClassifier(**self.models_config['xgboost']['params'])

        # Gradient Boosting
        if self.models_config['gradient_boosting']['enabled']:
            models['gradient_boosting'] = GradientBoostingClassifier(**self.models_config['gradient_boosting']['params'])

        # Logistic Regression
        if self.models_config['logistic_regression']['enabled']:
            models['logistic_regression'] = LogisticRegression(**self.models_config['logistic_regression']['params'])

        # Ajout du modèle d'ensemble si configuré
        if self.models_config['voting_ensemble']['enabled']:
            estimators = []
            for est_name in self.models_config['voting_ensemble']['estimators']:
                if est_name in models:
                    estimators.append((est_name, models[est_name]))

            if estimators:
                models['voting_ensemble'] = VotingClassifier(
                    estimators=estimators,
                    voting=self.models_config['voting_ensemble']['voting']
                )

        return models

    def train_and_evaluate(self, X, y, feature_names=None):
        """Entraîne et évalue tous les modèles configurés"""
        print("\n🤖 Entraînement et évaluation des modèles...")

        # Initialisation des modèles
        self.models = self.initialize_models()

        if not self.models:
            print("⚠️ Aucun modèle configuré pour l'entraînement")
            return

        # Division des données
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        print(f"   - Données divisées: {X_train.shape[0]} exemples d'entraînement, {X_test.shape[0]} exemples de test")

        # Entraînement et évaluation de chaque modèle
        results = {}

        for name, model in self.models.items():
            start_time = time.time()
            print(f"\n   🔄 Entraînement du modèle: {name}...")

            # Vérification si Grid Search est activé
            grid_search_config = self.models_config.get(name, {}).get('grid_search', False)
            grid_params = self.models_config.get(name, {}).get('grid_params', {})

            if grid_search_config and grid_params:
                print(f"      - Application de Grid Search avec {len(grid_params)} paramètres")
                grid_search = GridSearchCV(
                    model,
                    grid_params,
                    cv=StratifiedKFold(n_splits=5),
                    scoring='f1_weighted',
                    n_jobs=-1
                )
                grid_search.fit(X_train, y_train)
                model = grid_search.best_estimator_
                print(f"      ✓ Meilleurs paramètres: {grid_search.best_params_}")
            else:
                model.fit(X_train, y_train)

            # Prédictions
            y_pred = model.predict(X_test)

            # Calcul des métriques
            accuracy = accuracy_score(y_test, y_pred)
            f1 = f1_score(y_test, y_pred, average='weighted')

            # Temps d'entraînement
            training_time = time.time() - start_time

            # Stockage des résultats
            results[name] = {
                'model': model,
                'accuracy': accuracy,
                'f1_score': f1,
                'training_time': training_time
            }

            # Affichage du rapport de classification
            print(f"      ✓ Entraînement terminé en {training_time:.2f} secondes")
            print(f"      ✓ Accuracy: {accuracy:.4f}")
            print(f"      ✓ F1-Score: {f1:.4f}")
            print("\n      📊 Rapport de classification:")
            print(classification_report(y_test, y_pred))

            # Matrice de confusion
            cm = confusion_matrix(y_test, y_pred)
            plt.figure(figsize=(8, 6))
            sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                        xticklabels=['Faible', 'Modéré', 'Important', 'Critique'],
                        yticklabels=['Faible', 'Modéré', 'Important', 'Critique'])
            plt.title(f'Matrice de confusion - {name}')
            plt.ylabel('Valeur réelle')
            plt.xlabel('Valeur prédite')
            plt.tight_layout()
            plt.savefig(f'models/confusion_matrix_{name}.png')
            plt.close()

            # Importance des caractéristiques si disponible
            if hasattr(model, 'feature_importances_') and feature_names is not None:
                feature_importance = pd.DataFrame({
                    'Feature': feature_names,
                    'Importance': model.feature_importances_
                }).sort_values('Importance', ascending=False)

                # Ploter les 20 premières caractéristiques les plus importantes
                plt.figure(figsize=(10, 8))
                sns.barplot(x='Importance', y='Feature', data=feature_importance.head(20))
                plt.title(f'Importance des caractéristiques - {name}')
                plt.tight_layout()
                plt.savefig(f'models/feature_importance_{name}.png')
                plt.close()

                # Sauvegarder l'importance des caractéristiques pour le meilleur modèle
                if f1 > self.best_score:
                    self.feature_importance = feature_importance

            # Sauvegarder le modèle
            joblib.dump(model, f'models/{name}_model.pkl')

            # Mise à jour du meilleur modèle
            if f1 > self.best_score:
                self.best_score = f1
                self.best_model_name = name
                self.best_model = model

        # Rapport final
        print("\n📋 Résumé des performances des modèles:")
        results_df = pd.DataFrame({
            'Modèle': list(results.keys()),
            'Accuracy': [results[model]['accuracy'] for model in results],
            'F1-Score': [results[model]['f1_score'] for model in results],
            'Temps (s)': [results[model]['training_time'] for model in results]
        }).sort_values('F1-Score', ascending=False)

        print(results_df)

        # Enregistrement du meilleur modèle
        if self.best_model is not None:
            print(f"\n🏆 Meilleur modèle: {self.best_model_name} (F1-Score: {self.best_score:.4f})")
            joblib.dump(self.best_model, 'models/best_model.pkl')

            # Sauvegarde du meilleur nom de modèle
            with open('models/best_model_name.txt', 'w') as f:
                f.write(self.best_model_name)

        return results