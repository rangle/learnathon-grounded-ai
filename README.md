# Grounded Q&A Chatbot v2

This Next.js project demonstrates a simple Retrieval-Augmented Generation (RAG) chatbot built using the Next.js App Router and the Vercel AI SDK. It's designed to get you up and running quickly (in about one hour) so that you can focus on exploring modern RAG, AI, and LLM practices—without spending too much time on environment setup.

**What It Does:**

- **Grounded Generation:** When a user submits a query, the app leverages the Vercel AI SDK with Google's Gemini model, configured for search grounding. This allows the LLM to access and incorporate relevant information from Google Search into its response. The initial prompt guides the LLM's task.
- **Display:** Both the final answer and the raw search results are shown in the UI, sparking creative discussion and exploration of additional utilities.

> **Note:** No separate API key is needed for the Vercel AI SDK—the only key required is the Google API key.

## Prerequisites

- Node.js (v18+ recommended)
- npm

You will need to supply:

- `GOOGLE_GENERATIVE_AI_API_KEY` – A Google Gemini API key. To obtain one:
  1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
  2. Sign in with your Google account
  3. Click "Create an API key"
  4. Select the "Gemini API" project
  5. Click "Create API key"

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rangle/learnathon-grounded-ai
   cd learnathon-grounded-ai
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
learnathon-grounded-ai/
├── app/
│   ├── api/chat/route.ts // Handles POST requests for chat, calls llm.ts
│   ├── lib/
│   │   └── llm.ts          // Handles LLM interactions via Vercel AI SDK
│   ├── layout.tsx        // Global layout (client component)
│   └── page.tsx          // Main chat interface (client component)
├── components/           // UI components
├── lib/
│   └── utils.ts          // General utility functions
├── public/               // Static assets
├── package.json
├── tsconfig.json
├── README.md
// ... (other root files like next.config.ts, tailwind.config.ts etc.)
```

## How It Works

1. **User Interface (`app/page.tsx`):**
   A React-based page where users enter their query. On submission, the page sends the query to an API route (e.g., `app/api/chat/route.ts`).

2. **API Route (`app/api/chat/route.ts`):**
   This Next.js App Router route handler defines the backend endpoint for the chat functionality.
   - **Path:** `app/api/chat/route.ts`
   - **Method:** `POST`
   - **Functionality:**
     - Receives the user's query from the request body.
     - Utilizes the `generateAnswer` function from `app/lib/llm.ts` to get a response from the LLM, including any grounding metadata.
     - Returns the generated answer and grounding metadata as a JSON response.
     - Includes basic input validation and error handling.

3. **Core Logic & Utility Modules:**
   - **`app/lib/llm.ts`:** Manages interactions with the Large Language Model (LLM) using the Vercel AI SDK and Google Generative AI. It's responsible for sending prompts, receiving generated text, and handling LLM-specific errors. It may include features like search grounding.
   - **`lib/utils.ts`:** Contains general-purpose helper functions and utilities that support various parts of the application's backend or frontend logic.

## Creative Challenges

Even though the core functionality is in place, here are a few creative tasks to explore:

- **Customize Prompts:** Modify any prompt construction logic (potentially within API routes or `lib/llm.ts`) to adjust tone, style, or structure.
- **UI Enhancements:** Add a toggle button in the UI (in `app/page.tsx`) to show/hide raw search results.
- **Additional Tool Integration:** Experiment by wiring up another tool (e.g., a simple weather converter) to demonstrate multi-step interactions in a RAG workflow.

## Where to Next?

This project serves as a jumping-off point for exploring modern AI/RAG practices. You can extend it with additional utilities, creative UI improvements, or by integrating real external APIs into your tool chain.

## License

This project is licensed under the MIT License.
