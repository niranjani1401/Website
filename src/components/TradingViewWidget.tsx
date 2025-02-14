import React, { useEffect, useRef } from "react";

interface TradingViewWidgetProps {
  symbol?: string; // Symbol is optional (defaults to "NASDAQ:AAPL")
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ symbol = "NASDAQ:AAPL" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""; // Clears any existing widget before rendering a new one
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol,
      width: "100%",
      height: 500,
      theme: "light",
      interval: "D",
      timezone: "Etc/UTC",
      style: "1",
      locale: "en",
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      container_id: "tradingview_widget"
    });

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }
  }, [symbol]);

  return <div className="tradingview-widget-container" ref={containerRef}></div>;
};

export default TradingViewWidget;