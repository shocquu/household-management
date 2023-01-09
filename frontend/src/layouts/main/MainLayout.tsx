import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Header from './header';
import Nav from './nav';

const APP_BAR = 64;

const MainLayout = () => {
    const [open, setOpen] = useState(false);

    return (
        <StyledRoot>
            <Header onOpenNav={() => setOpen(true)} />
            <Nav openNav={open} onCloseNav={() => setOpen(false)} />
            <Main>
                <Outlet />
            </Main>
        </StyledRoot>
    );
};

const StyledRoot = styled('div')({
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden',
});

const Main = styled('div')(() => ({
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '100%',
    paddingTop: APP_BAR + 24,
}));

export default MainLayout;
