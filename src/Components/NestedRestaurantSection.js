import { useState } from "react";
import DishCard from "./DishCard";

export default function NestedRestaurantSection({
  dishes,
  restaurantInfo,
  user,
}) {
  const [isVisibleCategory, setIsVisibleCategory] = useState(dishes[0].title);

  function selectCategory(e) {
    setIsVisibleCategory(e.target.innerText);
  }

  return (
    <div className="flex flex-row w-full justify-between">
      <div className="flex flex-col justify-start items-start ">
        {dishes.map((cat) => (
          <span
            key={cat.title}
            onClick={selectCategory}
            className={
              isVisibleCategory === cat.title
                ? " m-2 font-bold cursor-pointer"
                : "m-2 cursor-pointer"
            }
          >
            {cat.title}
          </span>
        ))}
      </div>
      <div className="w-3/5">
        {dishes
          .filter((cat) => cat.title === isVisibleCategory)?.[0]
          .itemCards.map((dish) => (
            <DishCard
              dish={dish.card.info}
              key={dish.card.info.id}
              restaurantInfo={restaurantInfo}
              user={user}
            />
          ))}
      </div>
    </div>
  );
}
