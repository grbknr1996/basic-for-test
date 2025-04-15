import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../modules/shared/services/language.service';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CalendarModule, FormsModule],
  template: `
    <div>
      <h1>Date Picker</h1>
      <p-calendar
        [(ngModel)]="date"
        [locale]="locale"
        [dateFormat]="dateFormat"
        [showIcon]="true"
      >
      </p-calendar>
    </div>
  `,
})
export class DatePickerComponent implements OnInit {
  date: Date = new Date();
  locale: any;
  dateFormat!: string;

  constructor(private languageService: LanguageService) {
    // Initial setup
    this.updateLocaleSettings(this.languageService.getCurrentLanguage());
  }

  ngOnInit() {
    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe((lang: any) => {
      this.updateLocaleSettings(lang);
    });
  }

  private updateLocaleSettings(lang: string) {
    // Find the language option that includes the PrimeNG locale
    const langOption = this.languageService
      .getAllLanguages()
      .find((l: any) => l.code === lang);

    if (langOption) {
      // Use the PrimeNG locale from our language service
      this.locale = langOption.primengLocale;

      // Set appropriate date format based on locale
      switch (lang) {
        case 'en':
          this.dateFormat = 'mm/dd/yy'; // US format
          break;
        case 'fr':
        case 'es':
          this.dateFormat = 'dd/mm/yy'; // European format
          break;
        default:
          this.dateFormat = 'mm/dd/yy'; // Default
      }
    }
  }
}
