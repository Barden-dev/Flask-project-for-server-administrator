from os import name
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Helllo world'

@app.route('/some')
def some_page():
    return 'Some Page'

if __name__ == '__main__':
    app.run(debug=True)