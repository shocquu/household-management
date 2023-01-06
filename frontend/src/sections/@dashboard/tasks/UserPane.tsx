import {
    Avatar,
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    ClickAwayListener,
    Divider,
    Grid,
    IconButton,
    Link,
    Paper,
    Skeleton,
    Stack,
    styled,
    SxProps,
    TextField,
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
import { createRef, Dispatch, SetStateAction, useRef, useState } from 'react';
import { useFormik } from 'formik';
import NewCard from './NewCard';

interface UserPane {
    user?: User;
    index?: number;
    loading: boolean;
}

const EmptyState = ({ sx }: { sx?: SxProps }) => {
    return (
        <Stack alignItems='center' justifyContent='center' height='100%' sx={{ minWidth: 210, ...sx }}>
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

const UserPane = ({ loading, user, index = 1 }: UserPane) => {
    const { id, name, avatar_url, tasks } = user;

    const [isAdding, setIsAdding] = useState(false);
    const scrollableNodeRef = createRef<any>();

    const handleAdd = () => {
        setIsAdding(true);
        scrollableNodeRef.current.scrollBottom = 0;
    };

    const handleCancel = () => setIsAdding(false);

    return (
        <>
            <Paper
                elevation={5}
                sx={{
                    position: 'relative',
                    height: 'calc(100vh - 7rem)',
                    minWidth: 242,
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
                    {loading &&
                        [1, 2, 3].map((key) => (
                            <Stack mb={2} spacing={1}>
                                <Skeleton key={key} variant='rounded' height={98} />
                            </Stack>
                        ))}

                    {!loading && tasks.length ? (
                        <Scrollbar
                            scrollableNodeProps={{ ref: scrollableNodeRef }}
                            sx={{
                                minHeight: '100%',
                                maxHeight: 440,
                            }}>
                            <Stack mb={2} spacing={1}>
                                {tasks
                                    .slice()
                                    .sort((a, b) => a.createdAt - b.createdAt)
                                    .map((task) => (
                                        <TaskCard key={task.id} task={task} />
                                    ))}
                                {isAdding && <NewCard userId={id} setIsAdding={setIsAdding} />}
                            </Stack>
                        </Scrollbar>
                    ) : (
                        <>
                            {!isAdding && <EmptyState sx={{ mt: -1.5 }} />}
                            {isAdding && <NewCard userId={id} setIsAdding={setIsAdding} />}
                        </>
                    )}
                </CardContent>

                <Divider sx={{ m: 0, borderStyle: 'dashed' }} />

                <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title={isAdding ? 'Cancel' : 'Add new task'}>
                        <IconButton
                            color='primary'
                            onClick={isAdding ? handleCancel : handleAdd}
                            sx={{
                                transition: 'transform .3s',
                                transform: isAdding ? 'rotate(-45deg)' : 'rotate(0deg)',
                            }}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </CardActions>
            </Paper>
        </>
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
