import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useUserLocation() {
  const [location, setLocation] = useState({ lat: 0, long: 0 });
  useEffect(() => {
    fetchLocation();

    function fetchLocation() {
      let geoLocationAPI = navigator.geolocation;
      try {
        if (!geoLocationAPI)
          toast.error("Location unsupported for your current browser");
        else {
          geoLocationAPI.getCurrentPosition(
            (position) => {
              let coords = position.coords;
              setLocation({
                lat: coords.latitude,
                long: coords.longitude,
              });
            },
            (err) => {
              if (err.code == 1) {
                let storage = localStorage.getItem("userLocation");
                if (storage) {
                  let coords = JSON.parse(storage);
                  setLocation({
                    lat: coords.lat,
                    long: coords.lng,
                  });
                } else {
                  setLocation({
                    lat: -1,
                    long: -1,
                  });
                }
              } else {
                toast.error("Something went wrong trying to fetch location!");
                throw new Error(
                  "Something went wrong trying to fetch location!"
                );
              }
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
