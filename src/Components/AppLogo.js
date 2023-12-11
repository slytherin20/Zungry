import { Link } from "react-router-dom";
import { FOOD_LOGO } from "../utils/constants";
export default function AppLogo({ isHomepage }) {
  return (
    <Link to="/">
      <div
        className={`flex items-center flex-col-reverse sm:flex-row  ${
          isHomepage ? "mt-24 mb-12" : ""
        } `}
      >
        <p className="text-5xl sm:text-4xl text-red-600" data-testid="app-name">
          Zungry
        </p>
        <img
          src={FOOD_LOGO}
          className="w-14 h-14"
          data-testid="app-logo"
          alt="A man in red clothes with red helmet riding a scooter for food delivery"
        />
      </div>
    </Link>
  );
}
