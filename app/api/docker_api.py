import docker
from flask import Blueprint, jsonify, request
from numpy import mat

# Создаем "чертеж" для Docker API
docker_bp = Blueprint('docker_api', __name__, url_prefix='/api/v1/docker')
client = docker.from_env()

@docker_bp.route('/containers')
def get_containers():
    end_data = {}
    containers = client.containers.list()
    for container in containers:
        end_data[container.short_id] = (container.name, container.status, container.id)
    
    return jsonify(end_data)


@docker_bp.route('/containers/<id>/<action>', methods=['POST'])
def container_action(id, action):
    name = id
    action = action
    
    if action == "":
        return "Bad POST, no action"  
    
    match action:
        case "start":
            try:
                client.containers.run(str(name))
            except:
                return "Error"
            return "Started"
        
        case "stop":
            try:
                client.containers.get(name).stop()
            except:
                return "Error"
            return "Stoped"
        
        case "restart":
            try:
                client.containers.get(name).restart()
            except:
                return "Error"
            return "restarted"
    return "ok"    
