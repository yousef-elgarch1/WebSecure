# WebSecure

![WebSecure Logo](assets/img/logo.svg)

## Présentation

WebSecure est une plateforme avancée d'analyse de vulnérabilités web qui combine l'intelligence artificielle et l'apprentissage automatique pour détecter les failles de sécurité dans les sites web. Cette application permet d'identifier les risques potentiels, d'évaluer le niveau de sécurité global et de fournir des recommandations personnalisées pour améliorer la protection de votre présence en ligne.

## Fonctionnalités

- **Analyse de sécurité web complète** : Détection des vulnérabilités comme XSS, CSRF, injections SQL, etc.
- **Évaluation des risques basée sur l'IA** : Score de risque et classification des vulnérabilités par sévérité
- **Extraction d'informations de site web** : Détection du logo, des technologies utilisées, et des métadonnées
- **Prédiction des risques futurs** : Estimation des probabilités d'attaques à venir
- **Rapports détaillés** : Visualisation des résultats avec graphiques et tableaux
- **Recommandations personnalisées** : Suggestions concrètes pour corriger les failles détectées
- **Export des rapports** : Formats HTML et JSON pour partage et archivage

## Captures d'écran

![Dashboard](screenshots/dashboard.png)
![Rapport d'analyse](screenshots/report.png)
![Détection de vulnérabilités](screenshots/vulnerabilities.png)

## Architecture technique

WebSecure est construit avec une architecture moderne et évolutive :

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5
- Chart.js pour les visualisations
- Interface responsive adaptée à tous les appareils

### Backend
- Python avec Flask
- Algorithmes d'apprentissage automatique (Random Forest, XGBoost)
- Analyse de sécurité web avancée
- API RESTful

### Modèles d'IA
- Détection d'anomalies
- Classification des vulnérabilités
- Prédiction des risques futurs
- Extraction intelligente d'informations de site web

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

Nous tenons à remercier tous ceux qui ont contribué à ce projet, ainsi que les bibliothèques open source qui ont rendu ce projet possible.
