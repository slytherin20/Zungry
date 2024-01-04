import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import fetchLocationRecommendations, {
  debounceResult,
  fetchCoords,
} from "../../utils/helper";
import { LOCATION_PIN } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

export default function LocationSearch() {
  const [inp, setInp] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [isVisibile, setIsVisible] = useState(false);
  const navigate = useNavigate();
  function searchLocation() {
    if (!inp) {
      toast.error("Enter Your Delivery Location");
    } else if (!recommendations.length) {
      toast.error("Enter Valid Delivery Location");
    } else {
      toast.error("Select location from suggestions");
    }
  }

  const fetchResults = useCallback(async (val) => {
    let data = await fetchLocationRecommendations(val);
    setIsVisible(true);
    if (data) {
      setRecommendations(data);
    } else setRecommendations([]);
  }, []);

  const recommendSearch = useMemo(
    () => debounceResult(fetchResults),
    [fetchResults]
  );

  function changeInputVal(e) {
    setInp(e.target.value);
    setIsVisible(false);
    recommendSearch(e.target.value);
  }
  async function selectLocation(id) {
    let coords = await fetchCoords(id);
    coords = JSON.stringify(coords);
    localStorage.setItem("userLocation", coords);
    navigate(0);
  }
  function clearRecommendations() {
    setTimeout(() => setIsVisible(false), 200);
  }
  function showRecommendations() {
    if (inp && recommendations.length) {
      setIsVisible(true);
    }
  }
  return (
    <article className="w-full">
      <section className="w-full flex">
        <input
          type="text"
          className="h-10 border border-red-700 w-4/5 relative"
          placeholder="Enter Your Delivery Location"
          onChange={changeInputVal}
          onBlur={clearRecommendations}
          onFocus={showRecommendations}
        />
        <button
          className="bg-red-700 text-white w-28 h-10"
          onClick={searchLocation}
        >
          Search
        </button>
      </section>

      {isVisibile && inp && (
        <ul className="list-none p-1 shadow-lg w-2/5 absolute z-10 bg-white max-[640px]:w-4/5">
          {recommendations.length > 0 ? (
            recommendations.map((obj) => (
              <li
                key={obj.place_id}
                onClick={() => selectLocation(obj.place_id)}
                className="flex cursor-pointer p-2"
              >
                <img
                  src={LOCATION_PIN}
                  alt="location sign"
                  className="w-6 h-6"
                />
                {obj.description}
              </li>
            ))
          ) : (
            <li className="p-2 text-center">No Results Found</li>
          )}
        </ul>
      )}
    </article>
  );
}
