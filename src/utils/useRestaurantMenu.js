import { useState, useEffect } from "react";

export default function useRestaurantMenu(id, userLocation) {
  const [restaurantDetails, setRestaurantDetails] = useState([]);
  let uri =
    process.env.REACT_APP_ENV == "dev"
      ? "http://localhost:3000"
      : "https://zungryproxy.onrender.com";
  useEffect(() => {
    userLocation.lat && getRestaurantDetails();
  }, [userLocation.lat]);
  async function getRestaurantDetails() {
    try {
      let res = await fetch(
        `${uri}/api/menu?long=${userLocation.long}&lat=${userLocation.lat}&id=${id}`
      );
      let data = await res.json();
      setRestaurantDetails(data?.data?.cards);
    } catch (err) {
      console.log(err);
    }
  }

  return restaurantDetails;
}
