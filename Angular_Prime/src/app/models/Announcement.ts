import { AnnouncementReadStatus } from "./AnnouncementReadStatus";
import { User } from "./UserModel";

export interface Announcement {
    readProgress: any;
    id: number;
    title: string;
    content: string;
    createdAt: string;
    document: string | null;
    documentName: string;
    sent: number;
    scheduledDate: string | null;
    cloudUrl: string;
    fileExtension: string;
    publicId: string;
    resourceType: string;
    groups: any[];
    staffMembers: any[];
    user: User;
    userName: string;
    readStatuses: AnnouncementReadStatus[]; // Add this line
  }