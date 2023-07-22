import RestaurantCard from "./RestaurantCard";
import { useState, useEffect } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import { filterData } from "../utils/helper";
import useRestaurantList from "../utils/useRestaurantList";

export default function RestaurantList({ searchInput }) {
  const [filteredList, setFilteredList] = useState([]);
  let restaurantsList = useRestaurantList();

  useEffect(() => {
    function setFilterData(list) {
      let filterResult = filterData(list, searchInput);
      setFilteredList(filterResult);
    }
    if (restaurantsList.length > 0) setFilterData(restaurantsList);
  }, [searchInput, restaurantsList]);

  if (!restaurantsList) return null; //Avoid rendering component: Early return
  if (!restaurantsList.length)
    return (
      <div className="m-2 sm:m-11">
        <p className="h-6 w-48 bg-gray-400 my-6"></p>
        <div
          className="flex flex-row flex-wrap justify-center"
          data-testid="homepage-shimmer"
        >
          {Array(15)
            .fill(1, 0, 14)
            .map((el, i) => (
              <Shimmer key={i} />
            ))}
        </div>
      </div>
    );
  if (filteredList.length === 0) return <h3>No restaurants found</h3>;
  return (
    <div className="m-2 sm:m-11">
      <h3 className="text-2xl">Restaurants</h3>
      <div
        className="flex flex-row flex-wrap justify-center"
        data-testid="restaurants"
      >
        {filteredList.map((restaurant) => (
          <Link
            to={`/restaurants/` + restaurant.data.id}
            key={restaurant.data.id}
          >
            <RestaurantCard details={restaurant.data} />
          </Link>
        ))}
      </div>
    </div>
  );
}
