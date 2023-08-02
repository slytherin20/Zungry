import { useParams } from "react-router-dom";
import RestaurantOverview from "./RestaurantOverview";
import RestaurantDetailsShimmer from "./RestaurantDetailsShimmer";
import useRestaurantMenu from "../utils/useRestaurantMenu.js";
import RestaurantSection from "./RestaurantSection";
import { useState, useEffect } from "react";
import useUserLocation from "../utils/useUserLocation";
export default function RestaurantDetails() {
  const [isVisible, setIsVisible] = useState({});
  const userLocation = useUserLocation();
  const { id } = useParams();
  let restaurantDetails = useRestaurantMenu(id, userLocation);
  useEffect(() => {
    restaurantDetails &&
      restaurantDetails[2] &&
      setMenuOptionsVisibility(
        restaurantDetails[2].groupedCard.cardGroupMap.REGULAR.cards
      );
    function setMenuOptionsVisibility(cards) {
      let temp = {};
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].card.card.title) {
          let title = cards[i].card.card.title;
          temp[title] = false;
        }
      }
      setIsVisible(temp);
    }
  }, [restaurantDetails]);

  let restaurantInfo = restaurantDetails
    ? restaurantDetails[0]?.card?.card?.info
    : null;
  let restaurantMenu = restaurantDetails
    ? restaurantDetails[2]?.groupedCard?.cardGroupMap?.REGULAR?.cards
    : undefined;
  let cuisines = restaurantInfo?.cuisines
    ? restaurantInfo?.cuisines?.join(", ")
    : "";
  let location = restaurantInfo?.locality
    ? restaurantInfo?.locality +
      ", " +
      restaurantInfo?.areaName +
      ", " +
      restaurantInfo?.city
    : "";

  function visibilityHandler(name) {
    setIsVisible({
      ...isVisible,
      [name]: !isVisible[name],
    });
  }
  if (!restaurantDetails) return null;
  else
    return restaurantDetails.length === 0 ? (
      <RestaurantDetailsShimmer />
    ) : (
      <div className="restaurant-menu">
        <RestaurantOverview
          name={restaurantInfo.name}
          cuisines={cuisines}
          location={location}
          avgRating={restaurantInfo.avgRating}
          deliveryTime={restaurantInfo.sla.deliveryTime}
          costForTwo={restaurantInfo.costForTwoMessage}
          restaurantImage={restaurantInfo?.cloudinaryImageId}
        />
        <p className="text-2xl ml-32">Menu</p>
        {restaurantMenu &&
          restaurantMenu.slice(2).map((item) => {
            return (
              !item.card.card.type &&
              !item.card.card.name && (
                <RestaurantSection
                  key={item.card.card.title}
                  items={item?.card?.card}
                  visibleSection={isVisible}
                  toggleMenuSection={visibilityHandler}
                  restaurantInfo={restaurantInfo}
                />
              )
            );
          })}
      </div>
    );
}
