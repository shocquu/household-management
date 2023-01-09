import { ReactNode, useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import palette from './palette';
import shadows from './shadows';
import typography from './typography';
import GlobalStyles from './globalStyles';
import customShadows from './customShadows';
import componentsOverride from './overrides';

interface ThemeProviderProps {
    children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
    const themeOptions = useMemo(
        () => ({
            palette,
            shape: { borderRadius: 6 },
            typography,
            shadows: shadows(),
            customShadows: customShadows(),
        }),
        []
    );

    const theme = createTheme(themeOptions);
    theme.components = componentsOverride(theme);

    return (
        <StyledEngineProvider injectFirst>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles />
                {children}
            </MUIThemeProvider>
        </StyledEngineProvider>
    );
}
