// src/app/types/configuration.types.ts
export interface ColorPalette {
  [key: string]: string;
}

export interface ColorConfig {
  name: string;
  palette: ColorPalette;
}

export interface SemanticColorScheme {
  primary: {
    color: string;
    contrastColor: string;
    hoverColor: string;
    activeColor: string;
  };
  highlight: {
    background: string;
    focusBackground: string;
    color: string;
    focusColor: string;
  };
}

export interface ColorSchemeConfig {
  primary: ColorConfig;
  surface: ColorConfig;
  semantic: {
    light: SemanticColorScheme;
    dark: SemanticColorScheme;
  };
}

export interface ThemeConfig {
  preset: string;
  colorScheme: ColorSchemeConfig;
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeights: {
      light: number;
      regular: number;
      medium: number;
      semiBold: number;
      bold: number;
    };
  };
  darkTheme: boolean;
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface OfficeInfo {
  fullName: string;
  shortName: string;
  logoPath: string;
  mainColor: string;
}

export interface InstanceConfig {
  module: { [key: string]: boolean };
  order: string[];
  availableLangs: string[];
  defaultLanguage: string;
  defaultLandingModule: string;
  officeInfo: OfficeInfo;
  theme: ThemeConfig;
}

export interface Environment {
  production: boolean;
  installedInstances: string[];
  env: string;
  appUrl: string;
  backendUrl: string;
}

export interface ConfigurationMap {
  [key: string]: InstanceConfig;
}
