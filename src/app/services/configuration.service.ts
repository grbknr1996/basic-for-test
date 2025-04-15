import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { environment, configuration } from '../../environments/environment';
import { PrimeNG } from 'primeng/config';
import { $t } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import Material from '@primeng/themes/material';
import Nora from '@primeng/themes/nora';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

export interface OfficeInfo {
  fullName: string;
  shortName: string;
  logoPath: string;
  mainColor: string;
}

export interface InstanceConfig {
  module: {
    [key: string]: boolean;
  };
  order: string[];
  availableLangs: string[];
  defaultLanguage: string;
  defaultLandingModule: string;
  officeInfo: OfficeInfo;
  theme?: {
    preset: string;
    primary?: string;
    surface?: string;
    darkTheme?: boolean;
  };
}

// Add index signature to configuration type
interface Configuration {
  [key: string]: InstanceConfig;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private currentInstance = new BehaviorSubject<string>('default');
  public currentInstance$ = this.currentInstance.asObservable();

  private configData = new BehaviorSubject<InstanceConfig>(
    configuration.default
  );
  public configData$ = this.configData.asObservable();

  // Theme presets with index signature
  private themePresets: { [key: string]: any } = {
    Aura: Aura,
    Lara: Lara,
    Material: Material,
    Nora: Nora,
    // You can define custom presets here as needed
    WipoTheme: Aura,
    ModernNature: Aura,
  };

  constructor(
    private router: Router,
    private primeNgConfig: PrimeNG,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    // Initialize and observe route changes to detect instance changes
    if (isPlatformBrowser(this.platformId)) {
      this.initFromUrl(window.location.pathname);

      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          this.initFromUrl(event.urlAfterRedirects);
        });
    }
  }

  // Set the current instance based on URL path
  // In ConfigurationService.ts - update the initFromUrl method

  private initFromUrl(url: string): void {
    // Debug log
    console.log('Parsing URL:', url);

    // Parse the URL to find the instance identifier
    const pathSegments = url.split('/').filter((segment) => segment);
    console.log('Path segments:', pathSegments);

    // Check if the first segment matches any installed instance
    if (
      pathSegments.length > 0 &&
      environment.installedInstances.includes(pathSegments[0])
    ) {
      console.log('Found matching office:', pathSegments[0]);
      this.setCurrentInstance(pathSegments[0]);
    } else {
      // Default to the first available instance or 'default'
      const defaultInstance = environment.installedInstances[0] || 'default';
      console.log('Defaulting to office:', defaultInstance);
      this.setCurrentInstance(defaultInstance);
    }
  }

  // Manually set current instance
  public setCurrentInstance(instance: string): void {
    if (this.currentInstance.value !== instance) {
      this.currentInstance.next(instance);

      // Update config data based on selected instance
      // Cast configuration to Configuration type with index signature
      const config = configuration as Configuration;
      const instanceConfig = config[instance] || config['default'];
      this.configData.next(instanceConfig);

      // Apply theme from configuration
      this.applyThemeFromConfig(instanceConfig);
    }
  }

  // Get current theme preset
  public getThemePreset(presetName: string): any {
    return this.themePresets[presetName] || this.themePresets['Aura'];
  }

  // Apply theme based on configuration
  // In ConfigurationService.ts - update the applyThemeFromConfig method

  // In ConfigurationService.ts - update the applyThemeFromConfig method

  private applyThemeFromConfig(config: InstanceConfig): void {
    if (!config.theme || !isPlatformBrowser(this.platformId)) return;

    console.log('Applying theme:', config.theme);

    // Get the preset
    const presetName = config.theme.preset || 'Aura';
    console.log('Using preset:', presetName);

    const preset = this.getThemePreset(presetName);

    try {
      // Use the $t API instead of primeNgConfig.theme.update
      $t()
        .preset(preset)
        .use({
          useDefaultOptions: true,
          cssVariables: true,
          darkModeSelector: config.theme.darkTheme ? '.dark-theme' : undefined,
        });

      console.log('Theme applied successfully');

      // Apply dark mode if configured
      if (config.theme.darkTheme) {
        this.document.documentElement.classList.add('p-dark');
        this.document.documentElement.classList.add('dark-theme');
      } else {
        this.document.documentElement.classList.remove('p-dark');
        this.document.documentElement.classList.remove('dark-theme');
      }

      // Apply Material class if needed
      if (presetName === 'Material') {
        this.document.body.classList.add('material');
      } else {
        this.document.body.classList.remove('material');
      }

      // Apply primary color as a data attribute for custom styling
      if (config.theme.primary) {
        this.document.documentElement.setAttribute(
          'data-primary-color',
          config.theme.primary
        );
      }
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }

  // Get the application header information from configuration
  public getHeaderInfo(): { name: string; logo: string; color: string } {
    const config = this.configData.value;
    return {
      name: config.officeInfo.fullName,
      logo: config.officeInfo.logoPath,
      color: config.officeInfo.mainColor,
    };
  }

  // Get office information
  public getOfficeInfo(): OfficeInfo {
    return this.configData.value.officeInfo;
  }

  // Get configuration value
  public getConfig(): InstanceConfig {
    return this.configData.value;
  }
}
