import { Component, ViewChild, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { DashboardService } from '../../services/dashboard.service';
import { Announcement } from '../../models/Announcement';
import { AnnouncementService } from '../../services/announcement.service';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  announcementCount: number = 0;
  userCount: number = 0;
  upcomingAnnouncementCount: number = 0;

  // Chart instances
  totalAnnouncementsChart: any;
  announcementsByDepartmentChart: any;

  announcements: Announcement[] = [];
  filteredAnnouncements: Announcement[] = [];
  chartView: 'monthly' | 'yearly' = 'monthly';

  @ViewChild('dt') dt: Table | undefined;

  constructor(private dashboardService: DashboardService, private announcementService: AnnouncementService, private router: Router) { }

  ngOnInit(): void {
    this.loadData();
    this.loadAnnouncements();
    this.filteredAnnouncements = this.announcements; // Initialize with all announcements

    // Initialize charts after data is loaded
    this.initCharts();
  }

  initCharts(): void {
    this.initTotalAnnouncementsChart();
    this.initAnnouncementsByDepartmentChart();
  }

  initTotalAnnouncementsChart(): void {
    this.dashboardService.getTotalAnnouncementsData(this.chartView).subscribe(data => {
      const chartData = this.prepareTotalAnnouncementsData(data);
      const chartOptions = this.getCommonChartOptions();

      const ctx = document.getElementById('totalAnnouncementsChart') as HTMLCanvasElement;
      if (this.totalAnnouncementsChart) {
        this.totalAnnouncementsChart.destroy(); // Destroy previous instance if it exists
      }
      this.totalAnnouncementsChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
      });
    });
  }

  initAnnouncementsByDepartmentChart(): void {
    this.dashboardService.getAnnouncementsByDepartmentData().subscribe(data => {
      const chartData = this.prepareAnnouncementsByDepartmentData(data);
      const chartOptions = this.getCommonChartOptions();

      const ctx = document.getElementById('announcementsByDepartmentChart') as HTMLCanvasElement;
      if (this.announcementsByDepartmentChart) {
        this.announcementsByDepartmentChart.destroy(); // Destroy previous instance if it exists
      }
      this.announcementsByDepartmentChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions
      });
    });
  }

  prepareTotalAnnouncementsData(data: any): any {
    return {
      labels: data.labels,
      datasets: [{
        label: 'Total Announcements',
        data: data.values,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2
      }]
    };
  }

  prepareAnnouncementsByDepartmentData(data: any): any {
    return {
      labels: data.departments,
      datasets: [{
        label: 'Announcements by Department',
        data: data.counts,
        backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1
      }]
    };
  }

  getCommonChartOptions(): any {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleColor: 'white',
          bodyColor: 'white'
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(200, 200, 200, 0.3)',
            borderDash: [5, 5]
          }
        },
        y: {
          grid: {
            color: 'rgba(200, 200, 200, 0.3)',
            borderDash: [5, 5]
          },
          beginAtZero: true
        }
      }
    };
  }

  loadAnnouncements(): void {
    this.announcementService.getAllAnnouncements().subscribe(data => {
      this.announcements = data.map(announcement => ({
        ...announcement,
        progress: announcement.readProgress // Add progress field
      }));
      console.log(this.announcements);
      this.filteredAnnouncements = [...this.announcements];
    });
  }

  calculateProgress(announcement: Announcement): number {
    return Math.random() * 100; // Replace with real calculation
  }

  viewAnnouncement(announcement: Announcement): void {
    console.log("announcement/" + announcement.id);
    this.router.navigate([`/announcement/${announcement.id}`]);
  }

  loadData(): void {
    this.dashboardService.getCounts().subscribe(counts => {
      this.announcementCount = counts.announcementCount;
      this.userCount = counts.userCount;
      this.upcomingAnnouncementCount = counts.upcomingAnnouncementCount;
    });
  }

  onFilter(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase();

    this.filteredAnnouncements = this.announcements.filter(announcement => {
      const titleMatch = announcement.title.toLowerCase().includes(value);
      const contentMatch = announcement.content.toLowerCase().includes(value);
      const senderNameMatch = announcement.user.name.toLowerCase().includes(value);
      const publishedDateMatch = new Date(announcement.createdAt).toLocaleDateString().toLowerCase().includes(value);

      switch (field) {
        case 'title':
          return titleMatch;
        case 'content':
          return contentMatch;
        case 'userName':
          return senderNameMatch;
        case 'createdAt':
          return publishedDateMatch;
        default:
          return titleMatch || contentMatch || senderNameMatch || publishedDateMatch;
      }
    });
  }

  getStartIndex(): number {
    return this.dt?.first ?? 0;
  }

  getEndIndex(): number {
    const endIndex = (this.dt?.first || 0) + (this.dt?.rows || 0);
    return endIndex > this.announcements.length ? this.announcements.length : endIndex;
  }

  setChartView(view: 'monthly' | 'yearly'): void {
    this.chartView = view;
    this.initTotalAnnouncementsChart(); // Reinitialize chart with new view
  }
}
