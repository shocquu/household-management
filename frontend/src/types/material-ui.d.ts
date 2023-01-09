import { Palette as MuiPallete, PaletteOptions as MuiPaletteOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
    interface TypeBackground {
        paper: string;
        default: string;
        neutral: string;
    }
}
