import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface StockChartProps {
  symbol: string;
}

interface StockData {
  date: string;
  value: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const StockChart: React.FC<StockChartProps> = ({ symbol }) => {
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError('');
      try {
        // Mock data generation for demonstration
        const mockData = Array.from({ length: 365 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (364 - i));
          
          const baseValue = 100 + Math.sin(i / 10) * 20 + Math.random() * 10;
          const volatility = 5;
          
          return {
            date: date.toISOString().split('T')[0],
            open: baseValue - volatility + Math.random() * volatility * 2,
            high: baseValue + volatility,
            low: baseValue - volatility,
            close: baseValue - volatility + Math.random() * volatility * 2,
            volume: Math.floor(1000000 + Math.random() * 9000000),
            value: baseValue,
          };
        });
        
        setData(mockData);
      } catch (err) {
        setError('Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="h-96 flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            tickFormatter={(value) => value.split('-').slice(1).join('/')}
          />
          <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#fff',
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StockChart;