import PropTypes from 'prop-types';
import { CSSProperties, forwardRef, ReactNode } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { StyledLabel } from './styles';

interface LabelProps {
    children: ReactNode;
    color?: 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
    variant?: 'filled' | 'outlined' | 'ghost' | 'soft';
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    sx?: CSSProperties;
}

const Label = forwardRef(
    ({ children, color = 'default', variant = 'soft', startIcon, endIcon, sx, ...other }: LabelProps, ref) => {
        const theme = useTheme();

        const iconStyle = {
            width: 16,
            height: 16,
            '& svg, img': { width: 1, height: 1, objectFit: 'cover' },
        };

        return (
            <StyledLabel
                ref={ref}
                component='span'
                ownerState={{ color, variant }}
                sx={{
                    ...(startIcon && { pl: 0.75 }),
                    ...(endIcon && { pr: 0.75 }),
                    ...sx,
                }}
                theme={theme}
                {...other}>
                {startIcon && <Box sx={{ mr: 0.75, ...iconStyle }}> {startIcon} </Box>}

                {children}

                {endIcon && <Box sx={{ ml: 0.75, ...iconStyle }}> {endIcon} </Box>}
            </StyledLabel>
        );
    }
);

export default Label;
