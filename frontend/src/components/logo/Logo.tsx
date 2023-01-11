import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Link, SxProps } from '@mui/material';

interface LogoProps {
    disabledLink?: boolean;
    sx?: SxProps;
}

const Logo = forwardRef(({ disabledLink = false, sx, ...other }: LogoProps, ref) => {
    const theme = useTheme();

    const PRIMARY_LIGHT = theme.palette.primary.light;

    const PRIMARY_MAIN = theme.palette.primary.main;

    const PRIMARY_DARK = theme.palette.primary.dark;

    // OR using local (public folder)
    // -------------------------------------------------------
    // const logo = (
    //   <Box
    //     component="img"
    //     src="/logo/logo_single.svg" => your path
    //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    //   />
    // );

    const logo = (
        <Box
            ref={ref}
            component='div'
            sx={{
                // width: 40,
                // height: 40,
                display: 'inline-flex',
                ...sx,
            }}
            {...other}>
            <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 1000 262'
                style='enable-background:new 0 0 1000 262'
                xml:space='preserve'>
                <path
                    d='M181.1 168.1c0 1.8-4.2 3.3-12.6 4.4-8.5 1.1-17 1.7-25.5 1.7-8.6 0-14.1-.5-16.5-1.5-2.5-1-3.7-2.5-3.7-4.6V39.3c0-3.5 4-6.7 12.1-9.5s16.9-4.3 26.4-4.3c13.3 0 19.9 3.1 19.9 9.4V81h18.6V39.3c0-3.5 4.1-6.7 12.3-9.5 8.2-2.8 17-4.3 26.5-4.3 13.1 0 19.7 3.1 19.7 9.4v133.2c0 1.8-4.3 3.3-12.8 4.4-8.5 1.1-17 1.7-25.5 1.7s-14-.5-16.4-1.5c-2.5-1-3.7-2.5-3.7-4.6v-48h-18.6v48zm164.6 7.9c-11.6 0-21.5-1.1-29.9-3.3-8.3-2.1-15.9-6-22.9-11.6-14.1-11-21.2-32.2-21.2-63.5 0-13.1 1.9-24.6 5.7-34.3 3.9-9.8 9.2-17.5 16-23.2 13.4-11.2 30.8-16.8 52.1-16.8 11 0 20.6 1 28.8 2.9 8.2 2 15.9 5.5 23.2 10.7 14.7 10.6 22 30.9 22 60.7 0 26.8-6.6 46.6-19.9 59.3-13.2 12.8-31.2 19.1-53.9 19.1zm-6.9-35.9c1.7 2 4 3.1 6.9 3.1s5.2-1 6.9-3.1c1.7-2 3.1-6.3 4.2-13 1.1-6.6 1.7-15.9 1.7-27.7s-.6-21-1.7-27.4c-1.1-6.4-2.5-10.6-4.2-12.6-1.7-2-4-2.9-6.9-2.9s-5.2 1-6.9 2.9c-1.7 2-3.1 6.1-4.2 12.6-1.1 6.4-1.7 15.6-1.7 27.4s.6 21.1 1.7 27.7c1.1 6.7 2.5 11 4.2 13zm81.8-99.8c0-1.7 1.8-3.7 5.4-6 3.6-2.3 8.8-4.3 15.4-6.2 6.6-1.8 13.9-2.7 21.7-2.7 7.8 0 13.5 1.1 17.2 3.4 3.6 2.2 5.6 4.7 5.9 7.3l7.3 76.2h2.9l6.5-74.3c.4-3.9 5.2-7 14.2-9.2 9.1-2.2 17.5-3.4 25.3-3.4s13.6.7 17.4 2c3.8 1.3 6.2 2.7 7.2 4.1 1.1 1.4 1.6 2.7 1.6 3.9 0 1.2-1 4.5-3.1 9.8-2 5.4-4.1 11.2-6.4 17.3-7.4 19.5-19.9 54.6-37.5 105.1-1.5 4.3-13.5 6.5-36 6.5-7 0-11.6-.5-13.8-1.5-2.2-1-3.8-2.7-4.6-5-8.2-23.7-18.1-50.7-29.5-80.8-11.3-30.1-17.1-45.6-17.1-46.5zm264.7 133.8h-88.8c-6.8 0-11.4-.5-13.8-1.5-2.4-1-3.6-2.5-3.6-4.6V35.5c0-3.6 1.6-6.2 4.9-7.7 3.3-1.5 9.2-2.3 17.7-2.3h84.2c2.9 0 4.4 4.9 4.4 14.6s-.6 17.1-1.9 22.2c-1.3 5.1-2.9 7.7-5 7.7-9.1 0-24.4-.9-45.9-2.7v14c20.7-.8 34.1-1.3 40.4-1.3 3.8 0 5.7 4.4 5.7 13.2 0 8.8-.7 15.5-2.2 20-1.5 4.6-3.5 6.8-6 6.8l-37.9-.8v13.4c24.3-1.8 41-2.7 50.3-2.7 2.9 0 4.4 4.9 4.4 14.7 0 9.8-.6 17.2-1.9 22.2-1.2 4.8-2.9 7.3-5 7.3zm127.7 0h-88.8c-6.8 0-11.4-.5-13.8-1.5s-3.6-2.5-3.6-4.6V35.5c0-3.6 1.6-6.2 4.9-7.7 3.3-1.5 9.2-2.3 17.7-2.3h84.2c2.9 0 4.4 4.9 4.4 14.6s-.6 17.1-1.9 22.2c-1.3 5.1-2.9 7.7-5 7.7-9.1 0-24.4-.9-45.9-2.7v14c20.7-.8 34.1-1.3 40.4-1.3 3.8 0 5.7 4.4 5.7 13.2 0 8.8-.7 15.5-2.2 20-1.5 4.6-3.5 6.8-6 6.8l-37.9-.8v13.4c24.3-1.8 41-2.7 50.3-2.7 2.9 0 4.4 4.9 4.4 14.7 0 9.8-.6 17.2-1.9 22.2-1.2 4.8-2.9 7.3-5 7.3z'
                    style='fill:#4f4f4f'
                    transform='translate(169.628 31.3)'
                />
                <path style='fill:#1ebbd7' d='M13.1 17.4h239.2v239.2H13.1z' />
                <path style='opacity:.5;fill:#1ebbd7;enable-background:new' d='M25.1 5.5h239.2v239.2H25.1z' />
                <g>
                    <path
                        d='M15.9 41.3v97.4h97.4V88.9L101.2 101v25.5H28.1v-73h51l12.2-12.2H15.9zm92.5 0L70.7 78.6 55.1 63 37.6 80.5 62 104.9l8.8 8.4 8.8-8.4 46-46.4-17.2-17.2zm29.3 24.3v12.2h73.1V65.6h-73.1zm0 36.6v12.2h60.9v-12.2h-60.9z'
                        style='fill:#fff'
                        transform='translate(19.339 46.966)'
                    />
                </g>
            </svg>
        </Box>
    );

    if (disabledLink) {
        return <>{logo}</>;
    }

    return (
        <Link to='/' component={RouterLink} sx={{ display: 'contents' }}>
            {logo}
        </Link>
    );
});

Logo.propTypes = {
    sx: PropTypes.object,
    disabledLink: PropTypes.bool,
};

export default Logo;
