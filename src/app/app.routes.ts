import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { LoginComponent } from './common/login/login.component';
import { SignupComponent } from './common/signup/signup.component';
import { ForgotPasswordComponent } from './common/forgot-password/forgot-password.component';
import { DashboardComponent } from './common/dashboard/dashboard.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { ProductComponent } from './pages/products/product.component';
import { InvoiceUploadComponent } from './pages/invoice-upload/invoice-upload.component';
import { CategoryComponent } from './pages/category/category.component';
import { SettlementUploadComponent } from './pages/settlement-upload/settlement-upload.component';
import { UserDashboardComponent } from './pages/dashboard/dashboard.component';
import { OrderStatusUploadComponent } from './pages/order_status_invoice_upload/order-status-upload.component';
import { DispatchInvoiceComponent } from './pages/orders/dispatch-invoice.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './auth.guard';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { ManifestComponent } from './pages/manifest/manifest.component';
import { PlatformFeeSlabsComponent } from './pages/platform-fee-slabs/platform-fee-slabs.component';
import { CustomerRiskComponent } from './pages/customer-risk/customer-risk.component';

export const routes: Routes = [

  // Public routes (no layout)
  { path: '', component: LandingPageComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // Protected routes (with header/sidebar/footer)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, data: { breadcrumb: 'Dashboard' } },
      // UserDashboardComponent
      { path: 'user-dashboard', component: UserDashboardComponent, data: { breadcrumb: 'My Dashboard' } },
      { path: 'products', component: ProductComponent, data: { breadcrumb: 'Products' } },
      { path: 'upload-invoice', component: InvoiceUploadComponent, data: { breadcrumb: 'Upload Invoice' } },
      { path: 'upload-settlement', component: SettlementUploadComponent, data: { breadcrumb: 'Upload Settlement' } },
      { path: 'category', component: CategoryComponent, data: { breadcrumb: 'Category' } },
      { path: 'order-status', component: OrderStatusUploadComponent, data: { breadcrumb: 'Order Status' } },
      { path: 'dispatch-invoice', component: DispatchInvoiceComponent, data: { breadcrumb: 'Dispatch Invoice' } },
      { path: 'profile', component: ProfileComponent, data: { breadcrumb: 'Profile' } },
      { path: 'notifications', component: NotificationsComponent, data: { breadcrumb: 'Notifications' } },
      { path: 'inventory', component: InventoryComponent, data: { breadcrumb: 'Inventory' } },
      { path: 'manifest', component: ManifestComponent, data: { breadcrumb: 'Manifest' } },
      { path: 'platform-fee-slabs', component: PlatformFeeSlabsComponent, data: { breadcrumb: 'Platform Fee Slabs' } },
      { path: 'customer-risk-report', component: CustomerRiskComponent, data: { breadcrumb: 'Customer Risk Report' } },
      // add more sidebar routes here,

       { path: '**', component: NotFoundComponent }
    ]
  },

  { path: '**', component: NotFoundComponent },
];