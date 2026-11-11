import os
from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Supabase setup
SUPABASE_URL = os.getenv('SUPABASE_URL', '')
SUPABASE_KEY = os.getenv('SUPABASE_SECRET_KEY') or os.getenv('SUPABASE_KEY', '')

supabase = None
if SUPABASE_URL and not SUPABASE_URL.startswith('https://your-project-id'):
    try:
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print("Supabase connection error:", e)

# Fallback local storage
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
    if supabase:
        try:
            supabase.table('students').upsert({
                'roll_no': roll_no,
                'name': name,
                'fee': fee
            }).execute()
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500
    else:
        database[roll_no] = {'name': name, 'roll_no': roll_no, 'fee': fee}

    return jsonify({'success': True, 'message': 'Data saved successfully'})

@app.route('/api/delete', methods=['POST', 'OPTIONS'])
def delete():
    if request.method == 'OPTIONS':
        return ('', 204)
    data = request.get_json() or {}
    roll_no = data.get('roll_no')

    # Delete record matching roll_no from database
    if supabase:
        try:
            supabase.table('students').delete().eq('roll_no', roll_no).execute()
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500
    else:
        if roll_no in database:
            del database[roll_no]

    return jsonify({'success': True, 'message': 'Data is removed successfully'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
