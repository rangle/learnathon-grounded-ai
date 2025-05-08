import React, { useState, useEffect, useId } from "react";
import ReactMarkdown from "react-markdown";
import { GroundingMetadata, GroundingSupport, GroundingChunk } from "../page"; // Assuming types are exported from page.tsx or a types file
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Import Shadcn Popover components
import { PopoverClose } from "@radix-ui/react-popover"; // Import PopoverClose from Radix

// Icon for external link
const ExternalLinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface AnnotatedAnswerProps {
  answer: string;
  metadata: GroundingMetadata | null;
}

// Helper to escape regex special characters
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

// New component to handle individual source display with iframe and fallback
interface SourceDisplayProps {
  source: GroundingChunk;
}

const SourceDisplayWithIframe: React.FC<SourceDisplayProps> = ({ source }) => {
  const [iframeState, setIframeState] = useState<
    "loading" | "loaded" | "error"
  >("loading");
  const uniqueId = useId();

  // To handle cases where onError might not fire for X-Frame-Options, set a timeout.
  useEffect(() => {
    if (iframeState === "loading") {
      const timer = setTimeout(() => {
        setIframeState("error");
      }, 5000); // 5 seconds timeout for iframe load
      return () => clearTimeout(timer);
    }
  }, [iframeState]);

  const siteTitle = source.web.title || new URL(source.web.uri).hostname;

  return (
    <div
      className="p-3 mb-3 bg-gray-50 rounded-lg border border-gray-200 last:mb-0"
      role="listitem"
    >
      <div className="flex justify-between items-center mb-2">
        <p
          className="text-sm font-medium text-gray-700 truncate"
          title={siteTitle}
          id={`source-title-${uniqueId}`}
        >
          {siteTitle}
        </p>
        <a
          href={source.web.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          aria-label={`Open ${siteTitle} in new tab`}
        >
          Open <ExternalLinkIcon className="ml-1.5 h-3.5 w-3.5" />
        </a>
      </div>

      <div
        className="aspect-video w-full bg-gray-200 rounded flex items-center justify-center overflow-hidden relative"
        aria-labelledby={`source-title-${uniqueId}`}
      >
        {iframeState === "loading" && (
          <p className="text-xs text-gray-500">Attempting to load preview...</p>
        )}
        {iframeState === "error" && (
          <div className="text-center p-2">
            <p className="text-xs text-red-600 font-semibold">
              Live preview unavailable.
            </p>
            <p className="text-xs text-gray-500">
              This site may prevent embedding. Please use the &apos;Open&apos;
              button.
            </p>
          </div>
        )}
        <iframe
          src={source.web.uri}
          title={`Preview: ${siteTitle}`}
          className={`w-full h-full border-0 ${
            iframeState === "loaded" ? "block" : "hidden"
          }`}
          onLoad={() => setIframeState("loaded")}
          onError={() => setIframeState("error")} // This might not always catch X-Frame-Options issues
          sandbox="allow-scripts allow-same-origin" // Removed allow-popups for slightly more security
          aria-label={`Embedded preview of ${siteTitle}`}
        ></iframe>
      </div>
    </div>
  );
};

export const AnnotatedAnswer: React.FC<AnnotatedAnswerProps> = ({
  answer,
  metadata,
}) => {
  const popoverContentId = useId();
  if (!answer) return null;

  const { groundingSupports, groundingChunks } = metadata || {};

  // Fallback to simple ReactMarkdown if no grounding supports are available
  if (
    !groundingSupports ||
    !groundingChunks ||
    groundingSupports.length === 0 ||
    groundingChunks.length === 0
  ) {
    return (
      <div className="text-primary-800 leading-relaxed prose prose-primary max-w-none">
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>
    );
  }

  const chunkMap = new Map<number, GroundingChunk>(
    groundingChunks.map((chunk, index: number) => [index, chunk])
  );

  // currentAnswerParts will hold strings and Popover JSX elements
  let currentAnswerParts: React.ReactNode[] = [answer];

  groundingSupports.forEach(
    (support: GroundingSupport, supportIndex: number) => {
      const segmentText = support.segment.text;
      if (!segmentText) return;

      const newAnswerPartsAccumulator: React.ReactNode[] = [];
      currentAnswerParts.forEach((part, partIndex) => {
        if (typeof part === "string") {
          const regex = new RegExp(`(${escapeRegExp(segmentText)})`, "gi");
          const subParts = part.split(regex);

          subParts.forEach((subPartString, subPartIndex) => {
            if (
              regex.test(subPartString) &&
              subPartString.toLowerCase() === segmentText.toLowerCase()
            ) {
              const sources = support.groundingChunkIndices
                .map((chunkIndex: number) => chunkMap.get(chunkIndex))
                .filter(Boolean) as GroundingChunk[];

              // Key for the Popover component
              const popoverKey = `support-${supportIndex}-part-${partIndex}-match-${subPartIndex}`;

              newAnswerPartsAccumulator.push(
                <Popover key={popoverKey}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="bg-sky-100 text-sky-800 p-0.5 rounded font-semibold cursor-pointer hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-colors break-words text-left"
                    >
                      {/* Render highlighted text with ReactMarkdown, unwrapping paragraphs */}
                      <ReactMarkdown components={{ p: React.Fragment }}>
                        {subPartString}
                      </ReactMarkdown>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto max-w-md p-4 bg-white shadow-xl rounded-lg border border-gray-200 relative"
                    aria-labelledby={`popover-title-${popoverContentId}`}
                  >
                    <PopoverClose asChild>
                      <button
                        type="button"
                        aria-label="Close popover"
                        className="absolute top-2 right-2 p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all"
                      >
                        <CloseIcon className="w-4 h-4" />
                      </button>
                    </PopoverClose>
                    <div className="space-y-2 pr-6">
                      <h4
                        id={`popover-title-${popoverContentId}`}
                        className="font-medium leading-none text-sm text-gray-900 mb-3"
                      >
                        Cited Sources
                      </h4>
                      <div
                        className="flex flex-col space-y-0 max-h-[60vh] overflow-y-auto pr-1"
                        role="list"
                      >
                        {sources.map((s, i) => (
                          <SourceDisplayWithIframe key={i} source={s} />
                        ))}
                        {sources.length === 0 && (
                          <p className="text-xs text-muted-foreground">
                            No specific sources cited for this segment.
                          </p>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            } else if (subPartString) {
              // This is a non-highlighted string part
              newAnswerPartsAccumulator.push(subPartString);
            }
          });
        } else {
          // part is already a ReactNode (e.g., a Popover from a previous support segment)
          newAnswerPartsAccumulator.push(part);
        }
      });
      currentAnswerParts = newAnswerPartsAccumulator;
    }
  );

  return (
    <div className="text-primary-800 leading-relaxed prose prose-primary max-w-none">
      {currentAnswerParts.map((part, index) => {
        if (typeof part === "string") {
          if (part.trim() === "") {
            return null; // Don't render empty or whitespace-only strings
          }
          // Render string parts using ReactMarkdown
          return <ReactMarkdown key={index}>{part}</ReactMarkdown>;
        }
        // If part is already a JSX element (our Popover), render it directly
        // It already has its own key assigned during creation.
        return part;
      })}
    </div>
  );
};
