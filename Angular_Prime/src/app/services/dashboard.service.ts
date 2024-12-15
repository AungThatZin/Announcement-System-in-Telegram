import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) { }
  
  getCounts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/counts`);
  }

  getTotalAnnouncementsData(view: 'monthly' | 'yearly'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/total-announcements?view=${view}`);
  }

  getAnnouncementsByDepartmentData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/announcements-by-department`);
  }

}
