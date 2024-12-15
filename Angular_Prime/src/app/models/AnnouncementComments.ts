import { Announcement } from "./Announcement";
import { User } from "./UserModel";

export interface AnnouncementComments {
  id: number;
  content: string;
  edited: boolean;
  createdAt: string;
  updatedAt: string;
  announcement: Announcement;
  user: User;
  parentCommentId?: number; // Optional parent comment ID for replies
  replies?: AnnouncementComments[]; // List of replies
}
