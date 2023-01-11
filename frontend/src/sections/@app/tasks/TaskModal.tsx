import { useState } from 'react';
import {
    Avatar,
    Button,
    Chip,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Modal,
    Paper,
    Skeleton,
    Stack,
    styled,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { gql, useMutation, useQuery } from '@apollo/client';
import { fDate, fToNow, fCountdown } from '../../../utils/formatTime';
import ActionsMenu from './ActionsMenu';
import EditableText from '../../../components/editable-text';
import { Form, FormikProvider, useFormik } from 'formik';
import useAuth from '../../../hooks/useAuth';
import { Comment, Role, User } from '../../../types';
import Iconify from '../../../components/iconify';
import { USERS_QUERY } from '../../../pages/TasksPage';
import { AVATARS_BASE_PATH } from '../../../constants';
import { getTimeColor } from '../../../utils/getTimeColor';
import { getLabelColor } from '../../../utils/getLabelColor';

export const TASK_QUERY = gql`
    query Task($taskId: Int!) {
        task(id: $taskId) {
            title
            description
            dueDate
            completed
            user {
                id
                displayName
                avatarUrl
            }
            comments {
                id
                author {
                    id
                    avatarUrl
                    displayName
                }
                message
                createdAt
            }
            tags {
                id
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
    zIndex: 20,
    '&:hover': {
        backgroundColor: 'transparent',
    },
}));

const UPDATE_TASK_MUTATION = gql`
    mutation UpdateTask($updateTaskInput: UpdateTaskInput!) {
        updateTask(updateTaskInput: $updateTaskInput) {
            id
        }
    }
`;

const TaskModal = ({ taskId, open, handleClose }: TaskModal) => {
    const { user: loggedInUser } = useAuth();
    const { data, loading } = useQuery(TASK_QUERY, {
        skip: !open,
        variables: { taskId },
    });
    const [updateTask] = useMutation(UPDATE_TASK_MUTATION, {
        refetchQueries: [{ query: TASK_QUERY, variables: { taskId } }],
    });

    const {
        title = '',
        description = '',
        comments = [],
        tags: appliedTags = [],
        dueDate,
        completed,
        user,
    } = data?.task || {};

    const isAssignedTo = loggedInUser.id === user?.id;
    const showActionsMenu = isAssignedTo || loggedInUser.role === Role.Admin;
    const formik = useFormik({
        initialValues: {
            title,
            description,
            comments,
            dueDate,
        },
        enableReinitialize: true,
        onSubmit: ({ title, description, dueDate }) => {
            updateTask({
                refetchQueries: [{ query: USERS_QUERY }], // temporary
                variables: {
                    updateTaskInput: { id: taskId, title, description, dueDate },
                },
                onCompleted: (values) => {
                    formik.setValues(values);
                },
                update: (cache) => {
                    cache.modify({
                        fields: {
                            users(cachedUsers: User[] = [], { readField }) {
                                const foundUser = cachedUsers?.find((user) => user?.id === readField('id', user));
                                return { ...cachedUsers, foundUser };
                            },
                        },
                    });
                },
            });
        },
    });
    const timeLeft = formik.values?.dueDate && fCountdown(formik.values?.dueDate, ['days']);
    const timeLeftColor = getTimeColor(+timeLeft?.split(' ')[0]);

    const onClose = () => {
        if (formik.dirty) formik.submitForm();
        handleClose();
    };

    return (
        <Modal aria-labelledby='task-title' aria-describedby='task-description' open={open} onClose={onClose}>
            <>
                <ModalContent sx={{ position: 'relative', width: !showActionsMenu ? 'fit-content' : 'unset' }}>
                    <Grid container spacing={2} columns={16}>
                        <Grid item xs={12} sx={{ minWidth: { xs: 300, md: 400, lg: 500 } }}>
                            <form onSubmit={formik.handleSubmit}>
                                <header style={{ maxWidth: '90%' }}>
                                    <CloseButton size='small' aria-label='Close' onClick={handleClose}>
                                        <CloseIcon />
                                    </CloseButton>

                                    {completed || !showActionsMenu ? (
                                        <Typography variant='h6' component='h2'>
                                            {formik.values.title}
                                        </Typography>
                                    ) : !loading && formik.values.title ? (
                                        <EditableText
                                            fullWidth
                                            id='task-title'
                                            variant='h6'
                                            component='h2'
                                            text={formik.values.title}
                                            name='title'
                                            maxRows={1}
                                            onBlur={(e) => formik.setFieldValue('title', e.target.value)}
                                        />
                                    ) : (
                                        <Skeleton variant='text' width='30%' sx={{ fontSize: '1rem' }} />
                                    )}
                                </header>
                                {appliedTags.length > 0 && (
                                    <>
                                        <Typography
                                            paragraph
                                            variant='caption'
                                            color='text.secondary'
                                            sx={{ mt: 0.5, mb: 0 }}>
                                            Labels
                                        </Typography>
                                        <Stack direction='row' flexWrap='wrap' sx={{ rowGap: 0.5 }}>
                                            {appliedTags.map(({ label, color }) => (
                                                <Chip
                                                    key={label}
                                                    size='small'
                                                    label={label}
                                                    sx={{
                                                        bgcolor: getLabelColor(color),
                                                        color: 'common.white',
                                                        mr: 1,
                                                        fontSize: 12,
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                    </>
                                )}

                                <Typography variant='subtitle2' mt={1}>
                                    Description
                                </Typography>
                                {loading ? (
                                    <Skeleton variant='rounded' width='100%' height={60} sx={{ mt: 0.5 }} />
                                ) : description && !completed ? (
                                    <EditableText
                                        id='task-description'
                                        minRows={2}
                                        showButtons
                                        text={description}
                                        onBlur={(e) => formik.setFieldValue('description', e.target.value)}
                                    />
                                ) : (
                                    <TextField
                                        disabled={completed || !showActionsMenu}
                                        fullWidth
                                        multiline
                                        minRows={2}
                                        placeholder='Add a more detailed description'
                                        variant='filled'
                                        size='small'
                                        name='description'
                                        sx={{ mt: 0.5 }}
                                        onChange={formik.handleChange}
                                    />
                                )}
                            </form>

                            {formik.values?.dueDate && (
                                <>
                                    <Typography variant='subtitle2' mt={3} onClick={(e) => e.preventDefault()}>
                                        Deadline
                                    </Typography>
                                    <Typography variant='body2' color={'success'} onClick={(e) => e.preventDefault()}>
                                        {fDate(formik.values?.dueDate)}
                                        {!completed && (
                                            <Chip
                                                size='small'
                                                variant='outlined'
                                                color={timeLeftColor}
                                                label={timeLeft ? `${timeLeft} left` : 'Time is over'}
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </Typography>
                                </>
                            )}

                            <Typography variant='subtitle2' mt={3} onClick={(e) => e.preventDefault()}>
                                Activity
                            </Typography>
                            <List
                                dense
                                disablePadding
                                sx={{ width: '100%', minHeight: 50, bgcolor: 'background.paper' }}>
                                <ListItem dense disableGutters>
                                    <ListItemAvatar>
                                        <Avatar alt={loggedInUser.displayName} src={loggedInUser.avatarUrl} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <NewComment
                                                disabled={completed}
                                                authorId={loggedInUser.id}
                                                taskId={taskId}
                                            />
                                        }
                                    />
                                </ListItem>
                                {loading ? (
                                    <ListItem dense disableGutters>
                                        <ListItemAvatar>
                                            <Skeleton variant='circular'>
                                                <Avatar />
                                            </Skeleton>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Skeleton variant='text' width='30%' sx={{ fontSize: '0.875rem' }} />
                                            }
                                            secondary={
                                                <Skeleton variant='text' width='50%' sx={{ fontSize: '0.875rem' }} />
                                            }
                                        />
                                    </ListItem>
                                ) : (
                                    comments?.map((comment) => <CommentBlock key={comment.id} comment={comment} />)
                                )}
                            </List>
                        </Grid>

                        {showActionsMenu && (
                            <Grid item xs={4}>
                                <FormikProvider value={formik}>
                                    <Form>
                                        <ActionsMenu
                                            taskId={taskId}
                                            userId={user?.id}
                                            completed={completed}
                                            appliedTags={appliedTags}
                                        />
                                    </Form>
                                </FormikProvider>
                            </Grid>
                        )}
                    </Grid>
                </ModalContent>
            </>
        </Modal>
    );
};

const REMOVE_COMMENT_MUTATION = gql`
    mutation RemoveComment($removeCommentId: Int!) {
        removeComment(id: $removeCommentId) {
            id
        }
    }
`;

const CommentBlock = ({ comment }: { comment: Comment }) => {
    const { id, createdAt, message, author } = comment;

    const { user } = useAuth();
    const [removeComment] = useMutation(REMOVE_COMMENT_MUTATION, {
        refetchQueries: [TASK_QUERY, 'Task'],
    });

    const handleRemove = () => {
        removeComment({ variables: { removeCommentId: id } });
    };

    return (
        <ListItem
            key={id}
            dense
            disableGutters
            sx={{
                '&:hover': {
                    '.MuiIconButton-root': {
                        display: 'block',
                    },
                },
            }}>
            <ListItemAvatar>
                <Avatar alt={author.displayName} src={AVATARS_BASE_PATH + author.avatarUrl} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <>
                        <b>{author.displayName}</b>
                        <Typography variant='caption' component='span' color='text.secondary' ml={0.5}>
                            {fToNow(createdAt)}
                        </Typography>
                    </>
                }
                secondary={
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        {message}
                        {author.id === user.id && (
                            <Tooltip title='Delete comment'>
                                <IconButton
                                    aria-label='delete'
                                    sx={{ p: 0, cursor: 'pointer', display: 'none', fontSize: 'inherit' }}
                                    onClick={handleRemove}>
                                    <Iconify icon={'eva:trash-2-outline'} width={16} />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                }
            />
        </ListItem>
    );
};

const ADD_COMMENT_MUTATION = gql`
    mutation CreateComment($createCommentInput: CreateCommentInput!) {
        createComment(createCommentInput: $createCommentInput) {
            id
        }
    }
`;

const NewComment = ({ disabled, authorId, taskId }: { disabled: boolean; authorId: number; taskId: number }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [postComment] = useMutation(ADD_COMMENT_MUTATION, {
        refetchQueries: [TASK_QUERY, USERS_QUERY],
    });

    const formik = useFormik({
        initialValues: {
            message: '',
        },
        enableReinitialize: true,
        onSubmit: ({ message }) => {
            postComment({ variables: { createCommentInput: { authorId, taskId, message } } });
            setIsFocused(false);
            formik.resetForm();
        },
    });

    return (
        <Wrapper onSubmit={formik.handleSubmit}>
            <TextField
                disabled={disabled}
                fullWidth
                multiline
                size='small'
                name='message'
                value={formik.values.message}
                placeholder={disabled ? 'Cannot post comments on completed tasks' : 'Write a comment'}
                InputProps={{
                    sx: {
                        transition: 'padding .3s',
                        fontSize: '14px',
                        pb: isFocused && !disabled ? 6 : undefined,
                    },
                }}
                onChange={formik.handleChange}
                onClick={() => setIsFocused(true)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') formik.handleSubmit();
                }}
                onBlur={() => {
                    if (!formik.values.message) setIsFocused(false);
                }}
            />
            {isFocused && !disabled && (
                <Button
                    size='small'
                    type='submit'
                    variant='contained'
                    disabled={!formik.values.message.length}
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        m: '8.5px 14px',
                    }}>
                    Save
                </Button>
            )}
        </Wrapper>
    );
};

const ModalContent = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 800,
    padding: theme.spacing(3),
    outline: 0,
}));

const Wrapper = styled('form')(() => ({
    position: 'relative',
}));

export default TaskModal;
