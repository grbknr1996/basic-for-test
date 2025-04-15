import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { PrimeNG, providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { definePreset } from '@primeng/themes';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { LanguageService } from './modules/shared/services/language.service';
import { all } from 'primelocale';
import { AuthService } from './services/auth.service';
import { firstValueFrom } from 'rxjs';
import { ConfigurationService } from './services/configuration.service';

// Map language codes to PrimeNG locales
const PRIMENG_LOCALES: { [key: string]: any } = {
  en: all.en,
  fr: all.fr,
  es: all.es,
};
const WipoThemePreset = definePreset(Aura, {
  primitive: {
    // Adding font family
    fontFamily: '"Montserrat", "Segoe UI", Roboto, Arial, sans-serif',
    fontSize: '14px',
  },
  semantic: {
    primary: {
      50: '#e6f0f9',
      100: '#cce0f3',
      200: '#99c2e6',
      300: '#66a3da',
      400: '#3385cd',
      500: '#0067c0', // WIPO blue
      600: '#0052a3',
      700: '#003e87',
      800: '#00296a',
      900: '#00154e',
      950: '#000a32',
    },

    text: {
      fontWeight: '400',
      lineHeight: '1.5',
      // You can add more typography settings here
    },
    heading: {
      fontWeight: '600',
      lineHeight: '1.2',
    },
  },
});

const ModernNaturePreset = definePreset(Aura, {
  primitive: {
    fontFamily: '"Poppins", "Open Sans", "Helvetica Neue", sans-serif',
    fontSize: '15px',
  },
  semantic: {
    primary: {
      50: '#f2f8f0',
      100: '#e4f1e1',
      200: '#c9e3c3',
      300: '#aed5a6',
      400: '#93c788',
      500: '#78b96b', // Main green shade
      600: '#609a54',
      700: '#4c7b43',
      800: '#385c32',
      900: '#253d21',
      950: '#122010',
    },
    accent: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316', // Vibrant orange
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407',
    },
    text: {
      fontWeight: '300',
      lineHeight: '1.6',
      letterSpacing: '0.01em',
    },
    heading: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: '500',
      lineHeight: '1.3',
      letterSpacing: '-0.02em',
    },
    button: {
      borderRadius: '6px',
      fontWeight: '500',
      textTransform: 'none',
    },
    card: {
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    // Adding navigation styling
    navigation: {
      backgroundColor: '#385c32', // Using a darker green from the primary palette
      textColor: '#ffffff',
      activeItemColor: '#93c788', // Lighter green for active items
      hoverBackgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'transparent',
      height: '64px',
      fontSize: '16px',
      dropdownBackgroundColor: '#253d21', // Even darker for dropdown menus
    },
  },
});

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

// Function to set initial PrimeNG locale based on current language
export function initPrimeNGLocale(
  languageService: LanguageService,
  config: PrimeNG
) {
  return () => {
    const currentLang = languageService.getCurrentLanguage();
    const locale = PRIMENG_LOCALES[currentLang];
    if (locale) {
      config.setTranslation(locale);
    }

    // Subscribe to language changes to update PrimeNG locale
    languageService.currentLanguage$.subscribe((lang) => {
      const newLocale = PRIMENG_LOCALES[lang];
      if (newLocale) {
        config.setTranslation(newLocale);
      }
    });

    return Promise.resolve();
  };
}

export function initializeConfig(configService: ConfigurationService) {
  return () => {
    // Configuration service constructor will automatically detect the instance from URL
    return Promise.resolve();
  };
}
export function initializeAuth(authService: AuthService) {
  return () => {
    // This will ensure auth check happens before app is fully initialized
    return firstValueFrom(authService.checkAuthStatus());
  };
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: WipoThemePreset,
        options: {
          cssVariables: true,
          darkModeSelector: '.dark-theme',
        },
      },
      ripple: true,
    }),
    ...TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }).providers!,
    {
      provide: APP_INITIALIZER,
      useFactory: initPrimeNGLocale,
      deps: [LanguageService, PrimeNG],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeConfig,
      deps: [ConfigurationService],
      multi: true,
    },
  ],
};
