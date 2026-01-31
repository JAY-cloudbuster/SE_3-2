// Mock data for trading and transactions
// This simulates backend data stored in localStorage

export const mockCrops = [
    {
        id: 'crop_1',
        name: 'Organic Wheat',
        farmerId: 'farmer_1',
        farmerName: 'Rajesh Kumar',
        farmerLocation: 'Punjab',
        quantity: 500,
        price: 25,
        quality: 'A',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
        description: 'Premium quality organic wheat, freshly harvested',
        available: true,
        auctionEnabled: true,
        negotiationEnabled: true,
    },
    {
        id: 'crop_2',
        name: 'Basmati Rice',
        farmerId: 'farmer_2',
        farmerName: 'Priya Sharma',
        farmerLocation: 'Haryana',
        quantity: 1000,
        price: 45,
        quality: 'A',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        description: 'Aromatic basmati rice, aged for 1 year',
        available: true,
        auctionEnabled: false,
        negotiationEnabled: true,
    },
    {
        id: 'crop_3',
        name: 'Fresh Tomatoes',
        farmerId: 'farmer_3',
        farmerName: 'Amit Patel',
        farmerLocation: 'Gujarat',
        quantity: 200,
        price: 30,
        quality: 'B',
        image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400',
        description: 'Farm-fresh tomatoes, perfect for cooking',
        available: true,
        auctionEnabled: true,
        negotiationEnabled: true,
    },
];

export const mockNegotiations = [
    {
        id: 'neg_1',
        cropId: 'crop_1',
        buyerId: 'buyer_1',
        buyerName: 'Suresh Reddy',
        farmerId: 'farmer_1',
        farmerName: 'Rajesh Kumar',
        status: 'active', // active, accepted, rejected, countered
        messages: [
            {
                id: 'msg_1',
                sender: 'buyer',
                type: 'text',
                content: 'Hi! Interested in your wheat. Can we discuss the price?',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
            },
            {
                id: 'msg_2',
                sender: 'farmer',
                type: 'text',
                content: 'Sure! What quantity are you looking for?',
                timestamp: new Date(Date.now() - 3500000).toISOString(),
            },
            {
                id: 'msg_3',
                sender: 'buyer',
                type: 'proposal',
                content: 'I need 300kg. Can you do ₹22/kg?',
                proposedPrice: 22,
                proposedQuantity: 300,
                timestamp: new Date(Date.now() - 3400000).toISOString(),
            },
            {
                id: 'msg_4',
                sender: 'farmer',
                type: 'counter',
                content: 'I can do ₹23/kg for 300kg. Final offer.',
                proposedPrice: 23,
                proposedQuantity: 300,
                timestamp: new Date(Date.now() - 3300000).toISOString(),
            },
        ],
        currentOffer: {
            price: 23,
            quantity: 300,
            offeredBy: 'farmer',
        },
    },
    {
        id: 'neg_2',
        cropId: 'crop_2',
        buyerId: 'buyer_1',
        buyerName: 'Suresh Reddy',
        farmerId: 'farmer_2',
        farmerName: 'Priya Sharma',
        status: 'accepted',
        messages: [
            {
                id: 'msg_5',
                sender: 'buyer',
                type: 'proposal',
                content: 'Interested in 500kg at ₹42/kg',
                proposedPrice: 42,
                proposedQuantity: 500,
                timestamp: new Date(Date.now() - 7200000).toISOString(),
            },
            {
                id: 'msg_6',
                sender: 'farmer',
                type: 'accept',
                content: 'Deal accepted! ₹42/kg for 500kg.',
                timestamp: new Date(Date.now() - 7100000).toISOString(),
            },
        ],
        currentOffer: {
            price: 42,
            quantity: 500,
            offeredBy: 'buyer',
        },
    },
];

