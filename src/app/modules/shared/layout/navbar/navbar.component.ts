import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LanguageService, Language } from '../../services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { getTranslatedMenuItems } from '../../config/menu-config';
import { AuthService } from '../../../../services/auth.service';

interface LanguageOption {
  id: Language;
  label: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false,
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  menuItems: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];
  languageMenuItems: MenuItem[] = [];
  mobileMenuVisible = false;
  currentLanguage: Language = 'en';
  currentUser: any = null;

  // Language options
  languageOptions: LanguageOption[] = [
    { id: 'en', label: 'English' },
    { id: 'fr', label: 'FRANÇAIS' },
    { id: 'es', label: 'ESPAÑOL' },
  ];

  constructor(
    private languageService: LanguageService,
    private translateService: TranslateService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Get initial language
    this.currentLanguage = this.languageService.getCurrentLanguage();

    // Initialize menu items
    this.updateMenuItems();

    // Initialize language menu items
    this.initLanguageMenuItems();

    // Initialize user menu items
    this.initUserMenuItems();

    // Listen for language changes
    this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
      this.initLanguageMenuItems(); // Rebuild language menu items when language changes
      this.initUserMenuItems(); // Rebuild user menu items when language changes
    });

    // Update menu items when translations change
    this.translateService.onLangChange.subscribe(() => {
      this.updateMenuItems();
      this.initUserMenuItems();
      this.initLanguageMenuItems();
      this.cdRef.detectChanges();
    });

    // Get current user
    this.authService.authState$.subscribe((authState) => {
      this.currentUser = authState.user;
      this.cdRef.detectChanges();
    });
  }

  // Initialize language dropdown menu items
  initLanguageMenuItems() {
    this.languageMenuItems = this.languageOptions.map((lang) => {
      return {
        label: lang.label,
        icon: lang.id === this.currentLanguage ? 'pi pi-check' : undefined,
        command: () => {
          this.changeLanguage(lang.id);
        },
      };
    });
  }

  // Initialize user dropdown menu items
  initUserMenuItems() {
    this.userMenuItems = [
      {
        label: this.translateService.instant('COMMON.PROFILE'),
        icon: 'pi pi-user',
        command: () => {
          // Navigate to user profile
          console.log('Navigate to profile');
        },
      },
      {
        label: this.translateService.instant('COMMON.SETTINGS'),
        icon: 'pi pi-cog',
        command: () => {
          // Navigate to settings
          console.log('Navigate to settings');
        },
      },
      {
        separator: true,
      },
      {
        label: this.translateService.instant('COMMON.LOGOUT'),
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        },
      },
    ];
  }

  updateMenuItems() {
    // Get menu items from config
    this.menuItems = getTranslatedMenuItems(this.translateService);

    // Add language commands and update icons
    this.addLanguageCommands();
    this.updateLanguageIcons();
  }

  // Add commands to language menu items
  private addLanguageCommands() {
    const languageMenu = this.findLanguageMenu();
    if (languageMenu && languageMenu.items) {
      languageMenu.items.forEach((langItem) => {
        if (langItem.id) {
          langItem.command = (event: any) => {
            this.changeLanguage(langItem.id as Language);
          };
        }
      });
    }
  }

  // Find the language menu item
  private findLanguageMenu(): MenuItem | undefined {
    return this.menuItems.find(
      (item) => item.label === this.translateService.instant('COMMON.LANGUAGE')
    );
  }

  // Update language menu icons (check mark for selected language)
  private updateLanguageIcons() {
    const languageMenu = this.findLanguageMenu();
    if (languageMenu && languageMenu.items) {
      languageMenu.items.forEach((item) => {
        if (item.id) {
          item.icon =
            item.id === this.currentLanguage ? 'pi pi-check' : undefined;
        }
      });
    }
  }

  // Change the application language
  changeLanguage(lang: Language) {
    if (lang !== this.currentLanguage) {
      this.languageService.changeLanguage(lang).subscribe(
        () => {
          // The currentLanguage will be updated via the subscription to currentLanguage$
          // No need to set it here as it will trigger a duplicate update
          this.cdRef.detectChanges();
        },
        (error) => {
          console.error('Error changing language:', error);
        }
      );
    }
  }

  handleItemClick(event: MouseEvent, item: MenuItem) {
    // First close the mobile menu
    this.mobileMenuVisible = false;

    // If the item has a command, invoke it with an object that matches MenuItemCommandEvent
    if (item.command) {
      // Create a mock MenuItemCommandEvent with the original item
      const commandEvent = {
        originalEvent: event,
        item: item,
      };

      // Execute the command
      item.command(commandEvent);
    }
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleMobileMenu() {
    this.mobileMenuVisible = !this.mobileMenuVisible;
  }

  logout() {
    this.authService.logout().subscribe();
    this.mobileMenuVisible = false;
  }
}
