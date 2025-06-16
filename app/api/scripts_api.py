import subprocess
from flask import Blueprint, request, jsonify
from config import scripts_whitelist

scripts_bp = Blueprint('scripts_api', __name__, url_prefix='/api/v1/scripts')


@scripts_bp.route('/run', methods=['POST'])
def run_script():
  script = request.form['script']
  if script in scripts_whitelist:
    subprocess.run(["bash", f"scripts/{script}.sh"])
    return jsonify({'status': 'started'})
  else:
    return jsonify({'status': 'not started'})