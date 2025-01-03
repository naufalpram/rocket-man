import { NATURAL_EVENTS } from '@/app/helper/constant'
import { Message } from 'ai';
import React from 'react'
import Markdown from 'react-markdown';

function NaturalEventSelect({ message, addResult }: { message: Message, addResult: (result: string ) => void }) {

  return (
    <>
    <Markdown>{message.content}</Markdown>
    <div className='flex justify-around'>
        {NATURAL_EVENTS.map((event) => (
            <button
                key={event.id}
                onClick={() => addResult(event.label)}
                className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
            >
                {event.label}
            </button>
        ))}
    </div>
    </>
  )
}

export default NaturalEventSelect;