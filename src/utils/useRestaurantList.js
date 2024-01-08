import { useState, useEffect } from "react";

export default function useRestaurantList(userLocation) {
  const [restaurantsList, setRestaurantsList] = useState([]);

  useEffect(() => {
    userLocation.lat && getRestaurants();
  }, [userLocation.lat]);

  async function getRestaurants() {
    let uri =
      process.env.REACT_APP_ENV == "dev"
        ? "http://localhost:3000"
        : "https://zungryproxy.onrender.com";

    try {
      let res = await fetch(
        `${uri}/api/restaurants?lat=${userLocation.lat}&long=${userLocation.long}`
      );
      let restaurantsData = await res.json();

      restaurantsData =
        restaurantsData?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle
          ?.restaurants ||
        restaurantsData?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle
          ?.restaurants ||
        [];
      setRestaurantsList(restaurantsData);
    } catch (e) {
      console.log(e.message);
    }
  }
  return restaurantsList;
}
