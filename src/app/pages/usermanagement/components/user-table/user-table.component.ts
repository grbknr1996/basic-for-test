import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    MenuModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    AvatarModule,
    TagModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss',
})
export class UserTableComponent implements OnInit {
  @Input() users: User[] = [];
  @Input() loading: boolean = false;
  @Input() paginatorOptions = {
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
  };

  @Output() editUser = new EventEmitter<User>();
  @Output() deactivateUser = new EventEmitter<User>();
  @Output() resendActivation = new EventEmitter<User>();

  selectedUsers: User[] = [];
  actionItems: MenuItem[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initActionMenu();
  }

  initActionMenu() {
    this.actionItems = [
      {
        label: 'Edit User',
        icon: 'pi pi-user-edit',
        //  command: (event) => this.handleEditUser(event.item.data as User),
      },
      {
        label: 'Deactivate Account',
        icon: 'pi pi-ban',
        //  command: (event) => this.confirmDeactivate(event?.item.data),
      },
      {
        label: 'Resend Activation Email',
        icon: 'pi pi-envelope',
        // command: (event) => this.handleResendActivation(event.item.data),
      },
    ];
  }

  getActionsForUser(user: User): MenuItem[] {
    return this.actionItems.map((item) => ({
      ...item,
      data: user,
    }));
  }

  handleEditUser(user: User) {
    this.editUser.emit(user);
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: `Editing user ${user.username}`,
    });
  }

  confirmDeactivate(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to deactivate ${user.username}?`,
      header: 'Confirm Deactivation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.handleDeactivateUser(user);
      },
    });
  }

  handleDeactivateUser(user: User) {
    this.deactivateUser.emit(user);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'User deactivated',
    });
  }

  handleResendActivation(user: User) {
    this.resendActivation.emit(user);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Activation email sent to ${user.email}`,
    });
  }

  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'unconfirmed':
        return 'warn';
      case 'deactivated':
        return 'danger';
      default:
        return 'info';
    }
  }
}
