import { useState, useEffect } from "react";

export default function useRestaurantList(userLocation) {
  const [restaurantsList, setRestaurantsList] = useState([]);
  useEffect(() => {
    userLocation.lat && getRestaurants();
  }, [userLocation.lat]);

  async function getRestaurants() {
    try {
      let res = await fetch(
        `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${userLocation.lat}&lng=${userLocation.long}&page_type=DESKTOP_WEB_LISTING`
      );
      let restaurantsData = await res.json();

      restaurantsData =
        restaurantsData?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle
          ?.restaurants || [];
      setRestaurantsList(restaurantsData);
    } catch (e) {
      console.log(e.message);
    }
  }
  return restaurantsList;
}
