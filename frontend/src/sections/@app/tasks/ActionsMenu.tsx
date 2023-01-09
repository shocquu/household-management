import { useState } from 'react';
import { Chip, Collapse, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { gql, useMutation, useQuery } from '@apollo/client';
import Iconify from '../../../components/iconify';
import { Role, Tag, User } from '../../../types';
import ConfirmDialog from '../../../components/confirm-dialog';
import { USERS_QUERY } from '../../../pages/TasksPage';
import useAuth from '../../../hooks/useAuth';
import useAlert from '../../../hooks/useAlert';
import { TASK_QUERY } from './TaskModal';

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
    const [expanded, setExpanded] = useState(false);
    const alert = useAlert();
    const { user } = useAuth();
    const { data } = useQuery(TAGS_QUERY);
    const [updateTask] = useMutation(UPDATE_TASK_MUTATION, {
        refetchQueries: [{ query: TASK_QUERY, variables: { taskId } }],
        update: (cache) => {
            cache.modify({
                fields: {
                    users(cachedUsers: User[] = [], { readField }) {
                        const foundUser = cachedUsers.find((user) => userId === readField('id', user));
                        return { ...cachedUsers, foundUser };
                    },
                },
            });
        },
        onError: (error) => {
            alert.error(error.message);
        },
    });

    const handleClick = () => setExpanded(!expanded);

    const isTagApplied = (taskId: number) => appliedTags.some((tag) => tag.id === taskId);

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
                    <RemoveAction taskId={taskId} />
                    <ListItemButton disableTouchRipple sx={{ color: 'primary.main' }}>
                        <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                            <Iconify icon={'eva:people-outline'} />
                        </ListItemIcon>
                        <ListItemText primary='Assign to' />
                    </ListItemButton>
                </>
            )}

            <ListItemButton disableTouchRipple onClick={handleClick}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                    <Iconify icon={'material-symbols:label-outline'} />
                </ListItemIcon>
                <ListItemText primary='Labels' />
                {expanded ? <ExpandLessIcon fontSize='small' /> : <ExpandMoreIcon fontSize='small' />}
            </ListItemButton>
            <Collapse in={expanded} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                    {data?.tags.map(({ id, label, color }) => (
                        <ListItemButton key={id} sx={{ pl: 4 }}>
                            <Chip
                                size='small'
                                icon={isTagApplied(id) ? <CheckIcon color='inherit' fontSize='inherit' /> : undefined}
                                label={label}
                                sx={{
                                    fontSize: '10px',
                                    p: '1px',
                                    color: 'common.white',
                                    bgcolor: color,
                                }}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Collapse>
        </List>
    );
};

const RemoveAction = ({ taskId }: { taskId: number }) => {
    const [isOpen, setIsOpen] = useState(false);
    const alert = useAlert();
    const [removeTask, { error }] = useMutation(REMOVE_TASK_MUTATION, {
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

export default ActionsMenu;
