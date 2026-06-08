import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';

import {
  Chart,
  ChartType,
  ChartConfiguration,
  ChartOptions,
  registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges, AfterViewInit {

  @Input() data: any[] = [];
  @Input() xField: string = '';
  @Input() yFields: string[] = [];

  @Input() chartType: ChartType = 'bar'; // ✅ bar / line / pie etc.

  @Input() title: string = '';
  @Input() labels: Record<string, string> = {};

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  chart?: Chart;

  private viewReady = false;

  colors = [
    '#0d6efd',
    '#198754',
    '#ffc107',
    '#dc3545',
    '#6f42c1',
    '#20c997'
  ];

  // ---------- lifecycle ----------
  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderChart();
  }

  ngOnChanges(_: SimpleChanges): void {
    this.renderChart();
  }

  // ---------- core ----------
  private renderChart(): void {

    if (!this.viewReady || !this.chartCanvas?.nativeElement) return;
    if (!this.data || this.data.length === 0) return;

    // destroy old chart
    if (this.chart) {
      this.chart.destroy();
    }

    const chartData: ChartConfiguration['data'] = {
      labels: this.data.map(row => row[this.xField]),

      datasets: this.yFields.map((field, index) => {

        const color = this.colors[index % this.colors.length];

        return {
          label: this.labels[field] || field,
          data: this.data.map(row => row[field] ?? 0),

          backgroundColor: this.chartType === 'line' ? 'transparent' : color,
          borderColor: color,

          borderWidth: 2,

          // smooth line (only for line chart)
          tension: this.chartType === 'line' ? 0.3 : 0,

          fill: this.chartType === 'line' ? false : true,

          borderRadius: this.chartType === 'bar' ? 6 : 0
        };
      })
    };

    const chartOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        title: {
          display: !!this.title,
          text: this.title
        },
        legend: {
          position: 'top'
        }
      },

      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: this.chartType,
      data: chartData,
      options: chartOptions
    });
  }
}