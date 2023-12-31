import { useState } from "react";
import { addOrderRating } from "../../utils/firestore_utils";
import { EMPTY_STAR, FILLED_STAR } from "../../utils/constants";
export default function RatingOrder({ user, id, orderRating }) {
  const [rating, setRating] = useState({
    stars: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    },
    value: 0,
  });
  const [isSubmmitted, setIsSubmitted] = useState(false);
  function changeHoveredStars(e) {
    if (orderRating || isSubmmitted) return;
    let id = e.target.id;
    let obj = {};
    [1, 2, 3, 4, 5].map((val) => {
      if (val <= id) {
        obj = {
          ...obj,
          [val]: true,
        };
      } else {
        obj = {
          ...obj,
          [val]: false,
        };
      }
    });
    setRating({
      stars: obj,
      value: rating.value,
    });
  }
  function clearHoveredStars() {
    if (orderRating || isSubmmitted) return;
    setRating({
      stars: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
      },
      value: rating.value,
    });
  }
  function addRating(e) {
    if (orderRating || isSubmmitted) return;
    let count = 0;
    [1, 2, 3, 4, 5].forEach((val) => {
      if (rating.stars[val]) {
        count = count + 1;
      }
    });
    setRating({
      ...rating,
      value: count,
    });
    setIsSubmitted(true);
    addOrderRating(user, id, count);
    e.preventDefault();
  }
  return (
    <div
      className="flex w-28"
      onTouchEnd={addRating}
      onClick={addRating}
      onMouseOut={clearHoveredStars}
    >
      {orderRating || rating.value > 0
        ? [1, 2, 3, 4, 5].map((val) => (
            <img
              key={val}
              src={
                orderRating
                  ? val <= orderRating
                    ? FILLED_STAR
                    : EMPTY_STAR
                  : val <= rating.value
                  ? FILLED_STAR
                  : EMPTY_STAR
              }
              alt="rating star"
              className="h-4 w-4 pr-1"
            />
          ))
        : [1, 2, 3, 4, 5].map((val) => (
            <img
              key={val}
              src={rating.stars[val] ? FILLED_STAR : EMPTY_STAR}
              alt="rating star"
              className="h-4 w-4 pr-1"
              id={val}
              onMouseOver={changeHoveredStars}
              onTouchStart={changeHoveredStars}
            />
          ))}
    </div>
  );
}
