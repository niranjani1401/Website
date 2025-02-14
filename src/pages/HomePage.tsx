import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Search, BarChart3 } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <TrendingUp className="h-20 w-20 text-blue-500" />
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
          Welcome to StockAI Predictor
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Your intelligent companion for stock market analysis and predictions
        </p>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <button
          onClick={() => navigate('/stock-analysis')}
          className="bg-gray-900 p-8 rounded-xl hover:bg-gray-800 transition-colors border border-gray-800 group"
        >
          <Search className="h-12 w-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-2xl font-semibold mb-4">Stock Analysis</h2>
          <p className="text-gray-400">
            Get detailed analysis of any US stock with AI-powered insights and technical charts
          </p>
        </button>

        <button
          onClick={() => navigate('/faang-predictor')}
          className="bg-gray-900 p-8 rounded-xl hover:bg-gray-800 transition-colors border border-gray-800 group"
        >
          <BarChart3 className="h-12 w-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-2xl font-semibold mb-4">FAANG Predictor</h2>
          <p className="text-gray-400">
            Analyze sentiment and predictions for FAANG stocks using advanced AI models
          </p>
        </button>
      </div>

      {/* About Section */}
      <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-blue-400">About Us</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 leading-relaxed">
            StockAI Predictor combines cutting-edge artificial intelligence with comprehensive market data 
            to provide you with accurate stock analysis and predictions. Our platform leverages advanced 
            machine learning models and real-time market data to help you make informed investment decisions.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mt-4">
            Whether you're analyzing individual stocks or tracking FAANG companies, our AI-powered insights 
            help you understand market trends, sentiment, and potential opportunities. We use sophisticated 
            natural language processing to analyze news, social media, and market data, providing you with 
            a comprehensive view of the market landscape.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;