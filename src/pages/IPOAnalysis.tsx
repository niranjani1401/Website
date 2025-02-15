import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import IPOSummary from '../components/IPOSummary';

const IPOAnalysis = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIPO, setSelectedIPO] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim().toUpperCase();

    if (trimmedQuery) {
      setLoading(true);
      // Set the symbol to be used by IPOSummary; 
      // IPOSummary will then fetch the analysis using that symbol.
      setSelectedIPO(trimmedQuery);
      setSearchQuery('');
      setTimeout(() => setLoading(false), 500);
    }
  }, [searchQuery]);

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
              placeholder="Search IPOs (e.g., RDDT, ARM)"
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white text-lg"
              disabled={loading}
            />
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-blue-400 text-lg">Loading IPO data...</p>
        </div>
      ) : selectedIPO ? (
        <>
          <div className="bg-gray-900 rounded-xl p-6 mb-8 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">IPO Performance</h2>
            <p className="text-white">{selectedIPO}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">IPO Analysis Summary</h2>
            <IPOSummary symbol={selectedIPO} />
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            Enter an IPO symbol above to view analysis and predictions
          </p>
        </div>
      )}
    </div>
  );
};

export default IPOAnalysis;
