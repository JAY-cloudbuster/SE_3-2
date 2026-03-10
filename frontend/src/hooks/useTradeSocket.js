/**
 * useTradeSocket — Trade room hook (REST-first, socket as enhancement)
 *
 * Messages are sent and received via REST API (always reliable).
 * Socket events are used as a real-time speedup when the connection is live.
 * Bids are still sent via socket (they always were and that works).
 */
import { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import api from '../services/api';

export default function useTradeSocket(listingId) {
    const socket = useContext(SocketContext);
    const [bids, setBids] = useState([]);
    const [messages, setMessages] = useState([]);
    const [bidStatusUpdate, setBidStatusUpdate] = useState(null);
    const joinedRef = useRef(false);
    const messageIdsRef = useRef(new Set());

    // Helper: merge message avoiding duplicates
    const mergeMessage = useCallback((msg) => {
        const id = msg._id;
        if (messageIdsRef.current.has(id)) return;
        messageIdsRef.current.add(id);
        setMessages(prev => [...prev, msg].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        ));
    }, []);

    // ── Join socket trade room ───────────────────────────────────────
    useEffect(() => {
        if (!socket || !listingId) return;
        if (!joinedRef.current) {
            socket.emit('join_trade_room', listingId);
            joinedRef.current = true;
        }

        const handleNewBid = (bid) => {
            setBids(prev => {
                const exists = prev.some(b => b._id === bid._id);
                return exists ? prev : [bid, ...prev];
            });
        };

        const handleNewMessage = (msg) => mergeMessage(msg);

        const handleBidStatus = (bid) => {
            setBidStatusUpdate(bid);
            setBids(prev => prev.map(b => b._id === bid._id ? bid : b));
        };

        socket.on('new_bid', handleNewBid);
        socket.on('new_message', handleNewMessage);
        socket.on('bid_status_updated', handleBidStatus);

        return () => {
            socket.off('new_bid', handleNewBid);
            socket.off('new_message', handleNewMessage);
            socket.off('bid_status_updated', handleBidStatus);
            joinedRef.current = false;
        };
    }, [socket, listingId, mergeMessage]);

    // ── REST: Send a message (always works, even without socket) ────
    const sendMessage = useCallback(async ({ receiverId, text }) => {
        if (!listingId || !receiverId || !text?.trim()) return;
        try {
            const res = await api.post('/bidmessage/messages', {
                listingId,
                receiverId,
                text: text.trim(),
            });
            // Optimistically add the message to state immediately
            mergeMessage(res.data);
        } catch (err) {
            console.error('Failed to send message:', err);
            throw err; // Let TradeRoom handle the toast
        }
    }, [listingId, mergeMessage]);

    // ── Socket: Send a bid (unchanged) ──────────────────────────────
    const sendBid = useCallback((data) => {
        if (socket) socket.emit('place_bid', { listingId, ...data });
    }, [socket, listingId]);

    const updateBidStatus = useCallback((bidId, status) => {
        if (socket) socket.emit('update_bid_status', { bidId, status });
    }, [socket]);

    return {
        bids, setBids,
        messages, setMessages,
        bidStatusUpdate,
        sendBid, sendMessage, updateBidStatus,
        socket,
        mergeMessage,
    };
}
