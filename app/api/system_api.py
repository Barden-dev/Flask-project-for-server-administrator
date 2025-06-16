import psutil
from flask import Blueprint, jsonify


system_bp = Blueprint('system_api', __name__, url_prefix='/api/v1/system')

@system_bp.route('/stats')
def get_containers():
    return jsonify({'cpu_load': f'{psutil.cpu_percent()}',
                    'mem_free': f'{psutil.virtual_memory().free >> 20}',
                    'mem_used_percent': f'{psutil.virtual_memory().percent}',
                    'mem_used': f'{psutil.virtual_memory().used >> 20}',
                    'disk_usage': f"{psutil.disk_usage('/').used >> 20}",
                    'disk_free': f"{psutil.disk_usage('/').free >> 20}"})