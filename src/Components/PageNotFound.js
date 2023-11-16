import { NOTFOUND_ICON } from "../utils/constants";
export default function PageNotFound() {
  return (
    <div className="route-error p-6 w-full h-screen flex justify-center items-center">
      <div className="404-container w-80 flex flex-col items-center">
        <h2 className=" text-4xl text-center">OOPS!</h2>
        <img
          src={NOTFOUND_ICON}
          alt="dead computer red in color"
          className="w-52 h-52"
        />
        <h2 className=" text-2xl">404! Page Not Found </h2>
      </div>
    </div>
  );
}
