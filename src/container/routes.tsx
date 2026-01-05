import { lazy } from 'react';

import PublicGuard from 'guard/PublicGuard';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ROUTES } from 'utils/constants/routes';

import { authStore } from 'services/store/auth';

import AuthGuard from '../components/common/AuthGuard';

const Layout = lazy(() => import('../components/layout'));
const PageNotFound = lazy(() => import('../modules/PageNotFound'));
const SignIn = lazy(() => import('../modules/Auth/Modules/SignIn'));
const SignUp = lazy(() => import('../modules/Auth/Modules/SignUp'));
const ForgotPassword = lazy(() => import('../modules/Auth/Modules/ForgotPassword'));
const ResetPassword = lazy(() => import('../modules/Auth/Modules/ResetPassword'));
const SetupPassword = lazy(() => import('../modules/Auth/Modules/SetupPassword'));
const ChangePassword = lazy(() => import('../modules/Auth/Modules/ChangePassword'));
const CleverCallback = lazy(() => import('../modules/Auth/Modules/CleverCallback'));
const Dashboard = lazy(() => import('../modules/Dashboard'));

const MyAccount = lazy(() => import('../modules/MyAccount'));

const Routing = () => {
  const { isLoggedIn } = authStore();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to={ROUTES.dashboard} replace />
          ) : (
            <Navigate to={ROUTES.signIn} replace />
          )
        }
      />

      <Route path={ROUTES.default} element={<PublicGuard />}>
        <Route path={ROUTES.signIn} element={<SignIn />} />
        <Route path={ROUTES.signUp} element={<SignUp />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPassword />} />
        <Route path={ROUTES.resetPassword(':token')} element={<ResetPassword />} />
        <Route path={ROUTES.setupPassword(':token')} element={<SetupPassword />} />
        <Route path={ROUTES.cleverCallback} element={<CleverCallback />} />
        {/* Redirect default "/" to /signin */}
        <Route index element={<Navigate to={ROUTES.signIn} replace />} />
      </Route>

      <Route
        path={ROUTES.default}
        element={
          <AuthGuard>
            <Layout />
          </AuthGuard>
        }
      >
        <Route path={ROUTES.pageNotFound} element={<PageNotFound />} />
        <Route path={ROUTES.changePassword} element={<ChangePassword />} />
        <Route path={ROUTES.myAccount} element={<MyAccount />} />
        <Route path={ROUTES.dashboard} element={<Dashboard />} />
        <Route path={ROUTES.default} element={<Navigate replace to={ROUTES.dashboard} />} />
        <Route path="*" element={<Navigate replace to={ROUTES.pageNotFound} />} />
      </Route>
      <Route path="*" element={<Navigate replace to={ROUTES.signIn} />} />
    </Routes>
  );
};

export default Routing;
