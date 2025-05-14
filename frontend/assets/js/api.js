// Mock API for WebSecure
const API_BASE_URL = 'https://api.websecure.ai';

// Mock reports data
const mockReports = [
  {
    id: 'rep001',
    url: 'https://www.cnss.ma',
    scan_date: '2025-04-25T14:30:00',
    risk_level: 'Important',
    risk_score: 68,
    vulnerability_count: 6,
    vulnerabilities: [
      {
        name: 'Cross-Site Scripting (XSS)',
        severity: 'Important',
        description: 'Plusieurs points d\'entrée XSS détectés dans les formulaires d\'utilisateurs permettant l\'injection de code JavaScript malveillant.'
      },
      {
        name: 'En-têtes de sécurité insuffisants',
        severity: 'Modéré',
        description: 'Absence de Content-Security-Policy et autres en-têtes de sécurité essentiels.'
      },
      {
        name: 'Version PHP obsolète',
        severity: 'Important',
        description: 'Le serveur utilise PHP 5.6, qui n\'est plus maintenu et contient des vulnérabilités connues.'
      },
      {
        name: 'Exposition d\'informations sensibles',
        severity: 'Modéré',
        description: 'Les messages d\'erreur exposent des informations techniques qui pourraient aider un attaquant.'
      },
      {
        name: 'Politique de cookies non sécurisée',
        severity: 'Modéré',
        description: 'Les cookies de session n\'utilisent pas les attributs HttpOnly et Secure.'
      },
      {
        name: 'Point de faiblesse CSRF',
        severity: 'Important',
        description: 'Absence de protection CSRF sur les formulaires critiques de mise à jour des données utilisateur.'
      }
    ],
    attack_history: [
      {
        date: '2024-11-15',
        type: 'Tentative d\'injection XSS',
        severity: 'Modéré',
        description: 'Tentative d\'injection de code JavaScript malveillant via le formulaire de contact. Attaque bloquée par le WAF.'
      },
      {
        date: '2023-07-22',
        type: 'Attaque par force brute',
        severity: 'Important',
        description: 'Tentative d\'accès non autorisé par force brute ciblant les comptes administratifs. Plusieurs essais successifs depuis des IP multiples.'
      },
      {
        date: '2022-05-10',
        type: 'Exploit de vulnérabilité PHP',
        severity: 'Critique',
        description: 'Exploit réussi d\'une vulnérabilité PHP ayant permis un accès temporaire avec élévation de privilèges. Corrigé après détection.'
      }
    ],
    website_info: {
      name: 'Caisse Nationale de Sécurité Sociale',
      logo_url: 'assets/img/cnss.png',
      description: 'Site officiel de la CNSS du Maroc offrant des services de sécurité sociale aux citoyens',
      domain_info: {
        registration_date: '2004-07-12'
      },
      technologies: ['PHP', 'jQuery', 'Bootstrap', 'MySQL', 'Apache', 'WordPress']
    },
    security_headers: {
      'Content-Security-Policy': false,
      'X-Frame-Options': true,
      'X-XSS-Protection': true,
      'X-Content-Type-Options': true,
      'Strict-Transport-Security': false,
      'Referrer-Policy': false,
      score: 3
    },
    ssl_info: {
      has_ssl: true,
      certificate_valid: true,
      certificate_expiry: '2025-09-15',
      protocol_version: 'TLSv1.2'
    },
    recommendations: [
      {
        title: 'Mettre à jour PHP vers la dernière version stable',
        priority: 'Haute',
        description: 'Mettre à jour PHP vers une version supportée (7.4+) pour bénéficier des correctifs de sécurité et des améliorations de performance.'
      },
      {
        title: 'Implémenter une protection XSS complète',
        priority: 'Haute',
        description: 'Mettre en place un filtrage des entrées utilisateur et un encodage des sorties pour prévenir les attaques XSS. Utiliser des bibliothèques de validation côté serveur et client.'
      },
      {
        title: 'Ajouter les en-têtes de sécurité manquants',
        priority: 'Moyenne',
        description: 'Configurer le serveur web pour inclure tous les en-têtes de sécurité recommandés, en particulier Content-Security-Policy et X-Frame-Options.'
      },
      {
        title: 'Configurer correctement les cookies de session',
        priority: 'Moyenne',
        description: 'Ajouter les attributs HttpOnly et Secure à tous les cookies contenant des données sensibles ou de session.'
      },
      {
        title: 'Implémenter des jetons CSRF',
        priority: 'Haute',
        description: 'Ajouter des jetons CSRF à tous les formulaires et les vérifier côté serveur avant de traiter les requêtes pour empêcher les attaques CSRF.'
      },
      {
        title: 'Configurer un traitement d\'erreur sécurisé',
        priority: 'Moyenne',
        description: 'Mettre en place un système de gestion des erreurs qui n\'expose pas d\'informations techniques sensibles aux utilisateurs.'
      }
    ],
    probability: {
      'Faible': 0.10,
      'Modéré': 0.35,
      'Important': 0.45,
      'Critique': 0.10
    },
    future_risk: 7.2
  },
  {
    id: 'rep002',
    url: 'https://www.youtube.com',
    scan_date: '2025-05-01T10:15:00',
    risk_level: 'Faible',
    risk_score: 15,
    vulnerability_count: 2,
    vulnerabilities: [
      {
        name: 'Politique CORS permissive',
        severity: 'Faible',
        description: 'La configuration CORS est plus permissive que nécessaire sur certains endpoints d\'API.'
      },
      {
        name: 'Points d\'intégration tiers',
        severity: 'Faible',
        description: 'Quelques points d\'intégration avec des services tiers présentent des risques potentiels.'
      }
    ],
    attack_history: [
      {
        date: '2024-09-30',
        type: 'Tentative d\'exploitation de CORS',
        severity: 'Faible',
        description: 'Tentative d\'exploitation de la configuration CORS détectée et bloquée par le système de sécurité.'
      },
      {
        date: '2024-01-15',
        type: 'DDoS',
        severity: 'Modéré',
        description: 'Attaque par déni de service distribuée de faible amplitude, atténuée par les systèmes de protection.'
      }
    ],
    website_info: {
      name: 'YouTube',
      logo_url: 'assets/img/youtube.jfif',
      description: 'Plateforme de partage de vidéos en ligne appartenant à Google',
      domain_info: {
        registration_date: '2005-02-14'
      },
      technologies: ['JavaScript', 'React', 'Polymer', 'Python', 'Go', 'Angular', 'MongoDB', 'Custom CDN']
    },
    security_headers: {
      'Content-Security-Policy': true,
      'X-Frame-Options': true,
      'X-XSS-Protection': true,
      'X-Content-Type-Options': true,
      'Strict-Transport-Security': true,
      'Referrer-Policy': true,
      score: 6
    },
    ssl_info: {
      has_ssl: true,
      certificate_valid: true,
      certificate_expiry: '2026-02-25',
      protocol_version: 'TLSv1.3'
    },
    recommendations: [
      {
        title: 'Restreindre la politique CORS aux domaines nécessaires',
        priority: 'Basse',
        description: 'Limiter les origines autorisées dans la configuration CORS aux seuls domaines de confiance nécessaires pour améliorer la sécurité.'
      },
      {
        title: 'Auditer et surveiller les intégrations tierces',
        priority: 'Basse',
        description: 'Mettre en place un processus régulier d\'audit et de surveillance des intégrations avec des services tiers pour détecter rapidement tout comportement anormal.'
      }
    ],
    probability: {
      'Faible': 0.85,
      'Modéré': 0.12,
      'Important': 0.02,
      'Critique': 0.01
    },
    future_risk: 2.1
  },
  {
    id: 'rep003',
    url: 'https://www.oracle.com',
    scan_date: '2025-05-02T09:20:00',
    risk_level: 'Modéré',
    risk_score: 38,
    vulnerability_count: 4,
    vulnerabilities: [
      {
        name: 'Cookies sans attributs sécurisés',
        severity: 'Modéré',
        description: 'Certains cookies ne sont pas configurés avec les attributs de sécurité recommandés.'
      },
      {
        name: 'Divulgation d\'informations dans les en-têtes',
        severity: 'Modéré',
        description: 'Les en-têtes HTTP révèlent des informations détaillées sur les versions de logiciels.'
      },
      {
        name: 'Ressources JavaScript obsolètes',
        severity: 'Faible',
        description: 'Certaines bibliothèques JavaScript utilisées sont obsolètes avec des vulnérabilités connues.'
      },
      {
        name: 'Configuration SSL sub-optimale',
        severity: 'Modéré',
        description: 'La configuration SSL prend en charge certains chiffrements obsolètes.'
      }
    ],
    attack_history: [
      {
        date: '2024-08-12',
        type: 'Vol de cookies',
        severity: 'Modéré',
        description: 'Tentative d\'exploitation de cookies sans attributs sécurisés pour voler des sessions utilisateurs.'
      },
      {
        date: '2023-11-03',
        type: 'Reconnaissance active',
        severity: 'Faible',
        description: 'Activité de reconnaissance détectée visant à collecter des informations sur les versions de logiciels exposées dans les en-têtes.'
      },
      {
        date: '2022-06-27',
        type: 'Tentative d\'exploit de bibliothèque JS',
        severity: 'Modéré',
        description: 'Exploitation tentée d\'une vulnérabilité dans une bibliothèque JavaScript obsolète, bloquée par la protection WAF.'
      }
    ],
    website_info: {
      name: 'Oracle Corporation',
      logo_url: 'assets/img/oracle.png',
      description: 'Site officiel de l\'entreprise Oracle, fournisseur mondial de solutions technologiques',
      domain_info: {
        registration_date: '1989-10-05'
      },
      technologies: ['Java', 'Oracle WebLogic', 'jQuery', 'Angular', 'Oracle Database', 'Node.js', 'NGINX']
    },
    security_headers: {
      'Content-Security-Policy': true,
      'X-Frame-Options': true,
      'X-XSS-Protection': true,
      'X-Content-Type-Options': false,
      'Strict-Transport-Security': true,
      'Referrer-Policy': false,
      score: 4
    },
    ssl_info: {
      has_ssl: true,
      certificate_valid: true,
      certificate_expiry: '2025-11-20',
      protocol_version: 'TLSv1.2'
    },
    recommendations: [
      {
        title: 'Configurer correctement tous les cookies avec HttpOnly et Secure',
        priority: 'Moyenne',
        description: 'Ajouter les attributs HttpOnly et Secure à tous les cookies, en particulier ceux liés à l\'authentification ou contenant des données sensibles.'
      },
      {
        title: 'Réduire les informations techniques divulguées dans les en-têtes',
        priority: 'Moyenne',
        description: 'Configurer le serveur pour minimiser les informations divulguées dans les en-têtes HTTP afin de réduire les possibilités de reconnaissance pour les attaquants.'
      },
      {
        title: 'Mettre à jour les bibliothèques JavaScript obsolètes',
        priority: 'Basse',
        description: 'Remplacer les bibliothèques JavaScript obsolètes par leurs versions les plus récentes pour éliminer les vulnérabilités connues.'
      },
      {
        title: 'Renforcer la configuration SSL/TLS',
        priority: 'Moyenne',
        description: 'Désactiver les suites de chiffrement faibles et obsolètes, et configurer des paramètres SSL/TLS conformes aux meilleures pratiques actuelles.'
      }
    ],
    probability: {
      'Faible': 0.30,
      'Modéré': 0.55,
      'Important': 0.12,
      'Critique': 0.03
    },
    future_risk: 4.3
  },
  {
    id: 'rep004',
    url: 'https://www.2m.ma',
    scan_date: '2025-05-04T13:45:00',
    risk_level: 'Important',
    risk_score: 72,
    vulnerability_count: 7,
    vulnerabilities: [
      {
        name: 'Injection SQL',
        severity: 'Critique',
        description: 'Points d\'injection SQL détectés dans les paramètres de recherche.'
      },
      {
        name: 'Cross-Site Scripting (XSS)',
        severity: 'Important',
        description: 'Multiples vulnérabilités XSS dans les sections commentaires et formulaires.'
      },
      {
        name: 'Plugins WordPress obsolètes',
        severity: 'Important',
        description: 'Plusieurs plugins WordPress non mis à jour avec des vulnérabilités connues.'
      },
      {
        name: 'Divulgation d\'informations sensibles',
        severity: 'Modéré',
        description: 'Les messages d\'erreur exposent des détails techniques de la configuration.'
      },
      {
        name: 'Version WordPress obsolète',
        severity: 'Important',
        description: 'Le site utilise une version de WordPress qui n\'est pas à jour.'
      },
      {
        name: 'Politique de mots de passe faible',
        severity: 'Modéré',
        description: 'Le système accepte des mots de passe faibles pour les comptes utilisateurs.'
      },
      {
        name: 'Absence de validation des données utilisateur',
        severity: 'Modéré',
        description: 'Validation insuffisante des entrées utilisateur dans plusieurs formulaires.'
      }
    ],
    attack_history: [
      {
        date: '2025-01-20',
        type: 'Injection SQL',
        severity: 'Critique',
        description: 'Attaque d\'injection SQL réussie ayant compromis temporairement la base de données. Accès limité aux données non sensibles.'
      },
      {
        date: '2024-10-05',
        type: 'Exploitation de plugin WordPress',
        severity: 'Important',
        description: 'Exploit d\'une vulnérabilité dans un plugin WordPress obsolète, permettant l\'exécution de code à distance.'
      },
      {
        date: '2024-06-15',
        type: 'Attaque XSS persistante',
        severity: 'Important',
        description: 'Injection de script XSS dans la section commentaires, affectant les utilisateurs visitant certaines pages.'
      },
      {
        date: '2023-12-30',
        type: 'Compromission de compte',
        severity: 'Important',
        description: 'Accès non autorisé à un compte administratif via une attaque par force brute, facilitée par une politique de mots de passe faible.'
      }
    ],
    website_info: {
      name: '2M Maroc',
      logo_url: 'assets/img/2m.jfif',
      description: 'Site officiel de la chaîne de télévision marocaine 2M',
      domain_info: {
        registration_date: '2001-05-18'
      },
      technologies: ['PHP', 'WordPress', 'jQuery', 'Bootstrap', 'MySQL', 'Apache', 'Varnish Cache']
    },
    security_headers: {
      'Content-Security-Policy': false,
      'X-Frame-Options': false,
      'X-XSS-Protection': true,
      'X-Content-Type-Options': false,
      'Strict-Transport-Security': false,
      'Referrer-Policy': false,
      score: 1
    },
    ssl_info: {
      has_ssl: true,
      certificate_valid: true,
      certificate_expiry: '2025-06-10',
      protocol_version: 'TLSv1.2'
    },
    recommendations: [
      {
        title: 'Corriger les vulnérabilités d\'injection SQL',
        priority: 'Critique',
        description: 'Utiliser des requêtes paramétrées ou des ORM pour toutes les opérations de base de données et implémenter une validation rigoureuse des entrées.'
      },
      {
        title: 'Corriger les vulnérabilités XSS',
        priority: 'Haute',
        description: 'Implémenter un encodage approprié pour toutes les sorties et une validation stricte des entrées utilisateur dans les formulaires et zones de commentaires.'
      },
      {
        title: 'Mettre à jour WordPress et tous les plugins',
        priority: 'Haute',
        description: 'Mettre à jour urgentement le CMS WordPress et tous ses plugins vers les dernières versions stables disponibles.'
      },
      {
        title: 'Implémenter tous les en-têtes de sécurité essentiels',
        priority: 'Moyenne',
        description: 'Ajouter tous les en-têtes de sécurité HTTP recommandés, notamment Content-Security-Policy, X-Frame-Options et HSTS.'
      },
      {
        title: 'Renforcer la politique de mots de passe',
        priority: 'Moyenne',
        description: 'Implémenter une politique de mots de passe forte exigeant une longueur minimale, des caractères mixtes et une complexité adéquate.'
      },
      {
        title: 'Améliorer la validation des entrées utilisateur',
        priority: 'Moyenne',
        description: 'Mettre en place une validation complète côté serveur de toutes les entrées utilisateur dans l\'ensemble de l\'application.'
      },
      {
        title: 'Configurer un traitement d\'erreur sécurisé',
        priority: 'Moyenne',
        description: 'Mettre en œuvre un système de gestion des erreurs qui n\'expose pas d\'informations techniques sensibles aux utilisateurs.'
      }
    ],
    probability: {
      'Faible': 0.05,
      'Modéré': 0.15,
      'Important': 0.55,
      'Critique': 0.25
    },
    future_risk: 8.3
  },
  {
    id: 'rep005',
    url: 'https://ensias.um5.ac.ma',
    scan_date: '2025-05-05T11:30:00',
    risk_level: 'Modéré',
    risk_score: 45,
    vulnerability_count: 5,
    vulnerabilities: [
      {
        name: 'Cross-Site Scripting (XSS)',
        severity: 'Modéré',
        description: 'Vulnérabilités XSS dans certains formulaires d\'interaction.'
      },
      {
        name: 'Version CMS obsolète',
        severity: 'Important',
        description: 'Le site utilise une version obsolète de Joomla avec des vulnérabilités connues.'
      },
      {
        name: 'En-têtes de sécurité manquants',
        severity: 'Modéré',
        description: 'Plusieurs en-têtes de sécurité importants ne sont pas configurés.'
      },
      {
        name: 'Extensions obsolètes',
        severity: 'Modéré',
        description: 'Certaines extensions Joomla utilisées sont obsolètes et présentent des risques.'
      },
      {
        name: 'Politique de cookies non sécurisée',
        severity: 'Faible',
        description: 'Les cookies ne sont pas configurés avec les attributs de sécurité recommandés.'
      }
    ],
    attack_history: [
      {
        date: '2024-12-10',
        type: 'Exploitation de CMS obsolète',
        severity: 'Important',
        description: 'Tentative d\'exploitation d\'une vulnérabilité connue dans la version obsolète de Joomla. Partiellement réussie mais limitée par d\'autres contrôles.'
      },
      {
        date: '2024-04-23',
        type: 'Attaque XSS',
        severity: 'Modéré',
        description: 'Attaque XSS réussie dans un formulaire d\'interaction, causant l\'exécution de code malveillant chez certains utilisateurs.'
      },
      {
        date: '2023-09-17',
        type: 'Défiguration partielle',
        severity: 'Modéré',
        description: 'Défiguration partielle d\'une page secondaire du site via l\'exploitation d\'une extension obsolète. Rapidement corrigée.'
      }
    ],
    website_info: {
      name: 'École Nationale Supérieure d\'Informatique et d\'Analyse des Systèmes',
      logo_url: 'assets/img/ensias.png',
      description: 'Site officiel de l\'ENSIAS, école d\'ingénieurs en informatique de Rabat',
      domain_info: {
        registration_date: '2008-09-22'
      },
      technologies: ['PHP', 'JavaScript', 'Bootstrap', 'jQuery', 'MySQL', 'Apache', 'Joomla']
    },
    security_headers: {
      'Content-Security-Policy': false,
      'X-Frame-Options': true,
      'X-XSS-Protection': false,
      'X-Content-Type-Options': true,
      'Strict-Transport-Security': false,
      'Referrer-Policy': false,
      score: 2
    },
    ssl_info: {
      has_ssl: true,
      certificate_valid: true,
      certificate_expiry: '2025-08-30',
      protocol_version: 'TLSv1.2'
    },
    recommendations: [
      {
        title: 'Mettre à jour Joomla vers la dernière version stable',
        priority: 'Haute',
        description: 'Mettre à jour d\'urgence le CMS Joomla vers sa dernière version pour corriger les vulnérabilités connues et améliorer la sécurité globale.'
      },
      {
        title: 'Mettre à jour toutes les extensions',
        priority: 'Moyenne',
        description: 'Mettre à jour toutes les extensions Joomla utilisées vers leurs dernières versions compatibles pour éliminer les vulnérabilités connues.'
      },
      {
        title: 'Corriger les vulnérabilités XSS',
        priority: 'Moyenne',
        description: 'Implémenter une validation appropriée des entrées et un encodage des sorties dans tous les formulaires pour empêcher les attaques XSS.'
      },
      {
        title: 'Implémenter tous les en-têtes de sécurité recommandés',
        priority: 'Moyenne',
        description: 'Ajouter les en-têtes de sécurité manquants, notamment Content-Security-Policy, pour renforcer la sécurité du navigateur.'
      },
      {
        title: 'Configurer correctement les cookies',
        priority: 'Basse',
        description: 'Ajouter les attributs HttpOnly et Secure aux cookies de session pour améliorer leur sécurité contre les attaques de vol de session.'
      }
    ],
    probability: {
      'Faible': 0.25,
      'Modéré': 0.45,
      'Important': 0.25,
      'Critique': 0.05
    },
    future_risk: 5.8
  },
  {
    id: 'rep006',
    url: 'https://www.facebook.com',
    scan_date: '2025-05-06T14:22:00',
    risk_level: 'Faible',
    risk_score: 18,
    vulnerability_count: 3,
    vulnerabilities: [
      {
        name: 'Politique CORS partiellement permissive',
        severity: 'Faible',
        description: 'Certains endpoints API ont une configuration CORS plus permissive que nécessaire.'
      },
      {
        name: 'Intégrations tierces non auditées',
        severity: 'Faible',
        description: 'Plusieurs intégrations avec des services tiers pourraient bénéficier d\'audits de sécurité plus rigoureux.'
      },
      {
        name: 'Champs de formulaire avec validation partielle',
        severity: 'Faible',
        description: 'Quelques champs de formulaire présentent une validation incomplète, bien que compensée par des contrôles côté serveur.'
      }
    ],
    attack_history: [
      {
        date: '2024-11-25',
        type: 'Tentative d\'exploitation CORS',
        severity: 'Faible',
        description: 'Tentative d\'exploitation de la configuration CORS pour accéder à des API sensibles. Détectée et bloquée.'
      },
      {
        date: '2024-07-08',
        type: 'DDoS',
        severity: 'Modéré',
        description: 'Attaque DDoS d\'envergure moyenne ciblant des API spécifiques. Atténuée efficacement par les systèmes de protection.'
      },
      {
        date: '2023-12-15',
        type: 'Exploitation via intégration tierce',
        severity: 'Modéré',
        description: 'Attaque ayant exploité une intégration tierce pour tenter un accès non autorisé. Impact limité grâce à la compartimentalisation.'
      }
    ],
    website_info: {
      name: 'Facebook',
      logo_url: 'assets/img/facebook.jfif',
      description: 'Réseau social mondial permettant aux utilisateurs de partager et de se connecter',
      domain_info: {
        registration_date: '1997-03-29'
      },
      technologies: ['React', 'GraphQL', 'PHP', 'Hack', 'MySQL', 'Redis', 'Memcached', 'HHVM', 'Custom CDN']
    },
    security_headers: {
      'Content-Security-Policy': true,
      'X-Frame-Options': true,
      'X-XSS-Protection': true,
      'X-Content-Type-Options': true,
      'Strict-Transport-Security': true,
      'Referrer-Policy': true,
      score: 6
    },
    ssl_info: {
      has_ssl: true,
      certificate_valid: true,
      certificate_expiry: '2026-04-12',
      protocol_version: 'TLSv1.3'
    },
    recommendations: [
      {
        title: 'Ajuster la politique CORS',
        priority: 'Basse',
        description: 'Restreindre la politique CORS à un ensemble minimal de domaines de confiance pour les endpoints API spécifiques.'
      },
      {
        title: 'Renforcer l\'audit des intégrations tierces',
        priority: 'Basse',
        description: 'Mettre en place un processus d\'audit régulier et approfondi pour toutes les intégrations avec des services tiers.'
      },
      {
        title: 'Améliorer la validation des formulaires côté client',
        priority: 'Basse',
        description: 'Renforcer la validation côté client pour les quelques champs de formulaire identifiés, bien que la validation côté serveur soit déjà solide.'
      }
    ],
    probability: {
      'Faible': 0.85,
      'Modéré': 0.12,
      'Important': 0.02,
      'Critique': 0.01
    },
    future_risk: 2.4
  },
  {
    id: 'rep008',
    url: 'https://www.microsoft.com',
    scan_date: '2025-05-07T16:30:00',
    risk_level: 'Faible',
    risk_score: 15,
    vulnerability_count: 2,
    vulnerabilities: [
      {
        name: 'Configuration sous-optimale des cookies',
        severity: 'Faible',
        description: 'Quelques cookies pourraient bénéficier d\'attributs de sécurité supplémentaires, bien que les cookies critiques soient correctement protégés.'
      },
      {
        name: 'Ressources tierces sans intégrité SRI',
        severity: 'Faible',
        description: 'Certaines ressources JavaScript tierces sont chargées sans utiliser l\'attribut d\'intégrité Subresource Integrity (SRI).'
      }
    ],
    attack_history: [
      {
        date: '2024-10-18',
        type: 'Tentative d\'exploitation de ressource tierce',
        severity: 'Faible',
        description: 'Tentative de manipulation d\'une ressource JavaScript tierce non protégée par SRI. Détectée et bloquée par d\'autres mécanismes de protection.'
      },
      {
        date: '2023-05-30',
        type: 'Tentative de vol de cookie',
        severity: 'Faible',
        description: 'Tentative d\'exploitation ciblant des cookies non-critiques sans attributs de sécurité complets. Impact limité.'
      }
    ],
    website_info: {
      name: 'Microsoft',
      logo_url: 'assets/img/microsoft.jfif',
      description: 'Site officiel de Microsoft Corporation, entreprise technologique mondiale',
      domain_info: {
        registration_date: '1991-05-02'
      },
      technologies: ['.NET', 'C#', 'TypeScript', 'React', 'Azure', 'SQL Server', 'IIS', 'Azure CDN']
    },
    security_headers: {
      'Content-Security-Policy': true,
      'X-Frame-Options': true,
      'X-XSS-Protection': true,
      'X-Content-Type-Options': true,
      'Strict-Transport-Security': true,
      'Referrer-Policy': true,
      score: 6
    },
    ssl_info: {
      has_ssl: true,
      certificate_valid: true,
      certificate_expiry: '2026-03-15',
      protocol_version: 'TLSv1.3'
    },
    recommendations: [
      {
        title: 'Améliorer la configuration des cookies',
        priority: 'Basse',
        description: 'Ajouter les attributs de sécurité appropriés (HttpOnly, Secure, SameSite) à tous les cookies non critiques restants.'
      },
      {
        title: 'Implémenter l\'intégrité des sous-ressources (SRI)',
        priority: 'Basse',
        description: 'Ajouter des attributs d\'intégrité (integrity) aux balises script chargeant des ressources tierces pour vérifier qu\'elles n\'ont pas été modifiées.'
      }
    ],
    probability: {
      'Faible': 0.92,
      'Modéré': 0.06,
      'Important': 0.01,
      'Critique': 0.01
    },
    future_risk: 1.7
  },
  {
    id: 'rep009',
    url: 'https://www.twitter.com',
    scan_date: '2025-05-08T12:40:00',
    risk_level: 'Modéré',
    risk_score: 35,
    vulnerability_count: 3,
    vulnerabilities: [
      {
        name: 'Configuration CSP incomplète',
        severity: 'Modéré',
        description: 'La politique de sécurité du contenu (CSP) est présente mais n\'est pas configurée de manière optimale pour bloquer toutes les attaques XSS potentielles.'
      },
      {
        name: 'Exposition d\'informations de version',
        severity: 'Faible',
        description: 'Certains en-têtes HTTP révèlent des informations sur les versions des technologies utilisées.'
      },
      {
        name: 'Protection CSRF partielle',
        severity: 'Modéré',
        description: 'Certains endpoints API ne vérifient pas rigoureusement les tokens CSRF ou n\'implémentent pas de protection complète contre les attaques CSRF.'
      }
    ],
    attack_history: [
      {
        date: '2025-02-03',
        type: 'Attaque XSS',
        severity: 'Modéré',
        description: 'Attaque XSS exploitant la configuration CSP incomplète. Impact limité en raison d\'autres mécanismes de défense.'
      },
      {
        date: '2024-11-15',
        type: 'Tentative CSRF',
        severity: 'Modéré',
        description: 'Tentative d\'attaque CSRF sur des endpoints avec protection partielle. Partiellement réussie mais avec impact limité.'
      },
      {
        date: '2024-06-22',
        type: 'Reconnaissance technique',
        severity: 'Faible',
        description: 'Collecte d\'informations utilisant les détails de version exposés dans les en-têtes HTTP pour cibler des vulnérabilités spécifiques.'
      }
    ],
    website_info: {
      name: 'Twitter (X)',
      logo_url: 'assets/img/twitter.jfif',
      description: 'Plateforme de médias sociaux permettant aux utilisateurs de publier et d\'interagir avec des messages courts',
      domain_info: {
        registration_date: '2000-01-21'
      },
      technologies: ['React', 'Node.js', 'Ruby on Rails', 'Redis', 'Scala', 'MySQL', 'Cassandra', 'Hadoop']
    },
    security_headers: {
      'Content-Security-Policy': true,
      'X-Frame-Options': true,
      'X-XSS-Protection': true,
      'X-Content-Type-Options': true,
      'Strict-Transport-Security': true,
      'Referrer-Policy': false,
      score: 5
    },
    ssl_info: {
      has_ssl: true,
      certificate_valid: true,
      certificate_expiry: '2025-12-20',
      protocol_version: 'TLSv1.3'
    },
    recommendations: [
      {
        title: 'Renforcer la politique de sécurité du contenu (CSP)',
        priority: 'Moyenne',
        description: 'Optimiser la configuration CSP pour utiliser des directives plus strictes, notamment en limitant les sources de script et en utilisant nonce ou hash pour les scripts inline.'
      },
      {
        title: 'Réduire les informations de version exposées',
        priority: 'Basse',
        description: 'Configurer les serveurs pour éliminer ou minimiser les informations de version dans les en-têtes HTTP afin de limiter la reconnaissance par des attaquants potentiels.'
      },
      {
        title: 'Améliorer la protection CSRF',
        priority: 'Moyenne',
        description: 'Mettre en œuvre une vérification complète des tokens CSRF sur tous les endpoints API sensibles et utiliser des techniques de défense en profondeur.'
      }
    ],
    probability: {
      'Faible': 0.40,
      'Modéré': 0.45,
      'Important': 0.10,
      'Critique': 0.05
    },
    future_risk: 4.2
  },
  {
    id: 'rep010',
    url: 'https://www.enssup.gov.ma',
    scan_date: '2025-05-09T10:00:00',
    risk_level: 'Important',
    risk_score: 62,
    vulnerability_count: 6,
    vulnerabilities: [
      {
        name: 'Cross-Site Scripting (XSS)',
        severity: 'Important',
        description: 'Plusieurs points d\'entrée XSS détectés dans les formulaires et les paramètres de recherche.'
      },
      {
        name: 'Versions logicielles obsolètes',
        severity: 'Important',
        description: 'Le serveur utilise des versions obsolètes de PHP et d\'autres composants avec des vulnérabilités connues.'
      },
      {
        name: 'Absence de sécurité des en-têtes',
        severity: 'Modéré',
        description: 'La plupart des en-têtes de sécurité HTTP modernes sont absents ou mal configurés.'
      },
      {
        name: 'Validation d\'entrée insuffisante',
        severity: 'Modéré',
        description: 'Plusieurs formulaires ne valident pas correctement les entrées utilisateur, créant des risques potentiels d\'injection.'
      },
      {
        name: 'Configuration SSL/TLS sous-optimale',
        severity: 'Modéré',
        description: 'La configuration SSL/TLS prend en charge des protocoles et des suites de chiffrement obsolètes.'
      },
      {
        name: 'Exposition d\'informations sensibles',
        severity: 'Important',
        description: 'Les messages d\'erreur et certains endpoints API exposent des informations sensibles sur l\'infrastructure et la configuration.'
      }
    ],
    attack_history: [
      {
        date: '2025-03-10',
        type: 'Défiguration de site',
        severity: 'Important',
        description: 'Défiguration partielle du site via une vulnérabilité XSS persistante, affectant plusieurs pages pendant quelques heures.'
      },
      {
        date: '2024-12-05',
        type: 'Exploitation de PHP obsolète',
        severity: 'Critique',
        description: 'Exploit réussi ciblant une vulnérabilité connue dans la version obsolète de PHP, permettant l\'exécution de code à distance.'
      },
      {
        date: '2024-09-18',
        type: 'Vol de données',
        severity: 'Important',
        description: 'Accès non autorisé à des données sensibles via l\'exposition d\'informations dans les messages d\'erreur et une validation insuffisante.'
      },
      {
        date: '2024-07-22',
        type: 'Tentative d\'interception SSL',
        severity: 'Modéré',
        description: 'Tentative d\'exploitation de la configuration SSL/TLS sous-optimale pour intercepter des communications. Partiellement réussie.'
      },
      {
        date: '2023-11-30',
        type: 'Injection de code',
        severity: 'Important',
        description: 'Injection de code malveillant via des formulaires sans validation adéquate, permettant l\'exécution de commandes sur le serveur.'
      }
    ],
    website_info: {
      name: 'Ministère de l\'Enseignement Supérieur, de la Recherche Scientifique et de l\'Innovation',
      logo_url: 'assets/img/gov.png',
      description: 'Site officiel du Ministère de l\'Enseignement Supérieur du Maroc',
      domain_info: {
        registration_date: '2003-06-18'
      },
      technologies: ['PHP', 'Apache', 'MySQL', 'jQuery', 'Bootstrap', 'Drupal']
    },
    security_headers: {
      'Content-Security-Policy': false,
      'X-Frame-Options': false,
      'X-XSS-Protection': false,
      'X-Content-Type-Options': true,
      'Strict-Transport-Security': false,
      'Referrer-Policy': false,
      score: 1
    },
    ssl_info: {
      has_ssl: true,
      certificate_valid: true,
      certificate_expiry: '2025-10-05',
      protocol_version: 'TLSv1.2'
    },
    recommendations: [
      {
        title: 'Mettre à jour tous les logiciels du serveur',
        priority: 'Haute',
        description: 'Mettre à jour PHP, Drupal et tous les autres composants logiciels du serveur vers leurs dernières versions stables disponibles.'
      },
      {
        title: 'Corriger les vulnérabilités XSS',
        priority: 'Haute',
        description: 'Implémenter un encodage approprié des sorties et une validation stricte des entrées pour toutes les zones interactives du site.'
      },
      {
        title: 'Implémenter les en-têtes de sécurité essentiels',
        priority: 'Moyenne',
        description: 'Configurer tous les en-têtes de sécurité recommandés, en particulier CSP, X-Frame-Options et HSTS.'
      },
      {
        title: 'Améliorer la validation des entrées utilisateur',
        priority: 'Moyenne',
        description: 'Mettre en place une validation complète côté serveur pour toutes les entrées utilisateur dans l\'ensemble du site.'
      },
      {
        title: 'Renforcer la configuration SSL/TLS',
        priority: 'Moyenne',
        description: 'Désactiver les protocoles et suites de chiffrement obsolètes, et configurer des paramètres SSL/TLS conformes aux meilleures pratiques actuelles.'
      },
      {
        title: 'Limiter l\'exposition d\'informations sensibles',
        priority: 'Haute',
        description: 'Configurer un traitement d\'erreur sécurisé et revoir tous les endpoints API pour éviter la divulgation d\'informations techniques sensibles.'
      }
    ],
    probability: {
      'Faible': 0.10,
      'Modéré': 0.30,
      'Important': 0.45,
      'Critique': 0.15
    },
    future_risk: 7.5
  }
];

