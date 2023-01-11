import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Grid, Container } from '@mui/material';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import TasksColumn from '../sections/@app/tasks/TasksColumn';
import Alert from '../components/alert/Alert';
import { useEffect, useState } from 'react';

export const USERS_QUERY = gql`
    query Users {
        users {
            id
            username
            displayName
            avatarUrl
            tasks {
                id
                title
                dueDate
                createdAt
                description
                completed
                comments {
                    message
                }
                tags {
                    label
                    color
                }
            }
        }
    }
`;

const TasksPage = () => {
    const [getUsers, { data, loading, called }] = useLazyQuery(USERS_QUERY, {
        fetchPolicy: 'cache-first',
    });

    useEffect(() => {
        if (!called) getUsers();
    }, []);

    return (
        <>
            <Helmet title='Tasks | Hovee' />
            <Container
                maxWidth='4xl'
                sx={{
                    height: '100%',
                }}>
                <Alert />
                <Grid container spacing={3} wrap='nowrap' height='100%'>
                    {data?.users.map((user, index) => (
                        <Grid key={user.id} item>
                            <TasksColumn user={user} index={index + 1} loading={loading} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
};

export default TasksPage;
