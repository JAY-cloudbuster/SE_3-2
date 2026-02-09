import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocketContext } from '../../../context/SocketContext';
import { Gavel, TrendingUp, Clock } from 'lucide-react';
import useAuctionTimer from '../../../hooks/useAuctionTimer';
import CurrencyLabel from '../../../components/shared/CurrencyLabel';

export default function BidPanel({ auctionId, initialBid = 500, expiryDate }) {
  const socket = useContext(SocketContext);
  const [highestBid, setHighestBid] = useState(initialBid);
  const [myBid, setMyBid] = useState('');
  const [bidPlaced, setBidPlaced] = useState(false);
  const timeLeft = useAuctionTimer(expiryDate || new Date(Date.now() + 3600000));

  useEffect(() => {
    if (!socket) return;
    socket.on('new_high_bid', (data) => {
      if (data.auctionId === auctionId) {
        setHighestBid(data.amount); // Story 4.3: Real-time bid updates [cite: 148, 150]
      }
    });
    return () => socket.off('new_high_bid');
  }, [socket, auctionId]);

  const placeBid = (e) => {
    e.preventDefault();
    if (!socket || !myBid || Number(myBid) <= highestBid) return;
    
    socket.emit('place_bid', { auctionId, amount: Number(myBid) }); // Story 4.3 [cite: 149]
    setBidPlaced(true);
    setMyBid('');
    setTimeout(() => setBidPlaced(false), 2000);
  };

  return (
    <motion.div
      className="glass-card p-6 border-l-4 border-emerald-500 relative overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16"></div>

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gavel className="text-emerald-600" size={20} />
            <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">Live Auction</span>
          </div>
          {timeLeft && (
            <div className="flex items-center gap-1 text-xs font-black text-emerald-600">
              <Clock size={14} />
              <span>{timeLeft}</span>
            </div>
          )}
        </div>

        {/* Current Bid Display */}
        <motion.div
          className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200"
          key={highestBid}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-bold text-sm">Current High Bid</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="text-emerald-600" size={18} />
              <CurrencyLabel amount={highestBid} className="text-2xl font-black text-emerald-600" />
            </div>
          </div>
        </motion.div>

        {/* Bid Form */}
        <form onSubmit={placeBid} className="flex gap-2">
          <input
            type="number"
            value={myBid}
            onChange={(e) => setMyBid(e.target.value)}
            placeholder={`Enter bid above ₹${highestBid}...`}
            min={highestBid + 1}
            className="flex-1 p-3 rounded-xl border border-emerald-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            required
          />
          <motion.button
            type="submit"
            className="btn-primary py-3 px-6 whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!myBid || Number(myBid) <= highestBid}
          >
            Place Bid
          </motion.button>
        </form>

        {/* Success Feedback */}
        <AnimatePresence>
          {bidPlaced && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-500 text-white p-3 rounded-xl text-sm font-bold text-center"
            >
              ✓ Bid placed successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}