/**
 * @fileoverview Negotiator Component for AgriSahayak Trade System
 * 
 * Minimal real-time price negotiation widget using Socket.IO.
 * Listens for 'receive_offer' events and emits 'send_offer' events.
 * Displays a chat-like interface with offer amounts formatted via
 * formatCurrency. Simpler alternative to NegotiationChat; used for
 * quick inline negotiations within modals or panels.
 * 
 * @component Negotiator
 * @param {Object} props
 * @param {string} props.listingId - The crop listing ID
 * @param {string} props.recipientId - The other party's user ID
 * 
 * @see Epic 4, Story 4.4 - Negotiate Price (Socket-Based)
 * @see SocketContext - Provides the WebSocket connection
 */
import { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../../../context/SocketContext';
import { formatCurrency } from '../../../utils/formatters';

export default function Negotiator({ listingId, recipientId }) {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [proposal, setProposal] = useState('');

  useEffect(() => {
    if (!socket) return;
    // Listen for incoming offers (Story 4.4)
    socket.on('receive_offer', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off('receive_offer');
  }, [socket]);

  const sendOffer = (e) => {
    e.preventDefault();
    const offerData = { listingId, recipientId, amount: proposal, type: 'OFFER' };
    socket.emit('send_offer', offerData); // Story 4.4
    setMessages((prev) => [...prev, { ...offerData, sender: 'me' }]);
    setProposal('');
  };

  return (
    <div className="glass-card flex flex-col h-[400px] w-full max-w-md overflow-hidden">
      <div className="bg-emerald-600 p-4 text-white font-bold">Price Negotiation</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-2xl max-w-[80%] shadow-sm ${msg.sender === 'me' ? 'bg-emerald-500 text-white' : 'bg-white border'
              }`}>
              {msg.type === 'OFFER' ? `Proposed Price: ${formatCurrency(msg.amount)}` : msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendOffer} className="p-4 bg-white border-t flex gap-2">
        <input
          type="number"
          placeholder="Enter offer ₹"
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          className="flex-1 border rounded-xl px-3 outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button className="btn-primary py-2 px-4 shadow-none text-sm">Send Offer</button>
      </form>
    </div>
  );
}