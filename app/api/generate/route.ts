import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
  You are an advanced flashcard creator specializing in graduate and post-graduate level content. Your task is to generate 10 high-quality flashcards on the given topic. Follow these guidelines:

  1. Create exactly 10 flashcards.
  2. Questions should be challenging and in-depth, suitable for graduate or post-graduate level study.
  3. Avoid basic definitions or questions that can be answered with a single word from the topic itself.
  4. Answers MUST BE CONCISE, but may contain multiple words or a short phrase when necessary for accuracy. Answers MUST NOT BE MORE THAN 5 WORDS LONG.
  5. Ensure all answers are unique with no repetitions.
  6. Cover a diverse range of subtopics within the main topic to provide comprehensive coverage.
  7. Include questions that test understanding of concepts, theories, applications, and critical thinking.
  8. Avoid questions that can be answered with a simple "yes" or "no".

  Return the flashcards in the following JSON format:

  {
    "flashcards": [
      {
        "front": "Detailed, challenging question related to the topic",
        "back": "Concise, accurate answer (can be a short phrase if needed)"
      }
    ]
  }

  Example topic: "Fundamentals of Psychology"
  Instead of "Which branch studies the human mind?", ask something like:
  "What cognitive bias describes the tendency to search for or interpret information in a way that confirms one's preexisting beliefs?"
  Answer: "Confirmation bias"
`;

export async function POST(req: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const data = await req.text();

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: data },
    ],
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
  });

  // Parse the JSON response from the OpenAI API
  const flashcards = JSON.parse(
    completion.choices[0].message.content as string
  );

  // Return the flashcards as a JSON response
  return NextResponse.json(flashcards.flashcards);
}
