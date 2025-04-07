import { ChatGlobalProvider } from "@/app/context/useChatGlobal"
import { render, RenderOptions } from "@testing-library/react";
import { PropsWithChildren, ReactNode } from "react";

const AllProviders = ({ children }: PropsWithChildren) => {
    return <ChatGlobalProvider>{children}</ChatGlobalProvider>;
};

const customRender = (ui: ReactNode, options?: RenderOptions) => {
    render(ui, { wrapper: AllProviders, ...options });
};

export * from '@testing-library/react';
export { customRender as render };