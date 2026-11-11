from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)

# Database connection setup (Supabase or Firebase to be added here)
database = {}

@app.after_request
def allow_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

@app.route('/api/save', methods=['POST', 'OPTIONS'])
def save():
    if request.method == 'OPTIONS':
        return ('', 204)
    data = request.get_json() or {}
    roll_no = data.get('roll_no')
    name = data.get('name')
    fee = data.get('fee')

    # Save to database using roll_no as primary key
    database[roll_no] = {'name': name, 'roll_no': roll_no, 'fee': fee}
    return jsonify({'success': True, 'message': 'Data saved successfully'})

@app.route('/api/delete', methods=['POST', 'OPTIONS'])
def delete():
    if request.method == 'OPTIONS':
        return ('', 204)
    data = request.get_json() or {}
    roll_no = data.get('roll_no')

    # Delete record matching roll_no from database
    if roll_no in database:
        del database[roll_no]

    return jsonify({'success': True, 'message': 'Data is removed successfully'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

