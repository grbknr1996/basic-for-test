import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

export function getTranslatedMenuItems(
  translateService: TranslateService
): MenuItem[] {
  return [
    {
      label: translateService.instant('COMMON.HOME'),
      icon: 'pi pi-home',
      routerLink: ['/'],
    },
    {
      label: translateService.instant('COMMON.LANGUAGE'),
      icon: 'pi pi-globe',
      items: [
        {
          label: translateService.instant('COMMON.ENGLISH'),
          id: 'en',
        },
        {
          label: translateService.instant('COMMON.FRENCH'),
          id: 'fr',
        },
        {
          label: translateService.instant('COMMON.SPANISH'),
          id: 'es',
        },
      ],
    },
    // ...rest of the items
  ];
}
export interface SidebarMenuItem {
  label: string;
  icon: string;
  routerLink?: string[];
  expanded?: boolean;
  items?: SidebarMenuItem[];
}

export const sidebarMenuItems: SidebarMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    routerLink: ['/dashboard'],
  },
  {
    label: 'Applications',
    icon: 'pi pi-file',
    expanded: false,
    items: [
      {
        label: 'New Application',
        icon: 'pi pi-plus',
        routerLink: ['/applications/new'],
      },
      {
        label: 'My Applications',
        icon: 'pi pi-list',
        routerLink: ['/applications/my'],
      },
      {
        label: 'Drafts',
        icon: 'pi pi-pencil',
        routerLink: ['/applications/drafts'],
      },
    ],
  },
  {
    label: 'Documents',
    icon: 'pi pi-folder',
    expanded: false,
    items: [
      {
        label: 'Upload Document',
        icon: 'pi pi-upload',
        routerLink: ['/documents/upload'],
      },
      {
        label: 'My Documents',
        icon: 'pi pi-file-o',
        routerLink: ['/documents/my'],
      },
    ],
  },
  {
    label: 'Payments',
    icon: 'pi pi-credit-card',
    routerLink: ['/payments'],
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    expanded: true,
    items: [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        routerLink: ['/settings/profile'],
      },
      {
        label: 'Preferences',
        icon: 'pi pi-sliders-h',
        routerLink: ['/settings/preferences'],
      },
      {
        label: 'Security',
        icon: 'pi pi-lock',
        routerLink: ['/settings/security'],
      },
    ],
  },
  {
    label: 'Help & Support',
    icon: 'pi pi-question-circle',
    routerLink: ['/help'],
  },
];
