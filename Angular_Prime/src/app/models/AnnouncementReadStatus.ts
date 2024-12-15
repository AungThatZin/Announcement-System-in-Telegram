import { Announcement } from "./Announcement";
import { User } from "./UserModel";

export interface AnnouncementReadStatus {
    id: number;
    announcement: Announcement;
    staff: User;
    messageId: number;
    readAt: string;
    isRead: boolean;
  }