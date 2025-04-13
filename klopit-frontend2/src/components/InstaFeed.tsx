import React, { useEffect } from "react";
import "../styles/index.css";

const InstaFeed: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.powr.io/powr.js?platform=html";
    script.async = true;
    document.head.appendChild(script);

    // Continuously hide watermark
    const hideWatermark = () => {
      const watermarks = document.querySelectorAll<HTMLElement>(".powrMark, .socialFeed .powrMark");
      watermarks.forEach((wm) => {
        wm.style.display = "none";
      });
    };

    hideWatermark();
    const observer = new MutationObserver(hideWatermark);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect(); // Cleanup
  }, []);

  return (
    <div className="instagram-feed component-wrapper">
      <h2>Seuraa meitä Instagramissa!</h2>
    </div>
  );
};

export default InstaFeed;