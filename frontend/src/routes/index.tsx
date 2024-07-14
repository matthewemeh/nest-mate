import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { PATHS } from './PathConstants';

const { HOME, PROFILE, HOSTELS, HOSTEL_ROOMS, ROOM, RATINGS } = PATHS;

const Home = lazy(() => import('pages/Home'));
const Profile = lazy(() => import('pages/Profile'));
const Hostels = lazy(() => import('pages/Hostels'));
const Ratings = lazy(() => import('pages/Ratings'));
const HostelRoom = lazy(() => import('pages/HostelRoom'));
const HostelRooms = lazy(() => import('pages/HostelRooms'));

const routes: RouteObject[] = [
  { path: HOME, index: true, element: <Home /> },
  { path: HOSTEL_ROOMS, element: <HostelRooms /> },
  { path: PROFILE, element: <Profile /> },
  { path: HOSTELS, element: <Hostels /> },
  { path: ROOM, element: <HostelRoom /> },
  { path: RATINGS, element: <Ratings /> }
];

export default routes;
