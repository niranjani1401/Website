from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time
import random
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from newspaper import Article
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyCUtyiyN-6P-CnN64aUIaBXcA09f1PZ9tM"
genai.configure(api_key=GEMINI_API_KEY)

# Alpha Vantage API Key
ALPHA_VANTAGE_API_KEY = "EK3YCKFWJJKJ8JZU"

def scrape_article(url):
    try:
        article = Article(url)
        article.download()
        article.parse()
        return {"url": url, "headline": article.title, "content": article.text[:10000]}
    except Exception as e:
        return {"url": url, "error": str(e)}

def analyze_stock(ticker, articles_text):
    prompt = f"""
    Analyze the following news articles about {ticker} and provide insights:

    {articles_text}

    Instructions:
    - Summarize market trends affecting {ticker}.
    - Highlight recent financial performance indicators.
    - Discuss potential risks and challenges.
    - Outline growth opportunities and future outlook.
    - Mention notable events or regulatory concerns.

    Ensure the analysis is concise and informative.
    """
    response = genai.generate_text(prompt=prompt, model="models/text-bison-001")
    return response.result if response else "Analysis could not be generated."

def get_stock_analysis(ticker):
    url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={ticker}&apikey={ALPHA_VANTAGE_API_KEY}"
    response = requests.get(url)
    data = response.json()

    article_urls = list(set(article['url'] for article in data.get('feed', [])))
    articles_text = ""

    for idx, article_url in enumerate(article_urls[:5], start=1):
        scraped_data = scrape_article(article_url)
        articles_text += f"\n{idx}. {scraped_data.get('headline', 'No headline')}\nURL: {scraped_data['url']}\nContent: {scraped_data.get('content', 'No content')}\n"
        time.sleep(random.uniform(2, 5))

    if articles_text:
        return analyze_stock(ticker, articles_text)
    else:
        return "No articles found for analysis."

@app.route('/analyze-stock', methods=['POST'])
def analyze_stock_endpoint():
    data = request.json
    ticker = data.get("ticker")
    if not ticker:
        return jsonify({"error": "Ticker symbol is required"}), 400
    analysis = get_stock_analysis(ticker)
    return jsonify({"analysis": analysis})

if __name__ == "__main__":
    app.run(debug=True)
