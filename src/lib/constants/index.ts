/** Cookie and localStorage key names */
export const COOKIE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  ACCESS_TOKEN_JS: "accessToken_js",
  REFRESH_TOKEN: "refreshToken",
} as const

/** Application route paths */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_USER: "/verify-user",
  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  COMMUNITY: "/community",
  LIVE_CALL: "/live-call",
  HISTORY: "/history",
  FEEDBACK: "/feedback",
  PROFILE: "/profile",
  PAYMENT_SUCCESS: "/payment/success",
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    COURSES: "/admin/course",
    USERS: "/admin/users",
    ENROLLMENT: "/admin/enrollment",
    MODERATION: "/admin/moderation",
    ANNOUNCEMENTS: "/admin/announcements",
    SUPPORT: "/admin/support",
  },
} as const

/** Course related constants */
export const COURSE_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const
export const COURSE_TYPES = ["FREE", "PREMIUM"] as const

/** localStorage key prefix for tracking lesson progress */
export const LESSON_PROGRESS_KEY_PREFIX = "talknative_completed_"
