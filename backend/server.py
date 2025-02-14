from flask import Flask, request, jsonify
import numpy as np
import joblib  # Assuming you have a trained model saved as a .pkl file
from flask_cors import CORS
from stock_scraper import get_stock_analysis

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Load your trained model
#MODEL_PATH = "model.pkl"
#model = joblib.load(MODEL_PATH)

@app.route('/analyze-stock', methods=['POST'])
def analyze_stock_endpoint():
    data = request.json
    ticker = data.get("ticker")

    if not ticker:
        return jsonify({"error": "Ticker symbol is required"}), 400

    analysis = get_stock_analysis(ticker)
    return jsonify({"analysis": analysis})
# Define MAANG stock options
MAANG_STOCKS = ["Meta", "Apple", "Amazon", "Netflix", "Google"]

""" @app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    stock = data.get("stock")
    
    if stock not in MAANG_STOCKS:
        return jsonify({"error": "Invalid stock selection"}), 400
    
    # Dummy input features - replace with actual stock data fetching
    input_features = np.random.rand(1, 5)  # Adjust as per your model
    prediction = model.predict(input_features)[0] */
    
    return jsonify({"stock": stock, "prediction": prediction})"""

@app.route("/")
def home():
    return "Flask server is running and listening for requests!"

if __name__ == "__main__":
    print("Starting Flask server... Listening on http://127.0.0.1:5000")
    app.run(debug=True)
