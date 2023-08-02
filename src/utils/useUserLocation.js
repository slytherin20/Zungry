import { useEffect, useState } from "react";

export default function useUserLocation() {
  const [location, setLocation] = useState({ lat: 0, long: 0 });
  useEffect(() => {
    fetchLocation();
    function fetchLocation() {
      let geoLocationAPI = navigator.geolocation;
      try {
        if (!geoLocationAPI)
          throw new Error("Location unsupported for your current browser");
        else {
          geoLocationAPI.getCurrentPosition(
            (position) => {
              let coords = position.coords;
              setLocation({
                lat: coords.latitude,
                long: coords.longitude,
              });
            },
            () => {
              throw new Error("Something went wrong trying to fetch location!");
            },
            {
              maximumAge: 0,
              enableHighAccuracy: true,
            }
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  return location;
}
