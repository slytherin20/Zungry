import { useRouteError } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import SomethingWentWrong from "./SomethingWentWrong";

export default function RouteError() {
  const err = useRouteError();
  console.log(err);
  if (err.status == 404) return <PageNotFound />;
  else return <SomethingWentWrong />;
}
