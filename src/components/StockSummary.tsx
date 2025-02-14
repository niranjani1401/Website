import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface StockSummaryProps {
  symbol: string;
}

const StockSummary: React.FC<StockSummaryProps> = ({ symbol }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      // Note: In a real application, you would:
      // 1. Fetch news articles from a proper API
      // 2. Use your actual Gemini API key
      // This is just mock data for demonstration
      const mockSummary = `${symbol} has shown strong performance in the technology sector. 
        Recent analyst reports suggest positive momentum due to innovative product launches 
        and expanding market share. The company's financial health remains robust with 
        steady revenue growth and strong cash flows. Market sentiment is generally bullish 
        with a positive outlook for the next quarter.`;
      
      setSummary(mockSummary);
      setLoading(false);
    };

    fetchSummary();
  }, [symbol]);

  if (loading) {
    return <div className="animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
    </div>;
  }

  return (
    <div className="prose prose-invert">
      <p className="text-gray-300 leading-relaxed">{summary}</p>
    </div>
  );
}

export default StockSummary;