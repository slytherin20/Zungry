import { STAR_ICON } from "../utils/constants";
import { CLOUDANARY_API } from "../utils/constants";
export default function RestaurantOverview({
  name,
  cuisine,
  location,
  avgRating,
  deliveryTime,
  costForTwo,
  restaurantImage,
}) {
  let ratingColor =
    avgRating >= 4
      ? "bg-green-900"
      : avgRating >= 3
      ? "bg-green-600"
      : avgRating >= 2
      ? "bg-yellow-500"
      : "bg-red-600";
  return (
    <div className="w-full h-72 bg-red-700 flex items-center justify-center mb-20">
      <img
        src={CLOUDANARY_API + restaurantImage}
        alt={name + " logo"}
        width="300"
        height="250"
        className="h-52 w-64 sm:h-64 sm:w-80"
      />
      <div className="w-2/5 sm:w-2/3 text-white p-2">
        <h1 className="text-3xl sm:text-4xl">{name}</h1>
        <p>{cuisine}</p>
        <p className="text-lg">{location}</p>
        <div>
          <div className={ratingColor + " h-6 w-12"}>
            <img src={STAR_ICON} alt="rating" className="inline mb-1" />
            <span>| {avgRating > 0 ? avgRating : "--"}</span>
          </div>
          <span>{deliveryTime} mins delivery time | </span>
          <span>{costForTwo}</span>
        </div>
      </div>
    </div>
  );
}
