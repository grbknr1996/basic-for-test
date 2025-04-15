import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SidebarMenuItem, sidebarMenuItems } from '../../config/menu-config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
})
export class SidebarComponent implements OnInit {
  @Input() visible = false;

  menuItems = sidebarMenuItems;

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialize all items as collapsed
    this.menuItems.forEach((item) => {
      if (this.hasSubItems(item)) {
        item.expanded = false;
      }
    });

    // Listen to route changes to auto-expand parent of active route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkActiveRoute(event.url);
      }
    });

    // Check current route on init
    this.checkActiveRoute(this.router.url);
  }

  checkActiveRoute(url: string) {
    this.menuItems.forEach((item) => {
      if (this.hasSubItems(item)) {
        // Check if any child route is active
        const isActiveParent = item.items?.some(
          (subItem) =>
            subItem.routerLink &&
            this.router.isActive(subItem.routerLink.join('/'), false)
        );

        // Expand the parent if a child is active
        if (isActiveParent) {
          item.expanded = true;
        }
      }
    });
  }

  toggleSubmenu(item: SidebarMenuItem) {
    item.expanded = !item.expanded;
  }

  hasSubItems(item: SidebarMenuItem): boolean {
    return (item.items && item.items.length > 0) ?? false;
  }
}
