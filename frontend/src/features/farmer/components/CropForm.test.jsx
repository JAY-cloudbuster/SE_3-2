import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CropForm from './CropForm';

// Mock Dependencies
vi.mock('../../../context/TranslationContext', () => ({
    T: ({ children }) => <span>{children}</span>
}));

vi.mock('../../../components/common/VoiceInput', () => ({
    default: () => <button>MIC</button>
}));

const mockCreateCrop = vi.fn();
vi.mock('../../../services/cropService', () => ({
    cropService: {
        create: (...args) => mockCreateCrop(...args)
    }
}));

describe('Module 2: CropForm', () => {

    it('renders form fields', () => {
        render(<CropForm />);
        expect(screen.getByText('List New Harvest')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g., Organic Wheat')).toBeInTheDocument();
    });

    it('submits data correctly', async () => {
        mockCreateCrop.mockResolvedValue({});
        const onCropAdded = vi.fn();

        render(<CropForm onCropAdded={onCropAdded} />);

        // Fill Inputs
        fireEvent.change(screen.getByPlaceholderText('e.g., Organic Wheat'), { target: { value: 'Rice' } });
        fireEvent.change(screen.getByPlaceholderText('e.g., Coimbatore, Tamil Nadu'), { target: { value: 'Salem' } });
        fireEvent.change(screen.getByPlaceholderText('1-200'), { target: { value: '100' } });
        fireEvent.change(screen.getByPlaceholderText('1-500'), { target: { value: '50' } });

        // Submit
        const submitBtn = screen.getByText('Publish Listing');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockCreateCrop).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Rice',
                location: 'Salem',
                quantity: '100',
                price: '50',
                quality: 'A' // default
            }));
            expect(onCropAdded).toHaveBeenCalled();
        });
    });
});
