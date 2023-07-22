import { useState, useEffect } from "react";
import { SWIGGY_RESTAURANT_API } from "../../api_endpoint";

export default function useRestaurantMenu(id) {
  const [restaurantDetails, setRestaurantDetails] = useState([]);
  useEffect(() => {
    async function getRestaurantDetails() {
      let res = await fetch(SWIGGY_RESTAURANT_API + id);
      let data = await res.json();
      setRestaurantDetails(data?.data?.cards);
    }
    getRestaurantDetails();
  }, []);

  return restaurantDetails;
}
