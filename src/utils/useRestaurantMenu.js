import { useState, useEffect } from "react";

export default function useRestaurantMenu(id, userLocation) {
  const [restaurantDetails, setRestaurantDetails] = useState([]);

  useEffect(() => {
    userLocation.lat && getRestaurantDetails();
  }, [userLocation.lat]);
  async function getRestaurantDetails() {
    try {
      let res = await fetch(
        `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${userLocation.lat}&lng=${userLocation.long}&restaurantId=${id}&catalog_qa=undefined&submitAction=ENTER`
      );
      let data = await res.json();
      setRestaurantDetails(data?.data?.cards);
    } catch (err) {
      console.log(err);
    }
  }

  return restaurantDetails;
}
