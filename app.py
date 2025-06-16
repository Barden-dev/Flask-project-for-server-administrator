from flask import Flask, render_template, request


app = Flask(__name__)

@app.route('/')
def main():
    return render_template('hello.html')

@app.route('/submit', methods=['POST'])
def submit():
  name = request.form['name']
  return f'Hello, {name}'

if __name__ == '__main__':
    app.run(debug=True)