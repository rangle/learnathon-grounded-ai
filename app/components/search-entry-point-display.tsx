import React from "react";

interface SearchEntryPointDisplayProps {
  renderedContent: string;
}

export const SearchEntryPointDisplay: React.FC<
  SearchEntryPointDisplayProps
> = ({ renderedContent }) => {
  if (!renderedContent) {
    return null;
  }

  return (
    <div
      className="mb-6"
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};
