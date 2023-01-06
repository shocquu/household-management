import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
import account from '../../../_mock/account';
import useResponsive from '../../../hooks/useResponsive';
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import navConfig from './config';
import useAuth from '../../../hooks/useAuth';

const NAV_WIDTH = 220;

const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

interface Nav {
    openNav: boolean;
    onCloseNav: () => void;
}

export default function Nav({ openNav, onCloseNav }: Nav) {
    const { pathname } = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        if (openNav) {
            onCloseNav();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const renderContent = (
        <Scrollbar
            sx={{
                height: 1,
                '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
            }}>
            <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
                <Logo />
            </Box>

            <Box sx={{ mb: 5, mx: 2.5 }}>
                <Link underline='none'>
                    <StyledAccount>
                        <Avatar src={user.avatar_url} alt='photoURL' />

                        <Box sx={{ ml: 2 }}>
                            <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                {user.name}
                            </Typography>
                            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                                {user.role}
                            </Typography>
                        </Box>
                    </StyledAccount>
                </Link>
            </Box>

            <NavSection data={navConfig} />

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
                <Typography variant='body2' textAlign='center' sx={{ color: 'text.secondary' }}>
                    AGH 2023
                </Typography>
            </Box>
        </Scrollbar>
    );

    return (
        <Box component='nav'>
            <Drawer
                open={openNav}
                onClose={onCloseNav}
                ModalProps={{
                    keepMounted: true,
                }}
                PaperProps={{
                    sx: { width: NAV_WIDTH },
                }}>
                {renderContent}
            </Drawer>
        </Box>
    );
}
