import { useRoutes } from "react-router-dom";
import { GamePage } from "./elements";
import PlaygroundPage from "../pages/playgroundPage";

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <GamePage />,
    },
    {
      path: "/playground",
      element: <PlaygroundPage />,
    },
  ]);
}
