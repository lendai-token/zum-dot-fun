import React, { FC } from "react";
import { useRoutes } from "react-router-dom";
import DefaultLayout from "../layouts/default";

// const IndexPage = React.lazy(() => import("../pages/home"));
const AppPage = React.lazy(() => import("../pages/app"));
const ComingSoonPage = React.lazy(() => import("../pages/coming_soon"));

const AppRoutes: FC<any> = (props) => {
  const routes = [
    {
      path: "/",
      element: <DefaultLayout {...props} />,
      children: [
        {
          path: "",
          element: <AppPage {...props} />,
        },
      ],
    },
    {
      path: "/coming-soon",
      element: <DefaultLayout {...props} />,
      children: [
        {
          path: "",
          element: <ComingSoonPage {...props} />,
        },
      ],
    },
    {
      path: "/code",
      element: <DefaultLayout {...props} />,
      children: [
        {
          path: "",
          element: <AppPage {...props} />,
        },
      ],
    },
    {
      path: "/invalid-code",
      element: <DefaultLayout {...props} />,
      children: [
        {
          path: "",
          element: <AppPage {...props} />,
        },
      ],
    },
    {
      path: "/code/:validReferralCode",
      element: <DefaultLayout {...props} />,
      children: [
        {
          path: "",
          element: <AppPage {...props} />,
        },
      ],
    },
    {
      path: "/:username",
      element: <DefaultLayout {...props} />,
      children: [
        {
          path: "",
          element: <AppPage {...props} />,
        },
      ],
    },
  ];
  return useRoutes(routes);
};
export default AppRoutes;
