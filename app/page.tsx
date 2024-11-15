'use client'
import { Message, ToolInvocation } from 'ai';
import { useChat } from 'ai/react';
import Image from "next/image";
import { useRef } from 'react';
import Markdown from 'react-markdown';
import APODResult from './components/multi-modal-result/Apod';
import Link from 'next/link';

const ResultParser = ({
  idx,
  messages,
  message,
  isLoading
}: {
  idx: number,
  messages: Message[],
  message: Message,
  isLoading: boolean
}) => {
  const MultiModalResult = ({ toolInvocation }: { toolInvocation: ToolInvocation }) => {
    if ('result' in toolInvocation) {
      switch (toolInvocation.toolName) {
        case 'astronomyPictureOfTheDay':
          return <APODResult key={toolInvocation.toolCallId} result={toolInvocation.result} />
        default:
          return null;
      }
    } else if (toolInvocation.state === 'call' || toolInvocation.state === 'partial-call') {
      return 'Getting there...'
    }
    return 'Nothin\' to see here, bro'
  }
  return (
    <>
      <div className={`chat-bubble p-4 w-fit max-w-[50%] rounded-lg flex flex-col gap-3 ${message.role}`}>
        <div className="role-pill">{message.role === 'assistant' ? "Rocket Man" : "You"}</div>
        {message.toolInvocations ? (
          message.toolInvocations?.map((toolInvocation: ToolInvocation) => (
            <MultiModalResult key={toolInvocation.toolCallId} toolInvocation={toolInvocation} />
          ))
        ) : (<Markdown>{message.content}</Markdown>)}
      </div>
      {isLoading && idx === messages.length - 1 && <span className='text-gray-500'>Typing...</span>}
    </>
  )
}

export default function Home() {
  const promptRef = useRef<HTMLInputElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: 'api/chat',
    maxSteps: 5,
  });

  return (
    <div className="flex flex-col gap-10 min-h-screen p-8 pb-10 sm:py-10 sm:px-20 sm font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <h1 className='text-4xl font-semibold font-space text-[#fe754d]'>Rocket Man</h1>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Start typing your thoughts
          </li>
          <li>Chat about anything with this super awesome Rocket Man! {"(he loves astronomy)"}</li>
        </ol>
        <section className="w-full bg-[#16132b] p-8 flex flex-col gap-4 h-[550px] overflow-y-scroll chat-room rounded-lg">
          {(!messages || messages?.length === 0) && <span className='text-gray-500 font-medium self-center mt-20'>Start chatting with Rocket Man!</span>}
          {messages.map((message, idx) => (
            <ResultParser key={idx} idx={idx} isLoading={isLoading} messages={messages} message={message} />
          ))}
        </section>
        <section className="w-full flex gap-4">
          <input value={input} onChange={handleInputChange} onKeyUp={(e) => e.key === 'Enter' && handleSubmit(e)} className="w-full h-10 py-6 px-8 bg-[#232037] text-white border border-white/30 rounded-lg" placeholder="Ask Rocket Man about anything!" name="prompt" ref={promptRef} />
          <button className="text-white bg-transparent px-4 py-2" onClick={handleSubmit}>Submit</button>
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
  );
}
