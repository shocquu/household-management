import {
    Avatar,
    CardActions,
    CardContent,
    Divider,
    IconButton,
    Paper,
    Skeleton,
    Stack,
    styled,
    SxProps,
    Tooltip,
    Button,
    Typography,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddIcon from '@mui/icons-material/Add';
import SvgColor from '../../../components/svg-color';
import { Role, User } from '../../../types';
import Scrollbar from '../../../components/scrollbar';
import TaskCard from './TaskCard';
import { createRef, useState } from 'react';
import NewCard from './NewCard';
import { AVATARS_BASE_PATH, HEADER } from '../../../constants';
import useAuth from '../../../hooks/useAuth';
import useLocalPreferences from '../../../hooks/useLocalPreferences';

interface TasksColumn {
    user?: User;
    index?: number;
    loading: boolean;
}

const EmptyState = ({ id, sx }: { id: number; sx?: SxProps }) => {
    const { user: loggedInUser } = useAuth();

    return (
        <Stack
            alignItems='center'
            justifyContent='center'
            height='100%'
            mt={2}
            mb={4}
            sx={{ minWidth: 210, minHeight: 140, ...sx }}>
            {id === loggedInUser.id ? (
                <>
                    <img src='/assets/illustrations/illustration_avatar.png' alt='Empty' width={85} />
                    <Typography variant='subtitle1' textAlign='center'>
                        You don't have any tasks 🥳
                    </Typography>
                    <Typography variant='body2' textAlign='center'>
                        Feel free to rest
                    </Typography>
                </>
            ) : (
                <>
                    <InventoryIcon
                        fontSize='large'
                        color='disabled'
                        sx={{
                            fontSize: {
                                sx: '2rem',
                                md: '3rem',
                                lg: '4rem',
                            },
                        }}
                    />
                    <Typography variant='subtitle1' textAlign='center' color='text.disabled'>
                        Empty
                    </Typography>
                </>
            )}
        </Stack>
    );
};

const TasksColumn = ({ loading, user, index = 1 }: TasksColumn) => {
    const { id, displayName, username, avatarUrl, tasks } = user;
    const { user: loggedInUser } = useAuth();
    const { preferences, setPreference } = useLocalPreferences();
    const [isAdding, setIsAdding] = useState(false);
    const [showCompleted, setShowCompleted] = useState(preferences.showCompletedTasks);
    const scrollableNodeRef = createRef<any>();
    const isAdmin = loggedInUser.role === Role.Admin;
    const nonCompletedTasks = tasks.filter((task) => !task.completed);

    const handleAdd = () => {
        setIsAdding(true);
        scrollableNodeRef.current.scrollTop = 0;
    };

    const handleCancel = () => setIsAdding(false);

    const getTitle = () => {
        if (!isAdmin) return 'Only users with the Admin role can add tasks';
        if (isAdding) return 'Cancel';
        return 'Add new task';
    };

    const handleToggle = () => {
        setShowCompleted((prevState) => !prevState);
        setPreference('showCompletedTasks', !showCompleted);
    };

    return (
        <>
            <Paper
                elevation={5}
                sx={{
                    position: 'relative',
                    maxWidth: 350,
                    minWidth: {
                        xs: 250,
                        sm: 300,
                        md: 325,
                        xl: 350,
                    },
                    width: '20vw',
                    overflow: 'hidden',
                    bgcolor: 'background.neutral',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                <StyledCardMedia>
                    <StyledAvatarOutlined src='/assets/icons/shape-avatar.svg' />
                    <StyledAvatar alt={displayName} src={AVATARS_BASE_PATH + avatarUrl} />
                    <StyledCover alt={'Cover'} src={`/assets/images/covers/cover_${index}.jpg`} />
                </StyledCardMedia>
                <Typography variant='h6' textAlign='center' mt={4}>
                    {displayName}
                </Typography>
                <Typography gutterBottom variant='caption' textAlign='center' color='text.disabled' mt={-0.5}>
                    {username}
                </Typography>
                <CardContent
                    sx={{
                        px: 2,
                        py: 0,
                        height: '100%',
                    }}>
                    {loading &&
                        [1, 2, 3].map((key) => (
                            <Stack mb={2} spacing={1}>
                                <Skeleton key={key} variant='rounded' height={98} />
                            </Stack>
                        ))}

                    <Divider
                        sx={{
                            mb: 1,
                            '&::before': {
                                borderTopStyle: 'dashed',
                            },
                            '&::after': {
                                borderTopStyle: 'dashed',
                            },
                        }}>
                        <Button color='secondary' onClick={handleToggle}>
                            {showCompleted ? 'Hide completed' : 'Show completed'}
                        </Button>
                    </Divider>

                    <Scrollbar
                        scrollableNodeProps={{ ref: scrollableNodeRef }}
                        sx={{ maxHeight: 'calc(100vh - 24rem)' }}>
                        {!loading && (nonCompletedTasks.length > 0 || showCompleted) ? (
                            <Stack mb={2} spacing={1}>
                                {tasks
                                    .filter((task) => (!showCompleted ? !task.completed : task))
                                    .map((task) => (
                                        <TaskCard key={task.id} task={task} />
                                    ))}

                                {isAdding && <NewCard userId={id} setIsAdding={setIsAdding} />}
                            </Stack>
                        ) : (
                            <>
                                {!isAdding && !showCompleted && <EmptyState id={id} />}
                                {isAdding && <NewCard userId={id} setIsAdding={setIsAdding} />}
                            </>
                        )}
                    </Scrollbar>
                </CardContent>

                <Divider sx={{ m: 0, borderStyle: 'dashed' }} />

                <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title={getTitle()}>
                        <span>
                            <IconButton
                                disabled={!isAdmin}
                                color='primary'
                                onClick={isAdding ? handleCancel : handleAdd}
                                sx={{
                                    transition: 'transform .3s',
                                    transform: isAdding ? 'rotate(-45deg)' : 'rotate(0deg)',
                                }}>
                                <AddIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </CardActions>
            </Paper>
        </>
    );
};

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    [theme.breakpoints.up('lg')]: {
        width: 75,
        height: 75,
    },
    zIndex: 9,
    width: 48,
    height: 48,
    position: 'absolute',
    bottom: theme.spacing(-4),
    left: '50%',
    transform: 'translateX(-50%)',
}));

const StyledAvatarOutlined = styled(SvgColor)(({ theme }) => ({
    [theme.breakpoints.up('lg')]: {
        width: 200,
        height: 98,
        bottom: -42,
    },
    width: 142,
    height: 40,
    zIndex: 9,
    bottom: -18,
    left: '50%',
    position: 'absolute',
    transform: 'translateX(-50%)',
    color: theme.palette.background.neutral,
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

export default TasksColumn;
