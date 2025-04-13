// src/components/BackgroundImage.tsx
import React from "react";

interface BackgroundImageProps {
  image?: string;
  title: string;
  description?: string;
  variant?: "frontPage" | "default";
  children?: React.ReactNode;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({
  image,
  title,
  description,
  variant = "default",
  children,
}) => {
  return (
    <div
      className={`background-image ${variant === "frontPage" ? "front-page" : "default-page"} ${!image ? "no-background" : ""}`}
      style={image ? { backgroundImage: `url(${image})` } : {}}
    >
      {/* Dark overlay goes first (behind the content) */}
      {image && <div className="background-overlay"></div>}
      
      {/* Content container positioned above the overlay */}
      <div className="background-content-wrapper">
        <h1 className="background-title">{title}</h1>
        {description && (
          <div className="text-container">
            <p className="background-description">{description}</p>
          </div>
        )}
        {children && <div className="background-content">{children}</div>}
      </div>
    </div>
  );
};

export default BackgroundImage;