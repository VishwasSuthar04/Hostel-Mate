from flask import Flask, request, jsonify
from flask_cors import CORS
from models.spending_analyzer import SpendingAnalyzer

app = Flask(__name__)
CORS(app)
analyzer = SpendingAnalyzer()

@app.route('/health')
def health():
    return jsonify({'status': 'ok', 'service': 'HostelMate AI'})

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        expenses = data.get('expenses', [])
        if not expenses:
            return jsonify({'insights': ['No expense data provided.'], 'recommendations': []})
        result = analyzer.analyze(expenses)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        expenses = data.get('expenses', [])
        prediction = analyzer.predict_next_month(expenses)
        return jsonify(prediction)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
