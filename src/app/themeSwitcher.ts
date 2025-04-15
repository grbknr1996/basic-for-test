import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Component,
  computed,
  effect,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { $t, updatePreset, updateSurfacePalette } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import Material from '@primeng/themes/material';
import Nora from '@primeng/themes/nora';
import { PrimeNG } from 'primeng/config';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StyleClassModule } from 'primeng/styleclass';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';

const presets = {
  Aura,
  Material,
  Lara,
  Nora,
};

export interface ThemeState {
  preset?: string;
  primary?: string;
  surface?: string;
  darkTheme?: boolean;
}

// Add these interfaces to fix type issues
interface ColorPalette {
  [key: string]: string;
}

interface Color {
  name: string;
  palette: ColorPalette;
}

@Component({
  selector: 'theme-switcher',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StyleClassModule,
    SelectButtonModule,
    ToggleSwitchModule,
    DialogModule,
    ButtonModule,
    RippleModule,
    InputSwitchModule,
    TooltipModule,
    TabViewModule,
    DividerModule,
  ],
  template: `
    <div class="card flex justify-end p-2 mb-4">
      <div class="flex gap-2 items-center">
        <!-- Theme Toggle Button -->
        <button
          pButton
          type="button"
          class="p-button-rounded p-button-text"
          [pTooltip]="
            themeState().darkTheme
              ? 'Switch to Light Mode'
              : 'Switch to Dark Mode'
          "
          tooltipPosition="bottom"
          (click)="onThemeToggler()"
        >
          <i [ngClass]="'pi ' + iconClass()" [class.text-primary]="true"></i>
        </button>

        <!-- Settings Button -->
        <button
          pButton
          type="button"
          class="p-button-rounded p-button-text"
          pTooltip="Theme Settings"
          tooltipPosition="bottom"
          (click)="openThemeModal()"
        >
          <i class="pi pi-palette"></i>
        </button>
      </div>
    </div>

    <!-- Theme Settings Modal -->
    <p-dialog
      [(visible)]="displayModal"
      [modal]="true"
      [resizable]="false"
      [draggable]="false"
      header="Theme Settings"
      [style]="{ width: '95%', maxWidth: '550px' }"
      [breakpoints]="{ '960px': '75vw', '640px': '90vw' }"
      [closeOnEscape]="true"
      styleClass="theme-settings-modal"
      (onHide)="onModalHide()"
    >
      <p-tabView>
        <!-- Colors Tab -->
        <p-tabPanel header="Colors">
          <!-- Primary Color Selection -->
          <div class="mb-4">
            <h3 class="text-lg font-medium mb-3">Primary Color</h3>
            <div class="flex flex-wrap gap-2">
              @for (primaryColor of primaryColors(); track primaryColor.name) {
              <div
                class="color-option"
                [class.selected]="selectedPrimaryColor() === primaryColor.name"
              >
                <button
                  type="button"
                  [title]="primaryColor.name | titlecase"
                  (click)="updateColors($event, 'primary', primaryColor)"
                  class="color-button flex items-center justify-center cursor-pointer border-2 border-solid border-gray-300 p-0 rounded-lg h-8 w-16"
                  [ngStyle]="{
                    'background-color':
                      primaryColor.name === 'noir'
                        ? 'var(--text-color)'
                        : getPrimaryColorDisplay(primaryColor),
                    'border-color':
                      selectedPrimaryColor() === primaryColor.name
                        ? 'var(--primary-color)'
                        : 'var(--surface-border)'
                  }"
                >
                  @if (selectedPrimaryColor() === primaryColor.name) {
                  <i
                    class="pi pi-check"
                    [ngStyle]="{
                      color:
                        primaryColor.name === 'noir' ||
                        isLightColor(getPrimaryColorDisplay(primaryColor))
                          ? 'var(--surface-900)'
                          : 'white'
                    }"
                  ></i>
                  }
                </button>
                <span class="text-xs mt-1 text-center block">{{
                  primaryColor.name | titlecase
                }}</span>
              </div>
              }
            </div>
          </div>

          <p-divider></p-divider>

          <!-- Surface Color Selection -->
          <div class="mt-4">
            <h3 class="text-lg font-medium mb-3">Surface Color</h3>
            <div class="flex flex-wrap gap-2">
              @for (surface of surfaces; track surface.name) {
              <div
                class="color-option"
                [class.selected]="selectedSurfaceColor() === surface.name"
              >
                <button
                  type="button"
                  [title]="surface.name | titlecase"
                  (click)="updateColors($event, 'surface', surface)"
                  class="color-button flex items-center justify-center cursor-pointer border-2 border-solid border-gray-300 p-0 rounded-lg h-8 w-16"
                  [ngStyle]="{
                    'background-color': getNormalizedColor(surface, '500'),
                    'border-color':
                      selectedSurfaceColor() === surface.name
                        ? 'var(--primary-color)'
                        : 'var(--surface-border)'
                  }"
                >
                  @if (selectedSurfaceColor() === surface.name) {
                  <i
                    class="pi pi-check"
                    [ngStyle]="{
                      color: isLightColor(getNormalizedColor(surface, '500'))
                        ? 'var(--surface-900)'
                        : 'white'
                    }"
                  ></i>
                  }
                </button>
                <span class="text-xs mt-1 text-center block">{{
                  surface.name | titlecase
                }}</span>
              </div>
              }
            </div>
          </div>
        </p-tabPanel>

        <!-- Presets Tab -->
        <p-tabPanel header="Presets">
          <div class="mb-4">
            <h3 class="text-lg font-medium mb-3">Design System</h3>
            <p-selectButton
              [options]="presetOptions"
              [(ngModel)]="selectedPresetValue"
              (onChange)="onPresetChange($event.value)"
              [unselectable]="false"
              styleClass="w-full mb-4"
              optionLabel="label"
              optionValue="value"
            ></p-selectButton>

            <div class="mb-4 mt-5">
              <p-divider></p-divider>
            </div>

            <!-- Dark Mode Toggle -->
            <div class="flex items-center justify-between py-2">
              <span class="text-md font-medium">Dark Mode</span>
              <p-inputSwitch
                [(ngModel)]="darkMode"
                (onChange)="onDarkModeChange($event)"
              ></p-inputSwitch>
            </div>

            <!-- Ripple Effect Toggle -->
            <div class="flex items-center justify-between py-2">
              <span class="text-md font-medium">Ripple Effect</span>
              <p-inputSwitch [(ngModel)]="ripple"></p-inputSwitch>
            </div>
          </div>
        </p-tabPanel>
      </p-tabView>

      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-2">
          <button
            pButton
            pRipple
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            (click)="closeThemeModal()"
          ></button>
          <button
            pButton
            pRipple
            label="Apply"
            icon="pi pi-check"
            class="p-button-primary"
            (click)="applyAndCloseModal()"
          ></button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [
    `
      :host ::ng-deep .theme-settings-modal {
        .p-dialog-header {
          padding: 1.5rem 1.5rem 0.5rem 1.5rem;
        }

        .p-dialog-footer {
          padding: 0 1.5rem 1.5rem 1.5rem;
        }

        .p-dialog-content {
          padding: 0 1.5rem 1rem 1.5rem;
        }

        .p-tabview-nav {
          justify-content: center;
        }

        .color-button:hover {
          transform: scale(1.05);
          transition: transform 0.2s;
        }

        .color-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .color-option.selected .color-button {
          box-shadow: 0 0 0 2px var(--primary-color);
        }
      }
    `,
  ],
})
export class ThemeSwitcher {
  private readonly STORAGE_KEY = 'themeSwitcherState';

  document = inject(DOCUMENT);
  platformId = inject(PLATFORM_ID);
  config: PrimeNG = inject(PrimeNG);

  // UI state
  displayModal = false;
  darkMode = false;
  selectedPresetValue = 'Aura';
  tempThemeState = signal<ThemeState>({});

  // Computed properties
  iconClass = computed(() =>
    this.themeState().darkTheme ? 'pi-sun' : 'pi-moon'
  );

  presetOptions = [
    { label: 'Aura', value: 'Aura' },
    { label: 'Material', value: 'Material' },
    { label: 'Lara', value: 'Lara' },
    { label: 'Nora', value: 'Nora' },
  ];

  themeState = signal<ThemeState>({});
  theme = computed(() => (this.themeState()?.darkTheme ? 'dark' : 'light'));
  selectedPreset = computed(() => this.themeState().preset);
  selectedSurfaceColor = computed(() => this.themeState().surface);
  selectedPrimaryColor = computed(() => this.themeState().primary);
  transitionComplete = signal<boolean>(false);

  primaryColors = computed(() => {
    const preset = this.themeState()?.preset;
    const presetPalette = preset ? (presets as any)[preset]?.primitive : {};
    const colors = [
      'emerald',
      'green',
      'lime',
      'orange',
      'amber',
      'yellow',
      'teal',
      'cyan',
      'sky',
      'blue',
      'indigo',
      'violet',
      'purple',
      'fuchsia',
      'pink',
      'rose',
    ];
    const palettes: Color[] = [{ name: 'noir', palette: {} }];

    colors.forEach((color) => {
      palettes.push({
        name: color,
        palette: presetPalette[color] as ColorPalette,
      });
    });

    return palettes;
  });

  surfaces: Color[] = [
    {
      name: 'slate',
      palette: {
        '0': '#ffffff',
        '50': '#f8fafc',
        '100': '#f1f5f9',
        '200': '#e2e8f0',
        '300': '#cbd5e1',
        '400': '#94a3b8',
        '500': '#64748b',
        '600': '#475569',
        '700': '#334155',
        '800': '#1e293b',
        '900': '#0f172a',
        '950': '#020617',
      },
    },
    {
      name: 'gray',
      palette: {
        '0': '#ffffff',
        '50': '#f9fafb',
        '100': '#f3f4f6',
        '200': '#e5e7eb',
        '300': '#d1d5db',
        '400': '#9ca3af',
        '500': '#6b7280',
        '600': '#4b5563',
        '700': '#374151',
        '800': '#1f2937',
        '900': '#111827',
        '950': '#030712',
      },
    },
    {
      name: 'zinc',
      palette: {
        '0': '#ffffff',
        '50': '#fafafa',
        '100': '#f4f4f5',
        '200': '#e4e4e7',
        '300': '#d4d4d8',
        '400': '#a1a1aa',
        '500': '#71717a',
        '600': '#52525b',
        '700': '#3f3f46',
        '800': '#27272a',
        '900': '#18181b',
        '950': '#09090b',
      },
    },
    {
      name: 'neutral',
      palette: {
        '0': '#ffffff',
        '50': '#fafafa',
        '100': '#f5f5f5',
        '200': '#e5e5e5',
        '300': '#d4d4d4',
        '400': '#a3a3a3',
        '500': '#737373',
        '600': '#525252',
        '700': '#404040',
        '800': '#262626',
        '900': '#171717',
        '950': '#0a0a0a',
      },
    },
    {
      name: 'stone',
      palette: {
        '0': '#ffffff',
        '50': '#fafaf9',
        '100': '#f5f5f4',
        '200': '#e7e5e4',
        '300': '#d6d3d1',
        '400': '#a8a29e',
        '500': '#78716c',
        '600': '#57534e',
        '700': '#44403c',
        '800': '#292524',
        '900': '#1c1917',
        '950': '#0c0a09',
      },
    },
    {
      name: 'soho',
      palette: {
        '0': '#ffffff',
        '50': '#ececec',
        '100': '#dedfdf',
        '200': '#c4c4c6',
        '300': '#adaeb0',
        '400': '#97979b',
        '500': '#7f8084',
        '600': '#6a6b70',
        '700': '#55565b',
        '800': '#3f4046',
        '900': '#2c2c34',
        '950': '#16161d',
      },
    },
    {
      name: 'viva',
      palette: {
        '0': '#ffffff',
        '50': '#f3f3f3',
        '100': '#e7e7e8',
        '200': '#cfd0d0',
        '300': '#b7b8b9',
        '400': '#9fa1a1',
        '500': '#87898a',
        '600': '#6e7173',
        '700': '#565a5b',
        '800': '#3e4244',
        '900': '#262b2c',
        '950': '#0e1315',
      },
    },
    {
      name: 'ocean',
      palette: {
        '0': '#ffffff',
        '50': '#fbfcfc',
        '100': '#F7F9F8',
        '200': '#EFF3F2',
        '300': '#DADEDD',
        '400': '#B1B7B6',
        '500': '#828787',
        '600': '#5F7274',
        '700': '#415B61',
        '800': '#29444E',
        '900': '#183240',
        '950': '#0c1920',
      },
    },
  ];

  constructor() {
    this.themeState.set({ ...this.loadthemeState() });
    this.darkMode = !!this.themeState().darkTheme;
    this.selectedPresetValue = this.themeState().preset || 'Aura';

    // Make a copy of the current state for temp edits in the modal
    this.tempThemeState.set({ ...this.themeState() });

    effect(() => {
      const state = this.themeState();
      this.savethemeState(state);
      this.handleDarkModeTransition(state);
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.onPresetChange(this.themeState().preset ?? 'Aura');
    }
  }

  // Helper method to determine if a color is light or dark for contrast
  isLightColor(colorHex: string): boolean {
    // Convert hex to RGB
    const r = parseInt(colorHex.slice(1, 3), 16);
    const g = parseInt(colorHex.slice(3, 5), 16);
    const b = parseInt(colorHex.slice(5, 7), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5;
  }

  // Helper method to safely access color values
  getNormalizedColor(color: Color, shade: string): string {
    return color.palette[shade] || '';
  }

  get ripple() {
    return this.config.ripple();
  }

  set ripple(value: boolean) {
    this.config.ripple.set(value);
  }

  // Modal handling
  openThemeModal() {
    // Update temp state with current state
    this.tempThemeState.set({ ...this.themeState() });
    this.darkMode = !!this.themeState().darkTheme;
    this.selectedPresetValue = this.themeState().preset || 'Aura';
    this.displayModal = true;
  }

  closeThemeModal() {
    this.displayModal = false;
  }

  // Handle modal close/hide - revert any preview changes
  onModalHide() {
    // If we closed without applying, revert to the actual state
    const currentState = this.themeState();

    // Apply the current actual state
    const presetObj = (presets as any)[currentState.preset ?? 'Aura'];
    const primaryColor = this.primaryColors().find(
      (c) => c.name === currentState.primary
    );
    const surfacePalette = this.surfaces.find(
      (s) => s.name === currentState.surface
    )?.palette;

    // Material specific handling
    if (currentState.preset === 'Material') {
      document.body.classList.add('material');
    } else {
      document.body.classList.remove('material');
    }

    // Reapply the current theme
    try {
      $t()
        .preset(presetObj)
        .preset(this.getPresetExtForCurrentState())
        .surfacePalette(surfacePalette)
        .use({ useDefaultOptions: true });
    } catch (error) {
      console.error('Error reverting theme changes:', error);
    }
  }

  // Special version for the current state
  getPresetExtForCurrentState() {
    const color = this.primaryColors().find(
      (c) => c.name === this.themeState().primary
    );

    // Same logic as getPresetExt() but using themeState instead of tempThemeState
    if (color?.name === 'noir') {
      return {
        semantic: {
          primary: {
            '50': '{surface.50}',
            '100': '{surface.100}',
            '200': '{surface.200}',
            '300': '{surface.300}',
            '400': '{surface.400}',
            '500': '{surface.500}',
            '600': '{surface.600}',
            '700': '{surface.700}',
            '800': '{surface.800}',
            '900': '{surface.900}',
            '950': '{surface.950}',
          },
          colorScheme: {
            light: {
              primary: {
                color: '{primary.950}',
                contrastColor: '#ffffff',
                hoverColor: '{primary.800}',
                activeColor: '{primary.700}',
              },
              highlight: {
                background: '{primary.950}',
                focusBackground: '{primary.700}',
                color: '#ffffff',
                focusColor: '#ffffff',
              },
            },
            dark: {
              primary: {
                color: '{primary.50}',
                contrastColor: '{primary.950}',
                hoverColor: '{primary.200}',
                activeColor: '{primary.300}',
              },
              highlight: {
                background: '{primary.50}',
                focusBackground: '{primary.300}',
                color: '{primary.950}',
                focusColor: '{primary.950}',
              },
            },
          },
        },
      };
    } else {
      // Rest of the preset logic is the same as getPresetExt but using themeState
      if (this.themeState().preset === 'Nora') {
        return {
          semantic: {
            primary: color?.palette,
            colorScheme: {
              light: {
                primary: {
                  color: '{primary.600}',
                  contrastColor: '#ffffff',
                  hoverColor: '{primary.700}',
                  activeColor: '{primary.800}',
                },
                highlight: {
                  background: '{primary.600}',
                  focusBackground: '{primary.700}',
                  color: '#ffffff',
                  focusColor: '#ffffff',
                },
              },
              dark: {
                primary: {
                  color: '{primary.500}',
                  contrastColor: '{surface.900}',
                  hoverColor: '{primary.400}',
                  activeColor: '{primary.300}',
                },
                highlight: {
                  background: '{primary.500}',
                  focusBackground: '{primary.400}',
                  color: '{surface.900}',
                  focusColor: '{surface.900}',
                },
              },
            },
          },
        };
      } else if (this.themeState().preset === 'Material') {
        return {
          semantic: {
            primary: color?.palette,
            colorScheme: {
              light: {
                primary: {
                  color: '{primary.500}',
                  contrastColor: '#ffffff',
                  hoverColor: '{primary.400}',
                  activeColor: '{primary.300}',
                },
                highlight: {
                  background:
                    'color-mix(in srgb, {primary.color}, transparent 88%)',
                  focusBackground:
                    'color-mix(in srgb, {primary.color}, transparent 76%)',
                  color: '{primary.700}',
                  focusColor: '{primary.800}',
                },
              },
              dark: {
                primary: {
                  color: '{primary.400}',
                  contrastColor: '{surface.900}',
                  hoverColor: '{primary.300}',
                  activeColor: '{primary.200}',
                },
                highlight: {
                  background:
                    'color-mix(in srgb, {primary.400}, transparent 84%)',
                  focusBackground:
                    'color-mix(in srgb, {primary.400}, transparent 76%)',
                  color: 'rgba(255,255,255,.87)',
                  focusColor: 'rgba(255,255,255,.87)',
                },
              },
            },
          },
        };
      } else {
        return {
          semantic: {
            primary: color?.palette,
            colorScheme: {
              light: {
                primary: {
                  color: '{primary.500}',
                  contrastColor: '#ffffff',
                  hoverColor: '{primary.600}',
                  activeColor: '{primary.700}',
                },
                highlight: {
                  background: '{primary.50}',
                  focusBackground: '{primary.100}',
                  color: '{primary.700}',
                  focusColor: '{primary.800}',
                },
              },
              dark: {
                primary: {
                  color: '{primary.400}',
                  contrastColor: '{surface.900}',
                  hoverColor: '{primary.300}',
                  activeColor: '{primary.200}',
                },
                highlight: {
                  background:
                    'color-mix(in srgb, {primary.400}, transparent 84%)',
                  focusBackground:
                    'color-mix(in srgb, {primary.400}, transparent 76%)',
                  color: 'rgba(255,255,255,.87)',
                  focusColor: 'rgba(255,255,255,.87)',
                },
              },
            },
          },
        };
      }
    }
  }

  applyAndCloseModal() {
    // Apply temp settings to actual state
    const newState = { ...this.tempThemeState() };
    this.themeState.set(newState);

    // Apply all theme settings
    const presetObj = (presets as any)[newState.preset ?? 'Aura'];
    const primaryColor = this.primaryColors().find(
      (c) => c.name === newState.primary
    );
    const surfacePalette = this.surfaces.find(
      (s) => s.name === newState.surface
    )?.palette;

    // Apply preset
    if (presetObj) {
      $t().preset(presetObj);
    }

    // Apply primary color
    if (primaryColor) {
      updatePreset(this.getPresetExt());
    }

    // Apply surface color
    if (surfacePalette) {
      updateSurfacePalette(surfacePalette);
    }

    // Apply material class if needed
    if (newState.preset === 'Material') {
      document.body.classList.add('material');
      this.ripple = true;
    } else {
      document.body.classList.remove('material');
      this.ripple = newState.preset === 'Material';
    }

    // Use PrimeNG themes API to apply all changes
    $t().use({ useDefaultOptions: true });

    this.displayModal = false;
  }

  onDarkModeChange(event: any) {
    this.tempThemeState.update((state) => ({
      ...state,
      darkTheme: event.checked,
    }));
  }

  onThemeToggler() {
    this.themeState.update((state) => ({
      ...state,
      darkTheme: !state.darkTheme,
    }));
  }

  // Helper method to get primary color for display
  getPrimaryColorDisplay(color: Color): string {
    if (!color || !color.palette) {
      return '#cccccc'; // Fallback color
    }

    // Get color from the palette or use a fallback
    return (
      color.palette['500'] ||
      color.palette['400'] ||
      color.palette['600'] ||
      '#cccccc'
    );
  }

  updateColors(event: any, type: string, color: Color) {
    if (type === 'primary') {
      this.tempThemeState.update((state) => ({
        ...state,
        primary: color.name,
      }));
      // For immediate visual feedback in the modal
      this.applyThemePreview(type, color);
    } else if (type === 'surface') {
      this.tempThemeState.update((state) => ({
        ...state,
        surface: color.name,
      }));
      // For immediate visual feedback in the modal
      this.applyThemePreview(type, color);
    }

    event.stopPropagation();
  }

  // Apply theme changes for preview only (doesn't affect actual state)
  applyThemePreview(type: string, color: Color) {
    if (type === 'primary') {
      const presetExt = this.getPresetExt();
      if (presetExt) {
        updatePreset(presetExt);
      }
    } else if (type === 'surface') {
      if (color && color.palette) {
        updateSurfacePalette(color.palette);
      }
    }
  }

  getPresetExt() {
    const color = this.primaryColors().find(
      (c) => c.name === this.tempThemeState().primary
    );

    if (color?.name === 'noir') {
      return {
        semantic: {
          primary: {
            '50': '{surface.50}',
            '100': '{surface.100}',
            '200': '{surface.200}',
            '300': '{surface.300}',
            '400': '{surface.400}',
            '500': '{surface.500}',
            '600': '{surface.600}',
            '700': '{surface.700}',
            '800': '{surface.800}',
            '900': '{surface.900}',
            '950': '{surface.950}',
          },
          colorScheme: {
            light: {
              primary: {
                color: '{primary.950}',
                contrastColor: '#ffffff',
                hoverColor: '{primary.800}',
                activeColor: '{primary.700}',
              },
              highlight: {
                background: '{primary.950}',
                focusBackground: '{primary.700}',
                color: '#ffffff',
                focusColor: '#ffffff',
              },
            },
            dark: {
              primary: {
                color: '{primary.50}',
                contrastColor: '{primary.950}',
                hoverColor: '{primary.200}',
                activeColor: '{primary.300}',
              },
              highlight: {
                background: '{primary.50}',
                focusBackground: '{primary.300}',
                color: '{primary.950}',
                focusColor: '{primary.950}',
              },
            },
          },
        },
      };
    } else {
      if (this.tempThemeState().preset === 'Nora') {
        return {
          semantic: {
            primary: color?.palette,
            colorScheme: {
              light: {
                primary: {
                  color: '{primary.600}',
                  contrastColor: '#ffffff',
                  hoverColor: '{primary.700}',
                  activeColor: '{primary.800}',
                },
                highlight: {
                  background: '{primary.600}',
                  focusBackground: '{primary.700}',
                  color: '#ffffff',
                  focusColor: '#ffffff',
                },
              },
              dark: {
                primary: {
                  color: '{primary.500}',
                  contrastColor: '{surface.900}',
                  hoverColor: '{primary.400}',
                  activeColor: '{primary.300}',
                },
                highlight: {
                  background: '{primary.500}',
                  focusBackground: '{primary.400}',
                  color: '{surface.900}',
                  focusColor: '{surface.900}',
                },
              },
            },
          },
        };
      } else if (this.tempThemeState().preset === 'Material') {
        return {
          semantic: {
            primary: color?.palette,
            colorScheme: {
              light: {
                primary: {
                  color: '{primary.500}',
                  contrastColor: '#ffffff',
                  hoverColor: '{primary.400}',
                  activeColor: '{primary.300}',
                },
                highlight: {
                  background:
                    'color-mix(in srgb, {primary.color}, transparent 88%)',
                  focusBackground:
                    'color-mix(in srgb, {primary.color}, transparent 76%)',
                  color: '{primary.700}',
                  focusColor: '{primary.800}',
                },
              },
              dark: {
                primary: {
                  color: '{primary.400}',
                  contrastColor: '{surface.900}',
                  hoverColor: '{primary.300}',
                  activeColor: '{primary.200}',
                },
                highlight: {
                  background:
                    'color-mix(in srgb, {primary.400}, transparent 84%)',
                  focusBackground:
                    'color-mix(in srgb, {primary.400}, transparent 76%)',
                  color: 'rgba(255,255,255,.87)',
                  focusColor: 'rgba(255,255,255,.87)',
                },
              },
            },
          },
        };
      } else {
        return {
          semantic: {
            primary: color?.palette,
            colorScheme: {
              light: {
                primary: {
                  color: '{primary.500}',
                  contrastColor: '#ffffff',
                  hoverColor: '{primary.600}',
                  activeColor: '{primary.700}',
                },
                highlight: {
                  background: '{primary.50}',
                  focusBackground: '{primary.100}',
                  color: '{primary.700}',
                  focusColor: '{primary.800}',
                },
              },
              dark: {
                primary: {
                  color: '{primary.400}',
                  contrastColor: '{surface.900}',
                  hoverColor: '{primary.300}',
                  activeColor: '{primary.200}',
                },
                highlight: {
                  background:
                    'color-mix(in srgb, {primary.400}, transparent 84%)',
                  focusBackground:
                    'color-mix(in srgb, {primary.400}, transparent 76%)',
                  color: 'rgba(255,255,255,.87)',
                  focusColor: 'rgba(255,255,255,.87)',
                },
              },
            },
          },
        };
      }
    }
  }

  applyTheme(type: string, color: Color) {
    if (type === 'primary') {
      updatePreset(this.getPresetExt());
    } else if (type === 'surface') {
      updateSurfacePalette(color.palette);
    }
  }

  onPresetChange(preset: string) {
    if (!preset) return;

    this.tempThemeState.update((state) => ({ ...state, preset }));

    // Apply immediately for preview only
    const presetObj = (presets as any)[preset];
    const surfacePalette = this.surfaces.find(
      (s) => s.name === this.tempThemeState().surface
    )?.palette;

    // Just add/remove material class for preview
    if (preset === 'Material') {
      document.body.classList.add('material');
    } else {
      document.body.classList.remove('material');
    }

    // Apply theme changes for preview
    try {
      $t()
        .preset(presetObj)
        .preset(this.getPresetExt())
        .surfacePalette(surfacePalette)
        .use({ useDefaultOptions: true });
    } catch (error) {
      console.error('Error applying preset preview:', error);
    }
  }

  startViewTransition(state: ThemeState): void {
    const transition = (document as any).startViewTransition(() => {
      this.toggleDarkMode(state);
    });

    transition.ready.then(() => this.onTransitionEnd());
  }

  toggleDarkMode(state: ThemeState): void {
    if (state.darkTheme) {
      this.document.documentElement.classList.add('p-dark');
    } else {
      this.document.documentElement.classList.remove('p-dark');
    }
  }

  onTransitionEnd() {
    this.transitionComplete.set(true);
    setTimeout(() => {
      this.transitionComplete.set(false);
    });
  }

  handleDarkModeTransition(state: ThemeState): void {
    if (isPlatformBrowser(this.platformId)) {
      if ((document as any).startViewTransition) {
        this.startViewTransition(state);
      } else {
        this.toggleDarkMode(state);
        this.onTransitionEnd();
      }
    }
  }

  loadthemeState(): any {
    if (isPlatformBrowser(this.platformId)) {
      const storedState = localStorage.getItem(this.STORAGE_KEY);
      if (storedState) {
        return JSON.parse(storedState);
      }
    }
    return {
      preset: 'Aura',
      primary: 'noir',
      surface: 'slate',
      darkTheme: false,
    };
  }

  savethemeState(state: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    }
  }
}
