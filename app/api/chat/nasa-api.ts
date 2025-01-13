import { z } from 'zod';
import { tool } from "ai";
import Services from '@/app/service';
import { getYesterdayDate } from '@/app/helper';
import { APODResponse, EONETEvent, EONETResponse } from "@/types/nasa-api";
import { GlobeDataArrayResponse } from '@/types/globe';
import { NATURAL_EVENTS } from '@/app/helper/constant';

const EONET_URL = 'https://eonet.gsfc.nasa.gov';

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

// const getNaturalEventType = tool({
//   description: 'Ask the user to choose natural event type.',
//   parameters: z.object({
//     message: z.string().describe(`The message to ask the user to choose natural event type from these option: ${NATURAL_EVENTS.map((event) => event.label).join(',')}`)
//   })
// })

const fetchEONET = tool({
  description: `Showcase Nasa\'s currently occuring natural events data in the last requested days, provided by the user. Ask the user to choose the type of natural event first. End it with your witty analysis on the data`,
  parameters: z.object({
    days: z.number().describe('The number of prior days (including today) from which natural events will be returned.'),
    eventType: z.string().describe(`The natural event type, limited to these options: ${NATURAL_EVENTS.map((event) => event.label).join(',')}`)
  }),
  execute: async ({ days, eventType }: { days: number, eventType: string }): Promise<GlobeDataArrayResponse>  => {
    const response = await Services.get(`${EONET_URL}/api/v2.1/events?limit=10&days=${days}&status=open`);
    const rawData = response.data as EONETResponse;
    const filteredData: GlobeDataArrayResponse = {
      data: rawData.events.filter((event: EONETEvent) => event.categories[0].title.toLowerCase() === eventType.toLowerCase())
            .map((data: EONETEvent) => ({
              lat: data.geometries[data.geometries.length - 1].coordinates[1],
              lng: data.geometries[data.geometries.length - 1].coordinates[0],
              size: 1,
              color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)],
              title: data.title,
              maxR: Math.random() * 20 + 3,
              propagationSpeed: 10,
              repeatPeriod: 2000
          }))
    }
    return filteredData;
  }
})

export {
  fetchAPOD,
  // getNaturalEventType,
  fetchEONET
};