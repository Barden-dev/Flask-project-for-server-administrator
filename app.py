from flask import Flask, render_template, request, jsonify
import psutil

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/api/v1/system')
def get_system_info():
    return jsonify({'cpu_load': f'{psutil.cpu_percent()}',
                    'mem_free': f'{psutil.virtual_memory().free >> 20}',
                    'mem_used_percent': f'{psutil.virtual_memory().percent}',
                    'mem_used': f'{psutil.virtual_memory().used >> 20}',
                    'disk_usage': f"{psutil.disk_usage('/').used >> 20}",
                    'disk_free': f"{psutil.disk_usage('/').free >> 20}"})

@app.route('/submit', methods=['POST'])
def submit():
  name = request.form['name']
  return f'Hello, {name}'

if __name__ == '__main__':
    app.run(debug=True)