import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTableComponent } from '../components/user-table/user-table.component';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-user-container',
  standalone: true,
  imports: [CommonModule, UserTableComponent, ToastModule],
  providers: [MessageService],
  template: `
    <div>
      <p-toast></p-toast>
      <h2>User Management</h2>
      <button
        pButton
        label="Add User"
        icon="pi pi-plus"
        iconPos="right"
        class="p-button p-button-sm p-button-primary"
        (click)="({})"
      >
        Add User
      </button>
      <app-user-table
        [users]="users"
        [loading]="loading"
        [paginatorOptions]="{ rows: 10, rowsPerPageOptions: [5, 10, 25, 50] }"
        (editUser)="onEditUser($event)"
        (deactivateUser)="onDeactivateUser($event)"
        (resendActivation)="onResendActivation($event)"
      >
      </app-user-table>
    </div>
  `,
  styles: [
    `
      .card {
        background: var(--surface-card);
        padding: 1.5rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      h2 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: var(--text-color);
        font-weight: 600;
      }
    `,
  ],
})
export class UserContainerComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users',
        });
        this.loading = false;
      },
    });
  }

  onEditUser(user: User) {
    this.userService.setSelectedUser(user);
    // Here you would typically open an edit modal or navigate to edit page
  }

  onDeactivateUser(user: User) {
    this.userService.deactivateUser(user.id).subscribe({
      next: () => {
        this.loadUsers(); // Refresh the list after deactivation
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to deactivate user',
        });
      },
    });
  }

  onResendActivation(user: User) {
    this.userService.resendActivationEmail(user.id).subscribe({
      next: () => {
        // No need to refresh list after sending activation email
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to send activation email',
        });
      },
    });
  }
}
