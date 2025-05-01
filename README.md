# Grounded Q&A Chatbot v2

This Next.js project demonstrates a simple Retrieval-Augmented Generation (RAG) chatbot built using the Next.js App Router and the Vercel AI SDK. It’s designed to get you up and running quickly (in about one hour) so that you can focus on exploring modern RAG, AI, and LLM practices—without spending too much time on environment setup.

**What It Does:**

- **Retrieval:** When a user submits a query, the app calls Google’s grounding API to fetch relevant search results.
- **Prompt Construction:** It then uses these results to build a context prompt.
- **Generation:** This prompt (combined with the user query) is sent to an LLM via the Vercel AI SDK, which generates a grounded answer.
- **Display:** Both the final answer and the raw search results are shown in the UI, sparking creative discussion and exploration of additional utilities.

> **Note:** No separate API key is needed for the Vercel AI SDK—the only key required is the Google API key.

## Prerequisites

- Node.js (v18+ recommended)
- npm

You will need to supply:

- `GOOGLE_API_KEY` – Your Google Gemini API key.

## Setup

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/rangle/learnathon-grounded-ai](https://github.com/rangle/learnathon-grounded-ai).
   cd grounded-qa-chatbot-v2
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the project root with the following content:

   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
   ```

   (No additional keys are required.)
   You can get your Google API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4. **Run the project:**
   ```bash
   npm run dev
   ```
   Open your browser at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
grounded-qa-chatbot-v2/
├── package.json
├── tsconfig.json
├── README.md
└── src
    └── app
         ├── layout.tsx        // Global layout (client component)
         └── page.tsx          // Main chat interface (client component)
    └── lib
         ├── retrieval.ts     // Retrieves search results from Google's grounding API (or returns dummy data)
         ├── llm.ts           // Calls the LLM via the Vercel AI SDK to generate an answer
         └── prompt.ts        // Constructs a context prompt from the search results
```

## How It Works

1. **User Interface (`src/app/page.tsx`):**  
   A React-based page where users enter their query. On submission, the page sends the query to our API route.

2. **API Route (Next.js App Router in `src/app/api/chat/route.ts`):**  
   The API route:

   - Retrieves grounding results using the Google API (via `lib/retrieval.ts`).
   - Constructs a context string using `lib/prompt.ts`.
   - Calls the LLM (via `lib/llm.ts`) to generate a final answer.
   - Returns the answer along with the raw search results.

3. **RAG Modules (`src/lib/`):**
   - **retrieval.ts:** Fetches search results from Google’s grounding API (or returns dummy data if unavailable).
   - **prompt.ts:** Builds a context string using immutable array methods.
   - **llm.ts:** Sends the combined prompt to the LLM using the Vercel AI SDK and returns the generated answer.

## Creative Challenges

Even though the core functionality is in place, here are a few creative tasks to explore:

- **Customize the Prompt:** Modify the prompt construction in `src/lib/prompt.ts` to adjust tone, style, or structure.
- **UI Enhancements:** Add a toggle button in the UI (in `src/app/page.tsx`) to show/hide raw search results.
- **Additional Tool Integration:** Experiment by wiring up another tool (e.g., a simple weather converter) to demonstrate multi-step interactions in a RAG workflow.

## Where to Next?

This project serves as a jumping-off point for exploring modern AI/RAG practices. You can extend it with additional utilities, creative UI improvements, or by integrating real external APIs into your tool chain.

## License

This project is licensed under the MIT License.
