# WebSecure

![WebSecure Logo](frontend/assets/img/logo.svg)

## Présentation

WebSecure est une plateforme avancée d'analyse de vulnérabilités web qui combine l'intelligence artificielle et l'apprentissage automatique pour détecter les failles de sécurité dans les sites web. Cette application permet d'identifier les risques potentiels, d'évaluer le niveau de sécurité global et de fournir des recommandations personnalisées pour améliorer la protection de votre présence en ligne.

## Approche Data-Driven

Ce projet s'inscrit dans une démarche d'analyse basée sur les données (Data-Driven) pour la cybersécurité:

- **Collecte de données réelles**: Nous avons réalisé un web scraping des rapports de la DGSS (Direction Générale de la Sécurité des Systèmes d'Information) concernant les vulnérabilités web pour constituer un jeu de données authentique.
- **Prétraitement et enrichissement**: Les données brutes ont été nettoyées, structurées et enrichies pour créer un dataset CSV exploitable par nos modèles d'IA.
- **Entraînement de modèles prédictifs**: Des algorithmes d'apprentissage automatique, notamment XGBoost, ont été entraînés sur ces données réelles pour prédire avec précision la présence et la sévérité des vulnérabilités.
- **Validation et amélioration continue**: Les performances des modèles sont constamment évaluées et améliorées pour garantir des prédictions fiables.

Cette approche nous permet d'offrir des analyses de sécurité basées sur des menaces et vulnérabilités observées dans le monde réel, et non sur des règles statiques ou des hypothèses théoriques.

## Fonctionnalités

- **Analyse de sécurité web complète** : Détection des vulnérabilités comme XSS, CSRF, injections SQL, etc.
- **Évaluation des risques basée sur l'IA** : Score de risque et classification des vulnérabilités par sévérité
- **Extraction d'informations de site web** : Détection du logo, des technologies utilisées, et des métadonnées
- **Prédiction des risques futurs** : Estimation des probabilités d'attaques à venir
- **Rapports détaillés** : Visualisation des résultats avec graphiques et tableaux
- **Recommandations personnalisées** : Suggestions concrètes pour corriger les failles détectées
- **Export des rapports** : Formats HTML et JSON pour partage et archivage

## Captures d'écran

![Dashboard](frontend/assets/img/analyse.png)
![Rapport d'analyse](frontend/assets/img/Dashboard.png)
![Détection de vulnérabilités](frontend/assets/img/Home.png)

## Architecture technique

WebSecure est construit avec une architecture moderne et évolutive :

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5
- Chart.js pour les visualisations
- Interface responsive adaptée à tous les appareils

### Backend
- Python avec Flask
- Algorithmes d'apprentissage automatique (XGBoost, Random Forest)
- Analyse de sécurité web avancée
- API RESTful

### Modèles d'IA
- Détection d'anomalies
- Classification des vulnérabilités
- Prédiction des risques futurs
- Extraction intelligente d'informations de site web

## Pipeline de données et d'apprentissage automatique

1. **Collecte de données**: Web scraping des rapports de sécurité de la DGSS
2. **Prétraitement**: Nettoyage et structuration des données brutes
3. **Feature Engineering**: Extraction de caractéristiques pertinentes pour l'analyse de sécurité
4. **Entraînement**: Utilisation d'algorithmes XGBoost optimisés pour la détection de vulnérabilités
5. **Validation**: Évaluation des performances sur des datasets de test
6. **Déploiement**: Intégration des modèles entraînés dans l'application web
7. **Inférence**: Utilisation des modèles pour analyser de nouveaux sites en temps réel

## Installation

### Prérequis
- Python 3.8 ou supérieur
- Node.js (pour le développement frontend)
- pip et virtualenv

### Installation du backend

```bash
# Cloner le dépôt
git clone https://github.com/yousef-elgarch1/WebSecure.git
cd WebSecure/backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
python app.py
```

### Installation du frontend

```bash
# Dans un nouveau terminal, naviguer vers le dossier frontend
cd WebSecure/frontend

# Ouvrir index.html dans votre navigateur
# Ou utiliser un serveur HTTP simple
python -m http.server 8000
```

### Utilisation avec Google Colab (alternative)

WebSecure peut également être exécuté en utilisant Google Colab pour le backend, ce qui est particulièrement utile pour les modèles d'IA gourmands en ressources. Suivez les instructions du notebook Colab fourni dans le dossier `colab/`.

## Utilisation

1. Accédez à l'interface web (par défaut http://localhost:8000)
2. Entrez l'URL du site à analyser dans le formulaire d'analyse
3. Choisissez entre analyse rapide ou analyse approfondie
4. Consultez le rapport détaillé une fois l'analyse terminée
5. Explorez les vulnérabilités détectées et les recommandations
6. Exportez le rapport en format HTML ou JSON si nécessaire

## Structure du projet

```
WebSecure/
├── backend/               # Code du serveur Flask
│   ├── app.py             # Point d'entrée de l'application
│   ├── config.py          # Configuration
│   ├── feature_extractor.py  # Extraction de caractéristiques
│   ├── models/            # Modèles ML entraînés
│   ├── reports/           # Rapports générés
│   ├── risk_predictor.py  # Prédiction des risques
│   ├── security_analyzer.py  # Analyse de sécurité
│   ├── utils/             # Utilitaires
│   └── website_info_extractor.py  # Extraction d'infos de sites
│
├── frontend/              # Interface utilisateur
│   ├── assets/
│   │   ├── css/           # Feuilles de style
│   │   ├── img/           # Images et illustrations
│   │   └── js/            # Scripts JavaScript
│   ├── index.html         # Page d'accueil
│   ├── dashboard.html     # Tableau de bord
│   ├── reports.html       # Rapports d'analyse
│   └── about.html         # À propos
│
├── data/                  # Données pour l'entraînement des modèles
│   ├── raw/               # Données brutes (rapports DGSS)
│   ├── processed/         # Données traitées
│   └── features/          # Caractéristiques extraites
│
└── notebooks/             # Notebooks Jupyter pour l'analyse de données et l'entraînement des modèles
    ├── data_scraping.ipynb   # Web scraping des rapports DGSS
    ├── data_processing.ipynb # Traitement des données
    └── model_training.ipynb  # Entraînement des modèles XGBoost
```

## Contributeurs

Ce projet a été développé par :
- **ELGARCH Youssef** - Développeur IA & Sécurité
- **IBNOU KADY Nisrine** - Experte en Cybersécurité

## Licence

Ce projet est distribué sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

## Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter :
- Email : contact@websecure.ai
- GitHub : [https://github.com/yousef-elgarch1/WebSecure](https://github.com/yousef-elgarch1/WebSecure)

## Remerciements

Nous tenons à remercier tous ceux qui ont contribué à ce projet, ainsi que les bibliothèques open source qui ont rendu ce projet possible. Nous remercions également la DGSS pour leurs rapports de sécurité qui ont servi de base à notre jeu de données d'entraînement.
