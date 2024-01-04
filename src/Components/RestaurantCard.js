import { CLOUDANARY_API, STAR_ICON } from "../utils/constants";

export default function RestaurantCard({ details }) {
  const { name, cuisines, totalRatingsString, cloudinaryImageId, avgRating } =
    details;
  let ratingColor =
    avgRating >= 4
      ? "bg-green-900"
      : avgRating >= 3
      ? "bg-green-600"
      : avgRating >= 2
      ? "bg-yellow-500"
      : "bg-red-600";
  return (
    <div className="w-52 h-80 border border-gray-200 m-2 p-2 rounded-md">
      <img src={CLOUDANARY_API + cloudinaryImageId} width="200" height="200" />
      <h3 className="text-lg font-bold text-gray-900">{name}</h3>
      <p className="text-gray-800">{cuisines?.slice(0, 5).join(", ")} </p>
      <div>
        <div className={ratingColor + " h-5 w-11 text-white text-sm"}>
          <img src={STAR_ICON} alt="rating" className="inline mb-1" />
          <span>| {avgRating}</span>
        </div>
        <p className="text-gray-500">{totalRatingsString}</p>
      </div>
    </div>
  );
}
