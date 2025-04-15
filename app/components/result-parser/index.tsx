import { memo } from 'react';
import { Message } from 'ai';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useChat } from '@ai-sdk/react';
import MemoizedMarkdown from '../memoized-markdown';
import MultiModalResult from '../multi-modal-bubble';

const MessageParts = memo(({ parts }: { parts: Message['parts'] }) => {
    return (
      <>
        {parts?.map((part, idx) => {
          switch (part.type) {
            case 'text':
              return <MemoizedMarkdown key={idx} content={part.text} />;
            case 'tool-invocation':
              return <MultiModalResult key={part.toolInvocation.toolCallId} toolInvocation={part.toolInvocation} />;
            default:
              return null;
          }
        })}
      </>
    );
});
  
MessageParts.displayName = 'MessageParts';
  
const TypingIndicator = memo(() => (
    <AnimatePresence>
      <m.span layout initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className='text-gray-500 animate-pulse'>Typing...</m.span>
    </AnimatePresence>
));
  
TypingIndicator.displayName = 'TypingIndicator';
  
  
const ChatStatus = memo(() => {
    const { status } = useChat({
        id: 'chat',
        maxSteps: 5
    });

    return status === 'submitted' && <TypingIndicator />;
});

ChatStatus.displayName = 'ChatStatus';

const ResultParser = memo(({ message, isLastMessage }: { message: Message, isLastMessage: boolean }) => {
    return (
      <>
        <m.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.2 }} className={`chat-bubble p-4 w-fit max-w-[50%] rounded-lg flex flex-col gap-3 ${message.role}`}>
          <h4 className="role-pill">{message.role === 'assistant' ? "Rocket Man" : "You"}</h4>
          {message.parts && message.parts.length < 1 ? (
            <MemoizedMarkdown content={message.content} />
          ) : (
            <MessageParts parts={message.parts} />
          )}
        </m.div>
        {isLastMessage && <ChatStatus />}
      </>
    )
});
  
ResultParser.displayName = 'ResultParser';

export default ResultParser;
