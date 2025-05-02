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
    

class DeepLearningClassifier:
    """Classe pour l'utilisation de modèles de deep learning pour la classification de vulnérabilités"""

    def __init__(self, config=None):
        self.config = config or {
            'enabled': False,
            'model_type': 'mlp',  # 'mlp', 'lstm', 'cnn'
            'embedding_size': 100,
            'lstm_units': 64,
            'dense_units': [128, 64],
            'dropout_rate': 0.3,
            'learning_rate': 0.001,
            'batch_size': 32,
            'epochs': 50,
            'early_stopping': True,
            'patience': 5
        }

        self.model = None
        self.history = None

    def build_mlp_model(self, input_shape, num_classes):
        """Construit un modèle MLP pour la classification"""
        model = Sequential()

        # Couche d'entrée
        model.add(Dense(self.config['dense_units'][0], activation='relu', input_shape=(input_shape,)))
        model.add(Dropout(self.config['dropout_rate']))

        # Couches cachées
        for units in self.config['dense_units'][1:]:
            model.add(Dense(units, activation='relu'))
            model.add(Dropout(self.config['dropout_rate']))

        # Couche de sortie
        model.add(Dense(num_classes, activation='softmax'))

        # Compilation
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=self.config['learning_rate']),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )

        return model

    def train(self, X, y):
        """Entraîne le modèle de deep learning"""
        if not self.config['enabled']:
            print("⚠️ Le modèle de deep learning n'est pas activé dans la configuration.")
            return None

        print("\n🧠 Entraînement du modèle de deep learning...")

        # Division des données
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

        # Construction du modèle
        if self.config['model_type'] == 'mlp':
            self.model = self.build_mlp_model(X.shape[1], len(np.unique(y)))
        else:
            print(f"⚠️ Type de modèle non pris en charge: {self.config['model_type']}")
            return None

        # Callbacks
        callbacks = []
        if self.config['early_stopping']:
            early_stopping = tf.keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=self.config['patience'],
                restore_best_weights=True
            )
            callbacks.append(early_stopping)

        # Entraînement
        self.history = self.model.fit(
            X_train, y_train,
            batch_size=self.config['batch_size'],
            epochs=self.config['epochs'],
            validation_data=(X_test, y_test),
            callbacks=callbacks,
            verbose=1
        )

        # Évaluation
        loss, accuracy = self.model.evaluate(X_test, y_test)
        print(f"   ✓ Loss: {loss:.4f}")
        print(f"   ✓ Accuracy: {accuracy:.4f}")

        # Prédictions
        y_pred = np.argmax(self.model.predict(X_test), axis=1)

        # Rapport de classification
        print("\n   📊 Rapport de classification:")
        print(classification_report(y_test, y_pred))

        # Matrice de confusion
        cm = confusion_matrix(y_test, y_pred)
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                   xticklabels=['Faible', 'Modéré', 'Important', 'Critique'],
                   yticklabels=['Faible', 'Modéré', 'Important', 'Critique'])
        plt.title('Matrice de confusion - Deep Learning')
        plt.ylabel('Valeur réelle')
        plt.xlabel('Valeur prédite')
        plt.tight_layout()
        plt.savefig('models/confusion_matrix_deep_learning.png')
        plt.close()

        # Courbe d'apprentissage
        plt.figure(figsize=(12, 5))

        plt.subplot(1, 2, 1)
        plt.plot(self.history.history['accuracy'])
        plt.plot(self.history.history['val_accuracy'])
        plt.title('Précision du modèle')
        plt.ylabel('Précision')
        plt.xlabel('Époque')
        plt.legend(['Train', 'Validation'], loc='lower right')

        plt.subplot(1, 2, 2)
        plt.plot(self.history.history['loss'])
        plt.plot(self.history.history['val_loss'])
        plt.title('Perte du modèle')
        plt.ylabel('Perte')
        plt.xlabel('Époque')
        plt.legend(['Train', 'Validation'], loc='upper right')

        plt.tight_layout()
        plt.savefig('models/learning_curve_deep_learning.png')
        plt.close()

        # Sauvegarde du modèle
        self.model.save('models/deep_learning_model')
        print("   ✓ Modèle de deep learning enregistré")

        return self.history