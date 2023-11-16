import { useRouteError } from "react-router-dom";
import { ROUTE_ERROR } from "../utils/constants";
import PageNotFound from "./PageNotFound";

export default function RouteError() {
  const err = useRouteError();
  console.log(err);
  if (err.status == 404) return <PageNotFound />;
  else
    return (
      <div className="route-error p-6 w-full h-screen flex justify-center items-center">
        <div className="err-container  w-80 flex flex-col items-center">
          <img src={ROUTE_ERROR} alt="error" className="w-52 h-52" />
          <div>
            <h2 className="font-bold">
              OH SNAP! Something is wrong. Cannot proceed request.
            </h2>
            <h3>Kindly wait while we resolve the issue.</h3>
          </div>
        </div>
      </div>
    );
}
