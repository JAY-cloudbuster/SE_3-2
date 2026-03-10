import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, CheckCircle } from 'lucide-react';
import { T, useT } from '../context/TranslationContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';

export default function RateFarmerModal({ isOpen, onClose, farmerId, farmerName }) {
    const { user } = useContext(AuthContext);
    const tr = useT();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error(tr('Please select a star rating'));
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post(`/ratings/${farmerId}`, { rating });
            toast.success(tr('Rating submitted successfully!'));
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error(tr(error.response?.data?.message || 'Failed to submit rating'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8 text-center">
                        {isSuccess ? (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center gap-4 text-emerald-600"
                            >
                                <CheckCircle size={64} className="text-emerald-500" />
                                <h3 className="text-2xl font-black"><T>Thank You!</T></h3>
                                <p className="text-slate-500"><T>Your feedback helps our community.</T></p>
                            </motion.div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">
                                    <T>Rate</T> {farmerName}
                                </h3>
                                <p className="text-slate-500 text-sm mb-8">
                                    <T>How was your experience buying from this farmer?</T>
                                </p>

                                <div className="flex justify-center gap-2 mb-8">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className="transition-transform hover:scale-110 active:scale-95"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                        >
                                            <Star
                                                size={48}
                                                className={`transition-colors ${
                                                    (hoverRating || rating) >= star
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-slate-200 fill-slate-50'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || rating === 0}
                                    className={`w-full py-3.5 rounded-xl font-bold transition-all ${
                                        rating > 0 && !isSubmitting
                                            ? 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg text-white'
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    {isSubmitting ? <T>Submitting...</T> : <T>Submit Rating</T>}
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}