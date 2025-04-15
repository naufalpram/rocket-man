'use client'
import React, { createContext, Dispatch, SetStateAction, useContext } from "react";
import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { useChat } from "@ai-sdk/react";

type ChatGlobalContext = {
    messages: Message[],
    input: string,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void,
    handleSubmit: (event?: { preventDefault?: () => void }, chatRequestOptions?: ChatRequestOptions) => void,
    setInput: Dispatch<SetStateAction<string>>,
    status: "submitted" | "streaming" | "ready" | "error",
    addToolResult: ({ toolCallId, result, }: { toolCallId: string; result: unknown }) => void,
    append: (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>
}

const defaultValues: ChatGlobalContext = {
    messages: [],
    input: '',
    handleInputChange: () => {},
    handleSubmit: () => {},
    setInput: () => {},
    status: 'ready',
    addToolResult: () => {},
    append: async (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions | undefined): Promise<string | null | undefined> => {
        try {
          // Simulate processing the message
          console.log("Appending message:", message);
          
          // If needed, process chatRequestOptions
          if (chatRequestOptions) {
            console.log("Chat request options:", chatRequestOptions);
          }
          
          // Return some identifier or response
          return "Message appended successfully";
        } catch (error) {
          console.error("Error appending message:", error);
          return null;
        }
      }
}

const ChatGlobalContext = createContext(defaultValues);

const ChatGlobalProvider = ({ children }: React.PropsWithChildren) => {
    const { messages, input, handleInputChange, handleSubmit, setInput, addToolResult, status, append } = useChat({
        api: 'api/chat',
        maxSteps: 5
      });

    return (
        <ChatGlobalContext.Provider value={{
            messages, input, handleInputChange, handleSubmit, status, setInput, addToolResult, append
        }}>
            {children}
        </ChatGlobalContext.Provider>
    )
}

const useChatGlobal = () => useContext(ChatGlobalContext);

export { useChatGlobal, ChatGlobalProvider }
