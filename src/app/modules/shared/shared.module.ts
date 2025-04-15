// src/app/shared/shared.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG Components
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';

// Custom Components
import { NavbarComponent } from './layout/navbar/navbar.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { MegaMenuModule } from 'primeng/megamenu';
import { DragDropModule } from 'primeng/dragdrop';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';
import { SafeTranslatePipe } from './pipes/safe-translate.pipe';
import { UserStatsComponent } from './user-stats/user-stats.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TableComponent } from './table/table.component';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { IconFieldModule } from 'primeng/iconfield';

@NgModule({
  declarations: [
    NavbarComponent,
    MainLayoutComponent,
    SidebarComponent,
    UserStatsComponent,
    TableComponent,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    RouterModule,
    MenuModule,
    MegaMenuModule,
    FormsModule,
    MenubarModule,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    ToggleButtonModule,
    SidebarModule,
    TranslateModule,
    SafeTranslatePipe,
    TableModule,
    CommonModule,
    FormsModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    TagModule,
    AvatarModule,
    SliderModule,
    MultiSelectModule,
    IconFieldModule,
  ],
  exports: [
    NavbarComponent,
    MainLayoutComponent,
    SidebarComponent,
    SafeTranslatePipe,
    UserStatsComponent,
    TableComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [LanguageService, MessageService, ConfirmationService],
})
export class SharedModule {}
