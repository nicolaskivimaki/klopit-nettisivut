import React from "react";
import '@nocodeapi/embed-instagram-feed';

const InstaFeed: React.FC = () => {
    return (
        <div className="instagram-feed">
          <h2>Seuraa meitä Instagramissa!</h2>
          <embed-instagram-feed
            url="YOUR_NOCODEAPI_INSTAGRAM_ENDPOINT"
          ></embed-instagram-feed>
        </div>
      );
    };
    
    export default InstaFeed;
