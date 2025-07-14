import React, { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';






const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const UtilsTypography = Loadable(lazy(() => import('views/Utils/Typography')));
const SamplePage = Loadable(lazy(() => import('views/SamplePage/index1')));
const CoursesPage=Loadable(lazy(()=>import('views/Courses/coursesPage')));
const NewsPage=Loadable(lazy(()=>import('views/News/newsPage')));
const UsersPage=Loadable(lazy(()=>import('views/Users/usersPage')));
const RevenuPage=Loadable(lazy(()=>import('views/Revenu/revenuPage')));
const GroupsPage=Loadable(lazy(()=>import('views/Groups/groupsPage')));
const TrainersPage=Loadable(lazy(()=>import('views/Trainers/trainersPage')))
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
    {path:'/News/newsPage', element:<NewsPage/>},
    {path:'/Users/usersPage',element:<UsersPage/>},
    {path:'/Revenu/revenuPage', element:<RevenuPage/>},
    {path:'/Groups/groupsPage', element:<GroupsPage/>},
    {path:'/Trainers/trainersPage', element:<TrainersPage/>}
  ]
};

export default MainRoutes;
