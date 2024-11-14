import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

function getYesterdayDate(): string {
  const today: Date = new Date();
  today.setDate(today.getDate() - 1);
  return today.toISOString().split('T')[0];
}

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    system: 'You only answer in slang based on the language of the user\'s prompt. You\'re cool and has interest in astronomy. You can still add your knowledge on everything, not just on astronomy.',
    messages,
    tools: {
      weather: tool({
        description: 'Get the weather in a location (farenheit)',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
      convertFarenheitToCelsius: tool({
        description: 'Convert a temperature in farenheit to celsius',
        parameters: z.object({
          temperature: z
            .number()
            .describe('The temperature in farenheit to convert'),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          return {
            celsius,
          };
        },
      }),
      astronomyPictureOfTheDay: tool({
        description: 'Send a picture of NASA\'s astronomy picture of the day, tell me the explanation and add some funny comment on the picture.',
        parameters: z.object({
          date: z.string().describe(`The date of the requested picture. The default date is yesterday which is ${getYesterdayDate()}, you must convert the date to YYYY-MM-DD format.`),
        }),
      }),
    }
  });

  return result.toDataStreamResponse();
}