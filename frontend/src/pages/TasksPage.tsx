import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Grid, Container } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import TasksColumn from '../sections/@app/tasks/TasksColumn';
import Alert from '../components/alert/Alert';

export const USERS_QUERY = gql`
    query Users {
        users {
            id
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
    const { data, loading } = useQuery(USERS_QUERY);
    const theme = useTheme();

    return (
        <>
            <Helmet title='Tasks | Hovee' />
            <Container
                maxWidth='xl'
                sx={{
                    height: '100%',
                }}>
                <Alert />
                <Grid container spacing={3} wrap='nowrap' height='100%'>
                    {data?.users.map((user, index) => (
                        <Grid key={user.id} item xs={24} sm={12} md={3}>
                            <TasksColumn user={user} index={index + 1} loading={loading} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
};

export default TasksPage;
