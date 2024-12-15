import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  unreadCount: number = 0;
  userId: number | null = null;

  constructor(
    private websocket: WebsocketService, 
    private auth: AuthService, 
    private http: HttpClient, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userId = this.auth.getUserId();
    if (this.userId) {
      this.loadUnseenNotifications(this.userId);
      this.subscribeToRealtimeNotifications(this.userId);
    }
  }

  loadUnseenNotifications(userId: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`);
    this.http.get<any[]>(`http://localhost:8080/api/announcements/unseen/${userId}`, { headers })
      .subscribe({
        next: (notifications) => {
          // Load notifications and assume all are unread initially
          this.notifications = notifications.map(n => ({ ...n, read: false })); // Adding `read` property locally
          this.unreadCount = this.notifications.length;
          this.updateBadge();
        },
        error: (err) => console.error('Error loading unseen notifications:', err)
      });
  }

  subscribeToRealtimeNotifications(userId: number) {
    this.websocket.getNotifications(userId).subscribe({
      next: (notification) => {
        // New notifications are assumed to be unread
        this.notifications.unshift({ ...notification, read: false });
        this.unreadCount++;
        this.updateBadge();
        this.cdr.detectChanges(); // Ensure change detection is triggered
      },
      error: (err) => console.error('Error receiving notification:', err)
    });
  }

  markAsSeen(notification: any) {
    if (!notification.read) {
      // Mark the notification as read locally
      notification.read = true;
      this.unreadCount = this.notifications.filter(n => !n.read).length;
      this.updateBadge();
    }
  }

  clearNotification(notification: any) {
    // Remove the notification from the list
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
    this.unreadCount = this.notifications.filter(n => !n.read).length;
    this.updateBadge();
  }

  updateBadge(): void {
    // Dynamically update the unread count
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }
}
