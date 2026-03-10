import React from 'react';

export default function ChatBubble({ text, senderName, timestamp, isOwn }) {
    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
            <div
                className={`max-w-[75%] rounded-xl px-4 py-2.5 shadow-sm ${
                    isOwn
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}
            >
                {!isOwn && (
                    <p className="text-xs font-semibold text-emerald-700 mb-0.5">
                        {senderName}
                    </p>
                )}
                <p className="text-sm leading-relaxed">{text}</p>
                <p
                    className={`text-[10px] mt-1 ${
                        isOwn ? 'text-emerald-100' : 'text-gray-400'
                    } text-right`}
                >
                    {timestamp
                        ? new Date(timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                          })
                        : ''}
                </p>
            </div>
        </div>
    );
}
