import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  // Chart data
  salesChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  ordersChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  // Chart options
  salesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Sales Trend',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      }
    }
  };

  ordersChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Orders Trend',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Chart types
  salesChartType: ChartType = 'bar';
  ordersChartType: ChartType = 'bar';

  // Time period selection
  selectedPeriod: string = '7days';
  periods = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: '1year', label: 'Last Year' }
  ];

  loading = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadChartData();
  }

  loadChartData() {
    this.loading = true;

    // Mock data for demonstration - replace with actual API calls
    this.generateMockData();

    this.loading = false;
  }

  onPeriodChange() {
    this.loadChartData();
  }

  private generateMockData() {
    const periods = this.getPeriodLabels();

    // Sales data
    this.salesChartData = {
      labels: periods.labels,
      datasets: [
        {
          data: periods.salesData,
          label: 'Sales Amount',
          backgroundColor: 'rgba(67, 97, 238, 0.8)',
          borderColor: 'rgba(67, 97, 238, 1)',
          borderWidth: 1
        }
      ]
    };

    // Orders data
    this.ordersChartData = {
      labels: periods.labels,
      datasets: [
        {
          data: periods.ordersData,
          label: 'Number of Orders',
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1
        }
      ]
    };
  }

  private getPeriodLabels() {
    const now = new Date();
    const labels: string[] = [];
    const salesData: number[] = [];
    const ordersData: number[] = [];

    switch (this.selectedPeriod) {
      case '7days':
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(now.getDate() - i);
          labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
          salesData.push(Math.floor(Math.random() * 50000) + 10000);
          ordersData.push(Math.floor(Math.random() * 50) + 10);
        }
        break;

      case '30days':
        for (let i = 29; i >= 0; i -= 3) {
          const date = new Date(now);
          date.setDate(now.getDate() - i);
          labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
          salesData.push(Math.floor(Math.random() * 100000) + 20000);
          ordersData.push(Math.floor(Math.random() * 100) + 20);
        }
        break;

      case '90days':
        for (let i = 0; i < 12; i++) {
          const date = new Date(now);
          date.setMonth(now.getMonth() - (11 - i));
          labels.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
          salesData.push(Math.floor(Math.random() * 200000) + 50000);
          ordersData.push(Math.floor(Math.random() * 200) + 50);
        }
        break;

      case '1year':
        for (let i = 0; i < 12; i++) {
          const date = new Date(now);
          date.setMonth(now.getMonth() - (11 - i));
          labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
          salesData.push(Math.floor(Math.random() * 300000) + 100000);
          ordersData.push(Math.floor(Math.random() * 300) + 100);
        }
        break;
    }

    return { labels, salesData, ordersData };
  }
}