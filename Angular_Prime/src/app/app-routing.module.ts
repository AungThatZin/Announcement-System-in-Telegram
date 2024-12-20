import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { ChatComponent } from './components/chat/chat.component';
import { CreateAnnounceComponent } from './components/create-announce/create-announce.component';
import { OtpComponent } from './components/otp/otp.component';
import { ScheduleAnnounceComponent } from './components/schedule-announce/schedule-announce.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { AnnounceListComponent } from './components/announce-list/announce-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AsknowledgeComponent } from './components/asknowledge/asknowledge.component';
import { AuthenticatedLayoutComponent } from './components/authenticated-layout-component/authenticated-layout-component.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StaffListComponent } from './components/staff-list/staff-list.component';
import { UpcommingAnnounceComponent } from './components/upcomming-announce/upcomming-announce.component';
import { AnnounceHistoryComponent } from './components/announce-history/announce-history.component';
import { profile } from 'node:console';
import { ProfileComponent } from './components/profile/profile.component';
import { GroupCreateComponent } from './components/group-create/group-create.component';
import { AuthGuard } from './guards/guard';
import { RequestAnnounceComponent } from './components/request-announce/request-announce.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UserCreateAdmin } from './components/user-create-admin/user-create-admin.component';
import { AdduserComponent } from './components/adduser/adduser.component';
import { AnnouncementDetailsComponent } from './components/announcement-details/announcement-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'otp', component: OtpComponent },
  {path:'change-password',component:ChangePasswordComponent},
  {
    path: '',
    component: AuthenticatedLayoutComponent, canActivate:[AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'announce-list', component: AnnounceListComponent },
      { path: 'group-list', component: GroupListComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'schdule-announce', component: ScheduleAnnounceComponent },
      { path: 'create-announce', component: CreateAnnounceComponent, canActivate: [AuthGuard], data: { expectedRole: ['MAIN_HR', 'SUB_HR'] } },
      { path: 'asknowledge', component: AsknowledgeComponent },
      { path: 'staff-list', component: StaffListComponent, canActivate: [AuthGuard], data: { expectedRole: ['MAIN_HR', 'SUB_HR', 'MANAGEMENT'] } },
      {path:'upcoming-announce',component:UpcommingAnnounceComponent},
      {path:'announce-history',component:AnnounceHistoryComponent},
      {path:'profile',component:ProfileComponent},

      {path:'user-create',component:UserCreateAdmin},
      {path:'create-group',component:GroupCreateComponent, canActivate: [AuthGuard], data: { expectedRole: ['MAIN_HR', 'SUB_HR'] }},
      {path:'request-announce',component:RequestAnnounceComponent},
      {path:'adduser',component:AdduserComponent},
      { path: 'announcement/:id', component: AnnouncementDetailsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
