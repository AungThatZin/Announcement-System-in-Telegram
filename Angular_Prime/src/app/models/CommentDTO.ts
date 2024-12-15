export interface CommentDto {
    content: string;
    announcementId: number;
    userId: number;
    parentCommentId?: number | null; // Optional parent comment ID for replies
}
