import React, { useEffect, useRef } from "react";

interface TradingViewWidgetProps {
  symbol?: string;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ symbol }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""; // Clears any existing widget
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol || "NASDAQ:AAPL",
      width: 1500,
      height: 500,
      theme: "dark",
      interval: "D",
      timezone: "Etc/UTC",
      style: "1",
      locale: "en",
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      container_id: "tradingview_widget",
    });

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }
  }, [symbol]);

  return <div className="tradingview-widget-container" ref={containerRef}></div>;
};

export default TradingViewWidget;