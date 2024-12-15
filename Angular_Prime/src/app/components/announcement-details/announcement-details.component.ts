import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnnouncementService } from '../../services/announcement.service';
import { Announcement } from '../../models/Announcement';
import { AnnouncementReadStatus } from '../../models/AnnouncementReadStatus';
import { AnnouncementComments } from '../../models/AnnouncementComments';
import { CommentDto } from '../../models/CommentDTO';
declare var videojs: any;

@Component({
  selector: 'app-announcement-details',
  templateUrl: './announcement-details.component.html',
  styleUrls: ['./announcement-details.component.css'],
})
export class AnnouncementDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  announcement: Announcement | undefined;
  readStatuses: AnnouncementReadStatus[] = [];
  comments: AnnouncementComments[] = [];
  newComment: string = '';
  replyContent: string = '';
  replyToCommentId: number | null = null;
  player: any;
  editContent: string = '';
  editingCommentId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private announcementService: AnnouncementService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.announcementService.getAnnouncementById(id).subscribe(
        (data: any) => {
          this.announcement = data.announcement;
          this.readStatuses = data.readStatuses;
          if (this.announcement) {
            this.loadComments(this.announcement.id);
          }
        },
        (error) => {
          console.error('Error fetching announcement details', error);
        }
      );
    }
  }
  


  ngAfterViewInit(): void {
    console.log('ngAfterViewInit: Component initialized'); // Debugging log
    this.initializeVideoPlayer();
  }

  ngOnDestroy(): void {
    if (this.player) {
      console.log('Disposing of the Video.js player'); // Debugging log
      this.player.dispose(); // Dispose of the player when the component is destroyed
    }
  }

  initializeVideoPlayer(): void {
    if (this.isVideo(this.announcement?.fileExtension || '') && this.announcement) {
      console.log('Initializing Video.js player'); // Debugging log
      this.player = videojs('announcement-video', {
        playbackRates: [0.5, 1, 1.5, 2],
        fluid: true,
        controls: true,
        plugins: {
          overlay: {
            overlays: [
              {
                content: 'Now Playing',
                start: 'loadstart',
                end: 'play',
                align: 'bottom-left'
              },
              {
                content: 'Paused',
                start: 'pause',
                end: 'play',
                align: 'top-right'
              }
            ]
          },
          watermark: {
            file: 'https://via.placeholder.com/100x50',
            position: 'top-right',
            opacity: 0.5,
          }
        }
      });

      this.player.on('play', () => {
        console.log('Video is now playing'); // Debugging log
      });

      this.player.on('pause', () => {
        console.log('Video is paused'); // Debugging log
      });

    } else {
      console.log('No video file found or file type is not supported'); // Debugging log
    }
  }


  loadComments(announcementId: number): void {
    this.announcementService.getCommentsByAnnouncementId(announcementId).subscribe(
      (comments) => {
        this.comments = comments.map(comment => ({
          ...comment,
          isEdited: comment.edited, // Ensure this flag is preserved
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt
        }));
      },
      (error) => {
        console.error('Error fetching comments', error);
      }
    );
  }
  

  addComment(): void {
    if (this.newComment.trim() && this.announcement) {
      const commentDto: CommentDto = {
        content: this.newComment,
        announcementId: this.announcement.id,
        userId: 11 // Replace with the actual user ID
      };

      this.announcementService.addComment(commentDto).subscribe(
        (addedComment) => {
          this.comments.push(addedComment);
          this.newComment = '';
        },
        (error) => {
          console.error('Error adding comment', error);
        }
      );
    }
  }

  addReply(parentCommentId: number): void {
    if (this.replyContent.trim() && this.announcement) {
      const replyDto: CommentDto = {
        content: this.replyContent,
        announcementId: this.announcement.id,
        userId: 11, // Replace with the actual user ID
        parentCommentId: parentCommentId
      };

      this.announcementService.addComment(replyDto).subscribe(
        (addedReply) => {
          if (this.announcement) {
            this.loadComments(this.announcement.id);
          }
          this.replyContent = '';
          this.replyToCommentId = null;
        },
        (error) => {
          console.error('Error adding reply', error);
        }
      );
    }
  }

  setReplyToComment(commentId: number): void {
    this.replyToCommentId = commentId;
  }

   // Editing and Deleting Methods
   isEditingComment(commentId: number): boolean {
    return this.editingCommentId === commentId;
  }

  editComment(comment: AnnouncementComments): void {
    this.editingCommentId = comment.id;
    this.editContent = comment.content;
  }

  updateComment(commentId: number): void {
    if (this.editContent.trim()) {
      const commentDto: CommentDto = {
        content: this.editContent,
        announcementId: this.announcement!.id,
        userId: 11, // Replace with the actual user ID
        parentCommentId: this.replyToCommentId
      };
  
      this.announcementService.updateComment(commentId, commentDto).subscribe(
        (updatedComment) => {
          // Update the existing comment with new content and metadata
          this.comments = this.comments.map(comment => {
            if (comment.id === updatedComment.id) {
              return {
                ...comment,
                content: updatedComment.content,
                edited: updatedComment.edited, // Corrected: Ensure the edited status is properly updated
                createdAt: comment.createdAt, // Keep the original created date
                updatedAt: updatedComment.updatedAt // Update the edited date
              };
            }
            // Update replies if any
            if (comment.replies) {
              comment.replies = comment.replies.map(reply => {
                if (reply.id === updatedComment.id) {
                  return {
                    ...reply,
                    content: updatedComment.content,
                    edited: updatedComment.edited, // Corrected: Ensure the edited status is properly updated
                    createdAt: reply.createdAt, // Keep the original created date
                    updatedAt: updatedComment.updatedAt // Update the edited date
                  };
                }
                return reply;
              });
            }
            return comment;
          });
          this.editingCommentId = null;
          this.editContent = '';
        },
        (error: any) => {
          console.error('Error updating comment', error);
        }
      );
    }
  }
  
  
  deleteComment(commentId: number): void {
    this.announcementService.deleteComment(commentId).subscribe(
      () => {
        // Filter out the deleted comment from the list
        this.comments = this.comments.filter(comment => comment.id !== commentId);
        this.comments.forEach(comment => {
          if (comment.replies) {
            // Remove any replies that were deleted along with the parent comment
            comment.replies = comment.replies.filter(reply => reply.id !== commentId);
          }
        });
      },
      (error: any) => {
        console.error('Error deleting comment', error);
      }
    );
  }
  
  
  cancelEdit(): void {
    this.editingCommentId = null;
    this.editContent = '';
  }


  isImage(fileExtension: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
    return imageExtensions.includes(fileExtension.toLowerCase());
  }

  isVideo(fileExtension: string): boolean {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv'];
    return videoExtensions.includes(fileExtension.toLowerCase());
  }

  getFileThumbnail(fileExtension: string): string {
    const thumbnails: { [key: string]: string } = {
      '.pdf': 'https://img.icons8.com/color/48/000000/pdf.png',
      '.xlsx': 'https://img.icons8.com/color/48/000000/microsoft-excel-2019.png',
      '.xls': 'https://img.icons8.com/color/48/000000/microsoft-excel-2019.png',
      '.docx': 'https://img.icons8.com/color/48/000000/microsoft-word-2019.png',
      '.doc': 'https://img.icons8.com/color/48/000000/microsoft-word-2019.png',
      '.ppt': 'https://img.icons8.com/color/48/000000/microsoft-powerpoint-2019.png',
      '.pptx': 'https://img.icons8.com/color/48/000000/microsoft-powerpoint-2019.png',
    };
    return thumbnails[fileExtension.toLowerCase()] || 'https://img.icons8.com/color/48/000000/file.png';
  }

  downloadFile(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      console.error('File ID is missing');
      return;
    }

    this.announcementService.getFile(id).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.getFileName(id); // Set the filename with appropriate extension
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('File download failed', error);
      }
    );
  }

  private getFileName(id: number): string {
    // Customize this logic based on your needs, such as fetching the original file name from the backend if available
    return `file_${id}`; // Example: announcement_1.pdf
  }
  
}