// API Functions

// Get all reports
async function getReports(options = {}) {
  console.log('Mock API: Fetching all reports');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return mockReports;
}

// Get a report by ID
async function getReportById(reportId) {
  console.log(`Mock API: Fetching report with ID: ${reportId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const report = mockReports.find(r => r.id === reportId);
  
  if (!report) {
    throw new Error(`Report with ID ${reportId} not found`);
  }
  
  return report;
}

// Analyze a website (mock function) - UPDATED to return exact data based on URL
async function analyzeWebsite(url, scanType = 'quick') {
  console.log(`Mock API: Analyzing website: ${url} with scan type: ${scanType}`);
  
  // Clean up the URL for matching (remove protocol, www, and trailing slashes)
  const cleanUrl = url.toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '');
  
  // Find a matching report based on the cleaned URL
  const matchingReport = mockReports.find(report => {
    const reportUrl = report.url.toLowerCase()
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/\/+$/, '');
    
    return reportUrl.includes(cleanUrl) || cleanUrl.includes(reportUrl);
  });
  
  // Simulate API processing time based on scan type
  const processingTime = scanType === 'deep' ? 8000 : 3000;
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  // If matching report found, return its ID, otherwise return a random report ID
  if (matchingReport) {
    return {
      status: 'success',
      message: 'Analysis completed successfully',
      result_id: matchingReport.id
    };
  } else {
    // Return a random report if no match found
    const randomIndex = Math.floor(Math.random() * mockReports.length);
    const randomReportId = mockReports[randomIndex].id;
    
    return {
      status: 'success',
      message: 'Analysis completed successfully',
      result_id: randomReportId
    };
  }
}

// Generate a report (mock function)
async function generateReport(reportId, format = 'html') {
  console.log(`Mock API: Generating ${format} report for ID: ${reportId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    status: 'success',
    message: `${format.toUpperCase()} report generated successfully`,
    report_file: `report_${reportId}.${format}`
  };
}

// Download a report (mock function)
function downloadReport(filename) {
  console.log(`Mock API: Downloading report: ${filename}`);
  
  // In a real implementation, this would trigger a file download
  alert(`Rapport téléchargé: ${filename}`);
}