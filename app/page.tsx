'use client'
import { Message } from 'ai';
import Image from "next/image";
import { KeyboardEventHandler, useCallback, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import MultiModalResult from './components/multi-modal-bubble';
import { AnimatePresence, LazyMotion, domAnimation } from 'motion/react';
import * as m from 'motion/react-m';
import { useChat } from '@ai-sdk/react';
import MemoizedMarkdown from './components/memoized-markdown';

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

const ChatStatus = memo(() => {
  const { status } = useChat({
    id: 'chat',
    maxSteps: 5
  });

  return status === 'submitted' && <TypingIndicator />;
});

ChatStatus.displayName = 'ChatStatus';

const UserPrompt = () => {
  const promptRef = useRef<HTMLInputElement>(null);
  const { status, append, stop } = useChat({
    id: 'chat',
    maxSteps: 5
  });

  const submitButtonVariant = {
    baseSubmit: { y: 0, opacity: 1 },
    baseLoading: { y: 10, opacity: 0 },
    transitionSubmit: { y: -10, opacity: 0 },
    transitionLoading: { y: 0, opacity: 1 }
  };
  const handleEnter: KeyboardEventHandler = useCallback((e) => {
    if (e.key === 'Enter' && promptRef.current && promptRef.current.value !== '') {
      append({ role: 'user', content: promptRef.current.value});
      promptRef.current.value = '';
    }
  }, [append]);

  const handleSubmit = useCallback(() => {
    if (status === 'submitted' || status === 'streaming') {
      stop();
      return;
    };
    if (promptRef.current && promptRef.current.value !== '') {
      append({ role: 'user', content: promptRef.current.value })
      promptRef.current.value = '';
    }
  }, [append, status, stop]);

  useEffect(() => {
    if (status === 'ready') promptRef.current?.focus();
  }, [status]);
  return (
    <>
    <input ref={promptRef} disabled={status === 'submitted'} onKeyUp={handleEnter} className="w-full h-10 py-6 px-8 bg-[#232037] text-white border border-white/30 rounded-lg" placeholder="Ask Rocket Man about anything!" name="prompt" />
    <button id='submit-btn' className="text-white bg-transparent px-4 py-2 min-w-[85px] flex justify-center items-center" onClick={handleSubmit}>
      {(status === 'ready' || status === 'error') && (
        <m.span variants={submitButtonVariant} initial={['baseSubmit', 'transitionSubmit']} animate='baseSubmit' exit='transitionSubmit'>Submit</m.span>
      )}
      {(status === 'submitted' || status === 'streaming') && (
        <m.span variants={submitButtonVariant} initial='baseLoading' animate='transitionLoading' exit='baseLoading'>Stop</m.span>
      )}
    </button>
    </>
  )
}

export default function Home() {
  const { messages } = useChat({
    id: 'chat',
    maxSteps: 5
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]);

  return (
    <LazyMotion features={domAnimation}>
    <div className="flex flex-col gap-10 min-h-screen p-8 pb-10 sm:py-10 sm:px-20 sm font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <h1 className='text-4xl font-semibold font-space text-[#fe754d]'>Rocket Man</h1>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Start typing your thoughts
          </li>
          <li>Chat about anything with this super awesome Rocket Man! {"(he loves astronomy)"}</li>
        </ol>
        <section ref={containerRef} className="w-full bg-[#16132b] p-8 flex flex-col gap-4 h-[550px] overflow-y-scroll chat-room rounded-lg">
          {(!messages || messages?.length === 0) && <span className='text-gray-500 font-medium self-center mt-20'>Start chatting with Rocket Man!</span>}
          {messages.map((message, idx) => (
            <ResultParser key={idx} message={message} isLastMessage={idx === messages.length - 1} />
          ))}
        </section>
        <section className="w-full flex gap-4">
          <UserPrompt />
        </section>
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center">
        <span>Made with Vercel AI SDK</span>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://api.nasa.gov/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Nasa Open API Docs
        </Link>
      </footer>
    </div>
    </LazyMotion>
  );
}
