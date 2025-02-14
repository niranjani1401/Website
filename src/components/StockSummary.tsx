import React, { useEffect, useState } from 'react';

interface StockSummaryProps {
  symbol: string;
}

const StockSummary: React.FC<StockSummaryProps> = ({ symbol }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('http://127.0.0.1:5000/analyze-stock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ticker: symbol })
        });
        if (!response.ok) {
          throw new Error('Failed to fetch stock summary');
        }
        const data = await response.json();
        setSummary(data.analysis);
      } catch (err) {
        setError('Error fetching stock summary. Please try again.');
      } finally {
        setLoading(false);
      }
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

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="prose prose-invert">
      <p className="text-gray-300 leading-relaxed">{summary}</p>
    </div>
  );
}

export default StockSummary;
