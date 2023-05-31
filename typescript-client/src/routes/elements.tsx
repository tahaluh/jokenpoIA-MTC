import { Suspense, lazy, ElementType } from "react";
// components

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) =>
  (
    <Suspense fallback={<></>}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

export const GamePage = Loadable(lazy(() => import("../pages/gamePage")));

// export const Page404 = Loadable(lazy(() => import("../pages/Page404")));
