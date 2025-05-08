import React from "react";

interface SourceLinkProps {
  uri: string;
  title: string;
}

export const SourceLink: React.FC<SourceLinkProps> = ({ uri, title }) => {
  return (
    <a
      href={uri}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-primary-100 text-primary-700 hover:bg-primary-200 hover:text-primary-800 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full transition-colors duration-150 ease-in-out break-all"
      title={title}
    >
      {title || new URL(uri).hostname}
    </a>
  );
};
