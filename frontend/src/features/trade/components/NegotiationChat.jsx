/**
 * @fileoverview Negotiation Chat Component for AgriSahayak Trade System
 * 
 * WhatsApp-style chat interface for price negotiations between buyers
 * and farmers. Supports text messages, price proposals (with price/qty),
 * accept/reject/counter-offer actions, and a typing indicator.
 * 
 * Messages and negotiation state are persisted in localStorage
 * (mockNegotiations). Proposal messages show price details and
 * action buttons (Accept, Counter, Reject) for the recipient.
 * 
 * @component NegotiationChat
 * @param {Object} props
 * @param {string} props.negotiationId - ID of the negotiation
 * @param {string} props.currentUserId - Current user identifier
 * @param {string} props.currentUserRole - 'buyer' or 'farmer'
 * 
 * @see Epic 4, Story 4.4 - Negotiate Price
 * @see NegotiationPage - Page that renders this chat component
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Check, CheckCheck, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { T } from '../../../context/TranslationContext';

export default function NegotiationChat({ negotiationId, currentUserId, currentUserRole }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [proposedPrice, setProposedPrice] = useState('');
    const [proposedQuantity, setProposedQuantity] = useState('');
    const [showPriceProposal, setShowPriceProposal] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Load messages from mock data
    useEffect(() => {
        const negotiations = JSON.parse(localStorage.getItem('mockNegotiations') || '[]');
        const negotiation = negotiations.find(n => n.id === negotiationId);
        if (negotiation) {
            setMessages(negotiation.messages || []);
        }
    }, [negotiationId]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send text message
    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const message = {
            id: `msg_${Date.now()}`,
            sender: currentUserRole,
            type: 'text',
            content: newMessage,
            timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...messages, message];
        setMessages(updatedMessages);
        updateNegotiation(updatedMessages);
        setNewMessage('');

        // Simulate typing indicator
        simulateResponse();
    };

    // Send price proposal
    const sendProposal = () => {
        if (!proposedPrice || !proposedQuantity) return;

        const message = {
            id: `msg_${Date.now()}`,
            sender: currentUserRole,
            type: 'proposal',
            content: `Proposing ₹${proposedPrice}/kg for ${proposedQuantity}kg`,
            proposedPrice: Number(proposedPrice),
            proposedQuantity: Number(proposedQuantity),
            timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...messages, message];
        setMessages(updatedMessages);
        updateNegotiation(updatedMessages);
        setProposedPrice('');
        setProposedQuantity('');
        setShowPriceProposal(false);
    };

    // Accept current offer
    const acceptOffer = (message) => {
        const acceptMessage = {
            id: `msg_${Date.now()}`,
            sender: currentUserRole,
            type: 'accept',
            content: `Deal accepted! ₹${message.proposedPrice}/kg for ${message.proposedQuantity}kg.`,
            timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...messages, acceptMessage];
        setMessages(updatedMessages);
        updateNegotiation(updatedMessages, 'accepted');
    };

    // Reject current offer
    const rejectOffer = (message) => {
        const rejectMessage = {
            id: `msg_${Date.now()}`,
            sender: currentUserRole,
            type: 'reject',
            content: `Offer rejected.`,
            timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...messages, rejectMessage];
        setMessages(updatedMessages);
        updateNegotiation(updatedMessages);
    };

    // Counter offer
    const counterOffer = (originalMessage) => {
        setProposedPrice(originalMessage.proposedPrice);
        setProposedQuantity(originalMessage.proposedQuantity);
        setShowPriceProposal(true);
    };

    // Update negotiation in localStorage
    const updateNegotiation = (updatedMessages, status = 'active') => {
        const negotiations = JSON.parse(localStorage.getItem('mockNegotiations') || '[]');
        const index = negotiations.findIndex(n => n.id === negotiationId);
        if (index !== -1) {
            negotiations[index].messages = updatedMessages;
            negotiations[index].status = status;
            localStorage.setItem('mockNegotiations', JSON.stringify(negotiations));
        }
    };

    // Simulate other user typing
    const simulateResponse = () => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
    };

    // Format timestamp
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    // Render message bubble
    const renderMessage = (message) => {
        const isMine = message.sender === currentUserRole;
        const isProposal = message.type === 'proposal' || message.type === 'counter';
        const isAccept = message.type === 'accept';
        const isReject = message.type === 'reject';

        return (
            <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-4`}
            >
                <div className={`max-w-[70%] ${isMine ? 'order-2' : 'order-1'}`}>
                    {/* Message Bubble */}
                    <div
                        className={`rounded-2xl px-4 py-3 ${isMine
                            ? 'bg-emerald-500 text-white rounded-br-sm'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                            } ${isProposal ? 'border-2 border-emerald-400' : ''} ${isAccept ? 'bg-green-100 border-green-400' : ''
                            } ${isReject ? 'bg-red-100 border-red-400' : ''}`}
                    >
                        {/* Proposal Header */}
                        {isProposal && (
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-emerald-300">
                                <TrendingUp size={16} className="text-emerald-600" />
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                                    <T>Price Proposal</T>
                                </span>
                            </div>
                        )}

                        {/* Message Content */}
                        <p className="text-sm leading-relaxed">{message.content}</p>

                        {/* Proposal Details */}
                        {isProposal && (
                            <div className="mt-3 pt-3 border-t border-emerald-200 space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="font-semibold"><T>Price per kg:</T></span>
                                    <span className="font-bold">₹{message.proposedPrice}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="font-semibold"><T>Quantity:</T></span>
                                    <span className="font-bold">{message.proposedQuantity}kg</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-emerald-700 pt-1 border-t border-emerald-200">
                                    <span><T>Total:</T></span>
                                    <span>₹{message.proposedPrice * message.proposedQuantity}</span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons for Proposals (if not mine) */}
                        {isProposal && !isMine && (
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => acceptOffer(message)}
                                    className="flex-1 bg-green-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    <T>Accept</T>
                                </button>
                                <button
                                    onClick={() => counterOffer(message)}
                                    className="flex-1 bg-blue-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <T>Counter</T>
                                </button>
                                <button
                                    onClick={() => rejectOffer(message)}
                                    className="flex-1 bg-red-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <T>Reject</T>
                                </button>
                            </div>
                        )}

                        {/* Timestamp & Status */}
                        <div className={`flex items-center gap-1 mt-2 text-[10px] ${isMine ? 'text-emerald-100' : 'text-slate-400'}`}>
                            <span>{formatTime(message.timestamp)}</span>
                            {isMine && (
                                <CheckCheck size={12} className="text-emerald-200" />
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="flex flex-col h-[600px] bg-gradient-to-b from-emerald-50 to-white rounded-3xl border border-emerald-100 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 text-white">
                <h3 className="font-bold text-lg"><T>Price Negotiation</T></h3>
                <p className="text-xs text-emerald-100"><T>Chat to agree on the best price</T></p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                {messages.map(renderMessage)}

                {/* Typing Indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-slate-400 text-sm"
                    >
                        <div className="flex gap-1">
                            <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 0.6 }}
                                className="w-2 h-2 bg-slate-400 rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                className="w-2 h-2 bg-slate-400 rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                                className="w-2 h-2 bg-slate-400 rounded-full"
                            />
                        </div>
                        <span className="text-xs"><T>typing...</T></span>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Price Proposal Form */}
            <AnimatePresence>
                {showPriceProposal && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-emerald-50 border-t border-emerald-200 px-6 py-4"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={18} className="text-emerald-600" />
                            <span className="font-bold text-sm text-emerald-900"><T>Make a Price Proposal</T></span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <input
                                type="number"
                                placeholder="Price per kg (₹)"
                                value={proposedPrice}
                                onChange={(e) => setProposedPrice(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-emerald-300 text-sm"
                            />
                            <input
                                type="number"
                                placeholder="Quantity (kg)"
                                value={proposedQuantity}
                                onChange={(e) => setProposedQuantity(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-emerald-300 text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={sendProposal}
                                className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                <T>Send Proposal</T>
                            </button>
                            <button
                                onClick={() => setShowPriceProposal(false)}
                                className="px-4 bg-slate-200 text-slate-700 font-bold py-2 rounded-lg hover:bg-slate-300 transition-colors"
                            >
                                <T>Cancel</T>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="bg-white border-t border-slate-200 px-6 py-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowPriceProposal(!showPriceProposal)}
                        className="p-2 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200 transition-colors"
                        title="Make price proposal"
                    >
                        <TrendingUp size={20} />
                    </button>

                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 px-4 py-2 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />

                    <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
