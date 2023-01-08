import { Stack, CircularProgress, styled } from '@mui/material';
import Logo from '../../components/logo';

const LoadingScreen = () => {
    return (
        <StyledProgress spacing={2}>
            <Logo />
            <CircularProgress />
        </StyledProgress>
    );
};

const StyledProgress = styled(Stack)(() => ({
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
}));

export default LoadingScreen;
