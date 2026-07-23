export type NotificationType =
  | "LIKE"
  | "COMMENT"
  | "ENROLLMENT"
  | "ANNOUNCEMENT"
  | "CALL"
  | "SYSTEM";

export interface Notification {
  id: string;
  userId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  unreadCount: number;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
