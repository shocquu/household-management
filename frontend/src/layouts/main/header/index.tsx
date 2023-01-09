import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@mui/material';
import { bgBlur } from '../../../utils/cssStyles';
import Iconify from '../../../components/iconify';
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import { HEADER } from '../../../constants';

interface Header {
    onOpenNav: () => void;
}

const Header = ({ onOpenNav }: Header) => {
    return (
        <StyledRoot>
            <StyledToolbar>
                <IconButton
                    onClick={onOpenNav}
                    sx={{
                        mr: 1,
                        color: 'text.primary',
                    }}>
                    <Iconify icon='eva:menu-2-fill' />
                </IconButton>

                <Searchbar />
                <Box sx={{ flexGrow: 1 }} />

                <Stack
                    direction='row'
                    alignItems='center'
                    spacing={{
                        xs: 0.5,
                        sm: 1,
                    }}>
                    <LanguagePopover />
                    <NotificationsPopover />
                    <AccountPopover />
                </Stack>
            </StyledToolbar>
        </StyledRoot>
    );
};

const StyledRoot = styled(AppBar)(({ theme }) => ({
    ...bgBlur({ color: theme.palette.background.default }),
    boxShadow: 'none',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    minHeight: HEADER,
}));

export default Header;
