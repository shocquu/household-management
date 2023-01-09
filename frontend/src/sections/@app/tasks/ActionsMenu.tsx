import { useState } from 'react';
import { Chip, Collapse, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { gql, useMutation, useQuery } from '@apollo/client';
import Iconify from '../../../components/iconify';
import { Tag } from '../../../types';
import ConfirmDialog from '../../../components/confirm-dialog';
import { USERS_QUERY } from '../../../pages/TasksPage';

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

interface ActionsMenu {
    taskId: number;
    appliedTasks: Tag[];
}

const ActionsMenu = ({ taskId, appliedTasks }: ActionsMenu) => {
    const [expanded, setExpanded] = useState(false);
    const { data, loading, error } = useQuery(TAGS_QUERY);

    const handleClick = () => setExpanded(!expanded);

    const isTagApplied = (taskId: number) => appliedTasks.some((task) => task.id === taskId);

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
            <ListItemButton disableTouchRipple sx={{ color: 'success.dark' }}>
                <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                    <Iconify icon={'eva:done-all-outline'} />
                </ListItemIcon>
                <ListItemText primary='Mark as done' />
            </ListItemButton>

            <RemoveAction taskId={taskId} />

            <ListItemButton disableTouchRipple sx={{ color: 'primary.main' }}>
                <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                    <Iconify icon={'eva:people-outline'} />
                </ListItemIcon>
                <ListItemText primary='Assign to' />
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
    const [removeTask, { error }] = useMutation(REMOVE_TASK_MUTATION, {
        refetchQueries: [{ query: USERS_QUERY }, 'Users'],
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
