import { google } from '@ai-sdk/google';
import { GoogleGenerativeAIProviderMetadata } from '@ai-sdk/google';
import { generateText } from 'ai';

// Custom error types for better error handling
class LLMError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LLMError';
  }
}

class InvalidInputError extends LLMError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInputError';
  }
}

class AIGenerationError extends LLMError {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'AIGenerationError';
  }
}

/**
 * Generates an answer using the Vercel AI SDK's Google Generative AI provider with search grounding enabled.
 * @param query The user's question to be answered
 * @returns An object containing the answer and optional grounding metadata
 * @throws {InvalidInputError} If the query is invalid
 * @throws {AIGenerationError} If there's an error generating the response
 */
export async function generateAnswer(query: string): Promise<{ answer: string; groundingMetadata?: unknown }> {
  // Input validation
  if (!query || query.trim().length === 0) {
    throw new InvalidInputError('Query cannot be empty');
  }

  if (query.length > 1000) {
    throw new InvalidInputError('Query is too long. Maximum length is 1000 characters');
  }

  try {
    // Construct the prompt
    const prompt = `Answer the following question concisely: ${query.trim()}`;

    // Call generateText with the Google provider
    const { text, providerMetadata } = await generateText({
      model: google('gemini-2.0-flash-001', {
        useSearchGrounding: true,
      }),
      prompt,
    });

    // Validate the response
    if (!text) {
      throw new AIGenerationError('No response received from the AI model');
    }

    // Extract the grounding metadata for additional context
    const metadata = providerMetadata?.google as GoogleGenerativeAIProviderMetadata | undefined;
    const groundingMetadata = metadata?.groundingMetadata;

    return { answer: text, groundingMetadata };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle specific error types
    if (error instanceof LLMError) {
      throw error;
    }

    // Handle rate limiting errors
    if (error?.message?.includes('rate limit')) {
      throw new AIGenerationError('Rate limit exceeded. Please try again later.', error);
    }

    // Handle network errors
    if (error?.message?.includes('network') || error?.message?.includes('timeout')) {
      throw new AIGenerationError('Network error occurred. Please check your connection.', error);
    }

    // Handle any other unexpected errors
    throw new AIGenerationError(
      'An unexpected error occurred while generating the response.',
      error
    );
  }
}
