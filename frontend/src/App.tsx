import { lazy, useEffect, useMemo } from 'react';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';

import routes from 'routes';
import Page404 from 'pages/Page404';
import useAuth from 'hooks/useAuth';
import authRoutes from 'routes/auth';
import NavLayout from 'layouts/NavLayout';
import AuthLayout from 'layouts/AuthLayout';
import { PATHS } from 'routes/PathConstants';
import { addClass, removeClass } from 'utils';
import { updateUserData } from 'services/userData/userDataSlice';
import { useAppDispatch, useAppSelector } from 'hooks/useRootStorage';

const Entries = lazy(() => import('pages/admin/Entries'));
const AddHostel = lazy(() => import('pages/admin/AddHostel'));
const Dashboard = lazy(() => import('pages/admin/Dashboard'));
const EditHostel = lazy(() => import('pages/admin/EditHostel'));
const ManageUsers = lazy(() => import('pages/admin/ManageUsers'));
const Reservations = lazy(() => import('pages/admin/Reservations'));
const AddHostelRoom = lazy(() => import('pages/admin/AddHostelRoom'));
const EditHostelRoom = lazy(() => import('pages/admin/EditHostelRoom'));

const App = () => {
  const {
    ENTRIES,
    DASHBOARD,
    ADD_HOSTEL,
    EDIT_HOSTEL,
    RESERVATIONS,
    MANAGE_USERS,
    ADD_HOSTEL_ROOM,
    EDIT_HOSTEL_ROOM
  } = PATHS;

  const dispatch = useAppDispatch();
  const isAuthorized: boolean = useAuth();
  const { prefersDarkMode } = useAppSelector(state => state.userData);
  const newRoutes = useMemo<RouteObject[]>(() => {
    if (isAuthorized) {
      return [
        ...routes,
        { path: ENTRIES, element: <Entries /> },
        { path: DASHBOARD, element: <Dashboard /> },
        { path: ADD_HOSTEL, element: <AddHostel /> },
        { path: EDIT_HOSTEL, element: <EditHostel /> },
        { path: MANAGE_USERS, element: <ManageUsers /> },
        { path: RESERVATIONS, element: <Reservations /> },
        { path: ADD_HOSTEL_ROOM, element: <AddHostelRoom /> },
        { path: EDIT_HOSTEL_ROOM, element: <EditHostelRoom /> }
      ];
    }
    return routes;
  }, [isAuthorized, routes]);

  useEffect(() => {
    const windowMatchMedia: MediaQueryList = window.matchMedia?.('(prefers-color-scheme: dark)');

    windowMatchMedia.addEventListener('change', event => {
      dispatch(updateUserData({ prefersDarkMode: event.matches }));
    });

    return () => {
      windowMatchMedia.removeEventListener('change', event => {
        dispatch(updateUserData({ prefersDarkMode: event.matches }));
      });
    };
  }, []);

  useEffect(() => {
    const body = document.querySelector('body');
    if (prefersDarkMode) addClass(body, 'dark:bg-lightning-yellow-950', 'dark:text-zircon');
    else removeClass(body, 'dark:bg-lightning-yellow-950', 'dark:text-zircon');
  }, [prefersDarkMode]);

  const router = createBrowserRouter([
    {
      element: <NavLayout />,
      errorElement: <Page404 />,
      children: newRoutes
    },
    {
      element: <AuthLayout />,
      errorElement: <Page404 />,
      children: authRoutes
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
