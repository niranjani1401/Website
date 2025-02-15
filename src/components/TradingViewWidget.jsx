import React, { useEffect, useRef } from "react";

const TradingViewWidget = ({ symbol }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clear any existing widgets before adding a new one
      containerRef.current.innerHTML = "";

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "symbol": symbol || "NASDAQ:AAPL",
        "width": "100%",
        "height": 500,
        "theme": "dark",
        "interval": "D",
        "timezone": "Etc/UTC",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_widget"
      });

      containerRef.current.appendChild(script);
    }
  }, [symbol]);

  return (
    <div className="tradingview-widget-container" ref={containerRef}></div>
  );
};

export default TradingViewWidget;
