Wearable-Iot_SEL703

## Getting Started

1. Clone the repo and open the project directory.
2. Copy `.env.example` to `.env` and set:
   - `VITE_API_URL` to the full URL of your backend endpoint (e.g.
     `http://localhost:5000/api/sensor`) or `/api/sensor` when using the dev proxy.
   - **optionally** `VITE_API_METHOD` to `GET` or `POST` depending on what your
     API supports. The default is `GET`.
3. Run `npm install` to install dependencies.
4. Start the development server with `npm run dev`.
   - The terminal will print a local URL (usually `http://localhost:5173`).
   - **Do not** open `index.html` directly in the browser; the app must be
     accessed via the server so the ES module imports resolve correctly.

   If you'd like to test the production build you can run `npm run build` and
   then `npm run preview`.

Once the app is running the dashboard will display a more helpful error message
if the request fails; check the browser console for the raw error. This should
make it easier to diagnose issues like wrong HTTP method, CORS failures, or
unexpected response bodies.

**Note:** the frontend now includes a simple fallback; if it cannot reach the
configured API (or the response is invalid) it will generate a small random
`HealthData` object and render that instead. This guarantees the UI never
collapses to a blank screen, even when the backend isn’t running. You can still
provide a real endpoint via `VITE_API_URL` in your `.env` file:

```env
VITE_API_URL=http://192.168.1.177:5000/api/sensor
```
> **Tip:** some browser extensions (ad‑blockers, privacy/security filters)
> will intercept or block scripts served from `localhost` and result in a blank
> page with `ERR_BLOCKED_BY_CLIENT` in the console. If you see such errors,
> disable the extension or whitelist the development URL or try another
> browser/incognito window.

The frontend will poll the API every 5 seconds. If the server is on a different
host/port you may encounter CORS errors; the dev server includes a proxy
configuration (see `vite.config.ts`) that forwards `/api` requests to the
backend.

### Troubleshooting

- **White screen or blank page** – open the browser console; any runtime errors
  or network failures will be logged there. A common mistake is quoting the
  environment variable value (e.g. `VITE_API_URL='http://...'`); the quotes end
  up being part of the string, which makes the fetch fail silently. The value
  should be unquoted with no surrounding spaces. Example:
  
      VITE_API_URL=http://localhost:5000/api/sensor
  
  or when using the proxy:
  
      VITE_API_URL=/api/sensor

  Ensure `VITE_API_URL` is correct and that the backend is reachable. You can
  also set `VITE_API_URL=/api/sensor` and rely on the development proxy.
- **Connection error message** – the dashboard displays a red banner when it
  cannot fetch data. Verify the backend is running and accepting GET requests.

### Backend support

This project uses Python/Flask for the API, but you don't need Python if
you're not comfortable installing it. Two options are available:

1. **Install Python (recommended)** – download it from https://python.org and
   run the following:

   ```bash
   pip install flask flask-cors
   python flash.py
   ```

   `flask-cors` is optional but required during development so the React dev
   server can talk to the API. If it's missing the server prints a warning and
   browsers will show a CORS error.

2. **Use the built-in Node/Express server instead** – create the file
   `server.js` (provided in the repo) and run:

   ```bash
   npm install express cors
   node server.js
   ```

   This starts an identical API on port 5000 that requires no Python at all.

Either server implements the same `/api/sensor` GET/POST interface and logs
incoming ESP32 payloads. The front‑end can be configured with
`VITE_API_METHOD=GET` or `POST` via the `.env` file as explained above.


The frontend itself has no knowledge of the ESP32 – it simply polls the
configured URL and expects a JSON response matching this TypeScript interface:

```ts
interface HealthData {
  predicted_activity: string;
  heart_rate: number;
  temperature: number;
  health_status: string;
  timestamp: string;
}
```

If the ESP32 is posting raw sensor readings to the same endpoint you need to
convert them on the server. A minimal Flask example might look like this:

```python
from flask import Flask, request, jsonify
app = Flask(__name__)

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
        # map fields from ESP payload to HealthData
        latest = {
            'predicted_activity': data.get('activity', 'unknown'),
            'heart_rate': data.get('bpm', 0),
            'temperature': data.get('temp', 0),
            'health_status': 'Normal',
            'timestamp': data.get('ts', '')
        }
        # return the newly updated state so the front-end can parse it
        # immediately (avoids "empty response" parse errors)
        return jsonify(latest), 200
    return jsonify(latest)
```

Adjust the field names above to match what your device actually sends.

**CORS warning:** the React dev server runs on a different port (usually
`5173`) so browsers will block requests to `http://192.168.1.177:5000` unless
your Flask API allows cross‑origin traffic. The example server uses
`flask_cors.CORS(app)` to add the appropriate headers. If you see errors like

> Access to fetch at 'http://…' from origin 'http://localhost:5173' has been
> blocked by CORS policy

then install `flask-cors` (`pip install flask-cors`) and restart the server.

The server now prints the raw JSON it receives from the ESP32 (`print('received POST data', data)`) so you can verify that the payload matches what the frontend expects.

The front-end helper logs the method/URL and will throw a clear error if it
ever receives an empty body (which earlier happened with the 204 response).
You can still set `VITE_API_METHOD` to `POST` if you prefer, but GET is
usually sufficient since the ESP already pushes data independently.

