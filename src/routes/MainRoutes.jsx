import React, { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';


const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const UtilsTypography = Loadable(lazy(() => import('views/Utils/Typography')));
const SamplePage = Loadable(lazy(() => import('views/SamplePage/index1')));
const CoursesPage=Loadable(lazy(()=>import('views/Courses/coursesPage')));
const NewsPage=Loadable(lazy(()=>import('views/News/newsPage')))
// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/dashboard/default',
      element: <DashboardDefault />
    },
    { path: '/utils/util-typography', element: <UtilsTypography /> },
    { path: '/sample-page', element: <SamplePage /> },
    {path:'/Courses/coursesPage', element:<CoursesPage/>},
    {path:'/News/newsPage', element:<NewsPage/>}
  ]
};

export default MainRoutes;
