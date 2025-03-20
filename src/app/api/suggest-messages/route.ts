import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST() {
  try {
    // const { messages } = await req.json();

    // Define a prompt if messages are empty or need structure
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Use the new OpenAI SDK for streaming responses
    const result = streamText({
      model: openai("gpt-4o"),
      //   messages: messages ?? [{ role: "system", content: prompt }],
      maxTokens: 400,
      prompt,
    });

    //    // Return the response as a JSON object
    // return new Response(
    //   JSON.stringify({ response: result.text }), // Convert response to JSON
    //   { status: 200, headers: { "Content-Type": "application/json" } }
    // );

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("An error occurred:", error);

    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
