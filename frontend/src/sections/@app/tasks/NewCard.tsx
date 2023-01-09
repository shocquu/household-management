import { Dispatch, forwardRef, SetStateAction } from 'react';
import { useFormik } from 'formik';
import { Card, ClickAwayListener, TextField } from '@mui/material';
import { gql, useMutation } from '@apollo/client';
import { USERS_QUERY } from '../../../pages/TasksPage';
import useAlert from '../../../hooks/useAlert';

const ADD_TASK_MUTATION = gql`
    mutation Mutation($createTaskInput: CreateTaskInput!) {
        createTask(createTaskInput: $createTaskInput) {
            title
            id
        }
    }
`;

interface NewCard {
    userId: number;
    setIsAdding: Dispatch<SetStateAction<boolean>>;
}

const NewCard = forwardRef(({ userId, setIsAdding }: NewCard, ref) => {
    const alert = useAlert();
    const [addTask] = useMutation(ADD_TASK_MUTATION, {
        refetchQueries: [{ query: USERS_QUERY }, 'Users'],
        onError: (error) => {
            alert.error(error.message);
        },
    });
    const formik = useFormik({
        initialValues: {
            title: '',
        },
        onSubmit: ({ title }) => {
            addTask({ variables: { createTaskInput: { userId, title } } });
            setIsAdding(false);
        },
    });

    const handleClickAway = () => {
        if (formik.values.title.trim().length > 0) formik.handleSubmit();
        setIsAdding(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <form onSubmit={formik.handleSubmit}>
                <Card key='new-card' elevation={3} sx={{ p: 2, mb: 2, minHeight: 97 }}>
                    <TextField
                        autoFocus
                        multiline
                        inputRef={ref}
                        rows={2}
                        name='title'
                        variant='standard'
                        placeholder='Enter a title for this card'
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') formik.handleSubmit();
                        }}
                        InputProps={{
                            sx: {
                                '&::before': {
                                    content: 'none',
                                },
                                '&::after': {
                                    content: 'none',
                                },
                            },
                        }}
                    />
                </Card>
            </form>
        </ClickAwayListener>
    );
});

export default NewCard;
