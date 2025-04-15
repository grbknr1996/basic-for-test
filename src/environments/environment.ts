// src/environments/environment.ts
import {
  Environment,
  ConfigurationMap,
} from "../app/types/configuration.types";

export const environment: Environment = {
  production: false,
  installedInstances: ["asean", "botswana", "bhutan", "ipas"],
  env: "awsAcc",
  appUrl: "http://localhost:4200",
  backendUrl: "http://localhost:3005",
};

export const configuration: ConfigurationMap = {
  default: {
    module: {
      edms: true,
      patents: true,
      designs: true,
      trademarks: true,
      datacoverage: true,
      gidatabase: true,
      portfolios: true,
    },
    order: ["patents", "designs", "trademarks", "gidatabase", "portfolios"],
    availableLangs: ["en", "fr", "es"],
    defaultLanguage: "en",
    defaultLandingModule: "dashboard",
    officeInfo: {
      fullName: "WIPO IP Portal",
      shortName: "WIPO",
      logoPath: "assets/images/logos/default-logo.png",
      mainColor: "#0067c0",
    },
    theme: {
      preset: "Aura",
      colorScheme: {
        primary: {
          name: "blue",
          palette: {
            "50": "#eff6ff",
            "100": "#dbeafe",
            "200": "#bfdbfe",
            "300": "#93c5fd",
            "400": "#60a5fa",
            "500": "#3b82f6",
            "600": "#2563eb",
            "700": "#1d4ed8",
            "800": "#1e40af",
            "900": "#1e3a8a",
            "950": "#172554",
          },
        },
        surface: {
          name: "slate",
          palette: {
            "0": "#ffffff",
            "50": "#f8fafc",
            "100": "#f1f5f9",
            "200": "#e2e8f0",
            "300": "#cbd5e1",
            "400": "#94a3b8",
            "500": "#64748b",
            "600": "#475569",
            "700": "#334155",
            "800": "#1e293b",
            "900": "#0f172a",
            "950": "#020617",
          },
        },
        semantic: {
          light: {
            primary: {
              color: "{primary.500}",
              contrastColor: "#ffffff",
              hoverColor: "{primary.600}",
              activeColor: "{primary.700}",
            },
            highlight: {
              background: "{primary.50}",
              focusBackground: "{primary.100}",
              color: "{primary.700}",
              focusColor: "{primary.800}",
            },
          },
          dark: {
            primary: {
              color: "{primary.400}",
              contrastColor: "{surface.900}",
              hoverColor: "{primary.300}",
              activeColor: "{primary.200}",
            },
            highlight: {
              background: "color-mix(in srgb, {primary.400}, transparent 84%)",
              focusBackground:
                "color-mix(in srgb, {primary.400}, transparent 76%)",
              color: "rgba(255,255,255,.87)",
              focusColor: "rgba(255,255,255,.87)",
            },
          },
        },
      },
      typography: {
        fontFamily: '"Montserrat", "Segoe UI", Roboto, Arial, sans-serif',
        fontSize: "14px",
        fontWeights: {
          light: 300,
          regular: 400,
          medium: 500,
          semiBold: 600,
          bold: 700,
        },
      },
      darkTheme: false,
      borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
    },
  },
  asean: {
    module: {
      edms: true,
      patents: true,
      designs: true,
      trademarks: true,
      datacoverage: true,
      gidatabase: true,
      portfolios: true,
    },
    order: ["patents", "designs", "trademarks", "gidatabase", "portfolios"],
    availableLangs: ["en", "fr", "id", "ms"],
    defaultLanguage: "en",
    defaultLandingModule: "dashboard",
    officeInfo: {
      fullName: "ASEAN IP Portal",
      shortName: "ASEAN",
      logoPath: "assets/images/logos/asean-logo.png",
      mainColor: "#78b96b",
    },
    theme: {
      preset: "Aura",
      colorScheme: {
        primary: {
          name: "green",
          palette: {
            "50": "#f0fdf4",
            "100": "#dcfce7",
            "200": "#bbf7d0",
            "300": "#86efac",
            "400": "#4ade80",
            "500": "#22c55e",
            "600": "#16a34a",
            "700": "#15803d",
            "800": "#166534",
            "900": "#14532d",
            "950": "#052e16",
          },
        },
        surface: {
          name: "slate",
          palette: {
            "0": "#ffffff",
            "50": "#f8fafc",
            "100": "#f1f5f9",
            "200": "#e2e8f0",
            "300": "#cbd5e1",
            "400": "#94a3b8",
            "500": "#64748b",
            "600": "#475569",
            "700": "#334155",
            "800": "#1e293b",
            "900": "#0f172a",
            "950": "#020617",
          },
        },
        semantic: {
          light: {
            primary: {
              color: "{primary.500}",
              contrastColor: "#ffffff",
              hoverColor: "{primary.600}",
              activeColor: "{primary.700}",
            },
            highlight: {
              background: "{primary.50}",
              focusBackground: "{primary.100}",
              color: "{primary.700}",
              focusColor: "{primary.800}",
            },
          },
          dark: {
            primary: {
              color: "{primary.400}",
              contrastColor: "{surface.900}",
              hoverColor: "{primary.300}",
              activeColor: "{primary.200}",
            },
            highlight: {
              background: "color-mix(in srgb, {primary.400}, transparent 84%)",
              focusBackground:
                "color-mix(in srgb, {primary.400}, transparent 76%)",
              color: "rgba(255,255,255,.87)",
              focusColor: "rgba(255,255,255,.87)",
            },
          },
        },
      },
      typography: {
        fontFamily: '"Montserrat", "Segoe UI", Roboto, Arial, sans-serif',
        fontSize: "14px",
        fontWeights: {
          light: 300,
          regular: 400,
          medium: 500,
          semiBold: 600,
          bold: 700,
        },
      },
      darkTheme: false,
      borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
    },
  },
  bhutan: {
    module: {
      edms: true,
      patents: true,
      designs: true,
      trademarks: true,
      datacoverage: false,
      gidatabase: false,
      portfolios: true,
    },
    order: ["patents", "designs", "trademarks", "portfolios"],
    availableLangs: ["en", "dz"],
    defaultLanguage: "en",
    defaultLandingModule: "dashboard",
    officeInfo: {
      fullName: "Bhutan Online Filing",
      shortName: "BHFI",
      logoPath: "assets/images/logos/bhutan-logo.png",
      mainColor: "#f472b6",
    },
    theme: {
      preset: "Material",
      colorScheme: {
        primary: {
          name: "pink",
          palette: {
            "50": "#fdf2f8",
            "100": "#fce7f3",
            "200": "#fbcfe8",
            "300": "#f9a8d4",
            "400": "#f472b6",
            "500": "#ec4899",
            "600": "#db2777",
            "700": "#be185d",
            "800": "#9d174d",
            "900": "#831843",
            "950": "#500724",
          },
        },
        surface: {
          name: "slate",
          palette: {
            "0": "#ffffff",
            "50": "#f8fafc",
            "100": "#f1f5f9",
            "200": "#e2e8f0",
            "300": "#cbd5e1",
            "400": "#94a3b8",
            "500": "#64748b",
            "600": "#475569",
            "700": "#334155",
            "800": "#1e293b",
            "900": "#0f172a",
            "950": "#020617",
          },
        },
        semantic: {
          light: {
            primary: {
              color: "{primary.500}",
              contrastColor: "#ffffff",
              hoverColor: "{primary.600}",
              activeColor: "{primary.700}",
            },
            highlight: {
              background: "{primary.50}",
              focusBackground: "{primary.100}",
              color: "{primary.700}",
              focusColor: "{primary.800}",
            },
          },
          dark: {
            primary: {
              color: "{primary.400}",
              contrastColor: "{surface.900}",
              hoverColor: "{primary.300}",
              activeColor: "{primary.200}",
            },
            highlight: {
              background: "color-mix(in srgb, {primary.400}, transparent 84%)",
              focusBackground:
                "color-mix(in srgb, {primary.400}, transparent 76%)",
              color: "rgba(255,255,255,.87)",
              focusColor: "rgba(255,255,255,.87)",
            },
          },
        },
      },
      typography: {
        fontFamily: '"Montserrat", "Segoe UI", Roboto, Arial, sans-serif',
        fontSize: "14px",
        fontWeights: {
          light: 300,
          regular: 400,
          medium: 500,
          semiBold: 600,
          bold: 700,
        },
      },
      darkTheme: false,
      borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
    },
  },
  // Add other office configurations similarly
};
