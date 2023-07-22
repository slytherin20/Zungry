import { useRouteError } from "react-router-dom";

export default function RouteError() {
  const err = useRouteError();
  return (
    <div className="route-error">
      <h2>OOPS!</h2>
      <p>Look like there is some issue.</p>
      <h1>
        {err.status}: {err.statusText}
      </h1>
    </div>
  );
}
