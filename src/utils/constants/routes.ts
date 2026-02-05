export const ROUTES = {
  default: `/`,
  pageNotFound: `/404`,
  signIn: `/signIn`,
  signUp: `/signUp`,
  changePassword: `/change-password`,
  forgotPassword: `/forgot-password`,
  myAccount: `/myAccount`,
  dashboard: `/dashboard`,
  resetPassword: (token: string) => `/reset-password/${token}`,
  setupPassword: (token: string) => `/setup-password/${token}`,
  cleverCallback: `/auth/clever/callback`,
  classroom: {
    list: '/manage-classroom',
    view: (classroomId: string) => `/manage-classroom/view/${classroomId}`,
    assignChapters: (classroomId: string) =>
      `/manage-classroom/view/${classroomId}/assign-chapters`,
    studentProgress: (classroomId: string) =>
      `/manage-classroom/view/${classroomId}/student-progress`,
    importSummary: (fileName: string) => `/manage-classroom/import-summary/${fileName}`,
    googleClassroomCallback: `/manage-classroom/google-classroom/callback`,
    googleClassroomImport: `/manage-classroom/google-classroom/import`,
    addStudent: (classroomId: string) => `/manage-classroom/view/${classroomId}/student/add`,
    editStudent: (classroomId: string, studentId: string) =>
      `/manage-classroom/view/${classroomId}/student/${studentId}/edit`,
    viewStudent: (classroomId: string, studentId: string) =>
      `/manage-classroom/view/${classroomId}/student/${studentId}`
  },
  faq: {
    faqs: `/faqs`,
    viewFaq: (faqId: string) => `/faqs/view-faq/${faqId}`
  },
  contact: {
    list: `/contact-us`,
    add: `/contact-us/add`,
    viewContactUs: (contactUsId: string) => `/contact-us/view/${contactUsId}`
  },
  teacherLearning: {
    list: `/teacher-learning`,
    viewTeacherLearning: ({ teacherLearningId }: { teacherLearningId: string }) =>
      `/teacher-learning/view/${teacherLearningId}`,
    viewTLActivity: ({
      teacherLearningId,
      activityId
    }: {
      teacherLearningId: string;
      activityId: string;
    }) => `/teacher-learning/view/${teacherLearningId}/activity/${activityId}`
  },
  privacyPolicy: `/privacy-policy`,
  termsAndConditions: `/terms-and-conditions`,
  chapter: {
    list: `/chapters`,
    viewChapter: (chapterId: string) => `/chapters/view/${chapterId}`,
    viewLesson: (lessonId: string) => `/chapters/lesson/${lessonId}`,
    viewActivity: (activityId: string) => `/chapters/activity/${activityId}`
  }
};
