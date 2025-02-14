import requests
import time
import random
from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from newspaper import Article
import google.generativeai as genai
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)
# Set up Gemini API (Replace with your actual API key)
GEMINI_API_KEY = "AIzaSyC_YOSbKkL2U6hgNhs4FszKMJGPSEzYR0E"
genai.configure(api_key=GEMINI_API_KEY)

# Alpha Vantage API key (Replace with your actual key)
ALPHA_VANTAGE_API_KEY = "EK3YCKFWJJKJ8JZU"

# Function to scrape article content
def scrape_article(url):
    try:
        domain = urlparse(url).netloc
        if "benzinga.com" in domain:
            try:
                article = Article(url)
                article.download()
                article.parse()
                return {
                    "url": url,
                    "headline": article.title.strip() if article.title else "No headline",
                    "content": article.text.strip()[:10000]  # Limit to 10,000 characters
                }
            except:
                print(f"Newspaper3k failed for {url}, switching to BeautifulSoup.")

        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")

        # Extract headline
        headline = soup.find("h1")
        headline_text = headline.text.strip() if headline else "No headline found"

        # Extract content based on domain
        content = " ".join([p.text.strip() for p in soup.find_all("p")])[:10000]  # Limit content length

        return {"url": url, "headline": headline_text, "content": content}

    except Exception as e:
        return {"url": url, "error": str(e)}

# Function to analyze stock using Gemini
def analyze_stock(ticker, scraped_articles):
    prompt = f"""
    Analyze the following news articles about {ticker} and extract key insights. The analysis should be structured into the following sections:

    1. Market trends affecting {ticker}  
    2. Recent financial performance indicators  
    3. Risks and challenges  
    4. Growth opportunities and future outlook  
    5. Notable events or regulatory concerns  

    News Articles:
    {scraped_articles}

    Important instructions:
    - Only use the provided news articles for the analysis.
    - Ignore advertisements, promotional content, or irrelevant text that may have been scraped.
    - Ensure each insight clearly references how it relates to {ticker}.
    - Keep the response structured, concise, and informative.
    - Format the response in plain text.

    Return only the analysis.
    """

    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    return response.text if response else "Analysis could not be generated."

# Function to get stock news and analyze it
def get_stock_analysis(ticker):
    url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={ticker}&apikey={ALPHA_VANTAGE_API_KEY}"
    
    # Fetch data from API
    r = requests.get(url)
    data = r.json()

    # Extract article URLs (removing duplicates)
    article_urls = list(set([article['url'] for article in data.get('feed', [])]))

    # Scrape and analyze articles
    scraped_articles_text = ""
    for idx, article_url in enumerate(article_urls[:5], start=1):  # Limit to first 5 articles
        scraped_data = scrape_article(article_url)
        scraped_articles_text += f"\n{idx}. {scraped_data['headline']}\nURL: {scraped_data['url']}\nContent: {scraped_data.get('content', 'Could not scrape content.')}\n"

        # Random delay to avoid bot detection
        time.sleep(random.uniform(2, 5))

    # Generate stock analysis
    if scraped_articles_text:
        return analyze_stock(ticker, scraped_articles_text)
    else:
        return "No articles found for analysis."

# API Endpoint
@app.route('/analyze-stock', methods=['POST'])
def analyze_stock_endpoint():
    data = request.json
    ticker = data.get("ticker")

    if not ticker:
        return jsonify({"error": "Ticker symbol is required"}), 400

    analysis = get_stock_analysis(ticker)
    return jsonify({"analysis": analysis})

# Run Flask App
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
