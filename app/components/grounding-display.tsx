import React from "react";
import { GroundingMetadata } from "../page"; // Import the main metadata type
import { SearchEntryPointDisplay } from "./search-entry-point-display";
import { AnnotatedAnswer } from "./annotated-answer";

interface GroundingDisplayProps {
  answer: string;
  metadata: GroundingMetadata | null;
}

export const GroundingDisplay: React.FC<GroundingDisplayProps> = ({
  answer,
  metadata,
}) => {
  if (!metadata && !answer) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Display the Answer, potentially annotated FIRST */}
      {answer && (
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h3 className="text-xl font-semibold text-primary-900 mb-4">
            Answer
          </h3>
          <AnnotatedAnswer answer={answer} metadata={metadata} />
        </div>
      )}

      {/* Display Search Entry Point (e.g., Google search card) AFTER answer */}
      {metadata?.searchEntryPoint?.renderedContent && (
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-3">
            Search Insights
          </h3>
          <SearchEntryPointDisplay
            renderedContent={metadata.searchEntryPoint.renderedContent}
          />
        </div>
      )}

      {/* Display Web Search Queries Used AFTER answer */}
      {metadata?.webSearchQueries && metadata.webSearchQueries.length > 0 && (
        <div className="bg-primary-50 rounded-2xl p-6 border border-primary-200">
          <h4 className="text-lg font-semibold text-primary-900 mb-3">
            Search Queries Used
          </h4>
          <ul className="list-disc list-inside text-sm text-primary-700 space-y-1">
            {metadata.webSearchQueries.map((query, index) => (
              <li key={index}>{query}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Optionally, display raw grounding JSON if needed for debugging or full transparency */}
      {/* For now, we are focusing on integrated display, so this is commented out
      {metadata && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-700 mb-2">Raw Grounding Data (Debug)</h4>
          <pre className="bg-white p-3 rounded overflow-auto text-xs text-gray-600">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </div>
      )}
      */}
    </div>
  );
};
