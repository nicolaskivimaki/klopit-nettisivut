import React from "react";

interface TextBlockProps {
  heading?: string;
  content: string;
  list?: string[];       // Optional prop for a list of items
  className?: string;    // Optional for custom styling
}

const TextBlock: React.FC<TextBlockProps> = ({
  heading,
  content,
  list,
  className,
}) => {
  // Split on one or more blank lines, trim out any stray whitespace
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <div className={`text-block ${className ?? ""}`}>
      <div className="content">
        {heading && (
          <h2 className="text-2xl font-semibold mb-6">{heading}</h2>
        )}
        {paragraphs.map((para, idx) => (
          <p key={idx} className="mb-4 leading-relaxed">
            {para}
          </p>
        ))}
        {list && (
          <ul className="list-disc list-inside mt-4">
            {list.map((item, index) => (
              <li key={index} className="mb-2">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TextBlock;
