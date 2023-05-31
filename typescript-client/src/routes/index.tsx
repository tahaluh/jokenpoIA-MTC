import { useRoutes } from "react-router-dom";
import { GamePage } from "./elements";

export default function Router() {
  return useRoutes([
    {
      path: "/:state",
      element: <GamePage />,
    },
  ]);
}
