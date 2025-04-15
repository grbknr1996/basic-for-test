import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';

//Custom Import
import { FormsModule } from '@angular/forms';
import { Button, ButtonModule } from 'primeng/button';
import { SharedModule } from './modules/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserContainerComponent } from './pages/usermanagement/user-container/user-container.component';

import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { ColumnDefinition } from './modules/shared/table/table.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { ThemeSwitcher } from './themeSwitcher';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { LanguageService } from './modules/shared/services/language.service';
import { ConfigurationService } from './services/configuration.service';

//WAngular Import
//import { AppWipoAngularModule } from './modules/app-wipo-angular/app-wipo-angular.module';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    ButtonModule,
    SharedModule,
    TranslateModule,
    UserContainerComponent,
    DatePickerComponent,
    InputTextModule,
    InputNumberModule,
    ThemeSwitcher,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [TranslateService],
})
export class AppComponent {
  title = 'ipas-central';
  value1 = 100000;
  currentLocale: string = 'en-US';
  columns: ColumnDefinition[] = [
    {
      field: 'avatarUrl',
      header: 'Avatar',
      display: 'avatar',
      width: '8rem',
    },
    {
      field: 'username',
      header: 'Username',
      filterType: 'text',
      sortable: true,
      width: '12rem',
    },
    {
      field: 'email',
      header: 'Email',
      filterType: 'text',
      sortable: true,
      width: '18rem',
    },
    {
      field: 'createdOn',
      header: 'Created On',
      display: 'date',
      filterType: 'date',
      sortable: true,
      width: '10rem',
      dateFormat: 'MM/dd/yyyy',
    },
    {
      field: 'status',
      header: 'Status',
      display: 'tag',
      filterType: 'dropdown',
      sortable: true,
      width: '10rem',
      dropdownOptions: [
        { label: 'Active', value: 'Active' },
        { label: 'Unconfirmed', value: 'Unconfirmed' },
        { label: 'Deactivated', value: 'Deactivated' },
      ],
      severity: (status: string) => this.getStatusSeverity(status),
    },
    {
      field: 'actions',
      header: 'Actions',
      display: 'actions',
      width: '8rem',
      showAsDropdown: true,
      actions: [
        {
          label: 'Edit',
          icon: 'pi pi-pencil',
          action: 'edit',
          severity: 'success',
        },
        {
          label: 'Delete',
          icon: 'pi pi-trash',
          action: 'delete',
          severity: 'danger',
        },
        {
          label: 'View Details',
          icon: 'pi pi-eye',
          action: 'view',
          severity: 'info',
        },
      ],
    },
  ];

  loading = false;

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Unconfirmed':
        return 'warn';
      case 'Deactivated':
        return 'danger';
      default:
        return 'info';
    }
  }

  // Define paging settings
  paginatorOptions = {
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
  };
  onActionClick(event: { action: string; item: any }) {
    console.log(`Action ${event.action} for:`, event.item);

    switch (event.action) {
      case 'edit':
        // Implement edit logic
        this.editUser(event.item);
        break;
      case 'delete':
        // Implement delete logic
        this.deleteUser(event.item);
        break;
    }
  }
  editUser(user: any): void {
    console.log('Editing user', user);
    // Your edit logic
  }

  deleteUser(user: any): void {
    console.log('Deleting user', user);
    // Your delete logic
  }

  // Handle selection changes
  onSelectionChange(selection: any): void {
    console.log('Selected items:', selection);
  }
  users: User[] = [];

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private userService: UserService,
    private configService: ConfigurationService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.languageService.currentLanguage$.subscribe((lang) => {
      // Map language code to locale format
      switch (lang) {
        case 'en':
          this.currentLocale = 'en-US';
          break;
        case 'fr':
          this.currentLocale = 'fr-FR';
          break;
        case 'es':
          this.currentLocale = 'es-ES';
          break;
        default:
          this.currentLocale = 'en-US';
      }
    });
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: 'Failed to load users',
        // });
        this.loading = false;
      },
    });
  }
}
