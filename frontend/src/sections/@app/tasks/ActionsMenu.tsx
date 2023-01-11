import { MouseEventHandler, useEffect, useState } from 'react';
import {
    alpha,
    Avatar,
    Box,
    Button,
    Chip,
    Collapse,
    darken,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Stack,
    TextField,
    Tooltip,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import CheckIcon from '@mui/icons-material/Check';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { gql, useMutation, useQuery } from '@apollo/client';
import Iconify from '../../../components/iconify';
import { Role, Tag, Task, User } from '../../../types';
import ConfirmDialog from '../../../components/confirm-dialog';
import { USERS_QUERY } from '../../../pages/TasksPage';
import useAuth from '../../../hooks/useAuth';
import useAlert from '../../../hooks/useAlert';
import { TASK_QUERY } from './TaskModal';
import { useAppApolloClient } from '../../../services/apolloClient';
import { AVATARS_BASE_PATH } from '../../../constants';
import { format, parse } from 'date-fns';
import { useFormikContext } from 'formik';
import { getLabelColor } from '../../../utils/getLabelColor';

const TAGS_QUERY = gql`
    query Tags {
        tags {
            label
            color
            id
        }
    }
`;

const REMOVE_TASK_MUTATION = gql`
    mutation RemoveTask($removeTaskId: Int!) {
        removeTask(id: $removeTaskId) {
            id
        }
    }
`;

const UPDATE_TASK_MUTATION = gql`
    mutation UpdateTask($updateTaskInput: UpdateTaskInput!) {
        updateTask(updateTaskInput: $updateTaskInput) {
            id
        }
    }
`;

interface ActionsMenu {
    taskId: number;
    userId: number;
    completed: boolean;
    appliedTags: Tag[];
}

const ActionsMenu = ({ taskId, userId, completed, appliedTags }: ActionsMenu) => {
    const [usersExpanded, setUsersExpanded] = useState(false);
    const [labelsExpanded, setLabelsExpanded] = useState(false);
    const alert = useAlert();
    const { user } = useAuth();
    const { data } = useQuery(TAGS_QUERY);
    const [updateTask] = useMutation(UPDATE_TASK_MUTATION, {
        refetchQueries: [{ query: TASK_QUERY, variables: { taskId } }],
        onError: (error) => {
            alert.error(error.message);
        },
        update: (cache, { data: { task } }) => {
            cache.modify({
                fields: {
                    users(cachedUsers: User[] = [], { readField }) {
                        const foundUser = cachedUsers?.find((user) => userId === readField('id', user));
                        return { ...cachedUsers, foundUser };
                    },
                },
            });
        },
    });

    const client = useAppApolloClient();
    const cache = client.readQuery({
        query: USERS_QUERY,
    });
    const cachedUsers = cache?.users;

    const isTagApplied = (taskId: number) => appliedTags.some((tag) => tag.id === taskId);

    const handleDelete = (tagId: number) => {
        console.info('You clicked the delete icon.', tagId);
    };

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
            <ListItemButton
                disableTouchRipple
                sx={{ color: completed ? 'warning.main' : 'success.dark' }}
                onClick={() => {
                    updateTask({
                        variables: {
                            updateTaskInput: {
                                id: taskId,
                                completed: !completed,
                            },
                        },
                        onCompleted: () => {
                            alert.success(!completed ? 'Marked as completed ' : 'Undone successfully');
                        },
                    });
                }}>
                <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                    <Iconify icon={completed ? 'eva:undo-outline' : 'eva:done-all-outline'} />
                </ListItemIcon>
                <ListItemText primary={completed ? 'Undo done' : 'Mark as done'} />
            </ListItemButton>

            {user.role === Role.Admin && (
                <>
                    <DatePicker disabled={completed} />

                    <RemoveAction taskId={taskId} />

                    <ListItemButton
                        disableTouchRipple
                        sx={{ color: 'primary.dark' }}
                        onClick={() => setUsersExpanded((prevState) => !prevState)}>
                        <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                            <Iconify icon={'eva:people-outline'} />
                        </ListItemIcon>
                        <ListItemText primary='Assign to' />
                        {usersExpanded ? <ExpandLessIcon fontSize='small' /> : <ExpandMoreIcon fontSize='small' />}
                    </ListItemButton>

                    <Collapse in={usersExpanded} timeout='auto' unmountOnExit>
                        <Stack direction='row' flexWrap='wrap' sx={{ ml: 4, mt: 1, gap: 0.5 }}>
                            {cachedUsers
                                ?.filter((user) => user.id !== userId)
                                .map(({ id, displayName, avatarUrl }) => (
                                    <Chip
                                        size='small'
                                        disabled={completed}
                                        icon={
                                            <Avatar
                                                src={AVATARS_BASE_PATH + avatarUrl}
                                                sx={{ width: 18, height: 18 }}
                                            />
                                        }
                                        label={displayName}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                bgcolor: 'secondary.lighter',
                                            },
                                        }}
                                        onClick={() =>
                                            updateTask({
                                                variables: {
                                                    updateTaskInput: {
                                                        id: taskId,
                                                        userId: id,
                                                    },
                                                },
                                                onCompleted: () => {
                                                    alert.success('Task assigned successfully');
                                                },
                                            })
                                        }
                                    />
                                ))}
                        </Stack>
                    </Collapse>
                </>
            )}

            <ListItemButton disableTouchRipple onClick={() => setLabelsExpanded((prevState) => !prevState)}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                    <Iconify icon={'material-symbols:label-outline'} />
                </ListItemIcon>
                <ListItemText primary='Labels' />
                {labelsExpanded ? <ExpandLessIcon fontSize='small' /> : <ExpandMoreIcon fontSize='small' />}
            </ListItemButton>
            <Collapse in={labelsExpanded} timeout='auto' unmountOnExit>
                <Stack direction='row' flexWrap='wrap' sx={{ ml: 4, mt: 1, gap: 0.5 }}>
                    {data?.tags.map(({ id, label, color }) => (
                        <Chip
                            size='small'
                            disabled={completed}
                            label={label}
                            sx={{
                                p: '1px',
                                fontSize: '10px',
                                cursor: 'pointer',
                                color: 'common.white',
                                bgcolor: getLabelColor(color),
                                '&:hover': {
                                    bgcolor: alpha(getLabelColor(color), 0.75),
                                },
                            }}
                            onDelete={
                                isTagApplied(id)
                                    ? (_event) => {
                                          updateTask({
                                              variables: {
                                                  updateTaskInput: {
                                                      id: taskId,
                                                      tags: data?.tags
                                                          .filter((tag) => tag.id !== id)
                                                          .map((tag) => ({
                                                              id: tag.id,
                                                              label: tag.label,
                                                              color: tag.color,
                                                          })),
                                                  },
                                              },
                                              onCompleted: () => {
                                                  alert.success('Label deleted successfully');
                                                  appliedTags = appliedTags.filter((tag) => tag.id !== id);
                                              },
                                              onError: (error) => {
                                                  console.error(error);
                                                  alert.error('An error occured while editing label');
                                              },
                                          });
                                      }
                                    : undefined
                            }
                            onClick={() =>
                                updateTask({
                                    variables: {
                                        updateTaskInput: {
                                            id: taskId,
                                            tags: [
                                                ...data?.tags.map((tag) => ({
                                                    id: tag.id,
                                                    label: tag.label,
                                                    color: tag.color,
                                                })),
                                                { id, label, color },
                                            ],
                                        },
                                    },
                                    onCompleted: () => {
                                        alert.success('Label applied successfully');
                                    },
                                    onError: () => {
                                        alert.error('An error occured while editing label');
                                    },
                                    update: (cache, { data: { task } }) => {
                                        const { tags } = cache.readQuery({ query: TASK_QUERY });
                                        cache.writeQuery({
                                            query: TASK_QUERY,
                                            data: { tags: tags.concat([task]) },
                                        });
                                    },
                                })
                            }
                        />
                    ))}
                </Stack>
            </Collapse>
        </List>
    );
};

