import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/auth-guard';

// Dashboard
const Dashboard = Loadable(lazy(() => import('views/dashboard')));

// Members
const Members = Loadable(lazy(() => import('views/members')));

// Cohorts
const Cohorts = Loadable(lazy(() => import('views/cohorts')));
const CohortDetail = Loadable(lazy(() => import('views/cohorts/CohortDetail')));

// Sessions
const Sessions = Loadable(lazy(() => import('views/sessions')));
const Instructors = Loadable(lazy(() => import('views/sessions/Instructors')));

// Attendance
const Attendance = Loadable(lazy(() => import('views/attendance')));

// Board
const Board = Loadable(lazy(() => import('views/board')));

// Finance
const Finance = Loadable(lazy(() => import('views/finance')));

// Clubs
const Clubs = Loadable(lazy(() => import('views/clubs')));
const ClubDetail = Loadable(lazy(() => import('views/clubs/ClubDetail')));

// Events
const Events = Loadable(lazy(() => import('views/events')));
const EventDetail = Loadable(lazy(() => import('views/events/EventDetail')));

// Organization
const OrgChart = Loadable(lazy(() => import('views/organization/OrgChart')));
const Executives = Loadable(lazy(() => import('views/organization/Executives')));
const Committee = Loadable(lazy(() => import('views/organization/Committee')));
const ExecutiveBoard = Loadable(lazy(() => import('views/organization/ExecutiveBoard')));

// Settings
const Settings = Loadable(lazy(() => import('views/settings')));

const MainRoutes = {
  path: '/',
  // TODO: 백엔드 연동 후 AuthGuard 다시 활성화
  // element: (
  //   <AuthGuard>
  //     <MainLayout />
  //   </AuthGuard>
  // ),
  element: <MainLayout />,
  children: [
    { path: '/', element: <Dashboard /> },
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'members', element: <Members /> },
    { path: 'cohorts', element: <Cohorts /> },
    { path: 'cohorts/:id', element: <CohortDetail /> },
    { path: 'sessions', element: <Sessions /> },
    { path: 'sessions/instructors', element: <Instructors /> },
    { path: 'attendance', element: <Attendance /> },
    { path: 'board', element: <Board /> },
    { path: 'finance', element: <Finance /> },
    { path: 'clubs', element: <Clubs /> },
    { path: 'clubs/:id', element: <ClubDetail /> },
    { path: 'events', element: <Events /> },
    { path: 'events/:id', element: <EventDetail /> },
    { path: 'organization', element: <OrgChart /> },
    { path: 'organization/executives', element: <Executives /> },
    { path: 'organization/committee', element: <Committee /> },
    { path: 'organization/executive-board', element: <ExecutiveBoard /> },
    { path: 'settings', element: <Settings /> }
  ]
};

export default MainRoutes;
