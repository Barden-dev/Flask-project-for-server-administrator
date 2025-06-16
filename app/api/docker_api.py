from flask import Blueprint

# Создаем "чертеж" для Docker API
docker_bp = Blueprint('docker_api', __name__, url_prefix='/api/v1/docker')

