import { ReactElement, ElementType } from 'react';
import { styled } from '@mui/material/styles';
import { ListItemIcon, ListItemButton, ButtonProps } from '@mui/material';

export const StyledNavItem = styled(ListItemButton)(({ theme }) => ({
    ...theme.typography.body2,
    height: 48,
    position: 'relative',
    textTransform: 'capitalize',
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius,
})) as <C extends ElementType>(props: ButtonProps<C, { component?: C }>) => ReactElement;

export const StyledNavItemIcon = styled(ListItemIcon)({
    width: 22,
    height: 22,
    color: 'primary',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});
