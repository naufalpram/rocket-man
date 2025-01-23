import { afterEach, describe, expect, test } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import Home from '../app/page';
 
afterEach(() => {
    cleanup();
})

describe('Home page', () => {
    test('should match snapshot', () => {
        render(<Home />);
        expect(screen).toMatchSnapshot();
    });

    test('should have "Rocket Man" heading', () => {
      render(<Home />);
      expect(screen.getByRole('heading', { level: 1, name: 'Rocket Man' })).toBeDefined();
    });
    
    test('should have prompt input', () => {
        render(<Home />);
        expect(screen.getByPlaceholderText('Ask Rocket Man about anything!')).toBeDefined();
    });
    
    test('should have submit button', () => {
        render(<Home />);
        expect(screen.getByRole('button', { name: 'Submit' })).toBeDefined();
    });

    test('should contain "Made with Vercel AI SDK and NASA Open API link"', () => {
        render(<Home />);
        expect(screen.getByText(/Made with Vercel AI SDK/i)).toBeDefined();
        expect(screen.getByRole('link', { name: 'Nasa Open API Docs' })).toBeDefined();
    });

    test.skip('should have chat bubbles after submiting prompt', async () => {
        render(<Home />);
        const input = screen.getByPlaceholderText('Ask Rocket Man about anything!');
        const button = screen.getByRole('button', { name: 'Submit' });
        
        fireEvent.input(input, { target: { value: 'Hello, Bro!' } });
        fireEvent.click(button);

        expect(await screen.findByText(/Hello, Bro!/i)).toBeDefined();
    });
});