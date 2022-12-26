import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import {
    Grid,
    Container,
    Paper,
    Typography,
    Card,
    CardHeader,
    CardContent,
    Box,
    AvatarGroup,
    Avatar,
} from '@mui/material';
import Iconify from '../components/iconify';
import TaskCard from '../sections/@dashboard/tasks/TaskCard';
import POSTS from '../_mock/blog';
import Scrollbar from '../components/scrollbar';
import { Stack } from '@mui/system';
import { gql, useQuery } from '@apollo/client';
import UserPane from '../sections/@dashboard/tasks/UserPane';

const USERS_QUERY = gql`
    query Users {
        users {
            name
            avatar_url
            tasks {
                id
                title
                description
                createdAt
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

export default function DashboardAppPage() {
    const { data, loading } = useQuery(USERS_QUERY);
    const theme = useTheme();

    return (
        <>
            {/* <Helmet title='Dashboard | Minimal UI' /> */}

            <Container
                maxWidth='xl'
                sx={{
                    height: 'calc(100vh - 110px)',
                    pb: theme.spacing(3),
                }}>
                <Grid container spacing={3} wrap='nowrap' height='100%'>
                    {data?.users.map((user, index) => (
                        <Grid key={user.id} item xs={24} sm={12} md={3}>
                            <UserPane user={user} index={index + 1} />
                        </Grid>
                    ))}
                    {/* <Grid item xs={24} sm={12} md={3}>
                        <Paper variant='outlined' sx={{ borderStyle: 'dashed', height: '100%' }}>
                            Add new user
                        </Paper>
                    </Grid> */}
                </Grid>
            </Container>
        </>
    );
}
