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
    
    

class DataPreprocessor:
    """Classe pour le prétraitement des données de vulnérabilité"""

    def __init__(self, config=None):
        self.config = config or {
            'text_cleaning': True,
            'handle_missing': 'fill_empty',  # 'drop', 'fill_empty', 'fill_median'
            'scaling_method': 'standard',    # 'standard', 'minmax', 'robust'
            'feature_selection': True,
            'n_features': 20,
            'stemming': True,
            'language': 'french',
            'apply_smote': False
        }
        # Explicitly set stemming as an attribute
        self.stemming = self.config['stemming']
        self.scaler = None
        self.feature_selector = None

        # Téléchargement des données NLTK si nécessaire
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')

        try:
            nltk.data.find('corpora/stopwords')
        except LookupError:
            nltk.download('stopwords')

        self.stemmer = SnowballStemmer(self.config['language']) if self.stemming else None
        self.stop_words = list(stopwords.words(self.config['language'])) if self.stemming else None
        self.stemmer = SnowballStemmer(self.config['language']) if self.stemming else None
        self.stop_words = list(stopwords.words(self.config['language'])) if self.stemming else None


    def load_and_preprocess(self, file_path):
        """Charge et prétraite les données depuis un fichier CSV"""
        print(f"\n📂 Chargement des données depuis: {file_path}...")
        try:
            df = pd.read_csv(file_path)
            print(f"   ✓ Données chargées: {df.shape[0]} entrées, {df.shape[1]} colonnes")
        except FileNotFoundError:
            raise FileNotFoundError(f"⚠️ Fichier non trouvé: {file_path}")
        except Exception as e:
            raise Exception(f"⚠️ Erreur lors du chargement du fichier: {e}")



        # Prétraitement
        print("   - Prétraitement des données...")
        df = self.handle_missing_values(df)

        # Normalisation des niveaux de risque et d'impact (added code)
        risk_level_map = {
            'Critique': 3,
            'Important': 2,
            'Modéré': 1,
            'No Risk Level': 0  # Include mapping for 'No Risk Level' if present
        }

        impact_level_map = {
            'Critique': 3,
            'Important': 2,
            'Modéré': 1,
            'No Impact Level': 0  # Include mapping for 'No Impact Level' if present
        }

        df['Risk Level Numeric'] = df['Risk Level'].map(risk_level_map)
        df['Impact Level Numeric'] = df['Impact Level'].map(impact_level_map)

        # Combiner les colonnes de texte pour l'extraction des caractéristiques
        df['Combined_Text'] = df['Vulnerability Summary'] + ' ' + df['Affected Systems'] + ' ' + df['Solution']

        # Convertir en minuscules et supprimer les caractères spéciaux (facultatif)
        if self.config['text_cleaning']:
            df['Combined_Text'] = df['Combined_Text'].apply(self.clean_text)

        print("   ✓ Données prétraitées.")
        return df




    def handle_missing_values(self, df):
        """Gère les valeurs manquantes dans le DataFrame"""
        if self.config['handle_missing'] == 'drop':
           df = df.dropna()
        elif self.config['handle_missing'] == 'fill_empty':
        # Fill missing values with empty strings for string columns only
             for col in df.select_dtypes(include=['object']).columns:
                 df[col] = df[col].fillna('')
        # Fill missing values with 0 for numeric columns only
             for col in df.select_dtypes(include=np.number).columns:
                 df[col] = df[col].fillna(0)
        elif self.config['handle_missing'] == 'fill_median':
             for col in df.select_dtypes(include=np.number).columns:
                 df[col] = df[col].fillna(df[col].median())
        return df




    def clean_text(self, text):
        """Nettoie le texte en supprimant les caractères spéciaux et en convertissant en minuscules"""
        text = text.lower()
        text = re.sub(r'[^\w\s]', '', text)  # Supprime les caractères spéciaux
        text = text.strip()
        if self.stemming:  # Applique le stemming si activé
            tokens = nltk.word_tokenize(text)
            stemmed_tokens = [self.stemmer.stem(token) for token in tokens if token not in self.stop_words]
            text = ' '.join(stemmed_tokens)
        return text

    def extract_features(self, df):
        """Extrait des caractéristiques pour l'analyse de vulnérabilité"""
        print("\n🔧 Extraction des caractéristiques...")

         # Vérification des NaN dans Risk Level Numeric avant tout traitement
        if df['Risk Level Numeric'].isna().any():
            print("   ⚠️ Valeurs manquantes détectées dans Risk Level Numeric. Remplacement par 0...")
            df['Risk Level Numeric'] = df['Risk Level Numeric'].fillna(0)

    # Caractéristiques textuelles
        if 'Combined_Text' in df.columns:
           text_column = 'Combined_Text'
        else:
           text_column = 'Vulnerability Summary'

        print(f"   - Utilisation de la colonne '{text_column}' pour l'extraction textuelle")

    # Vectorisation des descriptions
        tfidf = TfidfVectorizer(max_features=1000, stop_words=self.stop_words)
        X_text = tfidf.fit_transform(df[text_column])
        print(f"   ✓ Caractéristiques textuelles extraites: {X_text.shape[1]} dimensions")

    # Enregistrement du vectoriseur
        joblib.dump(tfidf, 'models/tfidf_vectorizer.pkl')

    # Extraction de caractéristiques basées sur les règles
        features = []
        print("   - Extraction des caractéristiques basées sur les règles...")

        for idx, row in tqdm(df.iterrows(), total=df.shape[0], desc="   🔄 Traitement des entrées"):
           affected_systems = str(row['Affected Systems']).lower()
           vuln_summary = str(row['Vulnerability Summary']).lower()

           feature_dict = {
                # Systèmes affectés
                'has_windows': 1 if 'windows' in affected_systems else 0,
                'has_linux': 1 if 'linux' in affected_systems else 0,
                'has_macos': 1 if ('macos' in affected_systems or 'mac os' in affected_systems) else 0,
                'has_android': 1 if 'android' in affected_systems else 0,
                'has_ios': 1 if ('ios' in affected_systems or 'iphone' in affected_systems or 'ipad' in affected_systems) else 0,
                'has_wordpress': 1 if 'wordpress' in affected_systems else 0,
                'has_joomla': 1 if 'joomla' in affected_systems else 0,
                'has_drupal': 1 if 'drupal' in affected_systems else 0,
                'has_oracle': 1 if 'oracle' in affected_systems else 0,
                'has_microsoft': 1 if 'microsoft' in affected_systems else 0,
                'has_adobe': 1 if 'adobe' in affected_systems else 0,
                'has_plugin': 1 if 'plugin' in affected_systems or 'extension' in affected_systems else 0,
                'has_server': 1 if 'server' in affected_systems or 'serveur' in affected_systems else 0,
                'has_web': 1 if 'web' in affected_systems else 0,
                'has_mobile': 1 if 'mobile' in affected_systems else 0,
                'has_iot': 1 if 'iot' in affected_systems or 'internet of things' in affected_systems else 0,
                'has_cloud': 1 if 'cloud' in affected_systems or 'aws' in affected_systems or 'azure' in affected_systems else 0,

                # Types de vulnérabilités
                'has_injection': 1 if 'injection' in vuln_summary else 0,
                'has_xss': 1 if 'xss' in vuln_summary or 'cross-site' in vuln_summary or 'script' in vuln_summary else 0,
                'has_sql': 1 if 'sql' in vuln_summary else 0,
                'has_authentication': 1 if 'authentification' in vuln_summary or 'authentication' in vuln_summary else 0,
                'has_authorization': 1 if 'autorisation' in vuln_summary or 'authorization' in vuln_summary else 0,
                'has_privilege': 1 if 'privilège' in vuln_summary or 'privilege' in vuln_summary else 0,
                'has_code_execution': 1 if 'exécution de code' in vuln_summary or 'code execution' in vuln_summary else 0,
                'has_arbitrary_code': 1 if 'arbitraire' in vuln_summary or 'arbitrary' in vuln_summary else 0,
                'has_buffer': 1 if 'buffer' in vuln_summary or 'tampon' in vuln_summary else 0,
                'has_overflow': 1 if 'overflow' in vuln_summary or 'débordement' in vuln_summary else 0,
                'has_dos': 1 if 'déni de service' in vuln_summary or 'denial of service' in vuln_summary or 'dos' in vuln_summary else 0,
                'has_csrf': 1 if 'csrf' in vuln_summary or 'cross-site request' in vuln_summary else 0,
                'has_path_traversal': 1 if 'path traversal' in vuln_summary or 'directory traversal' in vuln_summary else 0,
                'has_file_inclusion': 1 if 'file inclusion' in vuln_summary or 'inclusion de fichier' in vuln_summary else 0,
                'has_encryption': 1 if 'encryption' in vuln_summary or 'chiffrement' in vuln_summary else 0,
                'has_ssl': 1 if 'ssl' in vuln_summary or 'tls' in vuln_summary else 0,
                'has_mitm': 1 if 'man in the middle' in vuln_summary or 'mitm' in vuln_summary or 'homme du milieu' in vuln_summary else 0,
                'has_bypass': 1 if 'bypass' in vuln_summary or 'contournement' in vuln_summary else 0,
                'has_backdoor': 1 if 'backdoor' in vuln_summary or 'porte dérobée' in vuln_summary else 0,
                'has_zero_day': 1 if 'zero day' in vuln_summary or 'zero-day' in vuln_summary or '0-day' in vuln_summary else 0,

                # Métriques existantes
                'risk_level': row['Risk Level Numeric'],
                'impact_level': row['Impact Level Numeric']
            }

           features.append(feature_dict)

        # Conversion en DataFrame
        X_features = pd.DataFrame(features)
        print(f"   ✓ Caractéristiques basées sur les règles extraites: {X_features.shape[1]} dimensions")

         # Vérifier et traiter les valeurs NaN AVANT le scaling
        if X_features.isna().any().any():
           print("   ⚠️ Valeurs manquantes détectées dans les caractéristiques. Remplacement par 0...")
           X_features = X_features.fillna(0)  # Remplacer toutes les valeurs NaN par 0

        # Application du scaling
        if self.config['scaling_method'] == 'standard':
            self.scaler = StandardScaler()
        elif self.config['scaling_method'] == 'minmax':
            self.scaler = MinMaxScaler()
        elif self.config['scaling_method'] == 'robust':
            self.scaler = RobustScaler()
        else:
            self.scaler = StandardScaler()

        X_features_scaled = self.scaler.fit_transform(X_features)
        print(f"   ✓ Scaling appliqué: {self.config['scaling_method']}")

        # Enregistrement du scaler
        joblib.dump(self.scaler, 'models/feature_scaler.pkl')



         # Lorsque vous arrivez à SelectKBest, utilisez la variable df mise à jour:
        if self.config['feature_selection'] and X_features.shape[1] > self.config['n_features']:
            print(f"   - Sélection des {self.config['n_features']} meilleures caractéristiques...")

            self.feature_selector = SelectKBest(f_classif, k=self.config['n_features'])
        # Utiliser df['Risk Level Numeric'] qui a déjà été nettoyé des NaN
            X_features_selected = self.feature_selector.fit_transform(X_features_scaled, df['Risk Level Numeric'])

            # Enregistrement du sélecteur
            joblib.dump(self.feature_selector, 'models/feature_selector.pkl')

            print(f"   ✓ Sélection de caractéristiques appliquée: {X_features_selected.shape[1]} dimensions retenues")

            # Récupérer et afficher les noms des caractéristiques sélectionnées
            selected_indices = self.feature_selector.get_support(indices=True)
            selected_features = X_features.columns[selected_indices].tolist()
            print(f"   📋 Caractéristiques sélectionnées: {selected_features}")

            return X_features_selected, X_text, selected_features
        else:
            return X_features_scaled, X_text, X_features.columns.tolist()

    def apply_sampling(self, X, y):
        """Applique des techniques de sur-échantillonnage ou sous-échantillonnage"""
        if not self.config['apply_smote']:
            return X, y

        print("\n⚖️ Application de techniques d'équilibrage des classes...")

        # Affichage de la distribution initiale
        class_counts = pd.Series(y).value_counts().sort_index()
        print(f"   - Distribution initiale des classes: {class_counts.to_dict()}")

        # Application de SMOTE
        smote = SMOTE(random_state=42)
        X_resampled, y_resampled = smote.fit_resample(X, y)

        # Affichage de la distribution après SMOTE
        class_counts_after = pd.Series(y_resampled).value_counts().sort_index()
        print(f"   ✓ Distribution après SMOTE: {class_counts_after.to_dict()}")

        return X_resampled, y_resampled