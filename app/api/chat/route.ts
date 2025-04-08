import { google } from '@ai-sdk/google';
import { smoothStream, streamText, tool } from 'ai';
import { z } from 'zod';
import {
  fetchAPOD,
  fetchEONET,
  getNaturalEventType
} from './nasa-api';
import { getServerConfig } from '@/lib/firebaseAdmin';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Access the server config
  const serverConfig = await getServerConfig();
  const modelName = serverConfig?.getString('model_name') ?? 'gemini-1.5-flash-latest';
  const systemMessage = serverConfig?.getString('system_message') ?? 'You only answer in slang based on the language of the user\'s prompt. You\'re cool and has interest in astronomy. You can still add your knowledge on everything, not just on astronomy.';
  const { messages } = await req.json();

  const result = streamText({
    model: google(modelName),
    system: systemMessage,
    messages,
    experimental_transform: smoothStream(),
    experimental_activeTools: ['astronomyPictureOfTheDay', 'getNaturalEventType', 'naturalEventsShowcase'],
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
      astronomyPictureOfTheDay: fetchAPOD,
      getNaturalEventType: getNaturalEventType,
      naturalEventsShowcase: fetchEONET
    }
  });

  return result.toDataStreamResponse();
}