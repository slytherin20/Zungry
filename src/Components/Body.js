import { useOutletContext } from "react-router-dom";
import RestaurantList from "./RestaurantList";
export default function Body() {
  const [searchInput] = useOutletContext();

  return <RestaurantList searchInput={searchInput} />;
}
