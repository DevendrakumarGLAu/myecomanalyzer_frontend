import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { LoginComponent } from './common/login/login.component';
import { SignupComponent } from './common/signup/signup.component';
import { DashboardComponent } from './common/dashboard/dashboard.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { ProductComponent } from './pages/products/product.component';
import { InvoiceUploadComponent } from './pages/invoice-upload/invoice-upload.component';
import { CategoryComponent } from './pages/category/category.component';
import { PaymentExcelComponent } from './pages/payment_invoice/payment_invoice.component';
import { UserDashboardComponent } from './pages/dashboard/dashboard.component';
import { OrderStatusUploadComponent } from './pages/order_status_invoice_upload/order-status-upload.component';
import { DispatchInvoiceComponent } from './pages/orders/dispatch-invoice.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './auth.guard';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { ManifestComponent } from './pages/manifest/manifest.component';

export const routes: Routes = [

  // Public routes (no layout)
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Protected routes (with header/sidebar/footer)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      // UserDashboardComponent
      { path: 'user-dashboard', component: UserDashboardComponent },
      { path: 'products', component: ProductComponent },
      { path: 'upload-invoice', component: InvoiceUploadComponent },
      { path: 'upload-excel', component: PaymentExcelComponent },
      {path:'category',component:CategoryComponent},
      { path: 'order-status', component: OrderStatusUploadComponent },
      { path: 'dispatch-invoice', component: DispatchInvoiceComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'notifications',component: NotificationsComponent},
      { path: 'inventory', component: InventoryComponent },
       { path: 'manifest', component: ManifestComponent },
      // add more sidebar routes here,

       { path: '**', component: NotFoundComponent }
    ]
  },

  { path: '**', component: NotFoundComponent },
];