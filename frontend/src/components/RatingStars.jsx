import React from 'react';

export default function RatingStars({ ratingAverage = 0, ratingCount = 0 }) {
  const roundedRating = Math.round(ratingAverage);
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`text-lg ${star <= roundedRating ? 'text-yellow-400' : 'text-slate-300'}`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-sm font-medium text-slate-700">
        {Number(ratingAverage).toFixed(1)} <span className="text-slate-500 font-normal">({ratingCount} ratings)</span>
      </span>
    </div>
  );
}