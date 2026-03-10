import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from './LoginForm';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn()
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock LanguageSelector
vi.mock('../../../components/common/LanguageSelector', () => ({
    default: () => <div>LanguageSelector</div>
}));

// Mock Translation Context
vi.mock('../../../context/TranslationContext', () => ({
    T: ({ children }) => <span>{children}</span>,
    useTranslation: () => ({ changeLanguage: vi.fn() })
}));

// Mock Auth Service
const mockLogin = vi.fn();
vi.mock('../../../services/authService', () => ({
    authService: {
        login: (...args) => mockLogin(...args)
    }
}));

describe('Module 1: LoginForm', () => {
    const mockAuthContext = {
        login: vi.fn()
    };

    it('renders login form', () => {
        render(
            <AuthContext.Provider value={mockAuthContext}>
                <MemoryRouter>
                    <LoginForm />
                </MemoryRouter>
            </AuthContext.Provider>
        );
        expect(screen.getByText('Sign in to your')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g. 9876543210')).toBeInTheDocument();
    });

    it('submits form with correct credentials', async () => {
        // Setup success response
        mockLogin.mockResolvedValue({
            data: {
                token: 'fake-token',
                user: { role: 'FARMER', language: 'en' }
            }
        });

        render(
            <AuthContext.Provider value={mockAuthContext}>
                <MemoryRouter>
                    <LoginForm />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        // Fill Form
        fireEvent.change(screen.getByPlaceholderText('e.g. 9876543210'), { target: { value: '9999999999' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({ phone: '9999999999', password: 'password123' });
            expect(mockAuthContext.login).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard/farmer');
        });
    });
});
