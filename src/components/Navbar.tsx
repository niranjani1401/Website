import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="bg-gray-900 py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <TrendingUp className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold">StockAI Predictor</h1>
        </Link>
        <nav className="flex space-x-6">
          <Link
            to="/stock-analysis"
            className={`text-lg ${location.pathname === '/stock-analysis' ? 'text-blue-500' : 'text-gray-300 hover:text-blue-400'}`}
          >
            Stock Analysis
          </Link>
          <Link
            to="/faang-predictor"
            className={`text-lg ${location.pathname === '/faang-predictor' ? 'text-blue-500' : 'text-gray-300 hover:text-blue-400'}`}
          >
            FAANG Predictor
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;