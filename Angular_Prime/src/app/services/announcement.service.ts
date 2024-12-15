import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Announcement } from '../models/Announcement';
import { AnnouncementComments } from '../models/AnnouncementComments';
import { CommentDto } from '../models/CommentDTO';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = `http://localhost:8080/api/announcements`;
  private commentsUrl = `http://localhost:8080/api/comments`;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json' // Ensure Content-Type is set to JSON
      // Add any other required headers here
    });
  }

  getAllAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getAnnouncementById(id: string): Observable<Announcement> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Announcement>(url, { headers: this.getHeaders() });
  }
  

  getCommentsByAnnouncementId(announcementId: number): Observable<AnnouncementComments[]> {
    return this.http.get<AnnouncementComments[]>(`${this.commentsUrl}/announcement/${announcementId}`, { headers: this.getHeaders() });
  }

  addComment(commentDto: CommentDto): Observable<AnnouncementComments> {
    return this.http.post<AnnouncementComments>(this.commentsUrl, commentDto, { headers: this.getHeaders() });
  }

  updateComment(commentId: number, commentDto: CommentDto): Observable<AnnouncementComments> {
    const url = `${this.commentsUrl}/${commentId}`;
    return this.http.put<AnnouncementComments>(url, commentDto, { headers: this.getHeaders() });
  }
  
  deleteComment(commentId: number): Observable<void> {
    const url = `${this.commentsUrl}/${commentId}`;
    return this.http.delete<void>(url, { headers: this.getHeaders() });
  }

  getFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download`, {
      params: new HttpParams().set('id', id.toString()), // Set the id as a parameter
      responseType: 'blob' // Important to specify 'blob' for binary data
    });
  }
  
 
}
