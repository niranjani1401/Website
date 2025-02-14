import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import StockAnalysis from './pages/StockAnalysis';
import FaangPredictor from './pages/FaangPredictor';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stock-analysis" element={<StockAnalysis />} />
          <Route path="/faang-predictor" element={<FaangPredictor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;