import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BuyNowButton from './BuyNowButton';
import { BrowserRouter } from 'react-router-dom';

// Mock Translation Context
vi.mock('../../../context/TranslationContext', () => ({
    T: ({ children }) => <span>{children}</span>
}));

// Mock Navigation
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
    };
});

describe('Module 3: BuyNowButton', () => {
    const mockCrop = {
        id: '123',
        name: 'Wheat',
        price: 20
    };

    it('renders correctly', () => {
        render(
            <BrowserRouter>
                <BuyNowButton crop={mockCrop} />
            </BrowserRouter>
        );
        expect(screen.getByText('Buy Now')).toBeInTheDocument();
    });

    it('navigates to payment page on click', () => {
        render(
            <BrowserRouter>
                <BuyNowButton crop={mockCrop} />
            </BrowserRouter>
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mockedNavigate).toHaveBeenCalledWith('/buy/123', { state: { crop: mockCrop } });
    });
});
