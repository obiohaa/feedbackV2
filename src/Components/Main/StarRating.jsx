import React, { useState } from "react";

const StarRating = ({ label, rating, setRating }) => {
  const [hover, setHover] = useState(0);

  // const emoji = rating ? emojiScale[rating - 1].icon : "🙂";

  return (
    <div className="rating-group">
      <div className="rating-header">
        <span className="label">{label}</span>

        {/* Emoji Reaction */}
        {/* <span className="emoji">{emoji}</span> */}
      </div>

      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= (hover || rating) ? "star active" : "star"}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}>
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

export default StarRating;
