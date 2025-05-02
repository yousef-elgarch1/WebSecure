import os

class Config:
    """Base configuration."""
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'websecure-secret-key')
    CORS_HEADERS = 'Content-Type'
    
    # App
    APP_NAME = 'WebSecure'
    APP_VERSION = '1.0.0'
    
    # Models
    MODELS_DIR = os.environ.get('MODELS_DIR', 'models')
    REPORTS_DIR = os.environ.get('REPORTS_DIR', 'reports')
    
    # Analysis
    DEFAULT_SCAN_TYPE = 'quick'
    QUICK_SCAN_TIMEOUT = 30  # seconds
    DEEP_SCAN_TIMEOUT = 60   # seconds

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    TESTING = False

class TestingConfig(Config):
    """Testing configuration."""
    DEBUG = False
    TESTING = True

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    TESTING = False

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Get current configuration based on environment."""
    env = os.environ.get('FLASK_ENV', 'default')
    return config.get(env, config['default'])