export const mockAuctions = [
    {
        id: 'auction_1',
        cropId: 'crop_1',
        farmerId: 'farmer_1',
        farmerName: 'Rajesh Kumar',
        cropName: 'Organic Wheat',
        startingPrice: 20,
        currentBid: 24,
        highestBidder: 'buyer_2',
        highestBidderName: 'Anil Verma',
        startTime: new Date(Date.now() - 3600000).toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
        status: 'active', // active, ended, cancelled
        bids: [
            { bidderId: 'buyer_1', bidderName: 'Suresh Reddy', amount: 21, timestamp: new Date(Date.now() - 3000000).toISOString() },
            { bidderId: 'buyer_2', bidderName: 'Anil Verma', amount: 22, timestamp: new Date(Date.now() - 2500000).toISOString() },
            { bidderId: 'buyer_1', bidderName: 'Suresh Reddy', amount: 23, timestamp: new Date(Date.now() - 2000000).toISOString() },
            { bidderId: 'buyer_2', bidderName: 'Anil Verma', amount: 24, timestamp: new Date(Date.now() - 1500000).toISOString() },
        ],
        quantity: 500,
    },
    {
        id: 'auction_2',
        cropId: 'crop_3',
        farmerId: 'farmer_3',
        farmerName: 'Amit Patel',
        cropName: 'Fresh Tomatoes',
        startingPrice: 25,
        currentBid: 28,
        highestBidder: 'buyer_1',
        highestBidderName: 'Suresh Reddy',
        startTime: new Date(Date.now() - 1800000).toISOString(),
        endTime: new Date(Date.now() + 7200000).toISOString(),
        status: 'active',
        bids: [
            { bidderId: 'buyer_1', bidderName: 'Suresh Reddy', amount: 26, timestamp: new Date(Date.now() - 1500000).toISOString() },
            { bidderId: 'buyer_2', bidderName: 'Anil Verma', amount: 27, timestamp: new Date(Date.now() - 1200000).toISOString() },
            { bidderId: 'buyer_1', bidderName: 'Suresh Reddy', amount: 28, timestamp: new Date(Date.now() - 900000).toISOString() },
        ],
        quantity: 200,
    },
];

export const mockOrders = [
    {
        id: 'order_1',
        cropId: 'crop_2',
        cropName: 'Basmati Rice',
        buyerId: 'buyer_1',
        buyerName: 'Suresh Reddy',
        farmerId: 'farmer_2',
        farmerName: 'Priya Sharma',
        quantity: 500,
        pricePerKg: 42,
        totalAmount: 21000,
        status: 'confirmed', // pending, confirmed, shipped, delivered, cancelled
        orderType: 'negotiation', // buynow, auction, negotiation
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        deliveryAddress: {
            street: '123 Market Road',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500001',
        },
        timeline: [
            { status: 'placed', timestamp: new Date(Date.now() - 86400000).toISOString(), note: 'Order placed successfully' },
            { status: 'confirmed', timestamp: new Date(Date.now() - 82800000).toISOString(), note: 'Farmer confirmed the order' },
        ],
    },
    {
        id: 'order_2',
        cropId: 'crop_1',
        cropName: 'Organic Wheat',
        buyerId: 'buyer_1',
        buyerName: 'Suresh Reddy',
        farmerId: 'farmer_1',
        farmerName: 'Rajesh Kumar',
        quantity: 300,
        pricePerKg: 25,
        totalAmount: 7500,
        status: 'shipped',
        orderType: 'buynow',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        deliveryAddress: {
            street: '123 Market Road',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500001',
        },
        timeline: [
            { status: 'placed', timestamp: new Date(Date.now() - 172800000).toISOString(), note: 'Order placed successfully' },
            { status: 'confirmed', timestamp: new Date(Date.now() - 169200000).toISOString(), note: 'Farmer confirmed the order' },
            { status: 'shipped', timestamp: new Date(Date.now() - 86400000).toISOString(), note: 'Order shipped via FastCargo' },
        ],
    },
];

// Helper functions for localStorage management
export const getTradingData = () => {
    const crops = JSON.parse(localStorage.getItem('mockCrops') || JSON.stringify(mockCrops));
    const negotiations = JSON.parse(localStorage.getItem('mockNegotiations') || JSON.stringify(mockNegotiations));
    const auctions = JSON.parse(localStorage.getItem('mockAuctions') || JSON.stringify(mockAuctions));
    const orders = JSON.parse(localStorage.getItem('mockOrders') || JSON.stringify(mockOrders));

    return { crops, negotiations, auctions, orders };
};

export const saveTradingData = (type, data) => {
    localStorage.setItem(`mock${type.charAt(0).toUpperCase() + type.slice(1)}`, JSON.stringify(data));
};

export const initializeTradingData = () => {
    if (!localStorage.getItem('mockCrops')) {
        localStorage.setItem('mockCrops', JSON.stringify(mockCrops));
    }
    if (!localStorage.getItem('mockNegotiations')) {
        localStorage.setItem('mockNegotiations', JSON.stringify(mockNegotiations));
    }
    if (!localStorage.getItem('mockAuctions')) {
        localStorage.setItem('mockAuctions', JSON.stringify(mockAuctions));
    }
    if (!localStorage.getItem('mockOrders')) {
        localStorage.setItem('mockOrders', JSON.stringify(mockOrders));
    }
};
