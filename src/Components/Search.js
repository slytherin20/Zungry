import {
  searchOnEnter,
  fetchRecommendation,
  debounceResult,
} from "../utils/helper";
import { SEARCH_ICON } from "../utils/constants";
import { useState, useRef, useContext, useCallback, useMemo } from "react";
import { UserLocationContext } from "../utils/UserLocationContext";
import { useNavigate } from "react-router-dom";

export default function Search({ searchResults }) {
  const userLocation = useContext(UserLocationContext);
  const [search, setSearch] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  function changeSearchVal(e) {
    setSearch(e.target.value);
    setShowRecommendations(false);
    recommendSearch(e.target.value);
  }

  const fetchResult = useCallback(
    async (val) => {
      let res = await fetchRecommendation(userLocation, val);
      setShowRecommendations(true);
      if (res) {
        setRecommendations(res);
      } else {
        setRecommendations([]);
      }
    },
    [userLocation]
  );

  const recommendSearch = useMemo(
    () => debounceResult(fetchResult),
    [fetchResult]
  );
  function clearRecommendations() {
    setTimeout(() => setShowRecommendations(false), 300);
  }
  function showRecommendationsDiv() {
    if (search && recommendations.length > 0) setShowRecommendations(true);
  }
  function goToSearchResult(id) {
    navigate("/restaurants/" + id);
  }
  return (
    <div className="h-10 shadow-md rounded-lg  w-full sm:w-96 relative">
      <div className="flex flex-row items-center">
        <input
          type="search"
          className="h-full rounded-lg w-11/12 p-1 outline-none "
          placeholder="Search for a restaurant"
          onKeyDown={(e) => searchOnEnter(e.key, searchRef)}
          onChange={changeSearchVal}
          data-testid="search-bar"
          name="searchbar"
          id="searchbar"
          autoComplete="false"
          value={search}
          onBlur={clearRecommendations}
          onFocus={showRecommendationsDiv}
        />
        <img
          src={SEARCH_ICON}
          alt="search"
          onClick={() => searchResults(search)}
          width="24"
          height="24"
          className="w-7 h-7"
          data-testid="search-btn"
          ref={searchRef}
        />
      </div>
      {showRecommendations && search && (
        <ul className="recommendation absolute bg-white shadow-md top-6 w-full pt-2 pb-2 border-t-2 border-t-gray-200">
          {recommendations && recommendations.length > 0 ? (
            recommendations.map((restaurant) => (
              <li
                className="p-2 hover:bg-slate-200 cursor-pointer restaurant-link"
                key={restaurant.id}
                onClick={() => goToSearchResult(restaurant.id)}
              >
                {restaurant.name}
              </li>
            ))
          ) : (
            <li className="p-2 text-center">No Results Found</li>
          )}
        </ul>
      )}
    </div>
  );
}
