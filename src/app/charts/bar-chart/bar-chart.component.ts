import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  NgZone
} from '@angular/core';

import { Chart, ChartType, ChartConfiguration, ChartOptions, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() data: any[] = [];
  @Input() xField: string = '';
  @Input() yFields: string[] = [];
  @Input() chartType: ChartType = 'bar';
  @Input() title: string = '';
  @Input() labels: Record<string, string> = {};

  @ViewChild('chartCanvas')
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.chartCanvas) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    if (!this.chartCanvas?.nativeElement || !this.data?.length) return;

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const labels = this.data.map(row => row[this.xField]);

    const datasets = this.yFields.map((field, index) => {
      const color = this.getColor(index);

      return {
        label: this.labels[field] || field,
        data: this.data.map(row => row[field] || 0),
        backgroundColor: this.chartType === 'line' ? 'transparent' : color,
        borderColor: color,
        borderWidth: 2,
        tension: this.chartType === 'line' ? 0.3 : 0,
        fill: false,
        borderRadius: this.chartType === 'bar' ? 4 : 0
      };
    });

    const config: ChartConfiguration = {
      type: this.chartType,
      data: { labels, datasets },
      options: this.getChartOptions()
    };

    this.ngZone.runOutsideAngular(() => {
      this.chart = new Chart(this.chartCanvas.nativeElement, config);
    });
  }

  private getChartOptions(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,

      interaction: {
        intersect: false,
        mode: 'index'
      },

      plugins: {
        legend: { position: 'top' },
        title: {
          display: !!this.title,
          text: this.title
        }
      },

      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: true
        }
      }
    };
  }

  private getColor(index: number): string {
    const colors = ['#0d6efd', '#198754', '#ffc107', '#dc3545'];
    return colors[index % colors.length];
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}