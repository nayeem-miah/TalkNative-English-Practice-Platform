/* eslint-disable @typescript-eslint/no-explicit-any */
import { Enrollment } from "./course";
import { User, UserRole } from "./user";


export interface MetaParams {
  page?: number;
  limit?: number;
  total?: number;
  totalPage?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  result?: any;
  statusCode?: number;
}

export interface ApiPaginatedResponse<T = any> {
  success: boolean;
  message?: string;
  data: T[];
  result?: any;
  meta?: MetaParams;
  stats?: any;
  statusCode?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}


export interface RegisterInput {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  nativeLanguage?: string;
  learningLanguage?: string;
}

export interface VerifyEmailInput {
  email: string;
  otp?: string;
  code?: string;
}

export interface ResendOtpInput {
  email: string;
}

export interface LoginInput {
  email: string;
  password?: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken?: string;
  user?: User;
  result?: {
    accessToken?: string;
    refreshToken?: string;
    user?: User;
  };
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  phone?: string;
  Phone?: string;
  nativeLanguage?: string;
  learningLanguage?: string;
  profilePicture?: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword?: string;
  password?: string;
}

export interface GetUsersParams extends PaginationParams {
  status?: string;
}

export interface UpdateUserRoleInput {
  userId: string;
  role: "ADMIN" | "USER";
}

export interface UpdateUserStatusInput {
  userId: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}


export interface GetCoursesParams extends PaginationParams {
  level?: string;
}

export interface CreateCourseReviewInput {
  courseId: string;
  rating: number;
  comment: string;
}

export interface CourseReview {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  courseId: string;
  user?: Partial<User>;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateCourseInput {
  id: string;
  formData: FormData;
}


export interface CreateLessonInput {
  courseId: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: number;
  order: number;
}

export interface UpdateLessonInput {
  id: string;
  title?: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order?: number;
}


export interface GetPostsParams extends PaginationParams {
  category?: string;
  authorId?: string;
}

export interface UpdatePostInput {
  id: string;
  formData: FormData;
}

export interface AddCommentInput {
  postId: string;
  content: string;
}

export interface UpdateCommentInput {
  id: string;
  content: string;
}


export interface ChatMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderRole?: UserRole;
  text?: string;
  content?: string;
  createdAt?: string;
  sender?: Partial<User>;
}

export interface ChatTicket {
  id: string;
  userId: string;
  user?: Partial<User>;
  status: "OPEN" | "RESOLVED" | "CLOSED";
  lastMessage?: string;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
  messages?: ChatMessage[];
}


export interface Announcement {
  id: string;
  title: string;
  content: string;
  category?: string;
  isUrgent?: boolean;
  status?: string;
  targetRole?: string;
  authorId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  category?: string;
  isUrgent?: boolean;
  status?: string;
  targetRole?: string;
}

export interface UpdateAnnouncementInput {
  id: string;
  data: Partial<CreateAnnouncementInput>;
}


export interface CreateCallReportInput {
  reportedId: string;
  reporterId?: string;
  callId?: string;
  reason: string;
  description?: string;
}

export interface CreateCallReviewInput {
  callId?: string;
  targetUserId?: string;
  revieweeId?: string;
  rating: number;
  comment?: string;
  notes?: string;
}


export interface EnrollFreeInput {
  courseId: string;
}

export interface CheckoutSessionInput {
  courseId: string;
}

export interface GetAllEnrollmentsParams extends PaginationParams {
  paymentStatus?: string;
}

export interface AdminDashboardOverview {
  totalUsers?: number;
  totalCourses?: number;
  totalEnrollments?: number;
  totalRevenue?: number;
  recentEnrollments?: Enrollment[];
  activeCourses?: any[];
  stats?: {
    totalUsers?: number;
    totalCourses?: number;
    totalEnrollments?: number;
    totalRevenue?: number;
  };
}