const RemoveAction = ({ taskId }: { taskId: number }) => {
    const [isOpen, setIsOpen] = useState(false);
    const alert = useAlert();
    const [removeTask] = useMutation(REMOVE_TASK_MUTATION, {
        refetchQueries: [{ query: USERS_QUERY }, 'Users'],
        onError: () => {
            alert.error('An error occured while deleting the task');
        },
    });

    const onClose = (ok?: boolean) => {
        if (ok) removeTask({ variables: { removeTaskId: taskId } });
        setIsOpen(false);
    };

    const handleOpen = () => setIsOpen(true);

    return (
        <>
            <ListItemButton disableTouchRipple sx={{ color: 'error.main' }} onClick={handleOpen}>
                <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                    <Iconify icon={'eva:trash-2-outline'} />
                </ListItemIcon>
                <ListItemText primary='Delete' />
            </ListItemButton>
            <ConfirmDialog
                open={isOpen}
                title='Are you sure you want to delete this task?'
                content='This action is irreversible'
                onClose={onClose}
            />
        </>
    );
};

const DatePicker = ({ disabled }: { disabled: boolean }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [date, setDate] = useState(format(new Date(), 'MM/dd/yyyy'));
    const [open, setOpen] = useState(false);
    const { setFieldValue } = useFormikContext();

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setFieldValue('dueDate', newDate);
    };

    const handleOpen = (event: any) => {
        setOpen((prevState) => !prevState);
        setAnchorEl(event.currentTarget);
    };

    return (
        <Tooltip
            title={disabled ? 'You cannot set deadline for completed task' : ''}
            PopperProps={{
                placement: 'left',
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, -20],
                        },
                    },
                ],
            }}>
            <span>
                <ListItemButton disableTouchRipple sx={{ color: 'secondary.main' }} disabled={disabled}>
                    <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                        <Iconify icon={'eva:calendar-outline'} />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <DesktopDatePicker
                                open={open}
                                label='Due date'
                                inputFormat='MM/dd/yyyy'
                                minDate={format(new Date(), 'MM/dd/yyyy')}
                                value={date}
                                onClose={() => setOpen(false)}
                                onAccept={handleDateChange}
                                onChange={() => true}
                                PopperProps={{
                                    anchorEl,
                                }}
                                renderInput={({ ref, inputProps, disabled, onChange, value }) => (
                                    <Box ref={ref} onClick={handleOpen}>
                                        <input
                                            style={{ display: 'none' }}
                                            value={String(value)}
                                            onChange={onChange}
                                            disabled={disabled}
                                            {...inputProps}
                                        />
                                        Set due date
                                    </Box>
                                )}
                            />
                        }
                    />
                </ListItemButton>
            </span>
        </Tooltip>
    );
};

export default ActionsMenu;
