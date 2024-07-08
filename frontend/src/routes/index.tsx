import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { PATHS } from './PathConstants';

const { HOME, PROFILE, HOSTELS, HOSTEL_ROOMS } = PATHS;

const Home = lazy(() => import('pages/Home'));
const Profile = lazy(() => import('pages/Profile'));
const Hostels = lazy(() => import('pages/Hostels'));
const HostelRooms = lazy(() => import('pages/HostelRooms'));

const routes: RouteObject[] = [
  { path: HOME, index: true, element: <Home /> },
  { path: HOSTEL_ROOMS, element: <HostelRooms /> },
  { path: PROFILE, element: <Profile /> },
  { path: HOSTELS, element: <Hostels /> }
];

export default routes;
