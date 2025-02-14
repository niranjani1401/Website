import React, { useState } from 'react';
import { Search } from 'lucide-react';
import StockChart from '../components/StockChart';
import StockSummary from '../components/StockSummary';

const StockAnalysis = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      setSelectedStock(searchQuery.toUpperCase());
      setSearchQuery('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Search Section */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search US stocks (e.g., AAPL, GOOGL)"
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white text-lg"
            />
          </div>
        </form>
      </div>

      {selectedStock ? (
        <>
          <div className="bg-gray-900 rounded-xl p-6 mb-8 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">{selectedStock} Stock Performance</h2>
            <StockChart symbol={selectedStock} />
          </div>

          <div className="bg-gray-900 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">{selectedStock} Analysis Summary</h2>
            <StockSummary symbol={selectedStock} />
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            Enter a stock symbol above to view analysis and predictions
          </p>
        </div>
      )}
    </div>
  );
}

export default StockAnalysis;