import { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

export default function useTradeSocket(listingId) {
    const socket = useContext(SocketContext);
    const [bids, setBids] = useState([]);
    const [messages, setMessages] = useState([]);
    const [bidStatusUpdate, setBidStatusUpdate] = useState(null);
    const joinedRef = useRef(false);

    useEffect(() => {
        if (!socket || !listingId) return;

        if (!joinedRef.current) {
            socket.emit('join_trade_room', listingId);
            joinedRef.current = true;
        }

        const handleNewBid = (bid) => {
            setBids((prev) => {
                const exists = prev.some((b) => b._id === bid._id);
                return exists ? prev : [bid, ...prev];
            });
        };

        const handleNewMessage = (msg) => {
            setMessages((prev) => {
                const exists = prev.some((m) => m._id === msg._id);
                return exists ? prev : [...prev, msg];
            });
        };

        const handleBidStatus = (bid) => {
            setBidStatusUpdate(bid);
            setBids((prev) => prev.map((b) => (b._id === bid._id ? bid : b)));
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
    }, [socket, listingId]);

    const sendBid = useCallback(
        (data) => {
            if (socket) socket.emit('place_bid', { listingId, ...data });
        },
        [socket, listingId]
    );

    const sendMessage = useCallback(
        (data) => {
            if (socket) socket.emit('send_message', { listingId, ...data });
        },
        [socket, listingId]
    );

    const updateBidStatus = useCallback(
        (bidId, status) => {
            if (socket) socket.emit('update_bid_status', { bidId, status });
        },
        [socket]
    );

    return {
        bids,
        setBids,
        messages,
        setMessages,
        bidStatusUpdate,
        sendBid,
        sendMessage,
        updateBidStatus,
        socket,
    };
}
