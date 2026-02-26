from flask import Flask, request, jsonify

# `flask_cors` is optional but strongly recommended for development when the
# React app is running on a different origin. If it's not installed we catch
# the ImportError and continue; CORS requests will then fail in the browser.
try:
    from flask_cors import CORS
except ImportError:
    CORS = None
    print('warning: flask_cors not installed; cross-origin requests may fail.\n'
          '         install it with `pip install flask-cors` to avoid CORS errors.')

app = Flask(__name__)
if CORS:
    CORS(app)

latest = {
    'predicted_activity': 'unknown',
    'heart_rate': 0,
    'temperature': 0,
    'health_status': 'Normal',
    'timestamp': ''
}

@app.route('/api/sensor', methods=['GET','POST'])
def sensor():
    global latest
    if request.method == 'POST':
        data = request.get_json() or {}
        print('received POST data', data)  # debug output
        latest = {
            'predicted_activity': data.get('activity', 'unknown'),
            'heart_rate': data.get('bpm', 0),
            'temperature': data.get('temp', 0),
            'health_status': 'Normal',
            'timestamp': data.get('ts', '')
        }
        # echo back the updated state so clients posting can immediately
        # consume the same JSON instead of hitting the GET endpoint.
        return jsonify(latest), 200
    # GET request returns latest reading; front-end polls this every few seconds
    return jsonify(latest)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)