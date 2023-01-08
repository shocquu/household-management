import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Icon } from '@iconify/react';
import { Box } from '@mui/material';

interface IconifyProps {
    icon: string;
    color?: string;
    width?: number;
    height?: number;
    sx?: any;
}

const Iconify = forwardRef(({ icon, width = 20, sx, ...other }: IconifyProps, ref) => (
    <Box ref={ref} component={Icon} icon={icon} sx={{ width, height: width, ...sx }} {...other} />
));

export default Iconify;
