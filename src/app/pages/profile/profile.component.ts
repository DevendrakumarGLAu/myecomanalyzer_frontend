import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ToastService } from '../../services/toast.service';
import { ProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  // UI state
  isLoading = false;
  isEditing = false;
  isSaving = false;
  profileForm!: FormGroup
  memberSince = '';
  accountAge = '';
  createdAtDate: Date | null = null;

  // subscription: any = null;
  profileData: any = {};
  subscription: any = {};

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Reactive Form
    this.profileForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile_number: ['', [Validators.required]]
    });
    this.loadProfile();

  }

  // =========================
  // LOAD PROFILE FROM API
  // =========================
  loadProfile(): void {
    this.isLoading = true;

    this.profileService.getProfile().subscribe({
      next: (res: any) => {

        const data = res?.data || res;
        this.profileData = data;

        // subscription object separate
        this.subscription = {
          trial_start: data.trial_start,
          trial_end: data.trial_end,
          subscription_start: data.subscription_start,
          subscription_end: data.subscription_end,
          payment_verified: data.payment_verified
        };
        this.createdAtDate = data.created_at ? new Date(data.created_at) : null;

        if (this.createdAtDate) {
          this.memberSince = this.createdAtDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
          });

          this.accountAge = this.getTimeAgo(this.createdAtDate);
        } else {
          this.memberSince = 'Unknown';
          this.accountAge = '';
        }
        this.profileForm.patchValue({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          mobile_number: data.mobile_number || ''
        });

        this.isLoading = false;
      },

      error: (err) => {
        console.error(err);
        this.toast.error('Failed to load profile');
        this.isLoading = false;
      }
    });

  }

  // =========================
  // EDIT MODE
  // =========================
  toggleEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadProfile(); // reset changes
  }

  // =========================
  // SAVE PROFILE
  // =========================
  saveProfile(): void {

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    this.profileService.updateProfile(this.profileForm.value as any).subscribe({
      next: () => {
        this.toast.success('Profile updated successfully');
        this.isSaving = false;
        this.isEditing = false;
        this.loadProfile();
      },

      error: (err) => {
        console.error(err);
        this.toast.error('Failed to update profile');
        this.isSaving = false;
      }
    });
  }

  // =========================
  // UI HELPERS
  // =========================
  getInitials(): string {
    const v = this.profileForm.value;

    const first = v.first_name?.charAt(0) || '';
    const last = v.last_name?.charAt(0) || '';

    return (first + last).toUpperCase() || 'U';
  }

  // =========================
  // LOGOUT
  // =========================
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;

    const months = Math.floor(diffDays / 30);
    if (months === 1) return '1 month ago';

    if (months < 12) return `${months} months ago`;

    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }

  getTrialStatus(endDate: string): string {
    const end = new Date(endDate);
    const now = new Date();

    if (end > now) return 'Active Trial';
    return 'Expired Trial';
  }
  getSubscriptionStatus(endDate: string): string {
    const end = new Date(endDate);
    const now = new Date();

    return end > now ? 'Active' : 'Expired';
  }
  goToSubscription() {
    this.router.navigate(['/subscription']);
  }
  isExpired(dateStr: string): boolean {
    if (!dateStr) return true;
    return new Date(dateStr) < new Date();
  }
}