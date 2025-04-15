// dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

// Services
import { AuthService } from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../modules/shared/services/language.service';
import { SharedModule } from '../../modules/shared/shared.module';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { ThemeSwitcher } from '../../themeSwitcher';
import { ConfigurationService } from '../../services/configuration.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    SharedModule,
    DatePickerComponent,
    ThemeSwitcher,
    InputNumberModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    TranslateModule,
  ],
  providers: [TranslateService, LanguageService],
  standalone: true,
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: any = null;
  value1: number = 42;
  currentLocale: string = 'en';

  // Table configuration
  columns = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'status', header: 'Status' },
    { field: 'createdAt', header: 'Created' },
  ];

  users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'Active',
      createdAt: '2023-05-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'Active',
      createdAt: '2023-05-10',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      status: 'Inactive',
      createdAt: '2023-04-22',
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      status: 'Active',
      createdAt: '2023-05-01',
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie@example.com',
      status: 'Pending',
      createdAt: '2023-05-08',
    },
  ];

  loading = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private router: Router,

    private configService: ConfigurationService
  ) {}

  ngOnInit() {
    // Get user information
    this.subscriptions.push(
      this.authService.authState$.subscribe((authState) => {
        this.user = authState.user;
      })
    );

    // Get current locale for input number
    this.subscriptions.push(
      this.languageService.currentLanguage$.subscribe((lang: any) => {
        this.currentLocale = lang;
      })
    );
    const url = this.router.url;
    const segments = url.split('/').filter((segment) => segment);

    if (
      segments.length > 0 &&
      environment.installedInstances.includes(segments[0])
    ) {
      this.configService.setCurrentInstance(segments[0]);
    }
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onActionClick(event: any) {
    console.log('Action clicked:', event);
    // Handle table action clicks
    if (event.action === 'edit') {
      this.router.navigate(['/users/edit', event.data.id]);
    } else if (event.action === 'delete') {
      // Show confirmation before deleting
      // this.confirmationService.confirm({...})
    }
  }
}
