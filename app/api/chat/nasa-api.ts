import { z } from 'zod';
import { tool } from "ai";
import Services from '@/app/service';
import { getYesterdayDate } from '@/app/helper';
import { APODResponse } from "@/types/nasa-api";

/**
 * Get Astronomy Picture of The Day
 * @param {string} date The date of the requested picture.
 * @return {APODResponse} APOD response.
 */
const fetchAPOD = tool({
    description: 'Send a picture of NASA\'s astronomy picture of the day, tell me the explanation and add some funny comment on the picture.',
    parameters: z.object({
      date: z.string().describe(`The date of the requested picture. The default date is yesterday which is ${getYesterdayDate()}, you must convert the date to YYYY-MM-DD format.`),
    }),
    execute: async ({ date }: { date: string }): Promise<APODResponse> => {
      const formattedDate: Date = new Date(date);
      const response = await Services.get(`/planetary/apod?date=${formattedDate.toISOString().split('T')[0]}`);
      const data = response.data as APODResponse;
      return data;
    },
});

export { fetchAPOD };