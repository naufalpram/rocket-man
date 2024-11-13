'use client'
import { ToolInvocation } from 'ai';
import { useChat } from 'ai/react';
import Image from "next/image";
import { Fragment, useRef } from 'react';
import Markdown from 'react-markdown';
import Services from '@/app/service';

export default function Home() {
  const promptRef = useRef<HTMLInputElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: 'api/chat',
    maxSteps: 5,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === 'astronomyPictureOfTheDay') {
        const arg = toolCall.args as { date: string };
        Services.get(`/planetary/apod?date=${arg.date}`)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
            
            return response.data;
          }
        }).catch((error) => {
          return error;
        })
      }
    },
  });

  return (
    <div className="flex flex-col justify-between min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className='text-4xl font-semibold font-space'>Rocket Man</h1>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Start typing your thoughts
          </li>
          <li>Chat with this super awesome chatbro</li>
        </ol>
        <section className="w-full bg-gray-900 p-8 flex flex-col gap-4 h-[500px] overflow-y-scroll chat-room rounded-lg">
          {(!messages || messages?.length === 0) && <span className='text-gray-500 font-medium self-center mt-40'>Start chatting with chatbro!</span>}
          {messages.map((message, idx) => (
            <Fragment key={idx}>
              <div className={`bg-slate-800 p-4 w-fit rounded-lg flex flex-col gap-3 ${message.role === 'assistant' ? "self-start" : "self-end"}`}>
                <div className="answer-pill text-white font-semibold">{message.role === 'assistant' ? "Rocket Man" : "You"}</div>
                {message.toolInvocations ? (
                  message.toolInvocations?.map((toolInvocation: ToolInvocation) => (
                    'result' in toolInvocation ? toolInvocation.result : 'Nothin\' to see here, bro'
                  ))
                ) : (<Markdown>{message.content}</Markdown>)}
              </div>
              {isLoading && idx === messages.length - 1 && <span className='text-gray-500'>Typing...</span>}
            </Fragment>
          ))}
          
        </section>
        <section className="w-full flex gap-4">
          <input value={input} onChange={handleInputChange} onKeyUp={(e) => e.key === 'Enter' && handleSubmit(e)} className="w-full h-10 p-3 text-gray-800 rounded-lg" placeholder="Input your prompt here" name="prompt" ref={promptRef} />
          <button className="text-white bg-transparent px-4 py-2" onClick={handleSubmit}>Submit</button>
        </section>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
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
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
