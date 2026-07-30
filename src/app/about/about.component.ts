import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicFooterComponent } from '../shared/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../shared/public-header/public-header.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NgFor, RouterModule, PublicHeaderComponent, PublicFooterComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  values = [
    {
      icon: 'fas fa-calculator',
      title: 'Real numbers, not guesswork',
      desc: 'Marketplace fee structures, GST, RTO cost, and shipping charges are all factored in before we call something "profit."'
    },
    {
      icon: 'fas fa-layer-group',
      title: 'Built for multi-marketplace sellers',
      desc: "One inventory, one profit engine, across every marketplace you sell on — no more juggling five different spreadsheets."
    },
    {
      icon: 'fas fa-bolt',
      title: 'Automate the tedious part',
      desc: 'Settlement Excel uploads and dispatch PDF imports do the data entry, so you spend time growing instead of reconciling.'
    },
  ];
}
