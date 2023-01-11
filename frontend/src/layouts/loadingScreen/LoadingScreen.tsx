import { Stack, styled, LinearProgress } from '@mui/material';
import Logo from '../../components/logo';

const LoadingScreen = () => {
    return (
        <StyledProgress alignItems='center' spacing={2}>
            <Logo />
            <LinearProgress sx={{ width: '30vw' }} />
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
