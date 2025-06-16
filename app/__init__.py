from flask import Flask

from .api.main_routes import main_bp
from .api.docker_api import docker_bp
from .api.system_api import system_bp 
from .api.scripts_api import scripts_bp


def create_app():
    app = Flask(__name__)
    
    app.register_blueprint(main_bp)
    app.register_blueprint(docker_bp)
    app.register_blueprint(system_bp)
    app.register_blueprint(scripts_bp)
    
    return app
