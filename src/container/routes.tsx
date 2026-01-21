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

// classroom
const ClassroomPage = lazy(() => import('../modules/Classroom'));

// chapters
const ViewChaptersList = lazy(() => import('../modules/ManageChapter'));
const ViewChapterPage = lazy(() => import('../modules/ManageChapter/Modules/view'));
const ViewLessonPage = lazy(() => import('../modules/ManageChapter/Modules/Lesson'));
const ViewActivityPage = lazy(() => import('../modules/ManageChapter/Modules/Activity'));
const Faq = lazy(() => import('../modules/Faq'));
const ViewFaq = lazy(() => import('../modules/Faq/Modules/view/index'));

const Contact = lazy(() => import('../modules/Contact'));
const AddContact = lazy(() => import('../modules/Contact/Modules/add'));
const ViewContactUs = lazy(() => import('../modules/Contact/Modules/view'));

const TermsAndCondition = lazy(() => import('../modules/CMSManagement/Module/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('../modules/CMSManagement/Module/PrivacyPolicy'));

// teacher learning
const TeacherLearning = lazy(() => import('../modules/TeacherLearning'));
const ViewTeacherLearning = lazy(() => import('../modules/TeacherLearning/view'));
const ViewTLActivity = lazy(() => import('../modules/TeacherLearning/view/Activity'));

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

        {/* classroom */}
        <Route path={ROUTES.classroom.list} element={<ClassroomPage />} />

        {/* chapters */}
        <Route path={ROUTES.chapter.list} element={<ViewChaptersList />} />
        <Route path={ROUTES.chapter.viewChapter(':chapterId')} element={<ViewChapterPage />} />
        <Route path={ROUTES.chapter.viewLesson(':lessonId')} element={<ViewLessonPage />} />
        <Route path={ROUTES.chapter.viewActivity(':activityId')} element={<ViewActivityPage />} />

        {/* Faq module */}
        <Route path={ROUTES.faq.faqs} element={<Faq />} />
        <Route path={ROUTES.faq.viewFaq(':faqId')} element={<ViewFaq />} />

        {/* Teacher Learning */}
        <Route path={ROUTES.teacherLearning.list} element={<TeacherLearning />} />

        <Route
          path={ROUTES.teacherLearning.viewTeacherLearning({
            teacherLearningId: ':teacherLearningId'
          })}
          element={<ViewTeacherLearning />}
        />

        <Route
          path={ROUTES.teacherLearning.viewTLActivity({
            teacherLearningId: ':teacherLearningId',
            activityId: ':activityId'
          })}
          element={<ViewTLActivity />}
        />

        {/* Contact module */}
        <Route path={ROUTES.contact.list} element={<Contact />} />
        <Route path={ROUTES.contact.add} element={<AddContact />} />
        <Route path={ROUTES.contact.viewContactUs(':contactUsId')} element={<ViewContactUs />} />

        <Route path={ROUTES.termsAndConditions} element={<TermsAndCondition />} />
        <Route path={ROUTES.privacyPolicy} element={<PrivacyPolicy />} />
        <Route path={ROUTES.default} element={<Navigate replace to={ROUTES.dashboard} />} />
        <Route path="*" element={<Navigate replace to={ROUTES.pageNotFound} />} />
      </Route>
      <Route path="*" element={<Navigate replace to={ROUTES.signIn} />} />
    </Routes>
  );
};

export default Routing;
