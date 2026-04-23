import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { PLATFORMS } from '../../common/constant/platform.constants';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html'
})
export class UserDashboardComponent implements OnInit {

  dashboard: any;

  platformId: any = null;
  selectedPlatform: string = 'MEESHO';
  message: string = '';
  platforms = PLATFORMS;


  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.dashboardService.getDashboard(this.selectedPlatform)
      .subscribe((res: any) => {
        this.dashboard = res;
      })
  }

  changePlatform() {
    this.loadDashboard();
  }

}