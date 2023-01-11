import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Box } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import Logo from '../components/logo';
import { RegisterForm } from '../sections/auth/register';

const RegisterPage = () => {
    const lgUp = useResponsive('up', 'lg');

    return (
        <>
            <Helmet title='Sign up | Hovee' />
            <StyledRoot>
                <Logo
                    sx={{
                        position: 'fixed',
                        top: { xs: 16, sm: 24, md: 40 },
                        left: { xs: 16, sm: 24, md: 40 },
                    }}
                />

                <Container maxWidth='sm'>
                    <StyledContent>
                        <Typography variant='h4' gutterBottom>
                            Get started
                        </Typography>

                        <Typography variant='body2' sx={{ mb: 5 }}>
                            Already have an account? {''}
                            <Link variant='subtitle2' component={RouterLink} to='/login'>
                                Sign in
                            </Link>
                        </Typography>

                        <RegisterForm />
                    </StyledContent>
                </Container>

                {lgUp && (
                    <StyledSection>
                        <Typography variant='h3' textAlign='center' sx={{ px: 5, mt: 10, mb: 5 }}>
                            Manage your tasks more effectively with{' '}
                            <Box fontWeight='inherit' display='inline' color='primary.main'>
                                Hovee
                            </Box>
                        </Typography>
                        <img src='/assets/illustrations/character_7.png' alt='register' />
                    </StyledSection>
                )}
            </StyledRoot>
        </>
    );
};

const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('lg')]: {
        display: 'flex',
    },
}));

const StyledSection = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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

export default RegisterPage;
