import React from "react";

interface BackgroundImageProps {
  image?: string; // Make the image optional
  title: string;
  description?: string;
  variant?: "frontPage" | "default";
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
      <div className={image ? "background-overlay" : "no-background-overlay"}>
        <h1 className={`background-title ${variant === "default" ? "left-aligned" : ""}`}>
          {title}
        </h1>
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
