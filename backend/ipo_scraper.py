import requests
import time
import random
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from newspaper import Article
import google.generativeai as genai

# Configure Gemini API (replace with your actual API key)
GEMINI_API_KEY = "AIzaSyCUtyiyN-6P-CnN64aUIaBXcA09f1PZ9tM"
genai.configure(api_key=GEMINI_API_KEY)

# Alpha Vantage API Key (replace with your actual API key)
ALPHA_VANTAGE_API_KEY = "B90DIAYFR84IKFWZ"

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

def analyze_ipo(ipo_keyword, scraped_articles):
    prompt = f"""
    Analyze the following news articles about the IPO of {ipo_keyword} and extract key insights. The analysis should be structured into the following sections:

    Market trends affecting the IPO of {ipo_keyword}  
    Company background and financial performance  
    Risks and challenges for the IPO  
    Growth potential and investor outlook  
    Notable events or regulatory concerns  

    News Articles:
    {scraped_articles}

    Important instructions:
    - Only use the provided news articles for the analysis.
    - Ignore advertisements, promotional content, or irrelevant text that may have been scraped.
    - Ensure that each insight clearly references how it relates to {ipo_keyword}.
    - Elaborate slightly on each point to provide useful details while keeping the response concise.
    - Include both the full company name and the IPO keyword in relevant sections.
    - Write the headings as normal text, without bold, asterisks, or any special formatting.
    - Present the analysis in clear, numbered points without using symbols like *, -, or #.
    - The response should be well-structured, informative, and formatted in plain text.

    Return only the analysis in plain text format.
    """
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    return response.text if response else "Analysis could not be generated."

def get_ipo_analysis(ipo_keyword):
    # Build the API URL for IPO news
    url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=ipo&apikey={ALPHA_VANTAGE_API_KEY}"
    r = requests.get(url)
    data = r.json()

    # Filter articles to those whose title contains the ipo_keyword (case-insensitive)
    article_urls = list(set([
        article['url']
        for article in data.get('feed', [])
        if ipo_keyword.lower() in article['title'].lower()
    ]))

    scraped_articles_text = ""
    for idx, article_url in enumerate(article_urls[:5], start=1):  # Limit to first 5 articles
        scraped_data = scrape_article(article_url)
        scraped_articles_text += f"\n{idx}. {scraped_data.get('headline', 'No headline')}\nURL: {scraped_data.get('url')}\nContent: {scraped_data.get('content', 'Could not scrape content.')}\n"
        time.sleep(random.uniform(2, 5))  # Random delay to avoid bot detection

    if scraped_articles_text:
        return analyze_ipo(ipo_keyword, scraped_articles_text)
    else:
        return "No articles found for analysis."
