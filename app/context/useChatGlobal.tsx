'use client'
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { ChatRequestOptions, Message } from 'ai';
import { useChat } from "ai/react";

type ChatGlobalContext = {
    messages: Message[],
    input: string,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void,
    handleSubmit: (event?: { preventDefault?: () => void }, chatRequestOptions?: ChatRequestOptions) => void,
    setInput: Dispatch<SetStateAction<string>>,
    isLoading: boolean
}

const defaultValues: ChatGlobalContext = {
    messages: [],
    input: '',
    handleInputChange: () => {},
    handleSubmit: () => {},
    setInput: () => {},
    isLoading: false
}

const ChatGlobalContext = createContext(defaultValues);

const ChatGlobalProvider = ({ children }: React.PropsWithChildren) => {
    const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
        api: 'api/chat',
        maxSteps: 5
      });

    return (
        <ChatGlobalContext.Provider value={{
            messages, input, handleInputChange, handleSubmit, isLoading, setInput
        }}>
            {children}
        </ChatGlobalContext.Provider>
    )
}

const useChatGlobal = () => useContext(ChatGlobalContext);

export { useChatGlobal, ChatGlobalProvider }
