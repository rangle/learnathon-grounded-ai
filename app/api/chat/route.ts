// src/app/api/chat/route.ts
import { generateAnswer } from '@/app/lib/llm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Generate an answer using the Google Generative AI provider with search grounding enabled.
    const { answer, groundingMetadata } = await generateAnswer(query);

    return NextResponse.json({ answer, groundingMetadata });
  } catch (error) {
    console.error('Error in /api/chat POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
