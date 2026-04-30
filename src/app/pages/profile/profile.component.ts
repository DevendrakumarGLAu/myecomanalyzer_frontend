import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  // Display data
  username = '';
  firstName = '';
  lastName = '';
  email = '';
  createdAt = '';
  memberSince = '';

  // Edit mode
  isEditing = false;
  editFirstName = '';
  editLastName = '';
  editEmail = '';

  // Stats (computed from local data)
  totalProducts = 0;
  totalOrders = 0;
  accountAge = '';

  constructor(
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.firstName = localStorage.getItem('first_name') || '';
    this.lastName = localStorage.getItem('last_name') || '';
    this.email = localStorage.getItem('email') || localStorage.getItem('username') || '';
    this.createdAt = localStorage.getItem('created_at') || '';

    const fullName = `${this.firstName} ${this.lastName}`.trim();
    this.username = this.toTitleCase(fullName || this.email || 'User');

    if (this.createdAt) {
      const date = new Date(this.createdAt);
      this.memberSince = date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
        day: 'numeric',
      });
      this.accountAge = this.getAccountAge(date);
    }

    // Copy for editing
    this.editFirstName = this.firstName;
    this.editLastName = this.lastName;
    this.editEmail = this.email;
  }

  getAccountAge(createdDate: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return '1 month';
    if (diffMonths < 12) return `${diffMonths} months`;
    const diffYears = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;
    if (remainingMonths === 0) return `${diffYears} year${diffYears > 1 ? 's' : ''}`;
    return `${diffYears} year${diffYears > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editFirstName = this.firstName;
      this.editLastName = this.lastName;
      this.editEmail = this.email;
    }
  }

  saveProfile() {
    localStorage.setItem('first_name', this.editFirstName);
    localStorage.setItem('last_name', this.editLastName);
    localStorage.setItem('email', this.editEmail);
    localStorage.setItem('username', this.editEmail);

    this.isEditing = false;
    this.loadProfile();
    this.toastService.success('Profile updated successfully!');
  }

  cancelEdit() {
    this.isEditing = false;
  }

  getInitials(): string {
    const first = this.firstName ? this.firstName[0] : '';
    const last = this.lastName ? this.lastName[0] : '';
    return (first + last).toUpperCase() || 'U';
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  toTitleCase(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
