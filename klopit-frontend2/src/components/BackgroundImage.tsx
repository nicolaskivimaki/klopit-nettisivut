// src/components/BackgroundImage.tsx
import React from "react";

interface BackgroundImageProps {
  image?: string;
  title: string;
  description?: string;
  variant?: "frontPage" | "default";
  children?: React.ReactNode;
  focus?: string;
  focusMobile?: string;
}


const BackgroundImage: React.FC<BackgroundImageProps> = ({
  image,
  title,
  description,
  variant = "default",
  children,
  focus,
  focusMobile,
}) => {
  const style: React.CSSProperties & Record<string, string> = {};
  if (image) style.backgroundImage = `url(${image})`;
  if (focus) style["--bg-pos"] = focus;
  if (focusMobile) style["--bg-pos-mobile"] = focusMobile;

  return (
    <div
      className={`background-image ${variant === "frontPage" ? "front-page" : "default-page"} ${!image ? "no-background" : ""}`}
      style={image ? style : {}}
    >
      {image && <div className="background-overlay"></div>}
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