import { Theme as MuiTheme, ThemeOptions as MuiThemeOptions } from '@mui/material';
import { Palette as MuiPallete, PaletteOptions as MuiPaletteOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
    interface TagsPalette {
        green: string;
        blue: string;
        cyan: string;
        pink: string;
        purple: string;
        yellow: string;
        orange: string;
        red: string;
    }
    interface TypeBackground {
        paper: string;
        default: string;
        neutral: string;
    }
}

declare module '@mui/material/styles/createTheme' {
    interface CustomShadows {
        z1?: string;
        z4?: string;
        z8?: string;
        z12?: string;
        z16?: string;
        z20?: string;
        z24?: string;
        //
        primary?: string;
        info?: string;
        secondary?: string;
        success?: string;
        warning?: string;
        error?: string;
        //
        card?: string;
        dialog?: string;
        dropdown?: string;
    }
    interface Theme extends MuiTheme {
        customShadows: CustomShadows;
    }

    interface ThemeOptions extends MuiThemeOptions {
        customShadows?: CustomShadows;
    }
}
