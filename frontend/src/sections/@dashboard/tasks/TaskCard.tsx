import { alpha, styled } from '@mui/material/styles';
import {
    Box,
    Link,
    Card,
    Grid,
    Avatar,
    Typography,
    CardContent,
    Chip,
    Modal,
    Paper,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Button,
    Tooltip,
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { fDate, fDateTime } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';
import { Task } from '../../../types';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SegmentIcon from '@mui/icons-material/Segment';
import { useState } from 'react';
import TaskModal from './TaskModal';

const StyledCardMedia = styled('div')({
    position: 'relative',
    paddingTop: '25%',
});

const StyledTitle = styled(Link)({
    height: 44,
    overflow: 'hidden',
    WebkitLineClamp: 2,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    zIndex: 9,
    width: 32,
    height: 32,
    position: 'absolute',
    left: theme.spacing(3),
    bottom: theme.spacing(-2),
}));

interface BlogPostCardProps {
    task: Task;
}

const TaskCard = ({ task }: BlogPostCardProps) => {
    const { id, title, description, createdAt, comments, tags } = task;

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Card
                key={id}
                elevation={3}
                sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    p: 2,
                    '& > *': {
                        cursor: 'inherit',
                    },
                }}
                onClick={handleOpen}>
                {tags?.map(({ label, color }) => (
                    <Chip
                        key={label}
                        size='small'
                        label={label}
                        sx={{ bgcolor: color, color: 'common.white', mr: 1 }}
                    />
                ))}

                <Typography variant='subtitle1' sx={{ py: 1 }}>
                    {title}
                </Typography>

                {Boolean(description) && (
                    <Tooltip enterDelay={1500} title={'This card has a description'}>
                        <Chip
                            icon={<SegmentIcon color='disabled' />}
                            size='small'
                            variant='outlined'
                            sx={{ border: 0, color: 'text.disabled' }}
                        />
                    </Tooltip>
                )}
                <Tooltip enterDelay={1500} title={fDateTime(createdAt)}>
                    <Chip
                        icon={<ScheduleIcon color='disabled' />}
                        size='small'
                        label={fDate(createdAt, 'dd MMM')}
                        variant='outlined'
                        sx={{ border: 0, color: 'text.disabled' }}
                    />
                </Tooltip>

                {comments.length > 0 && (
                    <Tooltip enterDelay={1500} title={`This card has ${comments.length} comments`}>
                        <Chip
                            icon={
                                <Iconify
                                    color='text.disabled'
                                    icon={'eva:message-circle-fill'}
                                    sx={{ width: 16, height: 16, mr: 0.5 }}
                                />
                            }
                            size='small'
                            label={comments.length}
                            variant='outlined'
                            sx={{ border: 0, color: 'text.disabled' }}
                        />
                    </Tooltip>
                )}
                {/* <Overlay>
                    <TaskAltIcon
                        color='inherit'
                        fontSize='large'
                        sx={{ position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    />
                </Overlay> */}
            </Card>
            <TaskModal taskId={id} open={open} handleClose={handleClose} />
        </>
    );
};

const Overlay = styled('div')(({ theme }) => ({
    background: alpha(theme.palette.common.white, 0.8),
    color: theme.palette.grey[500],
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99,
}));

export default TaskCard;
