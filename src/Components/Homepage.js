import AppLogo from "./AppLogo";
import LocationSearch from "./LocationSearch";
import Tagline from "./Tagline";

export default function Homepage() {
  return (
    <main className="flex flex-row h-screen w-full">
      <section className={`w-1/2 p-3 max-[640px]:w-full bg-white`}>
        <AppLogo isHomepage={true} />
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
      <section className="w-1/2 max-[640px]:hidden">
        <img
          src="https://i.imgur.com/5SVdmJf.jpg"
          alt="pizza"
          className="w-full h-full"
        />
      </section>
    </main>
  );
}
