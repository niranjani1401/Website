import requests
import time
import random
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from newspaper import Article
import google.generativeai as genai

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyCUtyiyN-6P-CnN64aUIaBXcA09f1PZ9tM"
genai.configure(api_key=GEMINI_API_KEY)

# Alpha Vantage API Key
ALPHA_VANTAGE_API_KEY = "13PK5TWIYX9J33BU"

# Function to scrape article content
def scrape_article(url):
    try:
        domain = urlparse(url).netloc
        if "benzinga.com" in domain:
            try:
                article = Article(url)
                article.download()
                article.parse()
                headline_text = article.title.strip() if article.title else "No headline found"
                content = article.text.strip()[:10000]  # Limit to 10,000 characters
                return {"url": url, "headline": headline_text, "content": content}
            except:
                print(f"Newspaper3k failed for {url}, switching to BeautifulSoup.")

        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")

        # Extract headline
        headline = soup.find("h1")
        headline_text = headline.text.strip() if headline else "No headline found"

        # Extract content based on domain
        if "fool.com" in domain:
            content = " ".join([p.text.strip() for p in soup.select("div.article-body")])
        elif "zacks.com" in domain:
            content = " ".join([p.text.strip() for p in soup.select("div#comtext p")])
        elif "cnbc.com" in domain:
            content = " ".join([p.text.strip() for p in soup.select("div.group p")])
        elif "globenewswire.com" in domain:
            content = " ".join([p.text.strip() for p in soup.select("div#main-body-container p")])
        else:
            content = " ".join([p.text.strip() for p in soup.find_all("p")])

        content = content[:10000]  # Limit content length
        return {"url": url, "headline": headline_text, "content": content}

    except Exception as e:
        return {"url": url, "error": str(e)}

# Function to analyze stock using Gemini
def analyze_stock(ticker, scraped_articles):
    prompt = f"""
    Analyze the following news articles about {ticker} and extract key insights. The analysis should be structured into the following sections:

    Market trends affecting {ticker}  
    Recent financial performance indicators  
    Risks and challenges  
    Growth opportunities and future outlook  
    Notable events or regulatory concerns  

    News Articles:
    {scraped_articles}

    Important instructions:
    - Only use the provided news articles for the analysis.
    - Ignore advertisements, promotional content, or irrelevant text that may have been scraped.
    - Ensure that each insight clearly references how it relates to {ticker}.
    - Elaborate slightly on each point to provide useful details while keeping the response concise.
    - Include both the full company name and the ticker symbol in relevant sections.
    - Write the headings as normal text, without bold, asterisks, or any special formatting.
    - Present the analysis in clear, numbered points without using symbols like *, -, or #.
    - The response should be well-structured, informative, and formatted in plain text.

    Return only the analysis in plain text format.
    """

    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    return response.text if response else "Analysis could not be generated."

# Function to fetch news and generate stock analysis
def get_stock_analysis(ticker):
    url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={ticker}&apikey={ALPHA_VANTAGE_API_KEY}"
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
