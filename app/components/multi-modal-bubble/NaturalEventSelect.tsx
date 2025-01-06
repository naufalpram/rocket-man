import { NATURAL_EVENTS } from '@/app/helper/constant';
import { Message } from 'ai';
import React, { useState } from 'react'
import Markdown from 'react-markdown';

function NaturalEventSelect({ message, addResult }: { message: Message, addResult: (result: string ) => void }) {
  const [selected, setSelected] = useState<string | null>('');
  const selectType = (type: string) => {
    addResult(type);
    setSelected(type);
  }
  return (
    <>
    <Markdown>{message.content}</Markdown>
    <div className='flex gap-4 flex-wrap'>
        {NATURAL_EVENTS.map((event) => {
            const isSelected = selected !== '' && selected === event.label;
            const shouldDisabled = selected !== '' && selected !== event.label;
            return <button
                key={event.id}
                disabled={shouldDisabled}
                onClick={() => selectType(event.label)}
                className={`px-4 py-5 border font-medium border-white/35 rounded-md hover:bg-white hover:text-[#232037] transition-colors
                  ${shouldDisabled ? 'bg-transparent text-white opacity-60 hover:bg-transparent hover:text-white' : ''}
                  ${isSelected ? 'bg-white text-[#232037]' : ''}
                `}
            >
                {event.label}
            </button>
        })}
    </div>
    </>
  )
}

export default NaturalEventSelect;