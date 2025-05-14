// mock_data.js - Mock data for WebSecure
// Contains simulated security reports for testing and development

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
      website_info: {
        name: 'École Nationale Supérieure d\'Informatique et d\'Analyse des Systèmes',
        logo_url: 'assets/img/ensias.png',
        description: 'Site officiel de l\'ENSIAS, école d\'ingénieurs en informatique de Rabat',
        domain_info: {
          registration_date: '2008-09-22'
        },
        technologies: ['PHP', 'JavaScript', 'Bootstrap', 'jQuery', 'MySQL', 'Apache', 'Joomla']
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
        }
      ],
      probability: {
        'Faible': 0.25,
        'Modéré': 0.45,
        'Important': 0.25,
        'Critique': 0.05
      },
      future_risk: 5.8
    }
  ];
  
  // Export mock data for use in the application
  export default mockReports;