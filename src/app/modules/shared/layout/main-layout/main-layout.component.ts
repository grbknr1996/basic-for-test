import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: false,
})
export class MainLayoutComponent implements OnInit {
  sidebarVisible = false;
  currentYear = new Date().getFullYear();

  constructor() {}

  ngOnInit() {}

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
