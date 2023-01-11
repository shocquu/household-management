import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Link } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import { LoginForm } from '../sections/auth/login';
import Logo from '../components/logo';

const LoginPage = () => {
    const mdUp = useResponsive('up', 'md');

    return (
        <>
            <Helmet title='Sign in | Hovee' />
            <StyledRoot>
                <Logo
                    sx={{
                        position: 'fixed',
                        top: { xs: 16, sm: 24, md: 40 },
                        left: { xs: 16, sm: 24, md: 40 },
                    }}
                />

                {mdUp && (
                    <StyledSection>
                        <Typography variant='h3' sx={{ px: 5, mt: 10, mb: 5 }}>
                            Hi, Welcome Back
                        </Typography>
                        <img src='/assets/illustrations/illustration_login.png' alt='login' />
                    </StyledSection>
                )}

                <Container maxWidth='sm'>
                    <StyledContent>
                        <Typography variant='h4' gutterBottom>
                            Sign in to Minimal
                        </Typography>

                        <Typography variant='body2' sx={{ mb: 5 }}>
                            Don’t have an account? {''}
                            <Link variant='subtitle2' component={RouterLink} to='/register'>
                                Get started
                            </Link>
                        </Typography>

                        <LoginForm />
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
};

const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const StyledSection = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: theme.customShadows.card,
    backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

export default LoginPage;
