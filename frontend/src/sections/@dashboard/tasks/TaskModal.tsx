import {
    Avatar,
    Button,
    Chip,
    Collapse,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Modal,
    Paper,
    Stack,
    styled,
    TextField,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { gql, useQuery } from '@apollo/client';
import { fToNow } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify';
import { useState } from 'react';

const TASK_QUERY = gql`
    query Task($taskId: Int!) {
        task(id: $taskId) {
            title
            description
            user {
                name
                avatar_url
            }
            comments {
                id
                author {
                    name
                    avatar_url
                }
                message
                createdAt
            }
            tags {
                label
                color
            }
        }
    }
`;

interface TaskModal {
    taskId: number;
    open: boolean;
    handleClose: () => void;
}

const CloseButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    color: theme.palette.grey[500],
    '&:hover': {
        backgroundColor: 'transparent',
    },
}));

const TaskModal = ({ taskId, open, handleClose }: TaskModal) => {
    const { data, loading, error } = useQuery(TASK_QUERY, { variables: { taskId } });
    const { title = '', description = '', user = '', comments = [], tags = [] } = data?.task || {};

    return (
        <Modal aria-labelledby='task-title' aria-describedby='task-description' open={open} onClose={handleClose}>
            <>
                <ModalContent sx={{ position: 'relative' }}>
                    <CloseButton size='small' aria-label='Close' onClick={handleClose}>
                        <CloseIcon />
                    </CloseButton>

                    <Typography id='task-title' variant='h6' component='h2'>
                        {title}
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={9}>
                            {description && (
                                <Typography id='task-description' variant='body2' sx={{ mt: 1 }}>
                                    {description}
                                </Typography>
                            )}

                            {tags && (
                                <>
                                    <Typography
                                        paragraph
                                        variant='caption'
                                        color='text.secondary'
                                        sx={{ mt: 2, mb: 0 }}>
                                        Labels
                                    </Typography>
                                    {tags?.map(({ label, color }) => (
                                        <Chip
                                            key={label}
                                            size='small'
                                            label={label}
                                            sx={{ bgcolor: color, color: 'common.white', mr: 1, fontSize: 12 }}
                                        />
                                    ))}
                                </>
                            )}

                            <TextField
                                fullWidth
                                rows={2}
                                multiline
                                size='small'
                                variant='filled'
                                label='Add comment'
                                inputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                sx={{ mt: 3 }}
                            />
                            <Button variant='contained' size='small' sx={{ mt: 1 }}>
                                Add
                            </Button>

                            <Typography variant='subtitle2' mt={2}>
                                Activity
                            </Typography>
                            <List
                                dense
                                disablePadding
                                sx={{ width: '100%', maxWidth: 360, minHeight: 50, bgcolor: 'background.paper' }}>
                                {comments?.map(({ id, author, message, createdAt }) => (
                                    <ListItem key={id} dense disableGutters>
                                        <ListItemAvatar>
                                            <Avatar alt={author.name} src={author.avatar_url} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <>
                                                    <b>{author.name}</b>
                                                    <Typography variant='caption' color='text.secondary' ml={0.5}>
                                                        {fToNow(createdAt)}
                                                    </Typography>
                                                </>
                                            }
                                            secondary={message}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                        <Grid item xs={3}>
                            <ActionsMenu />
                        </Grid>
                    </Grid>
                </ModalContent>
            </>
        </Modal>
    );
};

const ActionsMenu = () => {
    const [expanded, setExpanded] = useState(false);

    const handleClick = () => setExpanded(!expanded);

    return (
        <List
            dense
            disablePadding
            component='aside'
            aria-labelledby='actions-list'
            subheader={
                <ListSubheader component='div' id='actions-list'>
                    Actions
                </ListSubheader>
            }>
            <ListItemButton disableTouchRipple sx={{ color: 'error.main' }}>
                <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                    <Iconify icon={'eva:trash-2-outline'} />
                </ListItemIcon>
                <ListItemText primary='Delete' />
            </ListItemButton>
            <ListItemButton disableTouchRipple onClick={handleClick}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                    <Iconify icon={'material-symbols:label-outline'} />
                </ListItemIcon>
                <ListItemText primary='Labels' />
                {expanded ? <ExpandLessIcon fontSize='small' /> : <ExpandMoreIcon fontSize='small' />}
            </ListItemButton>
            <Collapse in={expanded} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>{/* <StarBorder /> */}</ListItemIcon>
                        <ListItemText primary='Starred' />
                    </ListItemButton>
                </List>
            </Collapse>
        </List>
    );
};

const ModalContent = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    padding: theme.spacing(3),
    outline: 0,
}));

export default TaskModal;
