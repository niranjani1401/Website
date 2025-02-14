import React, { useState, useEffect } from 'react';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import StockChart from '../components/StockChart';

const FAANG_STOCKS = [
  { symbol: 'META', name: 'Meta (formerly Facebook)' },
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'AMZN', name: 'Amazon' },
  { symbol: 'NFLX', name: 'Netflix' },
  { symbol: 'GOOGL', name: 'Alphabet (Google)' },
];

interface SentimentScore {
  score: number;
  analysis: string;
  trend: 'up' | 'down';
}

const FaangPredictor = () => {
  const [selectedStock, setSelectedStock] = useState(FAANG_STOCKS[0]);
  const [sentiment, setSentiment] = useState<SentimentScore | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSentiment = async () => {
      setLoading(true);
      // Mock sentiment analysis data
      // In a real application, this would come from your AI model
      setTimeout(() => {
        const score = Math.random() * 100;
        setSentiment({
          score,
          trend: score > 50 ? 'up' : 'down',
          analysis: `${selectedStock.symbol} shows ${score > 50 ? 'strong' : 'weak'} market performance with ${
            score > 50 ? 'positive' : 'negative'
          } sentiment based on recent news and market trends. AI analysis suggests a ${
            score > 50 ? 'bullish' : 'bearish'
          } outlook for the next quarter.`,
        });
        setLoading(false);
      }, 1000);
    };

    fetchSentiment();
  }, [selectedStock]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-gray-900 rounded-xl p-8 shadow-xl mb-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-400">FAANG Stocks Sentiment Analysis</h2>
        
        {/* Stock Selector */}
        <div className="relative mb-8 max-w-md">
          <select
            value={selectedStock.symbol}
            onChange={(e) => setSelectedStock(FAANG_STOCKS.find(stock => stock.symbol === e.target.value)!)}
            className="w-full appearance-none bg-gray-800 border border-gray-700 text-white py-3 px-4 pr-8 rounded-lg focus:outline-none focus:border-blue-500"
          >
            {FAANG_STOCKS.map((stock) => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.name} ({stock.symbol})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Sentiment Display */}
        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-800 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6"></div>
          </div>
        ) : sentiment ? (
          <div>
            {/* Sentiment Score */}
            <div className="flex items-center mb-6">
              <div className="relative w-48 h-48 mr-8">
                <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-blue-500"
                  style={{
                    clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                    transform: `rotate(${45 + (sentiment.score * 1.8)}deg)`,
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-500">{Math.round(sentiment.score)}</div>
                    <div className="text-sm text-gray-400">Sentiment Score</div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-semibold mr-2">{selectedStock.name}</h3>
                  {sentiment.trend === 'up' ? (
                    <TrendingUp className="text-green-500" />
                  ) : (
                    <TrendingDown className="text-red-500" />
                  )}
                </div>
                <p className="text-gray-300 leading-relaxed">{sentiment.analysis}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Stock Chart */}
      <div className="bg-gray-900 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">{selectedStock.symbol} Stock Performance</h2>
        <StockChart symbol={selectedStock.symbol} />
      </div>
    </div>
  );
}

export default FaangPredictor;