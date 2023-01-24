import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

export default function Page404() {
    const { t } = useTranslation();

    return (
        <>
            <Helmet title='Page not found | Hovee' />
            <Container>
                <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                    <Typography variant='h3' paragraph>
                        {t('404.title')}
                    </Typography>

                    <Typography sx={{ color: 'text.secondary' }}>{t('404.description')}</Typography>

                    <Box
                        component='img'
                        src='/assets/illustrations/illustration_404.svg'
                        sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
                    />

                    <Button to='/' size='large' variant='contained' component={RouterLink}>
                        {t('404.goToHome')}
                    </Button>
                </StyledContent>
            </Container>
        </>
    );
}
