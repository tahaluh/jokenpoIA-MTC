import { useRoutes } from "react-router-dom";
import { GamePage } from "./elements";
import { useState } from "react";

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <GamePage />,
    },
  ]);
}
