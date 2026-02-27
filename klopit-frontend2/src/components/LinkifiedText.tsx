import React from "react";

type Props = {
  text: string;
  className?: string;
};

const URL_RE = /https?:\/\/[^\s]+/g;
// Common punctuation that often sticks to the end of a pasted URL
const TRAILING_PUNCT_RE = /[),.!;:]+$/;

function splitTrailingPunct(url: string) {
  const m = url.match(TRAILING_PUNCT_RE);
  if (!m) return { clean: url, trailing: "" };
  return { clean: url.slice(0, -m[0].length), trailing: m[0] };
}

const LinkifiedText: React.FC<Props> = ({ text, className }) => {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(URL_RE)) {
    const rawUrl = match[0];
    const start = match.index ?? 0;

    if (start > lastIndex) nodes.push(text.slice(lastIndex, start));

    const { clean, trailing } = splitTrailingPunct(rawUrl);

    nodes.push(
      <a
        key={`${start}-${clean}`}
        href={clean}
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        {clean}
      </a>
    );

    if (trailing) nodes.push(trailing);

    lastIndex = start + rawUrl.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));

  return (
    <span className={className} style={{ whiteSpace: "pre-line" }}>
      {nodes}
    </span>
  );
};

export default LinkifiedText;