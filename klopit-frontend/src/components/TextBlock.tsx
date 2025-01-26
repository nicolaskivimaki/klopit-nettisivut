import React from "react";

interface TextBlockProps {
  heading: string;
  content: string;
  list?: string[]; // Optional prop for a list of items
  className?: string; // Optional for custom styling
}

const TextBlock: React.FC<TextBlockProps> = ({ heading, content, list, className }) => (
  <div className={`text-block ${className || ""}`}>
    <div className="content">
      {heading && <h2>{heading}</h2>}
      <p>{content}</p>
      {list && (
        <ul>
          {list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default TextBlock;
