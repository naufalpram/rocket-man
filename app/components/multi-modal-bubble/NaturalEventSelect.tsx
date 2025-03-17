import { NATURAL_EVENTS } from '@/app/helper/constant';
import React, { useState } from 'react';
import * as m from 'motion/react-m';
import { useChat } from '@ai-sdk/react';

function NaturalEventSelect({ toolCallId }: { toolCallId: string }) {
  const { addToolResult } = useChat({
    id: 'chat',
    maxSteps: 5
  });
  const [selected, setSelected] = useState<string | null>('');
  const selectType = (type: string) => {
    if (!selected) {
      addToolResult({
        toolCallId,
        result: `You want me to show ${type}, yeah?`
      });
      setSelected(type);
    }
  }
  return (
    <>
    <div className='flex gap-4 flex-wrap'>
        {NATURAL_EVENTS.map((event, idx) => {
            const isSelected = selected !== '' && selected === event.label;
            const shouldDisabled = selected !== '' && selected !== event.label;
            return <m.button
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * (idx+1) }}
                key={event.id}
                disabled={shouldDisabled}
                onClick={() => selectType(event.label)}
                className={`px-4 py-5 border font-medium border-white/35 rounded-md transition-colors
                  ${shouldDisabled ? 'bg-transparent text-white opacity-60 hover:bg-transparent hover:text-white' : 'hover:bg-white hover:text-[#232037]'}
                  ${isSelected ? 'bg-white text-[#232037]' : ''}
                `}
            >
                {event.label}
            </m.button>
        })}
    </div>
    </>
  )
}

export default NaturalEventSelect;