import { NavLink as RouterLink } from 'react-router-dom';
import { Box, List, ListItemText } from '@mui/material';
import { StyledNavItem, StyledNavItemIcon } from './styles';
import { useTranslation } from 'react-i18next';

interface NavSectionProps {
    data: any[];
}

interface NavItemProps {
    item: Record<string, any>;
}

const NavItem = ({ item }: NavItemProps) => {
    const { title, path, icon, info } = item;
    const { t } = useTranslation();

    return (
        <StyledNavItem
            to={path}
            component={RouterLink}
            sx={{
                '&.active': {
                    color: 'text.primary',
                    bgcolor: 'action.selected',
                    fontWeight: 'fontWeightBold',

                    svg: {
                        color: 'primary.main',
                    },
                },
            }}>
            <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
            <ListItemText disableTypography primary={t(`navBar.${title}`)} />
            {info && info}
        </StyledNavItem>
    );
};

const NavSection = ({ data = [], ...other }: NavSectionProps) => {
    return (
        <Box {...other}>
            <List disablePadding sx={{ p: 1 }}>
                {data.map((item) => (
                    <NavItem key={item.title} item={item} />
                ))}
            </List>
        </Box>
    );
};

export default NavSection;
