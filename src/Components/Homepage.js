import { FOOD_LOGO } from "../utils/constants";
import LocationSearch from "./LocationSearch";
import Tagline from "./Tagline";

export default function Homepage() {
  return (
    <main className="flex flex-row h-screen">
      <section className="w-1/2 p-3">
        <div className="flex items-center flex-col-reverse sm:flex-row mt-24 mb-6">
          <p
            className="text-5xl sm:text-4xl text-red-600"
            data-testid="app-name"
          >
            Zungry
          </p>
          <img
            src={FOOD_LOGO}
            className="w-14 h-14"
            data-testid="app-logo"
            alt="A man in red clothes with red helmet riding a scooter for food delivery"
          />
        </div>
        <div className="mb-6">
          <Tagline />
          <p className="text-2xl text-gray-700">
            Order food from restaurants near you.
          </p>
        </div>
        <div className="w-full mb-6">
          <LocationSearch />
          <p className="m-5">Or</p>
          <p>Change your browser settings to allow location access.</p>
        </div>
      </section>
      <section className="w-1/2">
        <img
          src="https://i.imgur.com/5SVdmJf.jpg"
          alt="pizza"
          className="w-full h-full"
        />
      </section>
    </main>
  );
}
