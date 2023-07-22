import { useState, useEffect } from "react";
import { SWIGGY_API } from "../../api_endpoint";

export default function useRestaurantList() {
  const [restaurantsList, setRestaurantsList] = useState([]);

  useEffect(() => {
    getRestaurants();
  }, []);

  async function getRestaurants() {
    try {
      let res = await fetch(SWIGGY_API);
      let restaurantsData = await res.json();
      restaurantsData =
        restaurantsData?.data?.cards[2]?.data?.data?.cards ||
        restaurantsData?.data?.cards[0]?.data?.data?.cards ||
        [];
      setRestaurantsList(restaurantsData);
    } catch (e) {
      console.log(e.message);
    }
  }
  return restaurantsList;
}
