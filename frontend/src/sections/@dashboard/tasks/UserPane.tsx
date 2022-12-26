import {
    Avatar,
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Chip,
    Divider,
    Grid,
    IconButton,
    Link,
    Paper,
    Stack,
    styled,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SegmentIcon from '@mui/icons-material/Segment';
import AddIcon from '@mui/icons-material/Add';
import SvgColor from '../../../components/svg-color';
import { User } from '../../../types';
import { amber, blue, purple } from '@mui/material/colors';
import Scrollbar from '../../../components/scrollbar';
import Iconify from '../../../components/iconify';
import TaskCard from './TaskCard';

interface UserPane {
    user?: User;
    index?: number;
}

const EmptyState = () => {
    return (
        <Stack alignItems='center' justifyContent='center' height='100%'>
            <img src='/assets/illustrations/illustration_avatar.png' alt='Empty' width={85} />
            <Typography variant='subtitle1' textAlign='center'>
                You don't have any tasks 🥳
            </Typography>
            <Typography variant='body2' textAlign='center'>
                Feel free to rest
            </Typography>
        </Stack>
    );
};

const UserPane = ({ user, index = 1 }: UserPane) => {
    const { name, avatar_url, tasks } = user;

    return (
        <Paper
            elevation={5}
            sx={{
                position: 'relative',
                height: '100%',
                overflow: 'hidden',
                bgcolor: 'background.neutral',
                display: 'flex',
                flexDirection: 'column',
            }}>
            <StyledCardMedia>
                <SvgColor
                    src='/assets/icons/shape-avatar.svg'
                    sx={{
                        width: 142,
                        height: 40,
                        zIndex: 9,
                        bottom: -18,
                        left: '50%',
                        position: 'absolute',
                        color: 'background.neutral',
                        transform: 'translateX(-50%)',
                    }}
                />
                <StyledAvatar alt={name} src={avatar_url} />
                <StyledCover alt={'Cover'} src={`/assets/images/covers/cover_${index}.jpg`} />
            </StyledCardMedia>
            <Typography gutterBottom variant='h6' textAlign='center' mt={4}>
                {name}
            </Typography>
            <CardContent
                sx={{
                    px: 2,
                    py: 0,
                    height: '100%',
                }}>
                {tasks.length ? (
                    tasks.map((task) => (
                        // <Scrollbar sx={{ height: 350, overflow: 'scroll' }}>
                        <TaskCard key={task.id} task={task} />
                        // </Scrollbar>
                    ))
                ) : (
                    <EmptyState />
                )}
            </CardContent>

            <Divider sx={{ m: 0, borderStyle: 'dashed' }} />

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <Tooltip title='Add new task'>
                    <IconButton color='primary'>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Paper>
    );
};

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    zIndex: 9,
    width: 48,
    height: 48,
    position: 'absolute',
    bottom: theme.spacing(-4),
    left: '50%',
    transform: 'translateX(-50%)',
}));

const StyledCover = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
});

const StyledCardMedia = styled('div')({
    position: 'relative',
    paddingTop: '25%',
});

export default UserPane;
