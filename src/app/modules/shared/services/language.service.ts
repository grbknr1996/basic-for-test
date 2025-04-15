import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es';
import { PrimeNG } from 'primeng/config';

// Import PrimeNG locales
import { all } from 'primelocale';

export type Language = 'en' | 'fr' | 'es';

interface LanguageOption {
  code: Language;
  name: string;
  locale: any;
  primengLocale: any;
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<Language>('en');
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  private languages: LanguageOption[] = [
    {
      code: 'en',
      name: 'English',
      locale: localeEn,
      primengLocale: all.en,
    },
    {
      code: 'fr',
      name: 'Français',
      locale: localeFr,
      primengLocale: all.fr,
    },
    {
      code: 'es',
      name: 'Español',
      locale: localeEs,
      primengLocale: all.es,
    },
  ];

  constructor(
    private translateService: TranslateService,
    private config: PrimeNG
  ) {
    // Register all locales
    this.languages.forEach((lang) => registerLocaleData(lang.locale));

    // Set available languages
    translateService.addLangs(this.languages.map((l) => l.code));

    // Set default language
    translateService.setDefaultLang('en');

    // Check if we have a saved language preference
    const savedLang = localStorage.getItem('preferred_language');
    if (savedLang && this.isValidLanguage(savedLang as Language)) {
      this.initLanguage(savedLang as Language);
    } else {
      // Use browser's language or fallback to default
      const browserLang = translateService.getBrowserLang();
      const langToUse =
        browserLang && this.isValidLanguage(browserLang as Language)
          ? (browserLang as Language)
          : 'en';
      this.initLanguage(langToUse);
    }
  }

  // Method to set the initial language without notifying subscribers yet
  private initLanguage(lang: Language): void {
    if (this.isValidLanguage(lang)) {
      this.translateService.use(lang);

      // Set PrimeNG locale
      this.setPrimeNGLocale(lang);

      this.currentLanguageSubject.next(lang);
      localStorage.setItem('preferred_language', lang);
      document.documentElement.lang = lang;
    }
  }

  // Set PrimeNG locale settings
  private setPrimeNGLocale(lang: Language): void {
    const languageOption = this.languages.find((l) => l.code === lang);
    if (languageOption) {
      // Set the PrimeNG locale
      this.config.setTranslation(languageOption.primengLocale);

      // Also set any translations from ngx-translate if available
      this.translateService.get('primeng').subscribe((res) => {
        if (res !== 'primeng') {
          // Merge with PrimeNG's default translations
          this.config.setTranslation({
            ...languageOption.primengLocale,
            ...res,
          });
        }
      });
    }
  }

  // Public method to change language and return an Observable for completion
  changeLanguage(lang: Language): Observable<any> {
    if (this.isValidLanguage(lang)) {
      // Only proceed if this is actually a different language
      if (this.currentLanguageSubject.value !== lang) {
        // Set PrimeNG locale
        this.setPrimeNGLocale(lang);

        // Use the translate service and return its Observable
        const translationObservable = this.translateService.use(lang);

        // Update the language state
        this.currentLanguageSubject.next(lang);
        localStorage.setItem('preferred_language', lang);
        document.documentElement.lang = lang;

        // Return the translation Observable so callers can wait for completion
        return translationObservable;
      }
    }

    // Return an empty observable if no change is needed
    return EMPTY;
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  getLanguageName(code: Language): string {
    const lang = this.languages.find((l) => l.code === code);
    return lang ? lang.name : 'Unknown';
  }

  getAllLanguages() {
    return this.languages;
  }

  private isValidLanguage(lang: Language): boolean {
    return this.languages.some((l) => l.code === lang);
  }
}
